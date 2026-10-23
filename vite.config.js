import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const legacyScriptsDirectory = fileURLToPath(new URL("./src/legacy/", import.meta.url));

function legacyScriptsPlugin() {
    return {
        name: "legacy-game-scripts",
        apply: "build",
        async generateBundle() {
            const pluginContext = this;

            async function emitScripts(directory) {
                const entries = await readdir(directory, { withFileTypes: true });
                for (const entry of entries) {
                    const filePath = path.join(directory, entry.name);
                    if (entry.isDirectory()) {
                        await emitScripts(filePath);
                    } else if (entry.isFile() && entry.name.endsWith(".js")) {
                        const relativePath = path.relative(legacyScriptsDirectory, filePath);
                        pluginContext.emitFile({
                            type: "asset",
                            fileName: path.posix.join("scripts", relativePath.split(path.sep).join("/")),
                            source: await readFile(filePath)
                        });
                    }
                }
            }

            await emitScripts(legacyScriptsDirectory);
        }
    };
}

export default defineConfig({
    base: "./",
    plugins: [legacyScriptsPlugin()],
    publicDir: "public",
    build: {
        outDir: "docs",
        emptyOutDir: true
    }
});
