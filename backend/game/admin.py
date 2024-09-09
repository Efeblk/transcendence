from django.contrib import admin
from .models import Game

# Register the Game model
@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score', 'level', 'timestamp')
    search_fields = ('player_name',)
