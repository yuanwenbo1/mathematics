import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { rewriteCapacitorSite, toCapacitorPageUrl } from "../scripts/rewrite-capacitor-site.mjs";

test("Capacitor pages use explicit HTML routes and copy the full home page to the root", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "mathematics-capacitor-"));
  try {
    const site = path.join(directory, "mathematics");
    await mkdir(path.join(site, "books", "prelude"), { recursive: true });
    await writeFile(
      path.join(site, "index.html"),
      '<!doctype html><html><body><main>完整首页</main><a href="/mathematics/books/prelude/">教材</a><a href="https://example.com/">站外</a></body></html>',
      "utf8"
    );
    await writeFile(
      path.join(site, "books", "prelude", "index.html"),
      '<!doctype html><html><body><a href="https://yuanwenbo1.github.io/mathematics/">首页</a></body></html>',
      "utf8"
    );
    await writeFile(path.join(site, "search.json"), JSON.stringify([{ title: "小学", url: "/mathematics/books/prelude/" }]), "utf8");

    const result = await rewriteCapacitorSite(directory);
    const home = await readFile(path.join(directory, "index.html"), "utf8");
    const nested = await readFile(path.join(site, "books", "prelude", "index.html"), "utf8");
    const search = JSON.parse(await readFile(path.join(site, "search.json"), "utf8"));

    assert.equal(result.htmlCount, 2);
    assert.match(home, /完整首页/);
    assert.match(home, /\/mathematics\/books\/prelude\/index\.html/);
    assert.match(home, /https:\/\/example\.com\//);
    assert.match(nested, /\/mathematics\/index\.html/);
    assert.equal(search[0].url, "/mathematics/books/prelude/index.html");
    assert.equal(toCapacitorPageUrl("mailto:test@example.com"), "mailto:test@example.com");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
