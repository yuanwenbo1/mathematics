---
layout: base
title: 教材目录
description: 从中国小学、初中、高中到大学和研究方向的完整教材目录。
permalink: /library/
search: false
---

<header class="page-header library-header">
  <div class="site-container library-header-inner">
    <div>
      <p class="eyebrow">教材目录</p>
      <h1>找到当前阶段，按顺序学下去</h1>
      <p>中小学主线共 75 章，之后按知识依赖进入大学基础、应用专题和专业方向。</p>
    </div>
    <dl class="library-stats" aria-label="教材统计">
      <div><dt>11</dt><dd>册教材</dd></div>
      <div><dt>75</dt><dd>中小学章节</dd></div>
      <div><dt>600</dt><dd>道基础题</dd></div>
    </dl>
  </div>
</header>

<section class="library-section">
  <div class="site-container library-shell">
    <aside class="library-stage-nav" aria-label="按阶段浏览">
      <strong>按阶段浏览</strong>
      <nav>
      {%- for stage in site.data.curriculum.stages %}
        <a href="#stage-{{ stage.id }}"><span>0{{ forloop.index }}</span>{{ stage.title | remove: '阶段一：' | remove: '阶段二：' | remove: '阶段三：' | remove: '阶段四：' }}</a>
      {%- endfor %}
      </nav>
      <a class="library-guide-link" href="{{ '/guide/' | relative_url }}">不确定从哪里开始？<br><strong>查看起点建议 →</strong></a>
    </aside>

    <div class="library-catalog">
    {%- for stage in site.data.curriculum.stages %}
      <section class="library-stage" id="stage-{{ stage.id }}">
        <header>
          <div>
            <span class="stage-index">0{{ forloop.index }}</span>
            <h2>{{ stage.title }}</h2>
          </div>
          <p>{{ stage.description }}</p>
        </header>
        <div class="course-list">
        {%- for book in stage.books %}
          {% assign book_chapters = site.data.k12_chapters[book.id] %}
          <a class="course-row" href="{{ book.url | relative_url }}" data-course-id="{{ book.id }}">
            <span class="course-code">{{ book.code }}</span>
            <span class="course-copy">
              <small>{{ book.level }}</small>
              <strong>{{ book.title }}</strong>
              <em>{{ book.description }}</em>
            </span>
            <span class="course-meta">{% if book_chapters %}{{ book_chapters.size }} 章{% else %}{{ book.duration }}{% endif %}</span>
            <i class="course-status" aria-label="未完成"></i>
            <span class="course-arrow" aria-hidden="true">→</span>
          </a>
        {%- endfor %}
        </div>
      </section>
    {%- endfor %}
    </div>
  </div>
</section>
