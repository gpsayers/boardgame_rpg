﻿var credits = function () { };

credits.prototype = {
    create: function () {

        var optionStyle = {
            font: '20pt TheMinion',
            fill: 'white',
            align: 'left',
            stroke: 'rgba(0,0,0,0)',
            strokeThickness: 4,
        };

        var txt = game.add.text(game.camera.width / 2, game.camera.height / 2, "Created by The Amazing Parrot and his friend Pickles", optionStyle);

        //Need to add art sources:
        //https://opengameart.org/content/dungeon-crawl-32x32-tiles-supplemental
        //

        txt.anchor.setTo(0.5);

    },

    update: function () {
        if (game.input.activePointer.isDown) {
            game.state.start('mainMenu');
        }
    }

};