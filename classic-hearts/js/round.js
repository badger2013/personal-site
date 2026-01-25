// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * Represents one round in a Hearts game.
 * A round contains multiple turns.
 */
 function HeartsRound() {
    this.turn = new HeartsTurn();

    // The current turn number
    this.turnNum = 1;

    // A dictionary; the key is the player ID, the value is the score
    this.scores = {};

    // The deck of available cards
    this.deck = null;

    // Indicates whether or not hearts have been broken for this round
    this.heartsBroken = false;

    // Indicates whether or not the 2 of clubs has been played to commence play
    this.started = false;

    this.addToScore = function (player, score) {
        if (this.scores[player]) {
            this.scores[player] += score;
        }
        else {
            this.scores[player] = score;
        }
    };

    /**
     * Updates the total scores for the game with the round's current scores.
     * @param {any} totalScores 
     */
    this.updateTotalScores = function (totalScores) {
        for (let key in this.scores) {
            if (totalScores[key]) {
                totalScores[key] += this.scores[key];
            }
            else {
                totalScores[key] = this.scores[key];
            }
        }
    };

    /**
     * Starts a round.
     * @param {Player} startingPlayer the player who must start the round
     */
    this.start = function (startingPlayer) {
        this.turn.currPlayer = startingPlayer.id;

        if (startingPlayer.ai) {
            HeartsHelpers.makeMove(startingPlayer, "2C");
        }
        else {
            Hearts.Messages.showMessage(Hearts.Strings.has2C);
        }

        g_Engine.setMode(HeartsConstants.playMode);
    };
}
