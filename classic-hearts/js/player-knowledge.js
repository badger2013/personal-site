// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

function PlayerKnowledge() {
    // A dictionary
    // The key is the player ID
    // The value is an object with three properties
    // CardsPlayed: the cards that player has been observed to play
    // Cards: the cards that the player is known to have in their possession
    // Suits: a dictionary whose key is the suit, and whose value indicates
    //       if the player is short on that suit
    //       a -1 indicates this is unknown
    //       a 0 indicates that the player is likely not short on the suit
    //       a 1 indicates that the player is short on the suit
    this.players = {};

    /**
     * Initializes the knowledge about each player.
     * @param {string} id the player id that has this knowledge
     */
    this.init = function (id) {
        for (var player in Hearts.Game.players) {
            if (player !== id) {
                this.players[player] = {
                    cardsPlayed: [],
                    cards: [],
                    suits: this.getSuitsObject()
                };
            }
        }
    };

    /**
     * Acts as a factory that creates a new object to hold knowledge about suits.
     * @returns {object} the suits object
     */
    this.getSuitsObject = function () {
        var suits = {};

        suits[HeartsConstants.heart] = -1;
        suits[HeartsConstants.diamond] = -1;
        suits[HeartsConstants.club] = -1;
        suits[HeartsConstants.spade] = -1;

        return suits;
    };

    /**
     * Updates the player knowledge with the passed information.
     * @param {string} move 
     * @param {string} player 
     * @param {object[]} playerShortSuit 
     */
    this.update = function (move, player, playerShortSuit) {
        this.players[player].cardsPlayed.push(move);

        var cardIndexToRemove = -1;

        for (var i = 0; i < this.players[player].cards.length; i++) {
            if (this.players[player].cards[i].id === move) {
                cardIndexToRemove = i;
                break;
            }
        }

        if (cardIndexToRemove !== -1) {
            this.players[player].cards.splice(cardIndexToRemove, 1);
        }

        for (var i = 0; i < playerShortSuit.length; i++) {
            this.players[player].suits[playerShortSuit[i].suit] = playerShortSuit[i].short;
        }
    };

    /**
     * Updates the cards that the passed player is known to have in their possession.
     * @param {Card[]} cards the cards the player has
     * @param {Player} player the player
     */
    this.updateCards = function (cards, player) {
        for (var i = 0; i < cards.length; i++) {
            this.players[player].cards.push(cards[i]);

            // The player is not short on this suit
            this.players[player].suits[cards[i].suit] = 0;

            // Mark the card as known
            cards[i].isKnown = true;
        }
    };
}
