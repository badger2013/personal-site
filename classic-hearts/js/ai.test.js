QUnit.testStart(details => {
    console.log(`** Start test '${details.name}' in module '${details.module}' ** `);
});

QUnit.module("Test AI");
QUnit.test("AI picks the 2 of Clubs to start the game", function (assert) {

    // Arrange
    const expected = "2C";

    Hearts.Game = Hearts.Game || {};

    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };

    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "2", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "5", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, HeartsConstants.jack, 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "7", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "3", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "8", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, "3", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, HeartsConstants.ace, 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, "8", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, "10", 0));

    Hearts.Game.getRemainingCards = function () {
        return [
            new Card(HeartsConstants.club, "3", 0),
            new Card(HeartsConstants.club, "4", 0),
            new Card(HeartsConstants.club, "6", 0),
            new Card(HeartsConstants.club, "8", 0),
            new Card(HeartsConstants.club, "9", 0),
            new Card(HeartsConstants.club, "10", 0),
            new Card(HeartsConstants.club, HeartsConstants.queen, 0),
            new Card(HeartsConstants.club, HeartsConstants.king, 0),
            new Card(HeartsConstants.club, HeartsConstants.ace, 0),
            new Card(HeartsConstants.heart, "2", 0),
            new Card(HeartsConstants.heart, "4", 0),
            new Card(HeartsConstants.heart, "5", 0),
            new Card(HeartsConstants.heart, "7", 0),
            new Card(HeartsConstants.heart, "9", 0),
            new Card(HeartsConstants.heart, "10", 0),
            new Card(HeartsConstants.heart, HeartsConstants.jack, 1),
            new Card(HeartsConstants.heart, HeartsConstants.queen, 0),
            new Card(HeartsConstants.heart, HeartsConstants.king, 0),
            new Card(HeartsConstants.heart, HeartsConstants.ace, 0),
            new Card(HeartsConstants.diamond, "2", 0),
            new Card(HeartsConstants.diamond, "4", 0),
            new Card(HeartsConstants.diamond, "5", 0),
            new Card(HeartsConstants.diamond, "7", 0),
            new Card(HeartsConstants.diamond, "8", 0),
            new Card(HeartsConstants.diamond, "9", 0),
            new Card(HeartsConstants.diamond, "10", 0),
            new Card(HeartsConstants.diamond, HeartsConstants.jack, 1),
            new Card(HeartsConstants.diamond, HeartsConstants.queen, 0),
            new Card(HeartsConstants.diamond, HeartsConstants.king, 0),
            new Card(HeartsConstants.spade, "2", 0),
            new Card(HeartsConstants.spade, "3", 0),
            new Card(HeartsConstants.spade, "4", 0),
            new Card(HeartsConstants.spade, "5", 0),
            new Card(HeartsConstants.spade, "7", 0),
            new Card(HeartsConstants.spade, "9", 0),
            new Card(HeartsConstants.spade, HeartsConstants.jack, 1),
            new Card(HeartsConstants.spade, HeartsConstants.queen, 0),
            new Card(HeartsConstants.spade, HeartsConstants.king, 0),
            new Card(HeartsConstants.spade, HeartsConstants.ace, 0)
        ]
    };
    Hearts.Game.round = new HeartsRound();

    // Act
    let actual = Hearts.AI.pickMove(Hearts.Game.players["C1"]);

    // Assert
    assert.equal(
        actual,
        expected,
        "AI picks the 2 of Clubs"
    );
});
QUnit.test("AI does NOT lead the Queen of Spades when it is very risky", function (assert) {

    // Arrange
    const expected = true;

    Hearts.Game = Hearts.Game || {};

    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };

    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, HeartsConstants.queen, 13));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, "8", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "5", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, HeartsConstants.jack, 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "7", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "3", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.heart, "8", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, "3", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, "6", 0));
    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.diamond, HeartsConstants.ace, 0));

    Hearts.Game.getRemainingCards = function () {
        return [
            new Card(HeartsConstants.club, "3", 0),
            new Card(HeartsConstants.club, "4", 0),
            new Card(HeartsConstants.club, "10", 0),
            new Card(HeartsConstants.club, HeartsConstants.queen, 0),
            new Card(HeartsConstants.club, HeartsConstants.king, 0),
            new Card(HeartsConstants.heart, "2", 0),
            new Card(HeartsConstants.heart, "4", 0),
            new Card(HeartsConstants.heart, "5", 0),
            new Card(HeartsConstants.heart, "7", 0),
            new Card(HeartsConstants.heart, "9", 0),
            new Card(HeartsConstants.heart, "10", 0),
            new Card(HeartsConstants.heart, HeartsConstants.jack, 1),
            new Card(HeartsConstants.heart, HeartsConstants.queen, 0),
            new Card(HeartsConstants.heart, HeartsConstants.king, 0),
            new Card(HeartsConstants.heart, HeartsConstants.ace, 0),
            new Card(HeartsConstants.diamond, "2", 0),
            new Card(HeartsConstants.diamond, "4", 0),
            new Card(HeartsConstants.diamond, "5", 0),
            new Card(HeartsConstants.diamond, "7", 0),
            new Card(HeartsConstants.diamond, "8", 0),
            new Card(HeartsConstants.diamond, "9", 0),
            new Card(HeartsConstants.diamond, "10", 0),
            new Card(HeartsConstants.diamond, HeartsConstants.jack, 1),
            new Card(HeartsConstants.diamond, HeartsConstants.queen, 0),
            new Card(HeartsConstants.diamond, HeartsConstants.king, 0),
            new Card(HeartsConstants.spade, "2", 0),
            new Card(HeartsConstants.spade, "3", 0),
            new Card(HeartsConstants.spade, "4", 0),
            new Card(HeartsConstants.spade, "5", 0),
            new Card(HeartsConstants.spade, "7", 0),
            new Card(HeartsConstants.spade, "9", 0),
            new Card(HeartsConstants.spade, "10", 0),
            new Card(HeartsConstants.spade, HeartsConstants.jack, 1),
            new Card(HeartsConstants.spade, HeartsConstants.queen, 0),
            new Card(HeartsConstants.spade, HeartsConstants.king, 0),
            new Card(HeartsConstants.spade, HeartsConstants.ace, 0)
        ]
    };
    Hearts.Game.round = new HeartsRound();

    // Act
    let actual = Hearts.AI.pickMove(Hearts.Game.players["C1"]) != "QS";

    // Assert
    assert.equal(
        actual,
        expected,
        "AI does NOT lead the Queen of Spades"
    );
});
QUnit.test("AI leads the Queen of Spades when they have no choice even if it will give them points", function (assert) {

    // Arrange
    const expected = true;

    Hearts.Game = Hearts.Game || {};

    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };

    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.spade, HeartsConstants.queen, 13));

    Hearts.Game.getRemainingCards = function () {
        return [
            new Card(HeartsConstants.club, "3", 0),
            new Card(HeartsConstants.club, "4", 0),
            new Card(HeartsConstants.spade, HeartsConstants.king, 0),
            new Card(HeartsConstants.club, HeartsConstants.queen, 0),
        ]
    };
    Hearts.Game.round = new HeartsRound();

    // Act
    let actual = Hearts.AI.pickMove(Hearts.Game.players["C1"]) == "QS";

    // Assert
    assert.equal(
        actual,
        expected,
        "AI does NOT lead the Queen of Spades"
    );
});

