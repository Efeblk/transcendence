class Table {
    constructor(scene) {
        const { width, height, depth } = gameConfig.table.size;
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshBasicMaterial({ color: gameConfig.table.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = gameConfig.table.positionY;
        this.mesh.position.z = gameConfig.table.positionZ;
        scene.add(this.mesh);
    }
}
