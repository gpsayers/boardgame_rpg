
var shop = defineScene("shop", {
    create: function () {
        var self = this;
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "The shop");
        root.innerHTML =
            '<section class="game-menu-panel game-destination-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">The traveling merchant</p>' +
                    '<h1>The Shop</h1>' +
                    '<p class="game-menu-intro">Take a look around. Trading will be available in a future update.</p>' +
                '</header>' +
                '<p class="collection-count" role="status">Your gold: <strong class="shop-gold"></strong></p>' +
                '<div class="game-destination-grid" aria-label="Shop inventory">' +
                    '<article class="game-destination-card shop-inventory-item">' +
                        '<span class="game-destination-icon destination-shop" aria-hidden="true">✦</span>' +
                        '<span class="game-destination-copy"><strong>Adventurer’s supply pack</strong><small>Useful gear for the road. Coming soon.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">—</span>' +
                    '</article>' +
                    '<article class="game-destination-card shop-inventory-item">' +
                        '<span class="game-destination-icon destination-cards" aria-hidden="true">▤</span>' +
                        '<span class="game-destination-copy"><strong>Spell card pack</strong><small>New magic for your deck. Coming soon.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">—</span>' +
                    '</article>' +
                '</div>' +
                '<nav class="stub-navigation" aria-label="Shop navigation">' +
                    '<button class="game-menu-back" type="button" data-action="destinations">‹ <span>Back to destinations</span></button>' +
                    '<button class="game-menu-back" type="button" data-action="home">‹ <span>Back to main menu</span></button>' +
                '</nav>' +
            '</section>';

        mountOverlay(self, root);
        root.querySelector(".shop-gold").textContent = String(gameVariables.playerGold || 0);
        root.querySelector('[data-action="destinations"]').addEventListener("click", function () {
            self.scene.start("maptext");
        });
        root.querySelector('[data-action="home"]').addEventListener("click", function () {
            self.scene.start("mainMenu");
        });
    }
});
