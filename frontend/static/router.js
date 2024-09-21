// Function to dynamically load the page-specific start script and start the corresponding logic
function pageStartScript(path, containerId) {
    console.log('Path:', path);
    
    // Create a new script element
    const script = document.createElement('script');
    script.src = '/api' + path + '/start';  // Fetching the controller script from the microservice
    script.onload = () => {
        console.log('Page-specific start script loaded and executed.');
    };
    script.onerror = (error) => {
        console.error('Error loading start script:', error);
    };

    // Ensure the container exists before appending the script
    const targetContainer = document.getElementById(containerId);
    if (targetContainer) {
        targetContainer.appendChild(script);  // Append the script to the specific container
    } else {
        console.error(`Container with ID '${containerId}' not found!`);
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

                // Dynamically load the game controller script after loading the HTML
                pageStartScript(path, 'gameContainer');  // Target the game container specifically
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    } else if (path === '/login') {
        app.innerHTML = `
        <h1>Login</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div id="error-message" class="text-danger"></div>
        
        <!-- Add Sign Up button -->
        <p>Don't have an account? <button id="signupBtn" class="btn btn-secondary">Sign Up</button></p>
        `;
        
        // Add event listener for form submission
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Simple mock login process
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'user' && password === 'password') {
                alert('Login successful');
                window.location.href = '/'; // Redirect to home after login
            } else {
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Invalid username or password.';
            }
        });
        const signupBtn = document.getElementById('signupBtn');
        signupBtn.addEventListener('click', function() {
            // Redirect or dynamically load the sign-up form
            window.location.href = '/signup';
        });
    } else if (path === '/signup') {
        // Sign Up page content
        app.innerHTML = `
            <h1>Sign Up</h1>
            <form id="signupForm">
                <div class="form-group">
                    <label for="newUsername">Username</label>
                    <input type="text" id="newUsername" name="newUsername" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Password</label>
                    <input type="password" id="newPassword" name="newPassword" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
            </form>
        `;
    
        // Handle sign-up form submission
        const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
    
            // Mock sign-up logic (you can replace this with actual logic)
            const newUsername = document.getElementById('newUsername').value;
            const newPassword = document.getElementById('newPassword').value;
    
            alert('Account created for ' + newUsername);
            window.location.href = '/login'; // Redirect to login after signing up
        });
    } else if (path === '/profile') {
        fetch('/api/users/profile')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load game page');
                }
                return response.text();
            })
            .then(htmlContent => {
                app.innerHTML = htmlContent;

            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    }else if (path === '/another-page') {
        // Example: Handle another page with a different microservice or logic
        fetch('/api/another-service/endpoint')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load another page');
                }
                return response.text();
            })
            .then(htmlContent => {
                app.innerHTML = htmlContent;

                // Dynamically load the page start script for another page
                pageStartScript(path, 'anotherContainer');  // Use another specific container
            })
            .catch(error => {
                console.error('Error loading another page:', error);
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
