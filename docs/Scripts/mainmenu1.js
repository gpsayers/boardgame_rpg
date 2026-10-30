
var mainMenu = defineScene("mainMenu", {
    create: function () {
        var self = this;
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
                    '<button class="game-menu-button" type="button" data-action="battle-test">' +
                        '<span class="game-menu-button-icon" aria-hidden="true">⚔</span>' +
                        '<span class="game-menu-button-copy"><strong>Battle Test</strong><small>Open the battle development scene</small></span>' +
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

        mountOverlay(self, root);

        root.querySelector('[data-action="new"]').addEventListener("click", function () {
            this.newGame();
            self.scene.start("new");
        }.bind(this));

        root.querySelector('[data-action="credits"]').addEventListener("click", function () {
            self.scene.start("credits");
        });

        root.querySelector('[data-action="battle-test"]').addEventListener("click", function () {
            self.scene.start("battle");
        });
    },

    newGame: function () {
        // localStorage.removeItem("gameVariables");
    }
});
