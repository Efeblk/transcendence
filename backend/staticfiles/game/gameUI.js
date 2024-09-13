class GameUI {
    constructor(startCallback, resetCallback) {
        // Save the start and reset callbacks
        this.startCallback = startCallback;
        this.resetCallback = resetCallback;

        // Create and store references to the buttons
        this.createStartButton();
        this.createRestartButton();
    }

    createStartButton() {
        // Create the start button
        this.playButton = document.createElement('button');
        this.playButton.innerText = 'Start Game';
        this.playButton.className = 'game-button start-button';  // Add a class for styling
        this.playButton.onclick = () => {
            this.startCallback();
            this.hidePlayButton();
        };

        // Insert the button into the DOM
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.playButton);
        }
    }

    createRestartButton() {
        // Create the restart button (initially hidden)
        this.restartButton = document.createElement('button');
        this.restartButton.innerText = 'Restart Game';
        this.restartButton.className = 'game-button restart-button';  // Add a class for styling
        this.restartButton.style.display = 'none';  // Initially hidden
        this.restartButton.onclick = () => {
            this.resetCallback();
        };

        // Insert the button into the DOM
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.restartButton);
        }
    }

    showRestartButton() {
        this.restartButton.style.display = 'block';  // Show the restart button
    }

    hideRestartButton() {
        this.restartButton.style.display = 'none';  // Hide the restart button
    }

    hidePlayButton() {
        this.playButton.style.display = 'none';  // Hide the play button after the game starts
    }

    render(camera) {
        // If you need to update or render any UI elements dynamically, do it here.
        // Currently, the buttons are static.
    }
}
