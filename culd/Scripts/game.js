﻿var gameMain = function () { };


var playerDestinations = [],
    playerDirChoiceMenu = false,
    playerChoiceMenu = false,
    playerRoll = 0,
    activePlayerSquare = 0,
    addCardHand = false,
    playerNotificationMenu = false,
    playerNotified = false,
    playerCardDrawn = false,
    computerMoved = false,
    computerMoving = false,
    computerActing = false,
    playerCrossStart = false,
    playerCrossStartMenu = false,
    playerDiscardMenu = false,
    playerDiscardWaiting = false,
    playerManaNotificationMenu = false,
    playerSpellTargeting = false,
    multipleTargetsMenu = false,
    forwardMovement = true,
    playerTurnMaintenanceComplete = false,
    capturedLootRewardNotice = false,
    capturedLootRewardNoticeText = "",
    targetArray = [],
    multipleTargetsArray = [];


gameMain.prototype = {
    preload: function () {

        if (gameVariables.gameContinue == false) {

            //Start a new game
            gameVariables.turnCount = 0;

            if (gameVariables.currentBoard == "board1") {
                gameVariables.boardInfo = board1;
            }
            else if (gameVariables.currentBoard == "board2") {
                gameVariables.boardInfo = board2;
            }

            gameVariables.gamePlayerArray.length = 0;

            gameVariables.gamePlayerArray.push(new gamePlayer(99,
                gameVariables.boardInfo.boardStart,
                gameVariables.playerName,
                gameVariables.playerClass,
                gameVariables.playerColor,
                gameVariables.playerHealth,
                gameVariables.playerStartingMana,
                true,
                shuffle(gameVariables.playerDeck),
                gameVariables.playerMaxHand,
                gameVariables.playerGold,
                gameVariables.playerArmor));

            gameVariables.currentPlayer = 0;

            //Find AI players that don't match human players class or color
            var aiPlayers = gameVariables.boardInfo.computerPlayers.filter(function(gp) {
                return gp.class != gameVariables.playerClass && gp.color != gameVariables.playerColor;
            });

            aiPlayers.forEach(function(item) {
                gameVariables.gamePlayerArray.push(item);
            });

        }
        else {
            //Continue game
            //Game player array should already be set.
        }
       

        //background image
        game.load.image('dirt', 'Assets/dirt4.png');

        //board elements
        game.load.image('chest', 'Assets/BoardElements/chest_2_closed.png');
        game.load.image('chestopen', 'Assets/BoardElements/chest_2_open.png');
        game.load.image('bluefountain', 'Assets/BoardElements/blue_fountain.png');
        game.load.image('redfountain', 'Assets/BoardElements/blood_fountain.png');
        game.load.image('dryfountain', 'Assets/BoardElements/dry_fountain.png');
        game.load.image('cardpicker', 'Assets/BoardElements/nemelex_1.png');
        game.load.image('trap', 'Assets/BoardElements/trap_blade.png');
        game.load.image('magictrap', 'Assets/BoardElements/trap_magical.png');
        game.load.image('pressure', 'Assets/BoardElements/pressure_plate.png');
        game.load.image('gpix', 'Assets/GUI/greenPixel.png');
        game.load.image('rpix', 'Assets/GUI/redPixel.png');
        game.load.image('start', 'Assets/BoardElements/stone_stairs_up.png');

        //dice images
        game.load.image('1', 'Assets/front&side-1.png');
        game.load.image('2', 'Assets/front-2.png');
        game.load.image('3', 'Assets/front-3.png');
        game.load.image('4', 'Assets/front&side-4.png');
        game.load.image('5', 'Assets/front-5.png');
        game.load.image('6', 'Assets/front-6.png');

        //cards
        game.load.image('redFrame', 'Assets/RedFrame.png');
        game.load.image('cardFront', 'Assets/FrontTexture.png');

        //spells
        game.load.image('zombie', 'Assets/Cards/zombie_ogre.png');
        game.load.image('bolt', 'Assets/Cards/bolt_of_fire_new.png');
        game.load.image('summon', 'Assets/Cards/summon_ugly_thing.png');
        game.load.image('centaur', 'Assets/Cards/centaur.png');
        game.load.image('rat', 'Assets/Cards/rat.png');
        game.load.image('turtle', 'Assets/Cards/turtle.png');
        game.load.image('bear', 'Assets/Cards/bear.png');
        game.load.image('spider', 'Assets/Cards/spider.png');
        game.load.image('yellow_wasp', 'Assets/Cards/yellow_wasp.png');
        game.load.image('death', 'Assets/Cards/symbol_of_torment.png');
        game.load.image('heal', 'Assets/Cards/regeneration_new.png');
        game.load.image('disengage', 'Assets/Cards/ledas_liquefaction.png');
        game.load.image('blizzard', 'Assets/Cards/ice_storm_new.png');
        game.load.image('steal', 'Assets/Cards/apportation_new.png');
        game.load.image('mushroom', 'Assets/Cards/wandering_mushroom_new.png');
        game.load.image('dummy', 'Assets/Cards/training_dummy_new.png');
        game.load.image('research', 'Assets/Cards/magic_mapping.png');
        game.load.image('poison', 'Assets/Cards/poison_arrow_6.png');
        game.load.image('defense', 'Assets/Cards/condensation_shield_new.png');


        //GUI and buttons
        game.load.image('menu', 'Assets/GUI/Menu.png');
        game.load.image('menu2', 'Assets/GUI/Menu_2.png');
        game.load.image('cursor', 'Assets/GUI/cursor.png');
        game.load.image('target', 'Assets/GUI/silenced.png');
        game.load.spritesheet('diceButton', 'Assets/GUI/diceButtonsSpritesheet.png', 410, 183);
        game.load.spritesheet('endButton', 'Assets/GUI/endturnButtonSpritesheet.png', 400, 173);
        game.load.spritesheet('leftButton', 'Assets/GUI/leftButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('upButton', 'Assets/GUI/upButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('rightButton', 'Assets/GUI/rightButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('downButton', 'Assets/GUI/downButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('settingsButton', 'Assets/GUI/settingsButtonSpritesheet.png', 221, 229);
        game.load.image('turnArrow', 'Assets/GUI/arrow.png');
        game.load.image('turnSprite', 'Assets/GUI/paper-button-off.png');
        game.load.image('dialog', 'Assets/GUI/paper-dialog.png');
        game.load.image('dialogorange', 'Assets/GUI/dialog.png');
        game.load.image('dialogblue', 'Assets/GUI/dialog-box.png');
        game.load.image('mana', 'Assets/GUI/mana_orb.png');
        game.load.image('mana_empty', 'Assets/GUI/mana_orb_empty.png');
        game.load.image('shield', 'Assets/GUI/shield_of_reflection.png');
        game.load.image('book', 'Assets/GUI/tome.png');
        game.load.image('tools', 'Assets/GUI/tools.png');
        game.load.image('x', 'Assets/GUI/x.png');
        game.load.image('map', 'Assets/GUI/map.png');
        game.load.image('heart', 'Assets/GUI/heart.png');
        game.load.image('bag', 'Assets/GUI/backpack.png');
        game.load.image('coin', 'Assets/GUI/coin.png');

    },
    create: function () {

        //Default text style
        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };

        //Create layers for sprite z levels
        back_layer = game.add.group();
        board_layer = game.add.group();
        player_layer = game.add.group();
        player_layer['1'] = game.add.group();
        player_layer['2'] = game.add.group();
        player_layer['3'] = game.add.group();
        cursor_layer = game.add.group();
        target_layer = game.add.group();
        pop_layer = game.add.group();


        //Build the background
        var tile = game.add.tileSprite(0, 0, game.width, game.height, 'dirt');
        back_layer.add(tile);
        var playerArea = game.add.sprite(game.width - 50, game.height - 50, 'dialog');
        playerArea.width = 500;
        playerArea.height = 218;
        playerArea.anchor.x = 1;
        playerArea.anchor.y = 1;
        back_layer.add(playerArea);
        var infoArea = game.add.sprite(game.width - 310, game.height - 278, 'dialog');
        infoArea.width = 250;
        infoArea.height = game.height - 318;
        infoArea.anchor.x = 1;
        infoArea.anchor.y = 1;
        back_layer.add(infoArea);

        turnArrow = game.add.sprite(10, 10, 'turnArrow');
        turnArrow.x = game.width - 280;
        turnArrow.y = (50 * gameVariables.currentPlayer) + 60;



        //Build the game board
        for (y = 0; y < gameVariables.boardInfo.squares.length; y++) {
            var row = gameVariables.boardInfo.squares[y];
            for (x = 0; x < row.length; x++) {
                if (row[x] > 0) {
                    addGameSquare("neutral", (50 * x) + 75, (50 * y) + 75, row[x], x, y);
                }
            }
        }

        //Add the game players to the board
        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {

            if (gameVariables.gameContinue == false) {
                gameVariables.gamePlayerArray[i].square = gameVariables.boardInfo.boardStart;

            }
            
            var gameBoardResult = gameVariables.gameBoard.find(function (element) {
                return element.sprite.gameSquareId == gameVariables.gamePlayerArray[i].square;
            });

            gameVariables.gamePlayerArray[i].sprite = game.add.sprite(0, 0, gameVariables.gamePlayerArray[i].class);
            gameVariables.gamePlayerArray[i].sprite.width = 45;
            gameVariables.gamePlayerArray[i].sprite.height = 45;
            gameVariables.gamePlayerArray[i].sprite.anchor.x = 0.5;
            gameVariables.gamePlayerArray[i].sprite.anchor.y = 0.5;
            gameVariables.gamePlayerArray[i].sprite.x = gameBoardResult.x;
            gameVariables.gamePlayerArray[i].sprite.y = gameBoardResult.y;
            gameVariables.gamePlayerArray[i].sprite.gameSquareId = gameBoardResult.id;
            if (i == 0) {
                player_layer.add(gameVariables.gamePlayerArray[i].sprite);
            }
            else {
                player_layer[i.toString()].add(gameVariables.gamePlayerArray[i].sprite);
            }
    
            gameVariables.gamePlayerArray[i].turnSprite = game.add.sprite(game.width - 250, (50 * i) + 50, 'turnSprite');
        }


        //Add cards to the players hands
        if (gameVariables.gameContinue == false) {

            for (i = 0; i < gameVariables.playerMaxHand; i++) {
                var card = gameVariables.gamePlayerArray[0].deck.pop();
                gameVariables.gamePlayerArray[0].handTracker.push(new playerHandTracker(card.id, card, 0, 0));
                gameVariables.gamePlayerArray[0].hand.push(card);
            }

            for (i = 1; i < gameVariables.gamePlayerArray.length; i++) {
                gameVariables.gamePlayerArray[i].deck = shuffle(gameVariables.gamePlayerArray[i].deck);
                for (x = 0; x < 4; x++) {
                    var card = gameVariables.gamePlayerArray[i].deck.pop();
                    gameVariables.gamePlayerArray[i].hand.push(card);
                }

            }

        }
        createPlayerHand();


        //Build the GUI
        var pbs = game.add.sprite(game.width - 530, game.height - 255, gameVariables.playerColor);
        var pb = game.add.sprite(game.width - 530, game.height - 255, gameVariables.playerImg);
        pbs.width = 35;
        pbs.height = 35;
        back_layer.add(pbs);
        back_layer.add(pb);
        var ptxt = game.add.text(game.width - 495, game.height - 255, gameVariables.playerName, style);

        var endbutton = game.add.button(game.width - 530, game.height - 110, 'endButton', endPlayerTurn, this, 1, 1, 0);
        endbutton.width = 100;
        endbutton.height = 44;
        gameVariables.gamePlayerArray[0].manasprite = game.add.sprite(game.width - 535, game.height - 208, 'mana');
        gameVariables.gamePlayerArray[0].manasprite.width = 20;
        gameVariables.gamePlayerArray[0].manasprite.height = 20;
        goldInfoText = game.add.text(game.width - 161, game.height - 250, gameVariables.playerGold, style);
        goldInfoText.anchor.setTo(1, 0);
        handtext = game.add.text(game.width - 490, game.height - 160, "4/5", style);
        spellbook = game.add.sprite(game.width - 545, game.height - 183, 'book');
        bag = game.add.sprite(game.width - 461, game.height - 183, 'bag');
        map = game.add.sprite(game.width - 410, game.height - 183, 'map');
        map.inputEnabled = true;
        map.events.onInputDown.add(function (event) {
            gameVariables.gameContinue = true;
            game.state.start('map');
        }, this);
        tools = game.add.sprite(game.width - 110, game.height - 260, 'tools');
        tools.height = 50;
        tools.width = 50;
        heart = game.add.sprite(game.width - 350, game.height - 270, 'heart');
        hearttext = game.add.text(game.width - 295, game.height - 250, "20/20", style);
        coin = game.add.sprite(game.width - 250, game.height - 270, 'coin');

        //Game info text
        var infoText = game.add.text(game.width - 450, 60, "Info", style);
        back_layer.add(infoText);
        playerSquareCount = {};
        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
            playerSquareCount[i] = game.add.text(game.width - 60, (50 * i) + 65, "25%", style);
            playerSquareCount[i].anchor.setTo(1, 0);
            pop_layer.add(playerSquareCount[i]);
           
        }
        infoText1 = game.add.text(game.width - 550, 115, 'text1', style);
        infoText2 = game.add.text(game.width - 425, 115, 'text2', style);
        infoText3 = game.add.text(game.width - 550, 175, 'text3', style);
        infoText4 = game.add.text(game.width - 425, 175, 'text4', style);
        infoText5 = game.add.text(game.width - 550, 235, 'text5', style);
        infoText6 = game.add.text(game.width - 425, 235, 'text6', style);
        infoText7 = game.add.text(game.width - 550, 255, 'text7', style);
        infoText8 = game.add.text(game.width - 425, 255, 'text8', style);
        infoText9 = game.add.text(game.width - 550, 335, 'text9', style);
        infoText10 = game.add.text(game.width - 425, 335, 'text10', style);
        infoImage1 = game.add.sprite(game.width - 550, 80, 'wizard');
        infoImage2 = game.add.sprite(game.width -550, 140, 'wizard');
        infoImage3 = game.add.sprite(game.width -550, 200, 'wizard');
        infoImage4 = game.add.sprite(game.width -550, 305, 'wizard');
        infoImage5 = game.add.sprite(game.width -450, 305, 'wizard');
        back_layer.add(infoText1);
        back_layer.add(infoText2);
        back_layer.add(infoText3);
        back_layer.add(infoText4);
        back_layer.add(infoText5);
        back_layer.add(infoText6);
        back_layer.add(infoText7);
        back_layer.add(infoText8);
        back_layer.add(infoText9);
        back_layer.add(infoText10);
        back_layer.add(infoImage1);
        back_layer.add(infoImage2);
        back_layer.add(infoImage3);
        back_layer.add(infoImage4);
        back_layer.add(infoImage5);
        makeInfoInvis(true);

        //Add cursors for movement and targeting
        cursor1 = game.add.sprite(1, 1, 'cursor');
        cursor1.anchor.x = 0.5;
        cursor1.anchor.y = 0.5;
        cursor1.visible = false;
        cursor_layer.add(cursor1);
        cursor2 = game.add.sprite(1, 1, 'cursor');
        cursor2.anchor.x = 0.5;
        cursor2.anchor.y = 0.5;
        cursor2.visible = false;
        cursor_layer.add(cursor2);
        target = game.add.sprite(1, 1, 'target');
        target.anchor.x = 0.5;
        target.anchor.y = 0.5;
        target.visible = false;
        cursor_layer.add(target);

        //Add dice roll sprites
        dice = game.add.sprite(game.width - 125, game.height - 150, '1');
        dice.width = 40;
        dice.height = 40;
        button = game.add.button(game.width - 170, game.height - 108, 'diceButton', diceRollButtonClick, this, 1, 1, 0);
        button.frame = 1;
        button.width = 100;
        button.height = 44;
        if (gameVariables.gamePlayerArray[0].playerRollDice == true) {
            //Change roll button to "locked" frame
            button.frame = 2;
        }

        //Confirmation menu
        var style = { font: "bold 15px Arial", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 160 };
        menu = game.add.sprite(game.width / 2, game.height / 2, 'menu2');
        menu.anchor.x = 0.5;
        menu.anchor.y = 0.5;
        menu.visible = false;
        menu.inputEnabled = true;
        menu.events.onInputUp.add(menuClick, this);
        qText = game.add.text((game.width / 2), (game.height / 2) - 40, "Would you like to cast this spell?", style);
        qText.anchor.x = 0.5;
        qText.anchor.y = 0.5;
        qText.visible = false;
        yesText = game.add.text((game.width / 2)-40, (game.height/ 2)+45, "Yes");
        yesText.anchor.x = 0.5;
        yesText.anchor.y = 0.5;
        yesText.inputEnabled = true;
        yesText.visible = false;
        yesText.events.onInputUp.add(menuConfirmClick, this);
        noText = game.add.text((game.width / 2) + 40, (game.height / 2) + 45, "No");
        noText.anchor.x = 0.5;
        noText.anchor.y = 0.5;
        noText.inputEnabled = true;
        noText.visible = false;
        noText.events.onInputUp.add(menuConfirmClick, this);


        //Cross start menu
        manaText = game.add.text((game.width / 2) - 60, (game.height / 2) + 40, "Mana", style);
        manaText.inputEnabled = true;
        manaText.visible = false;
        manaText.events.onInputUp.add(menuStartClick, this);

        cardText = game.add.text((game.width / 2) -60, (game.height / 2) + 10, "Card", style);
        cardText.inputEnabled = true;
        cardText.visible = false;
        cardText.events.onInputUp.add(menuStartClick, this);

        healthText = game.add.text((game.width / 2) +20, (game.height / 2) + 40, "Health", style);
        healthText.inputEnabled = true;
        healthText.visible = false;
        healthText.events.onInputUp.add(menuStartClick, this);

        goldText = game.add.text((game.width / 2) + 20, (game.height / 2) + 10, "Gold", style);
        goldText.inputEnabled = true;
        goldText.visible = false;
        goldText.events.onInputUp.add(menuStartClick, this);


        //Direction confirmation menu
        leftButt = game.add.button((game.width / 2 - 65), (game.height / 2) + 10, 'leftButton', dirButtonClick, this, 1, 1, 2, 1);
        leftButt.width = 40;
        leftButt.height = 40;
        leftButt.direction = "left";
        leftButt.visible = false;
        upButt = game.add.button((game.width / 2 - 21), (game.height / 2) - 32 , 'upButton', dirButtonClick, this, 1, 1, 2, 1);
        upButt.width = 40;
        upButt.height = 40;
        upButt.direction = "up";
        upButt.visible = false;      
        rightButt = game.add.button((game.width / 2 + 25), (game.height / 2) + 10, 'rightButton', dirButtonClick, this, 1, 1, 2, 1);
        rightButt.width = 40;
        rightButt.height = 40;
        rightButt.direction = "right";
        rightButt.visible = false;
        downButt = game.add.button((game.width / 2 - 21), (game.height / 2) + 10, 'downButton', dirButtonClick, this, 1, 1, 2, 1);
        downButt.width = 40;
        downButt.height = 40;
        downButt.direction = "down";
        downButt.visible = false;
        pop_layer.add(menu);
        pop_layer.add(yesText);
        pop_layer.add(noText);
        pop_layer.add(qText);
        pop_layer.add(leftButt);
        pop_layer.add(upButt);
        pop_layer.add(rightButt);
        pop_layer.add(downButt);
        pop_layer.add(manaText);
        pop_layer.add(cardText);
        pop_layer.add(healthText);
        pop_layer.add(goldText);

    },
    update: function () {

        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };

        //Update player square capture percentage
        //Update game player mana and health in turn display
        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {

            gameVariables.gamePlayerArray[i].turnSprite.destroy();

            //Add turn tracker
            gameVariables.gamePlayerArray[i].turnSprite = game.add.sprite(game.width - 250, (50 * i) + 50, 'turnSprite');
            var child = game.add.sprite(10, 10, gameVariables.gamePlayerArray[i].color);
            child.height = 30;
            child.width = 30;
            gameVariables.gamePlayerArray[i].turnSprite.addChild(child);
            var child = game.add.sprite(10, 10, gameVariables.gamePlayerArray[i].class);
            child.height = 28;
            child.width = 28;
            gameVariables.gamePlayerArray[i].turnSprite.addChild(child);
            var txt = game.add.text(45, 8, gameVariables.gamePlayerArray[i].name, style);
            gameVariables.gamePlayerArray[i].turnSprite.addChild(txt);

            if (gameVariables.gamePlayerArray[i].armor > 0) {
                var shieldpic = game.add.sprite(130, 10, 'shield');
                shieldpic.width = 17;
                shieldpic.height = 17;
                var armortext = game.add.text(135, 10, gameVariables.gamePlayerArray[i].armor, { font: "bold 10pt Arial" })
                gameVariables.gamePlayerArray[i].turnSprite.addChild(shieldpic);
                gameVariables.gamePlayerArray[i].turnSprite.addChild(armortext);
            }
            

            var health = game.add.sprite(45, 29, 'rpix')
            health.width = 100;
            health.height = 2;
            gameVariables.gamePlayerArray[i].turnSprite.addChild(health);

            var hp = (gameVariables.gamePlayerArray[i].hp / gameVariables.gamePlayerArray[i].maxhp) * 100;
            var health = game.add.sprite(45, 29, 'gpix')
            health.width = hp;
            health.height = 2;
            gameVariables.gamePlayerArray[i].turnSprite.addChild(health);

            var mana = game.add.sprite(45, 32, 'mana');
            mana.width = 9;
            mana.height = 9;
            gameVariables.gamePlayerArray[i].turnSprite.addChild(mana);

            for (x = 1; x < gameVariables.gamePlayerArray[i].maxmana; x++) {
                
                var mana = game.add.sprite(45 + (10 * x), 32, 'mana');
                mana.width = 9;
                mana.height = 9;
                gameVariables.gamePlayerArray[i].turnSprite.addChild(mana);
            }

            back_layer.add(gameVariables.gamePlayerArray[i].turnSprite);    

            var calc = Math.round((gameVariables.gamePlayerArray[i].capturedSquares / gameVariables.boardInfo.boardTotal) * 100);
            playerSquareCount[i].setText(calc + '%');
        }
        
        //Update player info
        gameVariables.gamePlayerArray[0].manasprite.destroy();
        gameVariables.gamePlayerArray[0].manasprite = game.add.sprite(game.width - 530, game.height - 208, 'mana');
        gameVariables.gamePlayerArray[0].manasprite.width = 20;
        gameVariables.gamePlayerArray[0].manasprite.height = 20;
        if (gameVariables.gamePlayerArray[0].mana == 0) {
            gameVariables.gamePlayerArray[0].manasprite.loadTexture('mana_empty');
        }
        for (i = 1; i < gameVariables.gamePlayerArray[0].maxmana; i++) {
            var child = game.add.sprite(40 * i, 0, 'mana');
            if (i > gameVariables.gamePlayerArray[0].mana-1) {
                child.loadTexture('mana_empty');
            }
            gameVariables.gamePlayerArray[0].manasprite.addChild(child);
        }
        goldInfoText.setText(gameVariables.gamePlayerArray[0].gold);
        handtext.setText(gameVariables.gamePlayerArray[0].hand.length + "/" + gameVariables.playerMaxHand);
        hearttext.setText(gameVariables.gamePlayerArray[0].hp + "/" + gameVariables.gamePlayerArray[0].maxhp);

        //Display card info on hover
        for (c = 0; c < gameVariables.gamePlayerArray[0].handTracker.length; c++) {

            if (gameVariables.gamePlayerArray[0].handTracker[c].spritefront.input.pointerOver()) {

                makeInfoInvis(false);

                infoImage1.loadTexture(gameVariables.gamePlayerArray[0].handTracker[c].spriteimage.key);
                infoImage1.visible = true;
                infoText1.setText(gameVariables.gamePlayerArray[0].handTracker[c].cardInfo.name);
                infoText1.visible = true;
                infoText3.setText(gameVariables.gamePlayerArray[0].handTracker[c].cardInfo.desc);
                infoText3.visible = true;

            }
        }


        //PLAYER TURNS
        //Determine player turn
        if (gameVariables.currentPlayer == 0) {

            if (playerTurnMaintenanceComplete == false) {
                //Do player turn maintenance
                playerTurnMaintenanceComplete = true;


                gameVariables.gamePlayerArray[gameVariables.currentPlayer].playerRollDice = false;


                //TODO: Check for game over conditions


                //TODO: Check for persistent effects


                gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana = gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana;

                //TEsting square by moving player to it
                //playerMove(gameVariables.gamePlayerArray[0].sprite, 9);
            }


            //Human player turn
            if (playerNotified == false) {
                //Display player turn notification
                playerNotificationMenu = true;

                menu.visible = true;
                qText.setText("Your turn!");
                qText.visible = true;

                game.world.bringToTop(player_layer);
                

            }

        }
        else {
            //Computer player turn

            if (playerCrossStart == true) {

                //Must be computer that crossed the start. 
                playerCrossStart = false;

                if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp < 3) {
                    //Take the health option
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp + 2;
                }
                else if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.length < 2) {
                    //Draw cards
                    computerDrawCard(gameVariables.currentPlayer);
                    computerDrawCard(gameVariables.currentPlayer);
                }
                else if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana < 5) {
                    //Max mana increase
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana++;
                }
                else {
                    //Gain gold
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold = gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold + 100;
                }
            }

            game.world.bringToTop(player_layer[gameVariables.currentPlayer]);

            gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana = gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana;

            if (computerMoved == false) {
                //Execute a move
                var roll = 1 + Math.floor(Math.random() * 6);

                computerMoved = true;
                computerMoving = true;

                cursor1.visible = false;
                cursor2.visible = false;

                playerDestinations.length = 0;

                calculateDestinations(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId, roll);

                playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, roll);
            }

            if (computerMoving) {
                //Wait for move to finish
            }
            else {

                if (computerActing == false) {
                    //take computer actions.
                    computerActing = true;

                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana = gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana;

                    //Draw Card
                    computerDrawCard(gameVariables.currentPlayer);

                    //Play a random spell
                    //var randCard = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.splice(Math.floor(Math.random() * gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.length), 1);

                    //Play spell with hightest threat that we have mana for
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.sort(compareHandThreat);

                    var ai_card_to_cast = null;

                    for (i = 0; i < gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.length; i++) {
                        if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana >= gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand[i].cost) {
                            //Cast this card
                            ai_card_to_cast = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand[i];
                        }
                    }

                    if (ai_card_to_cast != null) {
                        castSpell(ai_card_to_cast.id, gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite);
                    }



                    endCurrentPlayerTurn();
                }
                else {
                    //Wait for actions to complete
                }

            }          

        }


        //Display player destination cursors
        if (playerDestinations.length > 0) {
            var cursorsFound = 0;
            for (x = 0; x < playerDestinations.length; x++) {
                for (i = 0; i < gameVariables.gameBoard.length; i++) {
                    if (gameVariables.gameBoard[i].sprite.gameSquareId == playerDestinations[x]) {

                        if (cursorsFound == 0) {
                            cursor1.x = gameVariables.gameBoard[i].sprite.x;
                            cursor1.y = gameVariables.gameBoard[i].sprite.y;

                            cursor1.visible = true;
                            cursorsFound++;
                        }
                        else {
                            cursor2.x = gameVariables.gameBoard[i].sprite.x;
                            cursor2.y = gameVariables.gameBoard[i].sprite.y;

                            cursor2.visible = true;
                        }
                    }
                }
            }
        }

        //Display spell target cursors
        if (playerSpellTargeting == true) {

            playerSpellTargeting = false;

            for (var i = 0; i < targetArray.length; i++) {

                var cur = game.add.sprite(targetArray[i].x, targetArray[i].y, 'target');
                cur.anchor.setTo(0.5);
                cur.targetArrayIndex = i;
                cur.inputEnabled = true;
                cur.events.onInputDown.add(targetClicked, this);
                target_layer.add(cur);
                game.world.bringToTop(target_layer);
                targetArray[i].sprite = cur;
                game.add.tween(targetArray[i].sprite).to({ alpha: 0 }, 500, Phaser.Easing.Linear.NONE, true,0,1000);
            }


        }

        //Multiple targets menu
        if (multipleTargetsMenu == true) {

            multipleTargetsMenu = false;

            menu.visible = true;
            qText.setText("Please choose a target.");
            qText.visible = true;

            for (var i = 0; i < multipleTargetsArray.length; i++) {

                var cur = game.add.sprite((game.width/2)+(i * 50)-50, game.height/2, multipleTargetsArray[i].image);
                cur.anchor.setTo(0.5);
                cur.targetArrayIndex = i;
                cur.inputEnabled = true;
                cur.events.onInputDown.add(targetMenuClicked, this);
                pop_layer.add(cur);
                multipleTargetsArray[i].sprite = cur;

            }
            

        }


        //Display start cross menu
        if (playerCrossStartMenu == true && gameVariables.currentPlayer == 0) {

            playerCrossStartMenu = false;

            menu.visible = true;
            qText.setText("Please choose a reward.");
            qText.visible = true;
            manaText.visible = true;
            cardText.visible = true;
            healthText.visible = true;
            goldText.visible = true;

        }
        

        //Display player direction choice menu
        if (playerDirChoiceMenu == true) {

            var choiceresult = {};

            if (forwardMovement == true) {
                choiceresult = gameVariables.boardInfo.choiceSquares.find(function (element) {
                    return element.id == activePlayerSquare;
                });
            }
            else {
                choiceresult = gameVariables.boardInfo.backwardChoiceSquares.find(function (element) {
                    return element.id == activePlayerSquare;
                });
            }


            menu.visible = true;
            qText.setText("Choose a direction.");
            qText.visible = true;

            if (choiceresult.left > 0) {
                leftButt.visible = true;
                leftButt.choice = choiceresult.left;
            }
            if (choiceresult.up > 0) {
                upButt.visible = true;
                upButt.choice = choiceresult.up;
            }
            if (choiceresult.right > 0) {
                rightButt.visible = true;
                rightButt.choice = choiceresult.right;
            }
            if (choiceresult.down > 0 ) {
                downButt.visible = true;
                downButt.choice = choiceresult.down;
            }
        }

        //Display if player doesn't have enough mana for spell
        if (playerManaNotificationMenu == true) {
            playerManaNotificationMenu = false;

            menu.visible = true;
            qText.setText("Not enough mana.");
            qText.visible = true;
        }

        //Player choice yes or no menu
        if (playerChoiceMenu == true) {
            menu.visible = true;
            qText.setText("Cast this spell?");
            qText.visible = true;
            yesText.visible = true;
            yesText.choice = "yes";
            noText.visible = true;
            noText.choice = "no";
        }

        //discard menu
        if (playerDiscardMenu == true) {
            menu.visible = true;
            qText.setText("Please discard a card.");
            qText.visible = true;

            playerDiscardMenu = false;
            playerDiscardWaiting = true;
        }

        //Captured loot notification
        if (capturedLootRewardNotice == true) {

            capturedLootRewardNotice = false;
            menu.visible = true;
            qText.setText(capturedLootRewardNoticeText);
            qText.visible = true;

        }

        //Tween the cards back to starting position if moved if hand changes
        for (var i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {

            //var tween1 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].group).to({ x: 0 + (i *10), y: 0 }, 200, Phaser.Easing.Linear.None, false);
            var tween1 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spritefront).to({ x: 110 * i + 50, y: game.height - 50},200,Phaser.Easing.Linear.None, false);
            var tween2 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spriteborder).to({ x: 110 * i + 50, y: game.height - 50 }, 200, Phaser.Easing.Linear.None, false);
            var tween3 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spriteimage).to({ x: 110 * i + 100, y: game.height - 130 }, 200, Phaser.Easing.Linear.None, false);
            var tween4 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].text1).to({ x: 110 * i + 105, y: game.height - 170 }, 200, Phaser.Easing.Linear.None, false);
            var tween5 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].text2).to({ x: 110 * i + 115, y: game.height - 75 }, 200, Phaser.Easing.Linear.None, false);

            tween1.start();
            tween2.start();
            tween3.start();
            tween4.start();
            tween5.start();

        }
        
        //for (i = 0; i < gameBoard.length; i++) {
        //    if (gameBoard[i].sprite.input.pointerOver()) {
        //        gameBoard[i].sprite.alpha = 0.5;
        //    }
        //    else {
        //        gameBoard[i].sprite.alpha = 1;
        //    }
        //}

        //for (i = 0; i < playerHand.length; i++) {
        //    if (playerHand[i].sprite.input.pointerOver()) {
        //       //playerHand[i].sprite.scale.setTo(4, 4);
        //        //card1.scale.set(2, 2);
        //    }
        //    else {
        //       // playerHand[i].sprite.scale.setTo(2, 2);
        //       // card1.scale.set(1, 1);
        //    }
        //}
    }

}

