---
layout: null
permalink: /service-worker.js
---
const VERSION = "{{ site.time | date: '%Y%m%d%H%M%S' }}";
const CACHE_PREFIX = "mathematics-pwa-";
const STATIC_CACHE = `${CACHE_PREFIX}static-${VERSION}`;
const CONTENT_CACHE = `${CACHE_PREFIX}content-${VERSION}`;
const BASE_PATH = "{{ site.baseurl }}";
const OFFLINE_URL = `${BASE_PATH}/offline/`;

const PRECACHE_URLS = [
  "{{ '/' | relative_url }}",
  "{{ '/library/' | relative_url }}",
  "{{ '/guide/' | relative_url }}",
  "{{ '/continuity/' | relative_url }}",
  "{{ '/dependencies/' | relative_url }}",
  "{{ '/k12-coverage/' | relative_url }}",
  "{{ '/coverage/' | relative_url }}",
  "{{ '/roadmap/' | relative_url }}",
  "{{ '/outline/' | relative_url }}",
  "{{ '/exercises/' | relative_url }}",
  "{{ '/exercises/primary/' | relative_url }}",
  "{{ '/exercises/junior/' | relative_url }}",
  "{{ '/exercises/senior/' | relative_url }}",
  "{{ '/books/prelude/' | relative_url }}",
  "{{ '/books/restart/' | relative_url }}",
  "{{ '/books/functions/' | relative_url }}",
  "{{ '/books/linear-algebra/' | relative_url }}",
  "{{ '/books/calculus/' | relative_url }}",
  "{{ '/books/probability/' | relative_url }}",
  "{{ '/books/discrete-math/' | relative_url }}",
  "{{ '/books/image-processing/' | relative_url }}",
  "{{ '/books/ai-math/' | relative_url }}",
  "{{ '/books/advanced-topics/' | relative_url }}",
  "{{ '/books/professional/' | relative_url }}",
  "{{ '/search/' | relative_url }}",
  "{{ '/search.json' | relative_url }}",
  "{{ '/support/' | relative_url }}",
  "{{ '/references/' | relative_url }}",
  "{{ '/writing-guide/' | relative_url }}",
  "{{ '/revisions/' | relative_url }}",
  "{{ '/offline/' | relative_url }}",
  "{{ '/manifest.webmanifest' | relative_url }}"{% assign cache_extensions = '.css,.js,.png,.jpg,.jpeg,.gif,.svg,.webp,.woff,.woff2' | split: ',' %}{% for file in site.static_files %}{% assign extension = file.extname | downcase %}{% if cache_extensions contains extension %},
  "{{ file.path | relative_url }}"{% endif %}{% endfor %}
];

const normalizeCacheKey = (request) => {
  const url = new URL(request.url);
  url.search = "";
  url.hash = "";
  return url.toString();
};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== STATIC_CACHE && name !== CONTENT_CACHE).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

const networkFirst = async (request) => {
  const key = normalizeCacheKey(request);
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CONTENT_CACHE);
      await cache.put(key, response.clone());
    }
    return response;
  } catch (_error) {
    return (await caches.match(key)) || (await caches.match(OFFLINE_URL));
  }
};

const staleWhileRevalidate = async (request) => {
  const key = normalizeCacheKey(request);
  const cached = await caches.match(key);
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CONTENT_CACHE);
        await cache.put(key, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await network) || Response.error();
};

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(`${BASE_PATH}/`)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
