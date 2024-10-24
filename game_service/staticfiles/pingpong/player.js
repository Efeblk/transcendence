class Player {
    constructor(scene, zPosition, color) {
        this.paddle = new Paddle(scene, zPosition, color);
        this.moveLeftActive = false;
        this.moveRightActive = false;
        this.movementSpeed = gameConfig.paddle.movementSpeed;
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            this.moveLeftActive = true;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            this.moveRightActive = true;
        }
    }

    handleKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            this.moveLeftActive = false;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            this.moveRightActive = false;
        }
    }

    update() {
        if (this.moveLeftActive) {
            this.paddle.moveLeft(this.movementSpeed);
        }
        if (this.moveRightActive) {
            this.paddle.moveRight(this.movementSpeed);
        }
    }

    getPaddle() {
        return this.paddle;
    }

    hitBall(ball) {
        if (this.moveLeftActive) {
            ball.applySpin(-0.5);  // Apply left spin
        } else if (this.moveRightActive) {
            ball.applySpin(0.5);  // Apply right spin
        }
    }
}
