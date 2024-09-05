from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import GameScore

class GameScoreAPITests(APITestCase):
    def test_create_game_score(self):
        url = reverse('gamescore-list')  # Ensure your view uses 'gamescore-list' name in the URL configuration
        data = {'player': 'John Doe', 'score': 5}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_game_scores(self):
        url = reverse('gamescore-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
