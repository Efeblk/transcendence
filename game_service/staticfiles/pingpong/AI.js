class AIpaddle extends Paddle {
    constructor(scene, zPosition, color) {
        super(scene, zPosition, color);
        this.speed = gameConfig.paddle.movementSpeed.easyAI;
    }

    update(ball) {
        const ballX = ball.mesh.position.x;
        const aiPaddleX = this.mesh.position.x;

        this.mesh.position.x += (ballX - aiPaddleX) * this.speed;
    }
}