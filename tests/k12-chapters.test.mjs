import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const courseDefinitions = [
  {
    id: "prelude",
    directory: "textbook/k12/primary",
    overview: "textbook/第前置册_数据启蒙与小学数学.md",
    expectedCount: 26,
    nextCourseUrl: "/books/restart/"
  },
  {
    id: "restart",
    directory: "textbook/k12/junior",
    overview: "textbook/第0册_数学重新启动.md",
    expectedCount: 22,
    nextCourseUrl: "/books/functions/"
  },
  {
    id: "functions",
    directory: "textbook/k12/senior",
    overview: "textbook/第1册_函数与初等数学.md",
    expectedCount: 27,
    nextCourseUrl: "/books/linear-algebra/"
  }
];

test("K12 textbooks are split into ordered standalone chapter pages", async () => {
  const chapterData = JSON.parse(await readFile("_data/k12_chapters.json", "utf8"));
  const allUrls = new Set();
  const allIds = new Set();

  for (const course of courseDefinitions) {
    const chapters = chapterData[course.id];
    assert.equal(chapters.length, course.expectedCount);

    const overview = await readFile(course.overview, "utf8");
    assert.doesNotMatch(overview, /^## (?:第\s*\d+\s*章|儿童扩展|.*专题)/m);
    assert.match(overview, new RegExp(`site\\.data\\.k12_chapters\\.${course.id}`));
    assert.match(overview, new RegExp(`next_url: ${chapters[0].url.replaceAll("/", "\\/")}`));

    const filenames = (await readdir(course.directory)).filter((filename) => filename.endsWith(".md"));
    assert.equal(filenames.length, chapters.length);
    const documents = await Promise.all(
      filenames.map(async (filename) => ({
        filename,
        content: await readFile(path.join(course.directory, filename), "utf8")
      }))
    );

    for (let index = 0; index < chapters.length; index += 1) {
      const chapter = chapters[index];
      assert.ok(!allUrls.has(chapter.url), `duplicate chapter URL: ${chapter.url}`);
      assert.ok(!allIds.has(chapter.id), `duplicate chapter id: ${chapter.id}`);
      allUrls.add(chapter.url);
      allIds.add(chapter.id);

      const document = documents.find(({ content }) => content.includes(`chapter_id: ${chapter.id}\n`));
      assert.ok(document, `missing Markdown page for ${chapter.id}`);
      assert.match(document.content, new RegExp(`permalink: ${chapter.url.replaceAll("/", "\\/")}`));
      assert.match(document.content, /^search: true$/m);
      assert.match(document.content, /^#\s+\S/m);

      const expectedPrevious = index === 0 ? `/books/${course.id === "prelude" ? "prelude" : course.id === "restart" ? "restart" : "functions"}/` : chapters[index - 1].url;
      const expectedNext = chapters[index + 1]?.url || course.nextCourseUrl;
      assert.match(document.content, new RegExp(`prev_url: ${expectedPrevious.replaceAll("/", "\\/")}`));
      assert.match(document.content, new RegExp(`next_url: ${expectedNext.replaceAll("/", "\\/")}`));
    }
  }

  assert.equal(allIds.size, 75);
  assert.equal(allUrls.size, 75);
});

test("chapter navigation and offline cache consume the shared chapter index", async () => {
  const layout = await readFile("_layouts/book.html", "utf8");
  const serviceWorker = await readFile("service-worker.js", "utf8");
  const script = await readFile("assets/js/site.js", "utf8");

  assert.match(layout, /site\.data\.k12_chapters\[book\.id\]/);
  assert.match(layout, /data-chapter-id/);
  assert.match(serviceWorker, /site\.data\.k12_chapters\.prelude/);
  assert.match(serviceWorker, /site\.data\.k12_chapters\.restart/);
  assert.match(serviceWorker, /site\.data\.k12_chapters\.functions/);
  assert.match(script, /mathematics-chapter-progress-v1/);
});
