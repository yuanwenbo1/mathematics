import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildContentPack } from "../scripts/build-content-pack.mjs";

test("content pack embeds images, removes executable markup, and hashes atomically", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "mathematics-pack-"));
  try {
    await mkdir(path.join(directory, "assets"), { recursive: true });
    await writeFile(path.join(directory, "assets", "pixel.png"), Buffer.from([137, 80, 78, 71]));
    await writeFile(
      path.join(directory, "index.html"),
      `<!doctype html><html><head><title>测试教材</title></head><body>
        <main id="main-content"><h1 onclick="alert(1)">测试</h1><script>alert(1)</script>
        <img src="/mathematics/assets/pixel.png" onerror="alert(2)" alt="图"></main>
      </body></html>`,
      "utf8"
    );
    await writeFile(path.join(directory, "search.json"), JSON.stringify([{ title: "测试", url: "/mathematics/" }]), "utf8");

    const version = "a".repeat(40);
    const result = await buildContentPack({ siteDir: directory, version, publishedAt: "2026-07-31T00:00:00.000Z" });
    const page = result.pack.pages["/mathematics/"];

    assert.equal(result.manifest.version, version);
    assert.equal(result.manifest.pageCount, 1);
    assert.match(result.manifest.summary, /课程内容/);
    assert.equal(result.pack.searchIndex.length, 1);
    assert.ok(page.html.includes("data:image/png;base64,"));
    assert.ok(!page.html.includes("<script"));
    assert.ok(!page.html.includes("onclick"));
    assert.ok(!page.html.includes("onerror"));
    assert.equal(Buffer.byteLength(result.serialized), result.manifest.byteLength);
    assert.equal(createHash("sha256").update(result.serialized).digest("hex"), result.manifest.sha256);

    await assert.rejects(
      buildContentPack({ siteDir: directory, version, publishedAt: "invalid" }),
      /publishedAt/
    );
    await assert.rejects(
      buildContentPack({ siteDir: directory, version, origin: "http://example.com" }),
      /HTTPS/
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
