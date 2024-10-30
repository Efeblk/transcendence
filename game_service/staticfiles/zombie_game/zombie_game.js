class ZombieGame {
    constructor() {
        this.scene = new THREE.Scene();

        // Camera setup for bird's-eye view
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
        this.camera.position.set(0, 50, 50); // Overhead camera, slightly angled
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
        this.initializePlayer();

        // Initialize zombies
        this.zombies = [];
        this.spawnZombies();

        // Start the game loop
        this.animate();
    }

    initializePlayer() {
        try {
            this.player = new Player(this.scene);
            if (this.player && this.player.mesh) {
                console.log('Player successfully initialized.');
            } else {
                console.error('Player failed to initialize properly.');
            }
        } catch (error) {
            console.error('Error while initializing player:', error);
        }
    }

    // Function to spawn some zombies randomly on the map
    spawnZombies() {
        if (typeof Zombie === 'undefined') {
            console.error('Zombie class is not defined.');
        } else {
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * 50 - 25;
                const z = Math.random() * 50 - 25;
                const zombie = new Zombie(this.scene, x, z);
                this.zombies.push(zombie);
            }
        }
    }

    // Main game loop
    animate() {
        requestAnimationFrame(() => this.animate());

        // Check if player is properly defined before updating zombies
        if (this.player && this.player.mesh) {
            this.player.update();
            this.zombies.forEach(zombie => zombie.update(this.player));
        } else {
            console.error('Player or player mesh is not defined.');
        }

        // Render scene and camera
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game
// window.onload = () => {
//     const game = new ZombieGame();
// };lee
