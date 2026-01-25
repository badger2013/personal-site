// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * Represents one turn in a Hearts game.
 */
function HeartsTurn() {
    // An array of Card objects
    // This tracks the cards that have been played on a turn
    // Cards that are played are immediately removed from the player's hand
    this.playedCards = [];

    // Indicates whether or not the turn has started
    this.started = false;

    this.currPlayer = "";

    this.addPlayedCard = function (card) {
        if (typeof card !== "object") {
            throw "Unsupported input: " + card;
        }
    
        this.playedCards.push(card);
    };
    
    this.getNumPlayedCards = function () {
        return this.playedCards.length;
    };
    
    this.getTurnSuit = function () {
        return this.playedCards[0] ? this.playedCards[0].suit : null;
    };
    
    this.getTurnPoints = function () {
        let points = 0;
    
        for (let i = 0; i < this.playedCards.length; i++) {
            points += this.playedCards[i].points;
        }
    
        return points;
    };

    this.getPlayers = function () {
        var players = [];

        for (var i = 0; i < this.playedCards.length; i++) {
            players.push(this.playedCards[i].playedBy);
        }

        return players;
    };

    this.getNextPlayer = function (currPlayer) {
        switch (currPlayer) {
            case HeartsConstants.humanPlayer: return "C1";
            case "C1": return "C2";
            case "C2": return "C3";
            case "C3": return HeartsConstants.humanPlayer;
        }
    };

    /**
     * Gets the remaining players in the turn.
     * Note: This excludes the current player.
     * @returns {string[]} an array of player IDs
     */
    this.getRemainingPlayers = function () {
        var cardsRemaining = 4 - this.playedCards.length;
        var remainingPlayers = [];

        if (cardsRemaining <= 1) {
            return remainingPlayers;
        }

        var tempPlayer = this.currPlayer;

        // Exclude the current player
        cardsRemaining--;

        for (var i = 0; i < cardsRemaining; i++) {
            tempPlayer = this.getNextPlayer(tempPlayer)
            remainingPlayers.push(tempPlayer);
        }

        return remainingPlayers;
    };

    /**
     * Does a deep copy of the turn's played cards.
     * @returns {Card[]} the copy of the turn's played cards
     */
    this.copyPlayedCards = function () {
        var copy = [];

        for (var i = 0; i < this.playedCards.length; i++) {
            copy.push(this.playedCards[i]);
        }

        return copy;
    }
}
