
function loadCardList() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                //console.log(xmlhttp.responseText);
                processData(xmlhttp.responseText);
            }
            else if (xmlhttp.status == 400) {
                
            }
            else {
                
            }
        }
    };

    xmlhttp.open("GET", "Assets/CardData/data.csv", true);
    xmlhttp.send();

}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr.push(headers[j] + ":" + data[j]);
            }
            lines.push(tarr);
            masterCardList.push(new card(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18]))
        }
    }
    // alert(lines);
}



var masterCardList = [];

//loadCardList();

console.log(masterCardList);

masterCardList.push(new card(1, "Bolt", "Deal 2 damage.", 1, "common", 10, false, true, 0, 0, 2, "bolt", 0, 2,"any",'both','1', 0));
masterCardList.push(new card(2, "Ogre Zombie", "Summon Ogre Zombie", 3, "common", 10, true, false, 3, 3, 0, "zombie", 0, 3, "", '', '', 0));
masterCardList.push(new card(3, "Summon Abyssal", "Summon an abyssal to an ajacent square.", 1, "common", 10, true, true, 1, 1, 0, "summon", 0, 1, "adj", 'ground', '1', 0));
masterCardList.push(new card(4, "Sentry Centaur", "Summon a Centaur and deal 2 damage", 1, "common", 10, true, true, 2, 4, 2, "centaur", 0, 2, "square", 'both', '1', 0));
masterCardList.push(new card(5, "Rat", "Summon Rat", 1, "common", 10, true, false, 1, 1, 0, "rat", 0, 0, "", '', '', 0));
masterCardList.push(new card(6, "Turtle", "Summon Turtle", 1, "common", 10, true, false, 1, 1, 0, "turtle", 1, 0, "", '', '', 0));
masterCardList.push(new card(7, "Bear", "Summon Bear", 2, "common", 10, true, false, 2, 2, 0, "bear", 0, 2, "", '', '', 0));
masterCardList.push(new card(8, "Spider", "Summon Spider", 2, "common", 10, true, false, 3, 1, 0, "spider", 0, 1, "", '', '', 0));
masterCardList.push(new card(9, "Wasp", "Summon Wasp", 1, "common", 10, true, false, 2, 1, 0, "yellow_wasp", 0, 1, "", '', '', 0));
masterCardList.push(new card(15, "Fun-guy", "Summon Mushroom", 2, "common", 10, true, false, 1, 3, 0, "mushroom", 0, 2, "", "", "", 0));
masterCardList.push(new card(16, "Dummy", "Summon training dummy", 1, "common", 10, true, false, 0, 1, 0, "dummy", 0, 0, "", "", "", 0));

masterCardList.push(new card(10, "Disengage", "Move 1 square forward", 1, "uncommon", 50, false, true, 0, 0, 1, "disengage", 0, 1, "self", 'player', '1', 4));
masterCardList.push(new card(11, "Death Curse", "Kill target creature", 2, "uncommon", 50, false, true, 0, 0, 100, "death", 0, 3, "any", 'creature', '1', 0));
masterCardList.push(new card(12, "Blizzard", "Deal 1 damage to the entire board", 4, "uncommon", 50, false, true, 0, 0, 1, "blizzard", 0, 4, "all", 'both', 'all', 2));
masterCardList.push(new card(13, "Pickpocket", "Steal 50 gold from a player.", 1, "uncommon", 50, false, true, 0, 0, 50, "steal", 0, 1, "any", 'player', '1', 1));
masterCardList.push(new card(14, "Healing Touch", "Heal a creature for 3 HP.", 1, "common", 10, false, true, 0, 0, 3, "heal", 0, 1, "any", 'creature', '1', 3));
masterCardList.push(new card(17, "Research", "Draw 1 card.", 1, "uncommon", 50, false, true, 0, 0, 1, "research", 0, 0, "self", "player", "1", 5));
masterCardList.push(new card(18, "Healing Word", "Heal a player for 3 HP.", 1, "uncommon", 50, false, true, 0, 0, 3, "heal", 0, 1, "any", 'player', '1', 3));
masterCardList.push(new card(19, "Healing Ray", "Heal a creature or player for 2 HP.", 1, "rare", 200, false, true, 0, 0, 2, "heal", 0, 1, "any", 'both', '1', 3));
masterCardList.push(new card(20, "Healing Sign", "Heal all creatures or players on target square for 2 HP.", 1, "rare", 200, false, true, 0, 0, 2, "heal", 0, 1, "any", 'ground', 'all', 3));

masterCardList.push(new card(21, "Ghoul", "Summon Ghoul and take 3 damage.", 2, "common", 10, true, true, 4, 4, 3, "zombie", 0, 4, "self", "player", "1", 0));
masterCardList.push(new card(22, "Throw Axe", "Deal 4 damage to a creature in an adjacent square.", 2, "common", 10, false, true, 0, 0, 4, "axe", 0, 2, "adj", 'creature', '1', 0));
masterCardList.push(new card(23, "Poison Bolt", "Deal 4 damage to a player in an adjacent square.", 3, "common", 10, false, true, 0, 0, 4, "poison", 0, 3, "adj", 'player', '1', 0));


//Target locations: Entire board (all), adjacent (adj), current square (square), row (row), self (self), any (any)
//Target types "creature", "player", "both", "ground"
//Target count (1-"all")
//Special
//1.Steal gold from player
//2.Slow movement
//3.Heal
//4.Move



var cavalierCardList = [];

var thiefCardList = [];

var wizardCardList = [];

var sorceressCardList = [];

var fireCardList = [];

var deathCardList = [];

var waterCardList = [];

var earthCardList = [];

var lifeCardList = [];

var redWizard1List = populateCardArray([2,2,7,7,5,5,8,8,9,9,5,15,16,16]);

var blackSorceress1List = populateCardArray([2,2,7,7,5,5,9,9,8,8,5,15,16,16]);

var testPlayerCardList = populateCardArray([2, 14, 7, 10,13,17,4,3]);

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