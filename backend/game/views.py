from rest_framework import generics
from .models import Player, GameScore, GameData
from .serializers import PlayerSerializer, GameScoreSerializer, GameDataSerializer

# API to list all players or create a new player
class PlayerListCreateView(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

# API to retrieve, update, or delete a single player
class PlayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

# API to list all game scores or create a new game score
class GameScoreListCreateView(generics.ListCreateAPIView):
    queryset = GameScore.objects.all()
    serializer_class = GameScoreSerializer

# API to retrieve, update, or delete a single game score
class GameScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameScore.objects.all()
    serializer_class = GameScoreSerializer

# View to list all saved game data and create new game data
class GameDataListCreateView(generics.ListCreateAPIView):
    queryset = GameData.objects.all().order_by('-timestamp')  # Orders by most recent game
    serializer_class = GameDataSerializer

# View to retrieve, update, or delete specific game data
class GameDataDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameData.objects.all()
    serializer_class = GameDataSerializer