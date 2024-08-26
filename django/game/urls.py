from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),         # Root URL shows index.html
    path('play/', views.game_view, name='game'), # URL for game.html
]
