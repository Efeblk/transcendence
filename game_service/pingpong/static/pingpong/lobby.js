class Lobby {
    constructor(name, creator, capacity) {
        this.name = name;
        this.creator = creator;
        this.players = [creator]; // Initialize with the creator
        this.capacity = capacity;
    }

    addPlayer(player) {
        if (this.players.length < capacity) { // Assuming a 2-player lobby
            this.players.push(player);
            console.log(`${player} joined the lobby: ${this.name}`);
            return true;
        } else {
            console.log(`Lobby ${this.name} is full!`);
            return false;
        }
    }

    isFull() {
        return this.players.length >= this.capacity;
    }
}