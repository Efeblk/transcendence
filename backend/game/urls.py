from django.urls import path
from .views import GameDataListCreateView, GameDataDetailView, game_view

urlpatterns = [
    path('game-data/', GameDataListCreateView.as_view(), name='game-data-list'),
    path('game-data/<int:pk>/', GameDataDetailView.as_view(), name='game-data-detail'),
    path('game/', game_view, name='game'),
]
