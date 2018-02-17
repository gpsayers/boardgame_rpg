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
    computerMoved = false,
    computerMoving = false,
    computerActing = false,
    playerCrossStart = false,
    playerCrossStartMenu = false,
    playerDiscardMenu = false,
    playerDiscardWaiting = false,
    playerManaNotificationMenu = false,
    playerSpellTargeting = false,
    multipleTargetsMenu  = false,
    targetArray = [],
    multipleTargetsArray = [];


gameMain.prototype = {
    preload: function () {

        //Temp assign of player deck to static array
        gameVariables.playerDeck = testPlayerCardList;

        if (gameVariables.currentBoard == "board1") {
            gameVariables.boardInfo = board1;
        }
        
        gameVariables.gamePlayerArray.push(new gamePlayer(99,
            gameVariables.boardInfo.boardStart,
            gameVariables.playerName,
            gameVariables.playerClass,
            gameVariables.playerColor,
            gameVariables.hitpoints,
            gameVariables.playerStartingMana,
            true,
            shuffle(gameVariables.playerDeck),
            gameVariables.playerMaxHand));

        gameVariables.currentPlayer = 0;

        //Find AI players that don't match human players class or color
        var aiPlayers = gameVariables.boardInfo.computerPlayers.filter(function(gp) {
            return gp.class != gameVariables.playerClass && gp.color != gameVariables.playerColor;
        });

        aiPlayers.forEach(function(item) {
            gameVariables.gamePlayerArray.push(item);
        });
        

        //background image
        game.load.image('dirt', 'Assets/dirt4.png');

        //board squares
        game.load.image('red', 'Assets/fire.png');
        game.load.image('blue', 'Assets/ice.png');
        game.load.image('neutral', 'Assets/summoning.png');
        game.load.image('yellow', 'Assets/divination.png');
        game.load.image('purple', 'Assets/necromancy.png');
        game.load.image('green', 'Assets/green.png');

        //board elements
        game.load.image('chest', 'Assets/BoardElements/chest_2_closed.png');
        game.load.image('bluefountain', 'Assets/BoardElements/blue_fountain.png');
        game.load.image('trap', 'Assets/BoardElements/trap_blade.png');
        game.load.image('door', 'Assets/BoardElements/open_door.png');
        game.load.image('gpix', 'Assets/GUI/greenPixel.png');
        game.load.image('rpix', 'Assets/GUI/redPixel.png');

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


        //GUI and buttons
        game.load.image('menu', 'Assets/GUI/Menu.png');
        game.load.image('menu2', 'Assets/GUI/Menu_2.png');
        game.load.image('cursor', 'Assets/GUI/cursor.png');
        game.load.image('target', 'Assets/GUI/silenced.png');
        game.load.spritesheet('diceButton', 'Assets/GUI/diceButtonsSpritesheet.png', 404, 177);
        game.load.spritesheet('leftButton', 'Assets/GUI/leftButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('upButton', 'Assets/GUI/upButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('rightButton', 'Assets/GUI/rightButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('downButton', 'Assets/GUI/downButtonSpritesheet.png', 221, 229);
        game.load.image('turnArrow', 'Assets/GUI/arrow.png');
        game.load.image('turnSprite', 'Assets/GUI/paper-button-off.png');
        game.load.image('dialog', 'Assets/GUI/paper-dialog.png');
        game.load.image('dialogorange', 'Assets/GUI/dialog.png');
        game.load.image('dialogblue', 'Assets/GUI/dialog-box.png');
        game.load.image('mana', 'Assets/GUI/mana_orb.png');
        game.load.image('mana_empty', 'Assets/GUI/mana_orb_empty.png');
        game.load.image('gold', 'Assets/GUI/gold_pile.png');

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
        //var turnArea = game.add.sprite(game.width - 50, game.height - 278, 'dialog');
        //turnArea.width = 250;
        //turnArea.height = game.height-318;
        //turnArea.anchor.x = 1;
        //turnArea.anchor.y = 1;
        //back_layer.add(turnArea);
        var infoArea = game.add.sprite(game.width - 310, game.height - 278, 'dialog');
        infoArea.width = 250;
        infoArea.height = game.height - 318;
        infoArea.anchor.x = 1;
        infoArea.anchor.y = 1;
        back_layer.add(infoArea);

        var pbs = game.add.sprite(game.width - 535, game.height - 258, gameVariables.playerColor);
        var pb = game.add.sprite(game.width - 535, game.height - 258, gameVariables.playerImg);
        pbs.width = 35;
        pbs.height = 35;
        back_layer.add(pbs);
        back_layer.add(pb);
        var ptxt = game.add.text(game.width - 495, game.height - 255, gameVariables.playerName, style);
        var drawtext = game.add.text(game.width - 535, game.height - 90, "End Turn", style);
        drawtext.inputEnabled = true;
        drawtext.events.onInputUp.add(endPlayerTurn, this);
        drawtext.visible = true;
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
        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == gameVariables.boardInfo.boardStart;
        });

        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
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
            var txt = game.add.text(45, 15, gameVariables.gamePlayerArray[i].name, style);
            gameVariables.gamePlayerArray[i].turnSprite.addChild(txt);
            back_layer.add(gameVariables.gamePlayerArray[i].turnSprite);         

        }

        //Game info text and GUI
        var infoText = game.add.text(game.width - 450, 60, "Info", style);
        back_layer.add(infoText);
        playerSquareCount = {};
        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
            playerSquareCount[i] = game.add.text(game.width - 60, (50 * i) + 65, "25%", style);
            playerSquareCount[i].anchor.setTo(1, 0);
            back_layer.add(playerSquareCount[i]);
           
        }
        gameVariables.gamePlayerArray[0].manasprite = game.add.sprite(game.width - 535, game.height - 208, 'mana');
        gameVariables.gamePlayerArray[0].manasprite.width = 20;
        gameVariables.gamePlayerArray[0].manasprite.height = 20;
        goldText = game.add.text(game.width - 60, game.height - 250, gameVariables.playerGold, style);
        goldText.anchor.setTo(1, 0);
        goldIcon = game.add.sprite(game.width - 60 - goldText.width, game.height - 258, 'gold');
        goldIcon.anchor.setTo(1, 0);
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
        makeInfoInvis(false);

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
        button = game.add.button(game.width - 170, game.height - 110, 'diceButton', diceRollButtonClick, this, null, null, 4, 2);
        button.frame = 1;
        button.width = 100;
        button.height = 44;

        //Add cards to the players hands
        for (i = 0; i < gameVariables.playerMaxHand; i++) {
            var card = gameVariables.gamePlayerArray[0].deck.pop();
            gameVariables.gamePlayerArray[0].handTracker.push(new playerHandTracker(card.id, card, 0, 0));
            gameVariables.gamePlayerArray[0].hand.push(card);
        }
        createPlayerHand();
        for (i = 1; i < gameVariables.gamePlayerArray.length; i++) {
            gameVariables.gamePlayerArray[i].deck = shuffle(gameVariables.gamePlayerArray[i].deck);
            for (x = 0; x < 4; x++) {
                var card = gameVariables.gamePlayerArray[i].deck.pop();
                gameVariables.gamePlayerArray[i].hand.push(card);
            }
            
        }

        //Confirmation menu
        var style = { font: "bold 15px Arial", fill: "#000000", align: "center" };
        menu = game.add.sprite(game.width / 2, game.height / 2, 'menu2');
        menu.anchor.x = 0.5;
        menu.anchor.y = 0.5;
        menu.visible = false;
        menu.inputEnabled = true;
        menu.events.onInputUp.add(menuClick, this);
        qText = game.add.text((game.width / 2), (game.height / 2) - 20, "Would you like to cast this spell?", style);
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
        upButt = game.add.button((game.width / 2 - 21), (game.height / 2) + 10, 'upButton', dirButtonClick, this, 1, 1, 2, 1);
        upButt.width = 40;
        upButt.height = 40;
        upButt.direction = "up";
        upButt.visible = false;      
        rightButt = game.add.button((game.width / 2 + 25), (game.height / 2) + 10, 'rightButton', dirButtonClick, this, 1, 1, 2, 1);
        rightButt.width = 40;
        rightButt.height = 40;
        rightButt.direction = "right";
        rightButt.visible = false;
        pop_layer.add(menu);
        pop_layer.add(yesText);
        pop_layer.add(noText);
        pop_layer.add(qText);
        pop_layer.add(leftButt);
        pop_layer.add(upButt);
        pop_layer.add(rightButt);
        pop_layer.add(manaText);
        pop_layer.add(cardText);
        pop_layer.add(healthText);
        pop_layer.add(goldText);

    },
    update: function () {

        //Update player square capture percentage
        for (i = 0; i < gameVariables.gamePlayerArray.length; i++) {
            var calc = Math.round((gameVariables.gamePlayerArray[i].capturedSquares / gameVariables.boardInfo.boardTotal) * 100);
            playerSquareCount[i].setText(calc + '%');
            
        }
        
        //UPdate player mana nodes
        gameVariables.gamePlayerArray[0].manasprite.destroy();
        gameVariables.gamePlayerArray[0].manasprite = game.add.sprite(game.width - 535, game.height - 208, 'mana');
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


        //Determine player turn
        if (gameVariables.currentPlayer == 0) {
            //Human player turn
            if (playerNotified == false) {
                //Display player turn notification
                playerNotificationMenu = true;

                menu.visible = true;
                qText.setText("Your turn!");
                qText.visible = true;

                game.world.bringToTop(player_layer);

                gameVariables.gamePlayerArray[gameVariables.currentPlayer].mana = gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana;

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
                else if (gameVariables.gamePlayerArray[gameVariables.currentPlayer].maxmana < 6) {
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

                    //Draw Card
                    computerDrawCard(gameVariables.currentPlayer);

                    //Play a random spell
                    var randCard = gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.splice(Math.floor(Math.random() * gameVariables.gamePlayerArray[gameVariables.currentPlayer].hand.length), 1);

                    castSpell(randCard[0].id, gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite);

                    gameVariables.gamePlayerArray[gameVariables.currentPlayer].discard.push(randCard[0]);

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

                console.log(multipleTargetsArray.image);

                var cur = game.add.sprite((game.width/2)+(i * 50), game.height/2, multipleTargetsArray[i].image);
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

            var result = gameVariables.boardInfo.choiceSquares.find(function (element) {
                return element.id == activePlayerSquare;
            });

            menu.visible = true;
            qText.setText("Please choose direction.");
            qText.visible = true;

            if (result.left > 0) {
                leftButt.visible = true;
                leftButt.choice = result.left;
            }
            if (result.up > 0) {
                upButt.visible = true;
                upButt.choice = result.up;
            }
            if (result.right > 0) {
                rightButt.visible = true;
                rightButt.choice = result.right;
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
    gameVariables.gamePlayerArray[0].handTracker[i].text2 = game.add.text(110 * i + 115, game.height - 75, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.attack + "/" + gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.defense, { font: "bold 15px Arial" });


    //Add card mana
    for (m = 0; m < gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.cost; m++) {
        var manacost = game.add.sprite(5, -51 + (m * 4), 'mana');
        manacost.height = 3;
        manacost.width = 3;
        gameVariables.gamePlayerArray[0].handTracker[i].spritefront.addChild(manacost);
    }


    gameVariables.gamePlayerArray[0].handTracker[i].group = game.add.group();

    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spritefront);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spriteborder);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].spriteimage);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].text1);
    gameVariables.gamePlayerArray[0].handTracker[i].group.add(gameVariables.gamePlayerArray[0].handTracker[i].text2);

       

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

    for (i = 0; i < gameVariables.boardInfo.specialSquares.length; i++) {    

        if (gameVariables.boardInfo.specialSquares[i].squareId == squareId) {

            gs.special = gameVariables.boardInfo.specialSquares[i];
            var special = game.add.sprite(x, y, gameVariables.boardInfo.specialSquares[i].type);
            special.anchor.x = 0.5;
            special.anchor.y = 0.5;
            gs.special.specialSprite = special;
            board_layer.add(special);
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



    } else if (cardDetails.special == 0) {
        //Damage effect
        //Determine target
        highlightTargets(cardDetails, boardSquareDetail, player);
    } else {
        //Special effect
        
    }
        


    //Discard spell that was cast
    if (gameVariables.currentPlayer == 0) {

        for (i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
            if (gameVariables.gamePlayerArray[0].handTracker[i].id == id) {
                removeCardFromHandTracker(i);
                break;
            }
        }

        for (m = 0; m < gameVariables.gamePlayerArray[0].hand.length; m++) {
            if (gameVariables.gamePlayerArray[0].hand[m].id == id) {
                //Add card to discard
                gameVariables.gamePlayerArray[0].discard.push(gameVariables.gamePlayerArray[0].hand[m]);

                //Remove card from hand
                gameVariables.gamePlayerArray[0].hand.splice(m, 1);

                break;
            }
        }

    }


}


