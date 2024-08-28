class Game {
    constructor(texturePath) {
        this.scene = new THREE.Scene();

        const aspectRatio = gameConfig.camera.aspectRatio;
        this.camera = new THREE.PerspectiveCamera(gameConfig.camera.fov, aspectRatio, 0.1, 1000);
        this.camera.position.set(gameConfig.camera.position.x, gameConfig.camera.position.y, gameConfig.camera.position.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(gameConfig.renderer.width, gameConfig.renderer.height);
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);

        this.table = new Table(this.scene, texturePath);  // Pass the texturePath to the Table class
        this.player = new Player(this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);
        this.aiPaddle = new Paddle(this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);
        this.ball = new Ball(this.scene);

        this.setupLights();
        this.setupControls();

        this.playerScore = 0;  // Player's score
        this.aiScore = 0;  // AI's score
        this.maxScore = 3;  // Points to win

        this.isRunning = true;

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
    
        // Update debug information on the screen
        document.getElementById('ballSpeed').innerText = this.ball.speed.toFixed(2);  // Display actual speed
        document.getElementById('ballSpin').innerText = this.ball.spin.toFixed(2);
        document.getElementById('playerScore').innerText = this.playerScore;  // Display player's score
        document.getElementById('aiScore').innerText = this.aiScore;  // Display AI's score
    
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
            this.player.hitBall(this.ball);  // Apply spin based on player movement
            this.ball.bounce();
        }

        if (this.ball.isCollidingWith(this.aiPaddle)) {
            this.ball.bounce();
        }
    }

    checkScore() {
        if (this.ball.isOutOfBounds()) {
            if (this.ball.mesh.position.z > 0) {
                this.aiScore++;  // AI scores if the ball is out on the player's side
            } else {
                this.playerScore++;  // Player scores if the ball is out on the AI's side
            }

            // Reset the ball for the next round
            this.ball.reset();

            // Check if there's a winner
            if (this.playerScore >= this.maxScore || this.aiScore >= this.maxScore) {
                this.endGame();
            }
        }
    }

    saveScore(playerName, score) {
        fetch('/api/gamescores/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_name: playerName,
                score: score,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score saved:', data);
        })
        .catch(error => {
            console.error('Error saving score:', error);
        });
    }

    loadLeaderboard() {
        fetch('/api/gamescores/')
        .then(response => response.json())
        .then(data => {
            console.log('Leaderboard:', data);
            // You can update the UI with the leaderboard data if needed
        })
        .catch(error => {
            console.error('Error loading leaderboard:', error);
        });
    }

    endGame() {
        this.isRunning = false;  // Stop the game
        let winner = this.playerScore > this.aiScore ? "Player" : "AI";
        document.getElementById('winner').innerText = `${winner} wins!`;  // Display the winner
        this.saveScore(winner, this.playerScore > this.aiScore ? this.playerScore : this.aiScore);  // Save the score to the API
        document.getElementById('restartButton').style.display = 'block';  // Show the restart button
    }

    reset() {
        this.ball.reset();  // Reset the ball to its initial position
        this.player.getPaddle().mesh.position.x = 0;  // Reset player paddle position
        this.aiPaddle.mesh.position.x = 0;  // Reset AI paddle position
        this.playerScore = 0;  // Reset player score
        this.aiScore = 0;  // Reset AI score
        document.getElementById('winner').innerText = '';  // Clear the winner text
        this.isRunning = true;  // Restart the game
        this.animate();  // Restart the animation loop
    }

    start() {
        this.animate();
    }
}
