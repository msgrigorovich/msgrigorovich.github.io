-- Privacy-first site telemetry. No IP addresses, cookies or raw user agents are stored.

-- One random salt per UTC day. Older salts are deleted, so visitor hashes
-- from previous days can no longer be recomputed from an IP address.
CREATE TABLE IF NOT EXISTS salts (
  day TEXT PRIMARY KEY,
  salt TEXT NOT NULL
);

-- One row per page load.
CREATE TABLE IF NOT EXISTS pageviews (
  page_id TEXT PRIMARY KEY,
  visitor TEXT NOT NULL,           -- sha256(daily salt + IP + UA), rotates every UTC day
  day TEXT NOT NULL,               -- UTC YYYY-MM-DD
  started_at INTEGER NOT NULL,     -- unix ms, server clock
  path TEXT NOT NULL,              -- /, /resume, /projects/qalab ...
  entry_screen TEXT NOT NULL,      -- path + hash on load
  referrer TEXT,                   -- external host + path, or internal path
  source TEXT,                     -- ?src= / ?utm_source= / ?ref=
  medium TEXT,
  campaign TEXT,
  nav_type TEXT,                   -- navigate | reload | back_forward
  country TEXT,
  city TEXT,
  device TEXT,                     -- mobile | tablet | desktop
  browser TEXT,
  os TEXT,
  lang TEXT,
  viewport INTEGER,                -- viewport width rounded to 100px
  is_me INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS pageviews_day ON pageviews (day);
CREATE INDEX IF NOT EXISTS pageviews_visitor ON pageviews (visitor, started_at);

-- Everything that happened during a page load.
--   screen_view  a new screen (path + hash) became current; target = previous screen
--   screen_time  active time on a screen; value = active ms, props = visible_ms, scroll %
--   click        kind = internal | external | mailto | download | button | field | other
--   copy, form_submit, form_result, demo_change, js_error
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  ts INTEGER NOT NULL,             -- unix ms, server clock
  type TEXT NOT NULL,
  screen TEXT,
  kind TEXT,
  target TEXT,
  label TEXT,
  value INTEGER,
  props TEXT,                      -- small JSON object
  UNIQUE (page_id, seq)
);
CREATE INDEX IF NOT EXISTS events_page ON events (page_id, seq);
CREATE INDEX IF NOT EXISTS events_type_ts ON events (type, ts);
