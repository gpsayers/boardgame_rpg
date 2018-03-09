var new_character = function () { };

new_character.prototype = {
    menuConfig: {
        startY: 50,
        startX: game.camera.width / 2
    },

    init: function() {
        var titleText = game.add.text(this.menuConfig.startX, this.menuConfig.startY, "Create New Character", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        titleText.anchor.set(0.5);

        var choseNameTxt = game.add.text(titleText.x - (titleText.width/2), this.menuConfig.startY + 80, "Name:", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        //choseNameTxt.anchor.set(0.5);

        var input = game.add.inputField(choseNameTxt.x + choseNameTxt.width + 10, this.menuConfig.startY + 85, {
            font: '45px TheMinion',
            fontWeight: 'bold',
            backgroundColor: '#000',
            fill: '#FDFFB5'
        });

        var chooseClass = game.add.text(titleText.x - (titleText.width / 2), this.menuConfig.startY + 160, "Class:", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });

        border_layer = game.add.group();
        mybord1 = game.add.sprite(0, 0, 'wpix');
        mybord1.height = 54;
        mybord1.width = 54;
        border_layer.add(mybord1);
        mybord2 = game.add.sprite(2, 2, 'bpix');
        mybord2.height = 50;
        mybord2.width = 50;
        border_layer.add(mybord2);
        border_layer.visible = false;

        var class1 = game.add.sprite(titleText.x - (titleText.width / 2), 300, 'cavalier')
        var class2 = game.add.sprite(titleText.x - (titleText.width / 2) + 55, 300, 'wizard')
        var class3 = game.add.sprite(titleText.x - (titleText.width / 2) + 110, 300, 'sorceress')
        var class4 = game.add.sprite(titleText.x - (titleText.width / 2) + 165, 300, 'trickster')
        var class5 = game.add.sprite(titleText.x - (titleText.width / 2) + 220, 300, 'convoker')
        var class6 = game.add.sprite(titleText.x - (titleText.width / 2) + 275, 300, 'blademaster')

        class1.width = 50;
        class1.height = 50;
        class2.width = 50;
        class2.height = 50;
        class3.width = 50;
        class3.height = 50;
        class4.width = 50;
        class4.height = 50;
        class5.width = 50;
        class5.height = 50;
        class6.width = 50;
        class6.height = 50;
        class1.inputEnabled = true;
        class2.inputEnabled = true;
        class3.inputEnabled = true;
        class4.inputEnabled = true;
        class5.inputEnabled = true;
        class6.inputEnabled = true;

        var onOver = function (target) {
            var test = target.key.charAt(0).toUpperCase() + target.key.slice(1);
            border_layer.x = target.x - 2;
            border_layer.y = target.y - 2;
            border_layer.visible = true;
            chooseClass.setText('Class: ' + test);
        };

        var onOut = function (target) {
            border_layer.visible = false;
            chooseClass.setText('Class:');
        };

        var callback = function (target) {

        };

        class1.events.onInputUp.add(callback, this);
        class1.events.onInputOver.add(onOver, this);
        class1.events.onInputOut.add(onOut, this);
        class2.events.onInputUp.add(callback, this);
        class2.events.onInputOver.add(onOver, this);
        class2.events.onInputOut.add(onOut, this);
        class3.events.onInputUp.add(callback, this);
        class3.events.onInputOver.add(onOver, this);
        class3.events.onInputOut.add(onOut, this);
        class4.events.onInputUp.add(callback, this);
        class4.events.onInputOver.add(onOver, this);
        class4.events.onInputOut.add(onOut, this);
        class5.events.onInputUp.add(callback, this);
        class5.events.onInputOver.add(onOver, this);
        class5.events.onInputOut.add(onOut, this);
        class6.events.onInputUp.add(callback, this);
        class6.events.onInputOver.add(onOver, this);
        class6.events.onInputOut.add(onOut, this);

        var chooseSchool = game.add.text(titleText.x - (titleText.width / 2), this.menuConfig.startY + 320, "School of Magic:", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });

        var school1 = game.add.sprite(titleText.x - (titleText.width / 2), 460, 'Fire')
        var school2 = game.add.sprite(titleText.x - (titleText.width / 2) + 55, 460, 'Water')
        var school3 = game.add.sprite(titleText.x - (titleText.width / 2) + 110, 460, 'Life')
        var school4 = game.add.sprite(titleText.x - (titleText.width / 2) + 165, 460, 'Death')
        var school5 = game.add.sprite(titleText.x - (titleText.width / 2) + 220, 460, 'Earth')

        school1.width = 50;
        school1.height = 50;
        school2.width = 50;
        school2.height = 50;
        school3.width = 50;
        school3.height = 50;
        school4.width = 50;
        school4.height = 50;
        school5.width = 50;
        school5.height = 50;

        school1.inputEnabled = true;
        school2.inputEnabled = true;
        school3.inputEnabled = true;
        school4.inputEnabled = true;
        school5.inputEnabled = true;

        var onOverSchool = function (target) {
            border_layer.x = target.x - 2;
            border_layer.y = target.y - 2;
            border_layer.visible = true;
            chooseSchool.setText('School of Magic: ' + target.key);
        };

        var onOutSchool = function (target) {
            border_layer.visible = false;
            chooseSchool.setText('School of Magic:');
        };

        var callbackSchool = function (target) {

        };

        school1.events.onInputUp.add(callbackSchool, this);
        school1.events.onInputOver.add(onOverSchool, this);
        school1.events.onInputOut.add(onOutSchool, this);
        school2.events.onInputUp.add(callbackSchool, this);
        school2.events.onInputOver.add(onOverSchool, this);
        school2.events.onInputOut.add(onOutSchool, this);
        school3.events.onInputUp.add(callbackSchool, this);
        school3.events.onInputOver.add(onOverSchool, this);
        school3.events.onInputOut.add(onOutSchool, this);
        school4.events.onInputUp.add(callbackSchool, this);
        school4.events.onInputOver.add(onOverSchool, this);
        school4.events.onInputOut.add(onOutSchool, this);
        school5.events.onInputUp.add(callbackSchool, this);
        school5.events.onInputOver.add(onOverSchool, this);
        school5.events.onInputOut.add(onOutSchool, this);

        var ready = game.add.text(titleText.x - (titleText.width / 2), this.menuConfig.startY + 480, "Ready!", {
            font: 'bold 40pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });

        ready.inputEnabled = true;
        ready.events.onInputUp.add(function() {
            console.log(input.value);
        }, this);
    },

    create: function() {
        
    },

    update: function() {
        
    }
};