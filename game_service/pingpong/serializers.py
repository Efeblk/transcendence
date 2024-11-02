from rest_framework import serializers
from .models import GameData
class GameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        fields = ['id', 'player', 'player2', 'opponent', 'player_score', 'timestamp', 'winner']