function createPlayerHand() {
    for (var i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {

        addCardToHand(i);

    }   
}


function addCardToHand(i) {

    //Add card front
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront = game.add.sprite(110 * i + 50, game.height - 50, 'cardFront');
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.width = 100;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.height = 140;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.anchor.x = 0;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.anchor.y = 1;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.cardId = gameVariables.gamePlayerArray[0].handTracker[i].id;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.inputEnabled = true;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.events.onInputDown.add(cardClick, this);

    //Add card border
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder = game.add.sprite(110 * i + 50, game.height - 50, 'redFrame');
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.width = 100;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.height = 140;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.anchor.x = 0;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.anchor.y = 1;

    //Add card sprite picture
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage = game.add.sprite(110 * i + 100, game.height - 130, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.image);
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.width = 60;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.height = 60;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.anchor.x = 0.5;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.anchor.y = 0.5;

    //Add card text
    var style = { font: "bold 10px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: gameVariables.gamePlayerArray[0].handTracker[i].spritefront.width, align: "center" };
    gameVariables.gamePlayerArray[0].handTracker[i].text1 = game.add.text(110 * i + 105, game.height - 170, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.name, style);
    gameVariables.gamePlayerArray[0].handTracker[i].text1.anchor.set(0.5);
    gameVariables.gamePlayerArray[0].handTracker[i].text2 = game.add.text(110 * i + 115, game.height - 77, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.attack + "/" + gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.defense, { font: "bold 15px Arial" });


    //Add card mana
    for (m = 0; m < gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.cost; m++) {
        var manacost = game.add.sprite(5, -51 + (m * 4), 'mana');
        manacost.height = 3;
        manacost.width = 3;
        gameVariables.gamePlayerArray[0].handTracker[i].spritefront.addChild(manacost);
    }

    //Add card armor
    gameVariables.gamePlayerArray[0].handTracker[i].armor = game.add.sprite(110 * i + 60, game.height - 75, 'shield');
    gameVariables.gamePlayerArray[0].handTracker[i].armor.width = 17;
    gameVariables.gamePlayerArray[0].handTracker[i].armor.height = 17;
    gameVariables.gamePlayerArray[0].handTracker[i].armortext = game.add.text(110 * i + 65, game.height - 76, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.armor, { font: "bold 13px Arial" })
    if (gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.armor == 0) {
        gameVariables.gamePlayerArray[0].handTracker[i].armor.visible = false;
        gameVariables.gamePlayerArray[0].handTracker[i].armortext.visible = false;
    }

    gameVariables.gamePlayerArray[0].handTracker[i].group = game.add.group();

    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spritefront);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spriteborder);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spriteimage);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].text1);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].text2);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].armor);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].armortext);


}


