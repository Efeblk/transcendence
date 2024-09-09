// Function to update the page content based on the current path
function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');

    if (path === '/') {
        // Home Page content
        app.innerHTML = '<h1>Welcome to Transcendence</h1><p>This is the initial home page content.</p>';
    } else if (path === '/about') {
        // About Page content
        app.innerHTML = '<h1>About Transcendence</h1><p>This is a simple description of the project.</p>';
    } else if (path === '/game') {
        // Game Page content: HTML layout for the game and UI elements
        app.innerHTML = `
            <h1>Game Page</h1>
            <div id="gameArea"></div>  <!-- Div where the game canvas will be appended -->
            <p>Ball Speed: <span id="ballSpeed"></span></p>
            <p>Player Score: <span id="playerScore"></span></p>
            <p>AI Score: <span id="aiScore"></span></p>
            <button id="restartButton" style="display:none;" onclick="restartGame()">Restart Game</button>
        `;

        // Initialize the game logic
        initializeGame();
    } else {
        // 404 - Page Not Found content
        app.innerHTML = '<h1>404 - Page Not Found</h1><p>Sorry, we couldn\'t find that page.</p>';
    }
}

// Function to handle link clicks (for internal navigation)
function navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    window.history.pushState(null, null, href);
    router();  // Call the router to update the content without a full page reload
}

// Set up event listeners when the page loads
window.addEventListener('load', function() {
    router();  // Call the router when the page initially loads

    // Set up click event listeners on all links with the data-link attribute
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => link.addEventListener('click', navigate));
});

// Handle back and forward navigation (when users use the browser's back/forward buttons)
window.addEventListener('popstate', router);

// Function to initialize the game (called when navigating to /game)
function initializeGame() {
    const texturePath = '/static/game/textures/table.jpg';  // Set texture path if you have textures
    const game = new Game(texturePath);  // Instantiate the Game class
    game.start();  // Start the game
}

// Restart game functionality
function restartGame() {
    const texturePath = '/static/game/textures/table.jpg';  // Re-use the texture path if applicable
    const game = new Game(texturePath);  // Recreate the Game instance
    game.reset();  // Reset the game state and restart the game
}
