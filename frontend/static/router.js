// Function to dynamically load the page-specific start script and start the corresponding logic
function pageStartScript(path, containerId) {
    console.log('Path:', path);
    
    // Create a new script element
    const script = document.createElement('script');
    script.src = '/api/game' + path + '/start';  // Fetching the controller script from the microservice
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
    } else if (path === '/pingpong') {
        // Fetch and load game page
        fetch('/api/game/pingpong/pingpong')
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
    }else if (path === '/zombie_game') { 
        fetch('/api/game/zombie_game/zombie_game')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load zombie game page');
                }
                return response.text();
            })
            .then(htmlContent => {
                console.log('HTML CONTENT:', htmlContent);
                app.innerHTML = htmlContent;

                // Dynamically load the zombie game controller script after loading the HTML
                pageStartScript(path, 'gameContainer');  // Target the zombie game container specifically
            })
            .catch(error => {
                console.error('Error loading page:', error);
            });
    }
    else if (path === '/login') {
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
        }else if (path.match(/^\/profile\/([^\/]+)\/$/)) {
            const token = localStorage.getItem('access_token');
            const username = path.split('/')[2];

            if (!token) {
                window.location.href = '/login';  // Redirect to login if no token
            } else {
                fetch(`/api/users/profile/${username}`, {  // Use the username in the API call
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`  // Include the token
                    }
                })
                .then(response => {
                    if (response.status === 401) {
                        localStorage.removeItem('access_token');  // Remove token if unauthorized
                        window.location.href = '/login';  // Redirect to login
                    }
                    if (!response.ok) {
                        throw new Error('Failed to load profile');
                    }
                    return response.text();  // Return HTML content
                })
                .then(htmlContent => {
                    app.innerHTML = htmlContent;  // Insert the HTML content into the app
                    
                    const AddFriend = document.getElementById('AddFriend');
                    if (AddFriend) {
                        AddFriend.addEventListener('click', function() {
                            fetch('/api/users/add_friend/', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ username: username }) // Send the username in the request body
                            })
                            .then(response => {
                                if (!response.ok) {
                                    if (response.status === 400) {
                                        return response.json().then(data => {
                                            alert(data.message); // Alert the specific message from the backend
                                        });
                                    } else {
                                        alert('Failed to add friend. Status: ' + response.status);
                                    }
                                } else {
                                    return response.json(); // Parse the JSON response if successful
                                }
                            })
                            .then(data => {
                                if (data) {
                                    alert(data.message); // Notify the user with the message
                                }
                            })
                            .catch(error => {
                                console.error('Error adding friend:', error);
                                alert('An unexpected error occurred.');
                            });
                        });
                    }

                    const acceptButtons = document.querySelectorAll('.accept-btn');
                    const declineButtons = document.querySelectorAll('.decline-btn');
                    
                    acceptButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const friendId = this.getAttribute('data-id');
                            handleFriendRequest(friendId, 'accept');
                        });
                    });
                    
                    declineButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const friendId = this.getAttribute('data-id');
                            handleFriendRequest(friendId, 'decline');
                        });
                    });

                })
                .catch(error => {
                    console.error('Error loading profile:', error);
                });
            }
    }else if (path === '/friend_requests') {
        const token = localStorage.getItem('access_token');
        if (!token)
            window.location.href = '/login';
        else {
            fetch('/api/users/friend_requests/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Send token in the header
                }
            })
                .then(response => response.text())  // Return HTML content
                .then(htmlContent => {
                    app.innerHTML = htmlContent; // Inject the HTML content for friend requests
                    
                    // Add event listeners for accept and decline buttons
                    const acceptButtons = document.querySelectorAll('.accept-btn');
                    const declineButtons = document.querySelectorAll('.decline-btn');
                    
                    acceptButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const friendId = this.getAttribute('data-id');
                            handleFriendRequest(friendId, 'accept');
                        });
                    });
                    
                    declineButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const friendId = this.getAttribute('data-id');
                            handleFriendRequest(friendId, 'decline');
                        });
                    });
                })
                .catch(error => {
                    console.error('Error loading friend requests:', error);
                });
            }
    }else if (path === '/friends') {
        const token = localStorage.getItem('access_token');
        if (!token)
            window.location.href = '/login';
        else {
            fetch('/api/users/friends/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Send token in the header
                }
            })
                .then(response => response.text())  // Return HTML content
                .then(htmlContent => {
                    app.innerHTML = htmlContent; // Inject the HTML content for friend requests
                    
                })
                .catch(error => {
                    console.error('Error loading friend requests:', error);
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

// Example of adding event listeners for user profile links
document.querySelectorAll('.user-profile-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default link behavior
        const username = this.getAttribute('data-username');  // Get username from data attribute
        window.location.href = `/profile/${username}/`;
    });
});

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

function handleFriendRequest(friendId, action) {
    const token = localStorage.getItem('access_token');
    const url = action === 'accept' ? `/api/users/friendships/accept/${friendId}/` : `/api/users/friendships/decline/${friendId}/`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            const Request = document.getElementById(`request-${friendId}`);
            if (Request)
                Request.remove(); // Remove the friend request from the list
            alert(`Friend request ${action}ed successfully!`);
            window.location.href = window.location.href;
        } else {
            alert('Failed to process the request.');
        }
    })
    .catch(error => {
        console.error('Error handling friend request:', error);
    });
}

// ! burda yüklemeye çalıştım ama olmadı
// function sicriptiyulelan() {
//     console.log('fortytwoAuth.js script is being loaded into the <head> element.');

//     // Yeni bir script elementi oluşturuyoruz
//     const script = document.createElement('script');
//     script.src = '/static/user_management/fortytwoAuth.js';
//     script.onload = () => {
//         console.log('fortytwoAuth.js loaded successfully into the <head>.');
//     };
//     script.onerror = (error) => {
//         console.error('Error loading fortytwoAuth.js:', error);
//     };

//     // Scripti <head> içerisine ekliyoruz
//     const headElement = document.head;
//     if (headElement) {
//         headElement.appendChild(script);  // Scripti <head> içine ekliyoruz
//     } else {
//         console.error('<head> element not found!');
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     sicriptiyulelan();
// });

// ! direkt burdan ekledim kısaca
// const initiate42Login = async () => {
//     try {
//       const response = await fetch('/api/auth/42/login/');
//       const data = await response.json();
      
//       if (data.auth_url) {
//         // Redirect to 42's authorization page
//         window.location.href = data.auth_url;
//       }
//     } catch (error) {
//       console.log('Failed to initiate 42 login:');
//     }
//   };

const initiate42Login = async () => {
    try {
        // İsteği at
        const response = await fetch('/api/auth/42/login/');
        console.log('Response type:', response.headers.get('content-type'));
        
        // Response içeriğini kontrol et
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // JSON'a çevir
        console.log('Received data:?');
        const data = await response.json();
        console.log('Received data:', data);
        
        // auth_url var mı kontrol et
        if (!data.auth_url) {
            throw new Error('No auth_url in response');
        }
        
        // 42'ye yönlendir
        window.location.href = data.auth_url;
        
    } catch (error) {
        // console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    handleLoginSuccess();
  });
  
//   function handleLoginSuccess() {
//     if (window.location.hash === '#/login-success') {
//       // Hash'i temizleyelim ve UI'yi güncelleyelim
//       window.location.hash = '';
      
//       // Kullanıcı oturum açtı olarak işaretleniyor
//       console.log('User logged in successfully!');
//       // Burada uygulama durumunu güncelleyebilir ya da kullanıcı profili gibi bilgileri çekebilirsiniz.
//     }
//   }

function handleLoginSuccess() {
    if (window.location.hash.startsWith('#/login-success')) {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = urlParams.get('access_token');
      console.log("debug\n");
      if (accessToken) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('access_token', accessToken);
        alert('Access token set edildi!');
        
        // Kullanıcıyı profile sayfasına yönlendir
        window.location.href = '/profile';
      }
      else {
        console.log("elsed\n");
      }
    }
  }
  