var board1 = {
    squares: [
        [28, 27, 26, 25, 24, 23, 22],
        [29, 0, 0, 0, 0, 0, 21],
        [30, 0, 0, 0, 0, 0, 20],
        [31, 15, 14, 13, 12, 11, 10],
        [32, 0, 0, 0, 0, 0, 9],
        [33, 0, 0, 0, 0, 0, 8],
        [1, 2, 3, 4, 5, 6, 7]

    ],
    boardStart: 1,
    boardEnd: 33,
    specialSquares: [],
    choiceSquares: [],
    computerPlayers: []
};


board1.choiceSquares.push({ id: 10, left: 11, up: 20, right: 0 });


board1.specialSquares.push({ squareId: 10, type: "trap", looted: 0 });
board1.specialSquares.push({ squareId: 25, type: "chest", looted: 0 });
board1.specialSquares.push({ squareId: 31, type: "bluefountain", looted: 0 });

board1.computerPlayers.push(new gamePlayer(1, board1.boardStart, "Fancis", "wizard", "red", 8, 4, false, redWizard1List));
board1.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Ginny", "sorceress", "purple", 10, 3, false, blackSorceress1List));
board1.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Fred", "cavalier", "yellow", 12, 3, false, redWizard1List));



