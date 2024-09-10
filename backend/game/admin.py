from django.contrib import admin
from .models import GameData  # Correct model import

# Register the GameData model with the admin site
@admin.register(GameData)
class GameDataAdmin(admin.ModelAdmin):
    list_display = ['player', 'ai_score', 'player_score', 'winner', 'timestamp']
    search_fields = ['player', 'winner']
