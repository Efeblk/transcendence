from django.db import models

class Game(models.Model):
    player_name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game by {self.player_name} - Score: {self.score}"
