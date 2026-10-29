var gameMain = function () { };


var playerDestinations = [],
    playerDirChoiceMenu = false,
    playerChoiceMenu = false,
    playerRoll = 0,
    activePlayerSquare = 0,
    addCardHand = false,
    playerNotificationMenu = false,
    playerNotified = false,
    playerCardDrawn = false,
    computerMoving = false,
    playerCrossStart = false,
    playerCrossStartMenu = false,
    playerDiscardMenu = false,
    playerDiscardWaiting = false,
    playerDuplicateWaiting = false,
    playerManaNotificationMenu = false,
    playerSpellTargeting = false,
    multipleTargetsMenu = false,
    forwardMovement = true,
    playerTurnMaintenanceComplete = false,
    capturedLootRewardNotice = false,
    capturedLootRewardNoticeText = "",
    battleEnded = false,
    playerStatusPanels = [],
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
            gameVariables.gameBoard.length = 0;

            gameVariables.gamePlayerArray.push(new gamePlayer(99,
                gameVariables.boardInfo.boardStart,
                gameVariables.playerName,
                gameVariables.playerClass,
                gameVariables.playerColor,
                gameVariables.playerHealth,
                gameVariables.playerStartingMana,
                true,
                shuffle(gameVariables.playerDeck.slice()),
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
        game.load.image('dirt', 'assets/dirt4.png');

        //board elements
        game.load.image('chest', 'assets/board-elements/chest_2_closed.png');
        game.load.image('chestopen', 'assets/board-elements/chest_2_open.png');
        game.load.image('bluefountain', 'assets/board-elements/blue_fountain.png');
        game.load.image('redfountain', 'assets/board-elements/blood_fountain.png');
        game.load.image('dryfountain', 'assets/board-elements/dry_fountain.png');
        game.load.image('cardpicker', 'assets/board-elements/nemelex_1.png');
        game.load.image('trap', 'assets/board-elements/trap_blade.png');
        game.load.image('magictrap', 'assets/board-elements/trap_magical.png');
        game.load.image('pressure', 'assets/board-elements/pressure_plate.png');
        game.load.image('gpix', 'assets/gui/greenPixel.png');
        game.load.image('rpix', 'assets/gui/redPixel.png');
        game.load.image('start', 'assets/board-elements/stone_stairs_up.png');

        //dice images
        game.load.image('1', 'assets/front&side-1.png');
        game.load.image('2', 'assets/front-2.png');
        game.load.image('3', 'assets/front-3.png');
        game.load.image('4', 'assets/front&side-4.png');
        game.load.image('5', 'assets/front-5.png');
        game.load.image('6', 'assets/front-6.png');

        //cards
        game.load.image('redFrame', 'assets/RedFrame.png');
        game.load.image('cardFront', 'assets/FrontTexture.png');

        //spells
        game.load.image('zombie', 'assets/cards/zombie_ogre.png');
        game.load.image('bolt', 'assets/cards/bolt_of_fire_new.png');
        game.load.image('summon', 'assets/cards/summon_ugly_thing.png');
        game.load.image('centaur', 'assets/cards/centaur.png');
        game.load.image('rat', 'assets/cards/rat.png');
        game.load.image('turtle', 'assets/cards/turtle.png');
        game.load.image('bear', 'assets/cards/bear.png');
        game.load.image('spider', 'assets/cards/spider.png');
        game.load.image('yellow_wasp', 'assets/cards/yellow_wasp.png');
        game.load.image('death', 'assets/cards/symbol_of_torment.png');
        game.load.image('heal', 'assets/cards/regeneration_new.png');
        game.load.image('disengage', 'assets/cards/ledas_liquefaction.png');
        game.load.image('blizzard', 'assets/cards/ice_storm_new.png');
        game.load.image('steal', 'assets/cards/apportation_new.png');
        game.load.image('mushroom', 'assets/cards/wandering_mushroom_new.png');
        game.load.image('dummy', 'assets/cards/training_dummy_new.png');
        game.load.image('research', 'assets/cards/magic_mapping.png');
        game.load.image('poison', 'assets/cards/poison_arrow_6.png');
        game.load.image('defense', 'assets/cards/condensation_shield_new.png');


        //GUI and buttons
        game.load.image('menu', 'assets/gui/Menu.png');
        game.load.image('menu2', 'assets/gui/Menu_2.png');
        game.load.image('cursor', 'assets/gui/cursor.png');
        game.load.image('target', 'assets/gui/silenced.png');
        game.load.spritesheet('diceButton', 'assets/gui/diceButtonsSpritesheet.png', 410, 183);
        game.load.spritesheet('endButton', 'assets/gui/endturnButtonSpritesheet.png', 400, 173);
        game.load.spritesheet('leftButton', 'assets/gui/leftButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('upButton', 'assets/gui/upButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('rightButton', 'assets/gui/rightButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('downButton', 'assets/gui/downButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('settingsButton', 'assets/gui/settingsButtonSpritesheet.png', 221, 229);
        game.load.image('turnArrow', 'assets/gui/arrow.png');
        game.load.image('turnSprite', 'assets/gui/paper-button-off.png');
        game.load.image('dialog', 'assets/gui/paper-dialog.png');
        game.load.image('dialogorange', 'assets/gui/dialog.png');
        game.load.image('dialogblue', 'assets/gui/dialog-box.png');
        game.load.image('mana', 'assets/gui/mana_orb.png');
        game.load.image('mana_empty', 'assets/gui/mana_orb_empty.png');
        game.load.image('shield', 'assets/gui/shield_of_reflection.png');
        game.load.image('book', 'assets/gui/tome.png');
        game.load.image('tools', 'assets/gui/tools.png');
        game.load.image('x', 'assets/gui/x.png');
        game.load.image('map', 'assets/gui/map.png');
        game.load.image('heart', 'assets/gui/heart.png');
        game.load.image('bag', 'assets/gui/backpack.png');
        game.load.image('coin', 'assets/gui/coin.png');

    },
    create: function () {
        battleEnded = false;
        gameVariables.gamePlayerArray.forEach(function (player) {
            player.battleGold = 0;
        });

        //Default text style
        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };

        //Create layers for sprite z levels
        back_layer = game.add.group();
        board_square_layer = game.add.group();
        board_special_layer = game.add.group();
        creature_layer = game.add.group();
        ai_player_layer = game.add.group();
        human_player_layer = game.add.group();
        spell_effect_layer = game.add.group();
        cursor_layer = game.add.group();
        target_layer = spell_effect_layer;
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
            if (gameVariables.gamePlayerArray[i].human) {
                human_player_layer.add(gameVariables.gamePlayerArray[i].sprite);
            }
            else {
                ai_player_layer.add(gameVariables.gamePlayerArray[i].sprite);
            }

            gameVariables.gamePlayerArray[i].turnSprite = null;
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

        createPlayerStatusPanels();

        //Game info text
        var infoText = game.add.text(game.width - 450, 60, "Info", style);
        back_layer.add(infoText);
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
        pop_layer.add(cardText);
        pop_layer.add(healthText);
        pop_layer.add(goldText);

    },
    update: function () {

        if (battleEnded) {
            return;
        }

        var outcome = getBattleOutcome();
        if (outcome) {
            endBattle(outcome);
            return;
        }

        if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].hp <= 0) {
            advanceToNextPlayer();
            return;
        }

        updatePlayerStatusPanels();

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

            }

        }
        else {
            computerAI.update();
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

function getPlayerSchoolTheme(player) {
    var schoolAliases = {
        red: "Fire",
        blue: "Water",
        white: "Life",
        yellow: "Life",
        black: "Death",
        purple: "Death",
        green: "Earth"
    };
    var school = schoolAliases[player.color] || player.color;
    var validSchools = ["Fire", "Water", "Life", "Death", "Earth"];

    return validSchools.indexOf(school) >= 0 ? school : "Fire";
}

function createPlayerStatusPanels() {
    var players = gameVariables.gamePlayerArray;
    var rowStep = Math.min(82, (game.height - 90) / players.length);
    var panelHeight = Math.min(76, rowStep - 5);
    var panelWidth = 280;
    var panelX = game.width - panelWidth - 42;
    var startY = 34;
    var textStyle = {
        font: "bold 12px Arial",
        fill: "#ffffff",
        stroke: "#17202b",
        strokeThickness: 2
    };

    playerStatusPanels.length = 0;

    players.forEach(function (player, index) {
        var x = panelX;
        var y = startY + index * rowStep;
        var background = game.add.sprite(x, y, "turnSprite");
        background.width = panelWidth;
        background.height = panelHeight;
        pop_layer.add(background);
        player.turnSprite = background;

        var schoolBackground = game.add.sprite(x, y, getPlayerSchoolTheme(player));
        schoolBackground.width = panelWidth;
        schoolBackground.height = panelHeight;
        schoolBackground.alpha = 0.55;
        pop_layer.add(schoolBackground);

        var avatar = game.add.sprite(x + 7, y + 7, player.class);
        avatar.width = 42;
        avatar.height = 42;
        pop_layer.add(avatar);

        var name = game.add.text(x + 56, y + 5, player.name, {
            font: "bold 14px Arial",
            fill: "#ffffff",
            stroke: "#17202b",
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: panelWidth - 64
        });
        pop_layer.add(name);

        var school = game.add.text(x + 56, y + 22, getPlayerSchoolTheme(player) + " school", textStyle);
        pop_layer.add(school);

        var mana = game.add.text(x + 56, y + 39, "", textStyle);
        pop_layer.add(mana);
        var hand = game.add.text(x + 156, y + 39, "", textStyle);
        pop_layer.add(hand);
        var health = game.add.text(x + 56, y + 53, "", textStyle);
        pop_layer.add(health);
        var captured = game.add.text(x + 156, y + 53, "", textStyle);
        pop_layer.add(captured);

        var healthBarX = x + 56;
        var healthBarY = y + panelHeight - 9;
        var healthBarWidth = panelWidth - 68;
        var healthBarBackground = game.add.sprite(healthBarX, healthBarY, "rpix");
        healthBarBackground.width = healthBarWidth;
        healthBarBackground.height = 5;
        pop_layer.add(healthBarBackground);

        var healthBar = game.add.sprite(healthBarX, healthBarY, "gpix");
        healthBar.height = 5;
        pop_layer.add(healthBar);

        playerStatusPanels.push({
            background: background,
            schoolBackground: schoolBackground,
            avatar: avatar,
            name: name,
            school: school,
            mana: mana,
            hand: hand,
            health: health,
            captured: captured,
            healthBar: healthBar,
            healthBarWidth: healthBarWidth,
            x: x,
            y: y,
            height: panelHeight
        });
    });

    turnArrow.anchor.setTo(0.5);
    pop_layer.add(turnArrow);
    updatePlayerStatusPanels();
}

function updatePlayerStatusPanels() {
    var players = gameVariables.gamePlayerArray;
    var captureRequirement = gameVariables.boardInfo.captureRequirement || gameVariables.boardInfo.boardTotal;

    players.forEach(function (player, index) {
        var panel = playerStatusPanels[index];
        if (!panel) {
            return;
        }

        panel.mana.setText("Mana " + player.mana + "/" + player.maxmana);
        panel.hand.setText("Hand " + player.hand.length + "/" + player.maxhand);
        panel.health.setText("HP " + player.hp + "/" + player.maxhp);
        panel.captured.setText("Squares " + player.capturedSquares + "/" + captureRequirement);

        var healthRatio = player.maxhp > 0 ? player.hp / player.maxhp : 0;
        panel.healthBar.width = panel.healthBarWidth * Math.max(0, Math.min(healthRatio, 1));

        if (index === gameVariables.currentPlayer) {
            turnArrow.visible = true;
            turnArrow.x = panel.x - 17;
            turnArrow.y = panel.y + panel.height / 2;
        }
    });
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


function addTemporaryCardToHand(player, masterCard) {
    if (player.hand.length >= player.maxhand) {
        return null;
    }
    var tempCard = createTemporaryCard(masterCard);
    if (player.human && player === gameVariables.gamePlayerArray[0]) {
        var ind = player.handTracker.push(new playerHandTracker(tempCard.id, tempCard, 0, 0));
        player.hand.push(tempCard);
        addCardToHand(ind - 1);
    } else {
        player.hand.push(tempCard);
    }
    return tempCard;
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
    sprite.events.onInputOver.add(showSquareDetails, this);
    sprite.events.onInputOut.add(hideSquareDetails, this);
    sprite.gameSquareId = squareId;
    sprite.gridX = gridX;
    sprite.gridY = gridY;
    board_square_layer.add(sprite);

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

            board_special_layer.add(gs.special);
        }

    }

    gameVariables.gameBoard.push(gs);

}


