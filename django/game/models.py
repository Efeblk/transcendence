from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Match(models.Model):
    player1 = models.ForeignKey(Player, related_name='player1_matches', on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name='player2_matches', on_delete=models.CASCADE)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(Player, related_name='won_matches', on_delete=models.SET_NULL, null=True, blank=True)
    played_at = models.DateTimeField(auto_now_add=True)

    def determine_winner(self):
        if self.player1_score > self.player2_score:
            self.winner = self.player1
        elif self.player2_score > self.player1_score:
            self.winner = self.player2
        else:
            self.winner = None

    def save(self, *args, **kwargs):
        self.determine_winner()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.player1} vs {self.player2}"
