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

class Friendship(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friendships')
    friend = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friends')

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f'{self.user} is friends with {self.friend}'


#user_a = User.objects.create(username='UserA')
#user_b = User.objects.create(username='UserB')

# Create a friendship
#Friendship.objects.create(user=user_a, friend=user_b)
#Friendship.objects.create(user=user_b, friend=user_a)  # Bidirectional

