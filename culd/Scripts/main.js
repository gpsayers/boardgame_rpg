﻿/**
 * Created by Garth on 2/3/2018.
 */


var gameProperties = {
    screenWidth: Math.min(( window.innerWidth * window.devicePixelRatio),1200),
    screenHeight: Math.min((window.innerHeight * window.devicePixelRatio),700)
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

        game.add.plugin(PhaserInput.Plugin);
        //game.add.plugin(Fabrique.Plugins.InputField);
    },
    preload: function () {
        game.load.script('models', 'Scripts/models.js');
        game.load.script('cards', 'Scripts/cards.js');
        game.load.script('mainMenu', 'Scripts/mainmenu1.js');
        game.load.script('game', 'Scripts/game.js');
        game.load.script('credits', 'Scripts/Scenes/credits.js');
        game.load.script('new', 'Scripts/Scenes/new_game.js');
        game.load.script('map', 'Scripts/Scenes/campaign_map.js');
        game.load.script('cardmanage', 'Scripts/Scenes/cardmanagement.js');
        game.load.script('cutscene', 'Scripts/Scenes/cutscene.js');
        game.load.script('maptext', 'Scripts/Scenes/maptext.js');
        game.load.script('shop', 'Scripts/Scenes/shop.js');
        
        //Load the boards
        game.load.script('board1', 'Scripts/Boards/board1.js');
        game.load.script('board2', 'Scripts/Boards/board2.js');
        game.load.image('bpix', 'Assets/GUI/blackPixel.png');
        game.load.image('wpix', 'Assets/GUI/whitePixel.png');

        //Load player images
        game.load.image('cavalier', 'Assets/Players/cavalier.png');
        game.load.image('wizard', 'Assets/Players/wizard.png');
        game.load.image('sorceress', 'Assets/Players/sorceress.png');
        game.load.image('trickster', 'Assets/Players/trickster.png');
        game.load.image('convoker', 'Assets/Players/convoker.png');
        game.load.image('blademaster', 'Assets/Players/blademaster.png');

        //board squares
        game.load.image('Fire', 'Assets/fire.png');
        game.load.image('Water', 'Assets/ice.png');
        game.load.image('neutral', 'Assets/summoning.png');
        game.load.image('Life', 'Assets/divination.png');
        game.load.image('Death', 'Assets/necromancy.png');
        game.load.image('Earth', 'Assets/poison.png');

        //load gui elements
        game.load.spritesheet('confirmButton', 'Assets/GUI/confirmButtonSpritesheet.png', 215, 229);
        game.load.spritesheet('cancelButton', 'Assets/GUI/cancelButtonSpritesheet.png', 215, 229);

    },
    create: function () {
        game.state.add('mainMenu', mainMenu);
        game.state.add('game', gameMain);
        game.state.add('credits', credits);
        game.state.add('new', new_character);
        game.state.add('map', campaign);
        game.state.add('maptext', maptext);
        game.state.add('cardmanager', cardmanager);
        game.state.add('cutscene', cutscene);
        game.state.add('shop', shop);

        game.state.start('mainMenu');

    },
    update: function () {

    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);

game.state.start('main');