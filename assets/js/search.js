(async function () {
  "use strict";

  await (window.__CONTENT_READY__ || Promise.resolve());

  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const count = document.getElementById("search-count");
  if (!input || !results || !count) return;

  let documents = [];
  const normalize = (value) => (value || "").toString().toLowerCase().trim();
  const escapeHtml = (value) =>
    (value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const excerpt = (content, keyword) => {
    const text = (content || "").replace(/\s+/g, " ").trim();
    const index = normalize(text).indexOf(keyword);
    const start = index > 60 ? index - 60 : 0;
    return text.slice(start, start + 180) + (text.length > start + 180 ? "..." : "");
  };

  const render = (items, keyword) => {
    count.textContent = keyword ? `找到 ${items.length} 篇相关内容` : "输入关键词开始搜索";
    if (!keyword) {
      results.innerHTML = "";
      return;
    }
    if (!items.length) {
      results.innerHTML = '<div class="empty-state"><h2>没有找到相关内容</h2><p>可以换一个更短的概念或课程名称。</p></div>';
      return;
    }
    results.innerHTML = items
      .map(
        (item) => `
          <article class="search-result">
            <span>${escapeHtml(item.category)}</span>
            <h2><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h2>
            <p>${escapeHtml(excerpt(item.content || item.description, keyword))}</p>
          </article>`
      )
      .join("");
  };

  const runSearch = () => {
    const keyword = normalize(input.value);
    if (!keyword) return render([], "");
    const matched = documents
      .map((item) => {
        const title = normalize(item.title);
        const description = normalize(item.description);
        const content = normalize(item.content);
        const category = normalize(item.category);
        let score = 0;
        if (title.includes(keyword)) score += 10;
        if (description.includes(keyword)) score += 5;
        if (category.includes(keyword)) score += 3;
        if (content.includes(keyword)) score += 1;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
    render(matched, keyword);
  };

  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const indexUrl = new URL("../../search.json", scriptUrl);

  const updatedDocuments = window.__APP_CONTENT_PACK__?.searchIndex;
  const indexRequest = Array.isArray(updatedDocuments) ? Promise.resolve(updatedDocuments) : fetch(indexUrl).then((response) => {
    if (!response.ok) throw new Error("search index unavailable");
    return response.json();
  });

  indexRequest
    .then((data) => {
      documents = Array.isArray(data) ? data : [];
      input.disabled = false;
      input.addEventListener("input", runSearch);
      const query = new URLSearchParams(window.location.search).get("q");
      if (query) {
        input.value = query;
        runSearch();
      }
    })
    .catch(() => {
      count.textContent = "搜索索引加载失败，请稍后重试";
    });
})();
