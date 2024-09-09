

const gameConfig = {
    camera: {
        fov: 40,  // Field of view
        position: { x: 0, y: 10, z: 12 },  // Camera position
        aspectRatio: window.innerWidth / window.innerHeight,  // Aspect ratio
    },
    renderer: {
        width: window.innerWidth - 100,  // Renderer width
        height: window.innerHeight - 100,  // Renderer height
    },
    lighting: {
        ambientLight: {
            color: 0xffffff,
            intensity: 0.5,
        },
        directionalLight: {
            color: 0xffffff,
            intensity: 1,
            position: { x: 5, y: 10, z: 7.5 },
        },
    },
    table: {
        color: 0x006400,  // Green color for the table
        size: { width: 12, height: 0.5, depth: 10 },  // Table dimensions
        positionY: -2,  // Y position of the table
        positionZ: -2,
    },
    paddle: {
        color: {
            player: 0xff0000,  // Red color for player paddle
            ai: 0x0000ff,  // Blue color for AI paddle
        },
        size: { width: 2, height: 0.2, depth: 0.5 },  // Paddle dimensions
        positionY: -1.65,  // Corrected paddle position above the table surface
        positionZ: {
            player: 2.5,
            ai: -6
        },
    },
    ball: {
        color: 0xffffff,  // White color for the ball
        size: 0.2,  // Radius of the ball
        metalness: 0.5,  // Reflective property of the ball
        roughness: 0.1,  // Surface roughness of the ball
    },
};
