QUnit.module("Test AI");
QUnit.test("AI picks a card", function (assert) {
    console.log("** Test: AI picks a card **");

    // Arrange
    let expected = !null;

    Hearts.Game = Hearts.Game || {};

    Hearts.Game.players = {
        "C1": new Player("C1", true),
        "C2": new Player("C2", true),
        "C3": new Player("C3", true),
        "C4": new Player("C4", true)
    };

    Hearts.Game.players["C1"].addCard(new Card(HeartsConstants.club, "2", 2));

    Hearts.Game.getRemainingCards = function () {
        return [
            new Card(HeartsConstants.heart, HeartsConstants.jack, 1),
            new Card(HeartsConstants.heart, "7", 1),
            new Card(HeartsConstants.diamond, HeartsConstants.queen, 0),
            new Card(HeartsConstants.club, "10", 0)
        ]
    };
    Hearts.Game.round = new HeartsRound();

    // Act
    let actual = Hearts.AI.pickMove(Hearts.Game.players["C1"]);

    // Assert
    assert.equal(
        actual,
        expected,
        "AI picks a card"
    );
});
