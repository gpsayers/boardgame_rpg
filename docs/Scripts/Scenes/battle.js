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
        game.load.image("battle-target", "assets/gui/silenced.png");
        game.load.image("gpix", "assets/gui/greenPixel.png");
        game.load.image("rpix", "assets/gui/redPixel.png");
        var humanPlayer = gameVariables.gamePlayerArray.find(function (player) {
            return player.human;
        });
        var humanClass = humanPlayer ? humanPlayer.class : (gameVariables.playerClass || "cavalier");
        game.load.image("battle-player-human", "assets/players/" + humanClass + ".png");
        var creatureImageFiles = {
            zombie: "zombie_ogre",
            summon: "summon_ugly_thing",
            heal: "regeneration_new",
            death: "symbol_of_torment",
            bolt: "bolt_of_fire_new",
            blizzard: "ice_storm_new",
            steal: "apportation_new",
            disengage: "ledas_liquefaction",
            mushroom: "wandering_mushroom_new",
            dummy: "training_dummy_new",
            research: "magic_mapping",
            poison: "poison_arrow_6",
            defense: "condensation_shield_new"
        };
        var loadedCreatureImages = new Set();
        masterCardList.forEach(function (cardInfo) {
            if (!cardInfo.creature || loadedCreatureImages.has(cardInfo.image)) {
                return;
            }
            loadedCreatureImages.add(cardInfo.image);
            var imageName = creatureImageFiles[cardInfo.image] || cardInfo.image;
            game.load.image(cardInfo.image, "assets/cards/" + imageName + ".png");
        });
        var boardColorFiles = {
            red: "fire",
            blue: "ice",
            white: "divination",
            yellow: "divination",
            black: "necromancy",
            purple: "necromancy",
            green: "poison",
            fire: "fire",
            water: "ice",
            life: "divination",
            death: "necromancy",
            earth: "poison"
        };
        gameVariables.boardInfo.computerPlayers.forEach(function (player) {
            game.load.image("battle-player-" + player.class, "assets/players/" + player.class + ".png");
            var colorFile = boardColorFiles[String(player.color).toLowerCase()];
            if (colorFile) {
                game.load.image(player.color, "assets/" + colorFile + ".png");
            }
        });
        var humanColor = humanPlayer ? humanPlayer.color : (gameVariables.playerColor || "Fire");
        var humanColorFile = boardColorFiles[String(humanColor).toLowerCase()];
        if (humanColorFile) {
            game.load.image(humanColor, "assets/" + humanColorFile + ".png");
        }
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

        this.specialTextures = specialTextures;
        this.boardSquareLayer = game.add.group();
        this.boardSpecialLayer = game.add.group();
        this.creatureLayer = game.add.group();
        this.aiPlayerLayer = game.add.group();
        this.humanPlayerLayer = game.add.group();
        this.spellEffectLayer = game.add.group();
        this.squarePositions = squarePositions;
        this.tileSize = tileSize;
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
                tile.gridX = gridX;
                tile.gridY = gridY;
                tile.gameSquareId = squareId;
                tile.inputEnabled = true;
                tile.events.onInputOver.add(function () {
                    this.showSquareDetails(squareId);
                }, this);
                tile.events.onInputOut.add(function () {
                    this.showSquareDetails(null);
                }, this);
                this.boardSquareLayer.add(tile);
                this.boardSquares.push(tile);
                gameVariables.gameBoard.push({
                    id: squareId,
                    sprite: tile,
                    creature: null
                });

                var specialType = specialItems.get(squareId);
                var specialTexture = specialTextures[specialType];
                if (specialTexture) {
                    var marker = game.add.sprite(x, y, specialTexture);
                    marker.width = tileSize * 0.8;
                    marker.height = tileSize * 0.8;
                    marker.anchor.set(0.5);
                    this.boardSpecialLayer.add(marker);
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
            this.aiPlayerLayer.add(sprite);
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
        this.humanCards = [];
        this.previewDeck = [];
        this.playerStatusCards = new Map();
        this.playerCardCountLabels = new Map();
        this.playerManaLabels = new Map();
        this.playerCapturedLabels = new Map();
        this.playerHealthLabels = new Map();
        this.playerHealthBars = new Map();
        this.humanTurnActive = true;

        if (previewingBattle) {
            var maxHand = gameVariables.playerMaxHand || 4;
            var sampleDeck = typeof battleTestPlayerCardList !== "undefined" && battleTestPlayerCardList.length > 0
                ? battleTestPlayerCardList
                : gameVariables.playerDeck.length > 0
                    ? gameVariables.playerDeck
                    : (typeof testPlayerCardList !== "undefined" ? testPlayerCardList : []);
            humanCards = sampleDeck.slice(0, Math.max(0, maxHand - 1));
            this.previewDeck = sampleDeck.slice(humanCards.length);
            humanPlayer = {
                id: 0,
                name: gameVariables.playerName || "You",
                class: gameVariables.playerClass || "cavalier",
                color: gameVariables.playerColor || "Fire",
                human: true,
                mana: gameVariables.playerStartingMana || 1,
                maxmana: gameVariables.playerStartingMana || 1,
                hand: humanCards,
                discard: [],
                maxhand: maxHand,
                hp: gameVariables.playerHealth || 10,
                maxhp: gameVariables.playerMaxHealth || gameVariables.playerHealth || 10,
                gold: gameVariables.playerGold || 100,
                armor: gameVariables.playerArmor || 0,
                capturedSquares: 0
            };
        } else {
            humanCards = humanPlayer.hand ? humanPlayer.hand.slice() : [];
            this.previewDeck = humanPlayer.deck ? humanPlayer.deck.slice() : [];
        }
        var humanSquareId = humanPlayer.square || gameVariables.boardInfo.boardStart;
        var humanPosition = this.squarePositions.get(humanSquareId);
        if (!humanPosition) {
            throw new Error("Human player is assigned to missing board square " + humanSquareId);
        }
        var humanSprite = game.add.sprite(humanPosition.x, humanPosition.y, "battle-player-human");
        humanSprite.width = this.tileSize * 0.9;
        humanSprite.height = this.tileSize * 0.9;
        humanSprite.anchor.set(0.5);
        humanSprite.x -= this.tileSize * 0.35;
        humanSprite.gameSquareId = humanSquareId;
        humanPlayer.sprite = humanSprite;
        humanPlayer.square = humanSquareId;
        this.humanPlayerLayer.add(humanSprite);
        this.battleTestHuman = humanPlayer;
        this.boardSquares.push(humanSprite);
        this.humanMaxHand = humanPlayer.maxhand || gameVariables.playerMaxHand || 4;
        this.humanCards = humanCards;
        humanPlayer.hand = humanCards;
        humanPlayer.deck = this.previewDeck;
        var players = [humanPlayer].concat(gameVariables.boardInfo.computerPlayers);
        players.slice(1).forEach(function (player) {
            var summonCards = (player.deck || []).filter(function (cardInfo) {
                return this.isBattleCardSupported(cardInfo);
            }, this);
            if (summonCards.length === 0) {
                summonCards = masterCardList.filter(function (cardInfo) {
                    return cardInfo.creature && !cardInfo.spell;
                });
            }
            if (summonCards.length === 0) {
                throw new Error("Battle Test AI has no summon cards available.");
            }

            var deckSize = Math.max(summonCards.length, player.maxhand * 5);
            player.deck = [];
            for (var cardIndex = 0; cardIndex < deckSize; cardIndex++) {
                player.deck.push(summonCards[cardIndex % summonCards.length]);
            }
            player.deck = shuffle(player.deck);
            player.hand = [];
            player.discard = [];
            while (player.hand.length < player.maxhand && player.deck.length > 0) {
                player.hand.push(player.deck.pop());
            }
        }, this);
        this.battleTestPlayers = players;
        gameVariables.gamePlayerArray = players;
        gameVariables.currentPlayer = 0;

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
            blue: "Water",
            white: "Life",
            yellow: "Life",
            black: "Death",
            purple: "Death",
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
            this.playerStatusCards.set(player, card);

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

            var turn = document.createElement("span");
            turn.className = "battle-turn-badge";
            turn.textContent = "Current turn";
            turn.hidden = player !== activePlayer;
            identity.appendChild(turn);

            var stats = document.createElement("dl");
            stats.className = "battle-player-stats";
            [
                ["Mana", player.mana + "/" + player.maxmana],
                ["Cards", (player === humanPlayer ? this.humanCards.length : (player.hand ? player.hand.length : 0)) + "/" + player.maxhand],
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
                if (player === humanPlayer && stat[0] === "Cards") {
                    this.humanCardCountLabel = value;
                }
                if (stat[0] === "Cards") {
                    this.playerCardCountLabels.set(player, value);
                }
                if (stat[0] === "Mana") {
                    this.playerManaLabels.set(player, value);
                }
                if (stat[0] === "Squares") {
                    this.playerCapturedLabels.set(player, value);
                }
                if (stat[0] === "Health") {
                    this.playerHealthLabels.set(player, value);
                }
            }, this);

            var health = document.createElement("div");
            health.className = "battle-health";
            health.setAttribute("role", "img");
            health.setAttribute("aria-label", "Health " + player.hp + " of " + player.maxhp);
            var healthBar = document.createElement("span");
            healthBar.style.width = (player.maxhp > 0
                ? Math.max(0, Math.min(player.hp / player.maxhp, 1)) * 100
                : 0) + "%";
            health.appendChild(healthBar);
            this.playerHealthBars.set(player, { container: health, bar: healthBar });

            card.appendChild(identity);
            card.appendChild(stats);
            card.appendChild(health);
            playerList.appendChild(card);
        }, this);

        panel.appendChild(playerList);
        this.createTurnControls(panel);
        root.appendChild(panel);

        this.createHumanCardHand(root, this.humanCards);
        this.createSquareDetailPanel(root);
        this.eventLog = new BattleEventLog();
        root.appendChild(this.eventLog.element);
        game.add.overlay(root);
        this.startBattleTurn();
    },

    createSquareDetailPanel: function (root) {
        var panel = document.createElement("section");
        panel.className = "battle-square-panel";
        panel.setAttribute("aria-label", "Square details");
        panel.setAttribute("aria-live", "polite");
        root.appendChild(panel);
        this.squareDetailPanel = panel;
        this.hoveredSquareId = null;
        this.renderSquareDetails();
    },

    showSquareDetails: function (squareId) {
        this.hoveredSquareId = squareId;
        this.renderSquareDetails();
    },

    renderSquareDetails: function () {
        var panel = this.squareDetailPanel;
        if (!panel) {
            return;
        }
        panel.textContent = "";

        function element(tag, className, text) {
            var el = document.createElement(tag);
            if (className) {
                el.className = className;
            }
            if (text !== undefined) {
                el.textContent = text;
            }
            return el;
        }

        function addRow(list, label, value) {
            var row = element("div");
            row.appendChild(element("dt", "", label));
            row.appendChild(element("dd", "", String(value)));
            list.appendChild(row);
        }

        var textureScene = game.engine.scene.getScene("legacy-game");
        function picture(textureKey, className) {
            if (!textureKey || !textureScene.textures.exists(textureKey)) {
                return null;
            }
            // The texture's blob URL is revoked after loading, so copy the decoded image instead.
            var source = textureScene.textures.get(textureKey).getSourceImage();
            var canvas = element("canvas", className);
            canvas.width = source.width;
            canvas.height = source.height;
            canvas.getContext("2d").drawImage(source, 0, 0);
            return canvas;
        }

        function entry(textureKey, className, label, detail) {
            var wrap = element("div", "battle-square-entry");
            var img = picture(textureKey, className);
            if (img) {
                wrap.appendChild(img);
            }
            var text = element("div", "battle-square-entry-text");
            text.appendChild(element("strong", "", label));
            if (detail) {
                text.appendChild(element("span", "", detail));
            }
            wrap.appendChild(text);
            return wrap;
        }

        var squareId = this.hoveredSquareId;
        var square = squareId === null ? null : gameVariables.gameBoard.find(function (item) {
            return item.id === squareId;
        });
        if (!square) {
            panel.appendChild(element("h2", "", "Square details"));
            panel.appendChild(element("p", "battle-square-hint", "Hover over a board square to inspect it."));
            return;
        }

        var players = this.battleTestPlayers || [];
        var owner = players.find(function (player) {
            return player.id === square.ownerPlayerId;
        });

        var titleRow = element("div", "battle-square-title");
        var tileImage = picture(square.sprite.key, "battle-square-tile");
        if (tileImage) {
            titleRow.appendChild(tileImage);
        }
        titleRow.appendChild(element("h2", "", "Square " + square.id));
        panel.appendChild(titleRow);

        var special = (gameVariables.boardInfo.specialSquares || []).find(function (item) {
            return item.squareId === square.id;
        });
        var specialLine = element("div", "battle-square-entry battle-square-special");
        var specialImage = special && picture(this.specialTextures[special.type], "battle-square-special-icon");
        if (specialImage) {
            specialLine.appendChild(specialImage);
        }
        var specialText = element("span");
        specialText.appendChild(element("strong", "", "Square Special: "));
        specialText.appendChild(document.createTextNode(special ? special.type : "None"));
        specialLine.appendChild(specialText);
        panel.appendChild(specialLine);

        panel.appendChild(element("h3", "", "Owner"));
        panel.appendChild(owner
            ? entry("battle-player-" + (owner.human ? "human" : owner.class), "battle-square-portrait",
                owner.name, owner.color + " square")
            : element("p", "battle-square-hint", "Unclaimed"));

        panel.appendChild(element("h3", "", "Players"));
        var present = players.filter(function (player) {
            return player.sprite && player.sprite.gameSquareId === square.id;
        });
        if (present.length === 0) {
            panel.appendChild(element("p", "battle-square-hint", "None"));
        } else {
            var playerGrid = element("div", "battle-square-player-grid");
            present.forEach(function (player) {
                playerGrid.appendChild(entry("battle-player-" + (player.human ? "human" : player.class),
                    "battle-square-portrait", player.name, "HP " + player.hp + "/" + player.maxhp));
            });
            panel.appendChild(playerGrid);
        }

        panel.appendChild(element("h3", "", "Creature"));
        var creature = square.creature;
        if (!creature) {
            panel.appendChild(element("p", "battle-square-hint", "None"));
            return;
        }

        var cardInfo = masterCardList.find(function (item) {
            return item.id === creature.cardId;
        });
        var creatureOwner = players.find(function (player) {
            return player.id === creature.playerOwnedId;
        });
        var specialEffects = SPECIAL_EFFECT_NAMES;
        var effects = [];
        if (cardInfo && cardInfo.special && specialEffects[cardInfo.special]) {
            effects.push(specialEffects[cardInfo.special]);
        }
        if (cardInfo && cardInfo.desc) {
            effects.push(cardInfo.desc);
        }

        panel.appendChild(entry(cardInfo && cardInfo.image, "battle-square-portrait",
            cardInfo ? cardInfo.name : "Unknown",
            "Owner: " + (creatureOwner ? creatureOwner.name : "None")));
        var stats = element("dl", "battle-square-stats");
        addRow(stats, "Health", creature.hitpoints + "/" + creature.maxhitpoints);
        addRow(stats, "Attack", creature.attack);
        addRow(stats, "Defense", creature.def);
        addRow(stats, "Armor", creature.armor);
        panel.appendChild(stats);
        panel.appendChild(element("p", "battle-square-effects",
            "Effects: " + (effects.length ? effects.join(" · ") : "None")));
    },

    createHumanCardHand: function (root, cards) {
        if (this.humanHandPanel) {
            this.humanHandPanel.remove();
        }

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
        this.humanHandPanel = handPanel;
        this.humanHandRoot = root;

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
                if (cardInfo === this.lastDrawnCard) {
                    card.classList.add("is-drawing");
                }

                var preview = document.createElement("div");
                preview.className = "battle-card-preview";
                preview.tabIndex = 0;
                preview.setAttribute("role", "button");
                preview.setAttribute("aria-label",
                    "Play " + cardInfo.name + ". Hover or focus to show card details.");
                preview.addEventListener("click", function () {
                    this.playHumanCard(cardInfo);
                }.bind(this));
                preview.addEventListener("keydown", function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        this.playHumanCard(cardInfo);
                    }
                }.bind(this));

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
            }, this);
        }

        handPanel.appendChild(cardList);
        root.appendChild(handPanel);
        this.humanCardList = cardList;
    },

    playHumanCard: function (cardInfo) {
        if (!this.humanTurnActive) {
            return;
        }
        this.playBattleTestCard(this.battleTestHuman, cardInfo, this.humanCards);
    },

    playBattleTestAICards: function (player) {
        var provider = this.getBattleCardTargets.bind(this);
        var selection = computerAI.chooseBattleTestCard(player, provider);
        var plays = 0;
        while (selection && plays++ < 20) {
            var targets = selection.card.targetlocation === "all"
                ? selection.targets
                : [selection.targets[selection.targetIndex]];
            if (!this.castBattleCard(player, selection.card, player.hand, targets, true)) {
                break;
            }
            selection = computerAI.chooseBattleTestCard(player, provider);
        }
    },

    isBattleCardSupported: function (cardInfo) {
        return !!cardInfo && (cardInfo.creature || cardInfo.spell) &&
            !this.isBattleMoveCard(cardInfo) &&
            cardInfo.special !== SPECIAL_EFFECT.MOVE_BACK;
    },

    // Movement cards (special 4) are human-only and need an adjacent ground target.
    isBattleMoveCard: function (cardInfo) {
        return cardInfo.special === SPECIAL_EFFECT.MOVE_FORWARD;
    },

    isBattleMoveCardPlayable: function (cardInfo) {
        return this.isBattleMoveCard(cardInfo) && !!cardInfo.spell &&
            cardInfo.targetlocation === "adj" && cardInfo.targettype === "ground";
    },

    moveBattlePlayer: function (player, squareId) {
        var destination = this.getBattleSquare(squareId);
        if (!destination || !destination.sprite) {
            throw new Error("Cannot move player to missing board square " + squareId);
        }
        player.sprite.gameSquareId = squareId;
        player.square = squareId;
        game.add.tween(player.sprite).to(
            { x: destination.sprite.x, y: destination.sprite.y },
            300,
            Phaser.Easing.Linear.None,
            true
        );
        this.logBattleEvent(player.name + " moves to square " + squareId, player);
    },

    getBattleSquare: function (squareId) {
        return gameVariables.gameBoard.find(function (square) {
            return square.id === squareId;
        });
    },

    getAdjacentBattleSquareIds: function (squareId) {
        var rows = gameVariables.boardInfo.squares;
        var tile = this.getBattleSquare(squareId).sprite;
        return [[-1, 0], [1, 0], [0, -1], [0, 1]].map(function (offset) {
            var row = rows[tile.gridY + offset[0]];
            return row ? row[tile.gridX + offset[1]] : 0;
        }).filter(function (neighborId) {
            return neighborId > 0;
        });
    },

    // Concrete targets for a card: { type: "creature" | "player" | "ground", targetSquare, model }.
    getBattleCardTargets: function (cardInfo, player) {
        var casterSquareId = player.sprite.gameSquareId;
        var location = cardInfo.targetlocation;
        var type = cardInfo.targettype;
        var targets = [];

        if (cardInfo.spell && location) {
            var squareIds;
            if (location === "any" || location === "all") {
                squareIds = gameVariables.gameBoard.map(function (square) {
                    return square.id;
                });
            } else if (location === "adj") {
                squareIds = this.getAdjacentBattleSquareIds(casterSquareId);
            } else {
                squareIds = [casterSquareId];
            }
            var excludeOwn = location === "square";

            squareIds.forEach(function (squareId) {
                if (type === "ground") {
                    targets.push({ type: "ground", targetSquare: squareId });
                    return;
                }
                var square = this.getBattleSquare(squareId);
                if ((type === "creature" || type === "both") && square.creature &&
                    !(excludeOwn && square.creature.playerOwnedId === player.id)) {
                    targets.push({ type: "creature", targetSquare: squareId, model: square.creature });
                }
                if (type === "player" || type === "both") {
                    this.battleTestPlayers.forEach(function (candidate) {
                        if (candidate.hp > 0 && candidate.sprite.gameSquareId === squareId &&
                            !(excludeOwn && candidate === player) &&
                            !(location === "self" && candidate !== player)) {
                            targets.push({ type: "player", targetSquare: squareId, model: candidate });
                        }
                    });
                }
            }, this);
        }

        if (targets.length === 0 && cardInfo.creature) {
            targets.push({ type: "ground", targetSquare: casterSquareId });
        }
        return targets;
    },

    playBattleTestCard: function (player, cardInfo, hand, isAI) {
        if (hand.indexOf(cardInfo) < 0) {
            return false;
        }
        if (cardInfo.cost > player.mana) {
            this.battleTurnStatus.textContent = "Not enough mana to play " + cardInfo.name + ".";
            return false;
        }
        if (this.isBattleMoveCard(cardInfo) && (isAI || !this.isBattleMoveCardPlayable(cardInfo))) {
            this.battleTurnStatus.textContent = isAI
                ? ""
                : cardInfo.name + " needs target adj / ground in data.csv to work in the Battle Test.";
            return false;
        }
        if (!this.isBattleMoveCard(cardInfo) && !this.isBattleCardSupported(cardInfo)) {
            this.battleTurnStatus.textContent =
                cardInfo.name + " isn't supported in the Battle Test yet.";
            return false;
        }

        var targets = this.getBattleCardTargets(cardInfo, player);
        if (targets.length === 0) {
            this.battleTurnStatus.textContent = cardInfo.name + " has no valid targets.";
            return false;
        }

        // Cards that hit everything or only the caster never need a choice.
        var needsChoice = targets.length > 1 &&
            cardInfo.targetlocation !== "all" && cardInfo.targetlocation !== "self";
        if (needsChoice) {
            this.showBattleTargetChooser(player, cardInfo, hand, targets);
            return true;
        }
        return this.castBattleCard(player, cardInfo, hand, targets, isAI);
    },

    castBattleCard: function (player, cardInfo, hand, targets, isAI) {
        var handIndex = hand.indexOf(cardInfo);
        if (handIndex < 0 || cardInfo.cost > player.mana) {
            return false;
        }

        this.cancelBattleTargeting(true);
        player.mana -= cardInfo.cost;
        hand.splice(handIndex, 1);
        player.discard = player.discard || [];
        player.discard.push(cardInfo);

        var outcome = "";
        if (cardInfo.spell) {
            this.logBattleEvent(player.name + " casts " + cardInfo.name, player);
            targets.forEach(function (target) {
                if (target) {
                    this.applyBattleSpell(cardInfo, player, target);
                }
            }, this);
            outcome = "cast";
        }
        // The second spell resolves before the summon so damage lands before combat.
        this.castBattleSecondSpell(cardInfo, player);
        if (cardInfo.creature) {
            var summonTarget = targets[0];
            var square = this.getBattleSquare(summonTarget ? summonTarget.targetSquare : player.sprite.gameSquareId);
            if (!square) {
                throw new Error("Cannot summon a creature on a missing board square.");
            }
            outcome = this.resolveBattleTestSummon(square, cardInfo, player);
        }

        this.refreshBattlePlayerStatus();
        this.renderSquareDetails();

        if (!isAI) {
            this.createHumanCardHand(this.humanHandRoot, this.humanCards);
            this.battleTurnStatus.textContent = "Played " + cardInfo.name + ": " + outcome;
        } else {
            this.battleTurnStatus.textContent = player.name + " played " + cardInfo.name + ": " + outcome;
        }
        return true;
    },

    castBattleSecondSpell: function (cardInfo, player) {
        if (!cardInfo.secondSpell) {
            return;
        }
        var secondCard = masterCardList.find(function (item) {
            return item.id === cardInfo.secondSpell;
        });
        if (!secondCard) {
            return;
        }

        var targets = this.getBattleCardTargets(secondCard, player);
        if (secondCard.targetlocation !== "all") {
            // Without a chooser for secondary spells, hit the first valid target.
            targets = targets.slice(0, 1);
        }
        if (targets.length === 0) {
            this.logBattleEvent(cardInfo.name + "'s " + secondCard.name + " has no target", player);
            return;
        }
        targets.forEach(function (target) {
            this.applyBattleSpell(secondCard, player, target);
        }, this);
    },

    applyBattleSpell: function (cardInfo, player, target) {
        var scene = this;
        var spellName = player.name + "'s " + cardInfo.name;
        var casterIndex = gameVariables.gamePlayerArray.indexOf(player);
        var previousCurrentPlayer = gameVariables.currentPlayer;
        // processSpecialSpell reads the acting player from gameVariables.currentPlayer.
        gameVariables.currentPlayer = casterIndex;

        try {
            var special = cardInfo.special;
            var model = target.model;

            if (special === SPECIAL_EFFECT.MOVE_FORWARD) {
                this.moveBattlePlayer(player, target.targetSquare);
            } else if (special === SPECIAL_EFFECT.NONE || cardInfo.targetlocation === "all") {
                this.applyBattleSpellDamage(cardInfo, player, target, spellName);
            } else if (special === SPECIAL_EFFECT.HEAL) {
                var healthBefore = target.type === "creature" ? model.hitpoints : model.hp;
                processSpecialSpell(cardInfo, model, target.targetSquare, target.type,
                    target.type === "player" ? model.class : model);
                var healed = (target.type === "creature" ? model.hitpoints : model.hp) - healthBefore;
                this.logBattleEvent(healed > 0
                    ? spellName + " heals " + this.describeBattleTarget(target) + " for " + healed
                    : this.describeBattleTarget(target) + " is already at full health",
                    player);
            } else if (special === SPECIAL_EFFECT.BUFF_CREATURE) {
                processSpecialSpell(cardInfo, model, target.targetSquare, target.type, model);
                this.updateBattleCreatureHealth(model);
                this.logBattleEvent(spellName + " gives " + this.describeBattleTarget(target) +
                    " +" + cardInfo.attack + "/+" + cardInfo.defense +
                    (cardInfo.armor ? " and +" + cardInfo.armor + " armor" : ""), player);
            } else if (special === SPECIAL_EFFECT.STEAL_GOLD) {
                var goldBefore = player.gold;
                processSpecialSpell(cardInfo, model, target.targetSquare, target.type, model.class);
                this.logBattleEvent(player.name + " steals " + (player.gold - goldBefore) +
                    " gold from " + model.name, player);
            } else if (special === SPECIAL_EFFECT.DRAW_CARDS) {
                for (var drawIndex = 0; drawIndex < cardInfo.damage; drawIndex++) {
                    if (!scene.drawBattleCard(player)) {
                        scene.logBattleEvent(player.name + " cannot draw any more cards", player);
                        break;
                    }
                }
            } else if (special === SPECIAL_EFFECT.GAIN_GOLD) {
                processSpecialSpell(cardInfo, player, target.targetSquare, "player", player.class);
                this.logBattleEvent(player.name + " gains " + cardInfo.damage + " gold", player);
            } else if (special === SPECIAL_EFFECT.BOOST_MANA) {
                processSpecialSpell(cardInfo, player, target.targetSquare, "player", player.class);
                this.logBattleEvent(player.name + " gains " + cardInfo.damage + " mana", player);
            } else if (special === SPECIAL_EFFECT.SELF_DAMAGE) {
                player.hp = Math.max(player.hp - cardInfo.damage, 0);
                this.logBattleEvent(player.name + " takes " + cardInfo.damage + " damage from " + cardInfo.name, player);
                if (player.hp <= 0) {
                    this.logBattleEvent(player.name + " is defeated", player);
                }
            } else if (special === SPECIAL_EFFECT.BOOST_MAX_MANA) {
                processSpecialSpell(cardInfo, player, target.targetSquare, "player", player.class);
                this.logBattleEvent(player.name + "'s maximum mana increases by " + cardInfo.damage, player);
            }
        } finally {
            gameVariables.currentPlayer = previousCurrentPlayer;
        }
    },

    applyBattleSpellDamage: function (cardInfo, player, target, spellName) {
        if (cardInfo.damage <= 0) {
            return;
        }

        if (target.type === "ground") {
            var square = this.getBattleSquare(target.targetSquare);
            if (square.creature && square.creature.playerOwnedId !== player.id) {
                this.applyBattleSpellDamage(cardInfo, player,
                    { type: "creature", targetSquare: square.id, model: square.creature }, spellName);
            }
            this.battleTestPlayers.forEach(function (occupant) {
                if (occupant !== player && occupant.hp > 0 && occupant.sprite.gameSquareId === square.id) {
                    this.applyBattleSpellDamage(cardInfo, player,
                        { type: "player", targetSquare: square.id, model: occupant }, spellName);
                }
            }, this);
            return;
        }

        var model = target.model;
        var damage = Math.max(cardInfo.damage - (model.armor || 0), 0);
        var targetName = this.describeBattleTarget(target);

        if (target.type === "creature") {
            var owner = this.findBattlePlayer(model.playerOwnedId);
            this.logBattleAttack(spellName, targetName, cardInfo.damage, damage, owner);
            model.hitpoints -= damage;
            if (model.hitpoints <= 0) {
                this.logBattleEvent(targetName + " dies", owner);
                this.removeBattleCreature(model);
                this.getBattleSquare(target.targetSquare).creature = null;
            } else {
                this.updateBattleCreatureHealth(model);
            }
        } else {
            this.logBattleAttack(spellName, targetName, cardInfo.damage, damage, model);
            model.hp = Math.max(model.hp - damage, 0);
            if (damage > 0 && model.hp <= 0) {
                this.logBattleEvent(model.name + " is defeated", model);
            }
        }
    },

    describeBattleTarget: function (target) {
        if (target.type === "player") {
            return target.model.name;
        }
        if (target.type === "creature") {
            var owner = this.findBattlePlayer(target.model.playerOwnedId);
            return (owner ? owner.name : "Unknown") + "'s " + (target.model.cardName || "creature");
        }
        return "square " + target.targetSquare;
    },

    drawBattleCard: function (player) {
        if (player === this.battleTestHuman) {
            if (this.humanCards.length >= this.humanMaxHand) {
                return false;
            }
            var card = this.previewDeck.shift();
            if (!card) {
                return false;
            }
            this.lastDrawnCard = card;
            this.humanCards.push(card);
        } else {
            if (player.hand.length >= player.maxhand) {
                return false;
            }
            var handSize = player.hand.length;
            computerDrawCard(gameVariables.gamePlayerArray.indexOf(player));
            if (player.hand.length === handSize) {
                return false;
            }
        }
        this.logBattleEvent(player.name + " draws a card", player);
        return true;
    },

    refreshBattlePlayerStatus: function () {
        var captureRequirement = gameVariables.boardInfo.captureRequirement || gameVariables.boardInfo.boardTotal;
        this.battleTestPlayers.forEach(function (player) {
            var hand = player === this.battleTestHuman ? this.humanCards : player.hand;
            var labels = [
                [this.playerManaLabels, player.mana + "/" + player.maxmana],
                [this.playerCardCountLabels, hand.length + "/" + (player === this.battleTestHuman ? this.humanMaxHand : player.maxhand)],
                [this.playerCapturedLabels, player.capturedSquares + "/" + captureRequirement],
                [this.playerHealthLabels, player.hp + "/" + player.maxhp]
            ];
            labels.forEach(function (entry) {
                var label = entry[0].get(player);
                if (label) {
                    label.textContent = entry[1];
                }
            });

            var health = this.playerHealthBars.get(player);
            if (health) {
                health.bar.style.width = (player.maxhp > 0
                    ? Math.max(0, Math.min(player.hp / player.maxhp, 1)) * 100
                    : 0) + "%";
                health.container.setAttribute("aria-label", "Health " + player.hp + " of " + player.maxhp);
            }
        }, this);
    },

    showBattleTargetChooser: function (player, cardInfo, hand, targets) {
        var scene = this;
        this.cancelBattleTargeting(true);

        var panel = this.humanHandPanel;
        var hint = panel.querySelector(".battle-hand-heading span");
        hint.textContent = "Choose a target for " + cardInfo.name;
        this.humanCardList.style.display = "none";

        var targeting = { list: null, cancel: null, markers: [] };
        this.battleTargeting = targeting;

        function buildList(groupTargets) {
        var list = document.createElement("div");
        list.className = "battle-target-list";
        groupTargets.forEach(function (target) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "battle-target-button";

            var name = document.createElement("strong");
            name.textContent = scene.describeBattleTarget(target);
            var detail = document.createElement("span");
            var parts = [];
            if (target.type === "creature") {
                parts.push("HP " + target.model.hitpoints + "/" + target.model.maxhitpoints);
            } else if (target.type === "player") {
                parts.push("HP " + target.model.hp + "/" + target.model.maxhp);
            }
            parts.push("Square " + target.targetSquare);
            detail.textContent = parts.join(" · ");
            button.appendChild(name);
            button.appendChild(detail);

            button.addEventListener("click", function () {
                scene.castBattleCard(player, cardInfo, hand, [target], false);
            });
            ["mouseenter", "focus"].forEach(function (eventName) {
                button.addEventListener(eventName, function () {
                    scene.showSquareDetails(target.targetSquare);
                });
            });
            ["mouseleave", "blur"].forEach(function (eventName) {
                button.addEventListener(eventName, function () {
                    scene.showSquareDetails(null);
                });
            });
            list.appendChild(button);
        });
        return list;
        }

        // The dialog only appears when the chosen square holds more than one possible target.
        function chooseSquare(squareId) {
            var group = targets.filter(function (target) {
                return target.targetSquare === squareId;
            });
            if (group.length === 1) {
                scene.castBattleCard(player, cardInfo, hand, group, false);
                return;
            }
            if (targeting.list) {
                targeting.list.remove();
            }
            targeting.list = buildList(group);
            panel.insertBefore(targeting.list, targeting.cancel);
            scene.battleTurnStatus.textContent = "Choose a target on square " + squareId + ".";
        }

        var cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "battle-target-cancel";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", function () {
            scene.cancelBattleTargeting();
            scene.battleTurnStatus.textContent = "Cancelled " + cardInfo.name + ".";
        });
        panel.appendChild(cancel);
        targeting.cancel = cancel;

        var squareIds = [];
        targets.forEach(function (target) {
            if (squareIds.indexOf(target.targetSquare) === -1) {
                squareIds.push(target.targetSquare);
            }
        });
        squareIds.forEach(function (squareId) {
            var position = scene.squarePositions.get(squareId);
            var marker = game.add.sprite(position.x, position.y, "battle-target");
            marker.width = scene.tileSize * 0.58;
            marker.height = scene.tileSize * 0.58;
            marker.anchor.set(0.5);
            marker.__legacyVisual.setTint(0xff7a59);
            marker.alpha = 0.95;
            marker.inputEnabled = true;
            marker.useHandCursor = true;
            marker.events.onInputOver.add(function () {
                marker.setScale(1.2);
                marker.__legacyVisual.setTint(0xffb199);
                scene.showSquareDetails(squareId);
            });
            marker.events.onInputOut.add(function () {
                marker.setScale(1);
                marker.__legacyVisual.setTint(0xff7a59);
                scene.showSquareDetails(null);
            });
            marker.events.onInputDown.add(function () {
                chooseSquare(squareId);
            });
            scene.spellEffectLayer.add(marker);
            scene.boardSquares.push(marker);
            targeting.markers.push(marker);
        });

        this.battleTurnStatus.textContent = "Click a highlighted square to target " + cardInfo.name + ".";
    },

    cancelBattleTargeting: function (keepHand) {
        if (!this.battleTargeting) {
            return;
        }
        if (this.battleTargeting.list) {
            this.battleTargeting.list.remove();
        }
        this.battleTargeting.cancel.remove();
        this.battleTargeting.markers.forEach(function (marker) {
            var index = this.boardSquares.indexOf(marker);
            if (index >= 0) {
                this.boardSquares.splice(index, 1);
            }
            marker.destroy();
        }, this);
        this.battleTargeting = null;
        this.showSquareDetails(null);
        if (!keepHand) {
            this.createHumanCardHand(this.humanHandRoot, this.humanCards);
        }
    },

    resolveBattleTestSummon: function (square, cardInfo, player) {
        var previousCreature = square.creature;
        var outcome;
        if (!previousCreature || previousCreature.playerOwnedId === player.id) {
            if (previousCreature) {
                this.removeBattleCreature(previousCreature);
            }
            this.createBattleCreature(square, cardInfo, player, cardInfo.defense);
            this.logBattleEvent(player.name + " summons " + cardInfo.name + " on square " + square.id, player);
            this.captureBattleSquare(square, player);
            outcome = previousCreature
                ? "replaced your creature"
                : "summoned " + cardInfo.name + " and captured square " + square.id;
        } else {
            var defenderDamage = Math.max(cardInfo.attack - previousCreature.armor, 0);
            var attackerDamage = Math.max(previousCreature.attack - cardInfo.armor, 0);
            var defenderHp = previousCreature.hitpoints;
            var attackerHp = cardInfo.defense;
            var defenderOwner = this.findBattlePlayer(previousCreature.playerOwnedId);
            var attackerName = player.name + "'s " + cardInfo.name;
            var defenderName = (defenderOwner ? defenderOwner.name : "Unknown") + "'s " +
                (previousCreature.cardName || "creature");
            var stalemate = defenderDamage === 0 && attackerDamage === 0;
            var rounds = 0;

            // Each round both creatures strike simultaneously until at least one is defeated.
            do {
                rounds++;
                if (rounds > 1) {
                    this.logBattleEvent("Combat round " + rounds + " on square " + square.id);
                }
                this.logBattleAttack(attackerName, defenderName, cardInfo.attack, defenderDamage, player);
                if (previousCreature.attack > 0) {
                    this.logBattleAttack(defenderName, attackerName, previousCreature.attack, attackerDamage,
                        defenderOwner);
                }
                defenderHp -= defenderDamage;
                attackerHp -= attackerDamage;
            } while (!stalemate && defenderHp > 0 && attackerHp > 0);

            if (stalemate) {
                this.logBattleEvent(attackerName + " is spent; " + defenderName + " holds the square",
                    defenderOwner);
            }
            if (attackerHp <= 0) {
                this.logBattleEvent(attackerName + " dies", player);
            }
            if (defenderHp <= 0) {
                this.logBattleEvent(defenderName + " dies", defenderOwner);
            }

            if (defenderHp > 0) {
                previousCreature.hitpoints = defenderHp;
                this.updateBattleCreatureHealth(previousCreature);
                outcome = stalemate
                    ? cardInfo.name + " could not hurt the defending creature."
                    : cardInfo.name + " was defeated by the defending creature.";
            } else {
                this.removeBattleCreature(previousCreature);
                square.creature = null;
                if (attackerHp > 0) {
                    this.createBattleCreature(square, cardInfo, player, attackerHp);
                    this.captureBattleSquare(square, player);
                    outcome = cardInfo.name + " defeated the defending creature and captured square " +
                        square.id + ".";
                } else {
                    outcome = "Both creatures were defeated. Square " + square.id + " is now empty.";
                }
            }
        }
        return outcome;
    },

    createBattleCreature: function (square, cardInfo, player, hitpoints) {
        var position = this.squarePositions.get(square.id);
        var creatureSprite = game.add.sprite(position.x, position.y, cardInfo.image);
        creatureSprite.width = this.tileSize * 0.8;
        creatureSprite.height = this.tileSize * 0.8;
        creatureSprite.anchor.set(0.5);
        this.creatureLayer.add(creatureSprite);
        this.boardSquares.push(creatureSprite);

        var barWidth = this.tileSize * 0.8;
        var barX = position.x - barWidth / 2;
        var barY = position.y + this.tileSize * 0.36;
        var healthBackground = game.add.sprite(barX, barY, "gpix");
        healthBackground.width = barWidth;
        healthBackground.height = 3;
        var healthDamage = game.add.sprite(barX, barY, "rpix");
        healthDamage.height = 3;
        this.creatureLayer.add(healthBackground);
        this.creatureLayer.add(healthDamage);
        this.boardSquares.push(healthBackground, healthDamage);

        square.creature = new gameSquareCreature(
            cardInfo.id,
            square.id,
            creatureSprite,
            hitpoints,
            cardInfo.defense,
            cardInfo.armor,
            cardInfo.attack,
            cardInfo.defense,
            player.id
        );
        square.creature.cardName = cardInfo.name;
        square.creature.hitspritegreen = healthBackground;
        square.creature.hitspritered = healthDamage;
        this.updateBattleCreatureHealth(square.creature);
    },

    updateBattleCreatureHealth: function (creature) {
        var maxHealth = Math.max(creature.maxhitpoints, 1);
        var healthRatio = Math.max(0, Math.min(creature.hitpoints / maxHealth, 1));
        var damageWidth = creature.hitspritegreen.width * (1 - healthRatio);
        creature.hitspritered.width = damageWidth;
        creature.hitspritered.x = creature.hitspritegreen.x +
            creature.hitspritegreen.width - damageWidth;
    },

    removeBattleCreature: function (creature) {
        [creature.sprite, creature.hitspritegreen, creature.hitspritered].forEach(function (sprite) {
            if (sprite && sprite.destroy) {
                sprite.destroy();
            }
        });
    },

    findBattlePlayer: function (playerId) {
        return gameVariables.gamePlayerArray.find(function (candidate) {
            return candidate.id === playerId;
        });
    },

    logBattleEvent: function (message, player) {
        if (this.eventLog) {
            message = message.replace(/\bYou's\b/g, "Your")
                .replace(/\bYou is\b/g, "You are")
                .replace(/\bYou (draw|pass|summon|capture|deal|cast|heal|give|steal|gain|take)e?s\b/g, "You $1")
                .replace(/\bYou passes\b/g, "You pass")
                .replace(/\b(to|from|for|heals|gives|steals from) You\b/g, "$1 you");
            this.eventLog.add(message, player && player.color ? this.getBattleLogAccent(player) : null);
        }
    },

    logBattleAttack: function (attackerName, defenderName, attack, damage, owner) {
        var blocked = attack - damage;
        if (damage > 0) {
            this.logBattleEvent(attackerName + " deals " + damage + " damage to " + defenderName +
                (blocked > 0 ? " (" + blocked + " blocked by armor)" : ""), owner);
        } else if (blocked > 0) {
            this.logBattleEvent(defenderName + "'s armor blocks all " + blocked + " damage from " +
                attackerName, owner);
        }
    },

    getBattleLogAccent: function (player) {
        var card = this.playerStatusCards && this.playerStatusCards.get(player);
        return card ? window.getComputedStyle(card).getPropertyValue("--school-accent").trim() || null : null;
    },

    captureBattleSquare: function (square, player) {
        if (square.ownerPlayerId === player.id) {
            return;
        }
        if (square.ownerPlayerId !== undefined) {
            var previousOwner = this.findBattlePlayer(square.ownerPlayerId);
            if (previousOwner) {
                previousOwner.capturedSquares = Math.max(0, previousOwner.capturedSquares - 1);
                this.logBattleEvent(previousOwner.name + "'s square " + square.id +
                    " is captured by " + player.name, player);
            }
        } else {
            this.logBattleEvent(player.name + " captures square " + square.id, player);
        }
        square.ownerPlayerId = player.id;
        player.capturedSquares++;
        square.sprite.loadTexture(player.color);
        square.sprite.width = this.tileSize;
        square.sprite.height = this.tileSize;
    },

    createTurnControls: function (panel) {
        var controls = document.createElement("section");
        controls.className = "battle-turn-controls";
        controls.setAttribute("aria-label", "Your turn actions");

        var heading = document.createElement("h2");
        heading.textContent = "Your turn";

        var actionRow = document.createElement("div");
        actionRow.className = "battle-turn-action-row";

        var die = document.createElement("div");
        die.className = "battle-die";
        die.setAttribute("role", "img");
        die.setAttribute("aria-label", "Dice not rolled");
        die.textContent = "—";
        this.battleDie = die;

        var actionCopy = document.createElement("div");
        actionCopy.className = "battle-turn-action-copy";
        var status = document.createElement("p");
        status.className = "battle-turn-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = "Preparing your turn…";
        this.battleTurnStatus = status;

        var rollButton = document.createElement("button");
        rollButton.className = "battle-roll-button";
        rollButton.type = "button";
        rollButton.textContent = "Roll Dice";
        rollButton.disabled = true;
        rollButton.addEventListener("click", this.rollBattleTestDie.bind(this));
        this.battleRollButton = rollButton;

        var passButton = document.createElement("button");
        passButton.className = "battle-pass-button";
        passButton.type = "button";
        passButton.textContent = "Pass Turn";
        passButton.disabled = true;
        passButton.addEventListener("click", this.passBattleTestTurn.bind(this));
        this.battlePassButton = passButton;

        actionCopy.appendChild(status);
        actionCopy.appendChild(rollButton);
        actionCopy.appendChild(passButton);
        actionRow.appendChild(die);
        actionRow.appendChild(actionCopy);
        controls.appendChild(heading);
        controls.appendChild(actionRow);
        panel.appendChild(controls);
    },

    startBattleTurn: function () {
        var scene = this;
        this.battleTestHuman.mana = this.battleTestHuman.maxmana;
        var manaCount = this.playerManaLabels.get(this.battleTestHuman);
        if (manaCount) {
            manaCount.textContent = this.battleTestHuman.mana + "/" + this.battleTestHuman.maxmana;
        }
        this.battleTurnStatus.textContent = "Drawing a card…";
        this.logBattleEvent(this.battleTestHuman.name + "'s turn begins", this.battleTestHuman);

        window.setTimeout(function () {
            if (scene.humanCards.length >= scene.humanMaxHand) {
                scene.battleTurnStatus.textContent = "Your hand is full. Roll when ready.";
                scene.battleRollButton.disabled = false;
                return;
            }

            var card = scene.previewDeck.shift();
            if (!card) {
                scene.battleTurnStatus.textContent = "No cards left to draw. Roll when ready.";
                scene.battleRollButton.disabled = false;
                return;
            }

            scene.lastDrawnCard = card;
            scene.humanCards.push(card);
            scene.logBattleEvent(scene.battleTestHuman.name + " draws a card", scene.battleTestHuman);
            scene.createHumanCardHand(scene.humanHandRoot, scene.humanCards);
            scene.humanCardCountLabel.textContent =
                scene.humanCards.length + "/" + scene.humanMaxHand;
            scene.battleTurnStatus.textContent = "Drew " + card.name + ". Roll when ready.";

            window.setTimeout(function () {
                scene.battleRollButton.disabled = false;
            }, 700);
        }, 250);
    },

    setBattleTestActivePlayer: function (activePlayer) {
        this.playerStatusCards.forEach(function (card, player) {
            card.classList.toggle("is-active", player === activePlayer);
            var turnBadge = card.querySelector(".battle-turn-badge");
            turnBadge.hidden = player !== activePlayer;
        });
    },

    rollBattleTestDie: function () {
        if (this.battleRollButton.disabled) {
            return;
        }

        this.battleRollButton.disabled = true;
        this.battleRollButton.textContent = "Rolling…";
        this.battleDie.classList.add("is-rolling");
        this.battleTurnStatus.textContent = "Rolling the dice…";

        var scene = this;
        var result = 1 + Math.floor(Math.random() * 6);
        var rollTimer = window.setInterval(function () {
            scene.battleDie.textContent = String(1 + Math.floor(Math.random() * 6));
        }, 75);

        window.setTimeout(function () {
            window.clearInterval(rollTimer);
            scene.battleDie.classList.remove("is-rolling");
            scene.battleDie.textContent = String(result);
            scene.battleDie.setAttribute("aria-label", "Dice result " + result);
            scene.logBattleEvent(scene.battleTestHuman.name + " rolled a " + result, scene.battleTestHuman);
            scene.battleTurnStatus.textContent = "You rolled a " + result + ". Moving…";
            scene.battleRollButton.textContent = "Moving…";
            computerAI.movePlayer(
                scene.battleTestHuman,
                result,
                function (pathIds, continueMovement, routes, continueRoute) {
                    scene.showBattleDirectionChoices(pathIds, continueMovement, routes, continueRoute);
                },
                function () {
                    scene.battleTurnStatus.textContent =
                        "Movement complete. You are on square " + scene.battleTestHuman.sprite.gameSquareId + ".";
                    scene.battleRollButton.textContent = "Move complete";
                    scene.battlePassButton.disabled = false;
                },
                function (player) {
                    var manaCount = scene.playerManaLabels.get(player);
                    if (manaCount) {
                        manaCount.textContent = player.mana + "/" + player.maxmana;
                    }
                }
            );
        }, 700);
    },

    // A player ending their turn on a square with an opposing creature takes that creature's attack.
    applyEndOfTurnCreatureDamage: function (player) {
        if (player.hp <= 0) {
            return;
        }
        var square = this.getBattleSquare(player.sprite.gameSquareId);
        var creature = square && square.creature;
        if (!creature || creature.playerOwnedId === player.id || creature.attack <= 0) {
            return;
        }

        var owner = this.findBattlePlayer(creature.playerOwnedId);
        var attackerName = (owner ? owner.name : "Unknown") + "'s " + (creature.cardName || "creature");
        var damage = Math.max(creature.attack - (player.armor || 0), 0);
        this.logBattleAttack(attackerName, player.name, creature.attack, damage, player);
        player.hp = Math.max(player.hp - damage, 0);
        if (damage > 0 && player.hp <= 0) {
            this.logBattleEvent(player.name + " is defeated", player);
        }
        this.refreshBattlePlayerStatus();
    },

    passBattleTestTurn: function () {
        if (this.battlePassButton.disabled) {
            return;
        }

        this.cancelBattleTargeting();
        this.logBattleEvent(this.battleTestHuman.name + " passes the turn", this.battleTestHuman);
        this.applyEndOfTurnCreatureDamage(this.battleTestHuman);
        this.humanTurnActive = false;
        this.battlePassButton.disabled = true;
        this.battlePassButton.textContent = "AI turns…";
        this.battleTurnStatus.textContent = "Turn passed. AI players are taking their turns.";
        this.battleRollButton.textContent = "AI turn";

        var scene = this;
        computerAI.runBattleTestTurns(this.battleTestPlayers, {
            onTurnBegin: function (player) {
                scene.logBattleEvent(player.name + "'s turn begins", player);
            },
            onDrawCard: function (player) {
                scene.logBattleEvent(player.name + " draws a card", player);
            },
            onTurnStart: function (player, roll) {
                scene.logBattleEvent(player.name + " rolled a " + roll, player);
                scene.setBattleTestActivePlayer(player);
                var cardCount = scene.playerCardCountLabels.get(player);
                if (cardCount) {
                    cardCount.textContent = player.hand.length + "/" + player.maxhand;
                }
                var manaCount = scene.playerManaLabels.get(player);
                if (manaCount) {
                    manaCount.textContent = player.mana + "/" + player.maxmana;
                }
                scene.battleTurnStatus.textContent = player.name + " rolled a " + roll + ".";
                scene.battleDie.textContent = String(roll);
                scene.battleDie.setAttribute("aria-label", player.name + " rolled " + roll);
                scene.battleDie.classList.add("is-rolling");
            },
            playCards: function (player) {
                scene.playBattleTestAICards(player);
            },
            onStartCrossed: function (player) {
                var manaCount = scene.playerManaLabels.get(player);
                if (manaCount) {
                    manaCount.textContent = player.mana + "/" + player.maxmana;
                }
            },
            onTurnComplete: function (player) {
                scene.applyEndOfTurnCreatureDamage(player);
                scene.battleDie.classList.remove("is-rolling");
                var manaCount = scene.playerManaLabels.get(player);
                if (manaCount) {
                    manaCount.textContent = player.mana + "/" + player.maxmana;
                }
                scene.battleTurnStatus.textContent =
                    player.name + " finished on square " + player.sprite.gameSquareId + ".";
            },
            onComplete: function () {
                scene.setBattleTestActivePlayer(scene.battleTestHuman);
                scene.humanTurnActive = true;
                scene.battleDie.classList.remove("is-rolling");
                scene.battleDie.textContent = "—";
                scene.battleDie.setAttribute("aria-label", "Dice not rolled");
                scene.battlePassButton.textContent = "Pass Turn";
                scene.battleRollButton.textContent = "Roll Dice";
                scene.battleRollButton.disabled = true;
                scene.battleTurnStatus.textContent = "Your turn. Drawing a card…";
                scene.startBattleTurn();
            }
        });
    },

    showBattleDirectionChoices: function (pathIds, continueMovement, routes, continueRoute) {
        var scene = this;
        var controls = this.battleRollButton.parentElement;
        var choices = document.createElement("div");
        choices.className = "battle-direction-choices";
        choices.setAttribute("aria-label", "Choose a movement direction");
        choices.style.gridTemplateColumns = "repeat(" + pathIds.length + ", minmax(0, 1fr))";

        this.battleTurnStatus.textContent = "Choose a direction or highlighted destination.";
        this.battleRollButton.textContent = "Choose direction";

        this.clearMovementTargets();
        this.movementTargetSprites = new Map();
        var current = this.squarePositions.get(this.battleTestHuman.sprite.gameSquareId);
        var directions = pathIds.map(function (squareId) {
            var destination = scene.squarePositions.get(squareId);
            var arrow;
            if (destination.x < current.x) {
                arrow = "←";
            } else if (destination.x > current.x) {
                arrow = "→";
            } else if (destination.y < current.y) {
                arrow = "↑";
            } else {
                arrow = "↓";
            }

            return {
                squareId: squareId,
                destination: destination,
                arrow: arrow
            };
        });

        if (directions.length === 2) {
            directions.sort(function (first, second) {
                return first.destination.x - second.destination.x ||
                    first.destination.y - second.destination.y;
            });
            directions[0].category = "Left";
            directions[1].category = "Right";
        } else {
            directions.forEach(function (choice) {
                if (choice.destination.x < current.x) {
                    choice.category = "Left";
                } else if (choice.destination.x > current.x) {
                    choice.category = "Right";
                } else {
                    choice.category = "Middle";
                }
            });
        }

        var routesByFirstSquare = new Map();
        routes.forEach(function (route) {
            var firstSquareId = route[0];
            if (!routesByFirstSquare.has(firstSquareId)) {
                routesByFirstSquare.set(firstSquareId, []);
            }
            routesByFirstSquare.get(firstSquareId).push(route);
        });

        var routesByTargetSquare = new Map();
        routes.forEach(function (route) {
            var targetSquareId = route[route.length - 1];
            if (!routesByTargetSquare.has(targetSquareId)) {
                routesByTargetSquare.set(targetSquareId, route);
            }
        });

        routesByTargetSquare.forEach(function (route, targetSquareId) {
            var destination = scene.squarePositions.get(targetSquareId);
            var target = game.add.sprite(destination.x, destination.y, "battle-target");
            target.width = scene.tileSize * 0.58;
            target.height = scene.tileSize * 0.58;
            target.anchor.set(0.5);
            target.__legacyVisual.setTint(0xffd84d);
            target.alpha = 0.95;
            target.inputEnabled = true;
            target.useHandCursor = true;
            target.events.onInputOver.add(function () {
                target.setScale(1.2);
                target.__legacyVisual.setTint(0xffffa8);
            });
            target.events.onInputOut.add(function () {
                target.setScale(1);
                target.__legacyVisual.setTint(0xffd84d);
            });
            target.events.onInputDown.add(function () {
                scene.clearMovementTargets();
                choices.remove();
                continueRoute(route);
            });
            scene.spellEffectLayer.add(target);
            scene.movementTargetSprites.set(targetSquareId, target);
            scene.boardSquares.push(target);
        });

        directions.sort(function (first, second) {
            var order = { Left: 0, Right: 1, Middle: 2 };
            return order[first.category] - order[second.category];
        });

        directions.forEach(function (choice) {
            var choiceButton = document.createElement("button");
            choiceButton.className = "battle-direction-button";
            choiceButton.type = "button";
            choiceButton.setAttribute("aria-label",
                choice.category + " direction " + choice.arrow + ", destination square " + choice.squareId);
            var label = document.createElement("span");
            label.className = "battle-direction-label";
            label.textContent = choice.category;
            var arrow = document.createElement("span");
            arrow.className = "battle-direction-arrow";
            arrow.setAttribute("aria-hidden", "true");
            arrow.textContent = choice.arrow;
            choiceButton.appendChild(label);
            choiceButton.appendChild(arrow);
            function setRouteTargets(scale) {
                (routesByFirstSquare.get(choice.squareId) || []).forEach(function (route) {
                    var target = scene.movementTargetSprites.get(route[route.length - 1]);
                    if (target) {
                        target.alpha = 1;
                        target.setScale(scale);
                    }
                });
            }
            choiceButton.addEventListener("mouseenter", function () {
                setRouteTargets(1.3);
            });
            choiceButton.addEventListener("mouseleave", function () {
                setRouteTargets(1);
            });
            choiceButton.addEventListener("focus", function () {
                setRouteTargets(1.3);
            });
            choiceButton.addEventListener("blur", function () {
                setRouteTargets(1);
            });
            choiceButton.addEventListener("click", function () {
                scene.clearMovementTargets();
                choices.remove();
                continueMovement(choice.squareId);
            }, { once: true });
            choices.appendChild(choiceButton);
        });

        controls.appendChild(choices);
    },

    clearMovementTargets: function () {
        if (!this.movementTargetSprites) {
            return;
        }

        this.movementTargetSprites.forEach(function (target) {
            target.destroy();
        });
        this.movementTargetSprites.clear();
    }
};
