class Player {
    constructor(scene) {
        // Player model as a simple cube
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 1, 0); // Center the player
        scene.add(this.mesh);

        // Player movement controls
        this.speed = 0.1;
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        // Event listeners for player controls
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.controls.forward = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.controls.backward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.controls.left = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.controls.right = true;
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.controls.forward = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.controls.backward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.controls.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.controls.right = false;
                    break;
            }
        });
    }

    update() {
        if (this.controls.forward) this.mesh.position.z -= this.speed;
        if (this.controls.backward) this.mesh.position.z += this.speed;
        if (this.controls.left) this.mesh.position.x -= this.speed;
        if (this.controls.right) this.mesh.position.x += this.speed;
    }
}