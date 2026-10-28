# Site telemetry worker

A Cloudflare Worker with a D1 (SQLite) database that receives events from
`assets/js/analytics.js`. Runs on the Cloudflare free plan.

## Privacy

- No cookies, no visitor IDs on the device, no IP addresses, no raw user agents are stored.
- Visitors are grouped by `sha256(daily salt + IP + user agent)`. The salt is random,
  lives in the `salts` table for one UTC day and is then deleted. D1 Time Travel can
  restore it for up to 7 days (free plan); after that, hashes cannot be linked across
  days or turned back into an IP.
- Country and city come from Cloudflare's own edge lookup; no third-party IP service.
- Typed text (form fields) and copied text are never read.
- Visitors with Global Privacy Control or Do Not Track enabled are not tracked.
- Workers Logs stay disabled so request IPs are not retained in logs either.

## Deploy (once)

```sh
cd worker
npx wrangler login
npx wrangler d1 create portfolio-telemetry
# copy the printed database_id into wrangler.toml
npx wrangler d1 execute portfolio-telemetry --remote --file=schema.sql
npx wrangler deploy
```

`deploy` prints the Worker URL, e.g. `https://portfolio-telemetry.<account>.workers.dev`.
Put it into `ENDPOINT` in `assets/js/analytics.js`, then run `npm run build` in the repo root.

## Your own visits

Open any page once with `?me=1` on each of your devices and browsers. Those visits are
stored with `is_me = 1` and excluded by the queries. `?me=0` clears the flag.

## Reading the data

Saved reports live in the database as views (`views.sql`). In the dashboard console run
e.g. `SELECT * FROM report_funnel;`. Re-apply after editing:
`npx wrangler d1 execute portfolio-telemetry --remote --file=views.sql`.

Ready-made queries also live in `queries.sql`. Run them in the Cloudflare dashboard
(D1 → portfolio-telemetry → Console) or with:

```sh
npx wrangler d1 execute portfolio-telemetry --remote --command "SELECT COUNT(*) FROM pageviews"
```

Free-plan limits: 100,000 Worker requests and 100,000 written rows per day, 500 MB per
database. If they are ever exceeded, only telemetry stops; the site is unaffected.
