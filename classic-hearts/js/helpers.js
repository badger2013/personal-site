// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

var HeartsHelpers = {
    getPlayerToPassTo: function (from) {
        switch (Hearts.Game.currentPassTo) {
            case HeartsConstants.passLeft:
                switch (from) {
                    case HeartsConstants.humanPlayer: return "C1";
                    case "C1": return "C2";
                    case "C2": return "C3";
                    case "C3": return HeartsConstants.humanPlayer;
                }
            case HeartsConstants.passAcross:
                switch (from) {
                    case HeartsConstants.humanPlayer: return "C2";
                    case "C1": return "C3";
                    case "C2": return HeartsConstants.humanPlayer;
                    case "C3": return "C1";
                }
            case HeartsConstants.passRight:
                switch (from) {
                    case HeartsConstants.humanPlayer: return "C3";
                    case "C1": return HeartsConstants.humanPlayer;
                    case "C2": return "C1";
                    case "C3": return "C2";
                }
        }
    },

    /**
     * Makes a move for an AI player.
     * @param {Player} player the player who is making the move
     * @param {any} move the move - this could be a Card object or a string representing a card
     */
    makeMove: function (player, move) {
        var location = null;

        switch (player.id) {
            case "H": location = HeartsConstants.bottom; break;
            case "C0": location = HeartsConstants.bottom; break;
            case "C1": location = HeartsConstants.middleLeft; break;
            case "C2": location = HeartsConstants.top; break;
            case "C3": location = HeartsConstants.middleRight; break;
            default: throw "No location mapping for: " + player.id;
        }

        // Get the string representation of the move if it's an object
        // Otherwise, assume it's a string already
        if (typeof move === "object") {
            move = move.id;
        }

        g_Engine.updateCardPosition(typeof move === "object" ? move : player.getCard(move), location);
        Hearts.Game.registerMove(move, player.id, typeof move === "object" ? move : null);
    },
};
