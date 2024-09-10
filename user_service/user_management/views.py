from .models import Users
from rest_framework import viewsets
from .serializers import UsersSerializer 

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
