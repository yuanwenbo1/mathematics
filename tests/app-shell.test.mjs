import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("responsive app shell exposes mobile navigation and a user-controlled update dialog", async () => {
  const base = await readFile("_layouts/base.html", "utf8");
  const book = await readFile("_layouts/book.html", "utf8");
  const home = await readFile("index.md", "utf8");
  const library = await readFile("library.md", "utf8");
  const styles = await readFile("assets/css/main.css", "utf8");

  assert.match(base, /class="mobile-tabbar"/);
  assert.doesNotMatch(base, /20260803-ui/);
  assert.match(base, /assets\/css\/main\.css[\s\S]*site\.data\.build\.version/);
  assert.match(base, /assets\/js\/app-content\.js[\s\S]*site\.data\.build\.version/);
  assert.match(base, /assets\/js\/site\.js[\s\S]*site\.data\.build\.version/);
  assert.match(base, /id="update-dialog"/);
  assert.match(base, /id="update-dialog-later"/);
  assert.match(base, /id="update-dialog-install"/);
  assert.match(book, /id="reader-outline-toggle"/);
  assert.match(book, /id="reader-scroll-label"/);
  assert.match(book, /id="reader-aside-progress"/);
  assert.match(home, /class="home-dashboard"/);
  assert.match(home, /class="daily-task-list"/);
  assert.match(library, /class="site-container library-shell"/);
  assert.match(library, /class="library-stage-nav"/);
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.mobile-tabbar/);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*\.library-stage-nav/);

  let depth = 0;
  for (const character of styles.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;
    assert.ok(depth >= 0, "CSS closes a block before it is opened");
  }
  assert.equal(depth, 0, "CSS block braces must be balanced");
});

test("Android schedules offline course checks and declares notification permissions", async () => {
  const manifest = await readFile("android/app/src/main/AndroidManifest.xml", "utf8");
  const activity = await readFile(
    "android/app/src/main/java/io/github/yuanwenbo1/mathematics/MainActivity.java",
    "utf8"
  );
  const job = await readFile(
    "android/app/src/main/java/io/github/yuanwenbo1/mathematics/CourseUpdateJobService.java",
    "utf8"
  );

  assert.match(manifest, /android\.permission\.POST_NOTIFICATIONS/);
  assert.match(manifest, /android\.permission\.BIND_JOB_SERVICE/);
  assert.match(activity, /CourseUpdateJobService\.schedule\(this\)/);
  assert.match(job, /setRequiredNetworkType\(JobInfo\.NETWORK_TYPE_ANY\)/);
  assert.match(job, /app-content-version\.json/);
  assert.match(job, /打开应用查看更新内容，并选择是否下载/);
});
