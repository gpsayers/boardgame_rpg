// Enemy definitions loaded from assets/players/enemy-players-data/enemydata.csv.
var enemyData = {};
var ENEMY_PORTRAIT_PATH = "players/enemy-players/";
// Computer-only schools, so enemies never share a school or square colour with the human classes.
var ENEMY_SCHOOLS = ["Animal", "Soldier", "Magical", "Elite", "Boss"];

function loadEnemyData() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                processEnemyData(xmlhttp.responseText);
            } else {
                showLoadError({ src: "assets/players/enemy-players-data/enemydata.csv" });
            }
        }
    };

    xmlhttp.open("GET", gameAssetUrl("assets/players/enemy-players-data/enemydata.csv"), true);
    xmlhttp.send();
}

function processEnemyData(allText) {
    var rows = parseCardCsv(allText);
    if (rows.length === 0) {
        throw new Error("Enemy data CSV is empty.");
    }

    var headers = rows[0].map(normalizeCardHeader);
    var columns = {
        name: "name",
        hpBonus: "hpbonus",
        maxHealth: "maxhp",
        attackBonus: "attackbonus",
        attack: "attack",
        minMovementBonus: "minmovementbonus",
        minMovement: "minmovement",
        maxMovementBonus: "maxmovementbonus",
        maxMovement: "maxmovement",
        startingHandBonus: "startinghandbonus",
        startingHandSize: "startinghandsize",
        maxHandBonus: "maxhandbonus",
        maxHand: "maxhandsize",
        armorBonus: "armorbonus",
        armor: "armor",
        goldBonus: "goldbonus",
        gold: "goldvalue",
        skillPoints: "totalskillpoints",
        asset: "asset",
        startingCardList: "startingcardlist",
        school: "school"
    };
    var columnIndexes = {};
    Object.keys(columns).forEach(function (field) {
        columnIndexes[field] = headers.indexOf(columns[field]);
        if (columnIndexes[field] === -1) {
            throw new Error("Enemy data CSV is missing the " + field + " column.");
        }
    });

    function number(row, field) {
        var value = Number(row[columnIndexes[field]]);
        return isNaN(value) ? 0 : value;
    }

    Object.keys(enemyData).forEach(function (key) {
        delete enemyData[key];
    });
    var order = 0;
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (row.every(function (value) { return value.trim() === ""; })) {
            continue;
        }
        var name = row[columnIndexes.name].trim();
        var asset = row[columnIndexes.asset].trim();
        enemyData[enemyKey(name)] = {
            name: name,
            order: order,
            maxHealth: number(row, "maxHealth"),
            attack: number(row, "attack"),
            minMovement: number(row, "minMovement"),
            maxMovement: number(row, "maxMovement"),
            startingHandSize: number(row, "startingHandSize"),
            maxHand: number(row, "maxHand"),
            armor: number(row, "armor"),
            gold: number(row, "gold"),
            // Display-only strength markers (e.g. HP+, Movement++); the stat columns already include them.
            bonuses: {
                health: number(row, "hpBonus"),
                attack: number(row, "attackBonus"),
                minMovement: number(row, "minMovementBonus"),
                maxMovement: number(row, "maxMovementBonus"),
                startingHand: number(row, "startingHandBonus"),
                maxHand: number(row, "maxHandBonus"),
                armor: number(row, "armorBonus"),
                gold: number(row, "goldBonus")
            },
            school: enemySchool(row[columnIndexes.school], order),
            skillPoints: number(row, "skillPoints"),
            asset: asset && !/\.[a-z0-9]+$/i.test(asset) ? asset + ".png" : asset,
            startingCardIds: row[columnIndexes.startingCardList].split(/[;,]/).map(function (id) {
                return id.trim();
            }).filter(function (id) {
                return id !== "";
            })
        };
        order++;
    }
}

// The enemy key doubles as the player's class, so it is also the battle texture suffix.
function enemyKey(name) {
    return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

// Matches the School column to a computer school (case-insensitive); unknown values fall back by row order.
function enemySchool(value, order) {
    var wanted = String(value || "").trim().toLowerCase();
    var match = ENEMY_SCHOOLS.find(function (school) {
        return school.toLowerCase() === wanted;
    });
    return match || ENEMY_SCHOOLS[order % ENEMY_SCHOOLS.length];
}

function enemyPortraitFile(enemy) {
    return ENEMY_PORTRAIT_PATH + enemy.asset;
}

// Builds a computer player from an enemy row, or null when the enemy is unknown.
function createEnemyPlayer(key, id, square) {
    var data = enemyData[key];
    if (!data) {
        return null;
    }

    var player = new gamePlayer(
        id,
        square,
        data.name,
        key,
        data.school,
        data.maxHealth,
        1,
        false,
        populateCardArray(data.startingCardIds),
        data.maxHand,
        data.gold,
        data.armor
    );
    player.aiProfile = "opportunist";
    player.enemyKey = key;
    player.attack = data.attack;
    player.minMovement = data.minMovement;
    player.maxMovement = data.maxMovement;
    player.startingHandSize = data.startingHandSize;
    player.asset = data.asset;
    player.skillPoints = data.skillPoints;
    return player;
}

loadEnemyData();
