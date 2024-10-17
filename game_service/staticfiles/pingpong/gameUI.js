class GameUI {
    constructor(startCallback, resetCallback) {
        // Save the start and reset callbacks
        this.startCallback = startCallback;
        this.resetCallback = resetCallback;

        // Create and store references to the buttons
        this.createStartButton();
        this.createRestartButton();
    }

    createdDifficultyButtons() {
        // Create the difficulty buttons
        this.easyButton = document.createElement('button');
        this.easyButton.innerText = 'Easy';
        this.easyButton.className = 'game-button easy-button';  // Add a class for styling
        this.easyButton.onclick = () => {
            this.startCallback("easy");
            this.hideDifficultyButtons();
        };

        this.mediumButton = document.createElement('button');
        this.mediumButton.innerText = 'Medium';
        this.mediumButton.className = 'game-button medium-button';  // Add a class for styling
        this.mediumButton.onclick = () => {
            this.startCallback("medium");
            this.hideDifficultyButtons();
        };

        this.hardButton = document.createElement('button');
        this.hardButton.innerText = 'Hard';
        this.hardButton.className = 'game-button hard-button';  // Add a class for styling
        this.hardButton.onclick = () => {
            this.startCallback("hard");
            this.hideDifficultyButtons();
        };

        // Insert the buttons into the DOM
        const gameContainer = document.getElementById('difficultyContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.easyButton);
            gameContainer.appendChild(this.mediumButton);
            gameContainer.appendChild(this.hardButton);
        }
    }

    hideDifficultyButtons() {
        this.easyButton.style.display = 'none';  // Hide the difficulty buttons after the game starts
        this.mediumButton.style.display = 'none';
        this.hardButton.style.display = 'none';
    }

    createStartButton() {
        // Create the start button
        this.playButton = document.createElement('button');
        this.playButton.innerText = 'Start Game';
        this.playButton.className = 'game-button start-button';  // Add a class for styling
        this.playButton.onclick = () => {
            this.createdDifficultyButtons();
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
            this.createdDifficultyButtons();
            this.hideRestartButton();
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
