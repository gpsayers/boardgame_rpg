

var masterCardList = [];

masterCardList.push(new card(1, "Bolt", "Deal 3 damage.", 1, "common", 10, false, true, 0, 0, 3, "bolt", 0, 2,"any",'both','1', 0));
masterCardList.push(new card(2, "Ogre Zombie", "Summon Ogre Zombie", 3, "common", 10, true, false, 3, 3, 0, "zombie", 0, 2, "", '', '', 0));
masterCardList.push(new card(3, "Summon Abyssal", "Summon an abyssal to an ajacent square.", 1, "common", 10, true, true, 1, 1, 0, "summon", 0, 1, "adj", 'square', '1', 0));
masterCardList.push(new card(4, "Sentry Centaur", "Summon a Centaur and deal 2 damage", 3, "common", 10, true, true, 2, 4, 2, "centaur", 0, 2, "square", 'creature', '1', 0));
masterCardList.push(new card(5, "Rat", "Summon Rat", 1, "common", 10, true, false, 1, 1, 0, "rat", 0, 1, "", '', '', 0));
masterCardList.push(new card(6, "Turtle", "Summon Turtle", 1, "common", 10, true, false, 1, 1, 0, "turtle", 1, 1, "", '', '', 0));
masterCardList.push(new card(7, "Bear", "Summon Bear", 2, "common", 10, true, false, 2, 2, 0, "bear", 0, 2, "", '', '', 0));
masterCardList.push(new card(8, "Spider", "Summon Spider", 1, "common", 10, true, false, 3, 1, 0, "spider", 0, 1, "", '', '', 0));
masterCardList.push(new card(9, "Wasp", "Summon Wasp", 1, "common", 10, true, false, 2, 1, 0, "yellow_wasp", 0, 1, "", '', '', 0));

masterCardList.push(new card(10, "Disengage", "Move 1 square forward", 1, "uncommon", 50, false, true, 0, 0, 0, "disengage", 0, 1, "self", 'player', '1', 4));
masterCardList.push(new card(11, "Death Curse", "Kill target creature", 2, "uncommon", 50, false, true, 0, 0, 100, "death", 0, 3, "any", 'creature', '1', 0));
masterCardList.push(new card(12, "Blizzard", "Deal 1 damage to the entire board", 4, "uncommon", 50, false, true, 0, 0, 1, "blizzard", 0, 4, "all", 'both', 'all', 2));
masterCardList.push(new card(13, "Pickpocket", "Steal 50 gold from a player.", 2, "uncommon", 50, false, true, 0, 0, 0, "steal", 0, 1, "any", 'player', '1', 1));
masterCardList.push(new card(14, "Healing Touch", "Heal a creature in your space for 3 HP.", 1, "common", 10, false, true, 0, 3, 0, "heal", 0, 1, "square", 'creature', '1', 3));

//Target locations: Entire board (all), adjacent (adj), current square (square), row (row), self (self), any (any)
//Target types "creature", "player", "both", "square"
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

var redWizard1List = populateCardArray([8,8,8,8,8,8]);

var blackSorceress1List = populateCardArray([5,5,5,5,5,5]);

var testPlayerCardList = populateCardArray([3, 6, 7, 8, 3, 3]);

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