class Game {
    constructor(texturePath) {
        this.scene = new THREE.Scene();

        const aspectRatio = gameConfig.camera.aspectRatio;
        this.camera = new THREE.PerspectiveCamera(
            gameConfig.camera.fov, 
            aspectRatio, 
            0.1, 
            1000
        );
        this.camera.position.set(
            gameConfig.camera.position.x, 
            gameConfig.camera.position.y, 
            gameConfig.camera.position.z
        );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(gameConfig.renderer.width, gameConfig.renderer.height);

        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.renderer.domElement);
        } else {
            console.error('Game container not found');
        }

        this.table = new Table(this.scene, texturePath);
        this.player = new Player(this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);
        this.opponent = null; // Placeholder for opponent (AI or Player 2)
        this.ball = new Ball(this.scene);

        this.setupLights();
        this.setupControls();

        this.playerScore = 0;
        this.aiScore = 0;
        this.maxScore = 3;
        this.isRunning = false; // Game starts as not running

        this.api = new GameAPI();

        // Initialize GameUI with start and reset callbacks
        this.gameUI = new GameUI(this.start.bind(this), this.reset.bind(this));
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(
            gameConfig.lighting.ambientLight.color, 
            gameConfig.lighting.ambientLight.intensity
        );
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(
            gameConfig.lighting.directionalLight.color, 
            gameConfig.lighting.directionalLight.intensity
        );
        directionalLight.position.set(
            gameConfig.lighting.directionalLight.position.x, 
            gameConfig.lighting.directionalLight.position.y, 
            gameConfig.lighting.directionalLight.position.z
        );
        this.scene.add(directionalLight);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => this.player.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.player.handleKeyUp(event));
    }

    setupControlsOpponent() {
        document.addEventListener('keydown', (event) => this.opponent.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.opponent.handleKeyUp(event));
    }

    destroyControlsOpponent() {
        document.removeEventListener('keydown', (event) => this.opponent.handleKeyDown(event));
        document.removeEventListener('keyup', (event) => this.opponent.handleKeyUp(event));
    }

    removeOpponent() {
        if (this.opponent) {
            // Remove the paddle mesh from the scene
            this.scene.remove(this.opponent.getPaddle().mesh);

            // Dispose of the geometry and material to free resources
            this.opponent.getPaddle().mesh.geometry.dispose();
            this.opponent.getPaddle().mesh.material.dispose();

            // Set opponent to null
            this.opponent = null;
        }
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        this.player.update();
        this.ball.update();

        if (this.opponent) {
            this.opponent.update(this.ball); // Update AI or player 2
        }

        this.checkCollisions();
        this.checkScore();

        this.renderer.render(this.scene, this.camera);
    }

    checkCollisions() {
        if (this.ball.isCollidingWith(this.player.getPaddle())) {
            this.player.hitBall(this.ball);
            this.ball.bounce();
            console.log('Player hit the ball, speed:', this.ball.speed);
        }

        if (this.opponent && this.ball.isCollidingWith(this.opponent.getPaddle())) {
            this.ball.bounce();
            console.log('Opponent hit the ball, speed:', this.ball.speed);
        }
    }

    checkScore() {
        if (this.ball.isOutOfBounds()) {
            if (this.ball.mesh.position.z > 0) {
                this.aiScore++;
            } else {
                this.playerScore++;
            }

            this.ball.reset();

            if (this.playerScore >= this.maxScore || this.aiScore >= this.maxScore) {
                this.endGame();
            }
        }
    }

    endGame() {
        this.isRunning = false;
        const winner = this.playerScore > this.aiScore ? "Player" : "Opponent";

        this.api.saveGameData('Player 1', this.aiScore, this.playerScore, winner)
            .then(data => console.log('Game result saved:', data))
            .catch(error => console.error('Error saving game result:', error));

        this.gameUI.showRestartButton(); // Show the restart button at the end of the game
        
    }

    reset() {
        this.ball.reset();
        this.player.getPaddle().mesh.position.x = 0;
        if (this.opponent) this.opponent.getPaddle().mesh.position.x = 0;
        this.playerScore = 0;
        this.aiScore = 0;
    }

    start(mode) {
        if (this.isRunning) {
            console.log('Game is already running!');
            return;
        }
        this.removeOpponent();
        // Setup opponent based on the selected mode
        if (mode === 'player') {
            console.log('Starting Player vs Player mode...');
            this.opponent = new Player(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai, 'player2');
            this.setupControlsOpponent();
        } else {
            console.log('Playing against AI...');
            this.opponent = new AIpaddle(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);
            // Set AI difficulty
            if (['easy', 'medium', 'hard'].includes(mode)) {
                this.opponent.setDifficulty(mode);
                console.log(`AI difficulty set to ${mode}`);
            }
            this.destroyControlsOpponent();
        }

        this.reset();
        this.isRunning = true;
        this.animate(); // Start the animation loop
    }
}
