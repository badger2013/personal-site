// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * Represents one card.
 */
 function Card(_suit, _rank, _points, _passed, _isKnown) {
    /**
     * @type {HTMLImageElement}
     */
    this.element = null;
    this.x = 0;
    this.y = 0;
    this.destX = 0;
    this.destY = 0;
    this.width = 127;
    this.height = 164;
    this.maxX = (window.innerWidth || window.screen.width) - this.width;
    this.maxY = (window.innerHeight || window.screen.height) - this.height;
    this.speed = 10;
    /**
     * @type {string}
     */
    this.id = null;
    /**
     * @type {string}
     */
    this.description = null;
    this.selected = false;
    this.suit = _suit;
    this.rank = _rank;
    this.id = this.rank + this.suit;

    // The points of the card, for use with scoring
    this.points = _points;

    // Tracks who played the card
    // This is a string ID for the player
    this.playedBy = null;

    /**
     * Indicates how long a card should be marked.
     * The value is a countdown that is decreased by 1 each frame.
     * @type {any}
     */
    this.marker = {
        value: -1,
        baseValue: -1,
        type: null
    };

    /**
     * Indicates whether or not this card was passed.
     */
    this.passed = _passed || false;
    /**
     * Indicates whether or not one or more players is aware of which player has this card.
     */
    this.isKnown = _isKnown || false;

    /**
     * Returns the value of the card.
     * This is used when determining the trick winner.
     * It can also be used as a way to determine a card's intrinsic value.
     */
    this.getValue = function (addPoints, weight) {
        var value;

        switch (this.rank) {
            case HeartsConstants.ace:
                value = 14;
                break;
            case HeartsConstants.king:
                value = 13;
                break;
            case HeartsConstants.queen:
                value = 12;
                break;
            case HeartsConstants.jack:
                value = 11;
                break;
            default:
                value = parseInt(this.rank);
                break;
        }

        if (addPoints) {
            value += (this.points * (typeof weight === "number" ? weight : 1));
        }

        return value;
    };

    /**
     * Gets the friendly name of the card (e.g., "2 of Clubs");
     * @returns {string} the friendly name
     */
    this.getFriendlyName = function () {
        var friendlyRank = null;
        var friendlySuit = null;

        switch (this.suit) {
            case HeartsConstants.heart:
                friendlySuit = HeartsConstants.heartsFriendly;
                break;
            case HeartsConstants.diamond:
                friendlySuit = HeartsConstants.diamondsFriendly;
                break;
            case HeartsConstants.club:
                friendlySuit = HeartsConstants.clubsFriendly;
                break;
            case HeartsConstants.spade:
                friendlySuit = HeartsConstants.spadesFriendly;
                break;
        }

        switch (this.rank) {
            case HeartsConstants.ace:
                friendlyRank = HeartsConstants.aceLong;
                break;
            case HeartsConstants.king:
                friendlyRank = HeartsConstants.kingLong;
                break;
            case HeartsConstants.queen:
                friendlyRank = HeartsConstants.queenLong;
                break;
            case HeartsConstants.jack:
                friendlyRank = HeartsConstants.jackLong;
                break;
            default:
                friendlyRank = this.rank;
                break;
        }

        return friendlyRank + " of " + friendlySuit;
    };

    /**
     * Marks this card for the duration specified.
     * If no duration is passed, the default of 200 is used.
     * Duration is decremented by 1 each frame, so each unit is =~ 0.017 seconds.
     * @param {string} type the type of mark
     * @param {color} duration 
     */
    this.mark = function (type, duration) {
        if (!duration) {
            duration = 200;
        }

        this.marker.value = duration;
        this.marker.baseValue = duration;
        this.marker.type = type;
    };

    this.getColor = function () {
        return this.suit === HeartsConstants.heart || this.suit === HeartsConstants.diamond ? "red" : "black";
    };

    /**
     * Computes the speed that the card will move when being animated.
     * @returns {void} void
     */
    this.computeSpeed = function () {
        var speed = 10;
        var distance = 0;

        distance += Math.abs(this.destX - this.x);
        distance += Math.abs(this.destY - this.y);
        
        if (distance > 300) {
            speed += 15;
        }

        this.speed = speed;
    };

    /**
     * Setter for the card's x value.
     * @param {number} x 
     * @returns {void} void
     */
    this.setX = function (x) {
        this.x = Math.round(x);
    }

    /**
     * Setter for the card's y value.
     * @param {number} y 
     * @returns {void} void
     */
    this.setY = function (y) {
        this.y = Math.round(y);
    }

    /**
     * Checks the destination coordinates to ensure they are not out of bounds.
     * @returns {void} void
     */
    this.checkBounds = function () {
        this.destX = Math.round(this.destX);
        this.destY = Math.round(this.destY);

        if (this.destX < 0) {
            this.destX = 0;
        }
        if (this.destY < 0) {
            this.destY = 0;
        }
        if (this.destX > this.maxX) {
            this.destX = this.maxX;
        }
        if (this.destY > this.maxY) {
            this.destY = this.maxY;
        }
    };

    /**
     * Moves (animates) the card on the playing surface.
     * @param {number} destX 
     * @param {number} destY 
     * @returns {void} void
     */
    this.move = function (destX, destY) {
        this.destX = destX;
        this.destY = destY;
        this.checkBounds();
        this.computeSpeed();
    };
}
