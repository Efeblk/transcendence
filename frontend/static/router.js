// Function to dynamically load the game controller script and start the game
function loadGameController() {
    const script = document.createElement('script');
    script.src = '/api/game/start';  // Fetching the game controller script
    script.onload = () => {
        console.log('Game controller script loaded and executed.');
    };
    script.onerror = (error) => {
        console.error('Error loading game controller script:', error);
    };

    const gameContainer = document.getElementById('gameContainer');  // Ensure the gameContainer exists
    if (gameContainer) {
        gameContainer.appendChild(script);  // Append the script to the gameContainer
    } else {
        console.error('Game container not found!');
    }
}

// Router function to handle navigation
function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');

    if (path === '/') {
        // Home page content
        app.innerHTML = '<h1>Welcome to Transcendence</h1><p>This is the initial home page content.</p>';
    } else if (path === '/game') {
        // Fetch and load game page
        fetch('/api/game/game')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load game page');
                }
                return response.text();
            })
            .then(htmlContent => {
                app.innerHTML = htmlContent;

                // Ensure the gameContainer exists in the fetched HTML before appending the script
                loadGameController();
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    } else {
        // 404 - Page Not Found
        app.innerHTML = '<h1>404 - Page Not Found</h1>';
    }
}

// Function to handle internal link navigation
function navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    window.history.pushState(null, null, href);
    router();  // Call router function to load the content
}

// Set up event listeners on page load
window.addEventListener('load', function () {
    router();  // Call router when the page initially loads

    // Attach click event listeners to all internal links
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => link.addEventListener('click', navigate));
});

// Handle browser back/forward buttons
window.addEventListener('popstate', router);
