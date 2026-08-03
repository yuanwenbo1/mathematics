import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as cheerio from "cheerio";

const MIME_TYPES = new Map([
  [".gif", "image/gif"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"]
]);

const parseArgs = (values) =>
  Object.fromEntries(
    values.map((argument) => {
      const [key, ...value] = argument.replace(/^--/, "").split("=");
      return [key, value.join("=")];
    })
  );

const normalizeBaseurl = (value) => {
  const normalized = `/${String(value || "").replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? "" : normalized;
};

const listHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
    })
  );
  return nested.flat();
};

const routeForFile = (siteDir, filename, baseurl) => {
  const relative = path.relative(siteDir, filename).split(path.sep).join("/");
  if (relative === "index.html") return `${baseurl}/` || "/";
  if (relative.endsWith("/index.html")) return `${baseurl}/${relative.slice(0, -"index.html".length)}`;
  return `${baseurl}/${relative}`;
};

const isInside = (parent, candidate) => candidate === parent || candidate.startsWith(`${parent}${path.sep}`);

const embedLocalImage = async ({ $, element, siteDir, baseurl, origin }) => {
  const source = $(element).attr("src");
  if (!source || source.startsWith("data:")) return;

  let imageUrl;
  try {
    imageUrl = new URL(source, `${origin}${baseurl}/`);
  } catch (_error) {
    return;
  }

  if (imageUrl.origin !== origin || !imageUrl.pathname.startsWith(`${baseurl}/`)) return;
  const relativePath = decodeURIComponent(imageUrl.pathname.slice(baseurl.length + 1));
  const filename = path.resolve(siteDir, relativePath.split("/").join(path.sep));
  if (!isInside(siteDir, filename)) throw new Error(`Image path escapes site directory: ${source}`);

  const mimeType = MIME_TYPES.get(path.extname(filename).toLowerCase());
  if (!mimeType) return;
  const data = await readFile(filename);
  $(element).attr("src", `data:${mimeType};base64,${data.toString("base64")}`);
  $(element).removeAttr("srcset");
};

const sanitizeMain = async ({ html, siteDir, baseurl, origin }) => {
  const $ = cheerio.load(html, { decodeEntities: false });
  const main = $("main#main-content").first();
  if (!main.length) return null;

  main.find("script,style,iframe,object,embed,form").remove();
  main.find("*").each((_index, element) => {
    const attributes = { ...(element.attribs || {}) };
    for (const name of Object.keys(attributes)) {
      if (/^on/i.test(name) || name === "srcdoc" || name === "style") $(element).removeAttr(name);
    }
    for (const name of ["href", "src", "action", "formaction"]) {
      const value = $(element).attr(name)?.trim() || "";
      if (/^(javascript|vbscript|data:text\/html):/i.test(value)) $(element).removeAttr(name);
    }
  });

  const images = main.find("img[src],source[src]").toArray();
  await Promise.all(images.map((element) => embedLocalImage({ $, element, siteDir, baseurl, origin })));

  main.find('a[href^="http://"],a[href^="https://"]').each((_index, element) => {
    $(element).attr("rel", "noopener noreferrer");
  });

  return {
    title: $("title").text().trim(),
    html: main.html() || ""
  };
};

export const buildContentPack = async ({
  siteDir,
  baseurl = "/mathematics",
  origin = "https://yuanwenbo1.github.io",
  version,
  publishedAt = new Date().toISOString()
}) => {
  const resolvedSiteDir = path.resolve(siteDir);
  const normalizedBaseurl = normalizeBaseurl(baseurl);
  if (!/^[0-9a-f]{40}$/.test(version || "")) throw new Error("Content version must be a 40-character Git SHA.");
  if (!Number.isFinite(Date.parse(publishedAt || ""))) throw new Error("Content publishedAt must be a valid date.");
  if (new URL(origin).origin !== origin) throw new Error("Content origin must contain only an HTTPS origin.");
  if (!origin.startsWith("https://")) throw new Error("Content origin must use HTTPS.");

  const files = (await listHtmlFiles(resolvedSiteDir)).sort();
  const pages = {};
  for (const filename of files) {
    const source = await readFile(filename, "utf8");
    const content = await sanitizeMain({ html: source, siteDir: resolvedSiteDir, baseurl: normalizedBaseurl, origin });
    if (content) pages[routeForFile(resolvedSiteDir, filename, normalizedBaseurl)] = content;
  }

  const searchIndexPath = path.join(resolvedSiteDir, "search.json");
  const searchIndex = JSON.parse(await readFile(searchIndexPath, "utf8"));
  if (!Array.isArray(searchIndex)) throw new Error("Generated search.json must contain an array.");

  const pack = { version, publishedAt, pages, searchIndex };
  const serialized = JSON.stringify(pack);
  const sha256 = createHash("sha256").update(serialized).digest("hex");
  const manifest = {
    version,
    publishedAt,
    pageCount: Object.keys(pages).length,
    byteLength: Buffer.byteLength(serialized),
    sha256,
    summary: "课程内容、学习导航和阅读体验已更新。你可以现在下载，也可以稍后继续使用当前离线教材。",
    downloadUrl: `${origin}${normalizedBaseurl}/app-content.json`
  };

  return { manifest, pack, serialized };
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  const args = parseArgs(process.argv.slice(2));
  const siteDir = path.resolve(args.site || "_site");
  const version = args.version || process.env.CONTENT_VERSION || process.env.GITHUB_SHA;
  const publishedAt = args.publishedAt || process.env.CONTENT_PUBLISHED_AT || new Date().toISOString();
  const result = await buildContentPack({
    siteDir,
    baseurl: args.baseurl || "/mathematics",
    origin: args.origin || "https://yuanwenbo1.github.io",
    version,
    publishedAt
  });

  await writeFile(path.join(siteDir, "app-content.json"), result.serialized, "utf8");
  await writeFile(path.join(siteDir, "app-content-version.json"), `${JSON.stringify(result.manifest, null, 2)}\n`, "utf8");
  console.log(`Built ${result.manifest.pageCount} updateable pages (${result.manifest.byteLength} bytes).`);
}