function cardClick(item) {
    cardClicked = item.cardId;

    if (playerDuplicateWaiting == true) {
        var handCard = gameVariables.gamePlayerArray[0].hand.find(function (candidate) {
            return candidate.id == cardClicked;
        });
        playerDuplicateWaiting = false;
        menu.visible = false;
        qText.visible = false;
        if (handCard) {
            addTemporaryCardToHand(gameVariables.gamePlayerArray[0], handCard);
        }
        return;
    }

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
                    discardCard(gameVariables.gamePlayerArray[0], gameVariables.gamePlayerArray[0].hand[m]);

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
            if (cardDetails.special === SPECIAL_EFFECT.CAST_SPELL) {
                var caster = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
                processSpecialSpell(cardDetails, caster, caster.sprite.gameSquareId, "player", caster.class);
            }
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
            discardCard(gameVariables.gamePlayerArray[gameVariables.currentPlayer], gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand[m]);

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

    if (targetArrayItem.teleport) {
        var teleportData = targetArrayItem.teleport;
        targetArray.length = 0;
        executeTeleport(teleportData.type, teleportData.subject, targetArrayItem.targetSquare);
        return;
    }

    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == targetArrayItem.targetSquare;
    });

    if (targetArrayItem.summon) {
        targetArray.length = 0;
        playCreatureOnSquare(boardSquareDetail, targetArrayItem.summon.creatureCard, targetArrayItem.player);
        return;
    }

    var card = targetArrayItem.card;

    //Check if all
    if (targetArrayItem.card.targetlocation == "all") {

        game.camera.flash(0xff0000, 500);

        targetArray.forEach(function (target) {

            var deets = gameVariables.gameBoard.find(function (item) {
                return item.id == target.targetSquare;
            });

            if ((card.special === SPECIAL_EFFECT.DEBUFF_CREATURE || card.special === SPECIAL_EFFECT.SET_CREATURE_STATS ||
                card.special === SPECIAL_EFFECT.UNSUMMON || card.special === SPECIAL_EFFECT.TRANSFORM) &&
                target.type === "creature") {
                processSpecialSpell(card, target.model, target.targetSquare, target.type, target.model);
            } else if (target.type == "player") {
                damagePlayerOnSquare(deets, target.card, target.player, target.model.class, target.model);
            } else {
                damageCreatureOnSquare(deets, target.card, target.player);
            }
        });

        if (card.special === SPECIAL_EFFECT.CAST_SPELL) {
            var caster = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
            processSpecialSpell(card, caster, caster.sprite.gameSquareId, "player", caster.class);
        }

        if (targetArrayItem.card.creature == true) {

            playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

        }

        return;
    }

    //Check if self
    if (targetArrayItem.card.targetlocation == "self") {

        processSpecialSpell(card, targetArrayItem.player, boardSquareDetail, "player", targetArrayItem.player.key);

        if (targetArrayItem.card.creature == true) {

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
            if (targetArrayItem.card.special === SPECIAL_EFFECT.CAST_SPELL) {
                var caster = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
                processSpecialSpell(card, caster, caster.sprite.gameSquareId, "player", caster.class);
            }
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
                multipleTargetsArray.push({ sprite: {}, image: result[i].model.sprite.key, model: result[i].model, card: result[i].card, originSquare: result[i].originSquare, targetSquare: result[i].targetSquare, player: result[i].player, type: "creature" });
            }
            else {
                multipleTargetsArray.push({ sprite: {}, image: result[i].model.class, model: result[i].model, card: result[i].card, originSquare: result[i].originSquare, targetSquare: result[i].targetSquare, player: result[i].player, type: "player" });
            }
        }

        multipleTargetsMenu = true;
    }
    else {

        if (result.length == 0) {
            if (targetArrayItem.card.special === SPECIAL_EFFECT.CAST_SPELL) {
                var caster = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
                processSpecialSpell(card, caster, caster.sprite.gameSquareId, "player", caster.class);
            }
            if (targetArrayItem.card.creature == true) {

                playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);

            }
            return;
        }

        game.camera.flash(0xff0000, 500);

        if (card.special == SPECIAL_EFFECT.NONE) {

            if (result[0].type == "ground") {

                if (boardSquareDetail.creature != null) {
                    damageCreatureOnSquare(boardSquareDetail, card, targetArrayItem.player);
                }

                var targetPlayer = gameVariables.gamePlayerArray.filter(function (item) {
                    return item.sprite.gameSquareId == targetArrayItem.targetSquare;
                });

                if (targetPlayer.length > 0) {
                    targetPlayer.forEach(function (tp) {
                        damagePlayerOnSquare(boardSquareDetail, card, targetArrayItem.player, tp.class, tp);
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

                damagePlayerOnSquare(boardSquareDetail, card, targetArrayItem.player, result[0].model.class, result[0].model);
            }
        }
        else {
            if (result[0].type == "creature") {
                processSpecialSpell(card, result[0].player, result[0].targetSquare, result[0].type, result[0].model);
            }
            else {
                var targetPlayer = result[0].model;
                processSpecialSpell(card, targetPlayer, result[0].targetSquare, result[0].type, targetPlayer.class);
            }

        }


        if (targetArrayItem.card.creature == true) {

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

    if (targetResult.card.special == SPECIAL_EFFECT.NONE) {
        if (targetResult.type == "creature") {
            damageCreatureOnSquare(boardResult, targetResult.card, targetResult.player);
        }
        else {
            damagePlayerOnSquare(boardResult, targetResult.card, targetResult.player, targetResult.sprite.key, targetResult.model);
        }

    }
    else {
        var targetPlayer = targetResult.model || gameVariables.gamePlayerArray.find(function (player) {
            return player.sprite.gameSquareId == targetResult.targetSquare &&
                player.class == targetResult.image;
        });
        processSpecialSpell(targetResult.card, targetPlayer || targetResult.player, targetResult.targetSquare, targetResult.type, targetResult.image);
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


function updateCreatureHealthBar(creature) {
    var maxHealth = Math.max(creature.maxhitpoints, 1);
    var healthRatio = Math.max(0, Math.min(creature.hitpoints / maxHealth, 1));
    var damageWidth = creature.hitspritegreen.width * (1 - healthRatio);

    creature.hitspritered.width = damageWidth;
    creature.hitspritered.x = creature.hitspritegreen.x +
        creature.hitspritegreen.width - damageWidth;
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
        updateCreatureHealthBar(boardSquareDetail.creature);
    }
}


function damagePlayerOnSquare(boardSquareDetail, cardDetails, player, playerClass, targetPlayer) {
    for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
        var currentTarget = gameVariables.gamePlayerArray[i];
        if (targetPlayer ? currentTarget === targetPlayer :
            currentTarget.class == playerClass && currentTarget.sprite.gameSquareId == boardSquareDetail.id) {
            currentTarget.hp = currentTarget.hp - Math.max((cardDetails.damage - currentTarget.armor), 0);
        }
    }
}


function playCreatureOnSquare(boardSquareDetail, cardDetails, player) {
    var healthBarWidth = boardSquareDetail.sprite.width * 0.8;
    var healthBarX = boardSquareDetail.sprite.x - healthBarWidth / 2;

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
                gameVariables.gamePlayerArray[gameVariables.currentPlayer].id,
                cardDetails.flying,
                cardDetails.blitz,
                cardDetails.deadly,
                cardDetails.reach, cardDetails.regen);
            var creatureSprite =
                game.add.sprite(boardSquareDetail.sprite.x, boardSquareDetail.sprite.y, cardDetails.image);
            creatureSprite.width = 45;
            creatureSprite.height = 45;
            creatureSprite.anchor.x = 0.5;
            creatureSprite.anchor.y = 0.5;
            creature_layer.add(creatureSprite);
            boardSquareDetail.creature.sprite = creatureSprite;

            var creatureHitpointsG =
                game.add.sprite(healthBarX, boardSquareDetail.sprite.y + 17, 'gpix');
            creatureHitpointsG.width = healthBarWidth;
            creatureHitpointsG.height = 3;
            var creatureHitpointsR =
                game.add.sprite(healthBarX, boardSquareDetail.sprite.y + 17, 'rpix');
            creatureHitpointsR.width = 0;
            creatureHitpointsR.height = 3;

            creature_layer.add(creatureHitpointsG);
            creature_layer.add(creatureHitpointsR);

            boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
            boardSquareDetail.creature.hitspritered = creatureHitpointsR;
            updateCreatureHealthBar(boardSquareDetail.creature);

            captureSquare(boardSquareDetail.id);

            return;
        }

        boardCreature = boardSquareDetail.creature;

        //Creature already exists!
        //Super awesome creature combat battle
        var combat = resolveCombatRound({
            attack: cardDetails.attack, armor: cardDetails.armor, hitpoints: cardDetails.defense,
            flying: cardDetails.flying, reach: cardDetails.reach, blitz: cardDetails.blitz
        }, boardCreature, true);
        var defHp = boardCreature.hitpoints - combat.toDefender;

        var attackerHP = cardDetails.defense - combat.toAttacker;

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
                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].id,
                    cardDetails.flying,
                    cardDetails.blitz,
                    cardDetails.deadly,
                    cardDetails.reach, cardDetails.regen);
                var creatureSprite = game.add.sprite(boardSquareDetail.sprite.x,
                    boardSquareDetail.sprite.y,
                    cardDetails.image);
                creatureSprite.width = 45;
                creatureSprite.height = 45;
                creatureSprite.anchor.x = 0.5;
                creatureSprite.anchor.y = 0.5;
                creature_layer.add(creatureSprite);
                boardSquareDetail.creature.sprite = creatureSprite;

                var creatureHitpointsG = game.add.sprite(healthBarX,
                    boardSquareDetail.sprite.y + 17,
                    'gpix');
                creatureHitpointsG.width = healthBarWidth;
                creatureHitpointsG.height = 3;
                var creatureHitpointsR = game.add.sprite(healthBarX,
                    boardSquareDetail.sprite.y + 17,
                    'rpix');
                creatureHitpointsR.height = 3;

                creature_layer.add(creatureHitpointsG);
                creature_layer.add(creatureHitpointsR);

                boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
                boardSquareDetail.creature.hitspritered = creatureHitpointsR;
                updateCreatureHealthBar(boardSquareDetail.creature);


                captureSquare(boardSquareDetail.id);
            }


        } else {
            boardCreature.hitpoints = defHp;
            //Defender takes damage but lives. Attacker is discarded
            updateCreatureHealthBar(boardSquareDetail.creature);

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
            gameVariables.gamePlayerArray[gameVariables.currentPlayer].id,
            cardDetails.flying,
            cardDetails.blitz,
            cardDetails.deadly,
            cardDetails.reach, cardDetails.regen);
        var creatureSprite =
            game.add.sprite(boardSquareDetail.sprite.x, boardSquareDetail.sprite.y, cardDetails.image);
        creatureSprite.width = 45;
        creatureSprite.height = 45;
        creatureSprite.anchor.x = 0.5;
        creatureSprite.anchor.y = 0.5;
        creature_layer.add(creatureSprite);
        boardSquareDetail.creature.sprite = creatureSprite;

        var creatureHitpointsG =
            game.add.sprite(healthBarX, boardSquareDetail.sprite.y + 17, 'gpix');
        creatureHitpointsG.width = healthBarWidth;
        creatureHitpointsG.height = 3;
        var creatureHitpointsR =
            game.add.sprite(healthBarX, boardSquareDetail.sprite.y + 17, 'rpix');
        creatureHitpointsR.width = 0;
        creatureHitpointsR.height = 3;

        creature_layer.add(creatureHitpointsG);
        creature_layer.add(creatureHitpointsR);

        boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
        boardSquareDetail.creature.hitspritered = creatureHitpointsR;
        updateCreatureHealthBar(boardSquareDetail.creature);

        captureSquare(boardSquareDetail.id);
    }

}


