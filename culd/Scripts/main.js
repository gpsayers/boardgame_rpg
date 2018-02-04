/**
 * Created by Garth on 2/3/2018.
 */
var gameProperties = {
    screenWidth: 640,
    screenHeight: 470
};

var mainState = function (game) { };

mainState.prototype = {
    preload: function () {
        game.load.script('mainMenu', 'Scripts/mainmenu.js');
        game.load.script('game', 'Scripts/game.js');
        game.load.script('credits', 'Scripts/Scenes/credits.js');

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