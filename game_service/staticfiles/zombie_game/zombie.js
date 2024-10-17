class Zombie {
    constructor(scene, x, z) {
        // Zombie model as a red cube
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 1, z); // Random spawn position
        scene.add(this.mesh);

        this.speed = 0.02;
    }

    update(player) {
        // Basic AI to follow the player
        const dx = player.mesh.position.x - this.mesh.position.x;
        const dz = player.mesh.position.z - this.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Move zombie toward the player
        this.mesh.position.x += (dx / distance) * this.speed;
        this.mesh.position.z += (dz / distance) * this.speed;
    }
}