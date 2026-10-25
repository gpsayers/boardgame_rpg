var battle = function () { };

battle.prototype = {
    init: function () {
        gameVariables.currentBoard = "board1";
        gameVariables.boardInfo = board1;
        this.boardSquares = [];
    },

    preload: function () {
        game.load.image("battle-pressure", "assets/board-elements/pressure_plate.png");
        game.load.image("battle-chest", "assets/board-elements/chest_2_closed.png");
        game.load.image("battle-fountain", "assets/board-elements/blue_fountain.png");
        game.load.image("battle-start", "assets/board-elements/stone_stairs_up.png");
        gameVariables.boardInfo.computerPlayers.forEach(function (player) {
            game.load.image("battle-player-" + player.class, "assets/players/" + player.class + ".png");
        });
    },

    create: function () {
        var boardInfo = gameVariables.boardInfo;
        var rows = boardInfo.squares;
        var rowCount = rows.length;
        var columnCount = Math.max.apply(null, rows.map(function (row) { return row.length; }));
        var tileSize = Math.min(50, (game.width - 40) / columnCount, (game.height - 40) / rowCount);
        var boardWidth = tileSize * columnCount;
        var boardHeight = tileSize * rowCount;
        var originX = (game.width - boardWidth) / 2 + tileSize / 2;
        var originY = (game.height - boardHeight) / 2 + tileSize / 2;
        var squarePositions = new Map();
        var specialItems = new Map(boardInfo.specialSquares.map(function (special) {
            return [special.squareId, special.type];
        }));
        var specialTextures = {
            pressure: "battle-pressure",
            chest: "battle-chest",
            bluefountain: "battle-fountain",
            start: "battle-start"
        };

        gameVariables.gameBoard.length = 0;

        rows.forEach(function (row, gridY) {
            row.forEach(function (squareId, gridX) {
                if (squareId === 0) {
                    return;
                }

                var x = originX + gridX * tileSize;
                var y = originY + gridY * tileSize;
                squarePositions.set(squareId, { x: x, y: y });
                var tile = game.add.sprite(x, y, "neutral");
                tile.width = tileSize;
                tile.height = tileSize;
                tile.anchor.set(0.5);
                this.boardSquares.push(tile);

                var specialType = specialItems.get(squareId);
                var specialTexture = specialTextures[specialType];
                if (specialTexture) {
                    var marker = game.add.sprite(x, y, specialTexture);
                    marker.width = tileSize * 0.8;
                    marker.height = tileSize * 0.8;
                    marker.anchor.set(0.5);
                    this.boardSquares.push(marker);
                }
            }, this);
        }, this);

        boardInfo.computerPlayers.forEach(function (player, index, players) {
            var position = squarePositions.get(player.square);
            if (!position) {
                throw new Error("Computer player " + player.name + " is assigned to missing board square " + player.square);
            }

            var sprite = game.add.sprite(position.x, position.y, "battle-player-" + player.class);
            var spriteSize = tileSize * 0.9;
            sprite.width = spriteSize;
            sprite.height = spriteSize;
            sprite.anchor.set(0.5);
            sprite.x += (index - (players.length - 1) / 2) * tileSize * 0.3;
            sprite.y -= Math.abs(index - (players.length - 1) / 2) * tileSize * 0.08;
            sprite.gameSquareId = player.square;
            player.sprite = sprite;
            this.boardSquares.push(sprite);
        }, this);

        var scene = game.engine.scene.getScene("legacy-game");
        scene.cameras.main.setBackgroundColor("#161a1f");

        scene.input.keyboard.on("keydown-ESC", function () {
            game.state.start("mainMenu");
        });
    }
};
