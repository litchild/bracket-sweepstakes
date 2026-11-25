# Entries backend and dashboard

Added November 25, 2026. The website records real bracket entries and counts visits for an NYU class test. No prize
is paid; the site says so at the nickname step, in the pass-around card, in Learn's Rules and in the footer.

## How it works

- `/api/*` is one Netlify Function (`netlify/functions/api.mjs`) in the existing `bracket-sweepstakes` Netlify
  project. All routes live in `netlify/lib/api.mjs`.
- Data is stored in Netlify Blobs, Netlify's built-in key-value store. No outside database or analytics service is
  used, so nothing extra has to load in mainland China: the API is on the same domain as the site.
- Production writes to the Blobs store `bracket-live`. Deploy previews and branch deploys write to `bracket-preview`,
  so testing a pull request never changes the real numbers.
- The site polls `GET /api/state` every 30 seconds while the tab is visible, so the hero count, Crowd and Results
  update without a reload.

## Setup (once)

1. In Netlify: Site configuration > Environment variables > Add a variable. Key `ADMIN_TOKEN`, value a long random
   password (20 characters or more). Keep it out of the repository and chat messages.
2. Trigger a redeploy (Deploys > Trigger deploy) so the function picks up the variable.
3. Open https://bracket-sweepstakes.netlify.app/admin/ and sign in with that password. The password stays in the
   browser tab's session storage until you sign out or close the tab.
4. Before the class test: Test data > Clear visit data, and delete your test entries in the Entries table.

Without `ADMIN_TOKEN`, entries and visit counts still work; the dashboard says it is off.

## What is recorded

| Data | Where | Notes |
|---|---|---|
| Entry | `entries/<id>` | Nickname (24 characters max), 63 picks, how the bracket was made, pass-around flag, created and updated times, the device id, and a SHA-256 hash of the edit secret |
| Public entry index | `pub/<id>/<pack>` | Packed picks only. `GET /api/state` lists these for Crowd. Nicknames are never public |
| Visit event | `ev/<day>/<type>/<device>/<detail>/<n>` | Types: `visit` (phone, tablet or desktop), `src` (`?src=` value or referrer site), `tab`, `discover`, `start` (first pick), `fill` (auto-fill used), `complete` (63 picks); the server adds `enter` and `update` |
| Results | `state/results` | Winners by game and whether any round was simulated |

The device id is 16 random characters saved in the browser (`bs-vid`). No IP addresses, emails, phone numbers or
third-party cookies are stored. Days follow New York time.

## Dashboard (`/admin/`)

- Totals: visitors (unique devices), visits (page loads), brackets entered, and the share of visitors who entered.
- Visitors and entries per day for the last 30 days, with a table view and a daily CSV.
- From visit to entry: devices that visited, made a pick, picked all 63 and entered.
- Sections opened, Discover tabs, Help me choose usage, how visitors arrived, devices, how brackets were made and
  champion picks.
- Entries table with nickname search, CSV export (every pick by game) and delete. Once results exist it shows
  correct picks and whether each bracket is still perfect.
- Results: simulate the next round, record a real winner game by game, undo a game (later games that depended on
  it are cleared too) or reset everything. Any result locks every bracket on the website.
- Clear visit data removes all visit events and keeps entries.

To track a QR code or a post, add `?src=` to its link, for example
`https://bracket-sweepstakes.netlify.app/?src=class-qr`.

## Limits

- 60 new entries per device per day (pass-around in class stays well under it), 20,000 entries in total.
- Up to 20 events per request; unknown event types and unsafe details are dropped.
- The dashboard lists every event key on each load. That is quick for a class test. A public launch with
  millions of visits would need daily rollups instead.
- Device counts are approximate: one person on two browsers counts twice, and clearing browser data creates a new
  device id.

## Local development

`npm install`, then `npm start` serves the site with a working API at http://localhost:8888/. The dashboard password
is `local-admin` unless `ADMIN_TOKEN` is set. Data is kept in `.data/dev-store.json` (ignored by git);
`DEV_STORE=memory npm start` keeps it in memory. `npm test` runs the API tests against an in-memory store.
