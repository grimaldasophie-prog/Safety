/* MuscleMap offline service worker (generated at build time). */
const VERSION = '__VERSION__';
const CORE = __CORE__;
const VIDEOS = __VIDEOS__;
const CORE_CACHE = 'mm-core-' + VERSION;
const VIDEO_CACHE = 'mm-videos-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const core = await caches.open(CORE_CACHE);
      await core.addAll(CORE);
      // Videos are optional: cache whichever ones exist.
      const vc = await caches.open(VIDEO_CACHE);
      await Promise.all(
        VIDEOS.map(async (url) => {
          try {
            const res = await fetch(url);
            if (res.ok && (res.headers.get('content-type') || '').startsWith('video')) await vc.put(url, res);
          } catch (e) { /* offline or missing — fine */ }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('mm-core-') && k !== CORE_CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// Serve a byte range out of a fully cached video so <video> can seek offline.
async function rangeResponse(request, cached) {
  const range = request.headers.get('range');
  if (!range) return cached;
  const buf = await cached.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? Number(m[1]) : 0;
  const end = m && m[2] ? Number(m[2]) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('content-type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/videos/')) {
    event.respondWith(
      (async () => {
        const vc = await caches.open(VIDEO_CACHE);
        const hit = await vc.match(url.pathname);
        if (hit) return rangeResponse(req, hit.clone());
        try {
          const res = await fetch(req);
          // Store a full copy in the background for next time.
          if (res.ok && res.status === 200 && (res.headers.get('content-type') || '').startsWith('video')) {
            vc.put(url.pathname, res.clone());
          } else if (res.status === 206) {
            fetch(url.pathname).then((full) => {
              if (full.ok && (full.headers.get('content-type') || '').startsWith('video')) vc.put(url.pathname, full);
            }).catch(() => {});
          }
          return res;
        } catch (e) {
          return new Response('', { status: 404 });
        }
      })(),
    );
    return;
  }

  // App navigation: always answer with the cached shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => (await caches.match('/')) || Response.error()),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        return await fetch(req);
      } catch (e) {
        return Response.error();
      }
    })(),
  );
});
