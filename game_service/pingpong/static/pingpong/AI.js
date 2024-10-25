class AIpaddle extends Player {
    constructor(scene, zPosition, color, difficulty = 'easy') {
        super(scene, zPosition, color);

        this.difficulty = difficulty;
        this.speed = gameConfig.paddle.movementSpeed;
        this.updateCounter = 0;
        this.targetX = 0;
        this.tolerance = 0.1; // Small tolerance zone for smoother movement

        this.setDifficulty(difficulty);
    }

    // Override event handlers to prevent AI paddle from responding to key events
    handleKeyDown(event) {
        // Do nothing
    }

    handleKeyUp(event) {
        // Do nothing
    }

    setDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.updateThreshold = 30;
                this.randomness = 2;
                break;
            case 'medium':
                this.updateThreshold = 20;
                this.randomness = 1;
                break;
            case 'hard':
                this.updateThreshold = 15;
                this.randomness = 0.5;
                break;
            default:
                this.updateThreshold = 20;
                this.randomness = 0.5;
        }
    }

    update(ball) {
        // Increment update counter
        this.updateCounter++;

        // Recalculate targetX only after reaching updateThreshold
        if (this.updateCounter >= this.updateThreshold) {
            const ballX = ball.mesh.position.x;

            // Calculate target position with randomness
            this.targetX = ballX + (Math.random() * 2 - 1) * this.randomness;

            // Reset the update counter
            this.updateCounter = 0;
        }

        const aiPaddleX = this.paddle.mesh.position.x; // Access paddle's position
        const distanceToTarget = Math.abs(this.targetX - aiPaddleX);

        // Move only if the distance to target is greater than tolerance
        if (distanceToTarget > this.tolerance) {
            if (this.targetX < aiPaddleX) {
                this.paddle.moveLeft(this.speed); // Move left at constant speed
            } else if (this.targetX > aiPaddleX) {
                this.paddle.moveRight(this.speed); // Move right at constant speed
            }
        }

        // Debugging: Log the AI paddle's position and target
    }
}
