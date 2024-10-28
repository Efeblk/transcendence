class GameUI {
    constructor(startCallback, resetCallback) {
        // Save the start and reset callbacks
        this.startCallback = startCallback;
        this.resetCallback = resetCallback;

        // Create and store references to the buttons
        this.createStartButton();
        this.createRestartButton();
        this.createAIorPlayerButtons();
        this.createDifficultyButtons();
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

    createAIorPlayerButtons() {
        // Create AI and Player buttons
        this.aiButton = this.createButton('Play Against AI', 'game-button ai-button', () => {
            this.showDiffultyButtons();
            this.hideAIorPlayerButtons();
        });

        this.playerButton = this.createButton('Player vs Player', 'game-button player-button', () => {
            this.startCallback('player'); // Start player vs player mode
            this.hideAIorPlayerButtons();
        });

        this.tournementButton = this.createButton('Tournement', 'game-button tournement-button', () => {
            this.startCallback('tournement'); // it will start tourneament mode, for now its player
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