function drawCard() {


    if (gameVariables.gamePlayerArray[0].deck.length < 1) {
        gameVariables.gamePlayerArray[0].deck = gameVariables.gamePlayerArray[0].discard.slice();
        gameVariables.gamePlayerArray[0].deck = shuffle(gameVariables.gamePlayerArray[0].deck);
        gameVariables.gamePlayerArray[0].discard.length = 0;
    }

    var card = gameVariables.gamePlayerArray[0].deck.pop();

    if (typeof card !== 'undefined') {
        var ind = gameVariables.gamePlayerArray[0].handTracker.push(new playerHandTracker(card.id, card, 0, 0));
        gameVariables.gamePlayerArray[0].hand.push(card);
        addCardToHand(ind - 1);
    }


}


function clearPlayerHand() {
    for (var i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
        removeCardFromHandTracker(i);
    }   
}


function removeCardFromHandTracker(handTrackerIndex) {

    //for (i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
    //if (gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].id == id) {
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].group.removeAll(true);
    //Destroy sprites in handtracker
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].spritefront.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].spriteborder.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].spriteimage.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].text1.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].text2.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].armor.destroy();
    gameVariables.gamePlayerArray[0].handTracker[handTrackerIndex].armortext.destroy();

    //Remove card from hand tracker
    gameVariables.gamePlayerArray[0].handTracker.splice(handTrackerIndex, 1);


    // }

    // }
}


