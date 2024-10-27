class GameAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || '/api/game/pingpong/';
    }

    getProfiles() {
        //online olanlar birde current profile
        return fetch(`/api/user_service/get-profiles`, {
            method: 'GET',
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching profiles:', error);
            throw error;
        });
    }

    saveGameDatatoProfile(player, aiScore, playerScore, winner) {
        console.log('saving game data to player', player, aiScore, playerScore, winner);
        return fetch(`/api/user_service/save-data-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: player,
                ai_score: aiScore,
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
