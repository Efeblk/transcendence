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

        this.api = new GameAPI();
        this.tournamentMode = false; // Tracks if a tournament is ongoing
        this.gameUI = new GameUI(this.start.bind(this), this.reset.bind(this));

        // Initialize Tournament with a callback to handle tournament end
        this.tournament = new Tournament(
            this.api, 
            this.gameUI, 
            this.endTournament.bind(this)
        );

        this.table = new Table(this.scene, texturePath);
        this.initPlayer();
        this.opponent = null; // Placeholder for opponent (AI or Player 2)
        this.ball = new Ball(this.scene);

        this.setupLights();

        this.playerScore = 0;
        this.aiScore = 0;
        this.maxScore = 3;
        this.isRunning = false; // Game starts as not running
    }

    async initPlayer() {
        try {
            const player = await this.api.getCurrentPlayer();
            this.player = new Player(player, this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);
            this.setupControls();
        } catch (error) {
            console.error('Error initializing player:', error);
        }
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

    removeOpponent() {
        if (this.opponent) {
            this.scene.remove(this.opponent.getPaddle().mesh);
            this.opponent.getPaddle().mesh.geometry.dispose();
            this.opponent.getPaddle().mesh.material.dispose();
            this.opponent = null;
        }
    }

    async startTournamentMode() {
        const initialized = await this.tournament.init();
        if (!initialized) return; // Return if the tournament failed to initialize
        this.tournamentMode = true;
        this.startNextMatch();
    }

    startNextMatch() {
        const match = this.tournament.getNextMatch();
        if (!match) {
            console.log('Tournament complete or no more matches left.');
            this.tournamentMode = false;
            return;
        }

        const player1 = match[0];
        const player2 = match[1];

        if (player2 === null) {
            console.log(`${player1} advances automatically.`);
            this.startNextMatch(); // Skip to the next match
            return;
        }

        this.removeOpponent();

        alert(`Starting match between ${player1} and ${player2}`);
        this.player = new Player(player1, this.scene, gameConfig.paddle.positionZ.player, gameConfig.paddle.color.player);
        this.opponent = new Player(player2, this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai, 'player2');

        this.reset();
        this.isRunning = true;
        this.animate(); // Start the animation loop
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        this.player.update();
        this.ball.update();

        if (this.opponent) {
            this.opponent.update(this.ball);
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
        const winner = this.playerScore > this.aiScore ? this.player.getName() : this.opponent.getName();

        this.api.saveGameData(this.player.getName(), this.aiScore, this.playerScore, winner)
            .then(data => console.log('Game result saved:', data))
            .catch(error => console.error('Error saving game result:', error));

        if (this.tournamentMode) {
            this.tournament.advanceToNextRound(winner);
            this.startNextMatch();
            return;
        }
        
        this.gameUI.showRestartButton(); // Show the restart button at the end of the game
    }

    reset() {
        this.ball.reset();
        this.player.getPaddle().mesh.position.x = 0;
        if (this.opponent) this.opponent.getPaddle().mesh.position.x = 0;
        this.playerScore = 0;
        this.aiScore = 0;
    }

    endTournament() {
        this.tournamentMode = false;
        console.log('Tournament has ended!');
        this.gameUI.showRestartButton(); // Show restart or any other end-of-tournament logic
    }

    start(mode) {
        if (this.isRunning) {
            console.log('Game is already running!');
            return;
        }

        this.removeOpponent();

        if (mode === 'player') {
            console.log('Starting Player vs Player mode...');
            this.opponent = new Player('opponent', this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai, 'player2');
        } else if (mode === 'tournament') {
            console.log('Starting Tournament mode...');
            this.startTournamentMode();
        } else {
            console.log('Playing against AI...');
            this.opponent = new AIpaddle('AI', this.scene, gameConfig.paddle.positionZ.ai, gameConfig.paddle.color.ai);
            if (['easy', 'medium', 'hard'].includes(mode)) {
                this.opponent.setDifficulty(mode);
                console.log(`AI difficulty set to ${mode}`);
            }
        }

        this.reset();
        this.isRunning = true;
        this.animate(); // Start the animation loop
    }
}
