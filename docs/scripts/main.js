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
        this.load.image('Fire', 'board-elements/school-squares/fire.png');
        this.load.image('Water', 'board-elements/school-squares/ice.png');
        this.load.image('neutral', 'board-elements/school-squares/summoning.png');
        this.load.image('Life', 'board-elements/school-squares/life.png');
        this.load.image('Death', 'board-elements/school-squares/death.png');
        this.load.image('Earth', 'board-elements/school-squares/earth.png');
        this.load.image('red', 'board-elements/school-squares/fire.png');
        this.load.image('blue', 'board-elements/school-squares/ice.png');
        this.load.image('white', 'board-elements/school-squares/life.png');
        this.load.image('yellow', 'board-elements/school-squares/life.png');
        this.load.image('black', 'board-elements/school-squares/death.png');
        this.load.image('purple', 'board-elements/school-squares/death.png');
        this.load.image('green', 'board-elements/school-squares/earth.png');
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
    scene: [bootScene, mainMenu, battleload, battle, credits, new_character, maptext, cardmanager, cutscene, shop]
});
