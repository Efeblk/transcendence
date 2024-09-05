# game/serializers.py
from rest_framework import serializers
from game.models import GameScore

class GameScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScore
        fields = ['player', 'score']

