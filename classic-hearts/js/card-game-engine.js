// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

function CardGameEngine(canvas) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;
    this.canvas.width = window.innerWidth || window.screen.width;
    this.canvas.height = window.innerHeight || window.screen.height;
    this.clickedImageData = null;
    this.canvas.addEventListener("click", (e) => {
        if (this.mode === HeartsConstants.playMode && Hearts.Game.round.turn.currPlayer !== HeartsConstants.humanPlayer) {
            return;
        }

        var imageClickedData = this.findClickedImage(e, Hearts.Game.players[HeartsConstants.humanPlayer].cards);

        if (imageClickedData) {
            console.log("You clicked " + imageClickedData.obj.id);

            if (this.mode === HeartsConstants.passMode) {
                imageClickedData.obj.selected = !imageClickedData.obj.selected;

                if (imageClickedData.obj.selected) {
                    this.selectedCards.push(imageClickedData.obj.id);
                }
                else {
                    for (var i = 0; i < this.selectedCards.length; i++) {
                        if (this.selectedCards[i] === imageClickedData.obj.id) {
                            this.selectedCards.splice(i, 1);
                            break;
                        }
                    }
                }

                this.emitEvent({ type: "cardSelection", selected: this.selectedCards });
            }
            else {
                this.clickedImageData = imageClickedData;
                this.emitEvent({ type: "cardMove", cardId: imageClickedData.obj.id });
            }

        }
    });	
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context = canvas.getContext("2d");
    /**
     * The message to display to the user on the next refresh.
     * @type {string}
     */
    this.message = null;
    this.statusBar = {};
    this.backgroundColors = [
        "green",
        "darkblue",
        "blue",
        "black",
        "white"
    ];
    this.backgroundColor = 0;
    /**
     * The event listener is a function that receives events sent by the engine.
     * The game using the engine can set this to get engine events.
     */
    this.eventListener = null;
    /**
     * Defines the "mode" that the engine is running in.
     * Play: In this mode all cards are immediately played when clicked.
     * Pass: In this mode clicking a card emits an event to be picked up by a listener.
     * The listener decides when selection will be stopped (e.g., at two cards).
     */
    this.mode = HeartsConstants.playMode;
    /**
     * @type {string[]}
     */
    this.selectedCards = [];
}

CardGameEngine.prototype.moveCard = function () {
    if (!this.clickedImageData) {
        return;
    }
    
    this.updateCardPosition(this.clickedImageData.obj, HeartsConstants.bottom);
};

/**
 * Finds the image that was clicked.
 * In the case of cards, this assumes that the images array is sorted so that cards are present from left to right.
 * If no image was clicked this function returns null.
 * @param {MouseEvent} e the mouse event
 * @param {GameImage[]} images the images to examine
 * @returns {object}
 */
 CardGameEngine.prototype.findClickedImage = function (e, images) {
    var imageClicked = null;

    for (var i = images.length - 1; i >= 0; i--) {
        if (e.offsetX >= images[i].x && e.offsetX <= (images[i].x + images[i].width) &&
            e.offsetY >= images[i].y && e.offsetY <= (images[i].y + images[i].height) ) {
                imageClicked = images[i];
                break;
        }
    }

    return imageClicked ? { obj: imageClicked, index: i } : null;
};

/**
 * Sets the event listener that will pickup events the engine emits.
 * @param {Function} func 
 */
CardGameEngine.prototype.setEventListener = function (func) {
    this.eventListener = func;
};

CardGameEngine.prototype.draw = function () {
    Hearts.Game.checkEvent();
    Hearts.Graphics.init(this.canvas, this.context);
    Hearts.Graphics.clear();
    Hearts.Graphics.drawStatusBar(this.statusBar);
    Hearts.Graphics.drawMessageBar(this.message);
    Hearts.Graphics.drawCards(Hearts.Game.players[HeartsConstants.humanPlayer].cards, true);
    Hearts.Graphics.drawCards(Hearts.Game.round.turn.playedCards);
    Hearts.Graphics.drawBackground(this.backgroundColors[this.backgroundColor]);
};

/**
 * Sets the mode of the engine.
 * @param {string} mode 
 */
CardGameEngine.prototype.setMode = function (mode) {
    if (mode !== HeartsConstants.playMode && mode !== HeartsConstants.passMode) {
        throw "Invalid engine mode: " + mode;
    }

    this.mode = mode;
};

/**
 * Updates the position of the passed card with the new location.
 * This triggers the card animation.
 * @throws unsupported location
 * @param {Card} card the card to update
 * @param {string} location the location
 * @returns {void}
 */
CardGameEngine.prototype.updateCardPosition = function (card, location) {
    if (location === HeartsConstants.top) {
        card.setX(this.canvas.width / 2);
        card.setY(0);
        card.move(this.canvas.width * .5, this.canvas.height * .3);
    }
    else if (location === HeartsConstants.middleLeft) {
        card.setX(0);
        card.setY(this.canvas.height / 2);
        card.move(this.canvas.width * .45, this.canvas.height * .4);
    }
    else if (location === HeartsConstants.middleRight) {
        card.setX(this.canvas.width);
        card.setY(this.canvas.height / 2);
        card.move(this.canvas.width * .55, this.canvas.height * .4);
    }
    else if (location === HeartsConstants.bottom) {
        // Only cards played by the human are set to the "bottom" location
        // So the card's x and y values do not need to initialized
        card.move(this.canvas.width * .5, this.canvas.height * .5);
    }
    else {
        throw new Error("Unsupported location: " + location);
    }
};

/**
 * Emits an event to be picked up by a listener on the engine.
 * When an event is emitted, the listener (i.e., the callback) is
 * called.  If there is no callback then an exception is thrown.
 */
CardGameEngine.prototype.emitEvent = function (e) {
    if (typeof this.eventListener === "function") {
        this.eventListener(e);
    }
    else {
        throw "No event listener was set";
    }
};
