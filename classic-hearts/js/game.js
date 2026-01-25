// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

/**
 * A stack of events to be popped by the action key ("Enter").
 */
Hearts.eventStack = [];

//#region "Game"
/**
 * Represents one Hearts game.
 * A game contains multiple rounds, which in turn contains multiple turns:
 * Game => Round => Turn
 */
Hearts.Game = {
    // Contains the current round for the game
    round: null,

    // Tracks the players of the game
    // The players are stored in a dictionary
    // The key is the player ID; the value is the Player object
    players: null,
    currentPassTo: null,
    roundNum: 0,

    // A dictionary; the key is the player ID, the value is the score
    totalScores: {},

    // Passing information
    passingIndicators: [HeartsConstants.passLeft, HeartsConstants.passRight, HeartsConstants.passAcross, HeartsConstants.passStay],

    // Indicates whether or not the game has been started
    started: false,

    // Stores the last request ID returned from calling requestAnimationFrame
    stopMain: null,
    eventCounter: 0,
    event: null,
    settings: { 
        gameSpeed: 50,
        endGameScore: 100,
        showAIdecisionMaking: false,
        trimmedOutput: false,
        pauseAfterTurn: false,
        animateWonTrick: true
    },

    /**
     * Creates the players for the game.
     * @param {number} numComputer the number of computer players to create
     * @returns {object} the players
     */
    createPlayers: function (numComputer) {
        var players = {};

        players[HeartsConstants.humanPlayer] = new Player(HeartsConstants.humanPlayer, false);

        // Create the computer players
        for (let i = 0; i < numComputer; i++) {
            var number = i + 1;
            var id = "C" + number;

            players[id] = new Player(id, true);
        }

        return players;
    },

    checkEvent: function () {
        if (this.eventCounter > 0) {
            this.eventCounter--;
        }
        else if (this.event) {
            var event = this.event;
            this.event = null;
            event();
        }
    },

    /**
     * Pops the event stack and runs the next event.
     * @returns {void}
     */
    runNextEvent: function () {
        if (Hearts.eventStack.length === 0) {
            return;
        }

        var event = Hearts.eventStack.pop();

        if (event.asEvent) {
            this.setEvent(() => {
                this[event.funcName](event.arg);
            });
        }
        else {
            // Don't set the event, just run it instantly
            this[event.funcName](event.arg);
        }
    },

    setEvent: function (event, delay) {
        this.event = event;
        this.eventCounter = delay || this.settings.gameSpeed;
    },

    /**
     * Updates the knowledge for all AI players in the game.
     * @param {string} move the card that was played (e.g., "7D")
     * @param {string} player the ID of the player that made the move (e.g., "H")
     */
    updateKnowledge: function (move, player) {
        // See if the card that the player played followed the turn suit
        var turnSuit = Hearts.Game.round.turn.getTurnSuit();
        var cardSuit = move.match(/[HDSC]/)[0];
        var playerShortSuit = [];

        if (!turnSuit) {
            // The card that was played is the first card of the turn
            // It may be the only the card the player has of that suit
            // But the player probably has at least one more card
            playerShortSuit.push({
                suit: cardSuit,
                short: 0
            });
        }
        else if (turnSuit === cardSuit) {
            // The player followed suit, so chances are
            // They probably have at least one more card of that suit
            playerShortSuit.push({
                suit: cardSuit,
                short: 0
            });
        }
        else { 
            // The player did not follow suit, so they must be short on that suit
            playerShortSuit.push({
                suit: turnSuit,
                short: 1
            });

            // Note the card suit of the card that was played
            playerShortSuit.push({
                suit: cardSuit,
                short: 0
            });
        }

        for (var key in this.players) {
            if (key !== player && this.players[key].ai) {
                this.players[key].updateKnowledge(move, player, playerShortSuit);
            }
        }
    },

    /**
     * @param {Card[]} remainingCards 
     * @returns {void} void
     */
    printRemainingCards: function (remainingCards) {
        let remainingCardInfo = [];

        remainingCards.forEach((card) => {
            // Only grab the properties of each card that we care about
            remainingCardInfo.push({
                suit: card.suit,
                rank: card.rank,
                points: card.points,
                passed: card.passed,
                isKnown: card.isKnown
            });
        });

        console.log("[printRemainingCards] remainingCardInfo: " + JSON.stringify(remainingCardInfo));
        console.log("[printRemainingCards] number of remaining cards: " + remainingCards.length);
    },

    /**
     * Gets the cards that have not been played in the current round.
     * @param {string} skipPlayerId the ID of a player whose cards should be skipped
     * @returns {Card[]} an array of Card objects
     */
    getRemainingCards: function (skipPlayerId) {
        var remainingCards = [];

        for (var player in this.players) {
            if (player !== skipPlayerId) {
                for (var i = 0; i < this.players[player].cards.length; i++) {
                    remainingCards.push(this.players[player].cards[i]);
                }
            }
        }

        this.printRemainingCards(remainingCards);

        return remainingCards;
    },

    /**
     * Registers a move made by the human or AI player.
     * This function is called after a move has been made. All moves ultimately flow through this point.
     * The general flow for the AI is:  Pick Move (AI) > Make Move (AI) > Register Move
     * The general flow for the human is:  Pick Move > Make Move > RegisterMove
     * @param {string} move the move that was made, expressed as a card ID (e.g., "7D")
     * @param {string} player the ID of player that made the move (e.g., "H")
     * @param {Card} card optional - the card that was moved
     */
    registerMove: function (move, player, card) {
        var playedCard = card || this.players[player].removeCard(move);
        var nextPlayer = this.round.turn.getNextPlayer(player);

        playedCard.playedBy = player;

        this.round.turn.addPlayedCard(playedCard);

        let playedMessage = this.players[player].getFriendlyName(true) + " played the " + playedCard.getFriendlyName() + ".";

        if (player === HeartsConstants.humanPlayer) {
            playedMessage = playedMessage.replace("The Human Player", "You");
        }
        if (Hearts.Game.round.turn.getNumPlayedCards() < 4 && nextPlayer === HeartsConstants.humanPlayer) {
            playedMessage += " It is your turn.";
        }

        Hearts.Messages.showMessage(playedMessage);

        this.updateIndicators(move);
        this.updateKnowledge(move, player);
        this.round.turn.currPlayer = nextPlayer;

        if (Hearts.Game.round.turn.getNumPlayedCards() === 4) {
            this.setEvent(() => {
                this.endTurn();
           });
        }
        else if (nextPlayer !== HeartsConstants.humanPlayer) {
            this.setEvent(() => {
                 this.onMove(nextPlayer);
            });
        }
    },

    //#region "Game Events"
    onMove: function (nextPlayer) {
        HeartsHelpers.makeMove(this.players[nextPlayer], Hearts.AI.pickMove(this.players[nextPlayer]));
    },

    onEndTurn: function () {
        this.endTurn();
    },

    onStartTurn: function (playedBy) {
        this.round.turn = new HeartsTurn();
        this.round.turnNum++;
        Hearts.Messages.removeMessage();
        this.round.turn.currPlayer = playedBy;

        if (playedBy !== HeartsConstants.humanPlayer) {
            HeartsHelpers.makeMove(this.players[playedBy], Hearts.AI.pickMove(this.players[playedBy]));
        }
    },
    //#endregion "Game Events"

    endTurn: function () {
        // Check who won the trick
        var winningCard = Hearts.Rules.getWinningCard(Hearts.Game.round.turn.playedCards, Hearts.Game.round.turn.getTurnSuit());
    
        // Record the cards won in the trick
        this.players[winningCard.playedBy].addWonCards(Hearts.Game.round.turn.playedCards, Hearts.Game.roundNum);
    
        Hearts.Messages.showEndTurnMessage(winningCard.playedBy);
        Hearts.Game.round.addToScore(winningCard.playedBy, Hearts.Game.round.turn.getTurnPoints());
        this.refreshStatusBar();

        if (Hearts.Game.settings.animateWonTrick) {
            var width = window.innerWidth || window.screen.width
            var height = window.innerHeight || window.screen.height;
    
            for (var i = 0; i < Hearts.Game.round.turn.playedCards.length; i++) {
                var destX = 0;
                var destY = 0;
    
                if (winningCard.playedBy === HeartsConstants.humanPlayer) {
                    destX = width / 2;
                    destY = height;
                }
                else if (winningCard.playedBy === "C1") {
                    destX = 0;
                    destY = height / 2;
                }
                else if (winningCard.playedBy === "C2") {
                    destX = width / 2;
                    destY = 0;
                }
                else if (winningCard.playedBy === "C3") {
                    destX = width;
                    destY = height / 2;
                }
                else {
                    throw new Error("Unrecognized winning player ID: " + winningCard.playedBy);
                }
    
                Hearts.Game.round.turn.playedCards[i].move(destX, destY);
            }
        }

        if (this.players[HeartsConstants.humanPlayer].cards.length > 0) {
            if (Hearts.Game.settings.pauseAfterTurn) {
                Hearts.eventStack.push({
                    funcName: "onStartTurn",
                    arg: winningCard.playedBy,
                    asEvent: false
                });
            }
            else {
                this.setEvent(() => {
                    this.onStartTurn(winningCard.playedBy);
                });
            }
        }
        else {
            this.setEvent(() => {
                Hearts.Messages.removeMessage();
                Hearts.Game.advanceRound();
            });
        }
    },

    /**
     * Updates the passed engine with references to the instance of the Hearts Game.
     * @param {CardGameEngine} engine 
     */
    updateEngine: function (engine) {
        engine.setEventListener(this.onEventReceived);
        engine.gameRef = this;
    },

    /**
     * Advances the passing indicator for the direction to pass to.
     * If there is no current indicator, then this function sets the default direction ("left").
     * @returns {void}
     */
    advancePassingIndicator: function () {
        if (!Hearts.Game.currentPassTo) {
            Hearts.Game.currentPassTo = this.passingIndicators[0];
            return;
        }

        for (let i = 0; i < this.passingIndicators.length; i++) {
            if (this.passingIndicators[i] === Hearts.Game.currentPassTo) {
                let newIndex = i + 1;

                if (newIndex > this.passingIndicators.length - 1) {
                    newIndex = 0;
                }

                Hearts.Game.currentPassTo = this.passingIndicators[newIndex];
                return;
            }
        }
    },

    updateIndicators: function (cardStr) {
        if (cardStr === "2C") {
            Hearts.Game.round.started = true;
        }
        if (cardStr.indexOf(HeartsConstants.heart) !== -1) {
            Hearts.Game.round.heartsBroken = true;
            this.refreshStatusBar();
        }
        if (Hearts.Game.round.turn.started === false) {
            Hearts.Game.round.turn.started = true;
        }
    },

    onEventReceived: function (e) {
        switch (e.type) {
            case "cardSelection":
                this.gameRef.onCardsSelected(e.selected, this);
                break;
            case "cardMove":
                if (Hearts.Rules.isValidMove(e.cardId, this.gameRef.players[HeartsConstants.humanPlayer])) {
                    this.gameRef.makeMove(e.cardId, this);
                    this.gameRef.players[HeartsConstants.humanPlayer].sortCards();
                }
                else {
                    var playableCards = Hearts.Rules.getPlayableCards(this.gameRef.players[HeartsConstants.humanPlayer]);

                    for (var i = 0; i < playableCards.length; i++) {
                        playableCards[i].mark(HeartsConstants.markValid);
                    }
                }

                break;
            default:
                throw "Unknown event: " + e.type;
        }
    },

    /**
     * Moves a card (intended for use with the human player).
     * @param {string} cardId the card ID
     */
    makeMove: function (cardId, engineRef) {
        engineRef.moveCard();
        this.registerMove(cardId, HeartsConstants.humanPlayer);
    },

    onCardsSelected: function (selected, engineRef) {
        if (selected.length === 3) {
            this.passCards(selected);
            engineRef.selectedCards = [];
        }
    },

    /**
     * Passes the selected cards.
     * @param {Card[]} selected the selected cards
     * @returns {void}
     */
    passCards: function (selected) {
        // First, remove the human player's selections
        let removedCards = [];

        for (let selection of selected) {
            var card = this.players[HeartsConstants.humanPlayer].removeCard(selection);

            card.selected = false;

            removedCards.push(card);
        }

        // Pass them to the computer player
        let cId = HeartsHelpers.getPlayerToPassTo(HeartsConstants.humanPlayer);

        for (let removedCard of removedCards) {
            this.players[cId].addCard(removedCard);
        }

        // Now, pass cards for each AI player
        Hearts.AI.passCards(this.players);

        // Automatically sort the human player's hand
        this.players[HeartsConstants.humanPlayer].sortCards();

        // Start the turn
        this.round.start(this.getStartingPlayer());
    },

    /**
     * Finds the player with the 2 of clubs.
     */
    getStartingPlayer: function () {
        for (let key in this.players) {
            if (this.players[key].hasCard("2C")) {
                return this.players[key];
            }
        }
    },

    /**
     * Refreshes the status bar.
     */
    refreshStatusBar: function (endGame) {
        g_Engine.statusBar.endGame = endGame;
        g_Engine.statusBar.round = Hearts.Game.roundNum;
        g_Engine.statusBar.heartsBroken = Hearts.Game.round.heartsBroken;
        g_Engine.statusBar.scores = [];

        for (let key in this.players) {
            var totalScore = this.totalScores[key] ? this.totalScores[key] : 0;
            var roundScore = !endGame ? Hearts.Game.round.scores[key] ? Hearts.Game.round.scores[key] : 0 : 0;
            var friendlyName = this.players[key].getFriendlyName();

            g_Engine.statusBar.scores.push({
                roundScore: roundScore,
                totalScore: totalScore,
                friendlyName: friendlyName,
                shortName: key
            });
        }
    },

    /**
     * Advances the current round.
     * In the case in which no previous round exists, this starts a new game.
     */
    advanceRound: function () {
        if (Hearts.Game.round) {
            // Check if someone shot the moon
            Hearts.Rules.shotTheMoon(Hearts.Game.round);

            // Record scores from the current round
            Hearts.Game.round.updateTotalScores(Hearts.Game.totalScores);
        }

        // Check for the end of the game
        if (Hearts.Rules.checkForEnd(Hearts.Game.totalScores)) {
            Hearts.Game.settings.trimmedOutput = false;
            Hearts.Messages.showMessage(Hearts.Strings.endGameMessage);
            Hearts.Game.refreshStatusBar(true);
            return;
        }

        // Create a new round
        Hearts.Game.round = new HeartsRound();
        Hearts.Game.roundNum++;

        // Shuffle the deck
        Hearts.Game.round.deck = Hearts.Deck.shuffle(Hearts.Deck.build());

        // Deal cards
        Hearts.Deck.deal();

        Hearts.Game.refreshStatusBar();
        Hearts.Game.advancePassingIndicator();

        // Reset played knowledge
        for (var player in Hearts.Game.players) {
            if (Hearts.Game.players[player].ai) {
                Hearts.Game.players[player].knowledge = new PlayerKnowledge();
                Hearts.Game.players[player].knowledge.init(player);
            }
        }

        if (Hearts.Game.currentPassTo !== HeartsConstants.passStay) {
            Hearts.Messages.showPassingMessage(Hearts.Game.currentPassTo);
            g_Engine.setMode(HeartsConstants.passMode);
        }
        else {
            Hearts.Game.round.start(Hearts.Game.getStartingPlayer());
        }
    },

    /**
     * Starts the game.
     * @param {boolean} restart indicates whether or not the game is being restarted
     */
    start: function (restart) {
        Hearts.Game.players = Hearts.Game.createPlayers(3);

        // Initialize player knowledge
        for (var player in Hearts.Game.players) {
            if (Hearts.Game.players[player].ai) {
                Hearts.Game.players[player].knowledge.init(player);
            }
        }

        Hearts.Game.currentPassTo = null;
        Hearts.Game.roundNum = 0;
        Hearts.Game.totalScores = {};
        Hearts.Game.round = null;
        Hearts.Game.advanceRound();
        this.started = true;

        if (!restart) {
            this.updateEngine(g_Engine),            
            main();
        }
    }
};
//#endregion "Game"

