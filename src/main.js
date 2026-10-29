const viteEnvironment = import.meta.env || {};

const legacyScriptFiles = [
    "core/phaser2-compat.js",
    "core/array2d.min.js",
    "core/models.js",
    "core/cards.js",
    "core/ai_profiles.js",
    "core/event_log.js",
    "boards/board1.js",
    "boards/board2.js",
    "game.js",
    "core/ai.js",
    "scenes/battle.js",
    "scenes/credits.js",
    "scenes/new_game.js",
    "scenes/campaign_map.js",
    "scenes/cardmanagement.js",
    "scenes/cutscene.js",
    "scenes/maptext.js",
    "scenes/shop.js",
    "mainmenu1.js",
    "main.js"
];

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = function () {
            reject(new Error("Unable to load game script: " + src));
        };
        document.head.appendChild(script);
    });
}

async function startGame() {
    const baseUrl = viteEnvironment.BASE_URL || "./";
    const isVite = viteEnvironment.DEV || viteEnvironment.PROD;
    const legacyScriptBase = viteEnvironment.PROD
        ? baseUrl + "scripts/"
        : isVite
            ? baseUrl + "src/legacy/"
            : new URL("../src/legacy/", document.baseURI).href;
    const phaserRuntime = isVite
        ? baseUrl + "vendor/phaser/phaser.min.js"
        : new URL("../public/vendor/phaser/phaser.min.js", document.baseURI).href;
    window.gameAssetUrl = function (assetPath) {
        const assetBase = isVite
            ? new URL(baseUrl + "assets/", document.baseURI)
            : new URL("../public/assets/", document.baseURI);
        return new URL(assetPath.replace(/^assets\//, ""), assetBase).href;
    };

    await loadScript(phaserRuntime);
    for (const file of legacyScriptFiles) {
        await loadScript(legacyScriptBase + file);
    }
}

startGame().catch(function (error) {
    console.error(error);
    const errorElement = document.getElementById("gameError");
    errorElement.textContent = "The game could not start. " + error.message;
    errorElement.hidden = false;
});
