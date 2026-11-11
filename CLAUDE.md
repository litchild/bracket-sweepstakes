# Bracket Sweepstakes prototype

Student concept for NYU Stern's Experience Studio | ESPN China course (fall 2026), built by Ever Chin with teammates.
The pitch is a free March Madness bracket challenge for Chinese basketball fans, streamed free on Bilibili, with a
prize capped at 50,000 RMB (China's lottery-style prize cap under the Anti-Unfair Competition Law). This repo is the
working prototype shown to classmates and the professor. It is a demo, not a live contest.

## Run, test, deploy

- Run: open `index.html` in a browser, or `npm start` to serve the folder locally.
- Test: `npm test` (Node's built-in test runner; no dependencies). Run it after any change to `js/logic.js`.
- Deploy: Netlify publishes the repository root on every push to `main` (`netlify.toml`, no build step).
  Pull requests get Netlify deploy previews.

## Files

- `index.html`: markup only.
- `css/styles.css`: all styles, design tokens on `:root`, dark mode, self-hosted `@font-face` rules.
- `js/logic.js`: pure logic (team data, game tree, auto-fill rules, scoring, compact storage). Loaded as a classic
  script in the browser (globals) and via `require()` in tests. Keep it free of DOM code.
- `js/app.js`: UI, rendering and storage. Depends on globals from `logic.js`.
- `fonts/`: Barlow and Barlow Condensed woff2 files (SIL OFL, see `fonts/OFL.txt`).
- `tests/logic.test.js`: rule and data checks.

## Hard constraints

- **No external requests.** Classmates in mainland China may open the site without a VPN. Google Fonts, Google
  services and most foreign CDNs are blocked or very slow there, and a blocked stylesheet can leave the page blank.
  Keep fonts, scripts and images in the repo. Vercel is blocked in mainland China, so the site stays on Netlify.
- **No ESPN or Bilibili logos or wordmarks.** A working entry page with real logos could pass as an official contest.
  The look borrows the feel (black broadcast hero, red slashes, condensed italic headlines, a scrolling ticker,
  Bilibili-style gray canvas with white rounded cards). Keep the "Student concept" tag and the footer disclaimer.
- **UI copy in English** (the audience is English-speaking), with Chinese characters for region names and the 中 badge.
- **Writing style for all copy:** no em dashes, no litotes, no irony.
- Use `textContent` for anything a person types (pass-around names).

## Data

- Field: the 2026 NCAA men's tournament, used as a stand-in until the 2027 bracket is announced. Bracket order per
  region is 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15. Team ids are bracket letter + seed (`W2` = Purdue).
- Home region: each school's geographic region, following the teammates' pitch map. This is different from the
  NCAA's bracket names (Purdue plays in the West bracket but is a Midwest school). Counts: South 30, Midwest 17,
  West 10, East 7.
- Region labels: 东 East, 南 South, 西 West, 北 Midwest. The pitch calls Midwest "North-ish" to keep the 东南西北 phrase.
  The literal Chinese for Midwest is 中西部. See open items.
- Ambassadors per region come from the teammates' pitch deck (`ROOTS[*].guides`).
- Chinese players (`CN_PLAYERS`): teams in the field with a mainland Chinese player on a 2026-27 Division I roster,
  per Sina Sports (Sept 2026): Purdue (Sinan Huan), Louisville (Zhang Boyuan), Hawaii (Houran Dan), LIU (Xinyi Li).
  Three of the four are in the West bracket.

## Rules (js/logic.js)

- Seed strength is `seed ^ -1.2`; P(a beats b) = Sa / (Sa + Sb). Tuned so a random bracket has about 7 to 8
  first-round upsets.
- Root for a region: a team from the rooted region always beats a team from another region. Same-region and
  other-region matchups are seed-weighted coin flips. The champion always comes from the rooted region.
- Root for Chinese players: the fan picks one of the four teams. That team wins every game. The other three beat
  every team without a Chinese player. Two of them meeting (neither the pick) is a seed-weighted coin flip.
- Random by seed: seed-weighted coin flips everywhere.
- Scoring: 10, 20, 40, 80, 160, 320 points per correct pick by round (max 1,920).
- Brackets lock once any result exists.

## UI behavior worth preserving

- My bracket opens straight to the bracket. Auto-fill lives in a collapsed "Not sure who to pick?" bar.
- Crowd tab: Round of 64 percentages use all brackets. Later rounds use only brackets still live in that game
  (they picked one of the two teams playing).
- Standings: demo controls first (simulate next round, reset, add 1,000 simulated fans up to 5,000, remove them,
  remove pass-around entries), then Results by round with upset tags, KPIs, Chinese players tracker, regions alive,
  leaderboard.
- Pass-around entries let several people enter on one device during class.

## Storage

`js/app.js` uses `localBackend()`, which keeps everything in `localStorage` under `bs-local-db`, so each visitor sees
only their own entries plus simulated fans. Documents:

- `entries/<id>`: `{ picks: {gameId: teamId}, root: "east"|"south"|"west"|"midwest"|"cn"|"", cnTeam, mode, updatedAt,
  name?, guest? }`. Pass-around entries use ids starting `g-`.
- `state/results`: `{ winners: {gameId: teamId} }`.
- `state/sims`: `{ list: [packed] }`, each packed string is a root code (`e s w m c x`) plus 11 base64 characters
  holding the 63 pick bits in `GAMES` order.

To share entries between visitors, swap `localBackend()` for a hosted database with the same
`doc().get/set/delete/onSnapshot` and `collection().limit().onSnapshot` shape. Check that the service loads in
mainland China without a VPN before choosing it.

The draft bracket is kept separately in `localStorage` under `bs-draft`.

## Open items

- Decide the Midwest label: keep 北, show "北 Midwest (the northern heartland)", or switch to accurate names
  (东部, 南部, 西部, 中西部). Tell the teammates, since their slide uses the same mapping.
- The teammates' pitch lists Houran Dan at Hawaii Pacific. Sina lists the University of Hawaii (transfer from
  Seattle University). The site uses Hawaii.
- "Picks lock March 18" and the 2026 field are placeholders until the 2027 bracket is set.
- Shared entries across visitors need a hosted database (see Storage).
- An older copy of this page lives as a claude.ai artifact with its own shared entries. This repo is now the source of truth.
