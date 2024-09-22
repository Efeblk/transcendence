from .models import Users
from rest_framework import generics
from django.shortcuts import render
from .serializers import UsersSerializer
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
import json

class UsersViewSet(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('newName')
        username = data.get('newUsername')
        email = data.get('newEmail')
        password = data.get('newPassword')

        # Check if the username or email already exists
        if Users.objects.filter(user_nick=username).exists():
            return JsonResponse({'success': False, 'message': 'Username already exists'})
        if Users.objects.filter(user_email=email).exists():
            return JsonResponse({'success': False, 'message': 'Email already exists'})

        # Create a new user
        user = Users.objects.create(
            user_name=name,
            user_nick=username,
            user_email=email,
            user_password=make_password(password),
            user_level=1.0,
            user_type='normal',
            user_status='active'
        )
        user.save()

        return JsonResponse({'success': True, 'message': 'User created successfully!'})

def login(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')

        try:
            user = Users.objects.get(user_nick=username)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'Invalid username or password.'}, status=400)

        # Check the password
        if check_password(password, user.user_password):
            # Optionally, create a session or return a token
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'message': 'Invalid username or password.'}, status=400)



def profile_view(request):
    return render(request, 'profile/profile.html')

