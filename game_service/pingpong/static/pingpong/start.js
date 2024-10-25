(function () {
    console.log("Fetching and starting the game...");

    // Path to the texture
    const texturePath = '/static/pingpong/textures/table.jpg';  
    
    // Automatically initialize the game using the Game class
    const game = new Game(texturePath);

    console.log("Game started successfully.");
})();