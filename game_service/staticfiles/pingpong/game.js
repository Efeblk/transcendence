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
        this.opponent = null;
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

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        this.player.update();
        this.ball.update();

        if (this.opponent) {
            this.opponent.update(this.ball); // Update AI paddle if present
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

        if (this.opponent && this.ball.isCollidingWith(this.opponent)) {
            this.ball.bounce();
            console.log('AI hit the ball, speed:', this.ball.speed);
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
        const winner = this.playerScore > this.aiScore ? "Player" : "AI";

        this.api.saveGameData('Player 1', this.aiScore, this.playerScore, winner)
            .then(data => console.log('Game result saved:', data))
            .catch(error => console.error('Error saving game result:', error));

        this.gameUI.showRestartButton(); // Show the restart button at the end of the game
    }

    reset() {
        this.ball.reset();
        this.player.getPaddle().mesh.position.x = 0;
        if (this.opponent) this.opponent.mesh.position.x = 0; // Reset AI paddle position
        this.playerScore = 0;
        this.aiScore = 0;
    }

    start(mode) {
        if (this.isRunning) {
            console.log('Game is already running!');
            return;
        }

        // Setup based on the selected mode
        if (mode === 'player') {
            console.log('Starting Player vs Player mode...');
            this.opponent = null; // No AI in player vs player mode
        } else {
            console.log('Playing against AI...');
            if (!this.opponent) {
                this.opponent = new AIpaddle(
                    this.scene, 
                    gameConfig.paddle.positionZ.ai, 
                    gameConfig.paddle.color.ai
                );
            }
        }

        // Set AI difficulty if AI mode is selected
        if (['easy', 'medium', 'hard'].includes(mode) && this.opponent) {
            switch (mode) {
                case 'easy':
                    this.opponent.setDifficulty('easy');
                    break;
                case 'medium':
                    this.opponent.setDifficulty('medium');
                    break;
                case 'hard':
                    this.opponent.setDifficulty('hard');
                    break;
            }
            console.log(`Game started in ${mode} mode with AI speed: ${this.opponent.speed}`);
        }

        this.reset();
        this.isRunning = true;
        this.animate(); // Start the animation loop
    }
}
