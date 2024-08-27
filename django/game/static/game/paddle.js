class Paddle {
    constructor(scene, zPosition, color) {
        const { width, height, depth } = gameConfig.paddle.size;
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, gameConfig.paddle.positionY, zPosition);  // Set Y position from config
        scene.add(this.mesh);
    }

    moveLeft(speed) {
        this.mesh.position.x -= speed;
        this.mesh.position.x = Math.max(-4.5, this.mesh.position.x);
    }

    moveRight(speed) {
        this.mesh.position.x += speed;
        this.mesh.position.x = Math.min(4.5, this.mesh.position.x);
    }
}
