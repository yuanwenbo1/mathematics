(() => {
"use strict";

const Capacitor = window.Capacitor || { isNativePlatform: () => false, Plugins: {} };
const CapacitorHttp = Capacitor.Plugins?.CapacitorHttp;

const DATABASE_NAME = "mathematics-offline-content";
const DATABASE_VERSION = 1;
const STORE_NAME = "content";
const ACTIVE_PACK_KEY = "active-pack";
const DISMISSED_UPDATE_KEY = "mathematics-dismissed-update-v1";
const MAX_PACK_BYTES = 30 * 1024 * 1024;
const CHECK_INTERVAL_MS = 30 * 60 * 1000;
const DISMISS_INTERVAL_MS = 24 * 60 * 60 * 1000;
const TRUSTED_ORIGIN = "https://yuanwenbo1.github.io";
const TRUSTED_PATH = "/mathematics/";
const isNativeApp = Capacitor.isNativePlatform();

window.__IS_NATIVE_APP__ = isNativeApp;

const readMeta = (name) => document.querySelector(`meta[name="${name}"]`)?.content || "";
const bundledVersion = readMeta("app-content-version") || "development";
const bundledPublishedAt = readMeta("app-content-published-at") || "1970-01-01T00:00:00.000Z";
const versionEndpoint = readMeta("app-content-endpoint");

const normalizePath = (pathname) => {
  if (pathname.endsWith("/index.html")) return pathname.slice(0, -"index.html".length);
  return pathname || "/mathematics/";
};

const isValidVersion = (version) => /^[0-9a-f]{40}$/.test(version || "");
const isValidDate = (value) => Number.isFinite(Date.parse(value || ""));

const validatePack = (pack) =>
  Boolean(
    pack &&
      isValidVersion(pack.version) &&
      isValidDate(pack.publishedAt) &&
      pack.pages &&
      typeof pack.pages === "object" &&
      !Array.isArray(pack.pages) &&
      Object.keys(pack.pages).length > 0 &&
      Array.isArray(pack.searchIndex)
  );

const isTrustedUpdateUrl = (value) => {
  try {
    const url = new URL(value);
    return url.origin === TRUSTED_ORIGIN && url.pathname.startsWith(TRUSTED_PATH);
  } catch (_error) {
    return false;
  }
};

const toNativePageUrl = (value) => {
  if (!isNativeApp || typeof value !== "string") return value;
  try {
    const url = new URL(value, TRUSTED_ORIGIN);
    if (url.origin !== TRUSTED_ORIGIN || !url.pathname.startsWith(TRUSTED_PATH) || !url.pathname.endsWith("/")) return value;
    return `${url.pathname}index.html${url.search}${url.hash}`;
  } catch (_error) {
    return value;
  }
};

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.addEventListener("upgradeneeded", () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });

const readStoredPack = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(ACTIVE_PACK_KEY);
    request.addEventListener("success", () => resolve(request.result || null));
    request.addEventListener("error", () => reject(request.error));
    transaction.addEventListener("complete", () => database.close());
  });
};

const storePack = async (pack) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(pack, ACTIVE_PACK_KEY);
    transaction.addEventListener("complete", () => {
      database.close();
      resolve();
    });
    transaction.addEventListener("abort", () => reject(transaction.error));
    transaction.addEventListener("error", () => reject(transaction.error));
  });
};

const sanitizeDownloadedHtml = (html) => {
  const template = document.createElement("template");
  template.innerHTML = typeof html === "string" ? html : "";
  template.content.querySelectorAll("script,style,iframe,object,embed,form").forEach((element) => element.remove());
  template.content.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (/^on/i.test(attribute.name) || attribute.name === "srcdoc" || attribute.name === "style") element.removeAttribute(attribute.name);
    });
    ["href", "src", "action", "formaction"].forEach((name) => {
      const value = element.getAttribute(name)?.trim() || "";
      if (/^(javascript|vbscript|data:text\/html):/i.test(value)) element.removeAttribute(name);
    });
  });
  template.content.querySelectorAll("a[href]").forEach((element) => {
    element.setAttribute("href", toNativePageUrl(element.getAttribute("href")));
  });
  return template.content;
};

const applyPack = (pack) => {
  window.__APP_CONTENT_PACK__ = {
    ...pack,
    searchIndex: pack.searchIndex.map((item) => ({ ...item, url: toNativePageUrl(item.url) }))
  };
  const page = pack.pages[normalizePath(window.location.pathname)];
  const main = document.getElementById("main-content");
  if (!page || !main || typeof page.html !== "string") return;
  main.replaceChildren(sanitizeDownloadedHtml(page.html).cloneNode(true));
  if (page.title) document.title = page.title;
  document.documentElement.dataset.contentVersion = pack.version;
};

