---
layout: base
title: 教材目录
description: 按数学知识依赖组织的完整教材目录。
permalink: /library/
search: false
---

<header class="page-header library-header">
  <div class="site-container">
    <p class="eyebrow">Library</p>
    <h1>教材目录</h1>
    <p>主线从数学启蒙延伸到本科数学和研究方向；图像处理与 AI 作为应用专题，用来检验基础知识是否真正会用。</p>
  </div>
</header>

<section class="curriculum-section library-section">
  <div class="site-container">
{%- for stage in site.data.curriculum.stages %}
<section class="stage-row">
  <header>
    <h2>{{ stage.title }}</h2>
    <p>{{ stage.description }}</p>
  </header>
  <div class="course-list">
{%- for book in stage.books %}
    <a class="course-row" href="{{ book.url | relative_url }}" data-course-id="{{ book.id }}">
      <span class="course-code">{{ book.code }}</span>
      <span class="course-copy"><small>{{ book.level }}</small><strong>{{ book.title }}</strong><em>{{ book.description }}</em></span>
      <span class="course-duration">{{ book.duration }}</span>
      <i class="course-status" aria-label="未完成"></i>
    </a>
{%- endfor %}
  </div>
</section>
{%- endfor %}
  </div>
</section>
