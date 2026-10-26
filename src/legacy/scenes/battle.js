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

        this.createStatusOverlay(originX);

        var scene = game.engine.scene.getScene("legacy-game");
        scene.cameras.main.setBackgroundColor("#161a1f");

        scene.input.keyboard.on("keydown-ESC", function () {
            game.state.start("mainMenu");
        });
    },

    createStatusOverlay: function (boardLeft) {
        var humanPlayer = gameVariables.gamePlayerArray.find(function (player) {
            return player.human;
        });
        var previewingBattle = !humanPlayer;
        var humanCards;

        if (previewingBattle) {
            var maxHand = gameVariables.playerMaxHand || 4;
            var sampleDeck = gameVariables.playerDeck.length > 0
                ? gameVariables.playerDeck
                : (typeof testPlayerCardList !== "undefined" ? testPlayerCardList : []);
            humanCards = sampleDeck.slice(0, maxHand);
            humanPlayer = {
                name: gameVariables.playerName || "You",
                class: gameVariables.playerClass || "wizard",
                color: gameVariables.playerColor || "Fire",
                mana: gameVariables.playerStartingMana || 1,
                maxmana: gameVariables.playerStartingMana || 1,
                hand: humanCards,
                maxhand: maxHand,
                hp: gameVariables.playerHealth || 10,
                maxhp: gameVariables.playerMaxHealth || gameVariables.playerHealth || 10,
                capturedSquares: 0
            };
        } else {
            humanCards = humanPlayer.hand;
        }
        var players = [humanPlayer].concat(gameVariables.boardInfo.computerPlayers);

        var root = document.createElement("aside");
        root.className = "battle-status-overlay";
        root.setAttribute("aria-label", "Battle status");

        var panel = document.createElement("section");
        panel.className = "battle-status-panel";

        var header = document.createElement("header");
        header.className = "battle-status-header";
        var eyebrow = document.createElement("p");
        eyebrow.className = "battle-status-eyebrow";
        eyebrow.textContent = "Battle overview";
        var title = document.createElement("h1");
        title.textContent = "Players";
        header.appendChild(eyebrow);
        header.appendChild(title);
        panel.appendChild(header);

        var playerList = document.createElement("div");
        playerList.className = "battle-status-list";
        var activePlayer = players[gameVariables.currentPlayer] || players[0];
        var captureRequirement = gameVariables.boardInfo.captureRequirement || gameVariables.boardInfo.boardTotal;
        var schoolAliases = {
            red: "Fire",
            purple: "Death",
            yellow: "Life",
            blue: "Water",
            green: "Earth"
        };
        var validSchools = ["Fire", "Water", "Life", "Death", "Earth"];

        players.forEach(function (player, index) {
            var school = schoolAliases[player.color] || player.color;
            if (validSchools.indexOf(school) < 0) {
                school = "Fire";
            }

            var card = document.createElement("article");
            card.className = "battle-player-card";
            card.style.setProperty("--school-accent", "var(--school-" + school.toLowerCase() + ")");
            if (player === activePlayer) {
                card.classList.add("is-active");
            }

            var identity = document.createElement("div");
            identity.className = "battle-player-identity";
            var avatar = document.createElement("img");
            avatar.className = "battle-player-avatar";
            avatar.src = gameAssetUrl("assets/players/" + player.class + ".png");
            avatar.alt = "";
            avatar.width = 48;
            avatar.height = 48;

            var heading = document.createElement("div");
            heading.className = "battle-player-heading";
            var name = document.createElement("h2");
            name.textContent = player.name;
            var schoolLabel = document.createElement("span");
            schoolLabel.className = "battle-player-school";
            schoolLabel.textContent = school;
            heading.appendChild(name);
            heading.appendChild(schoolLabel);
            identity.appendChild(avatar);
            identity.appendChild(heading);

            if (player === activePlayer) {
                var turn = document.createElement("span");
                turn.className = "battle-turn-badge";
                turn.textContent = "Current turn";
                identity.appendChild(turn);
            }

            var stats = document.createElement("dl");
            stats.className = "battle-player-stats";
            [
                ["Mana", player.mana + "/" + player.maxmana],
                ["Cards", (player.hand ? player.hand.length : 0) + "/" + player.maxhand],
                ["Health", player.hp + "/" + player.maxhp],
                ["Squares", player.capturedSquares + "/" + captureRequirement]
            ].forEach(function (stat) {
                var item = document.createElement("div");
                item.className = "battle-player-stat";
                var label = document.createElement("dt");
                label.textContent = stat[0];
                var value = document.createElement("dd");
                value.textContent = stat[1];
                item.appendChild(label);
                item.appendChild(value);
                stats.appendChild(item);
            });

            var health = document.createElement("div");
            health.className = "battle-health";
            health.setAttribute("role", "img");
            health.setAttribute("aria-label", "Health " + player.hp + " of " + player.maxhp);
            var healthBar = document.createElement("span");
            healthBar.style.width = (player.maxhp > 0
                ? Math.max(0, Math.min(player.hp / player.maxhp, 1)) * 100
                : 0) + "%";
            health.appendChild(healthBar);

            card.appendChild(identity);
            card.appendChild(stats);
            card.appendChild(health);
            playerList.appendChild(card);
        });

        panel.appendChild(playerList);
        root.appendChild(panel);

        this.createHumanCardHand(root, humanCards);
        game.add.overlay(root);
    },

    createHumanCardHand: function (root, cards) {
        var cardImageFiles = {
            bolt: "bolt_of_fire_new",
            zombie: "zombie_ogre",
            summon: "summon_ugly_thing",
            death: "symbol_of_torment",
            heal: "regeneration_new",
            disengage: "ledas_liquefaction",
            blizzard: "ice_storm_new",
            steal: "apportation_new",
            mushroom: "wandering_mushroom_new",
            dummy: "training_dummy_new",
            research: "magic_mapping",
            poison: "poison_arrow_6",
            defense: "condensation_shield_new"
        };

        function getCardImageUrl(cardInfo) {
            var imageName = cardImageFiles[cardInfo.image] || cardInfo.image;
            return gameAssetUrl("assets/cards/" + imageName + ".png");
        }

        var handPanel = document.createElement("section");
        handPanel.className = "battle-hand-panel";
        handPanel.setAttribute("aria-label", "Your cards");

        var heading = document.createElement("div");
        heading.className = "battle-hand-heading";
        var title = document.createElement("h2");
        title.textContent = "Your cards";
        var hint = document.createElement("span");
        hint.textContent = "Hover or focus a card to inspect";
        heading.appendChild(title);
        heading.appendChild(hint);
        handPanel.appendChild(heading);

        var cardList = document.createElement("div");
        cardList.className = "battle-hand-list";

        if (!cards || cards.length === 0) {
            var emptyMessage = document.createElement("p");
            emptyMessage.className = "battle-hand-empty";
            emptyMessage.textContent = "No cards available in the preview hand.";
            cardList.appendChild(emptyMessage);
        } else {
            cards.forEach(function (cardInfo) {
                var card = document.createElement("article");
                card.className = "battle-card";

                var preview = document.createElement("div");
                preview.className = "battle-card-preview";
                preview.tabIndex = 0;
                preview.setAttribute("aria-label", cardInfo.name + ". Hover or focus to show card details.");

                var cost = document.createElement("span");
                cost.className = "battle-card-cost";
                cost.textContent = String(cardInfo.cost);

                var image = document.createElement("img");
                image.className = "battle-card-art";
                image.src = getCardImageUrl(cardInfo);
                image.alt = "";
                image.loading = "lazy";

                var name = document.createElement("span");
                name.className = "battle-card-name";
                name.textContent = cardInfo.name;

                var quickStats = document.createElement("span");
                quickStats.className = "battle-card-quick-stats";
                quickStats.textContent = cardInfo.creature
                    ? "ATK " + cardInfo.attack + " · HP " + cardInfo.defense
                    : "DMG " + cardInfo.damage;

                preview.appendChild(cost);
                preview.appendChild(image);
                preview.appendChild(name);
                preview.appendChild(quickStats);

                var details = document.createElement("div");
                details.className = "battle-card-details";

                var detailHeader = document.createElement("div");
                detailHeader.className = "battle-card-detail-header";
                var detailImage = document.createElement("img");
                detailImage.src = getCardImageUrl(cardInfo);
                detailImage.alt = "";
                var detailTitle = document.createElement("div");
                var detailName = document.createElement("h3");
                detailName.textContent = cardInfo.name;
                var detailRarity = document.createElement("span");
                detailRarity.textContent = (cardInfo.rare || "common") + " · " + (cardInfo.school || "Any");
                detailTitle.appendChild(detailName);
                detailTitle.appendChild(detailRarity);
                detailHeader.appendChild(detailImage);
                detailHeader.appendChild(detailTitle);

                var description = document.createElement("p");
                description.className = "battle-card-description";
                description.textContent = cardInfo.desc || "No description available.";

                var detailsList = document.createElement("dl");
                detailsList.className = "battle-card-detail-stats";
                [
                    ["Type", cardInfo.creature && cardInfo.spell ? "Creature · Spell" :
                        cardInfo.creature ? "Creature" : "Spell"],
                    ["Cost", cardInfo.cost + " mana"],
                    ["Attack", cardInfo.attack],
                    ["Health", cardInfo.defense],
                    ["Damage / effect", cardInfo.damage],
                    ["Armor", cardInfo.armor],
                    ["Threat", cardInfo.threat],
                    ["Special effect", cardInfo.special],
                    ["Target", [cardInfo.targetlocation, cardInfo.targettype, cardInfo.targetcount]
                        .filter(function (value) { return value !== undefined && value !== ""; })
                        .join(" · ") || "None"],
                    ["Value", cardInfo.gold + " gold"]
                ].forEach(function (entry) {
                    var item = document.createElement("div");
                    var label = document.createElement("dt");
                    label.textContent = entry[0];
                    var value = document.createElement("dd");
                    value.textContent = String(entry[1]);
                    item.appendChild(label);
                    item.appendChild(value);
                    detailsList.appendChild(item);
                });

                details.appendChild(detailHeader);
                details.appendChild(description);
                details.appendChild(detailsList);
                card.appendChild(preview);
                card.appendChild(details);
                cardList.appendChild(card);
            });
        }

        handPanel.appendChild(cardList);
        root.appendChild(handPanel);
    }
};