function highlightTargets(cardDetails, boardSquareDetail, player) {
    playerSpellTargeting = true;
    targetArray.length = 0;

    console.log(cardDetails);

    var location = cardDetails.targetlocation;
    var type = cardDetails.targettype;

    if (location == "square") {
        targetArray.push({ x: boardSquareDetail.sprite.x, y: boardSquareDetail.sprite.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: boardSquareDetail, player: player });
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
                targetArray.push({ x: gbr.x, y: gbr.y, sprite: {}, card: cardDetails, originSquare: boardSquareDetail, targetSquare: neighborSquare, player: player });
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

    if (card.spell == true) {

        //Check for multiple targets
        var result = targetArray.filter(function (item) {
            return item.targetSquare == targetArrayItem.targetSquare
        });

        if (result.length > 1) {
            
            for (i = 0; i < result.length; i++) {
                console.log(result[i].model.class);
                if (result[i].type == "creature") {
                    multipleTargetsArray.push({ sprite: {}, image: result[i].model.creature.sprite.key });
                }
                else {
                    multipleTargetsArray.push({ sprite: {}, image: result[i].model.class });
                }
            }


            console.log(multipleTargetsArray);

            multipleTargetsMenu = true;
        }
        else {
            //Act on the target
        }


        //if (card.targettype == "creature") {
            
        //}

        //if (card.targettype == "player") {
            
        //}



        //if (card.special == 0) {

        //}
        //else {
        //    //Special effect with targets
        //}

    }


    if (targetArray[target.targetArrayIndex].card.creature == true) {
        playCreatureOnSquare(boardSquareDetail, targetArrayItem.card, targetArrayItem.player);
    }

}

function targetMenuClicked(item) {
    console.log(item);
}

function damageCreatureOnSquare(boardSquareDetail, cardDetails, player) {
    boardSquareDetail.creature.hitpoints = (boardSquareDetail.creature.hitpoints -
        Math.max((cardDetails.damage - boardSquareDetail.creature.armor), 0));

    if (boardSquareDetail.creature.hitpoints < 1) {
        //defender dead
        boardCreature.sprite.destroy();
        boardCreature.hitspritegreen.destroy();
        boardCreature.hitspritered.destroy();
        boardSquareDetail.creature = null;
    } else {
        //Defender takes damage but lives.
        var test = (boardSquareDetail.creature.hitpoints / boardSquareDetail.creature.maxhitpoints) * 100;
        var newtest = Math.ceil(test / 20) * 20;

        boardSquareDetail.creature.hitspritered.width = newtest * .1;
    }
}


function damagePlayerOnSquare(boardSquareDetail, cardDetails, player) {
    
}


function playCreatureOnSquare(boardSquareDetail, cardDetails, player) {  

    //Check if square already has a creature
    if (boardSquareDetail.creature != null) {

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
                    0,
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

                var test = (attackerHP / cardDetails.defense) * 100;
                var newtest = Math.ceil(test / 20) * 20;

                var creatureHitpointsG = game.add.sprite(boardSquareDetail.sprite.x - 10,
                    boardSquareDetail.sprite.y + 17,
                    'gpix');
                creatureHitpointsG.width = 20;
                creatureHitpointsG.height = 3;
                var creatureHitpointsR = game.add.sprite(boardSquareDetail.sprite.x - 10,
                    boardSquareDetail.sprite.y + 17,
                    'rpix');
                creatureHitpointsR.width = newtest * .1;
                creatureHitpointsR.height = 3;

                boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
                boardSquareDetail.creature.hitspritered = creatureHitpointsR;

                captureSquare(player.gameSquareId);
            }


        } else {
            //Defender takes damage but lives. Attacker is discarded
            var test = (defHp / boardCreature.maxhitpoints) * 100;
            var newtest = Math.ceil(test / 20) * 20;

            boardSquareDetail.creature.hitspritered.width = newtest * .1;

        }


    } else {
        //Square is empty place creature and capture
        boardSquareDetail.creature = new gameSquareCreature(cardDetails.id,
            boardSquareDetail.id,
            null,
            cardDetails.defense,
            cardDetails.defense,
            0,
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

        boardSquareDetail.creature.hitspritegreen = creatureHitpointsG;
        boardSquareDetail.creature.hitspritered = creatureHitpointsR;

        captureSquare(boardSquareDetail.id);
    }

}


