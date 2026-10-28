-- Ready-made questions for the telemetry database (SQLite / D1).
-- Run one with:
--   npx wrangler d1 execute portfolio-telemetry --remote --command "<query>"
-- or paste it into Cloudflare dashboard → D1 → portfolio-telemetry → Console.
-- Every query skips the owner's visits (is_me = 0) and looks at the last 30 days.
-- A "visitor" is a daily hash: the same person on two different days counts twice.


-- 1. Daily overview: visitors, page loads, total active minutes.
SELECT p.day,
       COUNT(DISTINCT p.visitor) AS visitors,
       COUNT(*) AS page_loads,
       ROUND(SUM(COALESCE(t.active_ms, 0)) / 60000.0, 1) AS active_min
FROM pageviews p
LEFT JOIN (SELECT page_id, SUM(value) AS active_ms FROM events WHERE type = 'screen_time' GROUP BY page_id) t USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
GROUP BY p.day
ORDER BY p.day DESC;


-- 2. Where visitors come from (first page load of each visitor).
SELECT COALESCE(source, referrer, '(direct)') AS origin,
       COUNT(*) AS visitors
FROM (
  SELECT visitor, source, referrer,
         ROW_NUMBER() OVER (PARTITION BY visitor ORDER BY started_at) AS n
  FROM pageviews
  WHERE is_me = 0 AND day >= date('now', '-30 days')
)
WHERE n = 1
GROUP BY origin
ORDER BY visitors DESC;


-- 3. Who: country, device, language.
SELECT country, device, lang, COUNT(DISTINCT visitor) AS visitors
FROM pageviews
WHERE is_me = 0 AND day >= date('now', '-30 days')
GROUP BY country, device, lang
ORDER BY visitors DESC
LIMIT 50;


-- 4. Every screen (page, tab, modal, case-study step): reach and holding time.
--    avg_scroll_pct counts only views where the screen had something to scroll.
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
  SELECT screen,
         SUM(value) AS active_ms,
         AVG(json_extract(props, '$.scroll')) AS avg_scroll
  FROM scoped WHERE type = 'screen_time' GROUP BY screen
)
SELECT v.screen, v.visitors, v.views,
       ROUND(COALESCE(h.active_ms, 0) / 1000.0 / v.views, 1) AS avg_active_sec_per_view,
       ROUND(h.avg_scroll) AS avg_scroll_pct
FROM views v LEFT JOIN holding h USING (screen)
ORDER BY v.visitors DESC, avg_active_sec_per_view DESC;


-- 5. Case-study depth: how many visitors reach each screen of each project.
--    Compare the first screen with the later ones to see where interest drops.
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


-- 6. Funnel: home → projects → resume → contact → reached out.
--    "Reached out" = clicked or copied the e-mail, opened LinkedIn, or sent the form.
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


-- 7. What gets clicked.
SELECT e.kind, e.target, e.label, COUNT(*) AS clicks, COUNT(DISTINCT p.visitor) AS visitors
FROM events e JOIN pageviews p USING (page_id)
WHERE e.type = 'click' AND p.is_me = 0 AND p.day >= date('now', '-30 days')
GROUP BY e.kind, e.target, e.label
ORDER BY clicks DESC
LIMIT 100;


-- 8. Interest signals leaving the site: GitHub, YouTube demo, LinkedIn, e-mail.
SELECT e.kind, e.target, COUNT(DISTINCT p.visitor) AS visitors
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND ((e.type = 'click' AND e.kind IN ('external', 'mailto', 'download')) OR e.type = 'copy')
GROUP BY e.kind, e.target
ORDER BY visitors DESC;


-- 9. Sessions (gap > 30 min starts a new one): duration, screens and the path taken.
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


-- 10. UX problems: rage clicks, clicks on non-interactive elements, JS errors.
SELECT e.type, e.screen, e.kind, e.target, e.label, COUNT(*) AS times
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND (e.type = 'js_error'
    OR (e.type = 'click' AND json_extract(e.props, '$.rage') = 1)
    OR (e.type = 'click' AND e.kind = 'other'))
GROUP BY e.type, e.screen, e.kind, e.target, e.label
ORDER BY times DESC
LIMIT 50;


-- 11. Testing Scope Framework demo: how people use the live tool.
SELECT e.type, e.label, json_extract(e.props, '$.impact') AS impact,
       json_extract(e.props, '$.complexity') AS complexity, COUNT(*) AS times
FROM events e JOIN pageviews p USING (page_id)
WHERE p.is_me = 0 AND p.day >= date('now', '-30 days')
  AND (e.type = 'demo_change' OR json_extract(e.props, '$.frame') IS NOT NULL)
GROUP BY e.type, e.label, impact, complexity
ORDER BY times DESC;
