// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

Hearts.AI = {
    moonShootingEnabled: false,
    moonShootingThreshold: 0.9,

    logDecision: function (decision, details) {
        if (typeof console !== "undefined" && console.info) {
            console.info("[Hearts.AI] " + decision, details);
        }
    },

    /**
     * Picks a legal move that minimizes estimated penalty points.
     * @param {Player} player the AI player
     * @returns {string} the move to make, expressed as a string (e.g., "7D")
     */
    pickMove: function (player) {
        var playableCards = Hearts.Rules.getPlayableCards(player);
        if (!playableCards.length) {
            return null;
        }

        var turn = Hearts.Game.round.turn;
        var playedCards = turn.copyPlayedCards();
        var turnSuit = turn.getTurnSuit();
        var remainingPlayers = turn.getRemainingPlayers();
        var remainingCards = Hearts.Game.getRemainingCards(player.id);
        var existingPoints = turn.getTurnPoints();
        var remainingPoints = remainingCards.reduce(function (total, card) {
            return total + card.points;
        }, 0);
        var bestCard = playableCards[0];
        var bestScore = Infinity;
        var candidateScores = [];

        for (var i = 0; i < playableCards.length; i++) {
            var card = playableCards[i];
            var leadSuit = turnSuit || card.suit;
            var winningCard = Hearts.Rules.getWinningCard(playedCards.concat([card]), leadSuit);
            var winsSoFar = winningCard.id === card.id;
            var higherCards = remainingCards.filter(function (otherCard) {
                if (otherCard.suit !== leadSuit || otherCard.getValue() <= winningCard.getValue()) {
                    return false;
                }

                return remainingPlayers.some(function (opponentId) {
                    var knowledge = player.knowledge && player.knowledge.players[opponentId];
                    return !knowledge || !knowledge.suits || knowledge.suits[leadSuit] !== 1;
                });
            }).length;
            var winProbability = 0;

            if (winsSoFar) {
                if (!remainingPlayers.length) {
                    winProbability = 1;
                }
                else {
                    var chanceHigherCard = Math.min(1, higherCards / Math.max(1, remainingCards.length));
                    winProbability = Math.pow(1 - chanceHigherCard, remainingPlayers.length * 1.5);
                }
            }

            var pointsInLeadSuit = remainingCards.filter(function (otherCard) {
                return otherCard.suit === leadSuit;
            }).reduce(function (total, otherCard) {
                return total + otherCard.points;
            }, 0);
            var potentialSuitPoints = pointsInLeadSuit * Math.min(1, remainingPlayers.length / 3);
            var expectedDiscardPoints = Math.max(0, remainingPoints - pointsInLeadSuit) *
                remainingPlayers.length / Math.max(1, remainingCards.length);
            var trickPoints = existingPoints + card.points + potentialSuitPoints;
            var expectedPenalty = (trickPoints + expectedDiscardPoints) * winProbability;
            var rank = card.getValue();
            var openingAdjustment = 0;
            var discardAdjustment = 0;

            if (!playedCards.length) {
                var suitLength = player.cards.filter(function (heldCard) {
                    return heldCard.suit === card.suit;
                }).length;
                openingAdjustment = rank * 0.025 - suitLength * 0.12;
                expectedPenalty += openingAdjustment;

                if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.queen) {
                    var queenRisk = remainingCards.some(function (otherCard) {
                        return otherCard.suit === HeartsConstants.spade &&
                            (otherCard.rank === HeartsConstants.king || otherCard.rank === HeartsConstants.ace);
                    });
                    openingAdjustment += queenRisk ? 20 : 0;
                    expectedPenalty += queenRisk ? 20 : 0;
                }
            }
            else if (existingPoints > 0 && !winsSoFar) {
                expectedPenalty -= rank * 0.01;
            }
            else {
                expectedPenalty += rank * 0.002;
            }

            if (turnSuit && card.suit !== turnSuit) {
                discardAdjustment = -Hearts.AI.getDiscardRisk(card) * 0.02;
                expectedPenalty += discardAdjustment;
            }

            candidateScores.push({
                card: card.id,
                estimatedPenalty: Number(expectedPenalty.toFixed(3)),
                winProbability: Number(winProbability.toFixed(3)),
                winsSoFar: winsSoFar,
                trickPoints: trickPoints,
                potentialSuitPoints: Number(potentialSuitPoints.toFixed(3)),
                openingAdjustment: Number(openingAdjustment.toFixed(3)),
                discardAdjustment: Number(discardAdjustment.toFixed(3))
            });

            if (expectedPenalty < bestScore) {
                bestScore = expectedPenalty;
                bestCard = card;
            }
        }

        Hearts.AI.logDecision("move selected", {
            player: player.id,
            trick: playedCards.map(function (card) { return card.id; }),
            candidates: candidateScores,
            selected: bestCard.id,
            reason: "lowest estimated penalty score"
        });

        return bestCard.id;
    },

    getCardRank: function (card) {
        return card.getValue();
    },

    getPassRisk: function (card, suitCounts, recipientKnowledge) {
        var rank = Hearts.AI.getCardRank(card);
        var risk = rank * 2;

        if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.queen) {
            risk += 1000;
        }
        else if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.ace) {
            risk += 500;
        }
        else if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.king) {
            risk += 400;
        }
        else if (card.suit === HeartsConstants.heart && card.rank === HeartsConstants.ace) {
            risk += 350;
        }
        else if (card.suit === HeartsConstants.heart && card.rank === HeartsConstants.king) {
            risk += 300;
        }
        else if (card.suit === HeartsConstants.heart && rank >= 11) {
            risk += 250;
        }
        else if (card.points) {
            risk += 80;
        }

        if (suitCounts[card.suit] <= 3) {
            risk += Math.max(0, 12 - suitCounts[card.suit] * 3);
        }
        if (recipientKnowledge && recipientKnowledge.suits && recipientKnowledge.suits[card.suit] === 0) {
            risk += rank;
        }

        return risk;
    },

    getDiscardRisk: function (card) {
        var rank = Hearts.AI.getCardRank(card);

        if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.queen) {
            return 1000;
        }
        if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.ace) {
            return 100;
        }
        if (card.suit === HeartsConstants.spade && card.rank === HeartsConstants.king) {
            return 80;
        }
        if (card.suit === HeartsConstants.heart && rank >= 11) {
            return 60 + rank;
        }
        if (rank >= 11) {
            return rank * 3;
        }

        return rank;
    },

    /**
     * Returns the best suit to shorten, or null when shortening is not worthwhile.
     * Suits of four or more cards are never candidates.
     */
    shouldShortSuit: function (player) {
        var suits = [HeartsConstants.club, HeartsConstants.diamond, HeartsConstants.spade, HeartsConstants.heart];
        var cards = player.cards.filter(function (card) {
            return !card.passed;
        });
        var suitCounts = {};

        suits.forEach(function (suit) {
            suitCounts[suit] = 0;
        });
        cards.forEach(function (card) {
            suitCounts[card.suit]++;
        });

        var dangerousCards = cards.filter(function (card) {
            return card.points > 0 || (card.suit === HeartsConstants.spade && card.getValue() >= 12) ||
                (card.suit === HeartsConstants.heart && card.getValue() >= 12);
        }).length;
        var suitAnalysis = suits.filter(function (suit) {
            return suitCounts[suit] >= 1 && suitCounts[suit] <= 3;
        }).map(function (suit) {
            var suitCards = cards.filter(function (card) {
                return card.suit === suit;
            });
            var risk = suitCards.reduce(function (total, card) {
                return total + Hearts.AI.getPassRisk(card, suitCounts);
            }, 0);
            var containsDanger = suitCards.some(function (card) {
                return card.points > 0 || card.getValue() >= 11;
            });
            var remainingSuits = suits.filter(function (otherSuit) {
                return otherSuit !== suit && suitCounts[otherSuit] > 0;
            }).length;

            return { suit: suit, count: suitCounts[suit], risk: risk, containsDanger: containsDanger, remainingSuits: remainingSuits };
        });
        var candidates = suitAnalysis.filter(function (candidate) {
            return candidate.containsDanger && dangerousCards > 0 && candidate.remainingSuits >= 2;
        });

        candidates.sort(function (a, b) {
            return a.count - b.count || b.risk - a.risk;
        });

        var selectedSuit = candidates.length ? candidates[0].suit : null;
        Hearts.AI.logDecision("short-suit analysis", {
            player: player.id,
            dangerousCards: dangerousCards,
            candidates: suitAnalysis,
            selectedSuit: selectedSuit,
            reason: selectedSuit ? "shortest eligible suit with dangerous cards" : "no suit met the short-suit criteria"
        });

        return selectedSuit;
    },

    getPassCards: function (player, recipientId) {
        var cards = player.cards.filter(function (card) {
            return !card.passed;
        });
        var suitCounts = {};
        cards.forEach(function (card) {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });

        var recipientKnowledge = player.knowledge && player.knowledge.players[recipientId];
        var targetSuit = Hearts.AI.shouldShortSuit(player);
        var sorted = cards.slice().sort(function (a, b) {
            return Hearts.AI.getPassRisk(b, suitCounts, recipientKnowledge) -
                Hearts.AI.getPassRisk(a, suitCounts, recipientKnowledge);
        });
        var selected = targetSuit ? sorted.filter(function (card) {
            return card.suit === targetSuit;
        }) : [];

        for (var i = 0; i < sorted.length && selected.length < 3; i++) {
            if (selected.indexOf(sorted[i]) === -1) {
                selected.push(sorted[i]);
            }
        }

        selected = selected.slice(0, 3);
        Hearts.AI.logDecision("pass cards selected", {
            player: player.id,
            recipient: recipientId || null,
            targetSuit: targetSuit,
            selected: selected.map(function (card) {
                return {
                    card: card.id,
                    risk: Hearts.AI.getPassRisk(card, suitCounts, recipientKnowledge)
                };
            }),
            reason: targetSuit ? "shorten target suit, then shed highest-risk cards" : "shed highest-risk cards"
        });

        return selected;
    },

    shouldPursueMoonShot: function (estimatedSuccessProbability) {
        var shouldPursue = Hearts.AI.moonShootingEnabled &&
            estimatedSuccessProbability >= Hearts.AI.moonShootingThreshold;
        Hearts.AI.logDecision("moon-shot evaluation", {
            enabled: Hearts.AI.moonShootingEnabled,
            estimatedSuccessProbability: estimatedSuccessProbability,
            threshold: Hearts.AI.moonShootingThreshold,
            selected: shouldPursue,
            reason: shouldPursue ? "enabled and above threshold" : "disabled or below threshold"
        });
        return shouldPursue;
    },

    /**
     * Passes cards for all AI players in the game.
     */
    passCards: function (players) {
        if (Hearts.Game.currentPassTo === HeartsConstants.passStay) {
            Hearts.AI.logDecision("passing skipped", { reason: "current hand has no pass" });
            return;
        }

        var selections = {};
        var recipients = {};
        for (var key in players) {
            if (players[key].ai) {
                recipients[key] = HeartsHelpers.getPlayerToPassTo(key);
                selections[key] = Hearts.AI.getPassCards(players[key], recipients[key]);
            }
        }

        for (var key in selections) {
            var player = players[key];
            var removedCards = selections[key].map(function (card) {
                return player.removeCard(card.id);
            }).filter(Boolean);
            var recipientId = recipients[key];

            player.updateCardKnowledge(removedCards, recipientId);
            Hearts.AI.logDecision("cards passed", {
                player: key,
                recipient: recipientId,
                cards: removedCards.map(function (card) { return card.id; })
            });
            removedCards.forEach(function (card) {
                players[recipientId].addCard(card, true);

                if (!players[recipientId].ai) {
                    card.mark(HeartsConstants.markPass);
                }
            });
        }
    }
};