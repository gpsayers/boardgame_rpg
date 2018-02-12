

var masterCardList = [];

masterCardList.push(new card(1, "Bolt", "Deal 3 damage.", 1, "common", 10, false, true, 0, 0, 3, "bolt", 0));
masterCardList.push(new card(2, "Ogre Zombie", "Summon Ogre Zombie", 3, "common", 10, true, false, 3, 3, 0, "zombie", 0));
masterCardList.push(new card(3, "Summon Abyssal","Summon an abyssal to an ajacent square.",1,"common",10,true,true,1,1,0,"summon",0));
masterCardList.push(new card(4, "Sentry Centaur", "Summon a Centaur and deal 2 damage", 3, "common", 10, true, true, 2, 4, 2, "centaur",0));
masterCardList.push(new card(5, "Rat", "Summon Rat", 1, "common", 10, true, false, 1, 1, 0, "rat", 0));
masterCardList.push(new card(6, "Turtle", "Summon Turtle", 1, "common", 10, true, false, 1, 3, 0, "turtle", 0));
masterCardList.push(new card(7, "Bear", "Summon Bear", 2, "common", 10, true, false, 2, 2, 0, "bear", 1));
masterCardList.push(new card(8, "Spider", "Summon Spider", 1, "common", 10, true, false, 3, 1, 0, "spider", 0));
masterCardList.push(new card(9, "Wasp", "Summon Wasp", 1, "common", 10, true, false, 2, 1, 0, "yellow_wasp", 0));

var cavalierCardList = [];

var thiefCardList = [];

var wizardCardList = [];

var sorceressCardList = [];

var fireCardList = [];

var deathCardList = [];

var waterCardList = [];

var earthCardList = [];

var lifeCardList = [];

var redWizard1List = populateCardArray([8,8,8,8,8,8]);

var blackSorceress1List = populateCardArray([5,5,5,5,5,5]);

var testPlayerCardList = populateCardArray([2, 6, 7, 8, 2, 2]);

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