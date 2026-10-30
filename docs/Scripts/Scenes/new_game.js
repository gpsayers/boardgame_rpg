var new_character = function () { };

new_character.prototype = {
    init: function() {
        var classes = [
            { key: "cavalier", label: "Cavalier" },
            { key: "wizard", label: "Wizard" },
            { key: "sorceress", label: "Sorceress" },
            { key: "trickster", label: "Trickster" },
            { key: "dwarf", label: "Dwarf", file: "dwarf_new.png" },
            { key: "vampire", label: "Vampire", file: "vampire_old.png" }
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
        game.add.overlay(root);

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
                ? gameAssetUrl("assets/players/" + (choice.file || choice.key + ".png"))
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
            game.state.start("mainMenu");
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
            gameVariables.playerMaxHand = 4;
            gameVariables.playerGold = 200;
            gameVariables.playerArmor = 0;
            gameVariables.playerDeck = testPlayerCardList.slice();
            gameVariables.gameContinue = false;

            game.state.start("maptext");
        });
    }
};

//Cavalier
//handsize - 3
//armor++ 2

//Wizard
//handsize + 5
//hitpoints - 8
//starting spells+ 4

//sorceress
//handsize + 5
//starting spells- 2
//bonus cards+ (2 packs)

//trickster
//gold + 300
//hitpoints - 8
//starting spells+ 4

//convoker
//hitpoints + 12
//armor + 1
//handsize - 3

//blademaster
//hitpoints + 12
//starting spells- 2
//gold + 300

//armor 0
//hitpoints 10
//mana 1
//handsize 4
//gold 200
//starting spells 3