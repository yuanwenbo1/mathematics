import { writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, "").split("=");
    return [key, value.join("=")];
  })
);

const version = args.version || process.env.CONTENT_VERSION || process.env.GITHUB_SHA || "development";
const target = args.target || process.env.BUILD_TARGET || "web";
const publishedAt = args.publishedAt || process.env.CONTENT_PUBLISHED_AT || new Date().toISOString();

if (!/^(development|[0-9a-f]{40})$/.test(version)) {
  throw new Error("Build version must be 'development' or a 40-character Git SHA.");
}

if (!new Set(["web", "app"]).has(target)) {
  throw new Error("Build target must be 'web' or 'app'.");
}

const output = [
  `version: "${version}"`,
  `target: "${target}"`,
  `published_at: "${publishedAt}"`,
  ""
].join("\n");

await writeFile(path.resolve("_data/build.yml"), output, "utf8");
console.log(`Wrote build metadata for ${target} at ${version.slice(0, 12)}.`);
