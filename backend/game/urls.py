from django.urls import path
from .views import PlayerListCreateView, PlayerDetailView, GameScoreListCreateView, GameScoreDetailView, GameDataListCreateView, GameDataDetailView

urlpatterns = [
    path('players/', PlayerListCreateView.as_view(), name='player-list'),
    path('players/<int:pk>/', PlayerDetailView.as_view(), name='player-detail'),
    path('scores/', GameScoreListCreateView.as_view(), name='gamescore-list'),
    path('scores/<int:pk>/', GameScoreDetailView.as_view(), name='gamescore-detail'),
    path('game-data/', GameDataListCreateView.as_view(), name='game-data-list'),
    path('game-data/<int:pk>/', GameDataDetailView.as_view(), name='game-data-detail'),
]
