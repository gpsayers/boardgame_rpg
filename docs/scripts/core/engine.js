// Small helpers on top of Phaser 4: scene definitions, DOM overlays and sprite sizing.

function showLoadError(file) {
    var path = file && (file.src || file.key) || "unknown resource";
    var message = "Unable to load game resource: " + path;
    console.error(message, file);

    var errorElement = document.getElementById("gameError");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
    }
}

// Builds a Phaser scene class from an object of scene methods (init, preload, create, update, ...).
// Phaser keeps one scene instance for the life of the game, so every init() drops fields the
// previous run added; each visit to a screen then starts from a clean scene.
function defineScene(key, methods) {
    var userInit = methods.init;

    class GameScene extends Phaser.Scene {
        constructor() {
            super({ key: key });
        }
    }

    Object.assign(GameScene.prototype, methods, {
        init: function (data) {
            if (!this.sceneBaseline) {
                Object.defineProperty(this, "sceneBaseline", { value: new Set(Object.keys(this)) });
            } else {
                Object.keys(this).forEach(function (name) {
                    if (!this.sceneBaseline.has(name)) {
                        delete this[name];
                    }
                }, this);
            }
            this.load.off("loaderror", showLoadError);
            this.load.on("loaderror", showLoadError);
            if (userInit) {
                userInit.call(this, data);
            }
        }
    });

    return GameScene;
}

// Adds a DOM element on top of the canvas and removes it when the scene shuts down.
function mountOverlay(scene, element) {
    var parent = scene.game.config.parent;
    if (typeof parent === "string") {
        parent = document.getElementById(parent);
    }
    parent = parent || scene.game.canvas.parentElement;
    if (!parent) {
        throw new Error("The game container is not available for the overlay.");
    }

    parent.appendChild(element);
    scene.events.once("shutdown", function () {
        element.remove();
    });
    return element;
}

// Stretches a sprite to a display size and remembers it so setSpriteZoom can scale from it.
function fitSprite(sprite, width, height) {
    sprite.setDisplaySize(width, height === undefined ? width : height);
    sprite.baseScaleX = sprite.scaleX;
    sprite.baseScaleY = sprite.scaleY;
    return sprite;
}

function addFittedSprite(scene, x, y, key, width, height) {
    return fitSprite(scene.add.sprite(x, y, key), width, height);
}

// Scales a fitted sprite relative to its fitted size (1 = the size it was fitted to).
function setSpriteZoom(sprite, factor) {
    sprite.setScale(sprite.baseScaleX * factor, sprite.baseScaleY * factor);
}
