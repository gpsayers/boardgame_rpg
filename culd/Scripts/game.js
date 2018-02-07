var gameMain = function () { };


var gameBoard = [];

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

var boardInfo = {};
var dice = {};
var player = {};
var back_layer = {};
var board_layer = {};
var player_layer = {};


gameMain.prototype = {
    preload: function () {

        playerHand = masterCardList;

        //background image
        game.load.image('dirt', 'Assets/dirt4.png');


        game.load.image('menu', 'Assets/GUI/Menu.png');

        //board squares
        game.load.image('fire', 'Assets/red.png');
        game.load.image('water', 'Assets/blue.png');
        game.load.image('neutral', 'Assets/neutral.png');
        game.load.image('life', 'Assets/yellow.png');
        game.load.image('death', 'Assets/purple.png');
        game.load.image('earth', 'Assets/green.png');

        //board elements
        game.load.image('chest', 'Assets/BoardElements/chest_2_closed.png');
        game.load.image('bluefountain', 'Assets/BoardElements/blue_fountain.png');
        game.load.image('trap', 'Assets/BoardElements/trap_blade.png');

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

        game.load.spritesheet('button', 'Assets/GUI/diceButtonsSpritesheet.png', 404, 177);

    },
    create: function () {

        if (gameVariables.currentBoard == "board1") {
            boardInfo = board1;
        }

        back_layer = game.add.group();
        board_layer = game.add.group();
        player_layer = game.add.group();
        pop_layer = game.add.group();


        var tile = game.add.tileSprite(0, 0, game.width, game.height, 'dirt');
        back_layer.add(tile);


        //Build the game board
        for (y = 0; y < boardInfo.squares.length; y++) {
            var row = boardInfo.squares[y];
            for (x = 0; x < row.length; x++) {
                if (row[x] > 0) {
                    addGameSquare("neutral", (50 * x) + 75, (50 * y) + 50, row[x], x, y);
                }
                if (row[x] == boardInfo.boardStart) {
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

        //Add dice roll sprites
        dice = game.add.sprite(game.width - 125, game.height - 150, '1');
        dice.width = 40;
        dice.height = 40;
        button = game.add.button(game.width - 150, game.height - 75, 'button', actionOnClick, this, 1, 1, 4, 1);
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
            playerHand[i].sprite = game.add.sprite(110 * i + 100, game.height - 100, 'redFrame');
            playerHand[i].sprite.width = 100;
            playerHand[i].sprite.height = 140;
            playerHand[i].sprite.anchor.x = 0.5;
            playerHand[i].sprite.anchor.y = 0.5;
            //playerHand[i].sprite.inputEnabled = true;
            //playerHand[i].sprite.events.onInputDown.add(cardClick, this);


            var cardImage = game.add.sprite(110 * i + 100, game.height - 110, playerHand[i].image);
            cardImage.width = 70;
            cardImage.height = 70;
            cardImage.anchor.x = 0.5;
            cardImage.anchor.y = 0.5;


            var style = { font: "bold 10px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: playerHand[i].sprite.width, align: "center" };
            text = game.add.text(110 * i + 100, game.height - 150, playerHand[i].name, style);
            text.anchor.set(0.5);
            game.add.text(110 * i + 110, game.height - 60, playerHand[i].attack + "/" + playerHand[i].defense, {font: "15px bold Arial"});


        }

        //Confirmation menu
        var style = { font: 'bold 15pt Arial', wordWrap: true, wordWrapWidth: 150, align: "center" };
        menu = game.add.sprite(game.width / 2, game.height / 2, 'menu');
        menu.anchor.x = 0.5;
        menu.anchor.y = 0.5;
        qText = game.add.text((game.width / 2), (game.height / 2) - 20, "Would you like to cast this spell?", style);
        qText.anchor.x = 0.5;
        qText.anchor.y = 0.5;
        yesText = game.add.text((game.width / 2)-40, (game.height/ 2)+45, "Yes");
        yesText.anchor.x = 0.5;
        yesText.anchor.y = 0.5;
        noText = game.add.text((game.width / 2) + 40, (game.height / 2) + 45, "No");
        noText.anchor.x = 0.5;
        noText.anchor.y = 0.5;
        pop_layer.add(menu);
        pop_layer.add(yesText);
        pop_layer.add(noText);
        pop_layer.add(qText);
        pop_layer.visible = false;

    },
    update: function () {
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

function addGameCard() {

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

    for (i = 0; i < boardInfo.specialSquares.length; i++) {
        var row = boardInfo.specialSquares[i];
        if (row[0] == squareId && row[1] == "C") {
            var special = game.add.sprite(x, y, 'chest');
            special.anchor.x = 0.5;
            special.anchor.y = 0.5;

            board_layer.add(special);
        }
        if (row[0] == squareId && row[1] == "B") {
            var special = game.add.sprite(x, y, 'bluefountain');
            special.anchor.x = 0.5;
            special.anchor.y = 0.5;

            board_layer.add(special);
        }
        if (row[0] == squareId && row[1] == "T") {
            var special = game.add.sprite(x, y, 'trap');
            special.anchor.x = 0.5;
            special.anchor.y = 0.5;

            board_layer.add(special);
        }

    }



    gameBoard.push(new gameSquare(squareId, x, y, sprite));

}

function cardClick(item) {
    console.log(item);


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

    playerMove(player, roll);
}

function actionOnClick() {
    button.inputEnabled = false;
    diceRoll(dice);

}

function createMenu() {

}

function playerMove(playerSprite, roll) {


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

        } else if (playerSprite.gameSquareId == boardInfo.boardStart) {

            var boardPathId = neighbors.find(function (element) {
                return element > playerSprite.gameSquareId && element != boardInfo.boardEnd
            });

        } else {
            var boardPathId = neighbors.find(function (element) {

                return element > playerSprite.gameSquareId
            });

            //TODO: Add decisions by players for paths with multiple options.
        }
     
        var gameBoardDestResult = gameBoard.find(function (element) {
            return element.sprite.gameSquareId == boardPathId
        });
        
        var tween = game.add.tween(playerSprite).to({ x: gameBoardDestResult.sprite.x, y: gameBoardDestResult.sprite.y }, 500, Phaser.Easing.Linear.None, true);

        //Callback to complete the rest of the roll
        tween.onComplete.add(function () {
            playerSprite.gameSquareId = boardPathId;
            playerMove(player, roll - 1);
        }, this);

    }
    else {
        button.inputEnabled = true;
    }


}