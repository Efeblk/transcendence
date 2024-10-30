class Tournament {
    constructor(api, gameUI, onTournamentEnd) {
        this.api = api;
        this.gameUI = gameUI;
        this.onTournamentEnd = onTournamentEnd; // Callback function for ending the tournament
        this.players = [];
        this.bracket = [];
        this.matchWinners = []; // Store match winners for the current round
        this.currentRound = 0;
        this.currentMatchIndex = 0;
    }

    async init() {
        try {
            this.players = await this.api.getOnlinePlayers();
            if (this.players.length < 4) {
                console.log('Not enough players for a tournament');
                alert('Not enough players for a tournament!');
                return false;
            }

            this.players = this.shuffleArray(this.players);
            console.log('Tournament players:', this.players);
            this.createBracket();
            return true; // Tournament initialized successfully
        } catch (error) {
            console.error('Error initializing tournament:', error);
            return false;
        }
    }

    createBracket() {
        this.bracket = [];
        this.matchWinners = []; // Clear match winners for the new round
        for (let i = 0; i < this.players.length; i += 2) {
            if (this.players[i + 1]) {
                this.bracket.push([this.players[i], this.players[i + 1]]);
            } else {
                this.bracket.push([this.players[i], null]); // Bye for odd player
            }
        }
        this.currentMatchIndex = 0;
    }

    getNextMatch() {
        if (this.currentMatchIndex >= this.bracket.length) {
            this.prepareNextRound(); // Prepare the next round if the current one is complete
            return null; // No more matches in the current round
        }

        const match = this.bracket[this.currentMatchIndex];
        this.currentMatchIndex++;
        return match;
    }

    recordMatchWinner(winner) {
        this.matchWinners.push(winner); // Add the match winner to the list
        if (this.matchWinners.length === this.bracket.length) {
            // If all matches in the current round are complete, move to the next round
            this.prepareNextRound();
        }
    }

    prepareNextRound() {
        // If only one player remains, they are the tournament winner
        if (this.matchWinners.length === 1) {
            console.log(`Tournament Winner: ${this.matchWinners[0]}`);
            alert(`Tournament Winner: ${this.matchWinners[0]}`);
            this.onTournamentEnd(); // Call the callback to signal the end
            return;
        }

        // Update players for the next round based on the winners
        this.players = this.matchWinners;
        this.matchWinners = []; // Clear match winners for the new round
        this.createBracket(); // Create a new bracket for the next round
        this.currentRound++;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
