from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Users(AbstractUser):
    user_name = models.CharField(max_length=50)
    user_email = models.EmailField()
    user_level = models.DecimalField(max_digits=5, decimal_places=2)
    user_type = models.CharField(max_length=50)
    user_status = models.CharField(max_length=50)
    user_created_on = models.DateTimeField(auto_now_add=True)
    user_updated_on = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True, default='profile_pictures/default.jpg')

    def __str__(self):
        return f"User - ${self.id} ${self.user_name}"