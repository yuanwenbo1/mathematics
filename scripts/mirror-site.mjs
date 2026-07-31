import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_ORIGIN = "https://yuanwenbo1.github.io";
const BASE_PATH = "/mathematics";
const outputDir = path.resolve(process.argv[2] || "_site-app");
const workspace = path.resolve(".");

if (!outputDir.startsWith(`${workspace}${path.sep}`) || path.basename(outputDir) !== "_site-app") {
  throw new Error(`Refusing to replace unexpected output directory: ${outputDir}`);
}

const requestJson = async (url) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} while downloading ${url}`);
  return response.json();
};

const versionManifest = await requestJson(`${SITE_ORIGIN}${BASE_PATH}/app-content-version.json?time=${Date.now()}`);
const contentResponse = await fetch(`${SITE_ORIGIN}${BASE_PATH}/app-content.json?time=${Date.now()}`, { cache: "no-store" });
if (!contentResponse.ok) throw new Error(`${contentResponse.status} while downloading the textbook content pack.`);
const contentText = await contentResponse.text();
const contentPack = JSON.parse(contentText);
if (contentPack.version !== versionManifest.version) throw new Error("Published content manifest and pack versions do not match.");
if (Buffer.byteLength(contentText) !== versionManifest.byteLength) throw new Error("Published content pack size does not match its manifest.");
if (createHash("sha256").update(contentText).digest("hex") !== versionManifest.sha256) {
  throw new Error("Published content pack failed SHA-256 verification.");
}

const workerResponse = await fetch(`${SITE_ORIGIN}${BASE_PATH}/service-worker.js?time=${Date.now()}`, { cache: "no-store" });
if (!workerResponse.ok) throw new Error(`Unable to download published Service Worker (${workerResponse.status}).`);
const workerSource = await workerResponse.text();
const workerPaths = [...workerSource.matchAll(/"(\/mathematics\/[^\"]*)"/g)].map((match) => match[1]);
const urls = [...new Set([...workerPaths, ...Object.keys(contentPack.pages)])].sort();

const outputPathForUrl = (urlString) => {
  const url = new URL(urlString, SITE_ORIGIN);
  const relative = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const filename = url.pathname.endsWith("/") ? path.join(relative, "index.html") : relative;
  const output = path.resolve(outputDir, filename.split("/").join(path.sep));
  if (!output.startsWith(`${outputDir}${path.sep}`)) throw new Error(`Unsafe mirrored path: ${url.pathname}`);
  return output;
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (let index = 0; index < urls.length; index += 8) {
  const group = urls.slice(index, index + 8);
  await Promise.all(
    group.map(async (pathname) => {
      const response = await fetch(`${SITE_ORIGIN}${pathname}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`${response.status} while mirroring ${pathname}`);
      const filename = outputPathForUrl(pathname);
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, Buffer.from(await response.arrayBuffer()));
    })
  );
}

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
console.log(`Mirrored ${urls.length} files for content version ${contentPack.version.slice(0, 12)}.`);
