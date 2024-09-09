class Game {
    constructor(texturePath) {
        // Initialize the scene
        this.scene = new THREE.Scene();

        // Camera setup
        const aspectRatio = gameConfig.camera.aspectRatio;
        this.camera = new THREE.PerspectiveCamera(gameConfig.camera.fov, aspectRatio, 0.1, 1000);
        this.camera.position.set(gameConfig.camera.position.x, gameConfig.camera.position.y, gameConfig.camera.position.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(gameConfig.renderer.width, gameConfig.renderer.height);
        document.body.appendChild(this.renderer.domElement);  // Render to the body (or a specific element if needed)

        // Game objects
        this.table = new Table(this.scene, texturePath);  // Table object with texture
        this.player = new Player(this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);  // Player paddle
        this.aiPaddle = new Paddle(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);  // AI paddle
        this.ball = new Ball(this.scene);  // Ball object

        // Setup lights and controls
        this.setupLights();
        this.setupControls();

        // Game state
        this.playerScore = 0;
        this.aiScore = 0;
        this.maxScore = 3;

        this.isRunning = true;  // Game running state

        // Start animation loop
        this.animate();
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
        if (!this.isRunning) return;  // Stop animation if game is not running

        requestAnimationFrame(() => this.animate());

        this.player.update();  // Update player paddle
        this.ball.update();  // Update ball
        this.updateAIPaddle();  // Update AI paddle

        this.checkCollisions();  // Check for paddle and ball collisions
        this.checkScore();  // Check if someone scored

        // Optionally update UI for ball speed, spin, and scores
        if (document.getElementById('ballSpeed')) {
            document.getElementById('ballSpeed').innerText = this.ball.speed.toFixed(2);
        }
        if (document.getElementById('playerScore')) {
            document.getElementById('playerScore').innerText = this.playerScore;
        }
        if (document.getElementById('aiScore')) {
            document.getElementById('aiScore').innerText = this.aiScore;
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    updateAIPaddle() {
        const aiSpeed = 0.05;
        const ballX = this.ball.mesh.position.x;
        const aiPaddleX = this.aiPaddle.mesh.position.x;

        this.aiPaddle.mesh.position.x += (ballX - aiPaddleX) * aiSpeed;  // Move AI paddle towards ball
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
                this.aiScore++;  // AI scores
            } else {
                this.playerScore++;  // Player scores
            }

            // Reset the ball for the next round
            this.ball.reset();

            // Check if someone won
            if (this.playerScore >= this.maxScore || this.aiScore >= this.maxScore) {
                this.endGame();
            }
        }
    }

    endGame() {
        this.isRunning = false;  // Stop the game
        let winner = this.playerScore > this.aiScore ? "Player" : "AI";
        // Optionally save score or handle UI here

        if (document.getElementById('restartButton')) {
            document.getElementById('restartButton').style.display = 'block';  // Show restart button
        }
    }

    reset() {
        this.ball.reset();  // Reset ball
        this.player.getPaddle().mesh.position.x = 0;  // Reset player paddle position
        this.aiPaddle.mesh.position.x = 0;  // Reset AI paddle position
        this.playerScore = 0;  // Reset player score
        this.aiScore = 0;  // Reset AI score

        // Clear winner text if needed
        if (document.getElementById('winner')) {
            document.getElementById('winner').innerText = '';
        }

        this.isRunning = true;  // Restart game
        this.animate();  // Restart animation
    }

    start() {
        this.animate();  // Start the animation loop
    }
}
