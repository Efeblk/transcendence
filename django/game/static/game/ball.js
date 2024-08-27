class Ball {
    constructor(scene) {
        const { size, color, metalness, roughness } = gameConfig.ball;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: color, metalness: metalness, roughness: roughness });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, gameConfig.paddle.positionY, 0);  // Start the ball at the same Y as the paddle
        scene.add(this.mesh);

        this.speed = 1.2;
        this.direction = { x: 0.02, z: 0.05 };  // Initial direction of the ball
        this.maxSpeed = 3;  // Set a maximum speed to avoid excessive speed
    }

    update() {
        this.mesh.position.x += this.direction.x * this.speed;
        this.mesh.position.z += this.direction.z * this.speed;

        if (this.mesh.position.x > (gameConfig.table.size.width / 2) || this.mesh.position.x < -(gameConfig.table.size.width / 2)) {
            this.direction.x = -this.direction.x;  // Bounce off the side walls
        }
    }

    bounce() {
        this.direction.z = -this.direction.z;  // Reverse the direction on collision with paddle
        
        // Cap the speed to avoid excessive increases
        this.speed = Math.min(this.speed + 0.01, this.maxSpeed);

        // Slightly move the ball away from the paddle to prevent immediate re-collision
        this.mesh.position.z += this.direction.z * 0.1;
    }

    reset() {
        this.mesh.position.set(0, gameConfig.paddle.positionY, 0);
        this.direction = { x: 0.02, z: 0.05 };  // Reset the ball direction and speed
        this.speed = 1.2;
    }

    isOutOfBounds() {
        // Define the boundaries for the out-of-bounds check
        const tableDepth = gameConfig.table.size.depth;
        const ballPositionZ = this.mesh.position.z;
    
        // Check if the ball has passed the AI side or the player side
        const isBeyondPlayerSide = ballPositionZ > tableDepth / 2 + gameConfig.table.positionZ;
        const isBeyondAISide = ballPositionZ < -(tableDepth / 2) + gameConfig.table.positionZ;
    
        return isBeyondPlayerSide || isBeyondAISide;
    }
    

    isCollidingWith(paddle) {
        const ballRadius = gameConfig.ball.size;
        const paddleWidth = gameConfig.paddle.size.width;
        const paddleDepth = gameConfig.paddle.size.depth;

        return (
            this.mesh.position.z - ballRadius <= paddle.mesh.position.z + paddleDepth / 2 &&
            this.mesh.position.z + ballRadius >= paddle.mesh.position.z - paddleDepth / 2 &&
            this.mesh.position.x + ballRadius >= paddle.mesh.position.x - paddleWidth / 2 &&
            this.mesh.position.x - ballRadius <= paddle.mesh.position.x + paddleWidth / 2
        );
    }
}
