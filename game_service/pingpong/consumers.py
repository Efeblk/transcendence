import json
from channels.generic.websocket import AsyncWebsocketConsumer
from . import lobbies  # Import the global lobbies list

class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['lobby_name']
        self.room_group_name = f'lobby_{self.room_name}'

        # Join lobby group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send the current state of the lobbies to the user
        await self.send(text_data=json.dumps({'lobbies': lobbies}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'create_lobby':
            await self.create_lobby(data)
        elif action == 'join_lobby':
            await self.join_lobby(data)

    async def create_lobby(self, data):
        lobby_name = data['name']
        creator = self.scope['user'].username

        # Check if lobby already exists
        if any(lobby['name'] == lobby_name for lobby in lobbies):
            await self.send(text_data=json.dumps({'error': 'Lobby already exists!'}))
            return

        # Create the new lobby
        new_lobby = {'name': lobby_name, 'creator': creator, 'players': [creator], 'capacity': data['capacity']}
        lobbies.append(new_lobby)

        # Notify all users in the lobby group about the new lobby
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'lobby_updated',
                'lobby': new_lobby
            }
        )

    async def join_lobby(self, data):
        lobby_name = data['name']
        player = self.scope['user'].username

        # Find the lobby
        lobby = next((lobby for lobby in lobbies if lobby['name'] == lobby_name), None)
        if lobby:
            if lobby['capacity'] > len(lobby['players']):
                lobby['players'].append(player)
                # Notify all users in the lobby group about the updated lobby
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'lobby_updated',
                        'lobby': lobby
                    }
                )
            else:
                await self.send(text_data=json.dumps({'error': 'Lobby is full!'}))
        else:
            await self.send(text_data=json.dumps({'error': 'Lobby does not exist!'}))

    async def lobby_updated(self, event):
        lobby = event['lobby']
        await self.send(text_data=json.dumps({'lobby': lobby}))
