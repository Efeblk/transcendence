from rest_framework import serializers
from .models import GameData
class GameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        fields = ['id', 'player', 'ai_score', 'player_score', 'timestamp', 'winner']
