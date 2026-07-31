import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { rewriteCapacitorSite } from "./rewrite-capacitor-site.mjs";

const sourceDir = path.resolve(process.argv[2] || "_site");
const outputDir = path.resolve(process.argv[3] || "_site-app");
const workspace = path.resolve(".");

if (!outputDir.startsWith(`${workspace}${path.sep}`) || path.basename(outputDir) !== "_site-app") {
  throw new Error(`Refusing to replace unexpected output directory: ${outputDir}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, "mathematics"), { recursive: true });
await cp(sourceDir, path.join(outputDir, "mathematics"), { recursive: true });
const result = await rewriteCapacitorSite(outputDir);
console.log(`Prepared ${result.htmlCount} Capacitor pages in ${outputDir}.`);
