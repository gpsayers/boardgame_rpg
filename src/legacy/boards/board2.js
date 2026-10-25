var board2 = {
    squares: [
        [37, 36, 32, 31, 30, 23, 22],
        [38, 0, 33, 0, 27, 0, 21],
        [40, 35, 34, 0, 26, 25, 20],
        [41, 0, 0, 0, 0, 0, 16],
        [42, 43, 44, 0, 12, 13, 15],
        [46, 0, 45, 0, 11, 0, 8],
        [47, 48, 50, 1, 2, 6, 7]

    ],
    boardStart: 1,
    boardEnd: 50,
    boardTotal: 35,
    specialSquares: [],
    choiceSquares: [],
    backwardChoiceSquares: [],
    computerPlayers: []
};


board2.choiceSquares.push({ id: 2, left: 0, up: 11, right: 6, down: 0 });
board2.choiceSquares.push({ id: 20, left: 25, up: 21, right: 0, down: 0 });
board2.choiceSquares.push({ id: 32, left: 36, up: 0, right: 0, down: 33 });
board2.choiceSquares.push({ id: 42, left: 0, up: 0, right: 43, down: 46 });

board2.backwardChoiceSquares.push({ id: 50, left: 48, up: 45, right: 0, down: 0 });
board2.backwardChoiceSquares.push({ id: 40, left: 0, up: 40, right: 35, down: 0 });
board2.backwardChoiceSquares.push({ id: 30, left: 0, up: 0, right: 23, down: 27 });
board2.backwardChoiceSquares.push({ id: 15, left: 13, up: 11, right: 0, down: 8 });

board2.specialSquares.push({ squareId: 22, type: "pressure", looted: 0, result: 3, alt: "trap" });
board2.specialSquares.push({ squareId: 26, type: "magictrap", looted: 0, result: 2, alt: "magictrap" });
board2.specialSquares.push({ squareId: 37, type: "chest", looted: 0, result: 100, alt: "chestopen" });
board2.specialSquares.push({ squareId: 34, type: "chest", looted: 0, result: "rand", alt: "chestopen" });
board2.specialSquares.push({ squareId: 1, type: "start", looted: 0, result: 0, alt: "start" });

// Computer players for board2
board2.computerPlayers.push(new gamePlayer(1, board1.boardStart, "Fancis", "wizard", "Fire", 8, 1, false, redWizard1List, 3, 100, 0));
board2.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Ginny", "sorceress", "Death", 10, 1, false, blackSorceress1List, 3, 100, 0));
board2.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Fred", "cavalier", "Life", 12, 1, false, redWizard1List, 3, 100, 0));


