import json
import os
from .models import Users, Friendship, EmailVerificationCode
from django.db.models import Q
from .serializers import UsersSerializer
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from django.core.signing import Signer
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

class UsersViewSet(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

def signup_view(request):
    return render(request, 'user_service/signup.html')

def login_view(request):
    return render(request, 'user_service/login.html')
    
def search_view(request):
    return render(request, 'user_service/search.html')

def verify_2fa_view(request):
    return render(request, 'user_service/enter_2fa_code.html')

def send_2fa_code(user):
    # Generate a random 6-digit code
    code = get_random_string(length=6, allowed_chars='0123456789')
    user.two_fa_code = code  # Store the code in the model
    user.save()
    
    subject = 'Your 2FA Code'
    message = f'Your one-time code is: {code}'
    from_email = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, from_email, [user.user_email])


def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('newName')
        username = data.get('newUsername')
        email = data.get('newEmail')
        password = data.get('newPassword')

        # Check if the username or email already exists
        if Users.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username already exists'})
        if Users.objects.filter(user_email=email).exists():
            return JsonResponse({'success': False, 'message': 'Email already exists'})

        # Create a new user
        user = Users.objects.create(
            user_name=name,
            username=username,
            user_email=email,
            password=make_password(password),
            user_level=0.0,
            user_type='normal',
            user_status='offline'
        )
        user.save()

        return JsonResponse({'success': True, 'message': 'User created successfully! Please check your email to verify your account.'})

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@csrf_exempt
def check_2fa_code(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        code_entered = body.get('code')  # Only get this if it's a 2FA step
        try:
            user = Users.objects.get(username=username)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username or password.'}, status=400)
        if code_entered == user.two_fa_code:
            tokens = get_tokens_for_user(user)
            user.user_status = "online"
            user.save()
            return JsonResponse({'success': True, 'message': 'Login successful', 'access_token': tokens['access'], 'refresh_token': tokens['refresh']}, status=200)
        else:
            return JsonResponse({'message': 'Invalid 2FA code.'}, status=400)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')

        try:
            user = Users.objects.get(username=username)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username or password.'}, status=400)
        
        # First login step
        if check_password(password, user.password):
            send_2fa_code(user)  # Send the 2FA code
            return JsonResponse({'success': True, 'message': '2FA code sent to email. Enter the code to continue.'}, status=200)
        
        return JsonResponse({'message': 'Invalid username or password.'}, status=400)
    
    return JsonResponse({'message': 'Invalid request method.'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def profile_view(request):

    friends_count = Friendship.objects.filter(
        (Q(user=request.user) | Q(friend=request.user)),
        status='accepted'
    ).distinct().count()

    pending_requests_count = Friendship.objects.filter(friend=request.user, status='pending').count()

    context = {
        'user': request.user,
        'friends': friends_count,
        'requests': pending_requests_count,
    }
    return Response(context, template_name='user_service/profile.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def edit_profile_view(request):
    context = {
        'user': request.user,
    }
    return Response(context, template_name='user_service/edit_profile.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def user_profile(request, username):
    # Retrieve the user by their username
    profile_user = get_object_or_404(Users, username=username)
    user = request.user  # The logged-in user

    # Check the status of the friendship
    friendship = Friendship.objects.filter(
        (Q(user=user) & Q(friend=profile_user)) | (Q(user=profile_user) & Q(friend=user))
    ).first()

    # Determine the action based on the friendship status
    if friendship is None:
        action = 'add_friend'  # No friendship exists
    elif friendship.status == 'declined':
        action = 'add_friend'  # Friendship was declined
    elif friendship.status == 'pending' and friendship.user == profile_user:
        action = 'pending'  # There is a pending request from profile_user
    elif friendship.status == 'accepted':
        action = 'accepted'  # There is a pending request from profile_user
    else:
        action = 'none'  # Friendship is accepted

    context = {
        'profile_user': profile_user,
        'user': user,
        'action': action
    }
    
    return Response(context, template_name='user_service/user_profile.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def search_people(request):
    query = request.GET.get('q', '').strip()  # Get 'q' query parameter and strip spaces

    # Search for users whose username contains the query (case-insensitive)
    results = Users.objects.filter(username__icontains=query)
    
    return Response({'results': results, 'query': query}, template_name='user_service/search_results.html')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friend(request):
    data = request.data
    username = data.get('username')
    friend = Users.objects.get(username=username)
    user = request.user  # The logged-in user

    friendship, created = Friendship.objects.get_or_create(user=user, friend=friend)

    if friendship:
        if friendship.status == 'declined':
            friendship.status = 'pending'
            friendship.save()
            created = True

    if created:
        return Response({'message': 'Friend request sent'}, status=201)
    else:
        return Response({'message': 'Friend request already sent'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def list_friend_requests(request):
    pending_requests = Friendship.objects.filter(friend=request.user, status='pending')
    context = {
        'requests': pending_requests  # Passing the queryset directly
    }
    return Response(context, template_name='user_service/friend_requests.html')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def friends(request):
    friends = Friendship.objects.filter(
        (Q(user=request.user) | Q(friend=request.user)),
        status='accepted'
    ).distinct()
    
    context = {
        'friends': friends,
        'user': request.user  # Passing the queryset directly
    }
    return Response(context, template_name='user_service/friends.html')


# Accept a friend request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, friend_id):
    try:
        friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='pending')
        friendship.status = 'accepted'
        friendship.save()
        return Response({'message': 'Friend request accepted'}, status=201)
    except Friendship.DoesNotExist:
        return Response({'error': 'Friend request not found'}, status=404)

# Decline a friend request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_friend_request(request, friend_id):
    try:
        friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='pending')
        friendship.status = 'declined'
        friendship.save()
        return Response({'message': 'Friend request declined'}, status=201)
    except Friendship.DoesNotExist:
        return Response({'error': 'Friend request not found'}, status=404)


# unfirend a friend
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfriend_friend(request, friend_id):
    try:
        friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='accepted')
        friendship.delete()
        return Response({'message': 'Friend is unfriended.'}, status=204)
    except Friendship.DoesNotExist:
        return Response({'error': 'Friendship is not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    user = request.user
    data = request.data

    user.username = data.get('username', user.username)
    user.user_email = data.get('user_email', user.user_email)
    if 'profile_picture' in request.FILES:
        profile_picture = request.FILES['profile_picture']
        if profile_picture.size > 2 * 1024 * 1024:  # 2MB in bytes
            return Response({'error': 'File size must be less than 2MB.'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete the old profile picture if it's not the default
        if user.profile_picture.name != 'profile_pictures/default.jpg':
            old_picture_path = os.path.join(settings.MEDIA_ROOT, user.profile_picture.name)
            if os.path.isfile(old_picture_path):
                os.remove(old_picture_path)

        user.profile_picture = profile_picture
    
    user.save()

    return Response({'message': 'Profile updated successfully'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.user_status = "offline"
        request.user.save()
        return Response({'message': 'You logged out.'}, status=200)
    except Friendship.DoesNotExist:
        return Response({'error': 'You could not log out'}, status=500)

