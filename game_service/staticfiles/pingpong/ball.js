

class Ball {
    constructor(scene) {
        const { size, metalness, roughness } = gameConfig.ball;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        
        // Neon-like emissive material
        this.material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            emissive: 0x0000ff,  // Initial emissive color
            metalness: metalness, 
            roughness: roughness,
            emissiveIntensity: 1 // Emissive intensity for glowing effect
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, gameConfig.paddle.positionY, 0);  // Start the ball at the same Y as the paddle
        scene.add(this.mesh);

        this.speed = gameConfig.ball.speed;  // Initial speed of the ball
        this.direction = { x: 0.02, z: 0.05 };  // Initial direction of the ball
        this.spin = gameConfig.ball.spin;  // Introduce a spin property
        this.maxSpeed = gameConfig.ball.maxSpeed;  // Set a maximum speed to avoid excessive speed

        this.colorChangeSpeed = gameConfig.ball.colorChangeSpeed;  // Speed of color change
        this.colorOffset = gameConfig.ball.colorOffset;  // Offset for color oscillation
    }

    applySpin(amount) {
        this.spin += amount;  // Adjust the spin by the given amount
    }

    update() {
        // Apply spin effect by adjusting the direction based on the spin value
        const spinEffect = this.spin * 0.001;
        const angle = Math.atan2(this.direction.z, this.direction.x) + spinEffect;

        // Calculate new direction based on the angle after applying spin
        const magnitude = Math.sqrt(this.direction.x ** 2 + this.direction.z ** 2);
        this.direction.x = magnitude * Math.cos(angle);
        this.direction.z = magnitude * Math.sin(angle);

        // Update ball position
        this.mesh.position.x += this.direction.x * this.speed;
        this.mesh.position.z += this.direction.z * this.speed;

        this.colorOffset += this.colorChangeSpeed;

        // Keep red and green higher, and blue low to avoid grey
        const r = Math.sin(this.colorOffset) * 0.3 + 0.7;  // Oscillate between 0.7 and 1 for red
        const g = Math.sin(this.colorOffset + Math.PI / 4) * 0.3 + 0.7;  // Oscillate between 0.7 and 1 for green
        const b = Math.sin(this.colorOffset + Math.PI / 2) * 0.1 + 0.1;  // Keep blue very low
    
        this.material.emissive.setRGB(r, g, b);
    
        // Bounce off the side walls
        if (this.mesh.position.x > 4.5 || this.mesh.position.x < -4.5) {
            this.direction.x = -this.direction.x;
            this.spin = -this.spin;  // Invert spin when bouncing off walls
        }
    }

    bounce() {
        this.direction.z = -this.direction.z;  // Reverse the direction on collision with paddle
        
        // Cap the speed to avoid excessive increases
        this.speed = Math.min(this.speed + gameConfig.ball.addSpeed, this.maxSpeed);

        // Slightly move the ball away from the paddle to prevent immediate re-collision
        this.mesh.position.z += this.direction.z * 0.1;
    }

    reset() {
        this.mesh.position.set(0, gameConfig.paddle.positionY, 0);
        this.direction = { x: 0.02, z: 0.05 };  // Reset the ball direction and speed
        this.speed = gameConfig.ball.speed;
        this.spin = gameConfig.ball.spin;  // Reset the spin
    }

    isOutOfBounds() {
        // Check if the ball is out of the play area (beyond the AI or player's side of the table)
        const tableDepth = gameConfig.table.size.depth;
        return (
            (this.mesh.position.z > tableDepth / 2 - 2) ||  // Ball is beyond the player's side
            (this.mesh.position.z < -tableDepth / 2 - 2)    // Ball is beyond the AI's side
        );
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