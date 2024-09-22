from .models import Users
from rest_framework import generics
from django.shortcuts import render
from .serializers import UsersSerializer
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
        user = Users.objects.create_user(user_name=name , user_nick=username, user_email=email, user_password=password)
        user.save()

        return JsonResponse({'success': True, 'message': 'User created successfully!'})

def profile_view(request):
    return render(request, 'profile/profile.html')