function placeCreatureSprites(creature, boardSquareDetail) {
    var healthBarWidth = boardSquareDetail.sprite.width * 0.8;
    var healthBarX = boardSquareDetail.sprite.x - healthBarWidth / 2;

    creature.squareId = boardSquareDetail.id;
    creature.sprite.x = boardSquareDetail.sprite.x;
    creature.sprite.y = boardSquareDetail.sprite.y;
    creature.hitspritegreen.x = healthBarX;
    creature.hitspritegreen.y = boardSquareDetail.sprite.y + 17;
    creature.hitspritered.y = boardSquareDetail.sprite.y + 17;
    updateCreatureHealthBar(creature);
}


function destroyCreatureSprites(creature) {
    [creature.sprite, creature.hitspritegreen, creature.hitspritered].forEach(function (sprite) {
        if (sprite && sprite.destroy) {
            sprite.destroy();
        }
    });
}


// Replaces a creature with a fresh one built from newCard (full HP, new sprite and stats).
// The owner and square are kept, and the square's capture state is untouched.
function transformCreature(square, newCard) {
    var oldCreature = square.creature;
    var healthBarWidth = square.sprite.width * 0.8;
    var healthBarX = square.sprite.x - healthBarWidth / 2;

    destroyCreatureSprites(oldCreature);
    var creature = new gameSquareCreature(newCard.id, square.id, null, newCard.defense, newCard.defense,
        newCard.armor, newCard.attack, newCard.defense, oldCreature.playerOwnedId,
        newCard.flying, newCard.blitz, newCard.deadly, newCard.reach, newCard.regen);
    var creatureSprite = game.add.sprite(square.sprite.x, square.sprite.y, newCard.image);
    creatureSprite.width = 45;
    creatureSprite.height = 45;
    creatureSprite.anchor.x = 0.5;
    creatureSprite.anchor.y = 0.5;
    creature_layer.add(creatureSprite);
    creature.sprite = creatureSprite;

    var healthGreen = game.add.sprite(healthBarX, square.sprite.y + 17, 'gpix');
    healthGreen.width = healthBarWidth;
    healthGreen.height = 3;
    var healthRed = game.add.sprite(healthBarX, square.sprite.y + 17, 'rpix');
    healthRed.width = 0;
    healthRed.height = 3;
    creature_layer.add(healthGreen);
    creature_layer.add(healthRed);
    creature.hitspritegreen = healthGreen;
    creature.hitspritered = healthRed;

    square.creature = creature;
    updateCreatureHealthBar(creature);
    return creature;
}


