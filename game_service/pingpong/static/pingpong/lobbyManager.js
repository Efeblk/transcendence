class LobbyManager {
    constructor() {
        this.socket = new WebSocket(`wss://192.168.221.131/ws/lobbies/`); // Connect to global lobbies WebSocket
        this.lobbies = [];
        this.isSocketOpen = false;
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.socket.onopen = () => {
            this.isSocketOpen = true;
            console.log("Connected to the global lobbies WebSocket.");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.lobbies) {
                // Handle initial lobbies list or updates to lobbies
                this.lobbies = data.lobbies;
                this.displayLobbies();
            } else if (data.lobbyUpdated) {
                this.updateLobby(data.lobbyUpdated);
            } else if (data.error) {
                console.error(data.error);
            }
        };

        this.socket.onclose = () => {
            this.isSocketOpen = false;
            console.log("Disconnected from the global lobbies WebSocket.");
        };
    }

    createLobby(name, capacity, owner) {
        const lobbyData = JSON.stringify({ action: 'create_lobby', name, capacity, owner });

        if (this.isSocketOpen) {
            // If the socket is open, send immediately
            this.socket.send(lobbyData);
        } else {
            // If the socket is still connecting, wait for it to open
            this.socket.onopen = () => {
                this.isSocketOpen = true;
                this.socket.send(lobbyData);
            };
        }
    }

    updateLobby(lobby) {
        const index = this.lobbies.findIndex(l => l.name === lobby.name);
        if (index > -1) {
            this.lobbies[index] = lobby; // Update existing lobby
        } else {
            this.lobbies.push(lobby); // Add new lobby
        }
        this.displayLobbies();
    }

    displayLobbies() {
        console.clear();
        console.log("Active Lobbies:");
        this.lobbies.forEach(lobby => {
            console.log(`Lobby: ${lobby.name}, Creator: ${lobby.creator}, Players: ${lobby.players.join(', ')}`);
        });
    }
}