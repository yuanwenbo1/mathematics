(async function () {
  "use strict";

  await (window.__CONTENT_READY__ || Promise.resolve());
  const isNativeApp = window.__IS_NATIVE_APP__ === true;

  const PROGRESS_KEY = "mathematics-learning-progress-v1";
  const FONT_KEY = "mathematics-reader-font-size";
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

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.title = isOpen ? "关闭导航" : "打开导航";
    });
  }

  const meter = document.getElementById("reading-meter-value");
  const updateReadingMeter = () => {
    if (!meter) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const value = distance > 0 ? Math.min(100, Math.max(0, (window.scrollY / distance) * 100)) : 0;
    meter.style.width = `${value}%`;
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

  let completed = refreshProgress();
  const completionButton = document.getElementById("completion-toggle");
  const completionTitle = document.getElementById("completion-title");

  const refreshCompletionButton = () => {
    if (!completionButton) return;
    const id = completionButton.getAttribute("data-course-id");
    const isComplete = Boolean(id && completed.has(id));
    completionButton.classList.toggle("is-complete", isComplete);
    completionButton.textContent = isComplete ? "取消完成" : "标记完成";
    if (completionTitle) completionTitle.textContent = isComplete ? "本册已完成" : "完成本册学习了吗？";
  };

  refreshCompletionButton();

  if (completionButton) {
    completionButton.addEventListener("click", () => {
      const id = completionButton.getAttribute("data-course-id");
      if (!id) return;
      if (completed.has(id)) completed.delete(id);
      else completed.add(id);
      saveCompleted(completed);
      completed = refreshProgress();
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
  const headings = Array.from(document.querySelectorAll(".book-reader .prose h2, .book-reader .prose h3"));

  if (outline && headings.length) {
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || "章节";
      link.dataset.level = heading.tagName === "H3" ? "3" : "2";
      outline.appendChild(link);
    });

    if ("IntersectionObserver" in window) {
      const links = Array.from(outline.querySelectorAll("a"));
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
