// Per-class starting stats for the human player, loaded from assets/players-data/playerdata.csv.
var playerClassData = {};

function loadPlayerData() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                processPlayerData(xmlhttp.responseText);
            } else {
                showLoadError({ src: "assets/players-data/playerdata.csv" });
            }
        }
    };

    xmlhttp.open("GET", gameAssetUrl("assets/players-data/playerdata.csv"), true);
    xmlhttp.send();
}

function processPlayerData(allText) {
    var rows = parseCardCsv(allText);
    if (rows.length === 0) {
        throw new Error("Player data CSV is empty.");
    }

    var headers = rows[0].map(normalizeCardHeader);
    var columns = {
        playerClass: "class",
        maxHealth: "maxhp",
        healthBonus: "hpbonus",
        attack: "attack",
        attackBonus: "attackbonus",
        minMovement: "minmovement",
        minMovementBonus: "minmovementbonus",
        maxMovement: "maxmovement",
        maxMovementBonus: "maxmovementbonus",
        startingHandSize: "startinghandsize",
        startingHandBonus: "startinghandbonus",
        maxHand: "maxhandsize",
        maxHandBonus: "maxhandbonus",
        armor: "armor",
        armorBonus: "armorbonus",
        goldBonus: "goldbonus",
        startingGold: "goldvalue",
        asset: "asset",
        startingCardList: "startingcardlist"
    };
    var columnIndexes = {};
    Object.keys(columns).forEach(function (field) {
        columnIndexes[field] = headers.indexOf(columns[field]);
        if (columnIndexes[field] === -1) {
            throw new Error("Player data CSV is missing the " + field + " column.");
        }
    });

    function number(row, field) {
        var value = Number(row[columnIndexes[field]]);
        return isNaN(value) ? 0 : value;
    }

    Object.keys(playerClassData).forEach(function (key) {
        delete playerClassData[key];
    });
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (row.every(function (value) { return value.trim() === ""; })) {
            continue;
        }
        var playerClass = row[columnIndexes.playerClass].trim().toLowerCase();
        playerClassData[playerClass] = {
            maxHealth: number(row, "maxHealth"),
            attack: number(row, "attack"),
            minMovement: number(row, "minMovement"),
            maxMovement: number(row, "maxMovement"),
            startingHandSize: number(row, "startingHandSize"),
            maxHand: number(row, "maxHand"),
            armor: number(row, "armor"),
            startingGold: number(row, "startingGold"),
            // Display-only strength markers (e.g. HP+, Movement++); the stat columns already include them.
            bonuses: {
                health: number(row, "healthBonus"),
                attack: number(row, "attackBonus"),
                minMovement: number(row, "minMovementBonus"),
                maxMovement: number(row, "maxMovementBonus"),
                startingHand: number(row, "startingHandBonus"),
                maxHand: number(row, "maxHandBonus"),
                armor: number(row, "armorBonus"),
                gold: number(row, "goldBonus")
            },
            asset: /\.\w+$/.test(row[columnIndexes.asset].trim())
                ? row[columnIndexes.asset].trim()
                : row[columnIndexes.asset].trim() + ".png",
            startingCardIds: row[columnIndexes.startingCardList].split(";").map(function (id) {
                return id.trim();
            }).filter(function (id) {
                return id !== "";
            })
        };
    }
}

// Copies a class's row from the player data into the human player variables.
// Returns false when the class has no row (or the CSV has not loaded yet).
function applyPlayerClassData(playerClass) {
    var data = playerClassData[String(playerClass).toLowerCase()];
    if (!data) {
        return false;
    }

    gameVariables.playerMaxHealth = data.maxHealth;
    gameVariables.playerHealth = data.maxHealth;
    gameVariables.playerAttack = data.attack;
    gameVariables.playerMinMovement = data.minMovement;
    gameVariables.playerMaxMovement = data.maxMovement;
    gameVariables.playerStartingHandSize = data.startingHandSize;
    gameVariables.playerMaxHand = data.maxHand;
    gameVariables.playerArmor = data.armor;
    gameVariables.playerStartingGold = data.startingGold;
    gameVariables.playerGold = data.startingGold;
    gameVariables.playerAsset = data.asset;
    gameVariables.playerStartingCardList = populateCardArray(data.startingCardIds);
    return true;
}

// Portrait file for a class: the Asset column of the player data, else the class-name default.
function classPortraitFile(playerClass) {
    var data = playerClassData[String(playerClass).toLowerCase()];
    return data && data.asset ? data.asset : playerPortraitFile(playerClass);
}

// Portrait file for a player in battle. The human uses the asset seeded into gameVariables.
function playerAssetFile(player) {
    if (player.human && gameVariables.playerAsset) {
        return gameVariables.playerAsset;
    }
    return classPortraitFile(player.class);
}

loadPlayerData();
