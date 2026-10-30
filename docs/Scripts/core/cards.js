
masterCardList = [];

cavalierCardList = [6, 6, 31, 31, 21, 23, 23, 17, 17, 36];

thiefCardList = [];

wizardCardList = [];

sorceressCardList = [];

convokerCardList = [];

blademasterCardList = [];

fireCardList = [];

deathCardList = [];

waterCardList = [2, 2, 8, 8, 12, 25, 27, 27, 28, 32];

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


//masterCardList.push(new card(1, "Bolt", "Deal 2 damage.", 1, "common", 10, false, true, 0, 0, 2, "bolt", 0, 2,"any",'both','1', 0));
//masterCardList.push(new card(2, "Ogre Zombie", "Summon Ogre Zombie", 3, "common", 10, true, false, 3, 3, 0, "zombie", 0, 3, "", '', '', 0));
//masterCardList.push(new card(3, "Summon Abyssal", "Summon an abyssal to an ajacent square.", 1, "common", 10, true, true, 1, 1, 0, "summon", 0, 1, "adj", 'ground', '1', 0));
//masterCardList.push(new card(4, "Sentry Centaur", "Summon a Centaur and deal 2 damage", 1, "common", 10, true, true, 2, 4, 2, "centaur", 0, 2, "square", 'both', '1', 0));
//masterCardList.push(new card(5, "Rat", "Summon Rat", 1, "common", 10, true, false, 1, 1, 0, "rat", 0, 0, "", '', '', 0));
//masterCardList.push(new card(6, "Turtle", "Summon Turtle", 1, "common", 10, true, false, 1, 1, 0, "turtle", 1, 0, "", '', '', 0));
//masterCardList.push(new card(7, "Bear", "Summon Bear", 2, "common", 10, true, false, 2, 2, 0, "bear", 0, 2, "", '', '', 0));
//masterCardList.push(new card(8, "Spider", "Summon Spider", 2, "common", 10, true, false, 3, 1, 0, "spider", 0, 1, "", '', '', 0));
//masterCardList.push(new card(9, "Wasp", "Summon Wasp", 1, "common", 10, true, false, 2, 1, 0, "yellow_wasp", 0, 1, "", '', '', 0));
//masterCardList.push(new card(15, "Fun-guy", "Summon Mushroom", 2, "common", 10, true, false, 1, 3, 0, "mushroom", 0, 2, "", "", "", 0));
//masterCardList.push(new card(16, "Dummy", "Summon training dummy", 1, "common", 10, true, false, 0, 1, 0, "dummy", 0, 0, "", "", "", 0));

//masterCardList.push(new card(10, "Disengage", "Move 1 square forward", 1, "uncommon", 50, false, true, 0, 0, 1, "disengage", 0, 1, "self", 'player', '1', 4));
//masterCardList.push(new card(11, "Death Curse", "Kill target creature", 2, "uncommon", 50, false, true, 0, 0, 100, "death", 0, 3, "any", 'creature', '1', 0));
//masterCardList.push(new card(12, "Blizzard", "Deal 1 damage to the entire board", 4, "uncommon", 50, false, true, 0, 0, 1, "blizzard", 0, 4, "all", 'both', 'all', 2));
//masterCardList.push(new card(13, "Pickpocket", "Steal 50 gold from a player.", 1, "uncommon", 50, false, true, 0, 0, 50, "steal", 0, 1, "any", 'player', '1', 1));
//masterCardList.push(new card(14, "Healing Touch", "Heal a creature for 3 HP.", 1, "common", 10, false, true, 0, 0, 3, "heal", 0, 1, "any", 'creature', '1', 3));
//masterCardList.push(new card(17, "Research", "Draw 1 card.", 1, "uncommon", 50, false, true, 0, 0, 1, "research", 0, 0, "self", "player", "1", 5));
//masterCardList.push(new card(18, "Healing Word", "Heal a player for 3 HP.", 1, "uncommon", 50, false, true, 0, 0, 3, "heal", 0, 1, "any", 'player', '1', 3));
//masterCardList.push(new card(19, "Healing Ray", "Heal a creature or player for 2 HP.", 1, "rare", 200, false, true, 0, 0, 2, "heal", 0, 1, "any", 'both', '1', 3));
//masterCardList.push(new card(20, "Healing Sign", "Heal all creatures or players on target square for 2 HP.", 1, "rare", 200, false, true, 0, 0, 2, "heal", 0, 1, "any", 'ground', 'all', 3));

//masterCardList.push(new card(21, "Ghoul", "Summon Ghoul and take 3 damage.", 2, "common", 10, true, true, 4, 4, 3, "zombie", 0, 4, "self", "player", "1", 0));
//masterCardList.push(new card(22, "Throw Axe", "Deal 4 damage to a creature in an adjacent square.", 2, "common", 10, false, true, 0, 0, 4, "axe", 0, 2, "adj", 'creature', '1', 0));
//masterCardList.push(new card(23, "Poison Bolt", "Deal 4 damage to a player in an adjacent square.", 3, "common", 10, false, true, 0, 0, 4, "poison", 0, 3, "adj", 'player', '1', 0));


//Target locations: Entire board (all), adjacent (adj), current square (square), row (row), self (self), any (any)
//Target types "creature", "player", "both", "ground"
//Target count (1-"all")
//Special
//1.Steal gold from player
//2.Slow movement
//3.Heal
//4.Move




//redWizard1List = populateCardArray([2, 2, 7, 7, 5, 5, 8, 8, 9, 9, 5, 15, 16, 16]);

//blackSorceress1List = populateCardArray([2, 2, 7, 7, 5, 5, 9, 9, 8, 8, 5, 15, 16, 16]);

//testPlayerCardList = populateCardArray([2, 14, 7, 10, 13, 17, 4, 3, 1, 1, 1, 1]);


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