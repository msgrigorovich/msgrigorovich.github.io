-- Saved reports. Apply (and re-apply after edits) with:
--   npx wrangler d1 execute portfolio-telemetry --remote --file=views.sql
-- Then in Cloudflare dashboard → D1 → portfolio-telemetry → Console:
--   SELECT * FROM report_funnel;
-- Reports skip the owner's visits (is_me = 0) and cover the last 30 days,
-- except report_recent, which shows everything including your own visits.

-- Latest page loads, including your own (is_me = 1). Good for checking that tracking works.
DROP VIEW IF EXISTS report_recent;
CREATE VIEW report_recent AS
SELECT datetime(started_at / 1000, 'unixepoch') AS time_utc,
       entry_screen AS screen, referrer, source, country, city, device, browser, is_me
FROM pageviews
ORDER BY started_at DESC
LIMIT 50;

-- Visitors, page loads and active minutes per day.
DROP VIEW IF EXISTS report_daily;
CREATE VIEW report_daily AS
SELECT p.day,
       COUNT(DISTINCT p.visitor) AS visitors,
       COUNT(*) AS page_loads,
       ROUND(SUM(COALESCE(t.active_ms, 0)) / 60000.0, 1) AS active_min
FROM pageviews p
LEFT JOIN (SELECT page_id, SUM(value) AS active_ms FROM events WHERE type = 'screen_time' GROUP BY page_id) t USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
GROUP BY p.day
ORDER BY p.day DESC;

-- Where visitors come from.
DROP VIEW IF EXISTS report_sources;
CREATE VIEW report_sources AS
SELECT COALESCE(source, referrer, '(direct)') AS origin, COUNT(*) AS visitors
FROM (
  SELECT visitor, source, referrer,
         ROW_NUMBER() OVER (PARTITION BY visitor ORDER BY started_at) AS n
  FROM pageviews
  WHERE is_me = 0 AND day >= date('now', '-30 days')
)
WHERE n = 1
GROUP BY origin
ORDER BY visitors DESC;

-- Country, device, language.
DROP VIEW IF EXISTS report_audience;
CREATE VIEW report_audience AS
SELECT country, device, lang, COUNT(DISTINCT visitor) AS visitors
FROM pageviews
WHERE is_me = 0 AND day >= date('now', '-30 days')
GROUP BY country, device, lang
ORDER BY visitors DESC
LIMIT 50;

-- Every screen: reach and holding time. avg_scroll_pct only where there was something to scroll.
DROP VIEW IF EXISTS report_screens;
CREATE VIEW report_screens AS
WITH scoped AS (
  SELECT e.*, p.visitor
  FROM events e JOIN pageviews p USING (page_id)
  WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
),
views AS (
  SELECT screen, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
  FROM scoped WHERE type = 'screen_view' GROUP BY screen
),
holding AS (
  SELECT screen, SUM(value) AS active_ms, AVG(json_extract(props, '$.scroll')) AS avg_scroll
  FROM scoped WHERE type = 'screen_time' GROUP BY screen
)
SELECT v.screen, v.visitors, v.views,
       ROUND(COALESCE(h.active_ms, 0) / 1000.0 / v.views, 1) AS avg_active_sec_per_view,
       ROUND(h.avg_scroll) AS avg_scroll_pct
FROM views v LEFT JOIN holding h USING (screen)
ORDER BY v.visitors DESC, avg_active_sec_per_view DESC;

-- How far into each case study visitors get.
DROP VIEW IF EXISTS report_projects;
CREATE VIEW report_projects AS
SELECT CASE
         WHEN e.screen LIKE '/projects/testing-scope-framework%' THEN 'testing-scope'
         WHEN e.screen LIKE '/projects/qalab%' THEN 'qalab'
         WHEN e.screen LIKE '/projects/analytical-driven-qa%' THEN 'analytical-qa'
       END AS project,
       e.screen,
       COUNT(DISTINCT p.visitor) AS visitors
FROM events e JOIN pageviews p USING (page_id)
WHERE e.type = 'screen_view' AND p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND (e.screen LIKE '/projects/testing-scope-framework%'
    OR e.screen LIKE '/projects/qalab%'
    OR e.screen LIKE '/projects/analytical-driven-qa%')
GROUP BY project, e.screen
ORDER BY project, visitors DESC;

