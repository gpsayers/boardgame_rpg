// Spell and card helpers shared by the battle scene and the AI.

function updateCreatureHealthBar(creature) {
    var maxHealth = Math.max(creature.maxhitpoints, 1);
    var healthRatio = Math.max(0, Math.min(creature.hitpoints / maxHealth, 1));
    var damageWidth = creature.hitspritegreen.displayWidth * (1 - healthRatio);

    creature.hitspritered.displayWidth = damageWidth;
    creature.hitspritered.x = creature.hitspritegreen.x +
        creature.hitspritegreen.displayWidth - damageWidth;
}


function computerDrawCard(currentPlayer) {
    //Draw Card
    if (gameVariables.gamePlayerArray[currentPlayer].deck.length < 1) {
        gameVariables.gamePlayerArray[currentPlayer].deck = gameVariables.gamePlayerArray[currentPlayer].discard.slice();
        gameVariables.gamePlayerArray[currentPlayer].deck = shuffle(gameVariables.gamePlayerArray[currentPlayer].deck);
        gameVariables.gamePlayerArray[currentPlayer].discard.length = 0;
    }

    var card = gameVariables.gamePlayerArray[currentPlayer].deck.pop();

    if (typeof card !== 'undefined') {
        gameVariables.gamePlayerArray[currentPlayer].hand.push(card);
    }
}


// Valid teleport destinations: never the subject's own square, and a creature cannot
// land on a square holding a creature owned by the same player.
function getTeleportDestinations(subjectType, subject) {
    var fromId = subjectType === "creature" ? subject.squareId : subject.sprite.gameSquareId;
    return gameVariables.gameBoard.filter(function (square) {
        if (square.id == fromId) {
            return false;
        }
        return !(subjectType === "creature" && square.creature &&
            square.creature.playerOwnedId === subject.playerOwnedId);
    });
}


function chooseAITeleportDestination(subjectType, subject, owner, destinations) {
    var scored = destinations.map(function (square) {
        var score = Math.random();
        if (subjectType === "creature") {
            var unowned = square.ownerPlayerId !== undefined
                ? square.ownerPlayerId !== owner.id
                : square.sprite.texture.key !== owner.color;
            if (!square.creature) {
                score += 2;
            } else if (Math.max(subject.attack - square.creature.armor, 0) >= square.creature.hitpoints) {
                score += 2;
            }
            if (unowned) {
                score += 1;
            }
        }
        return { square: square, score: score };
    });
    scored.sort(function (a, b) {
        return b.score - a.score;
    });
    return scored.length ? scored[0].square : null;
}


function getSummonCreatureCard(card) {
    var creatureCard = card.secondSpell && masterCardList.find(function (item) {
        return item.id === card.secondSpell;
    });
    if (!creatureCard || !creatureCard.creature) {
        console.error("Card " + card.name + " uses Summon but SecondSpell is not a creature card ID.");
        return null;
    }
    return creatureCard;
}


// Summon destinations exclude squares already holding a creature owned by the summoner.
function getSummonDestinations(owner) {
    return gameVariables.gameBoard.filter(function (square) {
        return !(square.creature && square.creature.playerOwnedId === owner.id);
    });
}


function chooseAISummonSquare(creatureCard, owner, destinations) {
    var scored = destinations.map(function (square) {
        var score = Math.random();
        if (!square.creature) {
            score += 2;
        } else if (Math.max(creatureCard.attack - square.creature.armor, 0) >= square.creature.hitpoints) {
            score += 2;
        }
        var unowned = square.ownerPlayerId !== undefined
            ? square.ownerPlayerId !== owner.id
            : square.sprite.texture.key !== owner.color;
        if (unowned) {
            score += 1;
        }
        return { square: square, score: score };
    });
    scored.sort(function (a, b) {
        return b.score - a.score;
    });
    return scored.length ? scored[0].square : null;
}


