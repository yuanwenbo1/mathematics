import { createHash } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_ORIGIN = "https://yuanwenbo1.github.io";
const BASE_PATH = "/mathematics";
const outputDir = path.resolve(process.argv[2] || "_site-app");
const stagingDir = path.resolve(`${outputDir}.download`);
const workspace = path.resolve(".");

if (!outputDir.startsWith(`${workspace}${path.sep}`) || path.basename(outputDir) !== "_site-app") {
  throw new Error(`Refusing to replace unexpected output directory: ${outputDir}`);
}

const fetchWithRetry = async (url, options = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store", ...options });
      if (response.ok || response.status < 500) return response;
      lastError = new Error(`${response.status} while downloading ${url}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  throw lastError;
};

const requestJson = async (url) => {
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`${response.status} while downloading ${url}`);
  return response.json();
};

const versionManifest = await requestJson(`${SITE_ORIGIN}${BASE_PATH}/app-content-version.json?time=${Date.now()}`);
const contentResponse = await fetchWithRetry(`${SITE_ORIGIN}${BASE_PATH}/app-content.json?time=${Date.now()}`);
if (!contentResponse.ok) throw new Error(`${contentResponse.status} while downloading the textbook content pack.`);
const contentText = await contentResponse.text();
const contentPack = JSON.parse(contentText);
if (contentPack.version !== versionManifest.version) throw new Error("Published content manifest and pack versions do not match.");
if (Buffer.byteLength(contentText) !== versionManifest.byteLength) throw new Error("Published content pack size does not match its manifest.");
if (createHash("sha256").update(contentText).digest("hex") !== versionManifest.sha256) {
  throw new Error("Published content pack failed SHA-256 verification.");
}

const workerResponse = await fetchWithRetry(`${SITE_ORIGIN}${BASE_PATH}/service-worker.js?time=${Date.now()}`);
if (!workerResponse.ok) throw new Error(`Unable to download published Service Worker (${workerResponse.status}).`);
const workerSource = await workerResponse.text();
const workerPaths = [...workerSource.matchAll(/"(\/mathematics\/[^\"]*)"/g)].map((match) => match[1]);
const urls = [...new Set([...workerPaths, ...Object.keys(contentPack.pages)])].sort();

const outputPathForUrl = (urlString) => {
  const url = new URL(urlString, SITE_ORIGIN);
  const relative = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const filename = url.pathname.endsWith("/") ? path.join(relative, "index.html") : relative;
  const output = path.resolve(stagingDir, filename.split("/").join(path.sep));
  if (!output.startsWith(`${stagingDir}${path.sep}`)) throw new Error(`Unsafe mirrored path: ${url.pathname}`);
  return output;
};

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

await rm(stagingDir, { recursive: true, force: true });
await mkdir(stagingDir, { recursive: true });
try {
  for (let index = 0; index < urls.length; index += 4) {
    const group = urls.slice(index, index + 4);
    await Promise.all(
      group.map(async (pathname) => {
        const response = await fetchWithRetry(`${SITE_ORIGIN}${pathname}`);
        if (!response.ok) throw new Error(`${response.status} while mirroring ${pathname}`);
        const filename = outputPathForUrl(pathname);
        await mkdir(path.dirname(filename), { recursive: true });
        await writeFile(filename, Buffer.from(await response.arrayBuffer()));
      })
    );
  }

  await writeFile(path.join(stagingDir, "index.html"), redirect, "utf8");
  await rm(outputDir, { recursive: true, force: true });
  await rename(stagingDir, outputDir);
} catch (error) {
  await rm(stagingDir, { recursive: true, force: true });
  throw error;
}
console.log(`Mirrored ${urls.length} files for content version ${contentPack.version.slice(0, 12)}.`);
