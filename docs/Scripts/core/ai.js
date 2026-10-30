var computerAI = (function () {

    function getProfile(player) {
        return aiProfiles[player.aiProfile] || aiProfiles.opportunist;
    }

    function getBoardSquare(squareId) {
        return gameVariables.gameBoard.find(function (square) {
            return square.id === squareId;
        });
    }

    function isFriendlyCreature(creature, player) {
        return creature.playerOwnedId === player.id;
    }

    function getVictoryPriority(player, objective) {
        var priority = getProfile(player).victoryPriorities[objective];
        if (objective === "captureSquares" && gameVariables.boardInfo.captureRequirement) {
            var remaining = gameVariables.boardInfo.captureRequirement - player.capturedSquares;
            if (remaining <= 2) {
                priority += 5;
            }
        }
        return priority;
    }

    function isMaxManaDrain(card) {
        return card.special === SPECIAL_EFFECT.BOOST_MAX_MANA && card.damage < 0;
    }

    function getActionName(card) {
        if (card.creature) {
            return "summonCreatures";
        }
        if (isMaxManaDrain(card)) {
            return "damageOpponents";
        }
        if (card.special === SPECIAL_EFFECT.HEAL) {
            return "healSelf";
        }
        if (card.special === SPECIAL_EFFECT.STEAL_GOLD || card.special === SPECIAL_EFFECT.DRAW_CARDS ||
            card.special === SPECIAL_EFFECT.GAIN_GOLD || card.special === SPECIAL_EFFECT.BOOST_MANA ||
            card.special === SPECIAL_EFFECT.BOOST_MAX_MANA) {
            return "gainResources";
        }
        return "damageOpponents";
    }

    function getTargetValue(card, target, player) {
        var targetPlayer = target.type === "player" ? target.model : null;
        var targetCreature = target.type === "creature" ? target.model : null;
        var square = getBoardSquare(target.targetSquare);

        if (card.special === SPECIAL_EFFECT.MOVE_FORWARD) {
            return 0;
        }

        if (isMaxManaDrain(card)) {
            return targetPlayer && targetPlayer.id !== player.id
                ? Math.min(-card.damage, targetPlayer.maxmana)
                : 0;
        }

        if (card.special === SPECIAL_EFFECT.HEAL) {
            if (targetCreature) {
                if (!isFriendlyCreature(targetCreature, player)) {
                    return 0;
                }
                return Math.max(targetCreature.maxhitpoints - targetCreature.hitpoints, 0);
            }
            if (targetPlayer) {
                return targetPlayer.id === player.id
                    ? Math.max(targetPlayer.maxhp - targetPlayer.hp, 0)
                    : 0;
            }
        }

        if (card.special === SPECIAL_EFFECT.BUFF_CREATURE) {
            return targetCreature && isFriendlyCreature(targetCreature, player)
                ? card.defense + card.attack + card.armor
                : 0;
        }

        if (card.special === SPECIAL_EFFECT.DEBUFF_CREATURE || card.special === SPECIAL_EFFECT.SET_CREATURE_STATS) {
            if (!targetCreature || isFriendlyCreature(targetCreature, player)) {
                return 0;
            }
            var isSet = card.special === SPECIAL_EFFECT.SET_CREATURE_STATS;
            var hpLoss = isSet
                ? Math.max(targetCreature.maxhitpoints - Math.max(card.defense, 1), 0)
                : Math.min(card.defense, targetCreature.hitpoints);
            var attackLoss = isSet
                ? Math.max(targetCreature.attack - card.attack, 0)
                : Math.min(card.attack, targetCreature.attack);
            return hpLoss + attackLoss +
                Math.min(card.armor, targetCreature.armor) +
                ((card.flying && targetCreature.flying) ? 1 : 0) +
                ((card.blitz && targetCreature.blitz) ? 1 : 0) +
                ((card.deadly && targetCreature.deadly) ? 1 : 0);
        }

        if (card.special === SPECIAL_EFFECT.TRANSFORM) {
            var transformInto = masterCardList.find(function (item) {
                return item.id === card.secondSpell;
            });
            if (!targetCreature || !transformInto || !transformInto.creature) {
                return 0;
            }
            var currentStrength = targetCreature.hitpoints + targetCreature.attack + targetCreature.armor;
            var newStrength = transformInto.defense + transformInto.attack + transformInto.armor;
            return isFriendlyCreature(targetCreature, player)
                ? Math.max(newStrength - currentStrength, 0)
                : Math.max(currentStrength - newStrength, 0);
        }

        if (card.special === SPECIAL_EFFECT.UNSUMMON) {
            if (!targetCreature || isFriendlyCreature(targetCreature, player)) {
                return 0;
            }
            return targetCreature.hitpoints + targetCreature.attack + targetCreature.armor;
        }

        if (card.special === SPECIAL_EFFECT.TELEPORT) {
            if (targetCreature && isFriendlyCreature(targetCreature, player)) {
                return getTeleportDestinations("creature", targetCreature).length > 0
                    ? 1 + targetCreature.attack
                    : 0;
            }
            return targetPlayer && targetPlayer.id === player.id &&
                getTeleportDestinations("player", targetPlayer).length > 0 ? 1 : 0;
        }

        if (card.special === SPECIAL_EFFECT.SLOW_MOVEMENT) {
            return targetPlayer && targetPlayer.id !== player.id ? Math.max(0, card.damage) : 0;
        }

        if (card.special === SPECIAL_EFFECT.STEAL_GOLD) {
            return targetPlayer && targetPlayer.id !== player.id && targetPlayer.gold > 0
                ? Math.min(card.damage, targetPlayer.gold)
                : 0;
        }

        if (card.creature) {
            if (target.type === "ground" && square) {
                if (!square.creature) {
                    return 2 + (square.sprite.key === player.color ? 0 : getVictoryPriority(player, "captureSquares"));
                }
                if (isFriendlyCreature(square.creature, player)) {
                    return 0;
                }

                var defender = square.creature;
                var damageToDefender = Math.max(card.attack - defender.armor, 0);
                var damageToAttacker = Math.max(defender.attack - card.armor, 0);
                var defenderHp = defender.hitpoints - damageToDefender;
                var attackerHp = card.defense - damageToAttacker;
                return damageToDefender + (defenderHp <= 0 && attackerHp > 0 &&
                    square.sprite.key !== player.color
                    ? 2 + getVictoryPriority(player, "captureSquares")
                    : 0);
            }

            if (target.type === "both" && square) {
                var summonValue = square.creature
                    ? isFriendlyCreature(square.creature, player)
                        ? card.attack + card.defense / 2
                        : Math.max(card.attack - square.creature.armor, 0)
                    : 2 + (square.sprite.key === player.color ? 0 : getVictoryPriority(player, "captureSquares"));
                gameVariables.gamePlayerArray.forEach(function (occupant) {
                    if (occupant.sprite.gameSquareId === square.id && occupant.id !== player.id) {
                        summonValue += Math.max(card.damage - occupant.armor, 0);
                    }
                });
                return summonValue;
            }

            if (targetCreature) {
                if (isFriendlyCreature(targetCreature, player)) {
                    return 0;
                }
                return Math.max(card.attack - targetCreature.armor, 0);
            }

            if (targetPlayer) {
                return targetPlayer.id === player.id
                    ? 0
                    : Math.max(card.damage - targetPlayer.armor, 0);
            }
        }

        if (targetPlayer) {
            if (targetPlayer.id === player.id) {
                return card.targetlocation === "all" ? -Math.max(card.damage - player.armor, 0) : 0;
            }
            var playerDamage = Math.max(card.damage - targetPlayer.armor, 0);
            return playerDamage + (playerDamage >= targetPlayer.hp
                ? getVictoryPriority(player, "eliminateOpponents") / 2
                : 0);
        }

        if (targetCreature) {
            if (card.targetlocation === "all" && isFriendlyCreature(targetCreature, player)) {
                return -Math.max(card.damage - targetCreature.armor, 0);
            }
            var creatureDamage = Math.max(card.damage - targetCreature.armor, 0);
            return creatureDamage + (creatureDamage >= targetCreature.hitpoints
                ? getVictoryPriority(player, "eliminateOpponents") / 2
                : 0);
        }

        if (target.type === "both" && square) {
            var squareValue = 0;
            if (square.creature && !isFriendlyCreature(square.creature, player)) {
                squareValue += Math.max(card.damage - square.creature.armor, 0);
            }
            gameVariables.gamePlayerArray.forEach(function (occupant) {
                if (occupant.sprite.gameSquareId === square.id && occupant.id !== player.id) {
                    squareValue += Math.max(card.damage - occupant.armor, 0);
                }
            });
            return squareValue;
        }

        if (target.type === "ground" && square) {
            var groundValue = 0;
            if (square.creature) {
                groundValue += Math.max(card.damage - square.creature.armor, 0);
            }
            gameVariables.gamePlayerArray.forEach(function (occupant) {
                if (occupant.sprite.gameSquareId === square.id && occupant.id !== player.id) {
                    groundValue += Math.max(card.damage - occupant.armor, 0);
                }
            });
            return groundValue;
        }

        if (card.special === SPECIAL_EFFECT.DRAW_CARDS) {
            return card.damage;
        }
        if (card.special === SPECIAL_EFFECT.GAIN_GOLD) {
            return card.damage;
        }
        if (card.special === SPECIAL_EFFECT.BOOST_MANA) {
            return Math.min(card.damage, player.maxmana - player.mana);
        }
        if (card.special === SPECIAL_EFFECT.BOOST_MAX_MANA) {
            return card.damage;
        }

        return 0;
    }

    function scoreCard(card, player, targetProvider) {
        if (card.cost > player.mana || card.special === SPECIAL_EFFECT.MOVE_FORWARD ||
            card.special === SPECIAL_EFFECT.DUPLICATE_CARD) {
            return null;
        }

        if (!masterCardList.some(function (item) {
            return item.id === card.id;
        })) {
            return null;
        }

        var profile = getProfile(player);
        var action = getActionName(card);
        var candidates = targetProvider ? targetProvider(card, player) : [];
        if (candidates.length === 0) {
            return null;
        }

        var bestTargetIndex = 0;
        var utility = 0;
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

        if (card.special === SPECIAL_EFFECT.DRAW_CARDS) {
            utility = Math.min(card.damage, player.deck.length + player.discard.length + player.hand.length);
        } else if (card.special === SPECIAL_EFFECT.GAIN_GOLD ||
            (card.special === SPECIAL_EFFECT.BOOST_MAX_MANA && !isMaxManaDrain(card))) {
            utility = card.damage;
        } else if (card.special === SPECIAL_EFFECT.SUMMON) {
            var summonedCard = masterCardList.find(function (item) {
                return item.id === card.secondSpell;
            });
            utility = summonedCard && summonedCard.creature
                ? 1 + summonedCard.attack + summonedCard.defense / 2
                : 0;
        }
        if (utility <= 0) {
            return null;
        }

        if (card.creature) {
            utility += card.attack + card.defense / 2;
        }

        return {
            card: card,
            targetIndex: bestTargetIndex,
            targets: candidates,
            score: profile.priorities[action] * utility + card.threat - card.cost * 0.25
        };
    }

    // targetProvider lets a scene supply its own target list; omitted for the main board.
    function getBestCard(player, targetProvider) {
        return player.hand.reduce(function (best, card) {
            var candidate = scoreCard(card, player, targetProvider);
            return candidate && (!best || candidate.score > best.score) ? candidate : best;
        }, null);
    }

    function choosePath(pathIds, player) {
        player = player || gameVariables.gamePlayerArray[gameVariables.currentPlayer];
        if (!player) {
            throw new Error("Cannot choose a movement path without an active player.");
        }

        var profile = getProfile(player);
        var bestScore = -Infinity;
        var bestPaths = [];

        pathIds.forEach(function (squareId) {
            var square = getBoardSquare(squareId);
            if (!square) {
                return;
            }

            var score = 0;
            if (square.sprite.key !== player.color) {
                score += profile.priorities.captureSquares;
            }

            var special = gameVariables.boardInfo.specialSquares.find(function (item) {
                return item.squareId === squareId;
            });
            if (special && special.looted === 0) {
                if (special.type === "chest") {
                    score += profile.priorities.gainResources * 3;
                } else if (special.type === "pressure" || special.type === "magictrap") {
                    score -= profile.priorities.avoidHazards * special.result;
                } else if (special.type === "bluefountain") {
                    score += profile.priorities.healSelf * Math.max(player.maxhp - player.hp, 0);
                }
            }

            gameVariables.gamePlayerArray.forEach(function (opponent) {
                if (opponent.id !== player.id && opponent.sprite &&
                    opponent.sprite.gameSquareId === squareId) {
                    score += profile.priorities.damageOpponents;
                }
            });

            if (square.creature && !isFriendlyCreature(square.creature, player)) {
                score -= profile.priorities.avoidHazards * square.creature.attack;
            }

            if (score > bestScore) {
                bestScore = score;
                bestPaths = [squareId];
            } else if (score === bestScore) {
                bestPaths.push(squareId);
            }
        });

        if (bestPaths.length === 0) {
            return pathIds[Math.floor(Math.random() * pathIds.length)];
        }
        return bestPaths[Math.floor(Math.random() * bestPaths.length)];
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
                    grantStartMana(player);
                    if (onStartCrossed) {
                        onStartCrossed(player);
                    }
                }

                var tween = game.add.tween(player.sprite).to(
                    { x: destination.sprite.x, y: destination.sprite.y },
                    400,
                    Phaser.Easing.Linear.None,
                    true
                );
                tween.onComplete.add(function () {
                    player.sprite.gameSquareId = squareId;
                    onStepComplete();
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
            moveTo(choosePath(pathIds, player));
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
        movePlayer: movePlayer,
        runBattleTestTurns: runBattleTestTurns
    };
})();
