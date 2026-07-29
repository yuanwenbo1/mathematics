---
layout: base
title: 搜索教材
description: 搜索教材标题、章节和正文内容。
permalink: /search/
search: false
---

<header class="page-header search-header">
  <div class="content-container">
    <p class="eyebrow">Search</p>
    <h1>搜索教材</h1>
    <p>输入概念、公式或主题，搜索所有教材与配套资料。</p>
  </div>
</header>

<section class="page-section">
  <div class="content-container search-shell">
    <div class="search-box">
      <input id="search-input" type="search" placeholder="例如：梯度下降、矩阵乘法、贝叶斯" autocomplete="off" aria-label="搜索教材" disabled>
      <span id="search-count">搜索索引加载中...</span>
    </div>
    <div id="search-results" class="search-results"></div>
  </div>
</section>

<script src="{{ '/assets/js/search.js' | relative_url }}" defer></script>