function captureSquare(id) {
    //Check for loot on the square




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

    if (playerDiscardWaiting == true) {
        playerDiscardMenu = true;
        return;
    }

    if (gameVariables.gamePlayerArray[0].hand.length > gameVariables.gamePlayerArray[0].maxhand) {
        playerDiscardMenu = true;
    }
    else {
        playerNotified = false;
        endCurrentPlayerTurn();
    }



}


function endCurrentPlayerTurn() {
    gameVariables.currentPlayer++;

    if (gameVariables.currentPlayer > gameVariables.gamePlayerArray.length - 1) {
        gameVariables.currentPlayer = 0;
    }

    var tween = game.add.tween(turnArrow).to({ x: game.width - 280, y: (50 * gameVariables.currentPlayer) + 60 }, 500, Phaser.Easing.Linear.None, true);

    //turnArrow.x = game.width - 280;
    //turnArrow.y = (50 * gameVariables.currentPlayer) + 60;

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

    var gameBoardResult = gameVariables.gameBoard.find(function (element) {
        return element.sprite.gameSquareId == item.choice;
    });

    var tween = game.add.tween(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite).to({ x: gameBoardResult.sprite.x, y: gameBoardResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

    //Callback to complete the rest of the roll
    tween.onComplete.add(function () {
        gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId = item.choice;
        playerDestinations.length = 0;
        playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, playerRoll - 1);
    }, this);

}


function playerMove(playerSprite, roll) {

    //Change roll button to "locked" frame
    button.frame = 2;

    playerRoll = roll;

    var nextPathIdArray = [];

    if (roll > 0) {
        var gameBoardResult = gameVariables.gameBoard.find(function (element) {
            return element.sprite.gameSquareId == playerSprite.gameSquareId
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

                return element > playerSprite.gameSquareId
            });

            nextPathIdArray = boardPathId;
        }

        if (nextPathIdArray.length > 1) {
            //If player has multiple choices start player choice menu and return.
            playerDirChoiceMenu = true;
            activePlayerSquare = playerSprite.gameSquareId;
            return;
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
    else {
        //Player movement done.
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
        gameVariables.gamePlayerArray[currentPlayer].deck = shuffle(gameVariables.gamePlayerArray[currentPlayer].discard);
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
    else {
        var find = gameVariables.gamePlayerArray.filter(function (player) {
            return player.sprite.gameSquareId == item.gameSquareId;
        });

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