class GameUI {
    constructor(startCallback, resetCallback, player) {
        // Save the start and reset callbacks
        this.startCallback = startCallback;
        this.resetCallback = resetCallback;
        this.currentLobby = null; // Initialize currentLobby to track the created lobby

        // Create and store references to the buttons
        this.createStartButton();
        this.createRestartButton();
        this.createAIorPlayerButtons(player);
        this.createDifficultyButtons();

    }
    
    setupSocketEvents() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse the incoming WebSocket message
            
            if (data.action === 'lobbyCreated') {
                console.log(`Lobby "${data.lobby.name}" created successfully.`); // Log success message
                this.currentLobby = data.lobby; // Set the current lobby
                this.waitForOpponent(); // Call waitForOpponent immediately
            } else if (data.error) {
                console.error(data.error); // Log any error messages received
            } else if (data.lobby) {
                this.updateLobby(data.lobby); // Update the current lobby state
            } else {
                this.lobbies = data.lobbies; // If the message contains a list of lobbies, update the state
            }
        };
    }

    updateLobby(lobby) {
        // Update the current lobby's state based on the server response
        this.currentLobby = lobby;
        console.log(`Updated lobby: ${this.currentLobby.name}, Players: ${this.currentLobby.players.length}/${this.currentLobby.capacity}`);
    }
    
    
    createButton(text, className, onClick) {
        // Helper method to create a button element
        const button = document.createElement('button');
        button.innerText = text;
        button.className = className;
        button.onclick = onClick;
        return button;
    }
    
    createStartButton() {
        // Create the start button
        this.startButton = this.createButton('Start Game', 'game-button start-button', () => {
            this.showAIorPlayerButtons();
            this.hidePlayButton();
        });
        
        // Insert the button into the DOM
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.startButton);
        }
    }
    
    createAIorPlayerButtons(player) {
        // Create AI and Player buttons
        this.aiButton = this.createButton('Play Against AI', 'game-button ai-button', () => {
            this.showDiffultyButtons();
            this.hideAIorPlayerButtons();
        });

        this.playerButton = this.createButton('Player vs Player', 'game-button player-button', () => {
            const lobbyName = prompt("Enter the lobby name:");
            if (!lobbyName) return; // Check if the lobby name is not empty
        
            // Create LobbyManager instance if not already done, to manage all lobbies
            if (!this.lobbyManager) {
                this.lobbyManager = new LobbyManager();
            }
            
            // Request to create a new lobby
            this.lobbyManager.createLobby(lobbyName, 2, player);
        
            // Create an instance of Lobby for managing the specific lobby
            this.lobby = new Lobby(
                lobbyName,
                player,
                this.startCallback.bind(this),
                this.hideAIorPlayerButtons.bind(this)
            );
        
            console.log(`Lobby "${lobbyName}" requested to be created. Waiting for an opponent...`);        
            
            //this.startCallback('player'); // Start player vs player mode
            //this.hideAIorPlayerButtons();
            
        });

        this.tournementButton = this.createButton('Tournement', 'game-button tournement-button', () => {
            this.startCallback('tournament'); // it will start tourneament mode, for now its player
            this.hideAIorPlayerButtons();
        });

        // Insert the buttons into the DOM
        const aiOrPlayerContainer = document.getElementById('AIorPlayerContainer');
        if (aiOrPlayerContainer) {
            aiOrPlayerContainer.appendChild(this.aiButton);
            aiOrPlayerContainer.appendChild(this.playerButton);
            aiOrPlayerContainer.appendChild(this.tournementButton);
        } else {
            console.error('AI or Player container not found');
        }
        this.hideAIorPlayerButtons();
    }

    async waitForOpponent() {
        console.log(`Waiting for players to join the lobby "${this.currentLobby.name}"...`);

        return new Promise((resolve) => {
            // Listen for lobby updates from the server
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data); // Parse the incoming WebSocket message

                if (data.action === 'lobbyUpdated' && data.lobby.name === this.currentLobby.name) {
                    this.currentLobby.players = data.lobby.players; // Update players in the current lobby

                    if (this.currentLobby.isFull()) {
                        console.log(`All players have joined. Starting the game in lobby "${this.currentLobby.name}"...`);
                        resolve(); // Proceed with starting the game
                    } else {
                        console.log(`Current players in lobby: (${this.currentLobby.players.length}/${this.currentLobby.capacity})`);
                    }
                }
            };
        });
    }    

    createDifficultyButtons() {
        // Create difficulty buttons
        this.easyButton = this.createButton('Easy', 'game-button easy-button', () => {
            this.startCallback('easy');
            this.hideDifficultyButtons();
        });

        this.mediumButton = this.createButton('Medium', 'game-button medium-button', () => {
            this.startCallback('medium');
            this.hideDifficultyButtons();
        });

        this.hardButton = this.createButton('Hard', 'game-button hard-button', () => {
            this.startCallback('hard');
            this.hideDifficultyButtons();
        });

        // Insert the buttons into the DOM
        const difficultyContainer = document.getElementById('difficultyContainer');
        if (difficultyContainer) {
            difficultyContainer.appendChild(this.easyButton);
            difficultyContainer.appendChild(this.mediumButton);
            difficultyContainer.appendChild(this.hardButton);
        } else {
            console.error('Difficulty container not found');
        }
        this.hideDifficultyButtons();
    }

    createRestartButton() {
        // Create the restart button (initially hidden)
        this.restartButton = this.createButton('Restart Game', 'game-button restart-button', () => {
            this.resetCallback(); // Call the reset callback
            this.showAIorPlayerButtons();
            this.hideRestartButton();
        });

        // Initially hide the restart button
        this.restartButton.style.display = 'none';

        // Insert the button into the DOM
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.restartButton);
        }
        this.hideRestartButton();
    }

    // Utility methods to show/hide UI elements
    hidePlayButton() {
        this.startButton.style.display = 'none';
    }

    showAIorPlayerButtons() {
        if (this.aiButton) this.aiButton.style.display = 'block';
        if (this.playerButton) this.playerButton.style.display = 'block';
        if (this.tournementButton) this.tournementButton.style.display = 'block';
    }

    hideAIorPlayerButtons() {
        if (this.aiButton) this.aiButton.style.display = 'none';
        if (this.playerButton) this.playerButton.style.display = 'none';
        if (this.tournementButton) this.tournementButton.style.display = 'none';
    }

    hideDifficultyButtons() {
        if (this.easyButton) this.easyButton.style.display = 'none';
        if (this.mediumButton) this.mediumButton.style.display = 'none';
        if (this.hardButton) this.hardButton.style.display = 'none';
    }

    showRestartButton() {
        if (this.restartButton) this.restartButton.style.display = 'block';
    }

    hideRestartButton() {
        if (this.restartButton) this.restartButton.style.display = 'none';
    }

    showDiffultyButtons() {
        if (this.easyButton) this.easyButton.style.display = 'block';
        if (this.mediumButton) this.mediumButton.style.display = 'block';
        if (this.hardButton) this.hardButton.style.display = 'block';
    }
    
    render(camera) {
        // If you need to update or render any UI elements dynamically, do it here.
        // Currently, the buttons are static.
    }
}