const selectActivePack = (pack) => {
  if (!validatePack(pack)) return null;
  if (pack.version === bundledVersion) return null;
  return Date.parse(pack.publishedAt) > Date.parse(bundledPublishedAt) ? pack : null;
};

const loadActiveContent = async () => {
  if (!isNativeApp) return null;
  const pack = selectActivePack(await readStoredPack());
  if (pack) applyPack(pack);
  return pack;
};

window.__CONTENT_READY__ = loadActiveContent().catch((error) => {
  console.error("Unable to load stored textbook content:", error);
  return null;
});

let latestInfo = null;
let activePack = null;
let updateButton = null;
let statusTimer = null;
let checkPromise = null;
let lastCheckedAt = 0;
let lastFocusedElement = null;

const dialog = () => document.getElementById("update-dialog");
const dialogInstall = () => document.getElementById("update-dialog-install");

const showStatus = (message, persistent = false) => {
  const status = document.getElementById("pwa-status");
  const messageElement = document.getElementById("pwa-status-message");
  const pwaUpdateButton = document.getElementById("pwa-update-button");
  if (!status || !messageElement || !pwaUpdateButton) return;
  messageElement.textContent = message;
  pwaUpdateButton.hidden = true;
  status.hidden = false;
  if (statusTimer) window.clearTimeout(statusTimer);
  statusTimer = persistent ? null : window.setTimeout(() => (status.hidden = true), 5000);
};

const nativeGet = async (url) => {
  if (!CapacitorHttp) throw new Error("Native HTTP is unavailable.");
  if (!isTrustedUpdateUrl(url)) throw new Error("Untrusted textbook update URL.");
  const response = await CapacitorHttp.get({
    url,
    connectTimeout: 12000,
    readTimeout: 120000,
    responseType: "json"
  });
  if (response.status < 200 || response.status >= 300) throw new Error(`Update server returned ${response.status}.`);
  return typeof response.data === "string" ? JSON.parse(response.data) : response.data;
};

const currentContent = () => ({
  version: activePack?.version || bundledVersion,
  publishedAt: activePack?.publishedAt || bundledPublishedAt
});

const validateVersionInfo = (info) =>
  Boolean(
    info &&
      isValidVersion(info.version) &&
      isValidDate(info.publishedAt) &&
      Number.isInteger(info.pageCount) &&
      info.pageCount > 0 &&
      Number.isInteger(info.byteLength) &&
      info.byteLength > 0 &&
      info.byteLength <= MAX_PACK_BYTES &&
      /^[0-9a-f]{64}$/.test(info.sha256 || "") &&
      isTrustedUpdateUrl(info.downloadUrl) &&
      (info.summary === undefined || (typeof info.summary === "string" && info.summary.length <= 280))
  );

const hasNewerContent = (info) => {
  const current = currentContent();
  if (info.version === current.version) return false;
  return Date.parse(info.publishedAt) > Date.parse(current.publishedAt);
};

const setButtonState = (hasUpdate) => {
  if (!updateButton) return;
  const marker = document.createElement("span");
  marker.setAttribute("aria-hidden", "true");
  updateButton.replaceChildren(marker, document.createTextNode(hasUpdate ? "课程有更新" : "检查更新"));
  updateButton.classList.toggle("has-update", hasUpdate);
  updateButton.disabled = false;
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));

const formatBytes = (bytes) => (bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

const shouldAnnounce = (info) => {
  try {
    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_UPDATE_KEY) || "null");
    return !dismissed || dismissed.version !== info.version || Date.now() - dismissed.at >= DISMISS_INTERVAL_MS;
  } catch (_error) {
    return true;
  }
};

const showUpdateDialog = (info, { force = false } = {}) => {
  const updateDialog = dialog();
  if (!updateDialog || !validateVersionInfo(info) || (!force && !shouldAnnounce(info))) return false;
  document.getElementById("update-dialog-summary").textContent =
    info.summary || "发现新的课程内容，可以现在下载，也可以继续使用当前离线教材。";
  document.getElementById("update-dialog-date").textContent = formatDate(info.publishedAt);
  document.getElementById("update-dialog-pages").textContent = `${info.pageCount} 页`;
  document.getElementById("update-dialog-size").textContent = formatBytes(info.byteLength);
  lastFocusedElement = document.activeElement;
  updateDialog.hidden = false;
  document.body.classList.add("update-dialog-open");
  dialogInstall()?.focus();
  return true;
};

