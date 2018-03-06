var new_character = function () { };

new_character.prototype = {
    menuConfig: {
        startY: 50,
        startX: game.camera.width / 2
    },

    init: function() {
        titleText = game.add.text(menuConfig.startX, menuConfig.startY, "Create New Character", {
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