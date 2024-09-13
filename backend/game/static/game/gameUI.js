class GameUI {
    constructor(startGameCallback, restartGameCallback) {
        this.cssRenderer = new THREE.CSS3DRenderer();
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);

        // Find the game container where the UI will be added
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.cssRenderer.domElement);
        } else {
            console.error('Game container not found');
        }

        // Create Start button
        this.startButton = document.createElement('button');
        this.startButton.innerText = 'Start Game';
        this.startButton.className = 'start-button';
        this.startButton.style.position = 'absolute';
        this.startButton.style.top = '50%';
        this.startButton.style.left = '50%';
        this.startButton.style.transform = 'translate(-50%, -50%)';
        this.startButton.addEventListener('click', () => {
            startGameCallback();  // Call the start game method from Game class
            this.hideStartButton();
        });

        document.body.appendChild(this.startButton);

        // Create Restart button (initially hidden)
        this.restartButton = document.createElement('button');
        this.restartButton.innerText = 'Restart Game';
        this.restartButton.className = 'restart-button';
        this.restartButton.style.position = 'absolute';
        this.restartButton.style.top = '50%';
        this.restartButton.style.left = '50%';
        this.restartButton.style.transform = 'translate(-50%, -50%)';
        this.restartButton.style.display = 'none';  // Hide by default
        this.restartButton.addEventListener('click', () => {
            restartGameCallback();  // Call the reset game method from Game class
            this.hideRestartButton();
        });

        document.body.appendChild(this.restartButton);
    }

    hideStartButton() {
        this.startButton.style.display = 'none';
    }

    showRestartButton() {
        this.restartButton.style.display = 'block';
    }

    hideRestartButton() {
        this.restartButton.style.display = 'none';
    }

    render(camera) {
        this.cssRenderer.render(this.scene, camera);
    }
}