// A moved creature behaves as if summoned on the destination: it fights any enemy there
// (one round, like a summon) and captures the square if it survives.
// Returns "moved", "defeated", "traded", or false when the move is not allowed.
function moveCreatureToSquare(fromSquareId, toSquareId) {
    var fromSquare = gameVariables.gameBoard.find(function (item) {
        return item.id == fromSquareId;
    });
    var toSquare = gameVariables.gameBoard.find(function (item) {
        return item.id == toSquareId;
    });
    if (!fromSquare || !toSquare || fromSquare === toSquare || !fromSquare.creature) {
        return false;
    }

    var mover = fromSquare.creature;
    var defender = toSquare.creature;
    if (defender && defender.playerOwnedId === mover.playerOwnedId) {
        return false;
    }

    var moverOwner = gameVariables.gamePlayerArray.find(function (item) {
        return item.id === mover.playerOwnedId;
    });
    var moverCard = masterCardList.find(function (item) {
        return item.id === mover.cardId;
    });
    var moverName = (moverOwner ? moverOwner.name : "Unknown") + "'s " +
        (moverCard ? moverCard.name : "creature");

    fromSquare.creature = null;

    if (!defender) {
        toSquare.creature = mover;
        placeCreatureSprites(mover, toSquare);
        captureSquare(toSquare.id, moverOwner);
        console.log(moverName + " moves to square " + toSquare.id + " and captures it");
        return "moved";
    }

    var defenderOwner = gameVariables.gamePlayerArray.find(function (item) {
        return item.id === defender.playerOwnedId;
    });
    var defenderCard = masterCardList.find(function (item) {
        return item.id === defender.cardId;
    });
    var defenderName = (defenderOwner ? defenderOwner.name : "Unknown") + "'s " +
        (defenderCard ? defenderCard.name : "creature");

    var combat = resolveCombatRound(mover, defender, true);
    var defenderDamage = combat.toDefender;
    var moverDamage = combat.toAttacker;
    defender.hitpoints -= defenderDamage;
    mover.hitpoints -= moverDamage;
    console.log(moverName + " attacks " + defenderName + " on square " + toSquare.id +
        " for " + defenderDamage + " damage; " + defenderName + " deals " + moverDamage + " back");

    if (defender.hitpoints > 0) {
        // Like a summoned attacker, the mover is lost if the defender holds the square.
        updateCreatureHealthBar(defender);
        destroyCreatureSprites(mover);
        console.log(moverName + " is defeated and " + defenderName + " holds square " + toSquare.id);
        return "defeated";
    }

    destroyCreatureSprites(defender);
    toSquare.creature = null;
    console.log(defenderName + " dies");

    if (mover.hitpoints > 0) {
        toSquare.creature = mover;
        placeCreatureSprites(mover, toSquare);
        captureSquare(toSquare.id, moverOwner);
        console.log(moverName + " survives and captures square " + toSquare.id);
        return "moved";
    }

    destroyCreatureSprites(mover);
    console.log(moverName + " dies; square " + toSquare.id + " is now empty");
    return "traded";
}


