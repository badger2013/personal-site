// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

Hearts.AI = {
    /**
     * Picks a move for the AI to make.
     * @param {Player} player the AI player
     * @returns {string} the move to make, expressed as a string (e.g., "7D")
     */
    pickMove: function (player) {
        var playableCards = Hearts.Rules.getPlayableCards(player);

        // Get the cards in the game that have not been played yet
        // Note: This excludes the cards of the current player
        // For example:
        // Turn: 2
        // Current player = C3
        // C2 remaining cards = 11
        // C3 remaining cards = 12
        // H remaining cards = 12
        // C4 remaining cards = 12
        // Remaining cards = 11 + 12 + 12 = 35
        var remainingCards = Hearts.Game.getRemainingCards(player.id);

        // Guess the hand of each player by assigning these cards
        // Based on the AI's knowledge of what they've played
        // Store this is in a dictionary where the key is the player ID
        // And the value is an array of Card objects
        var hands = {};
        var suits = {};

        // First, pass out the cards to players which this player is sure has them
        for (var key in player.knowledge.players) {
            if (key !== player.id) {
                if (!hands[key]) {
                    hands[key] = [];
                }
                for (var i = 0; i < player.knowledge.players[key].cards.length; i++) {
                    for (var j = 0; j < remainingCards.length; j++) {
                        if (remainingCards[j].id === player.knowledge.players[key].cards[i].id) {
                            hands[key].push(remainingCards.splice(j, 1)[0]);
                        }
                    }
                }
                for (var suit in player.knowledge.players[key].suits) {
                    if (!suits[suit]) {
                        suits[suit] = [];
                    }
                    // Keep track of the players who do have a particular suit
                    if (player.knowledge.players[key].suits[suit] < 1) {
                        suits[suit].push(key);
                    }
                }
            }
        }

        // For each suit, deal cards to the players that have the suit
        for (var suit in suits) {
            var j = 0;
            var i = 0;

            while (i < remainingCards.length) {
                if (remainingCards[i].suit === suit) {
                    hands[suits[suit][j]].push(remainingCards.splice(i, 1)[0]);
                    j++;

                    if (j > suits[suit].length - 1) {
                        j = 0;
                    }
                }
                else {
                    i++;
                }
            }
        }

        // Winnow down the cards in each guessed hand based on what's playable for the current turn
        if (Hearts.Game.round.turn.started) {
            // Get the players that have already played this turn so that they can be skipped
            // When guessing what cards will be played
            var skipPlayers = Hearts.Game.round.turn.getPlayers();

            for (var key in hands) {
                if (skipPlayers.indexOf(key) === -1) {
                    var mockPlayer = new Player(
                        key,
                        Hearts.Game.players[key].ai,
                        hands[key],
                        Hearts.Game.players[key].wonCards,
                        Hearts.Game.players[key].wonTricks,
                        Hearts.Game.players[key].knowledge
                    );

                    hands[key] = Hearts.Rules.getPlayableCards(mockPlayer);
                }
                else {
                    delete hands[key];
                }
            }

            var remainingPlayableCards = [];
            var remainingPlayers = Hearts.Game.round.turn.getRemainingPlayers();

            for (var i = 0; i < remainingPlayers.length; i++) {
                for (var key in hands) {
                    if (key === remainingPlayers[i]) {
                        remainingPlayableCards.push(hands[key]);
                        break;
                    }
                }

                delete hands[remainingPlayers[i]];
            }

            var turnSuit = Hearts.Game.round.turn.getTurnSuit();
            var playedCards = Hearts.Game.round.turn.copyPlayedCards();
            playedCards.push(playableCards[0]);
            // An array of objects
            // The key for the object is a card ID
            // The value is the worst outcome for playing that card
            var outcomes = [];

            if (remainingPlayableCards.length === 0) {
                remainingPlayableCards.push([""]);
            }

            // Cycle through each playable card for the AI player trying to make a decision
            for (var i = 0; i < playableCards.length; i++) {
                var worstOutcome = null;

                for (var j = 0; j < remainingPlayableCards.length; j++) {
                    for (var l = 0; l < remainingPlayableCards[j].length; l++) {
                        if (remainingPlayableCards[j][l]) {
                            playedCards.push(remainingPlayableCards[j][l]);
                        }

                        var winningCard = Hearts.Rules.getWinningCard(playedCards, turnSuit);
                        var playedCardsString = "";
                        var points = 0;

                        for (var k = 0; k < playedCards.length; k++) {
                            points += playedCards[k].points;
                            playedCardsString += playedCards[k].id + ", ";
                        }

                        // For debugging
                        playedCardsString = playedCardsString.substring(0, playedCardsString.length - 2);

                        if (points !== 0 && winningCard.id === playableCards[i].id) {
                            points *= -1;
                        }

                        if (!worstOutcome || worstOutcome[Object.keys(worstOutcome)[0]].points < points) {
                            worstOutcome = {
                                [playableCards[i].id]: {
                                    points: points,
                                    playedCards: playedCardsString
                                }
                            };
                        }
                        playedCards = Hearts.Game.round.turn.copyPlayedCards();
                        playedCards.push(playableCards[i]);
                    }
                }

                outcomes.push(worstOutcome);
            }

            // Sort the outcomes
            outcomes.sort(function (a, b) {
                if (!a || !b) {
                    return 0;
                }
                if (!a[0] || !b[0]) {
                    return 0;
                }
                let objA = a[Object.keys(a)[0]];
                let objB = b[Object.keys(b)[0]];

                if (objA.points > objB.points) {
                    return -1;
                }
                if (objA.points < objB.points) {
                    return 1;
                }

                return 0;
            });

            if (outcomes[0]) {
                var card = Object.keys(outcomes[0])[0];

                if (card) {
                    return card;
                }
            }
        }

        return playableCards[0].id;
    },

    /**
     * Determine if there is the possibility of shorting a suit.
     * "Shorting a suit" means that passing cards gives a player 0 or 1
     * card remaining of that suit.
     */
    shouldShortSuit: function (player) {
        var suitCount = {};

        // Loop through the player's cards and get a count of all cards by suit    
        for (var i = 0; i < player.cards.length; i++) {
            if (suitCount[player.cards[i].suit]) {
                suitCount[player.cards[i].suit]++;
            }
            else {
                suitCount[player.cards[i].suit] = 1;
            }
        }

        var lowSuit = null;
        var lowSuitCount = null;

        // Find the lowest suit count
        for (var suit in suitCount) {
            if (lowSuitCount === null || suitCount[suit] < lowSuitCount) {
                lowSuit = suit;
                lowSuitCount = suitCount[suit];
            }
        }

        return lowSuitCount <= 4 ? lowSuit : null;
    },

    /**
     * Passes cards for all AI players in the game.
     */
    passCards: function (players) {
        var numCardsToPass = 3;

        for (var key in players) {
            if (players[key].ai) {
                var removedCards = [];

                // There are two possible strategies the AI player will use
                // 1) short a suit
                // 2) pass high value cards
                var lowSuit = Hearts.AI.shouldShortSuit(players[key]);

                if (lowSuit) {
                    for (var j = 0; j < numCardsToPass; j++) {
                        var tempCard = players[key].getNextCardBySuit(lowSuit);

                        removedCards.push(tempCard || players[key].getNextCardByValue());
                    }
                }
                else {
                    for (var j = 0; j < numCardsToPass; j++) {
                        removedCards.push(players[key].getNextCardByValue());
                    }
                }

                var cId = HeartsHelpers.getPlayerToPassTo(key);

                // Remember that these cards are being passed
                players[key].updateCardKnowledge(removedCards, cId);

                for (var removedCard of removedCards) {
                    players[cId].addCard(removedCard, true);

                    if (!players[cId].ai) {
                        removedCard.mark(HeartsConstants.markPass);
                    }
                }
            }
        }
    }
};
