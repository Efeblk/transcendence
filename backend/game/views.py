from django.shortcuts import render
from django.http import JsonResponse
from .models import Game

def game_data_api(request):
    # Just some example data - you can send whatever data your frontend needs
    data = {
        'message': 'This is the game data',
        'game_content': '3D game with Three.js',
        'instructions': 'Use the arrow keys to move the camera.'
    }
    return JsonResponse(data)
