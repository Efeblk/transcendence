from django.urls import path
from .views import GameDataListCreateView, GameDataDetailView, game_view, game_starter_script

urlpatterns = [
    path('game-data/', GameDataListCreateView.as_view(), name='game-data-list'),
    path('game-data/<int:pk>/', GameDataDetailView.as_view(), name='game-data-detail'),
    path('game/', game_view, name='game'),
    path('start', game_starter_script, name='game-starter-script'),
]
