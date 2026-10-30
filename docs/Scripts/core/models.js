// Card "special" ability ids as stored in the card data.
var SPECIAL_EFFECT = Object.freeze({
    NONE: 0,
    STEAL_GOLD: 1,
    SLOW_MOVEMENT: 2,
    HEAL: 3,
    MOVE_FORWARD: 4,
    DRAW_CARDS: 5,
    GAIN_GOLD: 6,
    MOVE_BACK: 7,
    BUFF_CREATURE: 8,
    SELF_DAMAGE: 9,
    BOOST_MANA: 10,
    BOOST_MAX_MANA: 11,
    CAST_SPELL: 12,
    DEBUFF_CREATURE: 13,
    UNSUMMON: 14,
    TELEPORT: 15,
    SUMMON: 16,
    SET_CREATURE_STATS: 17,
    TRANSFORM: 18,
    DUPLICATE_CARD: 19
});

var SPECIAL_EFFECT_NAMES = Object.freeze((function () {
    var names = {};
    names[SPECIAL_EFFECT.STEAL_GOLD] = "Steals gold";
    names[SPECIAL_EFFECT.SLOW_MOVEMENT] = "Slows movement";
    names[SPECIAL_EFFECT.HEAL] = "Heals";
    names[SPECIAL_EFFECT.MOVE_FORWARD] = "Moves forward";
    names[SPECIAL_EFFECT.DRAW_CARDS] = "Draws cards";
    names[SPECIAL_EFFECT.GAIN_GOLD] = "Grants gold";
    names[SPECIAL_EFFECT.MOVE_BACK] = "Moves back";
    names[SPECIAL_EFFECT.BUFF_CREATURE] = "Buffs creature";
    names[SPECIAL_EFFECT.SELF_DAMAGE] = "Self damage";
    names[SPECIAL_EFFECT.BOOST_MANA] = "Boosts mana";
    names[SPECIAL_EFFECT.BOOST_MAX_MANA] = "Boosts max mana";
    names[SPECIAL_EFFECT.CAST_SPELL] = "Casts a spell";
    names[SPECIAL_EFFECT.DEBUFF_CREATURE] = "Debuffs creature";
    names[SPECIAL_EFFECT.UNSUMMON] = "Returns creature to hand";
    names[SPECIAL_EFFECT.TELEPORT] = "Teleports";
    names[SPECIAL_EFFECT.SUMMON] = "Summons a creature";
    names[SPECIAL_EFFECT.SET_CREATURE_STATS] = "Set creature stat";
    names[SPECIAL_EFFECT.TRANSFORM] = "Transforms creature";
    names[SPECIAL_EFFECT.DUPLICATE_CARD] = "Duplicates a card";
    return names;
})());

var gameVariables = {
    playerTurnArray: [],
    playerName: "",
    playerGold: 0,
    playerStartingMana: 1,
    playerHealth: 0,
    playerMaxHealth: 0,
    playerArmor: 0,
    playerInitiative: 3,
    playerMaxHand: 4,
    playerDeck: [],
    playerCardPool: [],
    playerEquipment: [],
    playerImg: "",
    currentBoard: "",
    playerColor: "",
    playerClass: "",
    gamePlayerArray: [],
    gameTurnOrder: [],
    gameBoard: [],
    boardInfo: {},
    currentPlayer: 0,
    turnCount: 0,
    gameContinue: false

}

function gamePlayer(id, square, name, playerClass, playerColor, hp, mana, human, deck, maxhand, gold, armor) {
    this.id = id;
    this.square = square;
    this.name = name;
    this.class = playerClass;
    this.color = playerColor;
    this.hp = hp;
    this.maxhp = hp;
    this.mana = mana;
    this.maxmana = mana;
    this.human = human;
    this.deck = deck;
    this.hand = [];
    this.discard = [];
    this.handTracker = [];
    this.sprite = {};
    this.turnSprite = {};
    this.maxhand = maxhand;
    this.capturedSquares = 0;
    this.manasprite = {};
    this.gold = gold;
    this.battleGold = 0;
    this.armor = armor;
    this.movementPenalty = 0;
    this.playerRollDice = false;
    this.aiProfile = null;
}

//location: sprite.gameSquareId

// Movement is rolled with two six-sided dice. Change MOVEMENT_DICE_COUNT to try other dice pools.
var MOVEMENT_DICE_COUNT = 2;

