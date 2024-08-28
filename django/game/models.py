# game/models.py
from django.db import models

class GameScore(models.Model):
    player = models.CharField(max_length=100)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.player} - {self.score}'
