from rest_framework import viewsets
from .serializers import GameScoreSerializer
from game.models import GameScore

class GameScoreViewSet(viewsets.ModelViewSet):
    queryset = GameScore.objects.all()
    serializer_class = GameScoreSerializer
