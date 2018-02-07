/**
 * Created by Garth on 2/3/2018.
 */
var gameProperties = {
    screenWidth: 800,
    screenHeight: 570
};

var gameVariables = {
    playerTurn: false,
    computerTurn: false,
    playerName: "Bastion",
    playerGold: 100,
    playerMana: 0,
    playerHand: [],
    playerDeck: [],
    playerImg: "wizard",
    currentBoard: "board1",
    playerColor: "Blue",
    playerClass: "Wizard"

}

var mainState = function (game) { };

mainState.prototype = {
    preload: function () {
        game.load.script('mainMenu', 'Scripts/mainmenu1.js');
        game.load.script('game', 'Scripts/game.js');
        game.load.script('credits', 'Scripts/Scenes/credits.js');
        game.load.script('cards', 'Scripts/Scenes/cards.js');

        game.load.script('board1', 'Scripts/Scenes/board1.js');

        game.load.image('cavalier', 'Assets/Players/cavalier.png');
        game.load.image('wizard', 'Assets/Players/wizard.png');
        game.load.image('sorceress', 'Assets/Players/sorceress.png');
        game.load.image('thief', 'Assets/Players/thief.png');
    },
    create: function () {
        game.state.add('mainMenu', mainMenu);
        game.state.add('game', gameMain);
        game.state.add('credits', credits);

        game.state.start('mainMenu');

    },
    update: function () {

    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);

game.state.start('main');