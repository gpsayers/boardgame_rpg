﻿var gameVariables = {
    playerTurn: false,
    computerTurn: false,
    playerTurnArray: [],
    playerName: "Merlin",
    playerGold: 100,
    playerMana: 3,
    playerHealth: 10,
    playerArmor: 0,
    playerInitiative: 3,
    playerMaxHand: 4,
    playerDeck: [],
    playerCardPool: [],
    playerEquipment: [],
    playerImg: "wizard",
    currentBoard: "board1",
    playerColor: "blue",
    playerClass: "wizard",
    gamePlayerArray: [],
    gameTurnOrder: [],
    gameBoard: [],
    boardInfo: {},

}

function gamePlayer(id, square, name, playerClass, playerColor, hp, mana, human, deck) {
    this.id = id;
    this.square = square;
    this.name = name;
    this.class = playerClass;
    this.color = playerColor;
    this.hp = hp;
    this.mana = mana;
    this.human = human;
    this.deck = deck;
    this.hand = [];
    this.discard = [];
    this.handTracker = [];
    this.sprite = {};
}

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

function gameSquareCreature(cardId, squareId, sprite, hitpoints, armor, attack, def) {
    this.cardId = cardId;
    this.squareId = squareId;
    this.sprite = sprite;
    this.hitpoints = hitpoints;
    this.armor = armor;
    this.attack = attack;
    this.def = def;
    this.hitsprite = {};
}


function playerHandTracker(id, cardInfo, positionx, positiony) {
    this.id = id;
    this.cardInfo = cardInfo;
    this.positionx = positionx;
    this.positiony = positiony;
    this.spritefront = {};
    this.spriteborder = {};
    this.spriteimage = {};
    this.spriteInfoButton = {};
    this.text1 = {};
    this.text2 = {};
    this.text3 = {};
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