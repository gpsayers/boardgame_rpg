var computerAI = (function () {

    // Completing the capture requirement, or killing the human, ends the battle in the AI's favour.
    var VICTORY_VALUE = 1000;
    // Creature strength is divided by this to give a 0-1 style threat fraction.
    var STRENGTH_SCALE = 8;
    var HAZARD_COST_PER_DAMAGE = 6;
    // The AI keeps picking +1 max mana as its start reward until its max mana reaches this.
    var START_REWARD_MANA_CAP = 5;

    function getProfile(player) {
        return aiProfiles[player.aiProfile] || aiProfiles.opportunist;
    }

    // How much this player cares about one of the objectives in ai_profiles.js.
    function weight(player, objective) {
        var multipliers = getProfile(player).multipliers || {};
        return aiObjectiveWeights[objective] * (multipliers[objective] || 1);
    }

    function getBoardSquare(squareId) {
        return gameVariables.gameBoard.find(function (square) {
            return square.id === squareId;
        });
    }

    function findPlayer(playerId) {
        return gameVariables.gamePlayerArray.find(function (candidate) {
            return candidate.id === playerId;
        });
    }

    function getSpecialSquare(squareId) {
        return (gameVariables.boardInfo.specialSquares || []).find(function (item) {
            return item.squareId === squareId;
        });
    }

    function getCaptureRequirement() {
        return gameVariables.boardInfo.captureRequirement || gameVariables.boardInfo.boardTotal;
    }

    function isFriendlyCreature(creature, player) {
        return creature.playerOwnedId === player.id;
    }

    function isMaxManaDrain(card) {
        return card.special === SPECIAL_EFFECT.BOOST_MAX_MANA && card.damage < 0;
    }

    // Cards the AI never plays: movement and duplication need choices the AI does not make.
    function isPlayableByAI(card) {
        return card.special !== SPECIAL_EFFECT.MOVE_FORWARD &&
            card.special !== SPECIAL_EFFECT.MOVE_BACK &&
            card.special !== SPECIAL_EFFECT.DUPLICATE_CARD;
    }

    // Cards that can never help the AI and only take up a hand slot.
    function isDeadCard(card) {
        return !isPlayableByAI(card) ||
            (card.special === SPECIAL_EFFECT.SELF_DAMAGE && !card.secondSpell);
    }

    // A single number for how strong a creature (card or board creature) is, abilities included.
    function strength(stats) {
        var health = stats.hitpoints !== undefined ? stats.hitpoints : stats.defense;
        return (stats.attack || 0) + health / 2 + (stats.armor || 0) +
            (stats.flying ? 1.5 : 0) + (stats.blitz ? 1 : 0) + (stats.reach ? 0.5 : 0) +
            (stats.deadly ? 2 : 0) + (stats.regen ? 1 : 0);
    }

    // Objective: destroy creatures that threaten the AI.
    function threatValue(creature, player) {
        var value = weight(player, "destroyThreats") * strength(creature) / STRENGTH_SCALE;
        var owner = findPlayer(creature.playerOwnedId);
        if (owner && owner.human) {
            value *= 1.25;
        }
        if (creature.squareId === player.sprite.gameSquareId) {
            value *= 1.5;
        }
        return value;
    }

    // Objective: capture squares (and special squares) until the capture requirement is met.
    function squareCaptureValue(square, player) {
        if (square.ownerPlayerId === player.id) {
            return 0;
        }
        var requirement = getCaptureRequirement();
        if (requirement && player.capturedSquares + 1 >= requirement) {
            return VICTORY_VALUE;
        }
        var value = weight(player, "captureVictory") * (1 + (requirement ? player.capturedSquares / requirement : 0));
        var previousOwner = square.ownerPlayerId !== undefined ? findPlayer(square.ownerPlayerId) : null;
        if (previousOwner && previousOwner.human) {
            value *= 1.2;
        }
        var special = getSpecialSquare(square.id);
        if (special && special.type !== "pressure" && special.type !== "magictrap") {
            value += weight(player, "captureSpecial") * 0.5;
        }
        return value;
    }

    // What summoning this creature card onto this square is worth: the body itself, the square it
    // captures, and any threatening creature it destroys. A fight it loses is worth nothing.
    function summonValue(creatureCard, square, player) {
        var body = strength(creatureCard) * 1.5;
        var occupant = square.creature;
        if (!occupant) {
            return body + squareCaptureValue(square, player);
        }
        if (isFriendlyCreature(occupant, player)) {
            return 0;
        }

        var fight = simulateCombat(creatureCard, occupant);
        if (fight.defenderHp <= 0) {
            var value = threatValue(occupant, player);
            if (fight.attackerHp > 0) {
                value += body + squareCaptureValue(square, player);
            }
            return value;
        }
        return threatValue(occupant, player) * 0.5 * (occupant.hitpoints - fight.defenderHp) / occupant.hitpoints;
    }

    function bestSummonSquareValue(creatureCard, player) {
        return getSummonDestinations(player).reduce(function (best, square) {
            return Math.max(best, summonValue(creatureCard, square, player));
        }, 0);
    }

    // The creature stats after a Debuff or Set Creature Stats card hits them (mirrors processSpecialSpell).
    function creatureAfterDebuff(card, creature) {
        var after = {
            attack: creature.attack, armor: creature.armor, hitpoints: creature.hitpoints,
            maxhitpoints: creature.maxhitpoints, flying: creature.flying, blitz: creature.blitz,
            deadly: creature.deadly, reach: creature.reach, regen: creature.regen
        };
        if (card.special === SPECIAL_EFFECT.SET_CREATURE_STATS) {
            if (card.defense !== -1) {
                after.maxhitpoints = Math.max(Math.min(creature.maxhitpoints, card.defense), 1);
                after.hitpoints = Math.min(creature.hitpoints, after.maxhitpoints);
            }
            if (card.attack !== -1) {
                after.attack = Math.max(0, Math.min(creature.attack, card.attack));
            }
        } else {
            after.hitpoints -= Math.max(0, card.defense);
            after.attack = Math.max(0, creature.attack - Math.max(0, card.attack));
        }
        after.armor = Math.max(0, creature.armor - Math.max(0, card.armor));
        ["flying", "blitz", "deadly", "reach", "regen"].forEach(function (ability) {
            if (card[ability]) {
                after[ability] = 0;
            }
        });
        return after;
    }

    function damageValueAgainstPlayer(card, target, player) {
        var damage = Math.max(card.damage - target.armor, 0);
        if (damage <= 0) {
            return 0;
        }
        // Rivals matter less than the human, who is the one the AI must defeat.
        var share = target.human ? 1 : 0.3;
        if (target.human && damage >= target.hp) {
            return VICTORY_VALUE;
        }
        return weight(player, "defeatHuman") * share * Math.min(damage / target.hp, 1);
    }

    function getTargetValue(card, target, player) {
        var targetPlayer = target.type === "player" ? target.model : null;
        var targetCreature = target.type === "creature" ? target.model : null;
        var square = getBoardSquare(target.targetSquare);
        var isSelf = !!targetPlayer && targetPlayer.id === player.id;
        var isFriendly = !!targetCreature && isFriendlyCreature(targetCreature, player);
        var isAll = card.targetlocation === "all";

        switch (card.special) {
            case SPECIAL_EFFECT.MOVE_FORWARD:
            case SPECIAL_EFFECT.MOVE_BACK:
            case SPECIAL_EFFECT.DUPLICATE_CARD:
                return 0;

            case SPECIAL_EFFECT.STEAL_GOLD:
                if (!targetPlayer || isSelf || targetPlayer.gold <= 0) {
                    return 0;
                }
                return weight(player, "stealGold") * (targetPlayer.human ? 1 : 0.3) *
                    Math.min(card.damage, targetPlayer.gold) / Math.max(card.damage, 1);

            case SPECIAL_EFFECT.SLOW_MOVEMENT:
                return targetPlayer && !isSelf
                    ? weight(player, "defeatHuman") * 0.1 * Math.max(card.damage, 0) * (targetPlayer.human ? 1 : 0.5)
                    : 0;

            case SPECIAL_EFFECT.HEAL:
                if (isFriendly) {
                    return 10 * Math.max(targetCreature.maxhitpoints - targetCreature.hitpoints, 0) /
                        Math.max(targetCreature.maxhitpoints, 1);
                }
                if (isSelf) {
                    var missing = Math.min(card.damage, Math.max(player.maxhp - player.hp, 0)) / player.maxhp;
                    return 12 * missing * (player.hp <= 3 ? 2 : 1);
                }
                return 0;

            case SPECIAL_EFFECT.BUFF_CREATURE:
                return isFriendly ? 4 * (card.attack + card.defense + card.armor) : 0;

            case SPECIAL_EFFECT.DEBUFF_CREATURE:
            case SPECIAL_EFFECT.SET_CREATURE_STATS:
                if (!targetCreature || isFriendly) {
                    return 0;
                }
                var before = strength(targetCreature);
                var after = creatureAfterDebuff(card, targetCreature);
                var reduction = after.hitpoints <= 0 && card.special === SPECIAL_EFFECT.DEBUFF_CREATURE
                    ? before
                    : Math.max(before - strength(after), 0);
                return threatValue(targetCreature, player) * reduction / Math.max(before, 0.5);

            case SPECIAL_EFFECT.TRANSFORM:
                var transformInto = masterCardList.find(function (item) {
                    return item.id === card.secondSpell;
                });
                if (!targetCreature || !transformInto || !transformInto.creature) {
                    return 0;
                }
                var currentStrength = strength(targetCreature);
                var newStrength = strength(transformInto);
                return isFriendly
                    ? 4 * Math.max(newStrength - currentStrength, 0)
                    : threatValue(targetCreature, player) * Math.max(currentStrength - newStrength, 0) /
                        Math.max(currentStrength, 0.5);

            case SPECIAL_EFFECT.UNSUMMON:
                // The creature returns to its owner's hand, but the squares it captured stay captured.
                return targetCreature && !isFriendly ? threatValue(targetCreature, player) * 0.6 : 0;

            case SPECIAL_EFFECT.TELEPORT:
                if (isFriendly) {
                    return getTeleportDestinations("creature", targetCreature).length > 0 ? 2 : 0;
                }
                return isSelf && getTeleportDestinations("player", targetPlayer).length > 0 ? 1 : 0;

            case SPECIAL_EFFECT.SUMMON:
                var summoned = masterCardList.find(function (item) {
                    return item.id === card.secondSpell;
                });
                return summoned && summoned.creature ? bestSummonSquareValue(summoned, player) : 0;

            case SPECIAL_EFFECT.DRAW_CARDS:
                return 8 * Math.min(card.damage, player.deck.length + player.discard.length);

            case SPECIAL_EFFECT.GAIN_GOLD:
                return 0.5 * card.damage;

            case SPECIAL_EFFECT.BOOST_MANA:
                return 10 * Math.min(card.damage, player.maxmana - player.mana);

            case SPECIAL_EFFECT.BOOST_MAX_MANA:
                if (isMaxManaDrain(card)) {
                    return targetPlayer && !isSelf
                        ? 8 * Math.min(-card.damage, targetPlayer.maxmana) * (targetPlayer.human ? 1 : 0.6)
                        : 0;
                }
                return 12 * card.damage;

        }

        // Creature cards are summoned on the caster's own square.
        if (card.creature) {
            return target.type === "ground" && square ? summonValue(card, square, player) : 0;
        }

        // Plain damage spells.
        if (targetPlayer) {
            if (isSelf) {
                return isAll ? -Math.max(card.damage - player.armor, 0) * 4 : 0;
            }
            return damageValueAgainstPlayer(card, targetPlayer, player);
        }
        if (targetCreature) {
            var creatureDamage = Math.max(card.damage - targetCreature.armor, 0);
            if (isFriendly) {
                return isAll ? -4 * creatureDamage : 0;
            }
            return threatValue(targetCreature, player) * Math.min(creatureDamage / targetCreature.hitpoints, 1);
        }
        return 0;
    }

    // Best single target (or the total for an all-target card) among the candidates.
    function evaluateTargets(card, candidates, player) {
        var utility = 0;
        var bestTargetIndex = 0;
        if (card.targetlocation === "all") {
            utility = candidates.reduce(function (total, target) {
                return total + getTargetValue(card, target, player);
            }, 0);
        } else {
            candidates.forEach(function (target, index) {
                var value = getTargetValue(card, target, player);
                if (value > utility) {
                    utility = value;
                    bestTargetIndex = index;
                }
            });
        }
        return { utility: utility, targetIndex: bestTargetIndex };
    }

    // Many cards also cast a second spell (secondSpell). Transform and Summon use that field for a creature.
    function getSecondSpell(card) {
        if (!card.secondSpell || card.special === SPECIAL_EFFECT.TRANSFORM ||
            card.special === SPECIAL_EFFECT.SUMMON) {
            return null;
        }
        var secondCard = masterCardList.find(function (item) {
            return item.id === card.secondSpell;
        });
        return secondCard && secondCard.spell ? secondCard : null;
    }

    function secondSpellValue(card, player, targetProvider) {
        var secondCard = getSecondSpell(card);
        var candidates = secondCard && targetProvider ? targetProvider(secondCard, player) : [];
        return candidates.length > 0 ? evaluateTargets(secondCard, candidates, player).utility : 0;
    }

    // Targets for a card's second spell: nothing at all if casting it would not help the AI.
    function chooseSecondarySpellTargets(secondCard, player, targetProvider) {
        var candidates = targetProvider(secondCard, player);
        if (candidates.length === 0) {
            return [];
        }
        var evaluation = evaluateTargets(secondCard, candidates, player);
        if (evaluation.utility <= 0) {
            return [];
        }
        return secondCard.targetlocation === "all" ? candidates : [candidates[evaluation.targetIndex]];
    }

    function scoreCard(card, player, targetProvider) {
        if (card.cost > player.mana || !isPlayableByAI(card)) {
            return null;
        }

        if (!masterCardList.some(function (item) {
            return item.id === card.id;
        })) {
            return null;
        }

        var candidates = targetProvider ? targetProvider(card, player) : [];
        if (candidates.length === 0) {
            return null;
        }

        var evaluation = evaluateTargets(card, candidates, player);
        var utility = evaluation.utility + secondSpellValue(card, player, targetProvider);
        if (card.special === SPECIAL_EFFECT.SELF_DAMAGE) {
            // Hurting itself is only worth it for the second spell, and never when it could be fatal.
            if (player.hp <= card.damage + 2) {
                return null;
            }
            utility -= 4 * card.damage;
        }
        if (utility <= 0) {
            return null;
        }

        return {
            card: card,
            targetIndex: evaluation.targetIndex,
            targets: candidates,
            // card.threat is a designer hint; mana cost breaks ties towards cheaper plays.
            score: utility + card.threat * 0.5 - card.cost * 0.5
        };
    }

    // targetProvider lets a scene supply its own target list; omitted for the main board.
    function getBestCard(player, targetProvider) {
        return player.hand.reduce(function (best, card) {
            var candidate = scoreCard(card, player, targetProvider);
            return candidate && (!best || candidate.score > best.score) ? candidate : best;
        }, null);
    }

    // Best square to summon a creature onto when a spell lets the AI pick any square.
    function chooseSummonSquare(creatureCard, player, destinations) {
        var best = null;
        var bestValue = -Infinity;
        destinations.forEach(function (square) {
            var value = summonValue(creatureCard, square, player) + Math.random() * 0.5;
            if (value > bestValue) {
                bestValue = value;
                best = square;
            }
        });
        return best;
    }

    // Early on the AI builds its mana. Later it heals when hurt, draws when its hand is nearly empty,
    // and otherwise takes gold.
    function chooseStartReward(player) {
        if (player.maxmana < START_REWARD_MANA_CAP) {
            return "mana";
        }
        if (player.hp < player.maxhp && player.hp <= player.maxhp * 0.4) {
            return "health";
        }
        if (player.hand.length <= 1 && player.deck.length + player.discard.length > 0) {
            return "cards";
        }
        return "gold";
    }

    // Throws away cards the AI can never play so they stop blocking draws.
    function discardDeadCards(player, onDiscard) {
        player.hand.filter(isDeadCard).forEach(function (card) {
            player.hand.splice(player.hand.indexOf(card), 1);
            discardCard(player, card);
            if (onDiscard) {
                onDiscard(player, card);
            }
        });
    }

    // Value of ending a move on this square: the loot or hazard on it, a creature that would hurt the
    // AI, and the chance to capture it with a creature already in hand.
    function landingValue(square, player, crossings) {
        var value = 0;
        var special = getSpecialSquare(square.id);
        if (special && special.looted === 0) {
            if (special.type === "chest" && special.result !== "relic") {
                value += weight(player, "captureSpecial");
            } else if (special.type === "pressure") {
                var pitDamage = Math.max(special.result - (player.armor || 0), 0);
                value -= player.hp <= pitDamage ? VICTORY_VALUE : pitDamage * HAZARD_COST_PER_DAMAGE;
            }
        }
        if (special && special.type === "magictrap") {
            value -= player.hp <= special.result ? VICTORY_VALUE : special.result * HAZARD_COST_PER_DAMAGE;
        }
        if (square.creature && !isFriendlyCreature(square.creature, player)) {
            var hit = Math.max(square.creature.attack - (player.armor || 0), 0);
            value -= player.hp <= hit ? VICTORY_VALUE : hit * HAZARD_COST_PER_DAMAGE;
        }

        // Creatures are only summoned on the square the AI stands on, so the landing square decides
        // what it can capture this turn. Crossing start can add a mana to spend if the AI picks that reward.
        var mana = player.mana + (crossings > 0 && chooseStartReward(player) === "mana" ? 1 : 0);
        var capture = player.hand.reduce(function (best, card) {
            return card.creature && card.cost <= mana
                ? Math.max(best, summonValue(card, square, player))
                : best;
        }, 0);
        return value + capture * 0.7;
    }

    function scoreRoute(route, player) {
        var sequence = [player.sprite.gameSquareId].concat(route);
        var crossings = 0;
        for (var i = 0; i < sequence.length - 1; i++) {
            if (sequence[i] === gameVariables.boardInfo.boardEnd &&
                sequence[i + 1] === gameVariables.boardInfo.boardStart) {
                crossings++;
            }
        }
        var landing = getBoardSquare(route[route.length - 1]);
        return crossings * weight(player, "crossStart") + (landing ? landingValue(landing, player, crossings) : 0);
    }

    // Picks the first step of the best full route for the rolled movement.
    function choosePath(pathIds, player, stepsRemaining) {
        player = player || gameVariables.gamePlayerArray[gameVariables.currentPlayer];
        if (!player) {
            throw new Error("Cannot choose a movement path without an active player.");
        }
        if (pathIds.length === 1) {
            return pathIds[0];
        }

        var routes = stepsRemaining > 0
            ? getPossibleMovementRoutes(pathIds, stepsRemaining)
            : pathIds.map(function (squareId) {
                return [squareId];
            });
        var bestScore = -Infinity;
        var bestFirstSteps = [];
        routes.forEach(function (route) {
            var score = scoreRoute(route, player);
            if (score > bestScore) {
                bestScore = score;
                bestFirstSteps = [route[0]];
            } else if (score === bestScore && bestFirstSteps.indexOf(route[0]) === -1) {
                bestFirstSteps.push(route[0]);
            }
        });

        if (bestFirstSteps.length === 0) {
            return pathIds[Math.floor(Math.random() * pathIds.length)];
        }
        return bestFirstSteps[Math.floor(Math.random() * bestFirstSteps.length)];
    }

    function getNextPathIdsFrom(currentSquareId, forward) {
        var currentSquare = getBoardSquare(currentSquareId);
        if (!currentSquare || !currentSquare.sprite) {
            throw new Error("Cannot move player from missing board square " + currentSquareId);
        }

        var neighbors = Array2D.orthogonals(
            gameVariables.boardInfo.squares,
            currentSquare.sprite.gridY,
            currentSquare.sprite.gridX
        );
        var boardInfo = gameVariables.boardInfo;
        var nextPathIds;

        if (forward) {
            if (currentSquareId === boardInfo.boardEnd) {
                nextPathIds = neighbors.filter(function (squareId) {
                    return squareId === boardInfo.boardStart;
                });
            } else if (currentSquareId === boardInfo.boardStart) {
                nextPathIds = neighbors.filter(function (squareId) {
                    return squareId > currentSquareId && squareId !== boardInfo.boardEnd;
                });
            } else {
                nextPathIds = neighbors.filter(function (squareId) {
                    return squareId > currentSquareId;
                });
            }
        } else if (currentSquareId === boardInfo.boardStart) {
            nextPathIds = neighbors.filter(function (squareId) {
                return squareId === boardInfo.boardEnd;
            });
        } else if (currentSquareId === boardInfo.boardEnd) {
            nextPathIds = neighbors.filter(function (squareId) {
                return squareId < currentSquareId && squareId !== boardInfo.boardStart && squareId !== 0;
            });
        } else {
            nextPathIds = neighbors.filter(function (squareId) {
                return squareId < currentSquareId && squareId !== 0;
            });
        }

        nextPathIds = nextPathIds.filter(function (squareId) {
            return getBoardSquare(squareId);
        });
        if (nextPathIds.length === 0) {
            throw new Error("No valid movement path from board square " + currentSquareId);
        }
        return nextPathIds;
    }

    function getNextPathIds(player, forward) {
        return getNextPathIdsFrom(player.sprite.gameSquareId, forward);
    }

    function getPossibleMovementRoutes(firstPathIds, stepsRemaining) {
        var routes = [];

        function collectRoutes(squareId, stepsLeft, path) {
            if (stepsLeft === 0) {
                routes.push(path);
                return;
            }

            getNextPathIdsFrom(squareId, true).forEach(function (nextSquareId) {
                collectRoutes(nextSquareId, stepsLeft - 1, path.concat(nextSquareId));
            });
        }

        firstPathIds.forEach(function (squareId) {
            collectRoutes(squareId, stepsRemaining - 1, [squareId]);
        });
        return routes;
    }

    function movePlayer(player, roll, onFork, onComplete, onStartCrossed) {
        if (!player || !player.sprite) {
            throw new Error("Cannot move a player without a board sprite.");
        }
        if (!Number.isInteger(roll) || roll < 0) {
            throw new Error("Movement roll must be a non-negative integer.");
        }

        var crossedStart = false;

        function moveStep(stepsRemaining) {
            if (stepsRemaining === 0) {
                player.square = player.sprite.gameSquareId;
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            var pathIds = getNextPathIds(player, true);
            function animateTo(squareId, onStepComplete) {
                var validPathIds = getNextPathIds(player, true);
                if (validPathIds.indexOf(squareId) === -1) {
                    throw new Error("Selected movement path is not a valid adjacent square.");
                }

                var destination = getBoardSquare(squareId);
                if (!destination || !destination.sprite) {
                    throw new Error("Cannot move player to missing board square " + squareId);
                }

                if (player.sprite.gameSquareId === gameVariables.boardInfo.boardEnd &&
                    squareId === gameVariables.boardInfo.boardStart) {
                    crossedStart = true;
                    if (onStartCrossed) {
                        onStartCrossed(player);
                    }
                }

                player.sprite.scene.tweens.add({
                    targets: player.sprite,
                    x: destination.sprite.x,
                    y: destination.sprite.y,
                    duration: 400,
                    ease: "Linear",
                    onComplete: function () {
                        player.sprite.gameSquareId = squareId;
                        onStepComplete();
                    }
                });
            }

            function moveTo(squareId) {
                animateTo(squareId, function () {
                    moveStep(stepsRemaining - 1);
                });
            }

            function moveAlongRoute(routeIds, routeIndex) {
                if (routeIndex >= routeIds.length) {
                    moveStep(stepsRemaining - routeIds.length);
                    return;
                }

                animateTo(routeIds[routeIndex], function () {
                    moveAlongRoute(routeIds, routeIndex + 1);
                });
            }

            if (pathIds.length > 1 && player.human && onFork) {
                onFork(
                    pathIds.slice(),
                    moveTo,
                    getPossibleMovementRoutes(pathIds, stepsRemaining),
                    function (routeIds) {
                        if (!Array.isArray(routeIds) || routeIds.length !== stepsRemaining) {
                            throw new Error("Selected movement route must cover the remaining roll.");
                        }
                        moveAlongRoute(routeIds, 0);
                    }
                );
                return;
            }
            moveTo(choosePath(pathIds, player, stepsRemaining));
        }

        moveStep(roll);
    }

    function runBattleTestTurns(players, callbacks) {
        callbacks = callbacks || {};
        var playerIndex = 1;

        function runNextTurn() {
            if (callbacks.isBattleOver && callbacks.isBattleOver()) {
                return;
            }
            while (playerIndex < players.length && players[playerIndex].hp <= 0) {
                playerIndex++;
            }

            if (playerIndex >= players.length) {
                gameVariables.currentPlayer = 0;
                if (callbacks.onComplete) {
                    callbacks.onComplete();
                }
                return;
            }

            var index = playerIndex++;
            var player = players[index];
            gameVariables.currentPlayer = index;
            player.mana = player.maxmana;
            if (callbacks.onTurnBegin) {
                callbacks.onTurnBegin(player);
            }
            discardDeadCards(player, callbacks.onDiscardCard);
            while (player.hand.length < player.maxhand && player.deck.length > 0) {
                computerDrawCard(index);
                if (callbacks.onDrawCard) {
                    callbacks.onDrawCard(player);
                }
            }
            player.playerRollDice = true;
            var diceRoll = rollMovementDice();
            var roll = applyMovementPenalty(player, diceRoll.total);
            if (callbacks.onTurnStart) {
                callbacks.onTurnStart(player, roll, diceRoll.dice);
            }

            movePlayer(
                player,
                roll,
                null,
                function () {
                    if (callbacks.playCards) {
                        callbacks.playCards(player);
                    }
                    if (callbacks.onTurnComplete) {
                        callbacks.onTurnComplete(player);
                    }
                    window.setTimeout(runNextTurn, 500);
                },
                function (player) {
                    if (callbacks.onStartCrossed) {
                        callbacks.onStartCrossed(player);
                    }
                }
            );
        }

        runNextTurn();
    }

    return {
        chooseBattleTestCard: getBestCard,
        choosePath: choosePath,
        chooseSecondarySpellTargets: chooseSecondarySpellTargets,
        chooseSummonSquare: chooseSummonSquare,
        chooseStartReward: chooseStartReward,
        movePlayer: movePlayer,
        runBattleTestTurns: runBattleTestTurns
    };
})();
