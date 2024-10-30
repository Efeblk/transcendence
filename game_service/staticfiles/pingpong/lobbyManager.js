class LobbyManager {
    constructor() {
        this.socket = new WebSocket(`wss://192.168.221.131/ws/lobby/`); // Adjust as necessary
        this.lobbies = [];
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data); // Delegate message handling
        };

        this.socket.onopen = () => {
            console.log("Connected to the lobby WebSocket.");
        };

        this.socket.onclose = () => {
            console.log("Disconnected from the lobby WebSocket.");
        };
    }

    handleServerMessage(data) {
        if (data.action === 'lobbyCreated') {
            console.log(`Lobby "${data.lobby.name}" created successfully.`);
            this.updateLobby(data.lobby); // Update the newly created lobby
        } else if (data.action === 'lobbyUpdated') {
            this.updateLobby(data.lobby); // Update an existing lobby with the latest data
        } else if (data.error) {
            console.error(data.error); // Log any error messages received
        } else {
            this.lobbies = data.lobbies || []; // Initialize or update lobbies list on connect
            this.displayLobbies(); // Display the updated list of lobbies
        }
    }

    createLobby(name, capacity, owner) {
        this.socket.send(JSON.stringify({ action: 'create_lobby', name, capacity, owner }));
    }

    joinLobby(name) {
        this.socket.send(JSON.stringify({ action: 'join_lobby', name }));
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

