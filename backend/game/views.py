from rest_framework import generics
from .models import GameData
from .serializers import GameDataSerializer
from django.shortcuts import render


# View to list all saved game data and create new game data
class GameDataListCreateView(generics.ListCreateAPIView):
    queryset = GameData.objects.all().order_by('-timestamp')  # Orders by most recent game
    serializer_class = GameDataSerializer

# View to retrieve, update, or delete specific game data
class GameDataDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameData.objects.all()
    serializer_class = GameDataSerializer

def game_view(request):
    return render(request, 'game/game.html')