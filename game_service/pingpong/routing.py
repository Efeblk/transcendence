from django.urls import path
from pingpong.consumers import GlobalLobbiesConsumer, LobbyConsumer

websocket_urlpatterns = [
    path("ws/lobbies/", GlobalLobbiesConsumer.as_asgi()),  # Route for global lobbies
    path("ws/lobby/<str:lobby_name>/", LobbyConsumer.as_asgi()),  # Route for individual lobby
]