function rollMovementDice() {
    var dice = [];
    for (var i = 0; i < MOVEMENT_DICE_COUNT; i++) {
        dice.push(1 + Math.floor(Math.random() * 6));
    }
    return {
        dice: dice,
        total: dice.reduce(function (sum, die) { return sum + die; }, 0)
    };
}

function describeDiceRoll(dice) {
    return dice.length > 1 ? dice.join(" + ") + " = " + dice.reduce(function (sum, die) { return sum + die; }, 0)
        : String(dice[0]);
}

// Portrait image for a player class, in assets/players. Most classes use <class>.png.
var PLAYER_PORTRAIT_FILES = {
    dwarf: "dwarf_new.png",
    vampire: "vampire_old.png"
};

function playerPortraitFile(playerClass) {
    return PLAYER_PORTRAIT_FILES[playerClass] || playerClass + ".png";
}

function applyMovementPenalty(player, roll) {
    var penalty = Math.max(0, player.movementPenalty || 0);
    player.movementPenalty = 0;
    return Math.max(0, roll - penalty);
}

// A temporary card is a per-instance copy that lives only in a hand.
function createTemporaryCard(masterCard) {
    var copy = Object.assign({}, masterCard);
    copy.temporary = true;
    return copy;
}

// Sends a played/discarded card to the discard pile; temporary cards are destroyed instead.
function discardCard(player, card) {
    if (!card || card.temporary) {
        return false;
    }
    player.discard = player.discard || [];
    player.discard.push(card);
    return true;
}

// Gold from special 6 is held as battle gold: it only joins the player's total if they win.
// Stolen gold (special 1) moves real gold and always persists.
function grantBattleGold(player, amount) {
    amount = Math.max(0, amount || 0);
    player.battleGold = (player.battleGold || 0) + amount;
    return amount;
}

function forfeitBattleGold(player) {
    var forfeited = player.battleGold || 0;
    player.battleGold = 0;
    return forfeited;
}

function awardBattleGold(player) {
    var awarded = player.battleGold || 0;
    player.gold += awarded;
    player.battleGold = 0;
    return awarded;
}

// Decides whether the battle is over: the human is eliminated, a living player has captured enough
// squares, or only one player is left standing. Returns null while the battle continues.
function getBattleOutcome(players, captureRequirement) {
    var humanPlayer = players.find(function (player) {
        return player.human;
    });
    if (!humanPlayer || humanPlayer.hp <= 0) {
        return { humanWon: false, message: "You have been eliminated." };
    }

    if (captureRequirement > 0) {
        var captureWinner = players.find(function (player) {
            return player.hp > 0 && player.capturedSquares >= captureRequirement;
        });
        if (captureWinner) {
            return {
                humanWon: captureWinner === humanPlayer,
                message: captureWinner.name + " captured enough squares to win."
            };
        }
    }

    var livingPlayers = players.filter(function (player) {
        return player.hp > 0;
    });
    if (livingPlayers.length === 1) {
        return {
            humanWon: livingPlayers[0] === humanPlayer,
            message: livingPlayers[0].name + " is the last player standing."
        };
    }

    return null;
}

// Damage a striker deals to a target in creature combat. Only Flying or Reach creatures can hurt a Flying creature.
function combatDamage(striker, target) {
    if (target.flying && !(striker.flying || striker.reach)) {
        return 0;
    }
    return Math.max(striker.attack - target.armor, 0);
}

// One simultaneous combat round between { attack, armor, hitpoints, flying, reach, blitz } fighters.
// On the first round a lone Blitz creature strikes first, and a defender it kills deals no damage back.
function resolveCombatRound(attacker, defender, firstRound) {
    var toDefender = combatDamage(attacker, defender);
    var toAttacker = combatDamage(defender, attacker);
    if (firstRound && attacker.blitz && !defender.blitz) {
        if (defender.hitpoints - toDefender <= 0) {
            toAttacker = 0;
        }
    } else if (firstRound && defender.blitz && !attacker.blitz) {
        if (attacker.hitpoints - toAttacker <= 0) {
            toDefender = 0;
        }
    }
    return { toDefender: toDefender, toAttacker: toAttacker };
}

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.creature = null;
    this.special = {};
}

//location: creature.squareId

