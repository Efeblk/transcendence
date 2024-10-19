from rest_framework import generics
from .models import GameData
from .serializers import GameDataSerializer
from django.shortcuts import render
from django.http import HttpResponse

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


def game_starter_script(request):
    # This is a dynamically served script, but in production you can serve a static version
    script = """
    (function () {
        console.log("Fetching and starting the game...");

        // Path to the texture
        const texturePath = '/static/pingpong/textures/table.jpg';  
        
        // Automatically initialize the game using the Game class
        const game = new Game(texturePath);

        console.log("Game started successfully.");
    })();
    """
    return HttpResponse(script, content_type='application/javascript')