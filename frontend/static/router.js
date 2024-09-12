// Global variable to track the game instance
let gameInstance = null;

// Function to update the page content based on the current path
function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');

    if (path === '/') {
        // Home Page content
        app.innerHTML = '<h1>Welcome to Transcendence</h1><p>This is the initial home page content.</p>';
    } else if (path === '/game') {
        // Fetch Game Page HTML content from the backend (game microservice)
        fetch('/api/game/game')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load game page');
                }
                return response.text();
            })
            .then(htmlContent => {
                // Update the app container with the fetched HTML
                app.innerHTML = htmlContent;
            })
            .then(() => {
                // Initialize the game after loading the game page
                initializeGame();
            })
            .catch(error => {
                console.error('Error loading the game page:', error);
                app.innerHTML = '<h1>Error Loading Game</h1>';
            });
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
window.addEventListener('load', function () {
    router();  // Call the router when the page initially loads

    // Set up click event listeners on all links with the data-link attribute
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => link.addEventListener('click', navigate));
});

// Handle back and forward navigation (when users use the browser's back/forward buttons)
window.addEventListener('popstate', router);

// Function to initialize the game (called when navigating to /game)
function initializeGame() {
    // Check if a game instance already exists, if so, clean it up
    if (gameInstance) {
        console.log('Game instance already running. Restarting...');
        gameInstance.reset();
        return;
    }

    // Ensure the gameContainer exists before starting the game
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }

    const texturePath = '/static/game/textures/table.jpg';  // Set texture path if you have textures
    gameInstance = new Game(texturePath);  // Instantiate the Game class
    gameInstance.start();  // Start the game
    console.log('Game started successfully.');
}

// Restart game functionality
function restartGame() {
    // Reset and restart the existing game instance if it exists
    if (gameInstance) {
        gameInstance.reset();
        console.log('Game reset and restarted successfully.');
    } else {
        console.error('No game instance found to restart.');
    }
}
