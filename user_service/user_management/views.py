import json
import os
import secrets
import requests
import urllib.parse
from .models import Users, Friendship
from .serializers import UsersSerializer, OnlineUsersSerializer
from rest_framework import generics
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from django.core.signing import Signer
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
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

@csrf_exempt
def send_2fa_code_game(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        nickname = body.get('nickname')
        
        # Verify if user exists
        try:
            user = Users.objects.get(username=nickname)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username'}, status=400)
        
        # Generate a 6-digit 2FA code and save it to the user's record
        code = get_random_string(length=6, allowed_chars='0123456789')
        user.two_fa_code = code
        user.save()

        # Send the 2FA code to the user's email
        subject = 'Your 2FA Code'
        message = f'Your one-time code is: {code}'
        from_email = settings.DEFAULT_FROM_EMAIL

        send_mail(subject, message, from_email, [user.user_email])
        
        return JsonResponse({'message': '2FA code sent.'}, status=200)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)



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
def check_2fa_code_game(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        nickname = body.get('nickname')
        code_entered = body.get('code')

        # Validate user and 2FA code
        try:
            user = Users.objects.get(username=nickname)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username.'}, status=400)
        
        if code_entered == user.two_fa_code:
            return JsonResponse({'success': True, 'message': '2FA code verified.'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid 2FA code.'}, status=400)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)


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
        
        # First login step
        if check_password(password, user.password):
            send_2fa_code(user)  # Send the 2FA code
            return JsonResponse({'success': True, 'message': '2FA code sent to email. Enter the code to continue.'}, status=200)
        
        return JsonResponse({'message': 'Invalid username or password.'}, status=400)
    
    return JsonResponse({'message': 'Invalid request method.'}, status=400)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def profile_view(request):
    request.user.user_status = 'online'
    request.user.save()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            wins = sum(1 for game in data if game.get('winner') == request.user.username)
            losses = sum(1 for game in data if game.get('winner') != request.user.username and 
                         (game.get('player') == request.user.username or game.get('player2') == request.user.username))

            context = {
                'user': request.user,
                'game_data': data,
                'wins': wins,
                'losses': losses,
            }

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Geçersiz JSON verisi'}, status=400)
    else:
        context = {
            'user': request.user,
            'game_data': {},
        }

    friends_count = Friendship.objects.filter(
        (Q(user=request.user) | Q(friend=request.user)),
        status='accepted'
    ).distinct().count()
    pending_requests_count = Friendship.objects.filter(friend=request.user, status='pending').count()

    context.update({
        'friends': friends_count,
        'requests': pending_requests_count,
    })

    return Response(context, template_name='user_service/profile.html')


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def edit_profile_view(request):
    context = {
        'user': request.user,
    }
    return Response(context, template_name='user_service/edit_profile.html')


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@renderer_classes([TemplateHTMLRenderer])
def user_profile(request, username):
    # Retrieve the user by their username
    profile_user = get_object_or_404(Users, username=username)
    user = request.user  # The logged-in user
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            wins = sum(1 for game in data if game.get('winner') == username)
            losses = sum(1 for game in data if game.get('winner') != username and 
                         (game.get('player') == username or game.get('player2') == username))

            context = {
                'game_data': data,
                'wins': wins,
                'losses': losses,
            }

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Geçersiz JSON verisi'}, status=400)
    else:
        context = {
            'game_data': {},
        }


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

    context.update({
        'profile_user': profile_user,
        'user': user,
        'action': action
    })
    
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
        # Try to get the friendship from the request user's perspective
        friendship = Friendship.objects.get(user=request.user, friend=friend_id, status='accepted')
        friendship.delete()
        return Response({'message': 'Friend is unfriended.'}, status=200)
    except Friendship.DoesNotExist:
        # If not found, try from the friend's perspective
        try:
            friendship = Friendship.objects.get(user=friend_id, friend=request.user, status='accepted')
            friendship.delete()
            return Response({'message': 'Friend is unfriended.'}, status=200)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship not found.'}, status=404)


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

def save_image(user_data, user):
    large_image_url = user_data.get('image', {}).get('versions', {}).get('large')
    
    if large_image_url:
        try:
            response = requests.get(large_image_url)
            response.raise_for_status()

            image_content = ContentFile(response.content)

            user.profile_picture.save(f"{user.username}_large.jpg", image_content)
            user.save()

            return True
        except requests.RequestException as e:
            print(f"Error downloading image: {e}")
            return False
    else:
        print("Large image URL not found.")
        return False 

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
            'user_status': 'online',  # Varsayılan olarak 'active' durum
        }
    )
    save_image(user_data, user)
    return redirect(f"/#/login-success?username={user_data['login']}")

@csrf_exempt
def login42(request):
    if request.method == 'POST':
        state = secrets.token_urlsafe(32)
        request.session['oauth_state'] = state

        try:
            body = json.loads(request.body)
            username = body.get('username')

            if not username:
                return JsonResponse({'message': 'Username is required.'}, status=400)

            user = Users.objects.get(username=username)
            tokens = get_tokens_for_user(user)
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
            }, status=200)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data.'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=405)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    user = request.user
    data = request.data

    user.user_name = data.get('username', user.user_name)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getuser(request):
    try:
        user_data = {
            'user': request.user.username,  # user_name tam adı, username ise unique kullanıcı adı
        }
        return JsonResponse(user_data, status=200)
    except Exception as e:
        print(f"Error in getuser view: {e}")  # Log the error
        return JsonResponse({'error': 'Internal server error'}, status=500)

class UsersViewSetOnline(generics.ListCreateAPIView):
    serializer_class = OnlineUsersSerializer

    def get_queryset(self):
        return Users.objects.filter(user_status='online')


def get_data_from_url(url):
    try:
        with urllib.request.urlopen(url) as response:
            data = response.read()  # Read the response data
            # If the response is JSON, decode it
            json_data = json.loads(data.decode("utf-8"))
            return json_data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None