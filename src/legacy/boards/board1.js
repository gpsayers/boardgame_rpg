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
    boardTotal: 28,
    captureRequirement: 8,
    // Square IDs blocked for path movement at the start of each battle.
    blockedSquares: [],
    specialSquares: [],
    choiceSquares: [],
    computerPlayers: []
};


board1.choiceSquares.push({ id: 10, left: 11, up: 20, right: 0 });


// Board elements: addBoardElement(board, squareId, elementId, effect value x, special effect y)
board1.elements = [];
addBoardElement(board1, 10, 4, 3, 0);
addBoardElement(board1, 25, 2, 100, 0);
addBoardElement(board1, 31, 1, 1, 0);
addBoardElement(board1, 1, 16, 0, 0);

//testing special squares
addBoardElement(board1, 11, 10, 1, 2);
addBoardElement(board1, 12, 10, 1, 2);
addBoardElement(board1, 13, 10, 1, 2);
addBoardElement(board1, 14, 10, 1, 2);
addBoardElement(board1, 15, 10, 0, 2);

// Computer players for board1
board1.computerPlayers.push(new gamePlayer(1, board1.boardStart, "Fancis", "wizard", "yellow", 8, 1, false, battleTestCardList, 3,100,0));
board1.computerPlayers[board1.computerPlayers.length - 1].aiProfile = "aggressor";
board1.computerPlayers.push(new gamePlayer(2, board1.boardStart, "Ginny", "sorceress", "purple", 10, 1, false, battleTestCardList, 3,100,0));
board1.computerPlayers[board1.computerPlayers.length - 1].aiProfile = "guardian";
//board1.computerPlayers.push(new gamePlayer(3, board1.boardStart, "Fred", "cavalier", "yellow", 12, 1, false, redWizard1List, 3,100,0));