// Resolves a card's special effect. The acting player is gameVariables.currentPlayer.
// Effects that need board or UI work (movement, teleport/summon targeting, duplicate,
// transform, unsummon, secondary spells) are resolved by the battle scene itself.
function processSpecialSpell(card, player, targetSquare, targetType, targetImage) {
    var currentPlayer = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        var squareId = targetSquare && typeof targetSquare === "object"
            ? targetSquare.id
            : targetSquare;
        return item.id == squareId;
    });

    var targetPlayer = targetType === "player" ? player : null;
    var targetCreature = targetType === "creature" && boardSquareDetail
        ? boardSquareDetail.creature
        : null;

    switch (card.special) {
        case SPECIAL_EFFECT.STEAL_GOLD:
            var victim = targetPlayer || gameVariables.gamePlayerArray.find(function (item) {
                return item.class == targetImage;
            });
            if (victim && victim !== currentPlayer) {
                var stolenGold = Math.min(Math.max(0, card.damage), Math.max(victim.gold, 0));
                victim.gold -= stolenGold;
                currentPlayer.gold += stolenGold;
            }
            break;
        case SPECIAL_EFFECT.SLOW_MOVEMENT:
            if (targetPlayer) {
                targetPlayer.movementPenalty = (targetPlayer.movementPenalty || 0) +
                    Math.max(0, card.damage);
            }
            break;
        case SPECIAL_EFFECT.HEAL:
            if (targetCreature) {
                targetCreature.hitpoints = Math.min(
                    targetCreature.hitpoints + card.damage,
                    targetCreature.maxhitpoints
                );
                updateCreatureHealthBar(targetCreature);
            } else if (targetPlayer) {
                targetPlayer.hp = Math.min(targetPlayer.hp + card.damage, targetPlayer.maxhp);
            }
            break;
        case SPECIAL_EFFECT.GAIN_GOLD:
            grantBattleGold(currentPlayer, card.damage);
            break;
        case SPECIAL_EFFECT.BUFF_CREATURE:
            if (targetCreature) {
                targetCreature.hitpoints += card.defense;
                targetCreature.maxhitpoints += card.defense;
                targetCreature.armor += card.armor;
                targetCreature.attack += card.attack;
                ["flying", "blitz", "deadly", "reach"].forEach(function (ability) {
                    if (card[ability]) {
                        targetCreature[ability] = card[ability];
                    }
                });
                targetCreature.regen = (targetCreature.regen || 0) + (card.regen || 0);
                updateCreatureHealthBar(targetCreature);
            }
            break;
        case SPECIAL_EFFECT.DEBUFF_CREATURE:
        case SPECIAL_EFFECT.SET_CREATURE_STATS:
            if (targetCreature) {
                if (card.special === SPECIAL_EFFECT.SET_CREATURE_STATS) {
                    // Sets the stat (never raising it), including to 0. Max HP is kept at 1 or more
                    // so HP only drops to the new max and this never kills a creature.
                    // If value is -1 it will not change that stat
                    if (card.defense !== -1) {
                        var newMaxHp = Math.max(Math.min(targetCreature.maxhitpoints, card.defense), 1);
                        targetCreature.maxhitpoints = newMaxHp;
                        targetCreature.hitpoints = Math.min(targetCreature.hitpoints, newMaxHp);
                    }
                    if (card.attack !== -1) {
                        targetCreature.attack = Math.max(0, Math.min(targetCreature.attack, card.attack));
                    }
                } else {
                    targetCreature.hitpoints -= Math.max(0, card.defense);
                    targetCreature.maxhitpoints = Math.max(
                        0,
                        targetCreature.maxhitpoints - Math.max(0, card.defense)
                    );
                    targetCreature.attack = Math.max(
                        0,
                        targetCreature.attack - Math.max(0, card.attack)
                    );
                }
                targetCreature.armor = Math.max(
                    0,
                    targetCreature.armor - Math.max(0, card.armor)
                );
                if (card.flying) {
                    targetCreature.flying = 0;
                }
                if (card.blitz) {
                    targetCreature.blitz = 0;
                }
                if (card.deadly) {
                    targetCreature.deadly = 0;
                }
                if (card.reach) {
                    targetCreature.reach = 0;
                }
                if (card.regen) {
                    targetCreature.regen = 0;
                }

                if (targetCreature.hitpoints <= 0) {
                    [targetCreature.sprite, targetCreature.hitspritegreen, targetCreature.hitspritered]
                        .forEach(function (sprite) {
                            if (sprite && sprite.destroy) {
                                sprite.destroy();
                            }
                        });
                    boardSquareDetail.creature = null;
                } else {
                    updateCreatureHealthBar(targetCreature);
                }
            }
            break;
        case SPECIAL_EFFECT.SELF_DAMAGE:
            currentPlayer.hp = Math.max(0, currentPlayer.hp - Math.max(0, card.damage));
            break;
        case SPECIAL_EFFECT.BOOST_MANA:
            currentPlayer.mana = Math.min(
                currentPlayer.maxmana,
                currentPlayer.mana + Math.max(0, card.damage)
            );
            break;
        case SPECIAL_EFFECT.BOOST_MAX_MANA:
            // A negative value drains the targeted player's max mana (the caster if no player is targeted).
            var maxManaPlayer = card.damage < 0 && targetPlayer && "maxmana" in targetPlayer
                ? targetPlayer
                : currentPlayer;
            maxManaPlayer.maxmana = Math.max(0, maxManaPlayer.maxmana + card.damage);
            maxManaPlayer.mana = Math.min(maxManaPlayer.mana, maxManaPlayer.maxmana);
            break;
    }
}