QUnit.test("AI avoids leading a long spade suit while the Queen of Spades remains", function (assert) {
    Hearts.Game = Hearts.Game || {};
    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };
    var player = Hearts.Game.players.C3;
    [
        new Card(HeartsConstants.spade, HeartsConstants.king, 0),
        new Card(HeartsConstants.spade, HeartsConstants.jack, 0),
        new Card(HeartsConstants.spade, "10", 0),
        new Card(HeartsConstants.spade, "9", 0),
        new Card(HeartsConstants.spade, "8", 0),
        new Card(HeartsConstants.spade, "7", 0),
        new Card(HeartsConstants.diamond, "2", 0),
        new Card(HeartsConstants.diamond, "4", 0),
        new Card(HeartsConstants.diamond, "6", 0),
        new Card(HeartsConstants.club, "2", 0),
        new Card(HeartsConstants.club, "4", 0),
        new Card(HeartsConstants.club, "6", 0),
        new Card(HeartsConstants.club, "8", 0)
    ].forEach(function (card) {
        player.addCard(card);
    });
    Hearts.Game.round = new HeartsRound();
    Hearts.Game.round.started = true;
    Hearts.Game.round.turnNum = 2;
    Hearts.Game.round.turn.currPlayer = player.id;
    Hearts.Game.getRemainingCards = function () {
        return [
            new Card(HeartsConstants.spade, HeartsConstants.queen, 13),
            new Card(HeartsConstants.spade, HeartsConstants.ace, 0),
            new Card(HeartsConstants.spade, "2", 0),
            new Card(HeartsConstants.spade, "3", 0),
            new Card(HeartsConstants.spade, "4", 0),
            new Card(HeartsConstants.spade, "5", 0),
            new Card(HeartsConstants.diamond, "3", 0),
            new Card(HeartsConstants.club, "3", 0)
        ];
    };

    assert.notEqual(Hearts.AI.pickMove(player), "KS");
});

