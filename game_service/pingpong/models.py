from django.db import models

class GameData(models.Model):
    player = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    opponent = models.IntegerField()
    player_score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    winner = models.CharField(max_length=100)  # Can be 'Player' or 'AI'
    tournament = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Game - Player: {self.player}, Opponent Score: {self.opponent}, Player Score: {self.player_score}, Winner: {self.winner}"
