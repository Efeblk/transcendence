class Table {
    constructor(scene, texturePath) {
        const { width, height, depth } = gameConfig.table.size;
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        
        const textureLoader = new THREE.TextureLoader();
        const tableTexture = textureLoader.load(texturePath);  // Use the texturePath passed from the HTML
        const tableMaterial = new THREE.MeshBasicMaterial({ map: tableTexture });

        this.mesh = new THREE.Mesh(this.geometry, tableMaterial);
        this.mesh.position.y = gameConfig.table.positionY;
        this.mesh.position.z = gameConfig.table.positionZ;
        scene.add(this.mesh);
    }
}
