/**
 * Created by Garth on 2/3/2018.
 */


var gameProperties = {
    screenWidth: Math.min(( window.innerWidth * window.devicePixelRatio),1200),
    screenHeight: Math.min((window.innerHeight * window.devicePixelRatio),700)
};


// Loads the textures shared by every screen, then opens the main menu.
var bootScene = defineScene("boot", {
    preload: function () {
        this.load.setPath(gameAssetUrl("assets/"));

        //board squares
        this.load.image('Fire', 'fire.png');
        this.load.image('Water', 'ice.png');
        this.load.image('neutral', 'summoning.png');
        this.load.image('Life', 'divination.png');
        this.load.image('Death', 'necromancy.png');
        this.load.image('Earth', 'poison.png');
        this.load.image('red', 'fire.png');
        this.load.image('blue', 'ice.png');
        this.load.image('white', 'divination.png');
        this.load.image('yellow', 'divination.png');
        this.load.image('black', 'necromancy.png');
        this.load.image('purple', 'necromancy.png');
        this.load.image('green', 'poison.png');
    },
    create: function () {
        this.scene.start('mainMenu');
    }
});

var phaserGame = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'gameDiv',
    width: gameProperties.screenWidth,
    height: gameProperties.screenHeight,
    backgroundColor: "#000000",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [bootScene, mainMenu, battle, credits, new_character, maptext, cardmanager, cutscene, shop]
});
