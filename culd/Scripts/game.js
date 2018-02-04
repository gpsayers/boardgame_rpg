var gameMain = function () { };


var gameBoard = [];

function gameSquare(id, x, y, sprite) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

gameMain.prototype = {
    preload: function () {
        game.load.script('board1', 'Scripts/Scenes/board1.js');

        game.load.image('fire', 'Assets/red.png');
        game.load.image('water', 'Assets/blue.png');
        game.load.image('neutral', 'Assets/neutral.png');
        game.load.image('life', 'Assets/yellow.png');
        game.load.image('death', 'Assets/purple.png');
        game.load.image('earth', 'Assets/green.png');
    },
    create: function () {
        game.stage.backgroundColor = "#4488AA";

        var id = 1;
        for (i = 0; i < board1.length; i++) {
            var row = board1[i];
            for (x = 0; x < row.length; x++) {
                if (row[x] == 1) {
                    addGameSquare("neutral", (50 * x) + 50, (50 * i) + 50, id);
                    id++;
                }
            }
        }
        


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

function addGameSquare(type, x, y, squareId) {
    switch (type) {
        case "fire":
            var sprite = game.add.sprite(x, y, 'fire');
            sprite.width = 50;
            sprite.height = 50;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(listener, this);
            break;
        case "neutral":
            var sprite = game.add.sprite(x, y, 'neutral');
            sprite.width = 50;
            sprite.height = 50;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(listener, this);
            break;
        case "water":
            var sprite = game.add.sprite(x, y, 'water');
            sprite.width = 50;
            sprite.height = 50;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.inputEnabled = true;
            break;
        case "life":
            var sprite = game.add.sprite(x, y, 'fire');
            sprite.width = 50;
            sprite.height = 50;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.inputEnabled = true;
            break;
        case "death":
            var sprite = game.add.sprite(x, y, 'death');
            sprite.width = 50;
            sprite.height = 50;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.inputEnabled = true;
            break;
    }

    gameBoard.push(new gameSquare(squareId, x, y, sprite));

}

function listener(item) {
    console.log(item);
   

}