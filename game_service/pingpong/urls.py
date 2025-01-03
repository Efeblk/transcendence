from django.urls import path
from .views import GameDataListCreateView, GameDataDetailView, PlayerGameDataView, game_view, game_starter_script

urlpatterns = [
    path('game-data/', GameDataListCreateView.as_view(), name='game-data-list'),
    path('game-data/<int:pk>/', GameDataDetailView.as_view(), name='game-data-detail'),
    path('game-data/<str:player>/', PlayerGameDataView.as_view(), name='player-game-data'),  # Updated
    path('pingpong/', game_view, name='game'),
    path('start', game_starter_script, name='game-starter-script'),
]
