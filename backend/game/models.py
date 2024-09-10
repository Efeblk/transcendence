from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class GameScore(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.IntegerField()
    opponent = models.CharField(max_length=100)  # You can reference another player model if needed
    game_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player} - {self.score} points"

class GameData(models.Model):
    player = models.CharField(max_length=100)
    ai_score = models.IntegerField()
    player_score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    winner = models.CharField(max_length=100)  # Can be 'Player' or 'AI'

    def __str__(self):
        return f"Game - Player: {self.player}, AI Score: {self.ai_score}, Player Score: {self.player_score}, Winner: {self.winner}"
