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
    this.armor = armor;
    this.playerRollDice = false;
}

//location: sprite.gameSquareId

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.creature = null;
    this.special = {};
}

//location: creature.squareId

function gameSquareCreature(cardId, squareId, sprite, hitpoints, maxhitpoints, armor, attack, def, player) {
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
}

function card(id, name, desc, cost, rare, gold, creature, spell, attack, defense, damage, image, armor, threat, tarlocation, tartype, tarcount, special, school) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.rare = rare;
    this.gold = gold;
    this.creature = creature;
    this.spell = spell;
    this.attack = attack;
    this.defense = defense;
    this.damage = damage;
    this.image = image;
    this.armor = armor;
    this.threat = threat;
    this.targetlocation = tarlocation;
    this.targettype = tartype;
    this.targetcount = tarcount;
    this.special = special;
    this.school = school;
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
