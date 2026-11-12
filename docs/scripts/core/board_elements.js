// Data-driven board elements: boards place them with addBoardElement(board, squareId, elementId, x, y)
// and the per-element data (assets, type, repeatable, target) comes from boardelementdata.csv.
// For doors, x is the ID of the blocked square to open.
var BOARD_ELEMENT_TYPE = {
    manaFountain: 1,
    chest: 2,
    damageTrap: 3,
    movementTrap: 4,
    teleport: 5,
    alarm: 6,
    event: 7,
    healthFountain: 8,
    cardAltar: 9,
    door: 10,
    start: 11,
    sarcophagus: 12,
    itemAltar: 13,
    creatureAltar: 14
};

var BOARD_ELEMENT_EMPTY_ASSET = "empty";

// Chest special effects by special effect id y. Each is called with the scene as `this`
// and receives (player, placedElement). Ids without an entry give no special reward.
var BOARD_ELEMENT_CHEST_SPECIALS = {};
var masterBoardElementList = [];

function addBoardElement(board, squareId, elementId, effectValue, specialEffectId) {
    board.elements = board.elements || [];
    board.elements.push({
        squareId: squareId,
        elementId: elementId,
        x: effectValue || 0,
        y: specialEffectId || 0,
        triggered: 0
    });
}

function getBoardElementData(elementId) {
    return masterBoardElementList.find(function (data) {
        return data.id === elementId;
    });
}

function boardElementTextureKey(assetName) {
    return "element-" + assetName;
}

function loadBoardElementList() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            processBoardElementData(request.responseText);
        }
    };
    request.open("GET", gameAssetUrl("assets/board-elements-data/boardelementdata.csv"), true);
    request.send();
}

function processBoardElementData(allText) {
    var rows = parseCardCsv(allText);
    if (rows.length < 2) {
        throw new Error("Board element data CSV is empty.");
    }
    var headers = rows[0].map(normalizeCardHeader);
    var column = function (name) {
        return headers.indexOf(name);
    };
    var columns = {
        id: column("elementid"),
        name: column("name"),
        description: column("description"),
        assetBefore: column("assetbefore"),
        assetAfter: column("assetafter"),
        type: column("type"),
        repeatable: column("repeatable"),
        target: column("target"),
        effectValue: column("effectvalue"),
        specialEffectId: column("specialeffectid")
    };
    Object.keys(columns).forEach(function (key) {
        if (columns[key] < 0) {
            throw new Error("Board element data CSV is missing the " + key + " column.");
        }
    });

    masterBoardElementList = [];
    rows.slice(1).forEach(function (row) {
        var id = parseInt(row[columns.id], 10);
        if (isNaN(id)) {
            return;
        }
        var cell = function (key) {
            return (row[columns[key]] || "").trim();
        };
        masterBoardElementList.push({
            id: id,
            name: cell("name"),
            description: cell("description"),
            assetBefore: cell("assetBefore"),
            assetAfter: cell("assetAfter"),
            type: parseInt(cell("type"), 10) || 0,
            repeatable: cell("repeatable") === "1",
            target: cell("target").toLowerCase() === "human" ? "human" : "any",
            // Non-numeric defaults such as "x" and "y" mean the board supplies the value.
            effectValue: parseInt(cell("effectValue"), 10) || 0,
            specialEffectId: parseInt(cell("specialEffectId"), 10) || 0
        });
    });
}

loadBoardElementList();
