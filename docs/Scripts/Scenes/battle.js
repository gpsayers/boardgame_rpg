var battle = function () { };

battle.prototype = {
    create: function () {
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Battle Test");
        root.innerHTML =
            '<section class="game-menu-panel battle-test-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">Development Scene</p>' +
                    '<h1>Battle Test</h1>' +
                    '<p class="game-menu-intro">The dedicated boardgame battle scene is ready for development.</p>' +
                '</header>' +
                '<section class="battle-test-arena" aria-label="Battle arena preview">' +
                    '<span class="battle-test-combatant">Hero</span>' +
                    '<span class="battle-test-versus" aria-hidden="true">VS</span>' +
                    '<span class="battle-test-combatant">Opponent</span>' +
                '</section>' +
                '<p class="battle-test-status" role="status">Battle controls and rules will be added here.</p>' +
                '<button class="game-menu-back" type="button" data-action="back">‹ Back to Main Menu</button>' +
            '</section>';

        game.add.overlay(root);
        root.querySelector('[data-action="back"]').addEventListener("click", function () {
            game.state.start("mainMenu");
        });
    }
};