function main(frame) {
    Hearts.Game.stopMain = window.requestAnimationFrame(main);
    g_Engine.draw();
}            

window.onload = function () {
    g_Engine = new CardGameEngine(document.getElementById("canvas"));
    Hearts.Game.start();
};

document.addEventListener("keydown", (e) => {
    var key = e.key.toLowerCase();

    if (key === "enter") {
        Hearts.Game.runNextEvent();
    }
    else if (key === "t") {
        var totalScores = ["Total scores:"];
        for (let key in Hearts.Game.players) {
            var totalScore = Hearts.Game.totalScores[key] ? Hearts.Game.totalScores[key] : 0;
            var friendlyName = Hearts.Game.players[key].getFriendlyName();

            totalScores.push(friendlyName + ": " + totalScore + ",");
        }

        var totalScoresMessage = totalScores.join(" ");
        Hearts.Messages.showMessage(totalScoresMessage.substring(0, totalScoresMessage.length - 1));
    }
    else if (key === "l") {
        Hearts.Messages.showMessage(Hearts.Messages.getLastMessage());
    }
    else if (key === "h") {
        var helpInfo = [
            "Commands:",
            "P = Toggle Pause,",
            "R = Reset Game,",
            "B = Change Background,",
            "A = Toggle Animation",
            "L = Show Last Message,",
            "T = Show Total Scores"
        ];

        Hearts.Messages.showMessage(helpInfo.join(" "));
    }
    else if (key === "p") {
        Hearts.Game.settings.pauseAfterTurn = !Hearts.Game.settings.pauseAfterTurn;

        var message = null;

        if (Hearts.Game.settings.pauseAfterTurn) {
            message = "The game will now pause at the end of each turn.";
        }
        else {
            message = "The game will no longer pause at the end of each turn."
        }

        Hearts.Messages.showMessage(message);
    }
    else if (key === "r") {
        if (Hearts.Game.settings.resetNext) {
            Hearts.Game.start(true);
            Hearts.Game.settings.resetNext = false;
        }
        else {
            Hearts.Messages.showMessage("Press \"R\" again to restart the game.");
            Hearts.Game.settings.resetNext = true;
        }
    }
    else if (key === "b") {
        g_Engine.backgroundColor++;

        if (g_Engine.backgroundColor > g_Engine.backgroundColors.length - 1) {
            g_Engine.backgroundColor = 0;
        }
    }
    else if (key === "i") {
        Hearts.Game.settings.gameSpeed -= 10;

        if (Hearts.Game.settings.gameSpeed < 10) {
            Hearts.Game.settings.gameSpeed = 10;
            Hearts.Messages.showMessage("The game speed cannot be increased further.");
        }
        else {
            Hearts.Messages.showMessage("The game speed has been increased to " + Hearts.Game.settings.gameSpeed + ".");
        }
    }
    else if (key === "d") {
        Hearts.Game.settings.gameSpeed += 10;
        Hearts.Messages.showMessage("The game speed has been decreased to " + Hearts.Game.settings.gameSpeed + ".");
    }
    else if (key === "a") {
        Hearts.Game.settings.animateWonTrick = !Hearts.Game.settings.animateWonTrick;

        var message = null;

        if (Hearts.Game.settings.animateWonTrick) {
            message = "Animation for the winning trick is now on.";
        }
        else {
            message = "Animation for the winning trick is now off."
        }

        Hearts.Messages.showMessage(message);
    }
});