// Valid teleport destinations: never the subject's own square, and a creature cannot
// land on a square holding a creature owned by the same player.
function getTeleportDestinations(subjectType, subject) {
    var fromId = subjectType === "creature" ? subject.squareId : subject.sprite.gameSquareId;
    return gameVariables.gameBoard.filter(function (square) {
        if (square.id == fromId) {
            return false;
        }
        return !(subjectType === "creature" && square.creature &&
            square.creature.playerOwnedId === subject.playerOwnedId);
    });
}


function chooseAITeleportDestination(subjectType, subject, owner, destinations) {
    var scored = destinations.map(function (square) {
        var score = Math.random();
        if (subjectType === "creature") {
            var unowned = square.ownerPlayerId !== undefined
                ? square.ownerPlayerId !== owner.id
                : square.sprite.key !== owner.color;
            if (!square.creature) {
                score += 2;
            } else if (Math.max(subject.attack - square.creature.armor, 0) >= square.creature.hitpoints) {
                score += 2;
            }
            if (unowned) {
                score += 1;
            }
        }
        return { square: square, score: score };
    });
    scored.sort(function (a, b) {
        return b.score - a.score;
    });
    return scored.length ? scored[0].square : null;
}


function teleportPlayerToSquare(player, square) {
    player.sprite.x = square.sprite.x;
    player.sprite.y = square.sprite.y;
    player.sprite.gameSquareId = square.id;
    if ("square" in player) {
        player.square = square.id;
    }
}


function executeTeleport(subjectType, subject, destinationId) {
    var destination = gameVariables.gameBoard.find(function (item) {
        return item.id == destinationId;
    });
    if (!destination) {
        return false;
    }
    if (subjectType === "creature") {
        return !!moveCreatureToSquare(subject.squareId, destination.id);
    }
    teleportPlayerToSquare(subject, destination);
    return true;
}


function beginTeleportTargeting(card, subjectType, subject, destinations, caster) {
    playerSpellTargeting = true;
    targetArray.length = 0;
    destinations.forEach(function (square) {
        targetArray.push({
            x: square.sprite.x, y: square.sprite.y, sprite: {}, card: card,
            teleport: { type: subjectType, subject: subject },
            targetSquare: square.id, player: caster, type: "ground"
        });
    });
}


function getSummonCreatureCard(card) {
    var creatureCard = card.secondSpell && masterCardList.find(function (item) {
        return item.id === card.secondSpell;
    });
    if (!creatureCard || !creatureCard.creature) {
        console.error("Card " + card.name + " uses Summon but SecondSpell is not a creature card ID.");
        return null;
    }
    return creatureCard;
}


// Summon destinations exclude squares already holding a creature owned by the summoner.
function getSummonDestinations(owner) {
    return gameVariables.gameBoard.filter(function (square) {
        return !(square.creature && square.creature.playerOwnedId === owner.id);
    });
}


function chooseAISummonSquare(creatureCard, owner, destinations) {
    var scored = destinations.map(function (square) {
        var score = Math.random();
        if (!square.creature) {
            score += 2;
        } else if (Math.max(creatureCard.attack - square.creature.armor, 0) >= square.creature.hitpoints) {
            score += 2;
        }
        var unowned = square.ownerPlayerId !== undefined
            ? square.ownerPlayerId !== owner.id
            : square.sprite.key !== owner.color;
        if (unowned) {
            score += 1;
        }
        return { square: square, score: score };
    });
    scored.sort(function (a, b) {
        return b.score - a.score;
    });
    return scored.length ? scored[0].square : null;
}


