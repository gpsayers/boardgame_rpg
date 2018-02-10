/**
 * Created by Garth on 2/3/2018.
 */


var gameProperties = {
    screenWidth: Math.min(( window.innerWidth * window.devicePixelRatio),1200),
    screenHeight: Math.min((window.innerHeight * window.devicePixelRatio),800)
};



var mainState = function (game) { };

mainState.prototype = {
    init: function () {
        //Making the screen work in different orientations on different devices
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //If the player clicks outside the game, it continues running - anti-cheating
        this.stage.disableVisibiltyChange = true;
    },
    preload: function () {
        game.load.script('models', 'Scripts/models.js');
        game.load.script('cards', 'Scripts/Scenes/cards.js');
        game.load.script('mainMenu', 'Scripts/mainmenu1.js');
        game.load.script('game', 'Scripts/game.js');
        game.load.script('credits', 'Scripts/Scenes/credits.js');
        

        game.load.script('board1', 'Scripts/Scenes/board1.js');

        //Load player images
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