QUnit.test("AI follows suit when a legal card in the led suit is available", function (assert) {
    Hearts.Game = Hearts.Game || {};
    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };
    var player = Hearts.Game.players.C1;
    player.addCard(new Card(HeartsConstants.diamond, "3", 0));
    player.addCard(new Card(HeartsConstants.club, "2", 0));
    Hearts.Game.round = new HeartsRound();
    Hearts.Game.round.started = true;
    Hearts.Game.round.turnNum = 2;
    Hearts.Game.round.turn.started = true;
    Hearts.Game.round.turn.currPlayer = player.id;
    Hearts.Game.round.turn.addPlayedCard(new Card(HeartsConstants.diamond, "5", 0));
    Hearts.Game.getRemainingCards = function () {
        return [];
    };

    assert.equal(Hearts.AI.pickMove(player), "3D");
    assert.ok(Hearts.Rules.isValidMove("3D", player, true));
});

QUnit.test("AI does not short suits longer than three cards", function (assert) {
    var player = new Player("C1", true);
    ["2C", "3C", "4C", "5C", "2D", "3D", "4D", "2S", "3S", "4S", "2H", "3H", "4H"].forEach(function (id) {
        var suit = id.slice(-1);
        var rank = id.slice(0, -1);
        player.addCard(new Card(suit, rank, 0));
    });

    assert.strictEqual(Hearts.AI.shouldShortSuit(player), null);
});

QUnit.test("AI passes exactly three cards and prioritizes the Queen of Spades", function (assert) {
    var player = new Player("C1", true);
    [
        new Card(HeartsConstants.spade, HeartsConstants.queen, 13),
        new Card(HeartsConstants.spade, HeartsConstants.ace, 0),
        new Card(HeartsConstants.heart, HeartsConstants.ace, 1),
        new Card(HeartsConstants.club, "2", 0),
        new Card(HeartsConstants.club, "3", 0),
        new Card(HeartsConstants.club, "4", 0),
        new Card(HeartsConstants.club, "5", 0),
        new Card(HeartsConstants.club, "6", 0),
        new Card(HeartsConstants.diamond, "2", 0),
        new Card(HeartsConstants.diamond, "3", 0),
        new Card(HeartsConstants.diamond, "4", 0),
        new Card(HeartsConstants.diamond, "5", 0),
        new Card(HeartsConstants.diamond, "6", 0)
    ].forEach(function (card) {
        player.addCard(card);
    });

    var selected = Hearts.AI.getPassCards(player);
    assert.equal(selected.length, 3);
    assert.ok(selected.some(function (card) {
        return card.id === "QS";
    }));
});

