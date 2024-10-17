from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def zombie_game_view(request):
    print("Serving the game view...")
    return render(request, 'zombie_game/zombie_game.html')  # Render the game view

def game_starter_script(request):
    # This is a dynamically served script, but in production you can serve a static version
    script = """
    (function () {
        console.log("Fetching and starting the game...");

        // Path to the texture
        // Automatically initialize the game using the Game class
        const game = new ZombieGame();

        console.log("Game started successfully.");
    })();
    """
    return HttpResponse(script, content_type='application/javascript')