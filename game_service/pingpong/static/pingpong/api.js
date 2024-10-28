class GameAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || '/api/game/pingpong/';
    }

    getCurrentPlayer() {
        const token = localStorage.getItem('access_token');
        console.log('token', token);
        return fetch(`/api/users/getuser`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include the token here
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            console.log('response', response);
            return response.json(); // Return the parsed JSON
        })
        .then(responseJSON => {
            const name = responseJSON['user']; // Extract the name from the JSON response
            console.log('current player:', name);
            return name; // Return the player's name
        })
        .catch(error => {
            console.error('Error fetching current player:', error);
            throw error;
        });
    } 

    getOnlinePlayers() {
        const token = localStorage.getItem('access_token');
        console.log('token', token);
    
        return fetch(`/api/users/users-data`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include the token here
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(responseJSON => {
            const players = responseJSON.map(user => user.username); // Extract usernames
            console.log('Online players:', players);
            return players; // Return the list of usernames
        })
        .catch(error => {
            console.error('Error fetching online players:', error);
            throw error;
        });
    }
    
    // Method to save game data via POST request
    saveGameData(player, aiScore, playerScore, winner) {
        console.log('Saving game data:', player, aiScore, playerScore, winner);
        return fetch(`${this.baseUrl}game-data/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: player,
                opponent: aiScore,
                player_score: playerScore,
                winner: winner,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error saving game data:', error);
            throw error;
        });
    }

    // Optional method to fetch game data (for example, game history)
    getGameData() {
        return fetch(`${this.baseUrl}game-data/`, {
            method: 'GET',
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching game data:', error);
            throw error;
        });
    }
}
