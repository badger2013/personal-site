// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * Hearts Rules:
 * 1) Starting rule: only the 2 of clubs may be played at the start of the game
 * 2) Follow suit: players must follow suit if they are able to do so
 * 3) Hearts must be broken: players cannot play a Heart until Hearts have been broken
 */
 Hearts.Rules = {
    /**
     * Checks if the end of the game has been reached based on the total scores.
     */
    checkForEnd: function (totalScores) {
        for (let key in totalScores) {
            if (totalScores[key] >= Hearts.Game.settings.endGameScore) {
                return true;
            }
        }
    
        return false;
    },

    /**
     * Checks if someone shot the moon in the passed round.
     * If so, the scores for the round are updated.
     * @param {HeartsRound} round the current round
     */
    shotTheMoon: function (round) {
        // A player shoots the moon if they won all points in the round
        // When this happens the player who shot the moon incurs no points
        // While the other players each receive 26 points
        var moonPlayer = "";

        for (var id in round.scores) {
            if (round.scores[id] === 26) {
                round.scores[id] = 0;
                moonPlayer = id;
                break;
            }
        }

        if (moonPlayer) {
            for (var id in round.scores) {
                if (round.scores[id] !== moonPlayer) {
                    round.scores[id] = 26;
                }
            }
        }
    },

    /**
     * Checks if the "Starting rule" (rule #1) is being violated.
     * Returns true if it is not.
     * @param {string} card the card ID
     * @param {boolean} skipMessage if true, no message is shown
     */
    validateStartCard: function (card, player, skipMessage) {
        if (Hearts.Game.round.started === false && card !== "2C") {
            if (!skipMessage && player.ai === false) {
                Hearts.Messages.showMessage(Hearts.Strings.mustPlay2C);
            }

            return false;
        }

        return true;
    },

    /**
     * Checks if "Follow suit" (rule #2) is being violated.
     * Returns true if it is not.
     * @param {string} card the card ID
     * @param {Player} player the player
     * @param {boolean} skipMessage if true, no message is shown
     */
    validateSuit: function (card, player, skipMessage) {
        var cardSuit = card.match(/H|D|S|C/)[0];
        var turnSuit = Hearts.Game.round.turn.getTurnSuit();

        if (turnSuit && turnSuit !== cardSuit && player.hasCardSuit(turnSuit)) {
            if (!skipMessage && player.ai === false) {
                Hearts.Messages.showMessage(Hearts.Strings.followSuit);
            }
            
            return false;
        }

        return true;
    },

    /**
     * Checks if "Hearts must be broken" (rule #3) is being violated.
     * Returns true if it is not.
     * @param {string} card the card ID
     * @param {Player} player the player
     * @param {boolean} skipMessage if true, no message is shown
     */
    validateHeartsPlay: function (card, player, skipMessage) {
        var isHeart = card.indexOf("H") !== -1;
        var heartsBroken = Hearts.Game.round.heartsBroken;
        var turnSuit = Hearts.Game.round.turn.getTurnSuit();
        var canFollowSuit = player.hasCardSuit(turnSuit);
        var turnStarted = Hearts.Game.round.turn.started;

        if (isHeart && !heartsBroken && (canFollowSuit || !turnStarted)) {
            if (!skipMessage && player.ai === false) {
                Hearts.Messages.showMessage(Hearts.Strings.heartsNotBroken);
            }

            return false;
        }

        return true;
    },

    /**
     * Validates that no points are being played in the first turn.
     * Returns true if not.
     * @param {string} card the card ID
     * @param {Player} player the player
     * @param {boolean} skipMessage if true, no message is shown
     */
    validateStartPoints: function (card, player, skipMessage) {
        // No points may be played on the first turn
        if (Hearts.Game.round.turnNum === 1 && /H|QS/.test(card)) {
            if (!skipMessage && player.ai === false) {
                Hearts.Messages.showMessage(Hearts.Strings.noPointsStart);
            }

            return false;
        }

        return true;
    },

    /**
     * Gets the cards the passed player can play in this turn.
     * @param {Player} player the player
     * @returns {Card[]} the playable cards
     */
    getPlayableCards: function (player) {
        var playableCards = [];

        // First, get the cards that can be played
        for (var card of player.cards) {
            if (Hearts.Rules.isValidMove(card.id, player, true)) {
                playableCards.push(card);
            }
        }

        if (playableCards.length === 0) {
            // All cards are playable
            playableCards = player.cards;
        }

        return playableCards;
    },

    /**
     * Gets the winning card for the current trick.
     * @param {Card[]} playedCards the cards that were played
     * @param {string} turnSuit the suit for the turn
     * @returns {Card} the winning card
     */
    getWinningCard: function (playedCards, turnSuit) {
        var winningCard = null;

        for (var i = 0; i < playedCards.length; i++) {
            var currCardValue = playedCards[i].getValue();
            var winningCardValue = winningCard ? winningCard.getValue() : 0;
            
            if (winningCard === null || currCardValue > winningCardValue) {
                if (playedCards[i].suit === turnSuit) {
                    winningCard = playedCards[i];
                }
            }
        }

        return winningCard;
    },

    /**
     * Checks if the passed move is valid.
     * @param {string} card the card to be moved (e.g, "7D")
     * @param {Player} player the player attempting to make the move
     * @param {boolean} skipMessage if true, no messages are shown
     * @returns {boolean} a boolean indicating whether or not the move is valid
     */
    isValidMove: function (card, player, skipMessage) {
        if (!Hearts.Rules.validateStartCard(card, player, skipMessage)) {
            return false;
        }
        if (!Hearts.Rules.validateStartPoints(card, player, skipMessage)) {
            return false;
        }
        if (!Hearts.Rules.validateSuit(card, player, skipMessage)) {
            return false;
        }
        if (!Hearts.Rules.validateHeartsPlay(card, player, skipMessage)) {
            return false;
        }

        return true;
    }
};