function beginSummonTargeting(card, creatureCard, destinations, caster) {
    playerSpellTargeting = true;
    targetArray.length = 0;
    destinations.forEach(function (square) {
        targetArray.push({
            x: square.sprite.x, y: square.sprite.y, sprite: {}, card: card,
            summon: { creatureCard: creatureCard },
            targetSquare: square.id, player: caster, type: "ground"
        });
    });
}


function processSpecialSpell(card, player, targetSquare, targetType, targetImage) {
    var currentPlayer = gameVariables.gamePlayerArray[gameVariables.currentPlayer];
    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        var squareId = targetSquare && typeof targetSquare === "object"
            ? targetSquare.id
            : targetSquare;
        return item.id == squareId;
    });

    var targetPlayer = targetType === "player" ? player : null;
    var targetCreature = targetType === "creature" && boardSquareDetail
        ? boardSquareDetail.creature
        : null;

    switch (card.special) {
        case SPECIAL_EFFECT.STEAL_GOLD:
            var victim = targetPlayer || gameVariables.gamePlayerArray.find(function (item) {
                return item.class == targetImage;
            });
            if (victim && victim !== currentPlayer) {
                var stolenGold = Math.min(Math.max(0, card.damage), Math.max(victim.gold, 0));
                victim.gold -= stolenGold;
                currentPlayer.gold += stolenGold;
            }
            break;
        case SPECIAL_EFFECT.SLOW_MOVEMENT:
            if (targetPlayer) {
                targetPlayer.movementPenalty = (targetPlayer.movementPenalty || 0) +
                    Math.max(0, card.damage);
            }
            break;
        case SPECIAL_EFFECT.HEAL:
            if (targetCreature) {
                targetCreature.hitpoints = Math.min(
                    targetCreature.hitpoints + card.damage,
                    targetCreature.maxhitpoints
                );
                updateCreatureHealthBar(targetCreature);
            } else if (targetPlayer) {
                targetPlayer.hp = Math.min(targetPlayer.hp + card.damage, targetPlayer.maxhp);
            }
            break;
        case SPECIAL_EFFECT.MOVE_FORWARD:
        case SPECIAL_EFFECT.MOVE_BACK:
            var movingPlayer = currentPlayer;
            var movement = Math.max(0, card.damage) *
                (card.special === SPECIAL_EFFECT.MOVE_BACK ? -1 : 1);
            if (movingPlayer && movingPlayer.sprite && movingPlayer.sprite.gameSquareId != null) {
                calculateDestinations(movingPlayer.sprite.gameSquareId, movement);
                playerMove(movingPlayer.sprite, movement);
            }
            break;
        case SPECIAL_EFFECT.DRAW_CARDS:
            for (var drawIndex = 0; drawIndex < Math.max(0, card.damage); drawIndex++) {
                if (currentPlayer.human) {
                    drawCard();
                } else {
                    computerDrawCard(gameVariables.currentPlayer);
                }
            }
            break;
        case SPECIAL_EFFECT.GAIN_GOLD:
            grantBattleGold(currentPlayer, card.damage);
            break;
        case SPECIAL_EFFECT.BUFF_CREATURE:
            if (targetCreature) {
                targetCreature.hitpoints += card.defense;
                targetCreature.maxhitpoints += card.defense;
                targetCreature.armor += card.armor;
                targetCreature.attack += card.attack;
                ["flying", "blitz", "deadly", "reach"].forEach(function (ability) {
                    if (card[ability]) {
                        targetCreature[ability] = card[ability];
                    }
                });
                targetCreature.regen = (targetCreature.regen || 0) + (card.regen || 0);
                updateCreatureHealthBar(targetCreature);
            }
            break;
        case SPECIAL_EFFECT.DEBUFF_CREATURE:
        case SPECIAL_EFFECT.SET_CREATURE_STATS:
            if (targetCreature) {
                if (card.special === SPECIAL_EFFECT.SET_CREATURE_STATS) {
                    // Sets the stat (never raising it), including to 0. Max HP is kept at 1 or more
                    // so HP only drops to the new max and this never kills a creature.
                    var newMaxHp = Math.max(Math.min(targetCreature.maxhitpoints, card.defense), 1);
                    targetCreature.maxhitpoints = newMaxHp;
                    targetCreature.hitpoints = Math.min(targetCreature.hitpoints, newMaxHp);
                    targetCreature.attack = Math.min(targetCreature.attack, Math.max(card.attack, 0));
                } else {
                    targetCreature.hitpoints -= Math.max(0, card.defense);
                    targetCreature.maxhitpoints = Math.max(
                        0,
                        targetCreature.maxhitpoints - Math.max(0, card.defense)
                    );
                    targetCreature.attack = Math.max(
                        0,
                        targetCreature.attack - Math.max(0, card.attack)
                    );
                }
                targetCreature.armor = Math.max(
                    0,
                    targetCreature.armor - Math.max(0, card.armor)
                );
                if (card.flying) {
                    targetCreature.flying = 0;
                }
                if (card.blitz) {
                    targetCreature.blitz = 0;
                }
                if (card.deadly) {
                    targetCreature.deadly = 0;
                }
                if (card.reach) {
                    targetCreature.reach = 0;
                }
                if (card.regen) {
                    targetCreature.regen = 0;
                }

                if (targetCreature.hitpoints <= 0) {
                    [targetCreature.sprite, targetCreature.hitspritegreen, targetCreature.hitspritered]
                        .forEach(function (sprite) {
                            if (sprite && sprite.destroy) {
                                sprite.destroy();
                            }
                        });
                    boardSquareDetail.creature = null;
                } else {
                    updateCreatureHealthBar(targetCreature);
                }
            }
            break;
        case SPECIAL_EFFECT.DUPLICATE_CARD:
            // Only the human player's hand is supported; they pick the card to copy.
            if (currentPlayer.human && currentPlayer.hand.length < currentPlayer.maxhand &&
                currentPlayer.hand.length > 0) {
                playerDuplicateWaiting = true;
                menu.visible = true;
                qText.setText("Choose a card in your hand to duplicate.");
                qText.visible = true;
            }
            break;
        case SPECIAL_EFFECT.TRANSFORM:
            if (targetCreature && boardSquareDetail) {
                var transformCard = getSummonCreatureCard(card);
                if (transformCard) {
                    transformCreature(boardSquareDetail, transformCard);
                }
            }
            break;
        case SPECIAL_EFFECT.UNSUMMON:
            if (targetCreature) {
                var summonCard = masterCardList.find(function (item) {
                    return item.id === targetCreature.cardId;
                });
                var creatureOwner = gameVariables.gamePlayerArray.find(function (item) {
                    return item.id === targetCreature.playerOwnedId;
                });
                [targetCreature.sprite, targetCreature.hitspritegreen, targetCreature.hitspritered]
                    .forEach(function (sprite) {
                        if (sprite && sprite.destroy) {
                            sprite.destroy();
                        }
                    });
                boardSquareDetail.creature = null;
                if (summonCard && creatureOwner) {
                    addTemporaryCardToHand(creatureOwner, summonCard);
                }
            }
            break;
        case SPECIAL_EFFECT.TELEPORT:
            var teleportType = targetCreature ? "creature" : (targetPlayer ? "player" : null);
            var teleportSubject = targetCreature || targetPlayer;
            if (!teleportType) {
                break;
            }
            var teleportDestinations = getTeleportDestinations(teleportType, teleportSubject);
            if (teleportDestinations.length === 0) {
                break;
            }
            if (currentPlayer.human) {
                beginTeleportTargeting(card, teleportType, teleportSubject, teleportDestinations, currentPlayer);
            } else {
                var teleportOwner = teleportType === "creature"
                    ? gameVariables.gamePlayerArray.find(function (item) {
                        return item.id === teleportSubject.playerOwnedId;
                    })
                    : teleportSubject;
                var teleportChoice = chooseAITeleportDestination(
                    teleportType, teleportSubject, teleportOwner || currentPlayer, teleportDestinations);
                if (teleportChoice) {
                    executeTeleport(teleportType, teleportSubject, teleportChoice.id);
                }
            }
            break;
        case SPECIAL_EFFECT.SUMMON:
            var summonCreatureCard = getSummonCreatureCard(card);
            var summonDestinations = getSummonDestinations(currentPlayer);
            if (!summonCreatureCard || summonDestinations.length === 0) {
                break;
            }
            if (currentPlayer.human) {
                beginSummonTargeting(card, summonCreatureCard, summonDestinations, currentPlayer);
            } else {
                var summonSquare = chooseAISummonSquare(summonCreatureCard, currentPlayer, summonDestinations);
                if (summonSquare) {
                    playCreatureOnSquare(summonSquare, summonCreatureCard, currentPlayer.sprite);
                }
            }
            break;
        case SPECIAL_EFFECT.SELF_DAMAGE:
            currentPlayer.hp = Math.max(0, currentPlayer.hp - Math.max(0, card.damage));
            break;
        case SPECIAL_EFFECT.BOOST_MANA:
            currentPlayer.mana = Math.min(
                currentPlayer.maxmana,
                currentPlayer.mana + Math.max(0, card.damage)
            );
            break;
        case SPECIAL_EFFECT.BOOST_MAX_MANA:
            // A negative value drains the targeted player's max mana (the caster if no player is targeted).
            var maxManaPlayer = card.damage < 0 && targetPlayer && "maxmana" in targetPlayer
                ? targetPlayer
                : currentPlayer;
            maxManaPlayer.maxmana = Math.max(0, maxManaPlayer.maxmana + card.damage);
            maxManaPlayer.mana = Math.min(maxManaPlayer.mana, maxManaPlayer.maxmana);
            break;
        case SPECIAL_EFFECT.CAST_SPELL:
            playSecondSpell(card, currentPlayer);
            break;
    }
}