function addGameSquare(type, x, y, squareId, gridX, gridY) {
    var sprite = {};

    switch (type) {

        case "fire":
            sprite = game.add.sprite(x, y, 'fire');
            break;
        case "neutral":
            sprite = game.add.sprite(x, y, 'neutral');
            break;
        case "water":
            sprite = game.add.sprite(x, y, 'water');

            break;
        case "life":
            sprite = game.add.sprite(x, y, 'fire');

            break;
        case "death":
            sprite = game.add.sprite(x, y, 'death');

            break;
    }

    sprite.width = 50;
    sprite.height = 50;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.inputEnabled = true;
    sprite.events.onInputDown.add(boardSquareClicked, this);
    sprite.gameSquareId = squareId;
    sprite.gridX = gridX;
    sprite.gridY = gridY;
    board_layer.add(sprite);

    var gs = new gameSquare(squareId, x, y, sprite);


    //Add special square items to board
    for (i = 0; i < gameVariables.boardInfo.specialSquares.length; i++) {    

        if (gameVariables.boardInfo.specialSquares[i].squareId == squareId) {
            if (gameVariables.boardInfo.specialSquares[i].looted > 0) {
                gs.special = game.add.sprite(x, y, gameVariables.boardInfo.specialSquares[i].alt);
            }
            else {
                gs.special = game.add.sprite(x, y, gameVariables.boardInfo.specialSquares[i].type);
            }
           
            gs.special.anchor.x = 0.5;
            gs.special.anchor.y = 0.5;

            board_layer.add(gs.special);
        }

    }
        
    gameVariables.gameBoard.push(gs);

}


