var board2 = {
    squares: [
        [37, 36, 32, 31, 30, 23, 22],
        [38, 00, 33, 00, 27, 00, 21],
        [40, 35, 34, 00, 26, 25, 20],
        [41, 00, 00, 00, 00, 00, 16],
        [42, 43, 44, 00, 12, 13, 15],
        [46, 00, 45, 00, 11, 00, 08],
        [47, 48, 50, 01, 02, 06, 07]

    ],
    boardStart: 1,
    boardEnd: 50,
    boardTotal: 35,
    specialSquares: [],
    choiceSquares: [],
    computerPlayers: []
};


board2.choiceSquares.push({ id: 2, left: 0, up: 11, right: 6, down: 0 });
board2.choiceSquares.push({ id: 20, left: 25, up: 21, right: 0, down: 0 });
board2.choiceSquares.push({ id: 32, left: 36, up: 0, right: 0, down: 33 });
board2.choiceSquares.push({ id: 42, left: 0, up: 0, right: 43, down: 46 });


board2.specialSquares.push({ squareId: 22, type: "pressure", looted: 0 });
board2.specialSquares.push({ squareId: 26, type: "magictrap", looted: 0 });
board2.specialSquares.push({ squareId: 37, type: "chest", looted: 0 });
board2.specialSquares.push({ squareId: 34, type: "chest", looted: 0 });
board2.specialSquares.push({ squareId: 1, type: "start", looted: 0 });

board2.computerPlayers.push(new gamePlayer(1, board1.boardStart, "Fancis", "wizard", "Fire", 8, 1, false, redWizard1List, 3, 100, 0));
board2.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Ginny", "sorceress", "Death", 10, 1, false, blackSorceress1List, 3, 100, 0));
board2.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Fred", "cavalier", "Life", 12, 1, false, redWizard1List, 3, 100, 0));



