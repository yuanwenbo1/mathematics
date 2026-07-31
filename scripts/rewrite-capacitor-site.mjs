import { copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const SITE_ORIGIN = "https://yuanwenbo1.github.io";
const BASE_PATH = "/mathematics/";

const listFiles = async (directory, predicate) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) return listFiles(filename, predicate);
      return entry.isFile() && predicate(filename) ? [filename] : [];
    })
  );
  return nested.flat();
};

export const toCapacitorPageUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return value;
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN || !url.pathname.startsWith(BASE_PATH) || !url.pathname.endsWith("/")) return value;
    return `${url.pathname}index.html${url.search}${url.hash}`;
  } catch (_error) {
    return value;
  }
};

export const rewriteCapacitorSite = async (siteDir) => {
  const resolvedSiteDir = path.resolve(siteDir);
  const htmlFiles = await listFiles(resolvedSiteDir, (filename) => filename.endsWith(".html"));

  for (const filename of htmlFiles) {
    const source = await readFile(filename, "utf8");
    const $ = cheerio.load(source, { decodeEntities: false });
    $("a[href]").each((_index, element) => {
      const href = $(element).attr("href");
      $(element).attr("href", toCapacitorPageUrl(href));
    });
    await writeFile(filename, $.html(), "utf8");
  }

  const searchPath = path.join(resolvedSiteDir, "mathematics", "search.json");
  const searchIndex = JSON.parse(await readFile(searchPath, "utf8"));
  if (!Array.isArray(searchIndex)) throw new Error("Capacitor search index must contain an array.");
  const rewrittenSearchIndex = searchIndex.map((item) => ({ ...item, url: toCapacitorPageUrl(item.url) }));
  await writeFile(searchPath, `${JSON.stringify(rewrittenSearchIndex)}\n`, "utf8");

  const homePath = path.join(resolvedSiteDir, "mathematics", "index.html");
  await copyFile(homePath, path.join(resolvedSiteDir, "index.html"));
  return { htmlCount: htmlFiles.length, searchCount: rewrittenSearchIndex.length };
};