function playSecondSpell(card, player) {
    if (!card.secondSpell) {
        console.error("Card " + card.name + " uses Cast Spell but has no second spell ID.");
        return;
    }

    var secondCard = masterCardList.find(function (item) {
        return item.id === card.secondSpell;
    });
    if (!secondCard) {
        console.error("Card " + card.name + " references missing second spell " + card.secondSpell + ".");
        return;
    }

    if (!player.human && typeof computerAI !== "undefined" &&
        typeof computerAI.playSecondarySpell === "function") {
        computerAI.playSecondarySpell(secondCard, player);
        return;
    }

    var playerSquare = gameVariables.gameBoard.find(function (square) {
        return square.id == player.sprite.gameSquareId;
    });
    if (!playerSquare) {
        throw new Error("Cannot cast a secondary spell without a valid player square.");
    }
    highlightTargets(secondCard, playerSquare, player.sprite);
    if (targetArray.length === 0) {
        console.error("Secondary spell " + secondCard.name + " has no valid targets.");
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
                board_special_layer.add(special);
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
                board_special_layer.add(special);
            }
            break;
        case "start":
            //Do nothing for now?
            break;
    }
}


function captureSquare(id, owner) {
    owner = owner || gameVariables.gamePlayerArray[gameVariables.currentPlayer];

    //Claim the square color
    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == id;
    });

    for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
        if (gameVariables.gamePlayerArray[i].color == boardSquareDetail.sprite.key) {
            gameVariables.gamePlayerArray[i].capturedSquares--;
        }

    }

    owner.capturedSquares++;

    boardSquareDetail.sprite.loadTexture(owner.color);


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
    resolveCurrentPlayerSquareEffects();
    resolveCurrentPlayerEndTurnEffects();
    advanceToNextPlayer();
}

function resolveCurrentPlayerSquareEffects() {
    var square = gameVariables.gameBoard.find(function (item) {
        return item.id == gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
    });

    //Resolve loot and hazards on the square the player landed on.
    var boardSquareLoot = gameVariables.boardInfo.specialSquares.find(function (element) {
        return element.squareId == gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
    });

    if (typeof boardSquareLoot != 'undefined') {
        processSpecialLoot(boardSquareLoot.type, boardSquareLoot.looted, boardSquareLoot.result, square);
        boardSquareLoot.looted++;
    }
}

function resolveCurrentPlayerEndTurnEffects() {
    gameVariables.gameBoard.forEach(function (boardSquare) {
        if (boardSquare.creature &&
            boardSquare.creature.playerOwnedId == gameVariables.gamePlayerArray[gameVariables.currentPlayer].id &&
            applyCreatureRegen(boardSquare.creature) > 0) {
            updateCreatureHealthBar(boardSquare.creature);
        }
    });
    var square = gameVariables.gameBoard.find(function (item) {
        return item.id == gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId;
    });
    var player = gameVariables.gamePlayerArray[gameVariables.currentPlayer];

    if (square && square.creature != null) {
        if (square.creature.playerOwnedId != player.id) {
            player.hp = player.hp - Math.max((square.creature.attack - player.armor), 0);
        }
    }
}

function advanceToNextPlayer() {
    var players = gameVariables.gamePlayerArray;
    var currentPlayer = gameVariables.currentPlayer;

    for (var offset = 1; offset <= players.length; offset++) {
        var nextPlayer = (currentPlayer + offset) % players.length;
        if (players[nextPlayer].hp > 0) {
            gameVariables.currentPlayer = nextPlayer;
            break;
        }
    }

    updatePlayerStatusPanels();

    computerMoving = false;
}

