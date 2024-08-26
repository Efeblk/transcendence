from django.shortcuts import render
from .models import Match

def index(request):
    matches = Match.objects.all().order_by('-played_at')
    return render(request, 'game/index.html', {'matches': matches})

def game_view(request):
    return render(request, 'game/game.html')