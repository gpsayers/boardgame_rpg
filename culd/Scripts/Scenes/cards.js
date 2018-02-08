function card(id, name, desc, cost, rare, gold, creature, spell, attack, defense, damage, image) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.rare = rare;
    this.gold = gold;
    this.creature = creature;
    this.spell = spell;
    this.attack = attack;
    this.defense = defense;
    this.damage = damage;
    this.image = image;
}


var masterCardList = [];

//masterCardList.push(new card(1, "Bolt",             "Deal 3 damage.",                       1,      "common", 10,   false,  true,   0, 0, 3, "bolt"));
masterCardList.push(new card(2, "Ogre Zombie",      "Summon Ogre Zombie",                   3,      "common", 10,   true,   false,  3, 3, 0, "zombie"));
//masterCardList.push(new card(3, "Summon Abyssal", "Summon an abyssal to an ajacent square.",1,      "common", 10,   true,   true,   1, 1, 0, "summon"));
//masterCardList.push(new card(4, "Sentry Centaur", "Summon a Centaur and deal 2 damage", 1, "common", 10, true, true, 1, 1, 2, "centaur"));
masterCardList.push(new card(5, "Rat", "Summon Rat", 1, "common", 10, true, false, 1, 1, 0, "rat"));
masterCardList.push(new card(6, "Turtle", "Summon Turtle", 1, "common", 10, true, false, 1, 3, 0, "turtle"));
masterCardList.push(new card(7, "Bear", "Summon Bear", 2, "common", 10, true, false, 2, 2, 0, "bear"));
masterCardList.push(new card(8, "Spider", "Summon Spider", 1, "common", 10, true, false, 2, 1, 0, "spider"));

var cavalierCardList = [];

var thiefCardList = [];

var wizardCardList = [];

var sorceressCardList = [];

var fireCardList = [];

var deathCardList = [];

var waterCardList = [];

var earthCardList = [];

var lifeCardList = [];

