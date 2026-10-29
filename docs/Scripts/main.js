/**
 * Created by Garth on 2/3/2018.
 */


var gameProperties = {
    screenWidth: Math.min(( window.innerWidth * window.devicePixelRatio),1200),
    screenHeight: Math.min((window.innerHeight * window.devicePixelRatio),700)
};



var mainState = function (game) { };

mainState.prototype = {
    init: function () {
    },
    preload: function () {
        game.load.image('bpix', 'assets/gui/blackPixel.png');
        game.load.image('wpix', 'assets/gui/whitePixel.png');

        //Load player images
        game.load.image('cavalier', 'assets/players/cavalier.png');
        game.load.image('wizard', 'assets/players/wizard.png');
        game.load.image('sorceress', 'assets/players/sorceress.png');
        game.load.image('trickster', 'assets/players/trickster.png');
        game.load.image('dwarf', 'assets/players/dwarf_new.png');
        game.load.image('vampire', 'assets/players/vampire_old.png');
        game.load.image('convoker', 'assets/players/convoker.png');
        game.load.image('blademaster', 'assets/players/blademaster.png');

        //board squares
        game.load.image('Fire', 'assets/fire.png');
        game.load.image('Water', 'assets/ice.png');
        game.load.image('neutral', 'assets/summoning.png');
        game.load.image('Life', 'assets/divination.png');
        game.load.image('Death', 'assets/necromancy.png');
        game.load.image('Earth', 'assets/poison.png');
        game.load.image('red', 'assets/fire.png');
        game.load.image('blue', 'assets/ice.png');
        game.load.image('white', 'assets/divination.png');
        game.load.image('yellow', 'assets/divination.png');
        game.load.image('black', 'assets/necromancy.png');
        game.load.image('purple', 'assets/necromancy.png');
        game.load.image('green', 'assets/poison.png');

        //load gui elements
        game.load.spritesheet('confirmButton', 'assets/gui/confirmButtonSpritesheet.png', 215, 229);
        game.load.spritesheet('cancelButton', 'assets/gui/cancelButtonSpritesheet.png', 215, 229);

    },
    create: function () {
        game.state.add('mainMenu', mainMenu);
        game.state.add('game', gameMain);
        game.state.add('battle', battle);
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

var game = Phaser2Compat.create({
    width: gameProperties.screenWidth,
    height: gameProperties.screenHeight,
    parent: 'gameDiv'
});