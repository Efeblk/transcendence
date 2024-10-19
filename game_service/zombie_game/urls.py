from django.urls import path, include
from .views import zombie_game_view, game_starter_script

urlpatterns = [
    path('zombie_game/', zombie_game_view),  # Include the game API routes
    path('start', game_starter_script, name='game-starter-script'),
]
