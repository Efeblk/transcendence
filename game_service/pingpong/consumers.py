import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GlobalLobbiesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.global_group_name = 'global_lobbies'
        
        # Join the global lobbies group
        await self.channel_layer.group_add(
            self.global_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Optionally, send the initial list of lobbies to the client
        await self.send(text_data=json.dumps({
            'message': 'Connected to global lobbies',
            'action': 'initial_lobbies',
            'lobbies': await self.get_initial_lobbies()  # Replace with actual lobby data
        }))

    async def disconnect(self, close_code):
        # Leave the global lobbies group
        await self.channel_layer.group_discard(
            self.global_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'create_lobby':
            # Broadcast new lobby creation to all clients
            lobby_data = {
                'name': data['name'],
                'capacity': data['capacity'],
                'owner': data['owner'],
                'players': [data['owner']]
            }
            await self.channel_layer.group_send(
                self.global_group_name,
                {
                    'type': 'lobby_update',
                    'lobby': lobby_data,
                    'action': 'lobbyCreated'
                }
            )

    async def lobby_update(self, event):
        # Send the updated lobby data to the WebSocket
        await self.send(text_data=json.dumps(event))

    async def get_initial_lobbies(self):
        # Placeholder function to get the initial list of lobbies (if any)
        return [
            {"name": "Example Lobby 1", "capacity": 2, "owner": "player1", "players": ["player1"]},
            {"name": "Example Lobby 2", "capacity": 4, "owner": "player2", "players": ["player2"]}
        ]


class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.lobby_name = self.scope['url_route']['kwargs']['lobby_name']
        self.lobby_group_name = f'lobby_{self.lobby_name}'
        
        # Join the specific lobby group
        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the specific lobby group
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        
        # Broadcast message to the lobby group
        await self.channel_layer.group_send(
            self.lobby_group_name,
            {
                'type': 'lobby_message',
                'message': message
            }
        )

    async def lobby_message(self, event):
        # Send a message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
