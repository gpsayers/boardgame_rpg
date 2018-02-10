var gameMain = function () { };


var playerDestinations = [];
var playerDirChoiceMenu = false;
var playerChoiceMenu = false;
var playerRoll = 0;
var activePlayerSquare = 0;
var addCardHand = false;



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
            gameVariables.playerMana,
            true,
            shuffle(gameVariables.playerDeck)));

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
        game.load.image('red', 'Assets/red.png');
        game.load.image('blue', 'Assets/blue.png');
        game.load.image('neutral', 'Assets/neutral.png');
        game.load.image('yellow', 'Assets/yellow.png');
        game.load.image('purple', 'Assets/purple.png');
        game.load.image('green', 'Assets/green.png');

        //board elements
        game.load.image('chest', 'Assets/BoardElements/chest_2_closed.png');
        game.load.image('bluefountain', 'Assets/BoardElements/blue_fountain.png');
        game.load.image('trap', 'Assets/BoardElements/trap_blade.png');
        game.load.image('door', 'Assets/BoardElements/open_door.png');
        game.load.image('gpix', 'Assets/GUI/greenPixel.png');

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

        //GUI and buttons
        game.load.image('menu', 'Assets/GUI/Menu.png');
        game.load.image('menu2', 'Assets/GUI/Menu_2.png');
        game.load.image('cursor', 'Assets/GUI/cursor.png');
        game.load.spritesheet('diceButton', 'Assets/GUI/diceButtonsSpritesheet.png', 404, 177);
        game.load.spritesheet('leftButton', 'Assets/GUI/leftButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('upButton', 'Assets/GUI/upButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('rightButton', 'Assets/GUI/rightButtonSpritesheet.png', 221, 229);
        game.load.spritesheet('downButton', 'Assets/GUI/downButtonSpritesheet.png', 221, 229);
        game.load.image('dialog', 'Assets/GUI/paper-dialog.png');

    },
    create: function () {

        //Default text style
        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };

        //Create layers for sprite z levels
        back_layer = game.add.group();
        board_layer = game.add.group();
        player_layer = game.add.group();
        player_layer2 = game.add.group();
        player_layer3 = game.add.group();
        pop_layer = game.add.group();

        //Build the background
        var tile = game.add.tileSprite(0, 0, game.width, game.height, 'dirt');
        back_layer.add(tile);
        var playerArea = game.add.sprite(game.width - 50, game.height - 50, 'dialog');
        playerArea.width = 400;
        playerArea.height = 218;
        playerArea.anchor.x = 1;
        playerArea.anchor.y = 1;
        back_layer.add(playerArea);
        var pbs = game.add.sprite(game.width - 435, game.height - 258, gameVariables.playerColor);
        var pb = game.add.sprite(game.width - 435, game.height - 258, gameVariables.playerImg);
        pbs.width = 35;
        pbs.height = 35;
        var ptxt = game.add.text(game.width - 395, game.height - 255, gameVariables.playerName, style);
        var drawtext = game.add.text(game.width - 435, game.height - 110, "Draw Card", style);
        drawtext.inputEnabled = true;
        drawtext.events.onInputUp.add(drawCard, this);
        drawtext.visible = true;

        //Build the game board
        for (y = 0; y < gameVariables.boardInfo.squares.length; y++) {
            var row = gameVariables.boardInfo.squares[y];
            for (x = 0; x < row.length; x++) {
                if (row[x] > 0) {
                    addGameSquare("neutral", (50 * x) + 75, (50 * y) + 50, row[x], x, y);
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
            gameVariables.gamePlayerArray[i].sprite.width = 45;
            gameVariables.gamePlayerArray[i].sprite.anchor.x = 0.5;
            gameVariables.gamePlayerArray[i].sprite.anchor.y = 0.5;
            gameVariables.gamePlayerArray[i].sprite.x = gameBoardResult.x;
            gameVariables.gamePlayerArray[i].sprite.y = gameBoardResult.y;
            gameVariables.gamePlayerArray[i].sprite.gameSquareId = gameBoardResult.id;
            if (i == 0) {
                player_layer.add(gameVariables.gamePlayerArray[i].sprite);
            }
            else {
                player_layer2.add(gameVariables.gamePlayerArray[i].sprite);
            }

        }
        
        //Add cursors for movement and targeting
        cursor1 = game.add.sprite(1, 1, 'cursor');
        cursor1.anchor.x = 0.5;
        cursor1.anchor.y = 0.5;
        cursor1.visible = false;
        board_layer.add(cursor1);
        cursor2 = game.add.sprite(1, 1, 'cursor');
        cursor2.anchor.x = 0.5;
        cursor2.anchor.y = 0.5;
        cursor2.visible = false;
        board_layer.add(cursor2);

        //Add dice roll sprites
        dice = game.add.sprite(game.width - 125, game.height - 150, '1');
        dice.width = 40;
        dice.height = 40;
        button = game.add.button(game.width - 170, game.height - 110, 'diceButton', diceRollButtonClick, this, 1, 1, 4, 1);
        button.width = 100;
        button.height = 44;

        //Display the player cards
        for (i = 0; i < gameVariables.playerMaxHand; i++) {
            var card = gameVariables.gamePlayerArray[0].deck.pop();
            gameVariables.gamePlayerArray[0].handTracker.push(new playerHandTracker(card.id, card, 0, 0));
            gameVariables.gamePlayerArray[0].hand.push(card);
        }
        createPlayerHand();

        //Confirmation menu
        var style = { font: "bold 15px Arial", fill: "#000000", align: "center" };
        menu = game.add.sprite(game.width / 2, game.height / 2, 'menu2');
        menu.anchor.x = 0.5;
        menu.anchor.y = 0.5;
        menu.visible = false;
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

    },
    update: function () {

        if (addCardHand == true) {



            addCardHand = false;
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

        //Display player direction choice menu
        if (playerDirChoiceMenu == true) {

            var result = gameVariables.boardInfo.choiceSquares.find(function (element) {
                return element.id == activePlayerSquare
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

        //Display the player cards
        for (var i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {

            //Add card front
            var tween1 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spritefront).to({ x: 110 * i + 100, y: game.height - 100},200,Phaser.Easing.Linear.None, false);
            var tween2 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spriteborder).to({ x: 110 * i + 100, y: game.height - 100 }, 200, Phaser.Easing.Linear.None, false);
            var tween3 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].spriteimage).to({ x: 110 * i + 100, y: game.height - 110 }, 200, Phaser.Easing.Linear.None, false);
            var tween4 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].text1).to({ x: 110 * i + 100, y: game.height - 150 }, 200, Phaser.Easing.Linear.None, false);
            var tween5 = game.add.tween(gameVariables.gamePlayerArray[0].handTracker[i].text2).to({ x: 110 * i + 110, y: game.height - 60 }, 200, Phaser.Easing.Linear.None, false);
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
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront = game.add.sprite(110 * i + 100, game.height - 100, 'cardFront');
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.width = 100;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.height = 140;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.anchor.x = 0.5;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.anchor.y = 0.5;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.cardId = gameVariables.gamePlayerArray[0].handTracker[i].id;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.inputEnabled = true;
    gameVariables.gamePlayerArray[0].handTracker[i].spritefront.events.onInputDown.add(cardClick, this);

    //Add card border
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder = game.add.sprite(110 * i + 100, game.height - 100, 'redFrame');
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.width = 100;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.height = 140;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.anchor.x = 0.5;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.anchor.y = 0.5;

    //Add card sprite picture
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage = game.add.sprite(110 * i + 100, game.height - 110, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.image);
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.width = 70;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.height = 70;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.anchor.x = 0.5;
    gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.anchor.y = 0.5;

    //Add card text
    var style = { font: "bold 10px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: gameVariables.gamePlayerArray[0].handTracker[i].spritefront.width, align: "center" };
    gameVariables.gamePlayerArray[0].handTracker[i].text1 = game.add.text(110 * i + 100, game.height - 150, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.name, style);
    gameVariables.gamePlayerArray[0].handTracker[i].text1.anchor.set(0.5);
    gameVariables.gamePlayerArray[0].handTracker[i].text2 = game.add.text(110 * i + 110, game.height - 60, gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.attack + "/" + gameVariables.gamePlayerArray[0].handTracker[i].cardInfo.defense, { font: "15px bold Arial" });


}


function drawCard() {
    console.log(gameVariables.gamePlayerArray[0].hand);

    if (gameVariables.gamePlayerArray[0].deck.length < 1) {
        gameVariables.gamePlayerArray[0].deck = shuffle(gameVariables.gamePlayerArray[gameVariables.currentPlayer].discard);
    }

    var card = gameVariables.gamePlayerArray[0].deck.pop();

    if (typeof card !== 'undefined') {
        gameVariables.gamePlayerArray[0].handTracker.push(new playerHandTracker(card.id, card, 0, 0));
        gameVariables.gamePlayerArray[0].hand.push(card);
    }

    addCardToHand(gameVariables.gamePlayerArray[0].handTracker.length-1);

    //clearPlayerHand();

    //createPlayerHand();
}


function clearPlayerHand() {
    for (var i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
        removeCardFromHand(gameVariables.gamePlayerArray[0].handTracker[i].id);
    }   
}


function removeCardFromHand(id) {

    for (i = 0; i < gameVariables.gamePlayerArray[0].handTracker.length; i++) {
        if (gameVariables.gamePlayerArray[0].handTracker[i].id == id) {

            //Destroy sprites in handtracker
            gameVariables.gamePlayerArray[0].handTracker[i].spritefront.destroy();
            gameVariables.gamePlayerArray[0].handTracker[i].spriteborder.destroy();
            gameVariables.gamePlayerArray[0].handTracker[i].spriteimage.destroy();
            gameVariables.gamePlayerArray[0].handTracker[i].text1.destroy();
            gameVariables.gamePlayerArray[0].handTracker[i].text2.destroy();

            //Remove card from hand tracker
            gameVariables.gamePlayerArray[0].handTracker.splice(i, 1);

            var index = gameVariables.gamePlayerArray[0].hand.findIndex(x => x.id == id);

            //Add card to discard
            gameVariables.gamePlayerArray[0].discard.push(gameVariables.gamePlayerArray[0].hand[index]);

            //Remove card from hand
            gameVariables.gamePlayerArray[0].hand.splice(index, 1);

        }

    }
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
    //sprite.events.onInputDown.add(listener, this);
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
    playerChoiceMenu = true;
    cardClicked = item.cardId;

}


function castSpell(id, player) {
    var cardDetails = masterCardList.find(function(card) {
        return card.id == id;
    });

    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == player.gameSquareId;
    });

    //Check if basic summon creature spell to current player location
    if (cardDetails.creature == true && cardDetails.spell == false) {
        
        //Check if square already has a creature
        var boardCreature = boardSquareDetail.creature || false;
        if (boardCreature != false) {
            //Creature already exists!
            //Super awesome creature combat


        } else {
            //Square is empty place creature and capture
            boardSquareDetail.creature = new gameSquareCreature(cardDetails.id, boardSquareDetail.id, null, cardDetails.defense, 0, cardDetails.attack, cardDetails.defense);
            var creatureSprite = game.add.sprite(boardSquareDetail.sprite.x, boardSquareDetail.sprite.y, cardDetails.image);
            creatureSprite.width = 45;
            creatureSprite.height = 45;
            creatureSprite.anchor.x = 0.5;
            creatureSprite.anchor.y = 0.5;
            board_layer.add(creatureSprite);
            boardSquareDetail.creature.sprite = creatureSprite;

            var creatureHitpoints = game.add.sprite(boardSquareDetail.sprite.x-10, boardSquareDetail.sprite.y + 17, 'gpix');
            creatureHitpoints.width = 20;
            creatureHitpoints.height = 3;

            removeCardFromHand(id);

            captureSquare(player.gameSquareId);
        }



    }


}


