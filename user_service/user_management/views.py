from .models import Users
from rest_framework import generics
from django.shortcuts import render
from .serializers import UsersSerializer 

class UsersViewSet(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

def profile_view(request):
    return render(request, 'profile/profile.html')

