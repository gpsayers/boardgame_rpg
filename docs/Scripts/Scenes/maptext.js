
var maptext = defineScene("maptext", {
    create: function () {
        var self = this;
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Choose your destination");
        root.innerHTML =
            '<section class="game-menu-panel game-destination-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">Your journey awaits</p>' +
                    '<h1>Choose your destination</h1>' +
                    '<p class="game-menu-intro">Where will your next chapter begin?</p>' +
                '</header>' +
                '<nav class="game-destination-grid" aria-label="Destinations">' +
                    '<button class="game-destination-card" type="button" data-destination="shop">' +
                        '<span class="game-destination-icon destination-shop" aria-hidden="true">✧</span>' +
                        '<span class="game-destination-copy"><strong>The Shop</strong><small>Browse wares and prepare for the road ahead.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-destination-card" type="button" data-destination="castle">' +
                        '<span class="game-destination-icon destination-castle" aria-hidden="true">♜</span>' +
                        '<span class="game-destination-copy"><strong>The Castle</strong><small>Enter a winding stone fortress and claim its squares.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-destination-card" type="button" data-destination="swamp">' +
                        '<span class="game-destination-icon destination-swamp" aria-hidden="true">♧</span>' +
                        '<span class="game-destination-copy"><strong>The Swamp</strong><small>Venture into wild marshland and face its dangers.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                    '<button class="game-destination-card" type="button" data-destination="cards">' +
                        '<span class="game-destination-icon destination-cards" aria-hidden="true">▤</span>' +
                        '<span class="game-destination-copy"><strong>Card collection</strong><small>Review your cards before choosing a board.</small></span>' +
                        '<span class="game-menu-arrow" aria-hidden="true">›</span>' +
                    '</button>' +
                '</nav>' +
                '<button class="game-menu-back" type="button" data-destination="menu">‹ <span>Back to main menu</span></button>' +
            '</section>';

        mountOverlay(self, root);

        root.querySelector('[data-destination="shop"]').addEventListener("click", function () {
            self.scene.start("shop");
        });

        root.querySelector('[data-destination="castle"]').addEventListener("click", function () {
            this.startBoard("board2");
        }.bind(this));

        root.querySelector('[data-destination="swamp"]').addEventListener("click", function () {
            this.startBoard("board1");
        }.bind(this));

        root.querySelector('[data-destination="cards"]').addEventListener("click", function () {
            self.scene.start("cardmanager");
        });

        root.querySelector('[data-destination="menu"]').addEventListener("click", function () {
            self.scene.start("mainMenu");
        });
    },

    startBoard: function (board) {
        gameVariables.currentBoard = board;
        gameVariables.gameContinue = false;
        this.scene.start("battle");
    }
});
