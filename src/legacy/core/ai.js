var computerAI = (function () {
    var turnState = null;

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

    function getActionName(card) {
        if (card.creature) {
            return "summonCreatures";
        }
        if (card.special === 3) {
            return "healSelf";
        }
        if (card.special === 1 || card.special === 5 || card.special === 6 ||
            card.special === 10 || card.special === 11) {
            return "gainResources";
        }
        return "damageOpponents";
    }

    function getTargetValue(card, target, player) {
        var targetPlayer = target.type === "player" ? target.model : null;
        var targetCreature = target.type === "creature" ? target.model : null;
        var square = getBoardSquare(target.targetSquare);

        if (card.special === 4) {
            return 0;
        }

        if (card.special === 3) {
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

        if (card.special === 8) {
            return targetCreature && isFriendlyCreature(targetCreature, player)
                ? card.defense + card.attack + card.armor
                : 0;
        }

        if (card.special === 1) {
            return targetPlayer && targetPlayer.id !== player.id && targetPlayer.gold >= card.damage
                ? card.damage
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

        if (card.special === 5) {
            return card.damage;
        }
        if (card.special === 6) {
            return card.damage;
        }
        if (card.special === 10) {
            return Math.min(card.damage, player.maxmana - player.mana);
        }
        if (card.special === 11) {
            return card.damage;
        }

        return 0;
    }

    function previewTargets(card, player) {
        if (card.creature && !card.spell) {
            return [{ targetSquare: player.sprite.gameSquareId, type: "ground" }];
        }

        var cardDetails = masterCardList.find(function (item) {
            return item.id === card.id;
        });
        var square = getBoardSquare(player.sprite.gameSquareId);
        if (!cardDetails || !square) {
            return [];
        }

        var oldTargeting = playerSpellTargeting;
        targetArray.length = 0;
        highlightTargets(cardDetails, square, player.sprite);
        var targets = targetArray.slice();
        targetArray.length = 0;
        playerSpellTargeting = oldTargeting;
        return targets;
    }

    function scoreCard(card, player) {
        if (card.cost > player.mana || card.special === 4) {
            return null;
        }

        if (!masterCardList.some(function (item) {
            return item.id === card.id;
        })) {
            return null;
        }

        var profile = getProfile(player);
        var action = getActionName(card);
        var candidates = previewTargets(card, player);
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

        if (card.special === 5) {
            utility = Math.min(card.damage, player.deck.length + player.discard.length + player.hand.length);
        } else if (card.special === 6 || card.special === 11) {
            utility = card.damage;
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
            score: profile.priorities[action] * utility + card.threat - card.cost * 0.25
        };
    }

    function getBestCard(player) {
        return player.hand.reduce(function (best, card) {
            var candidate = scoreCard(card, player);
            return candidate && (!best || candidate.score > best.score) ? candidate : best;
        }, null);
    }

    function getEntitiesAtSquare(squareId) {
        var entities = [];
        var square = getBoardSquare(squareId);
        if (square && square.creature) {
            entities.push({
                type: "creature",
                targetSquare: squareId,
                model: square.creature
            });
        }
        gameVariables.gamePlayerArray.forEach(function (player) {
            if (player.sprite && player.sprite.gameSquareId === squareId) {
                entities.push({
                    type: "player",
                    targetSquare: squareId,
                    model: player
                });
            }
        });
        return entities;
    }

    function applyTargetEffect(card, target, player) {
        var square = getBoardSquare(target.targetSquare);
        var model = target.model || player;

        if (card.special === 3 || card.special === 8 || card.special === 1) {
            processSpecialSpell(
                card,
                model,
                target.targetSquare,
                target.type,
                target.type === "player" ? model.class : model
            );
            return;
        }

        if (card.special === 5 || card.special === 6 ||
            card.special === 10 || card.special === 11) {
            processSpecialSpell(card, player, player.sprite.gameSquareId, "player", player.class);
            return;
        }

        if (target.type === "creature") {
            damageCreatureOnSquare(square, card, player.sprite);
        } else if (target.type === "player") {
            damagePlayerOnSquare(square, card, player.sprite, model.class, model);
        }
    }

    function resolveCardTargets(selection, targets, player) {
        var card = masterCardList.find(function (item) {
            return item.id === selection.card.id;
        });
        if (!card) {
            return;
        }

        if (card.special === 5 || card.special === 6 ||
            card.special === 10 || card.special === 11) {
            applyTargetEffect(card, {
                type: "player",
                targetSquare: player.sprite.gameSquareId,
                model: player
            }, player);
            return;
        }

        var selectedTargets = card.targetlocation === "all"
            ? targets
            : [targets[selection.targetIndex]];

        selectedTargets.forEach(function (target) {
            if (!target) {
                return;
            }

            if (target.type === "ground") {
                getEntitiesAtSquare(target.targetSquare).forEach(function (entity) {
                    applyTargetEffect(card, entity, player);
                });
                return;
            }

            if (target.type === "both") {
                var entities = getEntitiesAtSquare(target.targetSquare);
                var bestEntity = null;
                var bestValue = 0;
                entities.forEach(function (entity) {
                    var value = getTargetValue(card, entity, player);
                    if (value > bestValue) {
                        bestValue = value;
                        bestEntity = entity;
                    }
                });
                if (bestEntity) {
                    applyTargetEffect(card, bestEntity, player);
                }
                return;
            }

            applyTargetEffect(card, target, player);
        });

        if (card.creature) {
            var summonSquareId = selectedTargets[0] ? selectedTargets[0].targetSquare : player.sprite.gameSquareId;
            var summonSquare = getBoardSquare(summonSquareId);
            if (summonSquare) {
                playCreatureOnSquare(summonSquare, card, player.sprite);
            }
        }
    }

    function playCard(selection, player) {
        if (player.mana < selection.card.cost) {
            return false;
        }
        var handIndex = player.hand.indexOf(selection.card);
        if (handIndex < 0) {
            return false;
        }

        var targets = previewTargets(selection.card, player);
        if (targets.length === 0) {
            return false;
        }

        var card = player.hand.splice(handIndex, 1)[0];
        player.discard.push(card);
        player.mana -= card.cost;

        if (card.creature && !card.spell) {
            var square = getBoardSquare(player.sprite.gameSquareId);
            if (square) {
                playCreatureOnSquare(square, card, player.sprite);
            }
        } else {
            resolveCardTargets(selection, targets, player);
        }

        return true;
    }

    function playBestCard(player) {
        var selection = getBestCard(player);
        if (!selection) {
            return false;
        }

        return playCard(selection, player);
    }

    function chooseStartReward(player) {
        playerCrossStartMenu = false;
        if (player.hp <= 2) {
            player.hp = Math.min(player.hp + 2, player.maxhp);
        } else if (player.hand.length < 2) {
            computerDrawCard(gameVariables.currentPlayer);
            computerDrawCard(gameVariables.currentPlayer);
        } else if (player.maxmana < 5) {
            player.maxmana++;
        } else {
            player.gold += 100;
        }
    }

    function choosePath(pathIds) {
        var player = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
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

    function update() {
        var playerIndex = gameVariables.currentPlayer;
        var player = gameVariables.gamePlayerArray[playerIndex];
        if (!player || player.human) {
            turnState = null;
            return;
        }

        if (!turnState || turnState.player !== player || turnState.phase === "done") {
            turnState = { player: player, phase: "turnStart" };
        }

        switch (turnState.phase) {
            case "turnStart":
                turnState.phase = "refreshResources";
                break;
            case "refreshResources":
                player.playerRollDice = false;
                player.mana = player.maxmana;
                turnState.phase = "drawCard";
                break;
            case "drawCard":
                computerDrawCard(playerIndex);
                turnState.phase = "playBeforeMove";
                break;
            case "playBeforeMove":
                if (!playBestCard(player)) {
                    turnState.phase = "rollAndMove";
                } else {
                    turnState.cardsPlayed = (turnState.cardsPlayed || 0) + 1;
                    if (turnState.cardsPlayed >= 8) {
                        turnState.phase = "rollAndMove";
                    }
                }
                break;
            case "rollAndMove":
                var roll = 1 + Math.floor(Math.random() * 6);
                player.playerRollDice = true;
                computerMoving = true;
                cursor1.visible = false;
                cursor2.visible = false;
                playerDestinations.length = 0;
                calculateDestinations(player.sprite.gameSquareId, roll);
                playerDestinations.length = 0;
                playerMove(player.sprite, roll);
                turnState.phase = "waitForMove";
                break;
            case "waitForMove":
                if (!computerMoving) {
                    turnState.phase = "resolveSquare";
                }
                break;
            case "resolveSquare":
                if (playerCrossStartMenu) {
                    chooseStartReward(player);
                }
                resolveCurrentPlayerSquareEffects();
                turnState.cardsPlayed = 0;
                turnState.phase = "playAfterMove";
                break;
            case "playAfterMove":
                if (!playBestCard(player)) {
                    turnState.phase = "endTurnEffects";
                } else {
                    turnState.cardsPlayed = (turnState.cardsPlayed || 0) + 1;
                    if (turnState.cardsPlayed >= 8) {
                        turnState.phase = "endTurnEffects";
                    }
                }
                break;
            case "endTurnEffects":
                resolveCurrentPlayerEndTurnEffects();
                turnState.phase = "endTurn";
                break;
            case "endTurn":
                turnState.phase = "done";
                advanceToNextPlayer();
                break;
        }
    }

    return {
        update: update,
        choosePath: choosePath
    };
})();
