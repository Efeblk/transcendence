class Tournament {
    constructor(api, gameUI) {
        this.api = api;
        this.gameUI = gameUI;
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
                this.gameUI.showMessage('Not enough players for a tournament!');
                return false;
            }

            this.players = this.shuffleArray(this.players);
            this.createBracket();
            return true; // Tournament initialized successfully
        } catch (error) {
            console.error('Error initializing tournament:', error);
            return false;
        }
    }

    createBracket() {
        for (let i = 0; i < this.players.length; i += 2) {
            if (this.players[i + 1]) {
                this.bracket.push([this.players[i], this.players[i + 1]]);
            } else {
                this.bracket.push([this.players[i], null]); // Bye for odd player
            }
        }
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

    advanceToNextRound() {
        console.log('Advancing to the next round...');
        const winners = this.bracket.map(match => (match[1] === null ? match[0] : this.getWinner(match[0], match[1])));

        if (winners.length === 1) {
            console.log(`Tournament Winner: ${winners[0]}`);
            this.gameUI.showMessage(`Tournament Winner: ${winners[0]}`);
            return;
        }

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

    getWinner(player1, player2) {
        // Placeholder for actual match result
        return Math.random() > 0.5 ? player1 : player2;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
