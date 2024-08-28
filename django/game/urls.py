from django.urls import path
from .views import pingpong_view, home_view

urlpatterns = [
    path('pingpong/', pingpong_view, name='pingpong'),
    path('', home_view, name='home'),
]
