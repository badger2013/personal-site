// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

Hearts.Messages = {
    helpTipShown: false,
    history: [],

    /**
     * Shows the passed message in the message bar.
     * Additionally, this prints the message to the console.
     * @param {string} message the message
     * @returns {void}
     */
    showMessage: function (message) {
        g_Engine.message = message;
        this.history.push(message);
        console.info(message);
    },

    /**
     * Gets the last message that was shown.
     * @returns {string} the message
     */
    getLastMessage: function () {
        if (this.history.length < 2) {
            return this.history[this.history.length - 1];
        }

        return this.history[this.history.length - 2];
    },

    /**
     * Shows the passing message.
     * @param {string} direction the direction to pass to
     * @returns {void}
     */
    showPassingMessage: function (direction) {
        Hearts.Messages.showMessage(Hearts.Messages.getPassingMessage(direction));
    },

    /**
     * Shows the end of turn message.
     * @param {string} player the player who won the trick
     * @returns {void}
     */
    showEndTurnMessage: function (player) {
        Hearts.Messages.showMessage(Hearts.Messages.getEndTurnMessage(player));
    },

    /**
     * Removes the current message (if any).
     * @returns {void}
     */
    removeMessage: function () {
        g_Engine.message = null;
    },

    /**
     * Gets the passing message to show based on the passed direction.
     * @param {string} direction the direction to pass
     * @returns {string} the passing message
     */
    getPassingMessage: function (direction) {
        var message = Hearts.Strings.cardsToPass;
    
        switch (direction) {
            case HeartsConstants.passLeft:
                message += " to the left.";
                break;
            case HeartsConstants.passRight:
                message += " to the right.";
                break;
            case HeartsConstants.passAcross:
                message += " across the table.";
                break;
        }

        if (!this.helpTipShown) {
            message += " Press \"H\" for help.";
            this.helpTipShown = true;
        }
    
        return message;
    },

    /**
     * Gets the end of turn message to show based on the passed player.
     * @param {string} player the player who won the trick
     * @returns {string} the end of turn message
     */
    getEndTurnMessage: function (player) {
        var message = player === HeartsConstants.humanPlayer ? "You" : "Computer player " + player.match(/[0-9]{1}/)[0];
    
        message += " won the trick!";
    
        return message;
    }
};
