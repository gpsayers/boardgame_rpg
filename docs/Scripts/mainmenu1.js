var mainMenu = function () { };

mainMenu.prototype = {
    create: function () {
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Main menu");
        root.innerHTML =
            '<section class="game-menu-panel game-home-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">A fantasy board game adventure</p>' +
                    '<h1>Champions <span>of the Source</span></h1>' +
                    '<p class="game-menu-intro">Choose your hero, master a school of magic, and claim the board.</p>' +
                '</header>' +
                '<nav class="game-menu-actions" aria-label="Main menu options">' +
                    '<button class="game-menu-button game-menu-primary" type="button" data-action="new">' +
                        '<span class="game-menu-button-icon" aria-hidden="true">✦</span>' +
                        '<span class="game-menu-button-copy"><strong>Start a new adventure</strong><small>Create a hero and choose your path</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-menu-button" type="button" data-action="continue" disabled>' +
                        '<span class="game-menu-button-icon" aria-hidden="true">◷</span>' +
                        '<span class="game-menu-button-copy"><strong>Continue</strong><small>No saved adventure yet</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-menu-button" type="button" data-action="quick-play">' +
                        '<span class="game-menu-button-icon" aria-hidden="true">⚔</span>' +
                        '<span class="game-menu-button-copy"><strong>Quick play</strong><small>Jump straight into a sample match</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-menu-button game-menu-secondary" type="button" data-action="credits">' +
                        '<span class="game-menu-button-copy"><strong>Credits</strong><small>Meet the people behind the game</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                '</nav>' +
                '<p class="game-menu-feedback" role="status" aria-live="polite"></p>' +
                '<footer class="game-menu-footer">Build your legend, one turn at a time.</footer>' +
            '</section>';

        game.add.overlay(root);

        root.querySelector('[data-action="new"]').addEventListener("click", function () {
            this.newGame();
            game.state.start("new");
        }.bind(this));

        root.querySelector('[data-action="credits"]').addEventListener("click", function () {
            game.state.start("credits");
        });

        root.querySelector('[data-action="quick-play"]').addEventListener("click", function () {
            if (!testPlayerCardList || testPlayerCardList.length === 0) {
                root.querySelector(".game-menu-feedback").textContent =
                    "The card library is still loading. Please try again in a moment.";
                return;
            }

            gameVariables.playerDeck = testPlayerCardList.slice();
            gameVariables.playerName = "Gorath";
            gameVariables.playerGold = 100;
            gameVariables.playerStartingMana = 1;
            gameVariables.playerImg = "wizard";
            gameVariables.currentBoard = "board2";
            gameVariables.playerColor = "Water";
            gameVariables.playerClass = "wizard";
            gameVariables.playerMaxHealth = 10;
            gameVariables.playerHealth = 10;
            gameVariables.playerMaxHand = 4;
            gameVariables.playerArmor = 0;
            gameVariables.gameContinue = false;

            game.state.start("game");
        });
    },

    newGame: function () {
        // localStorage.removeItem("gameVariables");
    }
};