const dismissUpdateDialog = ({ remember = true } = {}) => {
  const updateDialog = dialog();
  if (!updateDialog || updateDialog.hidden) return;
  if (remember && latestInfo) {
    localStorage.setItem(DISMISSED_UPDATE_KEY, JSON.stringify({ version: latestInfo.version, at: Date.now() }));
  }
  updateDialog.hidden = true;
  document.body.classList.remove("update-dialog-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
};

const performUpdateCheck = async ({ silent = false, announce = true } = {}) => {
  if (!isNativeApp || !versionEndpoint || !isTrustedUpdateUrl(versionEndpoint)) return { available: false };
  try {
    const separator = versionEndpoint.includes("?") ? "&" : "?";
    const info = await nativeGet(`${versionEndpoint}${separator}time=${Date.now()}`);
    if (!validateVersionInfo(info)) throw new Error("Invalid textbook version manifest.");
    latestInfo = info;
    lastCheckedAt = Date.now();
    const available = hasNewerContent(info);
    setButtonState(available);
    if (available && announce) showUpdateDialog(info);
    if (!silent) showStatus(available ? "发现新的教材版本" : "教材已是最新版本");
    return { available, info };
  } catch (error) {
    lastCheckedAt = Date.now();
    setButtonState(false);
    if (!silent) showStatus("无法连接更新服务器，继续使用本地教材");
    console.error("Unable to check textbook updates:", error);
    return { available: false, error };
  }
};

const checkForUpdate = (options = {}) => {
  if (!checkPromise) {
    checkPromise = performUpdateCheck(options).finally(() => {
      checkPromise = null;
    });
  }
  return checkPromise;
};

const sha256 = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const setDownloadState = (isDownloading) => {
  const installButton = dialogInstall();
  if (updateButton) updateButton.disabled = isDownloading;
  if (!installButton) return;
  installButton.disabled = isDownloading;
  installButton.textContent = isDownloading ? "正在下载并校验..." : "下载并更新";
};

const downloadUpdate = async (info) => {
  if (!validateVersionInfo(info) || !hasNewerContent(info)) return false;
  setDownloadState(true);
  showStatus("正在下载并校验教材更新...", true);

  try {
    const separator = info.downloadUrl.includes("?") ? "&" : "?";
    const pack = await nativeGet(`${info.downloadUrl}${separator}version=${encodeURIComponent(info.version)}`);
    if (!validatePack(pack) || pack.version !== info.version || Object.keys(pack.pages).length !== info.pageCount) {
      throw new Error("Downloaded textbook pack is incomplete.");
    }

    const serialized = JSON.stringify(pack);
    if (new TextEncoder().encode(serialized).byteLength !== info.byteLength || (await sha256(serialized)) !== info.sha256) {
      throw new Error("Downloaded textbook pack failed integrity verification.");
    }

    await storePack(pack);
    localStorage.removeItem(DISMISSED_UPDATE_KEY);
    showStatus("教材更新完成，正在重新载入...", true);
    window.setTimeout(() => window.location.reload(), 800);
    return true;
  } catch (error) {
    setDownloadState(false);
    setButtonState(true);
    showStatus("教材更新失败，已继续使用原有离线教材");
    console.error("Unable to install textbook update:", error);
    return false;
  }
};

const handleUpdateClick = async () => {
  if (!latestInfo || !hasNewerContent(latestInfo)) {
    const result = await checkForUpdate({ silent: false, announce: false });
    if (!result.available) return;
  }
  showUpdateDialog(latestInfo, { force: true });
};

const checkAfterResume = () => {
  if (!isNativeApp || document.visibilityState === "hidden" || Date.now() - lastCheckedAt < CHECK_INTERVAL_MS) return;
  checkForUpdate({ silent: true, announce: true });
};

const setupUpdateDialog = () => {
  ["update-dialog-later", "update-dialog-close", "update-dialog-backdrop"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => dismissUpdateDialog({ remember: true }));
  });
  dialogInstall()?.addEventListener("click", () => downloadUpdate(latestInfo));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog() && !dialog().hidden) dismissUpdateDialog({ remember: true });
  });
};

const setupNativeUpdates = async () => {
  if (!isNativeApp) return;
  document.documentElement.classList.add("native-app");
  activePack = await window.__CONTENT_READY__;
  updateButton = document.getElementById("app-update-button");
  const installButton = document.getElementById("pwa-install-button");
  if (installButton) installButton.hidden = true;
  if (!updateButton) return;
  updateButton.hidden = false;
  updateButton.title = `当前教材版本 ${currentContent().version.slice(0, 7)}`;
  updateButton.addEventListener("click", handleUpdateClick);
  setupUpdateDialog();
  document.addEventListener("visibilitychange", checkAfterResume);
  window.addEventListener("focus", checkAfterResume);
  window.addEventListener("online", () => checkForUpdate({ silent: true, announce: true }));
  await checkForUpdate({ silent: true, announce: true });
};

window.AppContentUpdater = { checkForUpdate, downloadUpdate, isNativeApp };
setupNativeUpdates().catch((error) => console.error("Unable to initialize textbook updates:", error));
})();
