from rest_framework import serializers
from .models import GameData
class GameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        fields = ['id', 'player', 'opponent', 'player_score', 'timestamp', 'winner']
