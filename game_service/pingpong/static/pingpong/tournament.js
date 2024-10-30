class Tournament {
    constructor(api, gameUI, onTournamentEnd) {
        this.api = api;
        this.gameUI = gameUI;
        this.onTournamentEnd = onTournamentEnd; // Callback function for ending the tournament
        this.players = [];
        this.bracket = [];
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
            this.advanceToNextRound();
            return null; // No more matches in the current round
        }

        const match = this.bracket[this.currentMatchIndex];
        this.currentMatchIndex++;
        return match;
    }

    advanceToNextRound(winner) {
        console.log('Advancing to the next round...');

        // Collect winners from the current round
        const winners = this.bracket.map(match => {
            // Player advances automatically if there's no opponent
            return match[1] === null ? match[0] : (match.includes(winner) ? winner : null);
        }).filter(player => player !== null); // Filter out nulls

        if (winners.length === 1) {
            // If there's only one player left, they are the tournament winner
            console.log(`Tournament Winner: ${winners[0]}`);
            alert(`Tournament Winner: ${winners[0]}`);
            this.onTournamentEnd(); // Call the callback to signal the end
            return;
        }

        // Create a new bracket for the next round
        this.bracket = [];
        for (let i = 0; i < winners.length; i += 2) {
            if (winners[i + 1]) {
                this.bracket.push([winners[i], winners[i + 1]]);
            } else {
                this.bracket.push([winners[i], null]); // Bye for odd player
            }
        }

        this.currentMatchIndex = 0;
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
