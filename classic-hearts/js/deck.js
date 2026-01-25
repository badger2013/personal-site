// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

Hearts.Deck = {
    /**
     * Gets the next card based on the suit passed.
     * @param {Card[]} cards the cards to examine
     * @param {string} suit
     * @returns {Card} the card
     */
    getNextCardBySuit: function (cards, suit) {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].suit === suit) {
                return cards.splice(i, 1)[0];
            }
        }

        // No card with the passed suit exists
        return null;
    },

    /**
     * Sorts the passed cards by rank and suit.
     * @param {Card[]} inputCards the cards to sort
     * @returns {Card[]} the sorted cards
     */
    sortCards: function (inputCards) {
        var sortedCards = [];

        // Split up the player's cards by suit
        var cards = {
            [HeartsConstants.heart]: [],
            [HeartsConstants.spade]: [],
            [HeartsConstants.diamond]: [],
            [HeartsConstants.club]: []
        };

        var card = null;

        for (var suit in cards) {
            card = {};

            while (card) {
                card = Hearts.Deck.getNextCardBySuit(inputCards, suit);

                if (card) {
                    cards[suit].push(card);
                }
            }

            cards[suit].sort(function (a, b) {
                if (a.getValue() > b.getValue()) {
                    return -1;
                }
                if (a.getValue() < b.getValue()) {
                    return 1;
                }
        
                return 0;
            });
        }

        for (var suit in cards) {
            for (var i = 0; i < cards[suit].length; i++) {
                sortedCards.push(cards[suit][i]);
            }
        }

        return sortedCards;
    },

    /**
     * Using the round's deck, this function deals cards to players.
     */
    deal: function () {
        var humanCards = [];

        while (Hearts.Game.round.deck.length > 0) {
            for (var key in Hearts.Game.players) {
                var card = Hearts.Game.round.deck.pop();

                if (key === HeartsConstants.humanPlayer) {
                    humanCards.push(card);
                }
                else {
                    Hearts.Game.players[key].addCard(card);
                }
            }
        }

        humanCards = Hearts.Deck.sortCards(humanCards);

        var coordinates = Hearts.Graphics.getHumanCardCoordinates(humanCards.length);

        for (var i = 0; i < humanCards.length; i++) {
            humanCards[i].setX(coordinates.startX);
            humanCards[i].setY(coordinates.startY);
            humanCards[i].move(coordinates.endX + (coordinates.spacing * (i + 1)), coordinates.y);
            Hearts.Game.players[HeartsConstants.humanPlayer].addCard(humanCards[i]);
        }
    },

    /**
     * Shuffles the passed cards and returns the result.
     * @param {Card[]} cards 
     */
    shuffle: function (cards) {
        var shuffled = [];

        while (cards[0]) {
            var randomIndex = Math.floor(Math.random() * cards.length);

            shuffled.push(cards.splice(randomIndex, 1)[0]);
        }

        return shuffled;
    },

    getRank: function (value) {
        switch (value) {
            case 10: return "10";
            case 11: return HeartsConstants.jack;
            case 12: return HeartsConstants.queen;
            case 13: return HeartsConstants.king;
            case 14: return HeartsConstants.ace;
            default: return value.toString();
        }
    },

    /**
     * Builds a deck of cards and returns them as an array of Cards.
     */
    build: function () {
        var deck = [];
        var suits = [
            HeartsConstants.heart, 
            HeartsConstants.diamond,
            HeartsConstants.club,
            HeartsConstants.spade
        ];

        while (suits.length > 0) {
            var suit = suits.shift();

            for (var i = 2; i < 15; i++) {
                var rank = this.getRank(i);
                var points = 0;

                if (suit === HeartsConstants.heart) {
                    points = 1;
                }
                else if (suit === HeartsConstants.spade && rank === HeartsConstants.queen) {
                    points = 13;
                }

                deck.push(new Card(suit, rank, points));
            }
        }

        return deck;
    }
};
