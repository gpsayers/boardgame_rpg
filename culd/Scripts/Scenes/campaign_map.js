var campaign = function () { };

campaign.prototype = {


    init: function () {


    },

    preload: function () {
        //Create layers for sprite z levels
        back_layer = game.add.group();
        name_layer = game.add.group();

        //background image
        game.load.image('cmap', 'Assets/campaignmap.png');


    },

    create: function () {
        //Build the background
        //var tile = game.add.tileSprite(0, 0, game.width, game.height, 'cmap');

        var map = game.add.sprite(0, 0, 'cmap');
        map.height = game.height;
        map.width = game.width;

        back_layer.add(map);
    },

    update: function () {

    }
};