function cardClick(item) {
    cardClicked = item.cardId;

    if (playerDiscardWaiting == true) {

        //Discard spell 
        if (gameVariables.currentPlayer == 0) {

            for (i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
                if (gameVariables.gamePlayerArray[0].handTracker[i].id == cardClicked) {
                    removeCardFromHandTracker(i);
                    break;
                }
            }

            for (m = 0; m < gameVariables.gamePlayerArray[0].hand.length; m++) {
                if (gameVariables.gamePlayerArray[0].hand[m].id == cardClicked) {
                    //Add card to discard
                    gameVariables.gamePlayerArray[0].discard.push(gameVariables.gamePlayerArray[0].hand[m]);

                    //Remove card from hand
                    gameVariables.gamePlayerArray[0].hand.splice(m, 1);

                    break;
                }
            }

        }

        //If hand is under max hand end turn
        if (gameVariables.gamePlayerArray[0].hand.length <= gameVariables.gamePlayerArray[0].maxhand) {
            playerDiscardWaiting = false;

            menu.visible = false;
            qText.visible = false;

            endPlayerTurn();
        }

    }
    else {

        if (gameVariables.currentPlayer == 0) {

            //Confirm that player wants to cast the spell
            playerChoiceMenu = true;
        }


    }



}


function castSpell(id, player) {
    var cardDetails = masterCardList.find(function(card) {
        return card.id == id;
    });

    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == player.gameSquareId;
    });

    //check if player has enough mana for spell
    if (cardDetails.cost > gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana) {
        //Not enough mana
        playerManaNotificationMenu = true;

        return;
    }
    else {
        gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana = gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana - cardDetails.cost;
    }

    //Check if summon creature spell
    if (cardDetails.creature == true) {

        if (cardDetails.spell == false) {
            playCreatureOnSquare(boardSquareDetail, cardDetails, player);
        }
        else {
            //Determine target
            highlightTargets(cardDetails, boardSquareDetail, player);
        }

    } else {
        highlightTargets(cardDetails, boardSquareDetail, player);
    }
        


    //Discard spell that was cast
    if (gameVariables.currentPlayer == 0) {

        for (i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
            if (gameVariables.gamePlayerArray[0].handTracker[i].id == id) {
                removeCardFromHandTracker(i);
                break;
            }
        }

    }

    for (m = 0; m < gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.length; m++) {
        if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand[m].id == id) {
            //Add card to discard
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].discard.push(gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand[m]);

            //Remove card from hand
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.splice(m, 1);

            break;
        }
    }


}


function highlightTargets(cardDetails, boardSquareDetail, player) {
    playerSpellTargeting = true;
    targetArray.length = 0;

    var location = cardDetails.targetlocation;
    var type = cardDetails.targettype;

    if (location == "all") {
        //Select all
        if (type == "creature" || type == "both") {
            //Any squares with creatures
            var gameBoardCreatureArray = gameVariables.gameBoard.filter(function (element) {
                return element.creature != null;
            });

            gameBoardCreatureArray.forEach(function (gbc) {
                targetArray.push({ x: gbc.creature.sprite.x, y: gbc.creature.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: gbc.creature.squareId, player: player, type: "creature", model: gbc.creature });
            });
        }


        if (type == "player" || type == "both") {

            gameVariables.gamePlayerArray.forEach(function (gp) {
                targetArray.push({ x: gp.sprite.x, y: gp.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: gp.sprite.gameSquareId, player: player, type: "player", model: gp });
            });

        }
    }

    if (location == "self") {
        //Just select current square as target to start
        targetArray.push({ x: boardSquareDetail.sprite.x, y: boardSquareDetail.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: boardSquareDetail.id, player: player, type: type });
    }

    if (location == "row") {
        //TODO
    }


    if (location == "square") {
        //Just select current square as target to start
        targetArray.push({ x: boardSquareDetail.sprite.x, y: boardSquareDetail.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: boardSquareDetail.id, player: player, type: type });
    }

    if (location == "adj") {
        //Adjacent squares
        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == boardSquareDetail.sprite.gameSquareId;
        });

        var neighbors = Array2D.orthogonals(gameVariables.boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        neighbors.forEach(function(neighborSquare) {

            var gbr = gameVariables.gameBoard.find(function(orth) {
                return orth.sprite.gameSquareId == neighborSquare;
            });

            if (typeof gbr !== 'undefined') {
                targetArray.push({ x: gbr.x, y: gbr.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: neighborSquare, player: player, type: type });
            }

        });
    }

    if (location == "any") {

        if (type == "creature" || type == "both") {
            //Any squares with creatures
            var gameBoardCreatureArray = gameVariables.gameBoard.filter(function (element) {
                return element.creature != null;
            });

            gameBoardCreatureArray.forEach(function(gbc) {
                targetArray.push({ x: gbc.creature.sprite.x, y: gbc.creature.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: gbc.creature.squareId, player: player, type: "creature", model: gbc.creature });
            });
        }


        if (type == "player" || type == "both") {

            gameVariables.gamePlayerArray.forEach(function (gp) {
                targetArray.push({ x: gp.sprite.x, y: gp.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: gp.sprite.gameSquareId, player: player, type: "player", model: gp });
            });

        }

    }

}


function targetClicked(target) {

    var targetArrayItem = targetArray[target.targetArrayIndex];

    for (var i = 0; i < targetArray.length; i++) {

        targetArray[i].sprite.destroy();

    }

    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == targetArrayItem.targetSquare;
    });

    var card = targetArrayItem.card;


    //Check if all
    if (targetArrayItem.card.targetlocation == "all") {

        game.camera.flash(0xff0000, 500);

        targetArray.forEach(function (target) {

            var deets = gameVariables.gameBoard.find(function (item) {
                return item.id == target.targetSquare;
            });

            if (target.type == "player") {
                damagePlayerOnSquare(deets, target.card, target.player, target.model.class);
            }
            else {
                damageCreatureOnSquare(deets, target.card, target.player);
            }
        });

        if (targetArray[target.targetArrayIndex].card.creature == true) {

            playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

        }

        return;
    }

    //Check if self
    if (targetArrayItem.card.targetlocation == "self") {

        processSpecialSpell(card, targetArrayItem.player, boardSquareDetail, "player", targetArrayItem.player.key);

        if (targetArray[target.targetArrayIndex].card.creature == true) {

            playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

        }

        return;
    }

    //Check if square
    if (targetArrayItem.card.targetlocation == "square") {
        targetArray.length = 0;

        if (targetArrayItem.card.targettype == "creature" || targetArrayItem.card.targettype == "both") {
            if (boardSquareDetail.creature != null) {
                targetArray.push({ x: boardSquareDetail.creature.sprite.x, y: boardSquareDetail.creature.sprite.y, sprite: {}, card: targetArrayItem.card, originSquare: boardSquareDetail, targetSquare: boardSquareDetail.creature.squareId, player: targetArrayItem.player, type: "creature", model: boardSquareDetail.creature });

            }
            
        }
        if (targetArrayItem.card.targettype == "player" || targetArrayItem.card.targettype == "both") {

            gameVariables.gamePlayerArray.forEach(function (gp) {
                if (gp.sprite.gameSquareId == targetArrayItem.targetSquare) {
                    if (targetArrayItem.player.id != 99) {

                    }
                    
                }

            });
        }

        if (targetArray.length == 0) {
            //No targets
            if (targetArrayItem.card.creature == true) {

                playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

            }
            return;
        }
    }

    //Check for multiple targets
    var result = targetArray.filter(function (item) {
        return item.targetSquare == targetArrayItem.targetSquare
    });

    if (result.length > 1) {

        for (i = 0; i < result.length; i++) {

            if (result[i].type == "creature") {
                multipleTargetsArray.push({ sprite: {}, image: result[i].model.sprite.key, card: result[i].card, originSquare: result[i].originSquare, targetSquare: result[i].targetSquare, player: result[i].player, type: "creature" });
            }
            else {
                multipleTargetsArray.push({ sprite: {}, image: result[i].model.class, card: result[i].card, originSquare: result[i].originSquare, targetSquare: result[i].targetSquare, player: result[i].player, type: "player" });
            }
        }

        multipleTargetsMenu = true;
    }
    else {

        if (result.length == 0) {
            if (targetArray[target.targetArrayIndex].card.creature == true) {

                playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

            }
            return;
        }

        game.camera.flash(0xff0000, 500);

        if (card.special == 0) {

            if (result[0].type == "ground") {

                if (boardSquareDetail.creature != null) {
                    damageCreatureOnSquare(boardSquareDetail, card, targetArrayItem.player);
                }

                var targetPlayer = gameVariables.gamePlayerArray.filter(function (item) {
                    return item.sprite.gameSquareId == targetArrayItem.targetSquare;
                });

                if (targetPlayer.length > 0) {
                    targetPlayer.forEach(function (tp) {
                        damagePlayerOnSquare(boardSquareDetail, card, targetArrayItem.player, tp.class);
                    });

                }

            }
            else if (result[0].type == "creature") {
                damageCreatureOnSquare(boardSquareDetail, card, targetArrayItem.player);
            }
            else {
                var targetPlayer = gameVariables.gamePlayerArray.find(function (item) {
                    return item.sprite.gameSquareId == targetArrayItem.targetSquare;
                });

                damagePlayerOnSquare(boardSquareDetail, card, targetArrayItem.player, targetPlayer.class);
            }
        }
        else {
            if (result[0].type == "creature") {
                processSpecialSpell(card, result[0].player, result[0].targetSquare, result[0].type, result[0].model);
            }
            else {
                var targetPlayer = gameVariables.gamePlayerArray.find(function (item) {
                    return item.sprite.gameSquareId == result[0].targetSquare;
                });

                processSpecialSpell(card, result[0].player, result[0].targetSquare, result[0].type, targetPlayer.class);
            }
            
        }


        if (targetArray[target.targetArrayIndex].card.creature == true) {

            playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

        }
    }


}


