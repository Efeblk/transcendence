# serializers.py
from .models import Users
from rest_framework import serializers

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'  # Tüm alanları kullanmak için
