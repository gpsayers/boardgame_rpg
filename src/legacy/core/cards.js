
masterCardList = [];

cavalierCardList = [6, 6, 21, 21, 23, 23, 17, 17, 21, 36];

tricksterCardList = [];

wizardCardList = [];

sorceressCardList = [];

convokerCardList = [];

blademasterCardList = [];

fireCardList = [];

deathCardList = [];

waterCardList = [2, 2, 29, 29, 27, 27, 8, 8, 25, 34];

earthCardList = [];

lifeCardList = [];

redWizard1List = [];

blackSorceress1List = [];

testPlayerCardList = [];

battleTestCardList = [];

battleTestPlayerCardList = [];

function loadCardList() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {

                processData(xmlhttp.responseText);
            }
            else if (xmlhttp.status == 400) {

            }
            else {

            }
        }
    };

    xmlhttp.open("GET", gameAssetUrl("assets/card-data/data.csv"), true);
    xmlhttp.send();

}

function processData(allText) {
    var rows = parseCardCsv(allText);
    if (rows.length === 0) {
        throw new Error("Card data CSV is empty.");
    }

    var headers = rows[0].map(normalizeCardHeader);
    var aliases = {
        id: ["id"],
        name: ["name"],
        description: ["description"],
        mana: ["mana", "manacost"],
        rarity: ["rarity"],
        gold: ["goldcost"],
        creature: ["creature"],
        spell: ["spell"],
        attack: ["attack"],
        defense: ["defense"],
        damage: ["damage"],
        image: ["image"],
        threat: ["threat"],
        targetLocation: ["targetlocation"],
        targetType: ["targettype"],
        targetCount: ["targetcount"],
        special: ["special"],
        classOrColor: ["classorcolor", "school"],
        armor: ["armor"],
        flying: ["flying"],
        blitz: ["blitz"],
        deadly: ["deadly"],
        reach: ["reach"],
        regen: ["regen", "regeneration"],
        secondSpell: ["secondspell"],
        additionalDescription: ["additionaldescription", "specialdesc"]
    };
    var columnIndexes = {};

    Object.keys(aliases).forEach(function (field) {
        columnIndexes[field] = headers.findIndex(function (header) {
            return aliases[field].indexOf(header) !== -1;
        });
        if (columnIndexes[field] === -1) {
            throw new Error("Card data CSV is missing the " + field + " column.");
        }
    });

    masterCardList.length = 0;
    for (var i = 1; i < rows.length; i++) {
        var data = rows[i];
        if (data.every(function (value) { return value.trim() === ""; })) {
            continue;
        }

        var lineNumber = i + 1;
        function valueFor(field) {
            var value = data[columnIndexes[field]] || "";
            return value.trim();
        }
        function numberFor(field) {
            var value = valueFor(field);
            if (value === "") {
                return 0;
            }
            var number = Number(value);
            if (!Number.isFinite(number)) {
                throw new Error("Invalid " + field + " value on card data row " + lineNumber + ".");
            }
            return number;
        }
        function booleanFor(field) {
            var value = valueFor(field).toUpperCase();
            if (value === "" || value === "FALSE") {
                return false;
            }
            if (value === "TRUE") {
                return true;
            }
            throw new Error("Invalid " + field + " value on card data row " + lineNumber + ".");
        }
        function targetCountFor() {
            var value = valueFor("targetCount");
            if (value.toLowerCase() === "all") {
                return "all";
            }
            return numberFor("targetCount");
        }

        masterCardList.push(new card({
            id: numberFor("id"),
            name: valueFor("name"),
            description: valueFor("description"),
            mana: numberFor("mana"),
            rarity: valueFor("rarity"),
            gold: numberFor("gold"),
            creature: booleanFor("creature"),
            spell: booleanFor("spell"),
            attack: numberFor("attack"),
            defense: numberFor("defense"),
            damage: numberFor("damage"),
            image: valueFor("image"),
            threat: numberFor("threat"),
            targetLocation: valueFor("targetLocation"),
            targetType: valueFor("targetType"),
            targetCount: targetCountFor(),
            special: numberFor("special"),
            classOrColor: valueFor("classOrColor"),
            armor: numberFor("armor"),
            flying: numberFor("flying"),
            blitz: numberFor("blitz"),
            deadly: numberFor("deadly"),
            reach: numberFor("reach"),
            regen: numberFor("regen"),
            secondSpell: numberFor("secondSpell"),
            additionalDescription: valueFor("additionalDescription")
        }));
    }

    // Starting card lists are written as card IDs; convert them to card objects.
    [cavalierCardList, tricksterCardList,wizardCardList, sorceressCardList, convokerCardList,
        blademasterCardList, fireCardList, deathCardList, waterCardList, earthCardList, lifeCardList
    ].forEach(function (list) {
        if (!list.cardIds) {
            Object.defineProperty(list, "cardIds", { value: list.slice() });
        }
        updateCardDeck(list, list.cardIds);
    });

    updateCardDeck(redWizard1List, [2, 2, 7, 7, 5, 5, 8, 8, 9, 9, 5, 15, 16, 16]);

    updateCardDeck(blackSorceress1List, [2, 2, 7, 7, 5, 5, 9, 9, 8, 8, 5, 15, 16, 16]);

    updateCardDeck(testPlayerCardList, [6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7]);

    updateCardDeck(battleTestCardList, [5, 5, 5, 6, 7, 8, 9, 15, 2, 1, 1, 14, 24, 13, 12, 3, 4, 21, 17, 11]);

    // Battle Test player deck: spells first so they show up in the opening hand and early draws.
    updateCardDeck(battleTestPlayerCardList, [1, 14, 6, 10, 17, 24, 7, 13, 12, 11, 4, 3, 21, 5, 8, 9, 2, 15]);

}

function parseCardCsv(text) {
    var rows = [];
    var row = [];
    var value = "";
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
        var character = text[i];
        if (inQuotes) {
            if (character === '"' && text[i + 1] === '"') {
                value += '"';
                i++;
            } else if (character === '"') {
                inQuotes = false;
            } else {
                value += character;
            }
        } else if (character === '"' && value.length === 0) {
            inQuotes = true;
        } else if (character === ",") {
            row.push(value);
            value = "";
        } else if (character === "\n" || character === "\r") {
            row.push(value);
            rows.push(row);
            row = [];
            value = "";
            if (character === "\r" && text[i + 1] === "\n") {
                i++;
            }
        } else {
            value += character;
        }
    }

    if (inQuotes) {
        throw new Error("Card data CSV contains an unterminated quoted field.");
    }
    if (value.length > 0 || row.length > 0) {
        row.push(value);
        rows.push(row);
    }
    return rows;
}

function normalizeCardHeader(header) {
    return header.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}


loadCardList();


function populateCardArray(array) {
    var result = [];
    for (i = 0; i < array.length; i++) {
        var find = masterCardList.find(function (item) {
            return item.id == array[i]
        });
        if (typeof find !== 'undefined') {
            result.push(find);
        }
    }
    return result;
}

function updateCardDeck(deck, cardIds) {
    deck.splice.apply(deck, [0, deck.length].concat(populateCardArray(cardIds)));
}