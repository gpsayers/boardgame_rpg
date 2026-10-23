var credits = function () { };

credits.prototype = {
    create: function () {
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Credits");
        root.innerHTML =
            '<section class="game-menu-panel game-credits-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">Champions of the Source</p>' +
                    '<h1>Credits</h1>' +
                    '<p class="game-menu-intro">Created by Centurian</p>' +
                '</header>' +
                '<p class="game-credits-attribution">Art sourced from Open Game Art.</p>' +
                '<button class="game-menu-back" type="button" data-action="back">‹ Back to Main Menu</button>' +
            '</section>';

        game.add.overlay(root);
        root.querySelector('[data-action="back"]').addEventListener("click", function () {
            game.state.start("mainMenu");
        });
    }
};
