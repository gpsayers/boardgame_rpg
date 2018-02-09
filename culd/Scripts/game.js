var gameMain = function () { };


function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

function gameSquareCreature(cardId, squareId, sprite, hitpoints, armor, attack, def) {
    this.cardId = cardId;
    this.squareId = squareId;
    this.sprite = sprite;
    this.hitpoints = hitpoints;
    this.armor = armor;
    this.attack = attack;
    this.def = def;
    this.hitsprite = {};
}

var gameBoard = [];
var boardInfo = {};
var back_layer = {};
var board_layer = {};
var player_layer = {};
var playerDestinations = [];
var playerDirChoiceMenu = false;
var playerChoiceMenu = false;
var playerRoll = 0;
var activePlayerSquare = 0;


gameMain.prototype = {
    preload: function () {

        playerHand = masterCardList;

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

        if (gameVariables.currentBoard == "board1") {
            boardInfo = board1;
        }
        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };

        back_layer = game.add.group();
        board_layer = game.add.group();
        player_layer = game.add.group();
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
        drawtext.visible = false;

        //Build the game board
        for (y = 0; y < boardInfo.squares.length; y++) {
            var row = boardInfo.squares[y];
            for (x = 0; x < row.length; x++) {
                if (row[x] > 0) {
                    addGameSquare("neutral", (50 * x) + 75, (50 * y) + 50, row[x], x, y);
                }
                if (row[x] == boardInfo.boardStart) {
                    //Add starting door
                    //var special = game.add.sprite((50 * x) + 75, (50 * y) + 50, 'door');
                    //special.anchor.x = 0.5;
                    //special.anchor.y = 0.5;
                    //special.width= 50;
                    //special.height = 50;
                    //board_layer.add(special);

                    //Add player sprite
                    player = game.add.sprite(0, 0, gameVariables.playerImg);

                    player.width = 45;
                    player.height = 45;
                    player.anchor.x = 0.5;
                    player.anchor.y = 0.5;

                    player.x = (50 * x) + 75;
                    player.y = (50 * y) + 50;

                    player.gameSquareId = row[x];

                    player_layer.add(player);
                }
            }
        }

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
        for (var i = 0; i < playerHand.length; i++) {

            //Add card front
            playerHand[i].sprite = game.add.sprite(110 * i + 100, game.height - 100, 'cardFront');
            playerHand[i].sprite.width = 100;
            playerHand[i].sprite.height = 140;
            playerHand[i].sprite.anchor.x = 0.5;
            playerHand[i].sprite.anchor.y = 0.5;
            playerHand[i].sprite.cardId = playerHand[i].id;
            playerHand[i].sprite.inputEnabled = true;
            playerHand[i].sprite.events.onInputDown.add(cardClick, this);

            //Add card border
            playerHand[i].cardBorder = game.add.sprite(110 * i + 100, game.height - 100, 'redFrame');
            playerHand[i].cardBorder.width = 100;
            playerHand[i].cardBorder.height = 140;
            playerHand[i].cardBorder.anchor.x = 0.5;
            playerHand[i].cardBorder.anchor.y = 0.5;

            playerHand[i].cardImage = game.add.sprite(110 * i + 100, game.height - 110, playerHand[i].image);
            playerHand[i].cardImage.width = 70;
            playerHand[i].cardImage.height = 70;
            playerHand[i].cardImage.anchor.x = 0.5;
            playerHand[i].cardImage.anchor.y = 0.5;

            var style = { font: "bold 10px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: playerHand[i].sprite.width, align: "center" };
            playerHand[i].cardText = game.add.text(110 * i + 100, game.height - 150, playerHand[i].name, style);
            playerHand[i].cardText.anchor.set(0.5);
            playerHand[i].cardText1 = game.add.text(110 * i + 110, game.height - 60, playerHand[i].attack + "/" + playerHand[i].defense, { font: "15px bold Arial" });


        }

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

        //Manage player turns
        if (gameVariables.playerTurn == true) {

        }

        //Display player destination cursors
        if (playerDestinations.length > 0) {
            var cursorsFound = 0;
            for (x = 0; x < playerDestinations.length; x++) {
                for (i = 0; i < gameBoard.length; i++) {
                    if (gameBoard[i].sprite.gameSquareId == playerDestinations[x]) {

                        if (cursorsFound == 0) {
                            cursor1.x = gameBoard[i].sprite.x;
                            cursor1.y = gameBoard[i].sprite.y;

                            cursor1.visible = true;
                            cursorsFound++;
                        }
                        else {
                            cursor2.x = gameBoard[i].sprite.x;
                            cursor2.y = gameBoard[i].sprite.y;

                            cursor2.visible = true;
                        }
                    }
                }
            }
        }

        //Display player direction choice menu
        if (playerDirChoiceMenu == true) {

            var result = boardInfo.choiceSquares.find(function (element) {
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
        for (var i = 0; i < playerHand.length; i++) {

            //Add card front
            var tween1 = game.add.tween(playerHand[i].sprite).to({ x: 110 * i + 100, y: game.height - 100},200,Phaser.Easing.Linear.None, false);

            var tween2 = game.add.tween(playerHand[i].cardBorder).to({ x: 110 * i + 100, y: game.height - 100 }, 200, Phaser.Easing.Linear.None, false);
            var tween3 = game.add.tween(playerHand[i].cardImage).to({ x: 110 * i + 100, y: game.height - 110 }, 200, Phaser.Easing.Linear.None, false);
            var tween4 = game.add.tween(playerHand[i].cardText).to({ x: 110 * i + 100, y: game.height - 150 }, 200, Phaser.Easing.Linear.None, false);
            var tween5 = game.add.tween(playerHand[i].cardText1).to({ x: 110 * i + 110, y: game.height - 60 }, 200, Phaser.Easing.Linear.None, false);
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

    for (i = 0; i < boardInfo.specialSquares.length; i++) {    

        if (boardInfo.specialSquares[i].squareId == squareId) {

            gs.special = boardInfo.specialSquares[i];
            var special = game.add.sprite(x, y, boardInfo.specialSquares[i].type);
            special.anchor.x = 0.5;
            special.anchor.y = 0.5;
            gs.special.specialSprite = special;
            board_layer.add(special);
        }

    }
        
    gameBoard.push(gs);

}

function cardClick(item) {
    playerChoiceMenu = true;
    cardClicked = item.cardId;

}

function castSpell(id) {
    var cardDetails = masterCardList.find(function(card) {
        return card.id == id;
    });

    var boardSquareDetail = gameBoard.find(function (item) {
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
    var boardSquareDetail = gameBoard.find(function (item) {
        return item.id == id;
    });

    boardSquareDetail.sprite.loadTexture(gameVariables.playerColor);
}

function removeCardFromHand(id) {

    for (i = 0; i < playerHand.length; i++) {
        if (playerHand[i].sprite.cardId == id) {
            playerHand[i].sprite.destroy();
            playerHand[i].cardBorder.destroy();
            playerHand[i].cardImage.destroy();
            playerHand[i].cardText.destroy();
            playerHand[i].cardText1.destroy();
            playerHand.splice(i, 1);
        }

    }

}

function menuConfirmClick(item) {

    if (item.choice == "yes") {
        playerChoiceMenu = false;
        castSpell(cardClicked);
    }

    playerChoiceMenu = false;
    menu.visible = false;
    qText.visible = false;
    yesText.visible = false;
    noText.visible = false;

}

function drawCard() {

    var res = masterCardList.find(function (item) {
        return item.id == 7;
    });

    playerHand.push(res);
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

    calculateDestinations(player.gameSquareId, roll);

    playerMove(player, roll);
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

    var gameBoardResult = gameBoard.find(function (element) {
        return element.sprite.gameSquareId == item.choice
    });

    var tween = game.add.tween(player).to({ x: gameBoardResult.sprite.x, y: gameBoardResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

    //Callback to complete the rest of the roll
    tween.onComplete.add(function () {
        player.gameSquareId = item.choice;
        playerDestinations.length = 0;

        playerMove(player, playerRoll - 1);
    }, this);

}


function playerMove(playerSprite, roll) {

    playerRoll = roll;

    var nextPathIdArray = [];

    if (roll > 0) {
        var gameBoardResult = gameBoard.find(function (element) {
            return element.sprite.gameSquareId == playerSprite.gameSquareId
        });
        
        var neighbors = Array2D.orthogonals(boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (playerSprite.gameSquareId == boardInfo.boardEnd) {

            var boardPathId = neighbors.find(function (element) {
                return element == boardInfo.boardStart
            });

            nextPathIdArray.push(boardPathId);

        } else if (playerSprite.gameSquareId == boardInfo.boardStart) {

            var boardPathId = neighbors.filter(function (element) {
                return element > playerSprite.gameSquareId && element != boardInfo.boardEnd
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
     
        var gameBoardDestResult = gameBoard.find(function (element) {
            return element.sprite.gameSquareId == nextPathIdArray[0]
        });
        
        var tween = game.add.tween(playerSprite).to({ x: gameBoardDestResult.sprite.x, y: gameBoardDestResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            playerSprite.gameSquareId = nextPathIdArray[0];
            playerMove(player, roll - 1);
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
        var gameBoardResult = gameBoard.find(function (element) {
            return element.sprite.gameSquareId == currentSquareId
        });

        var neighbors = Array2D.orthogonals(boardInfo.squares, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (currentSquareId == boardInfo.boardEnd) {

            var boardPathId = neighbors.find(function (element) {
                return element == boardInfo.boardStart
            });

            nextPathIdArray.push(boardPathId);

        } else if (currentSquareId == boardInfo.boardStart) {

            var boardPathId = neighbors.filter(function (element) {
                return element > currentSquareId && element != boardInfo.boardEnd
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