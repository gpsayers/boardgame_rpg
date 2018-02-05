var gameMain = function () { };


var gameBoard = [];

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

var dice = {};

var player = {};
var back = {};

gameMain.prototype = {
    preload: function () {
        game.load.script('board1', 'Scripts/Scenes/board1.js');

        game.load.image('bunny', 'Assets/bunny.png');

        game.load.image('fire', 'Assets/red.png');
        game.load.image('water', 'Assets/blue.png');
        game.load.image('neutral', 'Assets/neutral.png');
        game.load.image('life', 'Assets/yellow.png');
        game.load.image('death', 'Assets/purple.png');
        game.load.image('earth', 'Assets/green.png');

        game.load.image('1', 'Assets/front&side-1.png');
        game.load.image('2', 'Assets/front-2.png');
        game.load.image('3', 'Assets/front-3.png');
        game.load.image('4', 'Assets/front&side-4.png');
        game.load.image('5', 'Assets/front-5.png');
        game.load.image('6', 'Assets/front-6.png');

    },
    create: function () {

        var back_layer = game.add.group();
        back = back_layer;
        var board_layer = game.add.group();
        var player_layer = game.add.group();

        game.stage.backgroundColor = "#4488AA";

        for (y = 0; y < board1.length; y++) {
            var row = board1[y];
            for (x = 0; x < row.length; x++) {
                if (row[x] > 0) {
                    addGameSquare("neutral", (50 * x) + 50, (50 * y) + 50, row[x], x, y);

                }
                if (row[x] == boardStart) {
                    player = game.add.sprite(0, 0, 'bunny');

                    player.width = 45;
                    player.height = 45;
                    player.anchor.x = 0.5;
                    player.anchor.y = 0.5;

                    player.x = (50 * x) + 50;
                    player.y = (50 * y) + 50;

                    player.gameSquareId = row[x];

                    player_layer.add(player);
                }
            }
        }
  
        dice = game.add.sprite(game.width / 2, game.height - 50, '1');
        dice.inputEnabled = true;
        dice.events.onInputDown.add(diceRoll, this);

    },
    update: function () {
        for (i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i].sprite.input.pointerOver()) {
                gameBoard[i].sprite.alpha = 0.5;
            }
            else {
                gameBoard[i].sprite.alpha = 1;
            }
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
    sprite.events.onInputDown.add(listener, this);
    sprite.gameSquareId = squareId;
    sprite.gridX = gridX;
    sprite.gridY = gridY;
    back.add(sprite);

    gameBoard.push(new gameSquare(squareId, x, y, sprite));

}

function listener(item) {
    
    var gameBoardResult = gameBoard.find(function (element) {
        return element.sprite.gameSquareId == item.gameSquareId
    })

    player.visible = true;
    player.x = item.x;
    player.y = item.y;
}

function diceRoll(item) {

    item.input.enabled = false;

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

function playerMove(playerSprite, roll) {


    if (roll > 0) {
        var gameBoardResult = gameBoard.find(function (element) {
            return element.sprite.gameSquareId == playerSprite.gameSquareId
        });
        
        var neighbors = Array2D.orthogonals(board1, gameBoardResult.sprite.gridY, gameBoardResult.sprite.gridX);

        //Special cases if at end of board or beginning
        if (playerSprite.gameSquareId == boardEnd) {

            var boardPathId = neighbors.find(function (element) {
                return element == boardStart
            });

        } else if (playerSprite.gameSquareId == boardStart) {

            var boardPathId = neighbors.find(function (element) {
                return element > playerSprite.gameSquareId && element != boardEnd
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
        dice.input.enabled = true;
    }


}