function targetMenuClicked(item) {

    var targetResult = multipleTargetsArray[item.targetArrayIndex];

    var boardResult = gameVariables.gameBoard.find(function (item) {
        return item.id == targetResult.targetSquare
    })

    game.camera.flash(0xff0000, 500);

    if (targetResult.card.special == 0) {
        if (targetResult.type == "creature") {
            damageCreatureOnSquare(boardResult, targetResult.card, targetResult.player);
        }
        else {
            damagePlayerOnSquare(boardResult, targetResult.card, targetResult.player, targetResult.sprite.key);
        }

    }
    else {
        processSpecialSpell(targetResult.card, targetResult.player, targetResult.targetSquare, targetResult.type, targetResult.image);
    }

    if (targetResult.card.creature == true) {
        playCreatureOnSquare(boardResult, targetResult.card, targetResult.player);
    }

    multipleTargetsArray.forEach(function (item) {
        item.sprite.destroy();
    });

    multipleTargetsArray.length = 0;
    menu.visible = false;
    qText.visible = false;
}


function damageCreatureOnSquare(boardSquareDetail, cardDetails, player) {
    boardSquareDetail.creature.hitpoints = (boardSquareDetail.creature.hitpoints -
        Math.max((cardDetails.damage - boardSquareDetail.creature.armor), 0));

    if (boardSquareDetail.creature.hitpoints < 1) {
        //defender dead
        boardSquareDetail.creature.sprite.destroy();
        boardSquareDetail.creature.hitspritegreen.destroy();
        boardSquareDetail.creature.hitspritered.destroy();
        boardSquareDetail.creature = null;
    } else {
        //Defender takes damage but lives.
        var percent = (boardSquareDetail.creature.hitpoints / boardSquareDetail.creature.maxhitpoints);
        var pixelWidth = 20 - Math.round(percent * 20);

        boardSquareDetail.creature.hitspritered.width = pixelWidth;
    }
}


function damagePlayerOnSquare(boardSquareDetail, cardDetails, player, playerClass) {
    for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
        if (gameVariables.gamePlayerArray[i].class == playerClass)
        {
            gameVariables.gamePlayerArray[i].hp = (gameVariables.gamePlayerArray[i].hp - Math.max((cardDetails.damage - gameVariables.gamePlayerArray[i].armor), 0));
        }
    }
}


function playCreatureOnSquare(boardSquareDetail, cardDetails, player) {  

    //Check if square already has a creature
    if (boardSquareDetail.creature != null) {

        //Check if creature is owned by current player. If so replace.
        if (boardSquareDetail.creature.playerOwnedId == gameVariables.gamePlayerArray[gameVariables.currentPlayer].id) {

            boardSquareDetail.creature.sprite.destroy();
            boardSquareDetail.creature.hitspritegreen.destroy();
            boardSquareDetail.creature.hitspritered.destroy();
            boardSquareDetail.creature.creature = null;

            boardSquareDetail.creature = new gameSquareCreature(cardDetails.id,
                boardSquareDetail.id,
                null,
                cardDetails.defense,
                cardDetails.defense,
                cardDetails.armor,
                cardDetails.attack,
                cardDetails.defense,
                gameVariables.gamePlayerArray[gameVariables.currentPlayer].id);
            var creatureSprite =
                game.add.sprite(boardSquareDetail.sprite.x, boardSquareDetail.sprite.y, cardDetails.image);
            creatureSprite.width = 45;
            creatureSprite.height = 45;
            creatureSprite.anchor.x = 0.5;
            creatureSprite.anchor.y = 0.5;
            board_layer.add(creatureSprite);
            boardSquareDetail.creature.sprite = creatureSprite;

            var creatureHitpointsG =
                game.add.sprite(boardSquareDetail.sprite.x - 10, boardSquareDetail.sprite.y + 17, 'gpix');
            creatureHitpointsG.width = 20;
            creatureHitpointsG.height = 3;
            var creatureHitpointsR =
                game.add.sprite(boardSquareDetail.sprite.x - 10, boardSquareDetail.sprite.y + 17, 'rpix');
            creatureHitpointsR.width = 0;
            creatureHitpointsR.height = 3;

            board_layer.add(creatureHitpointsG);
            board_layer.add(creatureHitpointsR);

            boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
            boardSquareDetail.creature.hitspritered = creatureHitpointsR;

            captureSquare(boardSquareDetail.id);

            return;
        }

        boardCreature = boardSquareDetail.creature;

        //Creature already exists!
        //Super awesome creature combat battle
        var defHp = (boardCreature.hitpoints - Math.max((cardDetails.attack - boardCreature.armor), 0));

        var attackerHP = (cardDetails.defense - Math.max((boardCreature.attack - cardDetails.armor), 0));

        if (defHp < 1) {
            //defender dead
            boardCreature.sprite.destroy();
            boardCreature.hitspritegreen.destroy();
            boardCreature.hitspritered.destroy();
            boardSquareDetail.creature = null;

            if (attackerHP > 0) {
                //Square is empty place creature and capture
                boardSquareDetail.creature = new gameSquareCreature(cardDetails.id,
                    boardSquareDetail.id,
                    null,
                    attackerHP,
                    cardDetails.defense,
                    cardDetails.armor,
                    cardDetails.attack,
                    cardDetails.defense,
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].id);
                var creatureSprite = game.add.sprite(boardSquareDetail.sprite.x,
                    boardSquareDetail.sprite.y,
                    cardDetails.image);
                creatureSprite.width = 45;
                creatureSprite.height = 45;
                creatureSprite.anchor.x = 0.5;
                creatureSprite.anchor.y = 0.5;
                board_layer.add(creatureSprite);
                boardSquareDetail.creature.sprite = creatureSprite;

                var percent = (attackerHP / cardDetails.defense);
                var pixelWidth = 20 - Math.round(percent * 20);

                var creatureHitpointsG = game.add.sprite(boardSquareDetail.sprite.x - 10,
                    boardSquareDetail.sprite.y + 17,
                    'gpix');
                creatureHitpointsG.width = 20;
                creatureHitpointsG.height = 3;
                var creatureHitpointsR = game.add.sprite(boardSquareDetail.sprite.x - 10,
                    boardSquareDetail.sprite.y + 17,
                    'rpix');
                creatureHitpointsR.width = pixelWidth;
                creatureHitpointsR.height = 3;

                board_layer.add(creatureHitpointsG);
                board_layer.add(creatureSprite);

                boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
                boardSquareDetail.creature.hitspritered = creatureHitpointsR;


                captureSquare(player.gameSquareId);
            }


        } else {
            boardCreature.hitpoints = defHp;
            //Defender takes damage but lives. Attacker is discarded
            var percent = (defHp / boardCreature.maxhitpoints);
            var pixelWidth = 20 - Math.round(percent * 20);

            boardSquareDetail.creature.hitspritered.width = pixelWidth;

        }


    } else {
        //Square is empty place creature and capture
        boardSquareDetail.creature = new gameSquareCreature(cardDetails.id,
            boardSquareDetail.id,
            null,
            cardDetails.defense,
            cardDetails.defense,
            cardDetails.armor,
            cardDetails.attack,
            cardDetails.defense,
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].id);
        var creatureSprite =
            game.add.sprite(boardSquareDetail.sprite.x, boardSquareDetail.sprite.y, cardDetails.image);
        creatureSprite.width = 45;
        creatureSprite.height = 45;
        creatureSprite.anchor.x = 0.5;
        creatureSprite.anchor.y = 0.5;
        board_layer.add(creatureSprite);
        boardSquareDetail.creature.sprite = creatureSprite;

        var creatureHitpointsG =
            game.add.sprite(boardSquareDetail.sprite.x - 10, boardSquareDetail.sprite.y + 17, 'gpix');
        creatureHitpointsG.width = 20;
        creatureHitpointsG.height = 3;
        var creatureHitpointsR =
            game.add.sprite(boardSquareDetail.sprite.x - 10, boardSquareDetail.sprite.y + 17, 'rpix');
        creatureHitpointsR.width = 0;
        creatureHitpointsR.height = 3;

        board_layer.add(creatureHitpointsG);
        board_layer.add(creatureHitpointsR);

        boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
        boardSquareDetail.creature.hitspritered = creatureHitpointsR;

        captureSquare(boardSquareDetail.id);
    }

}


