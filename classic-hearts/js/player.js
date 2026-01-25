// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * Represents one player in the game.
 * @param {string} id 
 * @param {boolean} ai
 * @param {Card[]} cards optional
 * @param {object} wonCards optional
 * @param {object} wonTricks optional
 * @param {object} knowledge optional
 */
 function Player(id, ai, cards, sort, wonCards, wonTricks, knowledge) {
    /**
     * The cards that the player has in their hand.
     * @type {Card[]}
     */
    this.cards = cards || [];

    // Indicates whether or not the player is AI controlled or not
    this.ai = ai;

    // A unique identifier for the player
    this.id = id;
    this.wonCards = {};
    this.wonTricks = {};
    
    /**
     * The knowledge that this player has about other players.
     */
    this.knowledge = knowledge ? knowledge : ai ? new PlayerKnowledge() : null;

    /**
     * Adds a card to the player's hand.
     * @param {Card} card the card to add, as a Card object.
     * @param {boolean} passed indicates whether or not the card was passed to this player
     */
    this.addCard = function (card, passed) {
        card.passed = passed || false;
        this.cards.push(card);
    };

    /**
     * Removes the card with the passed ID, and returns it.
     */
    this.removeCard = function (cardId) {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id === cardId) {
                return this.cards.splice(i, 1)[0];
            }
        }

        return null;
    };

    /**
     * Gets whatever the next card is in the player's hand (from left to right);
     */
    this.getNextCard = function () {
        return this.cards.shift();
    };

    /**
     * Gets the next card based on the suit passed.
     * @param {string} suit
     * @param {boolean} includePassed indicates whether passed cards should be included
     * @param {string[]} skip an array of card IDs to skip
     * @param {boolean} idOnly indicates whether or not an ID should only be returned
     * @returns {Card|string} the card
     */
    this.getNextCardBySuit = function (suit, includePassed, skip, idOnly) {
        skip = skip || [];

        for (let i = 0; i < this.cards.length; i++) {
            if ((!this.cards[i].passed || includePassed) && this.cards[i].suit === suit && skip.indexOf(this.cards[i].id) === -1) {
                if (idOnly) {
                    return this.cards[i].id;
                }
                
                return this.cards.splice(i, 1)[0];
            }
        }

        // No card with the passed suit exists
        return null;
    };

    /**
     * Gets the next highest card, by value.
     * @param {boolean} includePassed indicates whether passed cards should be included
     * @param {string[]} skip an array of card IDs to skip
     * @param {boolean} idOnly indicates whether or not an ID should only be returned
     * @returns {Card|string} the card
     */
    this.getNextCardByValue = function (includePassed, skip, idOnly) {
        var hCard = null;
        var index = null;

        skip = skip || [];

        for (var i = 0; i < this.cards.length; i++) {
            if (hCard === null || ((!this.cards[i].passed || includePassed) && this.cards[i].getValue(true, 10) > hCard.getValue(true, 10)) && skip.indexOf(this.cards[i].id) === -1) {
                hCard = this.cards[i];
                index = i;
            }
        }

        if (idOnly) {
            return this.cards[index].id;
        }

        return this.cards.splice(index, 1)[0];
    };

    this.getNextCardByLowValue = function (idOnly) {
        var lCard = null;
        var index = null;

        for (var i = 0; i < this.cards.length; i++) {
            if (!lCard || this.cards[i].getValue(true, 10) < lCard.getValue(true, 10)) {
                lCard = this.cards[i];
                index = i;
            }
        }

        if (idOnly) {
            return this.cards[index].id;
        }

        return this.cards.splice(index, 1)[0];
    };

    /**
     * Returns true if the player has the card with the 
     * passed ID in their hand.
     */
    this.hasCard = function (cardId) {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id === cardId) {
                return true;
            }
        }

        return false;
    };

    /**
     * Returns the friendly name of the player.
     * @param {boolean} startOfSentence indicates where the named will be inserted
     */
    this.getFriendlyName = function (startOfSentence) {
        switch (this.id) {
            case "H": return startOfSentence ? "The Human Player" : "Human Player";
            case "C0": return "Computer Player 0";
            case "C1": return "Computer Player 1";
            case "C2": return "Computer Player 2";
            case "C3": return "Computer Player 3";
        }
    };

    /**
     * Returns true if the player has at least one card in their hand with the passed suit.
     * @param {string} suit the suit to look for
     * @returns {boolean} true if the player has a card with that suit
     */
    this.hasCardSuit = function (suit) {
        for (let card of this.cards) {
            if (card.suit === suit) {
                return true;
            }
        }

        return false;
    };

    /**
     * Sorts the cards in the player's hand.
     */
    this.sortCards = function () {
        this.cards = Hearts.Deck.sortCards(this.cards);

        var coordinates = Hearts.Graphics.getHumanCardCoordinates(this.cards.length);

        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].setX(coordinates.endX + (coordinates.spacing * (i + 1)));
            this.cards[i].setY(coordinates.y);
            this.cards[i].move(this.cards[i].x, this.cards[i].y);
        }
    };

    /**
     * Adds the passed cards as cards that have been "won" through tricks for the player.
     * @param {Card[]} cards 
     * @param {number} round the round the cards were won in
     */
    this.addWonCards = function (cards, round) {
        if (!this.wonCards[round]) {
            this.wonCards[round] = [];
        }
        if (typeof this.wonTricks[round] !== "number") {
            this.wonTricks[round] = 0;
        }

        this.wonTricks[round]++;

        for (var i = 0; i < cards.length; i++) {
            this.wonCards[round].push({
                trick: this.wonTricks[round],
                card: cards[i]
            });
        }
    };

    /**
     * Returns the cards the player has won.
     * @param {number} round the round the cards were won in
     * @returns {any[]}
     */
    this.getWonCards = function (round) {
        return this.wonCards[round] || [];
    };

    this.getCard = function (id) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id === id) {
                return this.cards[i];
            }
        }

        return null;
    };

    /**
     * Updates this player's knowledge about the cards that have been played.
     * Additionally, this function also updates the player's knowledge of whether another player is short on a suit.
     * @param {string} move the card that was played (e.g., "7D")
     * @param {string} player the ID of the player that made the move (e.g., "H")
     * @param {object[]} playerShortSuit an object array with information on whether the player is short on the played suit
     */
    this.updateKnowledge = function (move, player, playerShortSuit) {
        this.knowledge.update(move, player, playerShortSuit);
    };

    this.updateCardKnowledge = function (cards, player) {
        this.knowledge.updateCards(cards, player);
    };
}
