from django.db import models

class GameData(models.Model):
    player = models.CharField(max_length=100)
    ai_score = models.IntegerField()
    player_score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    winner = models.CharField(max_length=100)  # Can be 'Player' or 'AI'

    def __str__(self):
        return f"Game - Player: {self.player}, AI Score: {self.ai_score}, Player Score: {self.player_score}, Winner: {self.winner}"