function processSpecialSpell(card, player, targetSquare, targetType, targetImage) {

    var currentPlayer = gameVariables.gamePlayerArray[gameVariables.currentPlayer];

    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == targetSquare;
    });
    
    if (card.special == 1) {
        var result = gameVariables.gamePlayerArray.find(function (item) {
            return item.class == targetImage;
        });


        if (result.gold >= card.damage) {
            currentPlayer.gold = currentPlayer.gold + card.damage;
        }

    }

    if (card.special == 2) {
        //Slow movement

    }

    if (card.special == 3) {
        //Heal 
        if (targetType == "creature") {
            boardSquareDetail.creature.hitpoints = boardSquareDetail.creature.hitpoints + card.damage;

            if (boardSquareDetail.creature.hitpoints > boardSquareDetail.creature.maxhitpoints) {
                boardSquareDetail.creature.hitpoints = boardSquareDetail.creature.maxhitpoints;
            }
            var percent = (boardSquareDetail.creature.hitpoints / boardSquareDetail.creature.maxhitpoints);
            var pixelWidth = 20 - Math.round(percent * 20);

            boardSquareDetail.creature.hitspritered.width = pixelWidth;
        } else {
            player.hp = player.hp + card.damage;
            if (player.hp > player.maxhp) {
                player.hp = player.maxhp;
            }

        }

    }
    
    if (card.special == 4) {
        //Move player
        calculateDestinations(player.gameSquareId, card.damage);
        playerMove(player, card.damage);
    }

    if (card.special == 5) {
        for (i = 0; i < card.damage; i++) {
            drawCard();
        }
    }

    if (card.special == 6) {
        currentPlayer.gold = currentPlayer.gold + card.damage;
    }

    if (card.special == 8) {
        boardSquareDetail.creature.hitpoints = boardSquareDetail.creature.hitpoints + card.defense;
        boardSquareDetail.creature.maxhitpoints = boardSquareDetail.creature.maxhitpoints + card.defense;
        boardSquareDetail.creature.armor = boardSquareDetail.creature.armor + card.armor;
        boardSquareDetail.creature.attack = boardSquareDetail.creature.attack + card.attack;

        //redraw defender health bar.
        var percent = (boardSquareDetail.creature.hitpoints / boardSquareDetail.creature.maxhitpoints);
        var pixelWidth = 20 - Math.round(percent * 20);

        boardSquareDetail.creature.hitspritered.width = pixelWidth;
    }

    if (card.special == 10) {
        currentPlayer.mana = currentPlayer.mana + card.damage;
    }

    if (card.special == 11) {
        currentPlayer.maxmana = currentPlayer.maxmana + card.damage;
    }
}


function processSpecialLoot(type, looted, result, boardSquareDetail) {
    console.log(type);
    switch (type) {
        case "key":
            //TODO: add key loot
            break;
        case "pressure":
            if (looted == 0) {
                game.camera.flash(0xff0000, 500);

                capturedLootRewardNotice = true;
                capturedLootRewardNoticeText = "The pit trap deals " + result + " damage!";
                gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp - Math.max((result - gameVariables.gamePlayerArray[gameVariables.currentPlayer].armor), 0);

                //Change pressure plate to open trap
                boardSquareDetail.special.destroy();
                var special = game.add.sprite(boardSquareDetail.x, boardSquareDetail.y, "trap");
                special.anchor.x = 0.5;
                special.anchor.y = 0.5;
                boardSquareDetail.special = special;
                board_layer.add(special);
            }
            break;
        case "magictrap":
            game.camera.flash(0xff0000, 500);

            capturedLootRewardNotice = true;
            capturedLootRewardNoticeText = "The magical trap deals " + result + " damage!";
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp - result;
            break;
        case "chest":
            if (looted == 0) {
                capturedLootRewardNotice = true;
                if (result == "rand") {
                    //TODO: Add random rewards table
                    capturedLootRewardNoticeText = "Found " + 110 + " gold in the chest!";
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold = gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold + result;
                }
                else if (result == "relic") {
                    //TODO: Add relic loot
                } else {
                    capturedLootRewardNoticeText = "Found " + result + " gold in the chest!";
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold = gameVariables.gamePlayerArray[gameVariables.currentPlayer].gold + result;
                }

                //Change chest to open chest
                boardSquareDetail.special.destroy();
                var special = game.add.sprite(boardSquareDetail.x, boardSquareDetail.y, "chestopen");
                special.anchor.x = 0.5;
                special.anchor.y = 0.5;
                boardSquareDetail.special = special;
                board_layer.add(special);
            }
            break;
        case "start":
            //Do nothing for now?
            break;
    }
}


function captureSquare(id) {   

    //Claim the square color
    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == id;
    });

    for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
        if (gameVariables.gamePlayerArray[i].color == boardSquareDetail.sprite.key) {
            gameVariables.gamePlayerArray[i].capturedSquares--;
        } 
        
    }

    gameVariables.gamePlayerArray[gameVariables.currentPlayer].capturedSquares++;

    boardSquareDetail.sprite.loadTexture(gameVariables.gamePlayerArray[gameVariables.currentPlayer].color);


}


function menuConfirmClick(item) {

    playerChoiceMenu = false;
    menu.visible = false;
    qText.visible = false;
    yesText.visible = false;
    noText.visible = false;

    if (item.choice == "yes") {

        castSpell(cardClicked, gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite);
    }

    
}


function menuClick() {
    if (playerNotificationMenu == true) {

        playerNotificationMenu = false;

        playerNotified = true;

        drawCard();

        //Enable roll dice button
        button.inputEnabled = true;
        button.frame = 1;
    }

    menu.visible = false;
    qText.visible = false;


}


function menuStartClick(choice) {


    switch (choice.text) {
        case "Gold":
            gameVariables.playerGold = gameVariables.playerGold + 100;
            break;
        case "Mana":
            gameVariables.gamePlayerArray[0].maxmana++;
            gameVariables.gamePlayerArray[0].mana++;
            break;
        case "Card":
            drawCard();
            drawCard();
            break;
        case "Health":
            gameVariables.gamePlayerArray[0].hp = gameVariables.gamePlayerArray[0].hp + 2;
            if (gameVariables.gamePlayerArray[0].hp > gameVariables.gamePlayerArray[0].maxhp) {
                gameVariables.gamePlayerArray[0].hp = gameVariables.gamePlayerArray[0].maxhp;
            }
            break;
    }


    menu.visible = false;
    qText.setText("Please choose a reward.");
    qText.visible = false;
    manaText.visible = false;
    cardText.visible = false;
    healthText.visible = false;
    goldText.visible = false;

}


function endPlayerTurn() {

    if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].playerRollDice == false) {
        //Player must roll before end of turn
        return;
    }

    if (playerDiscardWaiting == true) {
        playerDiscardMenu = true;
        return;
    }

    if (gameVariables.gamePlayerArray[0].hand.length > gameVariables.gamePlayerArray[0].maxhand) {
        playerDiscardMenu = true;
    }
    else {
        playerTurnMaintenanceComplete = false;
        playerNotified = false;
        endCurrentPlayerTurn();
    }



}


function endCurrentPlayerTurn() {

    //If current player is on square with creature, take damage
    var square = gameVariables.gameBoard.find(function (item) {
        return item.id == gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
    });

    if (square.creature != null) {
        if (square.creature.playerOwnedId != gameVariables.gamePlayerArray[gameVariables.currentPlayer].id) {
            //Take damage from creature in square
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp = (gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp - Math.max((square.creature.attack - gameVariables.gamePlayerArray[gameVariables.currentPlayer].armor), 0));
        }
    }

    //Check for loot on the square
    var boardSquareLoot = gameVariables.boardInfo.specialSquares.find(function (element) {
        return element.squareId == gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
    });

    
    if (typeof boardSquareLoot != 'undefined') {
        //found loot
        processSpecialLoot(boardSquareLoot.type, boardSquareLoot.looted, boardSquareLoot.result, square);
        boardSquareLoot.looted++;
    }

        
    //Change game to next player
    gameVariables.currentPlayer++;

    if (gameVariables.currentPlayer > gameVariables.gamePlayerArray.length - 1) {
        gameVariables.currentPlayer = 0;
    }

    //Move turn tracker
    var tween = game.add.tween(turnArrow).to({ x: game.width - 280, y: (50 * gameVariables.currentPlayer) + 60 }, 500, Phaser.Easing.Linear.None, true);

    computerMoved = false;
    computerMoving = false;
    computerActing = false;
}


