// What the computer players are trying to achieve, from most to least important.
// Every value an AI weighs (a card play, a summon square, a movement route) is expressed in these
// objectives so that, roughly, capturing enough squares beats hurting the human, which beats stealing
// their gold, then special squares, then crossing the start square, then killing threatening creatures.
var aiObjectiveWeights = {
    captureVictory: 100,
    defeatHuman: 80,
    stealGold: 60,
    captureSpecial: 45,
    crossStart: 30,
    destroyThreats: 20
};

// Profiles only tilt the weights a little, so every profile keeps roughly the same order.
var aiProfiles = {
    aggressor: {
        multipliers: { defeatHuman: 1.2, destroyThreats: 1.2, captureSpecial: 0.9 }
    },
    guardian: {
        multipliers: { captureVictory: 1.1, destroyThreats: 1.3, stealGold: 0.9 }
    },
    opportunist: {
        multipliers: { stealGold: 1.15, captureSpecial: 1.2, crossStart: 1.2, defeatHuman: 0.9 }
    }
};
