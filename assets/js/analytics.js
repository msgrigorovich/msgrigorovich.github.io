(() => {
  // Cloudflare Worker from /worker (see worker/README.md). Telemetry is off while this is empty.
  const ENDPOINT = 'https://portfolio-telemetry.dianagrigorovich.workers.dev/';
  const OWNER_KEY = 'dg-owner';
  const IDLE_MS = 30000;
  const FLUSH_INTERVAL_MS = 20000;
  const MAX_BATCH = 40;
  const MAX_ERRORS = 5;

  // ?me=1 marks this browser as the site owner, ?me=0 clears it. This flag is the only
  // thing ever written to the device, and only on the owner's own devices.
  const params = new URLSearchParams(location.search);
  if (params.has('me')) {
    try {
      if (params.get('me') === '1') localStorage.setItem(OWNER_KEY, '1');
      else localStorage.removeItem(OWNER_KEY);
    } catch {
      // Storage can be blocked; the owner flag is optional.
    }
    params.delete('me');
    const query = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }

  if (!ENDPOINT || navigator.webdriver || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;

  let isOwner = false;
  try {
    isOwner = localStorage.getItem(OWNER_KEY) === '1';
  } catch {
    isOwner = false;
  }

  const normalizePath = pathname => pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/(.)\/$/, '$1');
  const screenOf = () => `${normalizePath(location.pathname)}${location.hash.slice(0, 160)}`;
  const clean = (value, max) => (value || '').replace(/\s+/g, ' ').trim().slice(0, max);

  const referrerOf = () => {
    if (!document.referrer) return null;
    try {
      const url = new URL(document.referrer);
      return url.origin === location.origin ? normalizePath(url.pathname) : `${url.host}${url.pathname}`;
    } catch {
      return null;
    }
  };

  // There is no page-zoom API. In desktop Chromium browsers outerWidth ignores zoom while
  // innerWidth shrinks with it, so their ratio gives the zoom; snap it to the browser's steps.
  // Firefox and Safari scale both widths, so for them zoom stays null and only dpr is reported.
  const ZOOM_STEPS = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
  const isDesktopChromium = Boolean(navigator.userAgentData?.brands?.some(brand => brand.brand === 'Chromium'))
    && !navigator.userAgentData.mobile;
  const zoomOf = () => {
    if (!isDesktopChromium || !window.outerWidth || !window.innerWidth) return null;
    const raw = window.outerWidth / window.innerWidth * 100;
    const step = ZOOM_STEPS.reduce((best, value) => (Math.abs(value - raw) < Math.abs(best - raw) ? value : best));
    // Docked DevTools or side panels distort the ratio; drop readings far from any step.
    return Math.abs(step - raw) / step <= 0.06 ? step : null;
  };
  const dprOf = () => Math.round((window.devicePixelRatio || 1) * 100) / 100;

  const pageId = crypto.randomUUID
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
  const ctx = {
    path: normalizePath(location.pathname),
    screen: screenOf(),
    ref: referrerOf(),
    src: clean(params.get('src') || params.get('utm_source') || params.get('ref'), 60) || null,
    medium: clean(params.get('utm_medium'), 60) || null,
    campaign: clean(params.get('utm_campaign'), 60) || null,
    nav: performance.getEntriesByType?.('navigation')?.[0]?.type || null,
    lang: (navigator.language || '').slice(0, 8),
    vw: Math.round(window.innerWidth / 100) * 100,
    touch: navigator.maxTouchPoints > 0 ? 1 : 0,
    pointer: window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
    dpr: dprOf(),
    zoom: zoomOf()
  };

  // --- Queue & transport ---
  const queue = [];
  let seq = 0;
  let lastFlush = performance.now();
  let currentScreen = ctx.screen;

  const flush = () => {
    lastFlush = performance.now();
    while (queue.length) {
      const body = JSON.stringify({
        v: 1,
        page: pageId,
        me: isOwner ? 1 : 0,
        now: Math.round(performance.now()),
        ctx,
        events: queue.splice(0, MAX_BATCH)
      });
      let sent = false;
      try {
        sent = navigator.sendBeacon?.(ENDPOINT, body) || false;
      } catch {
        sent = false;
      }
      if (!sent) {
        fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'no-cors', credentials: 'omit' })
          .catch(() => {
            // Telemetry is optional and must never affect the page experience.
          });
      }
    }
  };

  const track = (type, fields = {}) => {
    queue.push({ seq: seq++, t: Math.round(performance.now()), type, screen: currentScreen, ...fields });
    if (queue.length >= MAX_BATCH) flush();
  };

  // --- Active time per screen ---
  // Time counts only while the tab is visible and the visitor did something in the last 30 s.
  let activeMs = 0;
  let visibleMs = 0;
  let maxScroll = null;
  let lastTick = performance.now();
  let lastActivity = lastTick;

  const tick = () => {
    const now = performance.now();
    const delta = Math.min(now - lastTick, 5000);
    lastTick = now;
    if (document.visibilityState !== 'visible') return;
    visibleMs += delta;
    if (now - lastActivity < IDLE_MS) activeMs += delta;
  };

  // Most content scrolls inside dialogs and panels, so depth is measured on whatever
  // element actually scrolled. Screens without scrollable content keep scroll = null.
  const measureScroll = (element = document.scrollingElement) => {
    if (!element || element.scrollHeight <= element.clientHeight + 10) return;
    const percent = Math.min(100, Math.round((element.scrollTop + element.clientHeight) / element.scrollHeight * 100));
    if (maxScroll === null || percent > maxScroll) maxScroll = percent;
  };

  const reportTime = () => {
    tick();
    if (activeMs >= 500 || visibleMs >= 1000) {
      track('screen_time', { value: Math.round(activeMs), props: { visible_ms: Math.round(visibleMs), scroll: maxScroll } });
    }
    activeMs = 0;
    visibleMs = 0;
  };

  // --- Screens: every path + hash is a screen (modals, tabs and case-study steps update the URL) ---
  let screenTimer = 0;
  const checkScreen = () => {
    clearTimeout(screenTimer);
    // Wait for chained URL updates to settle so transitional states are not counted.
    screenTimer = window.setTimeout(() => {
      const next = screenOf();
      if (next === currentScreen) return;
      reportTime();
      const previous = currentScreen;
      currentScreen = next;
      maxScroll = null;
      measureScroll();
      track('screen_view', { kind: 'nav', target: previous });
    }, 300);
  };

  // pushState/replaceState fire no events, and the site changes screens through them.
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      checkScreen();
      return result;
    };
  }
  window.addEventListener('popstate', checkScreen);
  window.addEventListener('hashchange', checkScreen);

  // --- Clicks ---
  const INTERACTIVE = 'a[href], button, [role="button"], [role="tab"], summary, select, input, textarea, label, [data-track]';
  const FIELDS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
  const recentClicks = [];

  const selectorOf = element => {
    const className = typeof element.className === 'string' ? element.className.trim().split(/\s+/)[0] : '';
    return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${className ? `.${className}` : ''}`.slice(0, 80);
  };

  const dataProps = element => {
    const props = {};
    for (const [key, value] of Object.entries(element.dataset || {}).slice(0, 4)) {
      if (key !== 'track' && value.length <= 40) props[key] = value;
    }
    return props;
  };

  const describeClick = target => {
    const element = target.closest?.(INTERACTIVE);
    if (!element) return { kind: 'other', target: selectorOf(target) };

    // Never read what visitors type: fields are described by name only.
    const label = FIELDS.has(element.tagName)
      ? element.getAttribute('name') || element.id || element.type
      : element.dataset.track || element.getAttribute('aria-label') || element.getAttribute('title')
        || element.textContent.trim() || element.querySelector('img[alt]')?.alt;
    const description = { label: clean(label, 60), props: { el: selectorOf(element), ...dataProps(element) } };

    if (element.tagName === 'A') {
      const url = new URL(element.href, location.href);
      if (url.protocol === 'mailto:' || url.protocol === 'tel:') return { ...description, kind: 'mailto', target: url.protocol };
      if (element.hasAttribute('download') || /\.pdf$/i.test(url.pathname)) return { ...description, kind: 'download', target: url.pathname };
      if (url.origin === location.origin) return { ...description, kind: 'internal', target: `${normalizePath(url.pathname)}${url.hash}` };
      return { ...description, kind: 'external', target: url.href };
    }
    return { ...description, kind: FIELDS.has(element.tagName) ? 'field' : 'button', target: selectorOf(element) };
  };

  const onClick = (event, frame) => {
    // nodeType instead of instanceof: iframe elements belong to another window's Element.
    if (event.target?.nodeType !== Node.ELEMENT_NODE) return;
    const now = performance.now();
    recentClicks.push({ now, x: event.clientX, y: event.clientY });
    while (recentClicks.length && now - recentClicks[0].now > 800) recentClicks.shift();
    const rage = recentClicks
      .filter(click => Math.abs(click.x - event.clientX) < 30 && Math.abs(click.y - event.clientY) < 30).length >= 3;

    const click = describeClick(event.target);
    const props = { ...click.props };
    if (frame) props.frame = frame;
    if (rage) props.rage = true;
    track('click', { ...click, props });
    // These clicks often take the visitor away from the site, so send them right away.
    if (['external', 'mailto', 'download'].includes(click.kind)) flush();
  };
  document.addEventListener('click', event => onClick(event, null), true);

  // Same-origin demos run in iframes; their clicks do not bubble to this document.
  const watchFrame = frame => {
    const attach = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || doc.location.href === 'about:blank' || doc.__analyticsAttached) return;
        doc.__analyticsAttached = true;
        const name = normalizePath(new URL(doc.location.href).pathname).split('/').pop();
        doc.addEventListener('click', event => onClick(event, name), true);
      } catch {
        // Cross-origin frames are not tracked.
      }
    };
    frame.addEventListener('load', attach);
    attach();
  };
  document.querySelectorAll('iframe').forEach(watchFrame);

  let demoTimer = 0;
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'scope-framework-change') return;
    clearTimeout(demoTimer);
    const { impact, complexity } = event.data;
    demoTimer = window.setTimeout(() => {
      track('demo_change', { kind: 'scope-framework', props: { impact: String(impact), complexity: String(complexity) } });
    }, 1500);
  });

  // --- Copy, forms, errors ---
  document.addEventListener('copy', () => {
    // Only where the copy happened, never the copied text.
    const node = document.getSelection()?.anchorNode;
    const element = node instanceof Element ? node : node?.parentElement;
    const link = element?.closest('a[href]');
    track('copy', { target: link ? link.getAttribute('href').slice(0, 120) : element ? selectorOf(element) : null });
  });

  document.addEventListener('submit', event => {
    track('form_submit', { target: event.target.id || event.target.getAttribute('name') || 'form' });
    flush();
  }, true);

  // Other scripts report outcomes the tracker cannot observe, e.g. the contact form result.
  document.addEventListener('analytics:event', event => {
    const { type, kind, value } = event.detail || {};
    if (type === 'form_result') track(type, { kind, value });
  });

  // Zoom changes fire resize; report only when the zoom level itself changed.
  let lastZoom = ctx.zoom;
  let lastDpr = ctx.dpr;
  let zoomTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(zoomTimer);
    zoomTimer = window.setTimeout(() => {
      const zoom = zoomOf();
      const dpr = dprOf();
      if (zoom === lastZoom && dpr === lastDpr) return;
      lastZoom = zoom;
      lastDpr = dpr;
      track('zoom_change', { value: zoom, props: { dpr } });
    }, 500);
  });

  let errorCount = 0;
  window.addEventListener('error', event => {
    if (!event.message || errorCount++ >= MAX_ERRORS) return;
    const file = event.filename ? new URL(event.filename, location.href).pathname : '';
    track('js_error', { label: clean(event.message, 80), target: `${file}:${event.lineno || 0}` });
  });

  // --- Activity & lifecycle ---
  const markActive = () => {
    lastActivity = performance.now();
  };
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach(type => {
    window.addEventListener(type, markActive, { passive: true, capture: true });
  });

  // Scroll does not bubble; capturing on document sees the page and every inner scroller.
  let scrollTarget = null;
  document.addEventListener('scroll', event => {
    markActive();
    const queued = scrollTarget !== null;
    scrollTarget = event.target === document ? document.scrollingElement : event.target;
    if (queued) return;
    requestAnimationFrame(() => {
      measureScroll(scrollTarget);
      scrollTarget = null;
    });
  }, { passive: true, capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportTime();
      flush();
    } else {
      lastTick = performance.now();
      lastActivity = lastTick;
    }
  });
  window.addEventListener('pagehide', () => {
    reportTime();
    flush();
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    lastTick = performance.now();
    lastActivity = lastTick;
    track('screen_view', { kind: 'restore' });
  });

  window.setInterval(() => {
    tick();
    if (queue.length && performance.now() - lastFlush > FLUSH_INTERVAL_MS) flush();
  }, 1000);

  measureScroll();
  track('screen_view', { kind: 'entry' });
})();
