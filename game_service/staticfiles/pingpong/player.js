class Player {
    constructor(scene, zPosition, color, player = 'player1') {
        this.paddle = new Paddle(scene, zPosition, color);
        this.moveLeftActive = false;
        this.moveRightActive = false;
        this.movementSpeed = gameConfig.paddle.movementSpeed;
        if (player === 'player1') {
            this.leftKey = gameConfig.player1.left;
            this.rightKey = gameConfig.player1.right;
        }
        else if (player === 'player2') {
            console.log("PLAYER 2 if ");
            this.leftKey = gameConfig.player2.left;
            this.rightKey = gameConfig.player2.right;
        }
        console.log("PLAYER PLAYER", player);
        console.log("this left key", this.leftKey);
    }

    handleKeyDown(event) {
        console.log("KEY DOWN", event.key);
        if (event.key === this.leftKey) {
            console.log("LEFT KEY");
            this.moveLeftActive = true;
        } else if (event.key === this.rightKey) {
            this.moveRightActive = true;
        }
    }

    handleKeyUp(event) {
        if (event.key === this.leftKey) {
            this.moveLeftActive = false;
        } else if (event.key === this.rightKey) {
            this.moveRightActive = false;
        }
    }

    update() {
        console.log("UPDATE");
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
