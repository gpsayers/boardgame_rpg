(function (global) {
    "use strict";

    // Preserve the game's Phaser 2 state and display APIs on the Phaser 4 runtime.
    if (!global.Phaser || !global.Phaser.Scene || !global.Phaser.GameObjects.Container) {
        throw new Error("Phaser 4 must be loaded before the Phaser 2 compatibility layer.");
    }

    var stateConstructors = Object.create(null);
    var scene = null;
    var activeState = null;
    var activeStateKey = null;
    var queuedFiles = 0;
    var loadingState = false;
    var domOverlays = [];
    var facade;
    var mainStateInstance = null;
    var gameWidth = Math.min(window.innerWidth * (window.devicePixelRatio || 1), 1200);
    var gameHeight = Math.min(window.innerHeight * (window.devicePixelRatio || 1), 700);

    global.Phaser.Easing = global.Phaser.Easing || {};
    global.Phaser.Easing.Linear = global.Phaser.Easing.Linear || {};
    global.Phaser.Easing.Linear.None = "Linear";
    global.Phaser.Easing.Linear.NONE = "Linear";

    function requireScene() {
        if (!scene) {
            throw new Error("The Phaser scene is not ready yet.");
        }

        return scene;
    }

    function styleForPhaser4(style) {
        var result = {};

        Object.keys(style || {}).forEach(function (key) {
            result[key] = style[key];
        });

        if (result.color === undefined && result.fill !== undefined) {
            result.color = result.fill;
        }
        delete result.fill;

        return result;
    }

    function updateContainerHitArea(object) {
        if (!object.input || !object.__legacyVisual) {
            return;
        }

        var visual = object.__legacyVisual;
        var width = Math.max(1, visual.displayWidth || visual.width || 1);
        var height = Math.max(1, visual.displayHeight || visual.height || 1);
        var originX = visual.originX || 0;
        var originY = visual.originY || 0;

        // Container input coordinates are offset by half the display size.
        object.input.hitArea.setTo(width * (0.5 - originX), height * (0.5 - originY), width, height);
    }

    function setInputEnabled(object, enabled) {
        if (enabled) {
            var visual = object.__legacyVisual;
            var width = Math.max(1, visual && (visual.displayWidth || visual.width) || 1);
            var height = Math.max(1, visual && (visual.displayHeight || visual.height) || 1);
            var originX = visual && visual.originX || 0;
            var originY = visual && visual.originY || 0;
            var hitArea = new Phaser.Geom.Rectangle(width * (0.5 - originX), height * (0.5 - originY), width, height);

            object.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            if (!object.__legacyPointerTracking) {
                object.__legacyPointerTracking = true;
                object.on("pointerover", function () { object.__legacyPointerIsOver = true; });
                object.on("pointerout", function () { object.__legacyPointerIsOver = false; });
            }
            object.input.pointerOver = function () { return !!object.__legacyPointerIsOver; };
            updateContainerHitArea(object);
        } else if (object.input) {
            object.__legacyPointerIsOver = false;
            object.disableInteractive();
        }
    }

    function addInputHandler(object, eventName, callback, context) {
        object.on(eventName, function (pointer, localX, localY, event) {
            callback.call(context, object, pointer, localX, localY, event);
        });
    }

    function decorateContainer(container, visual) {
        container.__legacyVisual = visual || null;
        container.events = {
            onInputDown: { add: function (callback, context) { addInputHandler(container, "pointerdown", callback, context); } },
            onInputUp: { add: function (callback, context) { addInputHandler(container, "pointerup", callback, context); } },
            onInputOver: { add: function (callback, context) { addInputHandler(container, "pointerover", callback, context); } },
            onInputOut: { add: function (callback, context) { addInputHandler(container, "pointerout", callback, context); } }
        };

        Object.defineProperty(container, "inputEnabled", {
            configurable: true,
            get: function () { return !!container.input; },
            set: function (enabled) { setInputEnabled(container, enabled); }
        });

        Object.defineProperty(container, "useHandCursor", {
            configurable: true,
            get: function () { return !!container.__useHandCursor; },
            set: function (enabled) {
                container.__useHandCursor = enabled;
                if (container.input) {
                    container.input.cursor = enabled ? "pointer" : "default";
                }
            }
        });

        container.addChild = function (child) {
            return container.add(child);
        };

        if (visual) {
            var anchor = {};

            Object.defineProperties(anchor, {
                x: {
                    get: function () { return visual.originX; },
                    set: function (value) { visual.setOrigin(value, visual.originY); updateContainerHitArea(container); }
                },
                y: {
                    get: function () { return visual.originY; },
                    set: function (value) { visual.setOrigin(visual.originX, value); updateContainerHitArea(container); }
                }
            });

            anchor.set = function (x, y) {
                visual.setOrigin(x, y === undefined ? x : y);
                updateContainerHitArea(container);
                return anchor;
            };
            anchor.setTo = anchor.set;
            Object.defineProperty(container, "anchor", { configurable: true, value: anchor });

            Object.defineProperty(container, "key", {
                configurable: true,
                get: function () { return visual.texture && visual.texture.key; }
            });
            Object.defineProperty(container, "frame", {
                configurable: true,
                get: function () { return visual.frame && visual.frame.name; },
                set: function (frame) { visual.setFrame(frame); updateContainerHitArea(container); }
            });
            Object.defineProperty(container, "width", {
                configurable: true,
                get: function () { return visual.displayWidth; },
                set: function (width) {
                    visual.displayWidth = width;
                    updateContainerHitArea(container);
                }
            });
            Object.defineProperty(container, "height", {
                configurable: true,
                get: function () { return visual.displayHeight; },
                set: function (height) {
                    visual.displayHeight = height;
                    updateContainerHitArea(container);
                }
            });

            container.loadTexture = function (key, frame) {
                visual.setTexture(key, frame);
                updateContainerHitArea(container);
                return container;
            };

            container.setText = function (text) {
                if (!visual.setText) {
                    throw new TypeError("setText can only be used on a text object.");
                }
                visual.setText(text);
                updateContainerHitArea(container);
                return container;
            };

            container.setShadow = function (x, y, color, blur, shadowStroke, shadowFill) {
                visual.setShadow(x, y, color, blur, shadowStroke, shadowFill);
                return container;
            };

            Object.defineProperty(container, "stroke", {
                configurable: true,
                get: function () { return visual.style && visual.style.stroke; },
                set: function (color) {
                    var thickness = visual.style && visual.style.strokeThickness || 0;
                    visual.setStroke(color, thickness);
                }
            });
            Object.defineProperty(container, "strokeThickness", {
                configurable: true,
                get: function () { return visual.style && visual.style.strokeThickness; },
                set: function (thickness) {
                    var color = visual.style && visual.style.stroke || "#000000";
                    visual.setStroke(color, thickness);
                }
            });
            Object.defineProperty(container, "fill", {
                configurable: true,
                get: function () { return visual.style && visual.style.color; },
                set: function (color) { visual.setColor(color); }
            });

            var destroyContainer = Phaser.GameObjects.Container.prototype.destroy;
            container.destroy = function (fromScene) {
                if (container.scene) {
                    container.removeAll(true);
                    destroyContainer.call(container, fromScene);
                }
            };
        }

        return container;
    }

    function makeDisplayObject(visual, x, y) {
        var currentScene = requireScene();
        var container = currentScene.add.container(x, y);
        container.add(visual);
        container.setSize(visual.displayWidth || visual.width || 1, visual.displayHeight || visual.height || 1);

        return decorateContainer(container, visual);
    }

    function loadAsset(method, args) {
        var currentScene = requireScene();
        var key = args[0];
        var assetArgs = Array.prototype.slice.call(args);

        if (typeof assetArgs[1] === "string" && assetArgs[1].indexOf("assets/") === 0) {
            assetArgs[1] = global.gameAssetUrl(assetArgs[1]);
        }

        if ((method === "image" || method === "spritesheet") && currentScene.textures.exists(key)) {
            return;
        }

        currentScene.load[method].apply(currentScene.load, assetArgs);
        queuedFiles++;
    }

    function clearLegacyScene() {
        var currentScene = requireScene();

        currentScene.tweens.killAll();
        currentScene.children.removeAll(true);

        domOverlays.forEach(function (overlay) {
            if (overlay.resizeHandler) {
                scene.scale.off("resize", overlay.resizeHandler);
            }
            overlay.element.remove();
        });
        domOverlays.length = 0;
    }

    function finishState(state, key) {
        if (activeState !== state || activeStateKey !== key) {
            return;
        }

        loadingState = false;
        if (state.create) {
            state.create.call(state);
        }
    }

    function startState(key) {
        var StateConstructor = stateConstructors[key];
        if (!StateConstructor) {
            throw new Error("Unknown game state: " + key);
        }

        clearLegacyScene();
        queuedFiles = 0;
        activeStateKey = key;
        activeState = new StateConstructor();
        loadingState = false;

        if (activeState.init) {
            activeState.init.call(activeState);
        }

        if (activeState.preload) {
            activeState.preload.call(activeState);
        }

        if (queuedFiles > 0) {
            loadingState = true;
            var state = activeState;
            scene.load.once("complete", function () {
                finishState(state, key);
            });
            scene.load.start();
        } else {
            finishState(activeState, key);
        }
    }

    function addInputField(x, y, options) {
        var currentScene = requireScene();
        var canvas = currentScene.game.canvas;
        var parent = currentScene.game.config.parent;
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }

        var input = document.createElement("input");
        input.type = "text";
        input.style.position = "absolute";
        input.style.zIndex = "10";
        input.style.boxSizing = "border-box";
        input.style.font = options.font || "16px sans-serif";
        input.style.fontWeight = options.fontWeight || "normal";
        input.style.backgroundColor = options.backgroundColor || "transparent";
        input.style.color = options.fill || "#000000";
        parent.appendChild(input);

        function positionInput() {
            var canvasBounds = canvas.getBoundingClientRect();
            var parentBounds = parent.getBoundingClientRect();
            var scaleX = canvasBounds.width / currentScene.scale.width;
            var scaleY = canvasBounds.height / currentScene.scale.height;

            input.style.left = (canvasBounds.left - parentBounds.left + x * scaleX) + "px";
            input.style.top = (canvasBounds.top - parentBounds.top + y * scaleY) + "px";
            input.style.transform = "scale(" + scaleX + "," + scaleY + ")";
            input.style.transformOrigin = "top left";
        }

        positionInput();
        currentScene.scale.on("resize", positionInput);
        input.__legacyResizeHandler = positionInput;
        domOverlays.push({ element: input, resizeHandler: positionInput });

        return input;
    }

    function addOverlay(element) {
        var parent = requireScene().game.config.parent;
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        if (!parent) {
            throw new Error("The game container is not available for the character form.");
        }

        parent.appendChild(element);
        domOverlays.push({ element: element });
        return element;
    }

    function legacyTween(target) {
        return {
            to: function (properties, duration, easing, autoStart, delay, repeat) {
                var tween = requireScene().tweens.add({
                    targets: target,
                    duration: duration,
                    ease: easing || "Linear",
                    delay: delay || 0,
                    repeat: repeat || 0,
                    props: properties,
                    paused: autoStart === false
                });

                var result = {
                    onComplete: {
                        add: function (callback, context) {
                            tween.once("complete", function () {
                                callback.call(context);
                            });
                            return result;
                        }
                    },
                    start: function () {
                        tween.play();
                        return result;
                    }
                };

                return result;
            }
        };
    }

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

    var add = {
        sprite: function (x, y, key, frame) {
            var sprite = requireScene().add.sprite(0, 0, key, frame);
            sprite.setOrigin(0, 0);
            return makeDisplayObject(sprite, x, y);
        },
        text: function (x, y, text, style) {
            return makeDisplayObject(requireScene().add.text(0, 0, text, styleForPhaser4(style)), x, y);
        },
        tileSprite: function (x, y, width, height, key, frame) {
            return makeDisplayObject(requireScene().add.tileSprite(0, 0, width, height, key, frame), x, y);
        },
        group: function () {
            return decorateContainer(requireScene().add.container(0, 0));
        },
        button: function (x, y, key, callback, context, overFrame, outFrame, downFrame, upFrame) {
            var button = add.sprite(x, y, key);
            if (outFrame !== undefined && outFrame !== null) {
                button.frame = outFrame;
            }
            button.inputEnabled = true;
            if (overFrame !== undefined && overFrame !== null) {
                button.events.onInputOver.add(function () { button.frame = overFrame; });
            }
            if (outFrame !== undefined && outFrame !== null) {
                button.events.onInputOut.add(function () { button.frame = outFrame; });
            }
            if (downFrame !== undefined && downFrame !== null) {
                button.events.onInputDown.add(function () { button.frame = downFrame; });
            }
            if (upFrame !== undefined && upFrame !== null) {
                button.events.onInputUp.add(function () { button.frame = upFrame; });
            }
            if (callback) {
                button.events.onInputUp.add(callback, context);
            }
            return button;
        },
        tween: legacyTween,
        inputField: addInputField,
        overlay: addOverlay
    };

    var load = {
        image: function () { loadAsset("image", arguments); },
        spritesheet: function (key, url, frameWidth, frameHeight) {
            loadAsset("spritesheet", [key, url, { frameWidth: frameWidth, frameHeight: frameHeight }]);
        },
        script: function () { loadAsset("script", arguments); }
    };

    facade = {
        add: add,
        load: load,
        state: {
            add: function (key, StateConstructor) { stateConstructors[key] = StateConstructor; },
            start: startState
        },
        world: {
            get centerX() { return facade.width / 2; },
            get centerY() { return facade.height / 2; },
            bringToTop: function (object) { requireScene().children.bringToTop(object); }
        },
        camera: {
            get width() { return facade.width; },
            get height() { return facade.height; },
            flash: function (color, duration) {
                var red = color >> 16 & 255;
                var green = color >> 8 & 255;
                var blue = color & 255;
                requireScene().cameras.main.flash(duration, red, green, blue);
            }
        },
        input: {
            get activePointer() { return requireScene().input.activePointer; }
        },
        get width() { return scene ? scene.scale.width : gameWidth; },
        get height() { return scene ? scene.scale.height : gameHeight; }
    };

    class CompatibilityScene extends Phaser.Scene {
        constructor() {
            super({ key: "legacy-game" });
        }

        init() {
            scene = this;
            this.load.on("loaderror", showLoadError);
            if (global.mainState) {
                mainStateInstance = new global.mainState();
                if (mainStateInstance.init) {
                    mainStateInstance.init.call(mainStateInstance);
                }
            }
        }

        preload() {
            queuedFiles = 0;
            mainStateInstance.preload.call(mainStateInstance);
        }

        create() {
            queuedFiles = 0;
            mainStateInstance.create.call(mainStateInstance);
        }

        update(time, delta) {
            if (!loadingState && activeState && activeState.update) {
                activeState.update.call(activeState, time, delta);
            } else if (mainStateInstance && mainStateInstance.update) {
                mainStateInstance.update.call(mainStateInstance, time, delta);
            }
        }
    }

    facade.createEngine = function (configuration) {
        return new Phaser.Game({
            type: Phaser.AUTO,
            parent: configuration.parent,
            width: configuration.width,
            height: configuration.height,
            backgroundColor: "#000000",
            disableVisibilityChange: true,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [CompatibilityScene]
        });
    };

    global.Phaser2Compat = {
        create: function (configuration) {
            gameWidth = configuration.width;
            gameHeight = configuration.height;
            facade.engine = facade.createEngine(configuration);
            return facade;
        }
    };
    global.game = facade;
})(window);