function captureSquare(id) {
    //Check for loot on the square


    //Claim the square color
    var boardSquareDetail = gameVariables.gameBoard.find(function (item) {
        return item.id == id;
    });

    boardSquareDetail.sprite.loadTexture(gameVariables.playerColor);
}


function menuConfirmClick(item) {

    if (item.choice == "yes") {
        playerChoiceMenu = false;
        castSpell(cardClicked, gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite);
    }

    playerChoiceMenu = false;
    menu.visible = false;
    qText.visible = false;
    yesText.visible = false;
    noText.visible = false;

}


//function listener(item) {
    
//    var gameBoardResult = gameBoard.find(function (element) {
//        return element.sprite.gameSquareId == item.gameSquareId
//    })

//    player.visible = true;
//    player.x = item.x;
//    player.y = item.y;
//}

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
        return element.sprite.gameSquareId == item.choice
    });
    gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite
    var tween = game.add.tween(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite).to({ x: gameBoardResult.sprite.x, y: gameBoardResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

    //Callback to complete the rest of the roll
    tween.onComplete.add(function () {
        gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite.gameSquareId = item.choice;
        playerDestinations.length = 0;

        playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, playerRoll - 1);
    }, this);

}


function playerMove(playerSprite, roll) {

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
            return element.sprite.gameSquareId == nextPathIdArray[0]
        });
        
        var tween = game.add.tween(playerSprite).to({ x: gameBoardDestResult.sprite.x, y: gameBoardDestResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            playerSprite.gameSquareId = nextPathIdArray[0];
            playerMove(gameVariables.gamePlayerArray[gameVariables.currentPlayer].sprite, roll - 1);
        }, this);

    }
    else {
        button.inputEnabled = true;
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

                return element > currentSquareId
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