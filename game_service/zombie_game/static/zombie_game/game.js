class ZombieGame {
    constructor() {
        this.scene = new THREE.Scene();

        // Camera setup for bird's-eye view
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
        this.camera.position.set(0, 50, 0); // Overhead camera
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.appendChild(this.renderer.domElement);
        } else {
            console.error('Game container not found');
        }
        // Light setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 50, 10);
        this.scene.add(directionalLight);

        // Ground plane
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
        this.ground = new THREE.Mesh(planeGeometry, planeMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);

        // Initialize player
        this.player = new Player(this.scene);

        // Initialize zombies
        this.zombies = [];
        this.spawnZombies();

        // Start the game loop
        this.animate();
    }

    // Function to spawn some zombies randomly on the map
    spawnZombies() {
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 50 - 25;
            const z = Math.random() * 50 - 25;
            const zombie = new Zombie(this.scene, x, z);
            this.zombies.push(zombie);
        }
    }

    // Main game loop
    animate() {
        requestAnimationFrame(() => this.animate());

        // Update player
        this.player.update();

        // Update zombies
        this.zombies.forEach(zombie => zombie.update(this.player));

        // Render scene and camera
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game
window.onload = () => {
    const game = new Game();
};