QUnit.test("AI discards the Queen of Spades when void in the led suit", function (assert) {
    Hearts.Game = Hearts.Game || {};
    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };
    var player = Hearts.Game.players.C1;
    player.addCard(new Card(HeartsConstants.spade, HeartsConstants.queen, 13));
    player.addCard(new Card(HeartsConstants.heart, HeartsConstants.ace, 1));
    player.addCard(new Card(HeartsConstants.club, "2", 0));
    Hearts.Game.round = new HeartsRound();
    Hearts.Game.round.started = true;
    Hearts.Game.round.turnNum = 2;
    Hearts.Game.round.turn.started = true;
    Hearts.Game.round.turn.currPlayer = player.id;
    Hearts.Game.round.turn.addPlayedCard(new Card(HeartsConstants.diamond, "5", 0));
    Hearts.Game.getRemainingCards = function () {
        return [];
    };

    assert.equal(Hearts.AI.pickMove(player), "QS");
});

QUnit.test("AI transfers exactly three cards left without re-passing incoming cards", function (assert) {
    Hearts.Game.currentPassTo = HeartsConstants.passLeft;
    var players = {
        "H": new Player("H", false),
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true)
    };
    Hearts.Game.players = players;
    Object.keys(players).forEach(function (id) {
        if (players[id].ai) {
            players[id].knowledge.init(id);
        }
        for (var i = 0; i < 13; i++) {
            players[id].addCard(new Card(HeartsConstants.club, String(i + 2), 0));
        }
    });
    var incomingCards = ["2H", "3H", "4H"].map(function (id) {
        var card = new Card(HeartsConstants.heart, id.slice(0, -1), 1);
        players.C1.addCard(card, true);
        return card;
    });

    Hearts.AI.passCards(players);

    assert.equal(players.C1.cards.length, 13);
    assert.equal(players.C2.cards.length, 13);
    assert.equal(players.C3.cards.length, 13);
    assert.equal(players.H.cards.length, 16);
    assert.ok(incomingCards.every(function (card) {
        return players.C1.hasCard(card.id);
    }));
    Hearts.Game.currentPassTo = null;
});

QUnit.test("AI only pursues a moon shot when enabled and above threshold", function (assert) {
    Hearts.AI.moonShootingEnabled = false;
    assert.notOk(Hearts.AI.shouldPursueMoonShot(1));
    Hearts.AI.moonShootingEnabled = true;
    assert.notOk(Hearts.AI.shouldPursueMoonShot(0.89));
    assert.ok(Hearts.AI.shouldPursueMoonShot(0.9));
    Hearts.AI.moonShootingEnabled = false;
});

QUnit.test("AI skips passing on the stay hand", function (assert) {
    Hearts.Game.currentPassTo = HeartsConstants.passStay;
    var players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true)
    };
    players.C1.addCard(new Card(HeartsConstants.spade, HeartsConstants.queen, 13));

    Hearts.AI.passCards(players);

    assert.equal(players.C1.cards.length, 1);
    assert.equal(players.C2.cards.length, 0);
    Hearts.Game.currentPassTo = null;
});

QUnit.test("AI decision logging is always on and includes its reason", function (assert) {
    var originalInfo = console.info;
    var originalMoonShootingEnabled = Hearts.AI.moonShootingEnabled;
    var messages = [];
    console.info = function (message, details) {
        messages.push({ message: message, details: details });
    };

    try {
        Hearts.AI.logDecision("test decision", { reason: "always emitted" });
        assert.equal(messages.length, 1);
        assert.equal(messages[0].message, "[Hearts.AI] test decision");
        assert.equal(messages[0].details.reason, "always emitted");

        Hearts.AI.moonShootingEnabled = true;
        Hearts.AI.shouldPursueMoonShot(0.9);
        assert.equal(messages.length, 2);
        assert.equal(messages[1].message, "[Hearts.AI] moon-shot evaluation");
        assert.equal(messages[1].details.reason, "enabled and above threshold");
    }
    finally {
        Hearts.AI.moonShootingEnabled = originalMoonShootingEnabled;
        console.info = originalInfo;
    }
});
