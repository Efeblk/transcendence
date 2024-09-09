from django.urls import path
from . import views

urlpatterns = [
    path('api/game/', views.game_data_api, name='game-data-api'),  # This is where the frontend fetches data
]
