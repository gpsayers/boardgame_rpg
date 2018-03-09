var mainMenu = function () { };


mainMenu.prototype = {

    menuConfig: {
        startY: 100,
        startX: game.world.centerX
    },

    init: function () {
        this.titleText = game.add.text(game.world.centerX, 50, "Champions of the Source", {
            font: 'bold 60pt TheMinion',
            fill: '#FDFFB5',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
    },

    create: function () {

        this.addMenuOption('Start New', function () {
            this.newGame();

            //game.state.start("game");
            game.state.start("new");

        });

        //this.addMenuOption('Continue', function () {
        //    game.state.start("gameMain");

        //});

        this.addMenuOption('Credits', function () {
            game.state.start("credits");

        });


        this.addMenuOption('Test', function () {
            game.state.start('game');
        });


    },

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: '30pt TheMinion',
            fill: 'white',
            align: 'left',
            stroke: 'rgba(0,0,0,0)',
            strokeThickness: 4
        };

        var txt = game.add.text(this.menuConfig.startX, (this.optionCount * 80) + this.menuConfig.startY, text, optionStyle);

        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0)";
        txt.strokeThickness = 4;

        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
        };

        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };

        txt.inputEnabled = true;

        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;


    },

    newGame: function () {
        //localStorage.removeItem('gameVariables');
    }

};