function getBattleOutcome() {
    var players = gameVariables.gamePlayerArray;
    var humanPlayer = players[0];

    if (humanPlayer.hp <= 0) {
        return {
            humanWon: false,
            message: "You have been eliminated."
        };
    }

    var captureRequirement = gameVariables.boardInfo.captureRequirement;
    if (captureRequirement > 0) {
        var captureWinner = players.find(function (player) {
            return player.hp > 0 && player.capturedSquares >= captureRequirement;
        });

        if (captureWinner) {
            return {
                humanWon: captureWinner === humanPlayer,
                message: captureWinner.name + " captured enough squares to win."
            };
        }
    }

    var livingPlayers = players.filter(function (player) {
        return player.hp > 0;
    });

    if (livingPlayers.length === 1) {
        return {
            humanWon: livingPlayers[0] === humanPlayer,
            message: livingPlayers[0].name + " is the last player standing."
        };
    }

    return null;
}

function endBattle(outcome) {
    gameVariables.gamePlayerArray.forEach(function (player, index) {
        if (index === 0 && outcome.humanWon && player.hp > 0) {
            var awardedGold = awardBattleGold(player);
            if (awardedGold > 0) {
                outcome.message += " You gain " + awardedGold + " gold.";
            }
        } else {
            forfeitBattleGold(player);
        }
    });
    battleEnded = true;
    computerMoving = false;
    playerDirChoiceMenu = false;
    playerChoiceMenu = false;
    playerSpellTargeting = false;
    multipleTargetsMenu = false;
    playerCrossStartMenu = false;
    playerDiscardMenu = false;
    playerDiscardWaiting = false;
    playerDuplicateWaiting = false;
    playerNotificationMenu = false;
    playerDestinations.length = 0;
    targetArray.length = 0;
    multipleTargetsArray.length = 0;

    var blocker = game.add.tileSprite(0, 0, game.width, game.height, 'dirt');
    blocker.alpha = 0.7;
    blocker.inputEnabled = true;
    game.world.bringToTop(blocker);

    pop_layer.children.forEach(function (child) {
        child.visible = false;
    });

    menu.events.onInputUp.removeAll();
    menu.inputEnabled = false;
    menu.visible = true;
    qText.setText(outcome.humanWon ? "Victory!" : "Battle lost");
    qText.visible = true;
    game.world.bringToTop(pop_layer);

    var resultText = game.add.text(game.width / 2, (game.height / 2) + 8, outcome.message, {
        font: "bold 18px Arial",
        fill: "#000000",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 360
    });
    resultText.anchor.setTo(0.5);

    var continueText = game.add.text(game.width / 2, (game.height / 2) + 72, "Continue", {
        font: "bold 18px Arial",
        fill: "#000000",
        align: "center"
    });
    continueText.anchor.setTo(0.5);
    continueText.inputEnabled = true;
    continueText.events.onInputUp.add(function () {
        game.state.start("maptext");
    }, this);
    game.world.bringToTop(resultText);
    game.world.bringToTop(continueText);
}


function diceRoll(item) {

    //Create random number between 1-6
    var roll = applyMovementPenalty(
        gameVariables.gamePlayerArray[gameVariables.currentPlayer],
        1 + Math.floor(Math.random() * 6)
    );

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

            var AIchoice = computerAI.choosePath(nextPathIdArray);
            nextPathIdArray[0] = AIchoice;
        }

        var gameBoardDestResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == nextPathIdArray[0];
        });

        if (playerSprite.gameSquareId === gameVariables.boardInfo.boardEnd &&
            nextPathIdArray[0] === gameVariables.boardInfo.boardStart) {
            playerCrossStart = true;
            grantStartMana(gameVariables.gamePlayerArray[gameVariables.currentPlayer]);
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

            var AIchoice = computerAI.choosePath(nextPathIdArray);
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


var squareDetailPanel = null;

var specialEffectNames = SPECIAL_EFFECT_NAMES;

function buildSquareDetailText(squareId) {
    var square = gameVariables.gameBoard.find(function (s) {
        return s.id == squareId;
    });
    if (!square) {
        return "";
    }

    var players = gameVariables.gamePlayerArray;
    var lines = ["Square " + squareId];

    var owner = players.find(function (p) {
        return p.color == square.sprite.key;
    });
    lines.push("Owner: " + (owner ? owner.name : "None"));

    var onSquare = players.filter(function (p) {
        return p.sprite && p.sprite.gameSquareId == squareId;
    });
    lines.push("Players: " + (onSquare.length ?
        onSquare.map(function (p) { return p.name + " (HP " + p.hp + "/" + p.maxhp + ")"; }).join(", ") : "None"));

    var creature = square.creature;
    if (creature) {
        var card = masterCardList.find(function (c) {
            return c.id == creature.cardId;
        });
        var creatureOwner = players.find(function (p) {
            return p.id == creature.playerOwnedId;
        });
        var effects = [];
        if (card) {
            if (card.special && specialEffectNames[card.special]) {
                effects.push(specialEffectNames[card.special]);
            }
            if (card.desc) {
                effects.push(card.desc);
            }
        }
        lines.push("Creatures: " + (card ? card.name : "Unknown"));
        lines.push("  Owner: " + (creatureOwner ? creatureOwner.name : "None"));
        lines.push("  HP: " + creature.hitpoints + "/" + creature.maxhitpoints);
        lines.push("  Attack: " + creature.attack + "  Armor: " + creature.armor);
        lines.push("  Effects: " + (effects.length ? effects.join("; ") : "None"));
    } else {
        lines.push("Creatures: None");
    }

    return lines.join("\n");
}

function showSquareDetails(item) {
    hideSquareDetails();

    var text = game.add.text(0, 0, buildSquareDetailText(item.gameSquareId),
        { font: "bold 13px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 260 });
    var pad = 6;
    var bg = game.add.sprite(0, 0, 'bpix');
    bg.alpha = 0.85;
    bg.width = text.width + pad * 2;
    bg.height = text.height + pad * 2;

    var x = Math.min(item.x + 30, game.width - bg.width - 4);
    var y = Math.min(Math.max(item.y - bg.height / 2, 4), game.height - bg.height - 4);
    bg.x = x;
    bg.y = y;
    text.x = x + pad;
    text.y = y + pad;

    pop_layer.add(bg);
    pop_layer.add(text);
    squareDetailPanel = { bg: bg, text: text };
}

function hideSquareDetails() {
    if (squareDetailPanel) {
        squareDetailPanel.bg.destroy();
        squareDetailPanel.text.destroy();
        squareDetailPanel = null;
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