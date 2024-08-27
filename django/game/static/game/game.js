class Game {
    constructor() {
        this.scene = new THREE.Scene();

        const aspectRatio = gameConfig.camera.aspectRatio;
        this.camera = new THREE.PerspectiveCamera(gameConfig.camera.fov, aspectRatio, 0.1, 1000);
        this.camera.position.set(gameConfig.camera.position.x, gameConfig.camera.position.y, gameConfig.camera.position.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(gameConfig.renderer.width, gameConfig.renderer.height);
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);

        this.table = new Table(this.scene);
        this.player = new Player(this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);  // Player paddle
        this.aiPaddle = new Paddle(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);  // AI paddle
        this.ball = new Ball(this.scene);  // Ball

        this.setupLights();
        this.setupControls();

        this.isRunning = true;  // Track if the game is running

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
        if (!this.isRunning) return;  // Stop animation if the game is not running

        requestAnimationFrame(() => this.animate());

        this.player.update();  // Update player paddle movement
        this.ball.update();  // Update ball movement
        this.updateAIPaddle();  // Update AI paddle movement

        this.checkCollisions();  // Check for collisions between ball and paddles
        this.checkScore();  // Check if someone scored

        this.renderer.render(this.scene, this.camera);
    }

    updateAIPaddle() {
        const aiSpeed = 0.05;  // AI speed factor (lower values = smoother but slower movement)
        const ballX = this.ball.mesh.position.x;
        const aiPaddleX = this.aiPaddle.mesh.position.x;
    
        // Interpolate AI paddle position towards the ball's position
        this.aiPaddle.mesh.position.x += (ballX - aiPaddleX) * aiSpeed;
    }

    checkCollisions() {
        if (this.ball.isCollidingWith(this.player.getPaddle())) {
            this.ball.bounce();
        }

        if (this.ball.isCollidingWith(this.aiPaddle)) {
            this.ball.bounce();
        }
    }

    checkScore() {
        if (this.ball.isOutOfBounds()) {
            this.endGame();
        }
    }

    endGame() {
        this.isRunning = false;  // Stop the game
        document.getElementById('restartButton').style.display = 'block';  // Show the restart button
    }

    reset() {
        this.ball.reset();  // Reset the ball to its initial position
        this.player.getPaddle().mesh.position.x = 0;  // Reset player paddle position
        this.aiPaddle.mesh.position.x = 0;  // Reset AI paddle position
        this.isRunning = true;  // Restart the game
        this.animate();  // Restart the animation loop
    }

    start() {
        this.animate();
    }
}
