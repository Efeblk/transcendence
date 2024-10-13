import json
from .models import Users, Friendship
from rest_framework import generics
from django.shortcuts import render, get_object_or_404
from .serializers import UsersSerializer
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer


class UsersViewSet(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

def signup_view(request):
    return render(request, 'user_service/signup.html')

def login_view(request):
    return render(request, 'user_service/login.html')
    
def search_view(request):
    return render(request, 'user_service/search.html')

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
            user_level=1.0,
            user_type='normal',
            user_status='active'
        )
        user.save()

        return JsonResponse({'success': True, 'message': 'User created successfully!'})

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

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

        # Check the password
        if check_password(password, user.password):
            tokens = get_tokens_for_user(user)
            return JsonResponse({'success': True, 'message': 'Login successful', 'access_token': tokens['access'], 'refresh_token': tokens['refresh']}, status=200)
        else:
            return JsonResponse({'message': 'Invalid username or password.'}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def profile_view(request):
    friends_count = Friendship.objects.filter(user=request.user, status='accepted').count()
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
def user_profile(request, username):
    # Retrieve the user by their username
    user = get_object_or_404(Users, username=username)
    context = {
        'profile_user': user,
        'user': request.user
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

    if created:
        return Response({'message': 'Friend request sent'}, status=201)
    else:
        return Response({'message': 'Friend request already sent'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend(request, username):
    user = request.user
    friend = get_object_or_404(Users, username=username)

    # Find the friendship and update the status
    try:
        friendship = Friendship.objects.get(user=friend, friend=user)
        friendship.status = 'accepted'
        friendship.save()
        return Response({'message': 'Friend request accepted'}, status=200)
    except Friendship.DoesNotExist:
        return Response({'message': 'Friend request not found'}, status=404)

