import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("responsive app shell exposes mobile navigation and a user-controlled update dialog", async () => {
  const base = await readFile("_layouts/base.html", "utf8");
  const book = await readFile("_layouts/book.html", "utf8");
  const styles = await readFile("assets/css/main.css", "utf8");

  assert.match(base, /class="mobile-tabbar"/);
  assert.match(base, /id="update-dialog"/);
  assert.match(base, /id="update-dialog-later"/);
  assert.match(base, /id="update-dialog-install"/);
  assert.match(book, /id="reader-outline-toggle"/);
  assert.match(book, /id="reader-scroll-label"/);
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.mobile-tabbar/);
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
