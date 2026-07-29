---
layout: base
title: 教材目录
description: 从中国小学、初中、高中到大学和研究方向的完整教材目录。
permalink: /library/
search: false
---

<header class="page-header library-header">
  <div class="site-container">
    <p class="eyebrow">Library</p>
    <h1>教材目录</h1>
    <p>前三册完整覆盖中国小学、初中和高中数学，之后按知识依赖进入大学基础、应用专题、数学专业课程和研究方向。</p>
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
