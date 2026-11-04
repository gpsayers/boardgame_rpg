var battleload = defineScene("battleload", {
    init: function (data) {
        // The scene that Back returns to; the main menu's Battle Test passes nothing.
        this.backScene = data && data.backScene || "mainMenu";
        this.availableEnemies = Object.keys(enemyData).map(function (key) {
            return { key: key, data: enemyData[key] };
        });
    },

    create: function () {
        var scene = this;
        var maxEnemies = 2;
        var selectedEnemyKeys = new Set(this.availableEnemies.slice(0, 1).map(function (enemy) {
            return enemy.key;
        }));
        var root = document.createElement("main");
        root.className = "game-menu-overlay";
        root.setAttribute("aria-label", "Choose battle test opponents");
        root.innerHTML =
            '<section class="game-menu-panel">' +
                '<header class="game-menu-header">' +
                    '<p class="game-menu-eyebrow">Choose your battle</p>' +
                    '<h1>Choose your opponents</h1>' +
                    '<p class="game-menu-intro">Select one or two enemies to fight.</p>' +
                '</header>' +
                '<div class="character-choice-grid battleload-enemy-grid"></div>' +
                '<p class="game-menu-feedback battleload-feedback" role="status" aria-live="polite"></p>' +
                '<footer class="character-form-actions">' +
                    '<button class="character-cancel battleload-back" type="button">Back</button>' +
                    '<button class="battleload-start" type="button">Start battle</button>' +
                '</footer>' +
            '</section>';
        mountOverlay(scene, root);

        var enemyGrid = root.querySelector(".battleload-enemy-grid");
        var feedback = root.querySelector(".battleload-feedback");
        var startButton = root.querySelector(".battleload-start");

        var buttons = [];

        function refreshSelection() {
            buttons.forEach(function (item) {
                var selected = selectedEnemyKeys.has(item.enemy.key);
                item.button.setAttribute("aria-pressed", selected ? "true" : "false");
                item.button.setAttribute("aria-label",
                    (selected ? "Selected opponent: " : "Opponent: ") + item.enemy.data.name);
            });
        }

        this.availableEnemies.forEach(function (enemy) {
            var button = document.createElement("button");
            var image = document.createElement("img");
            var label = document.createElement("span");
            var details = document.createElement("small");

            button.type = "button";
            button.className = "character-choice";

            image.src = gameAssetUrl("assets/" + enemyPortraitFile(enemy.data));
            image.alt = "";
            image.width = 50;
            image.height = 50;
            label.textContent = enemy.data.name;
            details.textContent = enemy.data.maxHealth + " HP";
            button.appendChild(image);
            button.appendChild(label);
            button.appendChild(details);

            button.addEventListener("click", function () {
                if (selectedEnemyKeys.has(enemy.key)) {
                    selectedEnemyKeys.delete(enemy.key);
                } else if (selectedEnemyKeys.size >= maxEnemies) {
                    feedback.textContent = "You can choose at most " + maxEnemies +
                        " enemies. Deselect one first.";
                    return;
                } else {
                    selectedEnemyKeys.add(enemy.key);
                }
                refreshSelection();
                feedback.textContent = "";
            });

            buttons.push({ enemy: enemy, button: button });
            enemyGrid.appendChild(button);
        });
        refreshSelection();

        if (this.availableEnemies.length === 0) {
            feedback.textContent = "Enemy data is not available yet. Go back and try again in a moment.";
            startButton.disabled = true;
        }

        root.querySelector(".battleload-back").addEventListener("click", function () {
            scene.scene.start(scene.backScene);
        });

        startButton.addEventListener("click", function () {
            if (selectedEnemyKeys.size === 0) {
                feedback.textContent = "Select at least one opponent to start the battle.";
                return;
            }
            scene.scene.start("battle", {
                enemyKeys: Array.from(selectedEnemyKeys)
            });
        });
    }
});