-- Home → projects → resume → contact → reached out (e-mail click/copy, LinkedIn, form sent).
DROP VIEW IF EXISTS report_funnel;
CREATE VIEW report_funnel AS
WITH visitors AS (
  SELECT DISTINCT visitor FROM pageviews WHERE is_me = 0 AND day >= date('now', '-30 days')
),
paths AS (
  SELECT visitor, path FROM pageviews WHERE is_me = 0 AND day >= date('now', '-30 days')
),
reached_out AS (
  SELECT DISTINCT p.visitor
  FROM events e JOIN pageviews p USING (page_id)
  WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
    AND ((e.type = 'click' AND (e.kind = 'mailto' OR e.target LIKE '%linkedin.com%'))
      OR (e.type = 'copy' AND e.target LIKE 'mailto:%')
      OR (e.type = 'form_result' AND e.kind = 'success'))
)
SELECT (SELECT COUNT(*) FROM visitors) AS visitors,
       (SELECT COUNT(DISTINCT visitor) FROM paths WHERE path = '/') AS saw_home,
       (SELECT COUNT(DISTINCT visitor) FROM paths WHERE path LIKE '/projects%') AS saw_projects,
       (SELECT COUNT(DISTINCT visitor) FROM paths WHERE path = '/resume') AS saw_resume,
       (SELECT COUNT(DISTINCT visitor) FROM paths WHERE path = '/contact') AS saw_contact,
       (SELECT COUNT(*) FROM reached_out) AS reached_out;

-- What gets clicked.
DROP VIEW IF EXISTS report_clicks;
CREATE VIEW report_clicks AS
SELECT e.kind, e.target, e.label, COUNT(*) AS clicks, COUNT(DISTINCT p.visitor) AS visitors
FROM events e JOIN pageviews p USING (page_id)
WHERE e.type = 'click' AND p.is_me = 0 AND p.day >= date('now', '-30 days')
GROUP BY e.kind, e.target, e.label
ORDER BY clicks DESC
LIMIT 100;

-- Leaving the site with interest: GitHub, YouTube, LinkedIn, e-mail.
DROP VIEW IF EXISTS report_outbound;
CREATE VIEW report_outbound AS
SELECT e.kind, e.target, COUNT(DISTINCT p.visitor) AS visitors
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND ((e.type = 'click' AND e.kind IN ('external', 'mailto', 'download')) OR e.type = 'copy')
GROUP BY e.kind, e.target
ORDER BY visitors DESC;

-- Sessions (> 30 min gap starts a new one) with the path taken.
DROP VIEW IF EXISTS report_sessions;
CREATE VIEW report_sessions AS
WITH ordered AS (
  SELECT page_id, visitor, started_at, country, device,
         started_at - LAG(started_at) OVER (PARTITION BY visitor ORDER BY started_at) AS gap
  FROM pageviews
  WHERE is_me = 0 AND day >= date('now', '-30 days')
),
sessions AS (
  SELECT *, visitor || '-' || SUM(CASE WHEN gap IS NULL OR gap > 1800000 THEN 1 ELSE 0 END)
           OVER (PARTITION BY visitor ORDER BY started_at) AS session_id
  FROM ordered
),
steps AS (
  SELECT s.session_id, e.screen, e.ts
  FROM sessions s JOIN events e USING (page_id)
  WHERE e.type = 'screen_view'
  ORDER BY s.session_id, e.ts
)
SELECT s.session_id,
       MIN(s.country) AS country,
       MIN(s.device) AS device,
       datetime(MIN(s.started_at) / 1000, 'unixepoch') AS started_utc,
       (SELECT ROUND(SUM(e.value) / 1000.0) FROM events e
         WHERE e.type = 'screen_time' AND e.page_id IN (SELECT page_id FROM sessions x WHERE x.session_id = s.session_id)) AS active_sec,
       (SELECT group_concat(screen, '  →  ') FROM steps st WHERE st.session_id = s.session_id) AS path
FROM sessions s
GROUP BY s.session_id
ORDER BY started_utc DESC
LIMIT 50;

-- Rage clicks, clicks on non-interactive elements, JS errors.
DROP VIEW IF EXISTS report_problems;
CREATE VIEW report_problems AS
SELECT e.type, e.screen, e.kind, e.target, e.label, COUNT(*) AS times
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND (e.type = 'js_error'
    OR (e.type = 'click' AND json_extract(e.props, '$.rage') = 1)
    OR (e.type = 'click' AND e.kind = 'other'))
GROUP BY e.type, e.screen, e.kind, e.target, e.label
ORDER BY times DESC
LIMIT 50;

-- How people use the live Testing Scope Framework demo.
DROP VIEW IF EXISTS report_demo;
CREATE VIEW report_demo AS
SELECT e.type, e.label, json_extract(e.props, '$.impact') AS impact,
       json_extract(e.props, '$.complexity') AS complexity, COUNT(*) AS times
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND (e.type = 'demo_change' OR json_extract(e.props, '$.frame') IS NOT NULL)
GROUP BY e.type, e.label, impact, complexity
ORDER BY times DESC;
