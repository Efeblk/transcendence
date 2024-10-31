class Lobby {
    constructor(lobbyName, player, startCallback, hideButtonsCallback) {
        this.lobbyName = lobbyName;
        this.player = player;
        this.startCallback = startCallback;
        this.hideButtonsCallback = hideButtonsCallback;
        this.socket = new WebSocket(`wss://192.168.221.131/ws/lobby/${lobbyName}/`); // Connect to the specific lobby WebSocket
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.action === 'lobbyUpdated') {
                const playersInLobby = data.lobby.players.length;
                const capacity = data.lobby.capacity;

                if (playersInLobby >= capacity) {
                    console.log(`All players have joined lobby "${this.lobbyName}". Starting the game...`);
                    this.startCallback('player'); // Start the game
                    this.hideButtonsCallback(); // Hide the AI/Player selection buttons
                } else {
                    console.log(`Current players in lobby "${this.lobbyName}": ${playersInLobby}/${capacity}`);
                }
            }
        };

        this.socket.onopen = () => {
            console.log(`Connected to the WebSocket for lobby: ${this.lobbyName}`);
        };

        this.socket.onclose = () => {
            console.log(`Disconnected from the WebSocket for lobby: ${this.lobbyName}`);
        };
    }
}
