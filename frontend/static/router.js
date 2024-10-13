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
        const token = localStorage.getItem('access_token');
        if (token)
            window.location.href = '/profile';
        else
        {
            fetch('/api/users/login')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load login page');
                    }
                    return response.text();
                })
                .then(htmlContent => {
                    app.innerHTML = htmlContent;
    
                    const loginForm = document.getElementById('loginForm');
                    loginForm.addEventListener('submit', async function(event) {
                        event.preventDefault(); // Prevent form submission
                
                        const username = document.getElementById('username').value;
                        const password = document.getElementById('password').value;
                
                        // Make API call to check user credentials
                        const response = await fetch('/api/users/rq_login/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username, password })
                        });
    
                        const data = await response.json();
    
                        if (data.success) {
                            localStorage.setItem('access_token', data.access_token);
                            alert('Login successful!');
                            window.location.href = '/profile';
                        } else {
                            const errorMessage = document.getElementById('error-message');
                            errorMessage.textContent = data.message;
                        }
                    });
                
                    const signupBtn = document.getElementById('signupBtn');
                    signupBtn.addEventListener('click', function() {
                        window.location.href = '/signup'; // Redirect to sign-up page
                    }); 
                }).catch(error => { 
                    console.error('Error loading login page:', error); 
                });    
        }
    } else if (path === '/signup') {
        fetch('/api/users/signup')
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load sign-up page');
            }
            return response.text();
        }).then(htmlContent => {
            app.innerHTML = htmlContent;
            // Handle sign-up form submission
            const signupForm = document.getElementById('signupForm');
            signupForm.addEventListener('submit', async function(event) {
                event.preventDefault(); // Prevent form submission
        
                // Mock sign-up logic (you can replace this with actual logic)
                const newName = document.getElementById('newName').value;
                const newEmail = document.getElementById('newEmail').value;
                const newUsername = document.getElementById('newUsername').value;
                const newPassword = document.getElementById('newPassword').value;
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                const response = await fetch('/api/users/rq_signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken // Include the CSRF token
                    },
                    body: JSON.stringify({ newName, newEmail, newUsername, newPassword })
                });
            
                const data = await response.json();
            
                if (data.success) {
                    alert('Account created for ' + newUsername);
                    window.location.href = '/login'; // Redirect to login after signing up
                } else {
                    alert(data.message); // Display error message
                }
            });
        }).catch(error => {
            console.error('Error loading sign-up page:', error);
        });
    }else if (path === '/profile'){
        const token = localStorage.getItem('access_token');
        if (!token)
            window.location.href = '/login';
        else
        {
            fetch('/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token here
                }
            })
                .then(response => {
                    if (response.status === 401) {
                        localStorage.removeItem('access_token');
                        window.location.href = '/login';
                    }
                    if (!response.ok) {
                        throw new Error('Failed to load profile');
                    }
                    return response.text();  // Return HTML content
                })
                .then(htmlContent => {
                    app.innerHTML = htmlContent;
                    
                    const LogOut = document.getElementById('LogOut');
                    LogOut.addEventListener('click', function() {
                        logout();
                    }); 
                })
                .catch(error => {
                    console.error('Error loading profile:', error);
                });
        }
    } else if (path === '/search') {
        const token = localStorage.getItem('access_token');
        if (!token)
            window.location.href = '/login';
        else
        {
            fetch('/api/users/search')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load search page');
                    }
                    return response.text();
                })
                .then(htmlContent => {
                    app.innerHTML = htmlContent;
        
                    // Add event listener for form submission
                    const searchForm = document.getElementById('searchForm');
                    searchForm.addEventListener('submit', async function(event) {
                        event.preventDefault();  // Prevent default form submission
        
                        let query = document.getElementById('searchInput').value.trim();  // Get search query and trim spaces
                
                        fetch(`/api/users/rq_search/?q=${encodeURIComponent(query)}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,  // Include token
                                'Content-Type': 'application/json',
                            }
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to load search results');
                            }
                            return response.text();
                        })
                        .then(htmlContent => {
                            app.innerHTML = htmlContent; // Display results
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error loading search page:', error);
                });    
            }
    }else {
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

function logout() {
    localStorage.removeItem('access_token');  // Remove the token
    window.location.href = '/login';  // Redirect to login page
}

