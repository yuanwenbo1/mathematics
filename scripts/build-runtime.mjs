import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve("src/app-content.js");
const outputPath = path.resolve("assets/js/app-content.js");
const source = await readFile(sourcePath, "utf8");

if (!source.startsWith("(() => {") || !source.trimEnd().endsWith("})();")) {
  throw new Error("Application content runtime must be wrapped in an IIFE.");
}

await writeFile(outputPath, source, "utf8");
console.log(`Built application runtime at ${path.relative(process.cwd(), outputPath)}.`);
