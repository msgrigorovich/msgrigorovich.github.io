// Receives telemetry batches from assets/js/analytics.js and stores them in D1.
// Privacy rules: the visitor IP and raw user agent are only used in memory to build
// a daily-rotating hash and coarse device info; neither is ever written anywhere.

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 50;
const DAY_MS = 24 * 60 * 60 * 1000;
const EVENT_TYPES = new Set([
  'screen_view',
  'screen_time',
  'click',
  'copy',
  'form_submit',
  'form_result',
  'demo_change',
  'js_error'
]);
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|curl|wget|python|httpclient|java\//i;

let saltCache = { day: '', salt: '' };

const text = (value, max) => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  return cleaned || null;
};

const integer = (value, max = DAY_MS) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.min(Math.max(Math.round(value), 0), max);
};

const cleanProps = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const props = {};
  for (const [key, raw] of Object.entries(value).slice(0, 8)) {
    if (!/^[a-z0-9_-]{1,24}$/i.test(key)) continue;
    if (typeof raw === 'string') props[key] = raw.slice(0, 60);
    else if (typeof raw === 'number' && Number.isFinite(raw)) props[key] = raw;
    else if (typeof raw === 'boolean') props[key] = raw;
  }
  return Object.keys(props).length ? JSON.stringify(props) : null;
};

const deviceOf = ua => {
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'mobile';
  return 'desktop';
};

const browserOf = ua => {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/YaBrowser/.test(ua)) return 'Yandex';
  if (/SamsungBrowser/.test(ua)) return 'Samsung';
  if (/Firefox|FxiOS/.test(ua)) return 'Firefox';
  if (/Chrome|CriOS/.test(ua)) return 'Chrome';
  if (/Safari/.test(ua)) return 'Safari';
  return 'Other';
};

const osOf = ua => {
  if (/Windows/.test(ua)) return 'Windows';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Mac OS X|Macintosh/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
};

const toHex = buffer => [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');

async function dailySalt(db, day) {
  if (saltCache.day === day) return saltCache.salt;
  const fresh = toHex(crypto.getRandomValues(new Uint8Array(32)));
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO salts (day, salt) VALUES (?1, ?2)').bind(day, fresh),
    db.prepare('DELETE FROM salts WHERE day <> ?1').bind(day)
  ]);
  const row = await db.prepare('SELECT salt FROM salts WHERE day = ?1').bind(day).first();
  saltCache = { day, salt: row.salt };
  return row.salt;
}

async function visitorHash(salt, ip, ua, host) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}|${ip}|${ua}|${host}`));
  return toHex(digest).slice(0, 16);
}

const respond = status => new Response(null, { status });

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return respond(405);

    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);
    const origin = request.headers.get('Origin');
    if (!origin || !allowedOrigins.includes(origin)) return respond(403);

    const ua = request.headers.get('User-Agent') || '';
    if (!ua || BOT_PATTERN.test(ua)) return respond(204);

    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return respond(413);
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return respond(413);

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return respond(400);
    }
    const pageId = text(body?.page, 64);
    if (body?.v !== 1 || !pageId || !Array.isArray(body.events) || !body.events.length) return respond(400);

    const serverNow = Date.now();
    const clientNow = integer(body.now, 7 * DAY_MS) ?? 0;
    const events = [];
    for (const event of body.events.slice(0, MAX_EVENTS)) {
      if (!event || !EVENT_TYPES.has(event.type) || !Number.isInteger(event.seq) || event.seq < 0 || event.seq > 1e6) continue;
      const age = Math.min(Math.max(clientNow - (integer(event.t, 7 * DAY_MS) ?? clientNow), 0), DAY_MS);
      events.push({
        seq: event.seq,
        ts: serverNow - age,
        type: event.type,
        screen: text(event.screen, 200),
        kind: text(event.kind, 24),
        target: text(event.target, 300),
        label: text(event.label, 80),
        value: integer(event.value),
        props: cleanProps(event.props)
      });
    }
    if (!events.length) return respond(400);

    const ctx = body.ctx && typeof body.ctx === 'object' ? body.ctx : {};
    const day = new Date(serverNow).toISOString().slice(0, 10);
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const salt = await dailySalt(env.DB, day);
    const visitor = await visitorHash(salt, ip, ua, origin);
    const cf = request.cf || {};
    const path = text(ctx.path, 120) || '/';

    await env.DB.batch([
      env.DB.prepare(`INSERT OR IGNORE INTO pageviews
        (page_id, visitor, day, started_at, path, entry_screen, referrer, source, medium, campaign,
         nav_type, country, city, device, browser, os, lang, viewport, is_me)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)`).bind(
        pageId,
        visitor,
        day,
        serverNow - clientNow,
        path,
        text(ctx.screen, 200) || path,
        text(ctx.ref, 200),
        text(ctx.src, 60),
        text(ctx.medium, 60),
        text(ctx.campaign, 60),
        text(ctx.nav, 16),
        text(cf.country, 2),
        text(cf.city, 80),
        deviceOf(ua),
        browserOf(ua),
        osOf(ua),
        text(ctx.lang, 8),
        integer(ctx.vw, 10000),
        body.me === 1 ? 1 : 0
      ),
      env.DB.prepare(`INSERT OR IGNORE INTO events
        (page_id, seq, ts, type, screen, kind, target, label, value, props)
        SELECT ?1,
          json_extract(e.value, '$.seq'), json_extract(e.value, '$.ts'), json_extract(e.value, '$.type'),
          json_extract(e.value, '$.screen'), json_extract(e.value, '$.kind'), json_extract(e.value, '$.target'),
          json_extract(e.value, '$.label'), json_extract(e.value, '$.value'), json_extract(e.value, '$.props')
        FROM json_each(?2) AS e`).bind(pageId, JSON.stringify(events))
    ]);

    return respond(204);
  }
};
