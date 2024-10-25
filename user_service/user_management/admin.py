from django.contrib import admin
from .models import Users, Friendship
# Register your models here.

admin.site.register(Friendship)
admin.site.register(Users)