function diceRoll(item) {

    //Create random number between 1-6
    var roll = 1 + Math.floor(Math.random() * 6);

    switch (roll) {
        case 1:
            item.loadTexture('1', 0);
            break;
        case 2:
            item.loadTexture('2', 0);
            break;
        case 3:
            item.loadTexture('3', 0);
            break;
        case 4:
            item.loadTexture('4', 0);
            break;
        case 5:
            item.loadTexture('5', 0);
            break;
        case 6:
            item.loadTexture('6', 0);
            break;
    }

    cursor1.visible = false;
    cursor2.visible = false;

    playerDestinations.length = 0;

    calculateDestinations(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId, roll);

    playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, roll);
}


function diceRollButtonClick() {
    if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].playerRollDice == true) {
        return;
    }

    gameVariables.gamePlayerArray[gameVariables.currentPlayer].playerRollDice = true;
    button.inputEnabled = false;
    diceRoll(dice);

}


function dirButtonClick(item) {
    //Direction choice chosen. Hide popup and move player to choice. Then continue player move as normal.
    playerDirChoiceMenu = false;
    qText.visible = false;
    menu.visible = false;
    leftButt.visible = false;
    upButt.visible = false;
    rightButt.visible = false;
    downButt.visible = false;

    var gameBoardResult = gameVariables.gameBoard.find(function (element) {
        return element.sprite.gameSquareId == item.choice;
    });

    var tween = game.add.tween(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite).to({ x: gameBoardResult.sprite.x, y: gameBoardResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

    if (forwardMovement == true) {
        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId = item.choice;
            playerDestinations.length = 0;
            playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, playerRoll - 1);
        }, this);
    }
    else {
        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId = item.choice;
            playerDestinations.length = 0;
            playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, playerRoll + 1);
        }, this);
    }



}


function playerMove(playerSprite, roll) {

    //Change roll button to "locked" frame
    button.frame = 2;

    playerRoll = roll;

    var nextPathIdArray = [];

    if (roll > 0) {
        forwardMovement = true;

        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == playerSprite.gameSquareId;
        });
        
        var neighbors = Array2D.orthogonals(gameVariables.boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (playerSprite.gameSquareId == gameVariables.boardInfo.boardEnd) {

            var boardPathId = neighbors.find(function (element) {
                return element == gameVariables.boardInfo.boardStart
            });

            nextPathIdArray.push(boardPathId);

        } else if (playerSprite.gameSquareId == gameVariables.boardInfo.boardStart) {

            var boardPathId = neighbors.filter(function (element) {
                return element > playerSprite.gameSquareId && element != gameVariables.boardInfo.boardEnd
            });

            nextPathIdArray = boardPathId;

        } else {
            var boardPathId = neighbors.filter(function (element) {

                return element > playerSprite.gameSquareId;
            });

            nextPathIdArray = boardPathId;
        }

        if (nextPathIdArray.length > 1) {

            if (gameVariables.currentPlayer == 0) {
                //If player has multiple choices start player choice menu and return.
                playerDirChoiceMenu = true;
                activePlayerSquare = playerSprite.gameSquareId;
                return;
            }

            var AIchoice = nextPathIdArray[Math.floor(Math.random() * nextPathIdArray.length)];
            nextPathIdArray[0] = AIchoice;
        }
     
        var gameBoardDestResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == nextPathIdArray[0];
        });

        if (nextPathIdArray[0] == gameVariables.boardInfo.boardStart)
        {
            playerCrossStart = true;
        }


        var tween = game.add.tween(playerSprite).to({ x: gameBoardDestResult.sprite.x, y: gameBoardDestResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            playerSprite.gameSquareId = nextPathIdArray[0];
            playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, roll - 1);
        }, this);

    }
    else if (roll < 0) {
        forwardMovement = false;
        //Move player backwards
        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == playerSprite.gameSquareId;
        });

        var neighbors = Array2D.orthogonals(gameVariables.boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (playerSprite.gameSquareId == gameVariables.boardInfo.boardStart) {

            var boardPathId = neighbors.find(function (element) {
                return element == gameVariables.boardInfo.boardEnd;
            });

            nextPathIdArray.push(boardPathId);

        } else if (playerSprite.gameSquareId == gameVariables.boardInfo.boardEnd) {

            var boardPathId = neighbors.filter(function (element) {
                return element < playerSprite.gameSquareId && element != gameVariables.boardInfo.boardStart && element != 0;
            });

            nextPathIdArray = boardPathId;

        } else {
            var boardPathId = neighbors.filter(function (element) {

                return element < playerSprite.gameSquareId && element != 0;
            });

            nextPathIdArray = boardPathId;
        }

        if (nextPathIdArray.length > 1) {

            if (gameVariables.currentPlayer == 0) {
                //If player has multiple choices start player choice menu and return.
                playerDirChoiceMenu = true;
                activePlayerSquare = playerSprite.gameSquareId;
                return;
            }

            var AIchoice = nextPathIdArray[Math.floor(Math.random() * nextPathIdArray.length)];
            nextPathIdArray[0] = AIchoice;
        }

        var gameBoardDestResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == nextPathIdArray[0];
        });
       

        var tween = game.add.tween(playerSprite).to({ x: gameBoardDestResult.sprite.x, y: gameBoardDestResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            playerSprite.gameSquareId = nextPathIdArray[0];
            playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, roll + 1);
        }, this);
    }
    else {
        //Player movement done.
        gameVariables.gamePlayerArray[gameVariables.currentPlayer].square =
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
        computerMoving = false;
        if (playerCrossStart == true) {
            playerCrossStartMenu = true;
            playerCrossStart = false;
        }
    }
}


function calculateDestinations(currentSquareId, roll) {
    //Used to calculate cursor location to mark player move.
    if (roll > 0) {

        var nextPathIdArray = [];
        //Find current game board piece
        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == currentSquareId
        });

        var neighbors = Array2D.orthogonals(gameVariables.boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (currentSquareId == gameVariables.boardInfo.boardEnd) {

            var boardPathId = neighbors.find(function (element) {
                return element == gameVariables.boardInfo.boardStart
            });

            nextPathIdArray.push(boardPathId);

        } else if (currentSquareId == gameVariables.boardInfo.boardStart) {

            var boardPathId = neighbors.filter(function (element) {
                return element > currentSquareId && element != gameVariables.boardInfo.boardEnd
            });

            nextPathIdArray = boardPathId;

        } else {
            var boardPathId = neighbors.filter(function (element) {

                return element > currentSquareId;
            });
            nextPathIdArray = boardPathId;
        }

        if (nextPathIdArray.length > 1) {

            //Calculate each path at the fork recursively
            for (pathId = 0; pathId < nextPathIdArray.length; pathId++) {
                calculateDestinations(nextPathIdArray[pathId], roll - 1);
            }
        }
        else {
            calculateDestinations(nextPathIdArray[0], roll - 1);
        }
    }
    else {
        playerDestinations.push(currentSquareId);
    }


}


function computerDrawCard(currentPlayer) {
    //Draw Card
    if (gameVariables.gamePlayerArray[currentPlayer].deck.length < 1) {
        gameVariables.gamePlayerArray[currentPlayer].deck = gameVariables.gamePlayerArray[currentPlayer].discard.slice();
        gameVariables.gamePlayerArray[currentPlayer].deck = shuffle(gameVariables.gamePlayerArray[currentPlayer].deck);
        gameVariables.gamePlayerArray[currentPlayer].discard.length = 0;
    }

    var card = gameVariables.gamePlayerArray[currentPlayer].deck.pop();

    if (typeof card !== 'undefined') {
        gameVariables.gamePlayerArray[currentPlayer].hand.push(card);
    }
}


function boardSquareClicked(item) {
    makeInfoInvis(false);

    infoImage1.loadTexture(item.key);
    infoImage1.visible = true;
    infoText1.setText(item.key);
    infoText1.visible = true;


    var boardSquareDetail = gameVariables.gameBoard.find(function (board) {
        return board.id == item.gameSquareId;
    });


    if (boardSquareDetail.creature != null) {
        var creature = boardSquareDetail.creature;

        var cardDetails = masterCardList.find(function (card) {
            return card.id == creature.cardId;
        });

        infoImage3.loadTexture(creature.sprite.key);
        infoImage3.visible = true;
        infoText3.setText(cardDetails.name + " HP: " + creature.hitpoints)
        infoText3.visible = true;
    }

        var players = gameVariables.gamePlayerArray.filter(function (player) {
            return player.sprite.gameSquareId == item.gameSquareId;
        });

        if (players.length > 0) {

            for (i = 0; i < players.length; i++) {
                if (i == 0) {
                    infoImage4.loadTexture(players[i].class);
                    infoImage4.visible = true;
                    infoText9.setText(players[i].name + " HP: " + players[i].hp)
                    infoText9.visible = true;
                }
                if (i == 1) {
                    infoImage5.loadTexture(players[i].class);
                    infoImage5.visible = true;
                    infoText10.setText(players[i].name + " HP: " + players[i].hp)
                    infoText10.visible = true;
                }
            }

        }





}


function makeInfoInvis(visible) {
    infoText1.visible = visible;
    infoText2.visible = visible;
    infoText3.visible = visible;
    infoText4.visible = visible;
    infoText5.visible = visible;
    infoText6.visible = visible;
    infoText7.visible = visible;
    infoText8.visible = visible;
    infoText9.visible = visible;
    infoText10.visible = visible;
    infoImage1.visible = visible;
    infoImage2.visible = visible;
    infoImage3.visible = visible;
    infoImage4.visible = visible;
    infoImage5.visible = visible;
}