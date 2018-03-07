var new_character = function () { };

new_character.prototype = {
    menuConfig: {
        startY: 50,
        startX: game.camera.width / 2
    },

    init: function() {
        titleText = game.add.text(this.menuConfig.startX, this.menuConfig.startY, "Create New Character", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        titleText.anchor.set(0.5);

        choseNameTxt = game.add.text(this.menuConfig.startX, this.menuConfig.startY + 80, "Name:", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        titleText.anchor.set(0.5);

        var input = game.add.inputField(this.menuConfig.startX + 50, this.menuConfig.startY + 80);
    },

    create: function() {
        
    },

    update: function() {
        
    }
};