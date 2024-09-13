class Game {
    constructor(texturePath) {
        this.scene = new THREE.Scene();

        const aspectRatio = gameConfig.camera.aspectRatio;
        this.camera = new THREE.PerspectiveCamera(gameConfig.camera.fov, aspectRatio, 0.1, 1000);
        this.camera.position.set(gameConfig.camera.position.x, gameConfig.camera.position.y, gameConfig.camera.position.z);
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
        this.aiPaddle = new Paddle(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);
        this.ball = new Ball(this.scene);

        this.setupLights();
        this.setupControls();

        this.playerScore = 0;
        this.aiScore = 0;
        this.maxScore = 3;

        this.isRunning = false;  // Initially set to false

        this.api = new GameAPI();
        
        // Initialize the GameUI class with both start and restart callbacks
        this.gameUI = new GameUI(this.start.bind(this), this.reset.bind(this));
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(gameConfig.lighting.ambientLight.color, gameConfig.lighting.ambientLight.intensity);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(gameConfig.lighting.directionalLight.color, gameConfig.lighting.directionalLight.intensity);
        directionalLight.position.set(gameConfig.lighting.directionalLight.position.x, gameConfig.lighting.directionalLight.position.y, gameConfig.lighting.directionalLight.position.z);
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
        this.updateAIPaddle();

        this.checkCollisions();
        this.checkScore();

        this.renderer.render(this.scene, this.camera);
    }

    updateAIPaddle() {
        const aiSpeed = 0.05;
        const ballX = this.ball.mesh.position.x;
        const aiPaddleX = this.aiPaddle.mesh.position.x;

        this.aiPaddle.mesh.position.x += (ballX - aiPaddleX) * aiSpeed;
    }

    checkCollisions() {
        if (this.ball.isCollidingWith(this.player.getPaddle())) {
            this.player.hitBall(this.ball);
            this.ball.bounce();
        }

        if (this.ball.isCollidingWith(this.aiPaddle)) {
            this.ball.bounce();
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
        let winner = this.playerScore > this.aiScore ? "Player" : "AI";

        this.api.saveGameData('Player 1', this.aiScore, this.playerScore, winner)
            .then(data => {
                console.log('Game result saved:', data);
            })
            .catch(error => {
                console.error('Error saving game result:', error);
            });

        this.gameUI.showRestartButton();  // Show the restart button when game ends
    }

    reset() {
        this.ball.reset();
        this.player.getPaddle().mesh.position.x = 0;
        this.aiPaddle.mesh.position.x = 0;
        this.playerScore = 0;
        this.aiScore = 0;

        this.isRunning = true;
        this.gameUI.hideRestartButton();  // Hide the restart button when the game restarts
        this.animate();
    }

    start() {
        console.log('Game started...');
        this.isRunning = true;
        this.animate();
    }
}