function gameSquareCreature(cardId, squareId, sprite, hitpoints, maxhitpoints, armor, attack, def, player,
    flying, blitz, deadly, reach, regen) {
    this.cardId = cardId;
    this.squareId = squareId;
    this.sprite = sprite;
    this.maxhitpoints = maxhitpoints;
    this.hitpoints = hitpoints;
    this.armor = armor;
    this.attack = attack;
    this.def = def;
    this.hitspritegreen = {};
    this.hitspritered = {};
    this.playerOwnedId = player;
    this.flying = flying || 0;
    this.blitz = blitz || 0;
    this.deadly = deadly || 0;
    this.reach = reach || 0;
    this.regen = regen || 0;
}

// Heals a creature by its regen amount, capped at max hitpoints. Returns the amount healed.
function applyCreatureRegen(creature) {
    if (!creature || !creature.regen || creature.hitpoints <= 0) {
        return 0;
    }
    var healed = Math.min(creature.regen, creature.maxhitpoints - creature.hitpoints);
    creature.hitpoints += Math.max(healed, 0);
    return Math.max(healed, 0);
}

function grantStartMana(player) {
    player.maxmana++;
    player.mana++;
}

function card(fields) {
    this.id = fields.id;
    this.name = fields.name;
    this.desc = fields.description;
    this.description = fields.description;
    this.mana = fields.mana;
    this.cost = fields.mana;
    this.rare = fields.rarity;
    this.rarity = fields.rarity;
    this.gold = fields.gold;
    this.creature = fields.creature;
    this.spell = fields.spell;
    this.attack = fields.attack;
    this.defense = fields.defense;
    this.damage = fields.damage;
    this.image = fields.image;
    this.threat = fields.threat;
    this.targetlocation = fields.targetLocation;
    this.targetLocation = fields.targetLocation;
    this.targettype = fields.targetType;
    this.targetType = fields.targetType;
    this.targetcount = fields.targetCount;
    this.targetCount = fields.targetCount;
    this.special = fields.special;
    this.classOrColor = fields.classOrColor;
    this.school = fields.classOrColor;
    this.armor = fields.armor;
    this.flying = fields.flying;
    this.blitz = fields.blitz;
    this.deadly = fields.deadly;
    this.reach = fields.reach || 0;
    this.regen = fields.regen || 0;
    this.secondSpell = fields.secondSpell;
    this.additionalDescription = fields.additionalDescription;
    this.specialDesc = fields.additionalDescription;
}

//Target locations: Entire board (all), adjacent (adj), current square (square), row (row), self (self), any (any)
//Target types "creature", "player", "both", "ground"
//Target count (1-"all")
//Special
//1.Steal gold from player
//2.Slow movement
//3.Heal
//4.Move Forward
//5.Draw
//6.Gain Gold
//7.Move Back
//8.Buff creature
//9.Self damage
//10.Boost mana
//11.Boost maximum mana
//12.Cast second spell
//13.Debuff creature: subtracts attack/defense/armor, removes listed abilities; dies at 0 HP
//19.Duplicate card: the human player picks a card in hand; a temporary copy joins the hand (none if the hand is full). Self target only; AI never plays it
//17.Set creature stat: sets attack and defense (max HP) to the card values, including 0 (max HP minimum 1); never raises them or kills
//18.Transform: replaces a creature with the creature card in SecondSpell (fresh stats and full HP, same owner and square); unsummoning it returns a temporary copy of the new card
//14.Unsummon: remove a creature from the board and give its owner a temporary copy of the card
//15.Teleport: move a creature or player to a chosen square (creatures fight/capture on arrival)
//16.Summon: summons the creature card in SecondSpell on a chosen square; no mana, never enters hand/deck/discard
//6.Gain gold: adds battle gold, which joins total gold only if the player wins the battle

function playerHandTracker(id, cardInfo, positionx, positiony) {
    this.id = id;
    this.cardInfo = cardInfo;
    this.positionx = positionx;
    this.positiony = positiony;
    this.spritefront = {};
    this.spriteborder = {};
    this.spriteimage = {};
    this.spriteInfoButton = {};
    this.group = {};
    this.text1 = {};
    this.text2 = {};
    this.text3 = {};
    this.armor = {};
    this.armortext = {};
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function compareHandThreat(a, b) {
    if (a.threat < b.threat)
        return -1;
    if (a.threat > b.threat)
        return 1;
    return 0;
}

function compareHandCost(a, b) {
    if (a.cost < b.cost)
        return -1;
    if (a.cost > b.cost)
        return 1;
    return 0;
}
