import json
from .models import Users, Friendship
from rest_framework import generics
from django.shortcuts import render, get_object_or_404, redirect
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
from django.db.models import Q
from django.conf import settings
import requests
import urllib.parse
import secrets
from django.contrib.auth import login


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
def login_(request):
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

@csrf_exempt
def fortytwo_login(request):
    state = secrets.token_urlsafe(32)
    request.session['oauth_state'] = state

    params = {
        'client_id': settings.FORTYTWO_CLIENT_ID,
        'redirect_uri': settings.FORTYTWO_REDIRECT_URI,
        'response_type': 'code',
        'state': state,
        'scope': 'public'
    }

    auth_url = f"{settings.FORTYTWO_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return JsonResponse({'auth_url': auth_url})

def fortytwo_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    
    # Verify state to prevent CSRF
    if state != request.session.get('oauth_state'):
        return JsonResponse({'error': 'Invalid state parameter'}, status=400)
    
    # Exchange code for access token
    token_response = requests.post(settings.FORTYTWO_TOKEN_URL, data={
        'client_id': settings.FORTYTWO_CLIENT_ID,
        'client_secret': settings.FORTYTWO_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.FORTYTWO_REDIRECT_URI,
        'grant_type': 'authorization_code'
    })
    
    if not token_response.ok:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=400)
    
    access_token = token_response.json()['access_token']
    
    # Get user info from 42 API
    user_response = requests.get(settings.FORTYTWO_USER_URL, headers={
        'Authorization': f'Bearer {access_token}'
    })
    
    if not user_response.ok:
        return JsonResponse({'error': 'Failed to get user info'}, status=400)
    
    user_data = user_response.json()
    cursus_users = user_data.get('cursus_users', [])
    if len(cursus_users) >= 2:
        s = cursus_users[1]
    else:
        s = cursus_users[0]
    campus = user_data.get('campus', [])
    c = campus[0]
    
    # Create or get user
# friendship, created = Friendship.objects.get_or_create(user=user, friend=friend)

    user, created = Users.objects.get_or_create(
        id=user_data['id'],  # 42 API'den alınan benzersiz kullanıcı kimliği
        defaults={
            'username': user_data['login'],
            'user_name': user_data['displayname'],
            'first_name' : user_data['first_name'],
            'last_name' : user_data['last_name'],
            'email': user_data.get('email', ''),
            'user_email': user_data.get('email', ''),
            'user_level': s.get('level'),
            'user_grade': s.get('grade'),
            'user_skillsjson' : s.get('skills'),
            'user_location' : c.get('name'),
            'user_wallet' : user_data.get('wallet'),
            'user_imagejson' : user_data.get('image'),
            'user_phone' : user_data.get('phone'),
            'user_created_on': user_data.get('created_at', ''),
            'user_updated_on': user_data.get('updated_at', ''),
            'user_type': 'normal',  # Varsayılan olarak 'standard' tip
            'user_status': 'active',  # Varsayılan olarak 'active' durum
        }
    )
    
    # Log the user in
    login(request, user)

    # request.session['access_token'] = access_token

    # return redirect('/#/login-success')
    return redirect(f"/#/login-success?access_token={access_token}")