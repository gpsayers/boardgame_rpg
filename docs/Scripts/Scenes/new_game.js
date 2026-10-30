
var new_character = defineScene("new", {
    init: function () {
        var self = this;
        var classes = [
            { key: "cavalier", label: "Cavalier" },
            { key: "wizard", label: "Wizard" },
            { key: "sorceress", label: "Sorceress" },
            { key: "trickster", label: "Trickster" },
            { key: "dwarf", label: "Dwarf" },
            { key: "vampire", label: "Vampire" }
        ];
        var schools = [
            { key: "Fire", label: "Fire", image: "fire.png" },
            { key: "Water", label: "Water", image: "ice.png" },
            { key: "Life", label: "Life", image: "divination.png" },
            { key: "Death", label: "Death", image: "necromancy.png" },
            { key: "Earth", label: "Earth", image: "poison.png" }
        ];
        var selectedClass = "wizard";
        var selectedSchool = "Fire";
        var root = document.createElement("section");
        root.className = "character-creation-overlay";
        root.setAttribute("aria-label", "Create a new character");
        root.innerHTML =
            '<form class="character-creation-form">' +
                '<header class="character-creation-header">' +
                    '<p class="character-creation-eyebrow">A new adventure begins</p>' +
                    '<h1>Create your character</h1>' +
                '</header>' +
                '<label class="character-name-field">' +
                    '<span>Character name</span>' +
                    '<input name="characterName" type="text" maxlength="24" autocomplete="nickname" autocapitalize="words" placeholder="Enter a name" required>' +
                '</label>' +
                '<fieldset class="character-choice-group">' +
                    '<legend>Choose a class</legend>' +
                    '<div class="character-choice-grid character-class-grid"></div>' +
                '</fieldset>' +
                '<fieldset class="character-choice-group">' +
                    '<legend>Choose a school of magic</legend>' +
                    '<div class="character-choice-grid character-school-grid"></div>' +
                '</fieldset>' +
                '<p class="character-form-error" role="alert" aria-live="polite"></p>' +
                '<footer class="character-form-actions">' +
                    '<button class="character-cancel" type="button">Back</button>' +
                    '<button class="character-submit" type="submit">Begin adventure</button>' +
                '</footer>' +
            '</form>';
        mountOverlay(self, root);

        var form = root.querySelector("form");
        var error = root.querySelector(".character-form-error");
        var classGrid = root.querySelector(".character-class-grid");
        var schoolGrid = root.querySelector(".character-school-grid");

        function addChoice(grid, choice, kind, selectedKey) {
            var button = document.createElement("button");
            var image = document.createElement("img");
            var label = document.createElement("span");
            var isClass = kind === "class";

            button.type = "button";
            button.className = "character-choice";
            button.dataset.key = choice.key;
            button.setAttribute("aria-pressed", choice.key === selectedKey ? "true" : "false");
            button.setAttribute("aria-label", choice.label + (isClass ? " class" : " school of magic"));
            image.src = isClass
                ? gameAssetUrl("assets/players/" + playerPortraitFile(choice.key))
                : gameAssetUrl("assets/" + choice.image);
            image.alt = "";
            image.width = 50;
            image.height = 50;
            label.textContent = choice.label;
            button.appendChild(image);
            button.appendChild(label);

            button.addEventListener("click", function () {
                var selected = isClass ? selectedClass : selectedSchool;
                if (choice.key === selected) {
                    return;
                }
                if (isClass) {
                    selectedClass = choice.key;
                } else {
                    selectedSchool = choice.key;
                }
                Array.prototype.forEach.call(grid.querySelectorAll(".character-choice"), function (item) {
                    item.setAttribute("aria-pressed", item.dataset.key === choice.key ? "true" : "false");
                });
                error.textContent = "";
            });

            grid.appendChild(button);
        }

        classes.forEach(function (choice) {
            addChoice(classGrid, choice, "class", selectedClass);
        });
        schools.forEach(function (choice) {
            addChoice(schoolGrid, choice, "school", selectedSchool);
        });

        root.querySelector(".character-cancel").addEventListener("click", function () {
            self.scene.start("mainMenu");
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var name = form.elements.characterName.value.trim();
            if (!name) {
                error.textContent = "Enter a character name to continue.";
                form.elements.characterName.focus();
                return;
            }
            if (!testPlayerCardList || testPlayerCardList.length === 0) {
                error.textContent = "Card data is still loading. Please try again in a moment.";
                return;
            }

            gameVariables.playerName = name;
            gameVariables.playerClass = selectedClass;
            gameVariables.playerImg = selectedClass;
            gameVariables.playerColor = selectedSchool;
            gameVariables.playerHealth = 10;
            gameVariables.playerMaxHealth = 10;
            gameVariables.playerStartingMana = 1;
            gameVariables.playerMaxHand = 6;
            gameVariables.playerGold = 50;
            gameVariables.playerArmor = 0;
            gameVariables.gameContinue = false;
            gameVariables.playerDeck = buildStartingDeck(selectedClass, selectedSchool);

            self.scene.start("maptext");
        });
    }
});

