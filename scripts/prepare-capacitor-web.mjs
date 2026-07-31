import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve(process.argv[2] || "_site");
const outputDir = path.resolve(process.argv[3] || "_site-app");
const workspace = path.resolve(".");

if (!outputDir.startsWith(`${workspace}${path.sep}`) || path.basename(outputDir) !== "_site-app") {
  throw new Error(`Refusing to replace unexpected output directory: ${outputDir}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, "mathematics"), { recursive: true });
await cp(sourceDir, path.join(outputDir, "mathematics"), { recursive: true });

const redirect = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="refresh" content="0;url=/mathematics/">
    <title>数学自学教材</title>
  </head>
  <body><a href="/mathematics/">打开数学自学教材</a></body>
</html>
`;

await writeFile(path.join(outputDir, "index.html"), redirect, "utf8");
console.log(`Prepared Capacitor web assets in ${outputDir}.`);
