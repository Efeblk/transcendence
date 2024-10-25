from django.db import models
from django.db.models import Q, F
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Users(AbstractUser):
    user_name = models.CharField(max_length=50)
    user_email = models.EmailField()
    user_level = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    user_type = models.CharField(max_length=50)
    user_status = models.CharField(max_length=50)
    user_created_on = models.DateTimeField(auto_now_add=True)
    user_updated_on = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True, default='profile_pictures/default.jpg')
    two_fa_code = models.CharField(max_length=6, null=True, blank=True)
    user_grade = models.CharField(max_length=25, default="Fifth wheel")
    user_skillsjson = models.JSONField(null=True, blank=True)
    user_location = models.CharField(max_length=25, default="Earth")
    user_wallet = models.IntegerField(default = 0)
    user_imagejson = models.JSONField(null=True, blank=True)
    user_phone = models.CharField(null=True, max_length=100)

    def __str__(self):
        return f"User - ${self.id} ${self.user_name}"

class Friendship(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    )

    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friendships')
    friend = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friends')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'friend'],
                name='unique_friendship',
                condition=Q(user__lt=F('friend'))
            ),
        ]
    def __str__(self):
        return f'{self.user} is friends with {self.friend}'


class EmailVerificationCode(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        # Check if the code is still valid (e.g., valid for 10 minutes)
        return (timezone.now() - self.created_at).total_seconds() < 600


