(async function () {
  "use strict";

  await (window.__CONTENT_READY__ || Promise.resolve());
  const isNativeApp = window.__IS_NATIVE_APP__ === true;

  const PROGRESS_KEY = "mathematics-learning-progress-v1";
  const CHAPTER_PROGRESS_KEY = "mathematics-chapter-progress-v1";
  const FONT_KEY = "mathematics-reader-font-size";
  const LAST_READ_KEY = "mathematics-last-read-v1";
  const courseOrder = [
    "prelude",
    "restart",
    "functions",
    "linear-algebra",
    "calculus",
    "probability",
    "discrete",
    "image-processing",
    "ai-math",
    "advanced-topics",
    "professional"
  ];

  const safeParse = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return parsed === null ? fallback : parsed;
    } catch (_error) {
      return fallback;
    }
  };

  const getCompleted = () => {
    const value = safeParse(localStorage.getItem(PROGRESS_KEY) || "[]", []);
    return new Set(Array.isArray(value) ? value : []);
  };

  const saveCompleted = (completed) => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(completed)));
  };

  const getCompletedChapters = () => {
    const value = safeParse(localStorage.getItem(CHAPTER_PROGRESS_KEY) || "[]", []);
    return new Set(Array.isArray(value) ? value : []);
  };

  const saveCompletedChapters = (completed) => {
    localStorage.setItem(CHAPTER_PROGRESS_KEY, JSON.stringify(Array.from(completed)));
  };

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  const setMainNavOpen = (isOpen) => {
    if (!navToggle || !siteNav) return;
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.title = isOpen ? "关闭导航" : "打开导航";
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => setMainNavOpen(!siteNav.classList.contains("is-open")));
    siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMainNavOpen(false)));
  }

  const meter = document.getElementById("reading-meter-value");
  const reader = document.querySelector(".book-reader");
  const readerScrollLabel = document.getElementById("reader-scroll-label");
  const readerAsidePercent = document.getElementById("reader-aside-percent");
  const readerAsideProgress = document.getElementById("reader-aside-progress");
  let lastSavedPercent = -1;

  const saveLastRead = (percent) => {
    if (!reader || percent === lastSavedPercent) return;
    const baseUrl = document.body.dataset.baseurl || "";
    if (!window.location.pathname.startsWith(`${baseUrl}/`)) return;
    lastSavedPercent = percent;
    localStorage.setItem(
      LAST_READ_KEY,
      JSON.stringify({
        url: `${window.location.pathname}${window.location.search}`,
        title: reader.dataset.readerTitle || document.body.dataset.pageTitle || document.title,
        courseId: reader.dataset.courseId || "",
        percent,
        updatedAt: new Date().toISOString()
      })
    );
  };

  const updateReadingMeter = () => {
    if (!meter) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const value = distance > 0 ? Math.min(100, Math.max(0, (window.scrollY / distance) * 100)) : 0;
    meter.style.width = `${value}%`;
    if (readerScrollLabel) {
      const rounded = Math.round(value);
      readerScrollLabel.textContent = `阅读进度 ${rounded}%`;
      if (readerAsidePercent) readerAsidePercent.textContent = `${rounded}%`;
      if (readerAsideProgress) readerAsideProgress.style.width = `${rounded}%`;
      saveLastRead(rounded);
    }
  };

  updateReadingMeter();
  window.addEventListener("scroll", updateReadingMeter, { passive: true });
  window.addEventListener("resize", updateReadingMeter);

  const refreshProgress = () => {
    const completed = getCompleted();
    document.querySelectorAll("[data-course-id]").forEach((element) => {
      const id = element.getAttribute("data-course-id");
      const isComplete = id && completed.has(id);
      element.classList.toggle("is-complete", Boolean(isComplete));
      const status = element.querySelector(".course-status");
      if (status) status.setAttribute("aria-label", isComplete ? "已完成" : "未完成");
    });

    const count = courseOrder.filter((id) => completed.has(id)).length;
    const percent = Math.round((count / courseOrder.length) * 100);
    const countElement = document.getElementById("home-progress-count");
    const percentElement = document.getElementById("home-progress-percent");
    const valueElement = document.getElementById("home-progress-value");
    const trackElement = document.getElementById("home-progress-track");

    if (countElement) countElement.textContent = `${count} / ${courseOrder.length} 册`;
    if (percentElement) percentElement.textContent = `${percent}%`;
    if (valueElement) valueElement.style.width = `${percent}%`;
    if (trackElement) trackElement.setAttribute("aria-valuenow", String(percent));

    const continueLink = document.getElementById("continue-learning");
    if (continueLink) {
      const nextId = courseOrder.find((id) => !completed.has(id));
      const nextCourse = nextId ? document.querySelector(`.course-row[data-course-id="${nextId}"]`) : null;
      if (nextCourse) {
        continueLink.href = nextCourse.href;
        continueLink.firstChild.textContent = count ? "继续学习 " : "从小学数学开始 ";
      } else if (count === courseOrder.length) {
        continueLink.href = document.querySelector(".site-nav a[href*='/library/']")?.href || continueLink.href;
        continueLink.firstChild.textContent = "查看教材目录 ";
      }
    }

    return completed;
  };

  const refreshChapterProgress = () => {
    const completedChapters = getCompletedChapters();
    document.querySelectorAll("[data-chapter-id]").forEach((element) => {
      const id = element.getAttribute("data-chapter-id");
      element.classList.toggle("is-complete", Boolean(id && completedChapters.has(id)));
    });
    return completedChapters;
  };

  const refreshResume = () => {
    const resumeStrip = document.getElementById("resume-strip");
    const resumeTitle = document.getElementById("resume-title");
    const resumeDetail = document.getElementById("resume-detail");
    const resumeLink = document.getElementById("resume-link");
    const continueLink = document.getElementById("continue-learning");
    const continueHeading = document.getElementById("continue-heading");
    if (!resumeStrip || !resumeTitle || !resumeDetail || !resumeLink) return;

    const lastRead = safeParse(localStorage.getItem(LAST_READ_KEY) || "null", null);
    const baseUrl = document.body.dataset.baseurl || "";
    if (!lastRead || typeof lastRead.url !== "string" || !lastRead.url.startsWith(`${baseUrl}/books/`)) return;

    const percent = Math.min(100, Math.max(0, Number(lastRead.percent) || 0));
    resumeTitle.textContent = lastRead.title || "继续上次阅读";
    resumeDetail.textContent = `阅读进度 ${percent}%`;
    resumeLink.href = lastRead.url;
    resumeStrip.hidden = false;
    if (continueHeading) continueHeading.textContent = lastRead.title || "继续上次阅读";
    if (continueLink) {
      continueLink.href = lastRead.url;
      continueLink.firstChild.textContent = "继续上次学习 ";
    }
  };

  let completed = refreshProgress();
  let completedChapters = refreshChapterProgress();
  refreshResume();
  const completionButton = document.getElementById("completion-toggle");
  const completionTitle = document.getElementById("completion-title");

  const refreshCompletionButton = () => {
    if (!completionButton) return;
    const chapterId = completionButton.getAttribute("data-chapter-id");
    const courseId = completionButton.getAttribute("data-course-id");
    const isChapter = Boolean(chapterId);
    const isComplete = isChapter ? completedChapters.has(chapterId) : Boolean(courseId && completed.has(courseId));
    completionButton.classList.toggle("is-complete", isComplete);
    completionButton.textContent = isComplete ? "取消完成" : isChapter ? "标记本章完成" : "标记完成";
    if (completionTitle) {
      completionTitle.textContent = isComplete ? (isChapter ? "本章已完成" : "本册已完成") : isChapter ? "完成本章学习了吗？" : "完成本册学习了吗？";
    }
  };

  refreshCompletionButton();

  if (completionButton) {
    completionButton.addEventListener("click", () => {
      const chapterId = completionButton.getAttribute("data-chapter-id");
      const courseId = completionButton.getAttribute("data-course-id");
      if (chapterId) {
        if (completedChapters.has(chapterId)) completedChapters.delete(chapterId);
        else completedChapters.add(chapterId);
        saveCompletedChapters(completedChapters);
        completedChapters = refreshChapterProgress();
      } else if (courseId) {
        if (completed.has(courseId)) completed.delete(courseId);
        else completed.add(courseId);
        saveCompleted(completed);
        completed = refreshProgress();
      }
      refreshCompletionButton();
    });
  }

  const minFont = 14;
  const maxFont = 20;
  const defaultFont = 16.5;
  let fontSize = Number(localStorage.getItem(FONT_KEY)) || defaultFont;

  const applyFontSize = (value) => {
    fontSize = Math.min(maxFont, Math.max(minFont, value));
    document.documentElement.style.setProperty("--reader-size", `${fontSize}px`);
    localStorage.setItem(FONT_KEY, String(fontSize));
  };

  applyFontSize(fontSize);
  document.querySelectorAll("[data-font-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-font-action");
      if (action === "increase") applyFontSize(fontSize + 1);
      if (action === "decrease") applyFontSize(fontSize - 1);
      if (action === "reset") applyFontSize(defaultFont);
    });
  });

  const sidebar = document.getElementById("book-sidebar");
  const sidebarOpen = document.getElementById("book-menu-button");
  const sidebarClose = document.getElementById("book-menu-close");
  const sidebarOverlay = document.getElementById("book-menu-overlay");

  const setSidebarOpen = (isOpen) => {
    if (!sidebar || !sidebarOpen || !sidebarOverlay) return;
    sidebar.classList.toggle("is-open", isOpen);
    sidebarOverlay.classList.toggle("is-visible", isOpen);
    sidebarOpen.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  };

  if (sidebarOpen) sidebarOpen.addEventListener("click", () => setSidebarOpen(true));
  if (sidebarClose) sidebarClose.addEventListener("click", () => setSidebarOpen(false));
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", () => setSidebarOpen(false));

  const outline = document.getElementById("page-outline");
  const mobileOutline = document.getElementById("reader-outline-mobile");
  const outlineToggle = document.getElementById("reader-outline-toggle");
  const outlinePanel = document.getElementById("reader-outline-panel");
  const headings = Array.from(document.querySelectorAll(".book-reader .prose h2, .book-reader .prose h3"));

  const setOutlineOpen = (isOpen) => {
    if (!outlineToggle || !outlinePanel) return;
    outlinePanel.hidden = !isOpen;
    outlineToggle.setAttribute("aria-expanded", String(isOpen));
  };

  if (headings.length && (outline || mobileOutline)) {
    const outlineTargets = [outline, mobileOutline].filter(Boolean);
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      outlineTargets.forEach((target) => {
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent || "章节";
        link.dataset.level = heading.tagName === "H3" ? "3" : "2";
        link.addEventListener("click", () => setOutlineOpen(false));
        target.appendChild(link);
      });
    });

    if ("IntersectionObserver" in window) {
      const links = outlineTargets.flatMap((target) => Array.from(target.querySelectorAll("a")));
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.find((entry) => entry.isIntersecting);
          if (!visible) return;
          links.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
        },
        { rootMargin: "-18% 0px -72%", threshold: 0 }
      );
      headings.forEach((heading) => observer.observe(heading));
    }
  }

  if (outlineToggle) outlineToggle.addEventListener("click", () => setOutlineOpen(outlinePanel?.hidden !== false));

  const installButton = document.getElementById("pwa-install-button");
  const pwaStatus = document.getElementById("pwa-status");
  const pwaStatusMessage = document.getElementById("pwa-status-message");
  const pwaStatusClose = document.getElementById("pwa-status-close");
  const pwaUpdateButton = document.getElementById("pwa-update-button");
  let installPrompt = null;
  let statusTimer = null;
  let pendingRegistration = null;
  let refreshing = false;

  const showPwaStatus = (message, options = {}) => {
    if (!pwaStatus || !pwaStatusMessage || !pwaUpdateButton) return;
    window.clearTimeout(statusTimer);
    pwaStatusMessage.textContent = message;
    pwaUpdateButton.hidden = !options.showUpdate;
    pwaStatus.hidden = false;
    if (!options.persistent) {
      statusTimer = window.setTimeout(() => {
        pwaStatus.hidden = true;
      }, 5000);
    }
  };

  if (pwaStatusClose && pwaStatus) {
    pwaStatusClose.addEventListener("click", () => {
      window.clearTimeout(statusTimer);
      pwaStatus.hidden = true;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setMainNavOpen(false);
    setSidebarOpen(false);
    setOutlineOpen(false);
  });

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (installButton && isStandalone) installButton.hidden = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    if (isNativeApp) return;
    event.preventDefault();
    installPrompt = event;
    if (installButton && !isStandalone) installButton.hidden = false;
  });

  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (!installPrompt) return;
      installButton.disabled = true;
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installPrompt = null;
      installButton.disabled = false;
      installButton.hidden = true;
      if (choice.outcome === "accepted") showPwaStatus("应用已安装到设备");
    });
  }

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (installButton) installButton.hidden = true;
    showPwaStatus("应用已安装到设备");
  });

  const announceUpdate = (registration) => {
    pendingRegistration = registration;
    showPwaStatus("教材有新版本", { showUpdate: true, persistent: true });
  };

  if (pwaUpdateButton) {
    pwaUpdateButton.addEventListener("click", () => {
      pendingRegistration?.waiting?.postMessage({ type: "SKIP_WAITING" });
      pwaUpdateButton.disabled = true;
      if (pwaStatusMessage) pwaStatusMessage.textContent = "正在更新教材...";
    });
  }

  if (!isNativeApp && "serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      const baseUrl = document.body.dataset.baseurl || "";
      try {
        const registration = await navigator.serviceWorker.register(`${baseUrl}/service-worker.js`, { scope: `${baseUrl}/` });
        if (registration.waiting && navigator.serviceWorker.controller) announceUpdate(registration);

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) announceUpdate(registration);
          });
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  if (!isNativeApp) {
    const showOfflineStatus = () => showPwaStatus("当前离线，正在使用已缓存教材", { persistent: true });
    window.addEventListener("offline", showOfflineStatus);
    window.addEventListener("online", () => showPwaStatus("网络已恢复"));
    if (!navigator.onLine) showOfflineStatus();
  }
})();
