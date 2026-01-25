// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

Hearts.Graphics = {
    canvas: null,
    context: null,
    barHeight: null,
    fontSize: null,
    images: {},
    imagesb64: {
        "H.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADWSURBVFhH7ZXLDoUwCESp///PWmKNWGkF+pBFz8a7KDOTgeSGPQI5IaQfGcxTFsX8O0BpmFIKYpjd0vdEIoBw74yzdwCpwAV93zB7BtAK9CB5PlegBUUaw7cF6ECIN1k46Tn83sAKsAKsAA4CSP/jRxC91wqcBPjjDpKnoxXMbIF4OTvCGS1kHs4aQEa2wGg7bAAZ0UJB02kDSM8WKlr1BnqE+ND4XkFLCMGs4xugWFoQzsgb0IRQvNWtQCKsbEt/AzUDpTliO0LOyGCO2AIg1NBoDgBwAGd+TiCG6ccgAAAAAElFTkSuQmCC",
        "D.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEKSURBVFhH1ZbBEoUgCEW1///nnk4xmYnCBXXe2bRJ7gFspngmAkqMIRiOZ477uQ1cIHdfPkEwgTrUIPGHK+C6BaegExiFABL+K1BKyAXAEY+QCWjDFe+PBdDOhef870CJQKIvgHZfMqjBC3iEE51abQHPcIKp+RWYEU40ar8FZoYTVcYjsCKcKLIugZXhxJ0Z0w+V7Z/KyGH9pzORsq8V7JC4M59LuFKiyHp/hiskqoy3QGamRKP2VyAzQ4Kp2RbwptMQL+A1hUGd/gSsEoLz4xV4TYJh3h0QissEtFNQvC+fgLSoUla3Au0kBPjeAUBQL8CFgNPxnQAAJlB3a7gb+AQo1BCe2byCEH6O+0ZFcKHf3QAAAABJRU5ErkJggg==",
        "C.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADfSURBVFhH7ZfrDoMgDIVh7//O22qsqV2F0yIqGd8PNdrLoUAN+f0lOck5r097AqGSS8BRYo1HyGu9V0GTEx5bSIAnIIP6wBXoRVVAZPQM4vv8CvRmCni+gEh7ZRDfMaYgUgXU5+dndNQ8yAxtSiVbLWwnoKXreZAitim4Kjkhcy0CrkzOcE66YqulE2Nsw55MAfcL0J0JRfq1xAhXQPaOlj6yCPCOwLKPxtgqgAYo2UVimEczq6TaTNvUvhNGKt/ZUFITgDJmH7DKa71DGLMCZzIFjCegtNojO+HfpyClD434ZzHqVlJnAAAAAElFTkSuQmCC",
        "S.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAD2SURBVFhH7ZfRDsMgCEW1///P22xKQ50iXJh2Sc9Ll1XhgGRd8+tDAsk5J8f2ne24LgMWKNXzKwokUCf1SIQdASphFvC2vMYkMEqOyIUdAWGVUAtYAlvWqgSQ1moZCqDJtftEAW/lmv1dgai2j+I0BaKSE1I81RBG0JP4EoiuntOKfRH4ZXKiznEKzEhO8FzTZqDHLjCzeoJyLu9A0fD9q3RyjxlYySOwoW82fJ8nxj2OwFpBWc9/vMpnJEbh7IAmQFkjrRvdJ/iayxFIATSBCSlGfQ9+Pa+fH2CYmwyhldbTs/Wdhv/sQCSPgFlAGjZkEBd3IKU3JtJLch5H2jcAAAAASUVORK5CYII="
    },

    /**
     * Gets the coordinates to use when drawing cards for the human players.
     * @param {number} numCards the number of cards the human player has
     * @returns {object} an object with coordinate properties
     */
    getHumanCardCoordinates: function (numCards) {
        var width = window.innerWidth || window.screen.width
        var height = window.innerHeight || window.screen.height;
        var spacing = 100 * (width / 1920);
        var endX = width / 2 - (numCards / 2 * spacing) - spacing;
        var y = height * .8;
        var startX = width / 2;
        var startY = height / 6;

        return {
            width: width,
            height: height,
            spacing: spacing,
            endX: endX,
            y: y,
            startX: startX,
            startY: startY
        }
    },

    /**
     * Starts loading the image of the passed object.
     * @param {any} object
     */
    loadImage: function (object) {
        object.loading = true;
        object.element = new Image();
        object.element.src = Hearts.Graphics.imagesb64[object.image];
        object.element.onload = () => {
            object.loaded = true;
            object.loading = false;
        };
    },

    /**
     * Highlights the passed card.
     * @param {Card} card the card to highlight
     * @returns {void}
     */
    drawCardHighlights: function (card) {
        if (card.selected) {
            var oldFillStyle = this.context.fillStyle;

            this.context.fillStyle = "rgba(0, 0, 255, 0.5)";
            this.context.fillRect(card.x, card.y, card.width, card.height);
            this.context.fillStyle = oldFillStyle;
        }
        else if (card.marker.value > 0) {
            var oldFillStyle = this.context.fillStyle;
            var progress = card.marker.baseValue - card.marker.value;
            var opacity = null;

            if (progress <= 100) {
                opacity = progress / card.marker.baseValue;
            }
            else {
                opacity = Math.abs(progress / card.marker.baseValue - 1);
            }

            var fillStyle = "";

            if (card.marker.type === HeartsConstants.markPass) {
                fillStyle = "rgba(0, 0, 255, " + opacity + ")";
            }
            else if (card.marker.type === HeartsConstants.markValid) {
                fillStyle = "rgba(0, 255, 0, " + opacity + ")";
            }

            this.context.fillStyle = fillStyle;
            this.context.fillRect(card.x, card.y, card.width, card.height);
            this.context.fillStyle = oldFillStyle;

            card.marker.value -= 1;

            if (card.marker.value < 0) {
                card.marker.value = 0;
            }
        }
    },

    /**
     * Draws the suit on the passed card.
     * @param {Card} card the card to draw the suit on
     * @param {boolean} reduceSize indicates whether or not the suit should be drawn at a smaller size
     * @param {number} overrideX the x value to use instead of what would be computed
     * @param {number} overrideY the y value to use instead of what would be computed
     * @returns {void}
     */
    drawSuit: function (card, reduceSize, overrideX, overrideY) {
        if (!this.images[card.suit] || (!this.images[card.suit].loaded && !this.images[card.suit].loading)) {
            this.images[card.suit] = new GameImage();
            this.images[card.suit].image = card.suit + ".png";
            this.images[card.suit].height = 40;
            this.images[card.suit].width = 32;

            this.loadImage(this.images[card.suit]);
        }
        else if (this.images[card.suit].loaded) {
            this.context.drawImage(
                this.images[card.suit].element, 
                overrideX ? overrideX : card.x + 10, 
                overrideY ? overrideY : card.y + 50, 
                reduceSize ? this.images[card.suit].width / 2 : this.images[card.suit].width, 
                reduceSize ? this.images[card.suit].height / 2 : this.images[card.suit].height
            );
        }
    },

    /**
     * Draws the passed card.
     * @param {Card} card the card to draw
     * @returns {void}
     */
    drawCard: function (card) {
        var color = card.getColor();
        var speed = card.speed;

        if (card.destX !== card.x) {
            if (Math.abs(card.destX - card.x) < speed) {
                speed = 1;
            }
            if (card.destX > card.x) {
                card.x += speed;
            }
            else if (card.destX < card.x) {
                card.x -= speed;
            }
        }
        if (card.destY !== card.y) {
            if (Math.abs(card.destY - card.y) < speed) {
                speed = 1;
            }
            if (card.destY > card.y) {
                card.y += speed;
            }
            else if (card.destY < card.y) {
                card.y -= speed;
            }
        }

        var bottomTextX = card.rank.length === 2 ? card.x + card.width * .5 : card.x + card.width * .7;

        // Draw the card's body/background
        this.context.fillStyle = "white";
        this.context.fillRect(card.x, card.y, card.width, card.height);

        // Draw the card's border
        this.context.strokeRect(card.x, card.y, card.width, card.height);

        // Draw the card's rank in the upper left corner
        this.context.fillStyle = color;
        this.context.font = "50px Courier Bold";
        this.context.fillText(card.rank, card.x + 10, card.y + 40);
        
        // Draw the card's rank in the lower right corner
        this.context.fillStyle = color;
        this.context.fillText(card.rank, bottomTextX, card.y + card.height * .9);
        
        // Draw the card's suit
        this.context.fillStyle = color;
        this.drawSuit(card);

        // Add any highlighting present on the card
        this.drawCardHighlights(card);
    },

    /**
     * Draws cards on the playing surface.
     * @param {Card[]} cards the cards to draw
     * @returns {void}
     */
    drawCards: function (cards, humanCards) {
        // Loop through all the cards to draw
        for (var i = 0; i < cards.length; i++) {
            this.drawCard(cards[i]);
        }
    },

    /**
     * Draws the message bar and accompanying message.
     * @param {string} str the message to show
     * @returns {void}
     */
    drawMessageBar: function (str) {
        if (str) {
            var x = this.canvas.width / 2 - (str.length / 2 * 10);
            var y = this.barHeight + (this.barHeight / 2);

            this.context.fillStyle = "rgb(255, 210, 127)";
            this.context.fillRect(0, this.barHeight, this.canvas.width, this.barHeight);
            this.context.fillStyle = "black";
            this.context.font = this.fontSize + "px Calibri";
            this.context.fillText(str, x, y);
        }
    },

    /**
     * Draws the status bar.
     * @param {object} data the status bar data
     * @returns {void}
     */
    drawStatusBar: function (data) {
        var x = this.canvas.width / 4;
        var y = this.barHeight / 2;

        // Background
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.barHeight);
        this.context.fillStyle = "black";

        // Round
        this.context.font = this.fontSize + "px Calibri";
        
        if (!data.endGame) {
            this.context.fillText("Round: " + data.round, x, y);
        }

        // Scores
        for (var i = 0; i < data.scores.length; i++) {
            x += 125;

            this.context.fillText(data.scores[i].shortName + ": ", x, y);
            this.context.fillText(data.scores[i].roundScore, x + 35, y);
        }

        // Hearts indicator
        if (!data.endGame) {
            this.context.fillText("Hearts: ", x += 125, y);
            this.context.fillStyle = data.heartsBroken ? "red" : "black";
            this.context.fillText(data.heartsBroken ? "Broken" : "Not broken", x += 75, y);
        }
        else {
            x += 125;
        }
    },

    /**
     * Draws the background.
     * @param {string} color the background color
     * @returns {void}
     */
    drawBackground: function (color) {
        // Draw the background behind everything that's already been drawn                
        this.context.globalCompositeOperation = "destination-over";
        
        // Fill the background
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Reset to the default composition mode
        this.context.globalCompositeOperation = "source-over";
    },

    /**
     * Clears the canvas.
     * @returns {void}
     */
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /**
     * Initializes the graphics.
     * @param {HTMLCanvasElement} canvas the canvas to draw on
     * @param {CanvasRenderingContext2D} context the 2D canvas context
     * @returns {void}
     */
    init: function (canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.fontSize = "24";
        this.barHeight = this.canvas.height * .075;
    }
};
