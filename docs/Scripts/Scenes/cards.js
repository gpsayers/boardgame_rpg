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

masterCardList.push(new card(1, "Bolt",             "Deal 3 damage.",                       1,      "common", 10,   false,  true,   0, 0, 3, "bolt"));
masterCardList.push(new card(2, "Zombie",           "Zombie",                               1,      "common", 10,   true,   false,  2, 2, 0, "zombie"));
masterCardList.push(new card(3, "Summon Sprite",    "Summon a sprite to an ajacent square.",1,      "common", 10,   true,   true,   1, 1, 0, "summon"));
masterCardList.push(new card(4, "Sentry Centaur",   "Summon a Centaur and deal 2 damage",   1,      "common", 10,   true,   true,   1, 1, 2, "centaur"));