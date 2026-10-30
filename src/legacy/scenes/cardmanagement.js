
var cardmanager = defineScene("cardmanager", {
    create: function () {
        var self = this;
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Card collection");
        root.innerHTML =
            '<section class="game-menu-panel game-destination-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">Your collection</p>' +
                    '<h1>Card collection</h1>' +
                    '<p class="game-menu-intro">Review the cards in your current deck. Deck editing is coming soon.</p>' +
                '</header>' +
                '<p class="collection-count" aria-live="polite"></p>' +
                '<div class="collection-list" aria-label="Cards in your deck"></div>' +
                '<p class="collection-empty" hidden>No deck is set up yet. Create a character or start Quick play to see cards here.</p>' +
                '<nav class="stub-navigation" aria-label="Card collection navigation">' +
                    '<button class="game-menu-back" type="button" data-action="destinations">‹ <span>Back to destinations</span></button>' +
                    '<button class="game-menu-back" type="button" data-action="home">‹ <span>Back to main menu</span></button>' +
                '</nav>' +
            '</section>';

        mountOverlay(self, root);

        var deck = gameVariables.playerDeck && gameVariables.playerDeck.length
            ? gameVariables.playerDeck
            : testPlayerCardList;
        var list = root.querySelector(".collection-list");
        var count = root.querySelector(".collection-count");
        var empty = root.querySelector(".collection-empty");

        if (!deck || deck.length === 0) {
            count.textContent = "No cards to show";
            empty.hidden = false;
        } else {
            var cardsById = Object.create(null);
            deck.forEach(function (item) {
                if (!item) {
                    return;
                }
                var key = String(item.id);
                if (!cardsById[key]) {
                    cardsById[key] = { card: item, quantity: 0 };
                }
                cardsById[key].quantity++;
            });

            var cards = Object.keys(cardsById).map(function (key) {
                return cardsById[key];
            });
            count.textContent = deck.length + " cards · " + cards.length + " unique";
            cards.forEach(function (entry) {
                var card = document.createElement("article");
                card.className = "collection-card";
                var heading = document.createElement("h2");
                var description = document.createElement("p");
                var quantity = document.createElement("span");

                heading.textContent = entry.card.name;
                description.textContent = entry.card.desc;
                quantity.className = "collection-quantity";
                quantity.textContent = "×" + entry.quantity;
                card.appendChild(heading);
                card.appendChild(description);
                card.appendChild(quantity);
                list.appendChild(card);
            });
        }

        root.querySelector('[data-action="destinations"]').addEventListener("click", function () {
            self.scene.start("maptext");
        });
        root.querySelector('[data-action="home"]').addEventListener("click", function () {
            self.scene.start("mainMenu");
        });
    }
});
