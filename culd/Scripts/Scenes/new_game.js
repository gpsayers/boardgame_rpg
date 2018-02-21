var new_character = function () { };

new_character.prototype = {
    menuConfig: {
        startY: 100,
        startX: game.world.centerX
    },

    init: function() {
        this.titleText = game.add.text(game.world.centerX, 50, "Create New Character", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
    },

    create: function() {
        
    },

    update: function() {
        
    }
};