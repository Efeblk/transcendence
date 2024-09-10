from rest_framework import serializers
from .models import Player, GameScore, GameData

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'email']

class GameScoreSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()

    class Meta:
        model = GameScore
        fields = ['id', 'player', 'score', 'opponent', 'game_date']

class GameDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        fields = ['id', 'player', 'ai_score', 'player_score', 'timestamp', 'winner']
