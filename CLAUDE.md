# Friends pilot (current public website)

The public pilot on the existing Netlify project supersedes the older prototype notes below.
The root opens in Simplified Chinese. The top-right switch offers US English. The friends prize is 500 RMB.
School names stay in English in both languages (requested November 27, 2026); `SCHOOL_ZH` in `js/zh-dictionary.js`
holds each school's Chinese name, shown under the English name in its team profile. Never add school names to
`ZH_COPY`. The 中 badge carries `translate="no"` so browser page translation leaves it alone.
Entries close at 2026-12-03 00:00 Asia/Shanghai. Drafts stay in the browser. Submitted entries go to
a site-wide Netlify Blobs store via the same-origin pilot function. A random browser credential owns an
entry. The leaderboard awards one point per correct game and uses competition ranking for ties.
The organizer supplies a private reference bracket. Saved winners stay private. After the deadline
the organizer may release scores for decided games. Published scores never expose the answer key.
The organizer dashboard requires a high-entropy key. Only its SHA-256 digest belongs in Git.
Deploy previews have their own store. Build with node scripts/build.mjs. Only dist/ is public.
Record distinct browser visits, sessions, first picks, completions and durable entries. The public
site omits Bilibili, ESPN and NYU branding. The native development app is a separate project.

# Bracket Sweepstakes prototype

Student concept for NYU Stern's Experience Studio | ESPN China course (fall 2026), built by Ever Chin with teammates.
The pitch is a free March Madness bracket challenge for Chinese basketball fans, streamed free on Bilibili, with a
prize capped at 50,000 RMB (China's lottery-style prize cap under the Anti-Unfair Competition Law). This repo is the
working prototype shown to classmates and the professor. Since November 25, 2026 it records real entries and visit
counts for an NYU class test: no prize is paid (see Storage and `docs/backend.md`).

**Read `docs/pitch-context.md` before changing copy, content or features.** It summarizes the pitch deck, the
teammates' regional pitch, the prize options, precedents, promotion plan and the fan persona (a Chinese NBA fan who
knows nothing about March Madness or brackets). Put new source material from the team in `docs/` too.

## Run, test, deploy

- Run: `npm start` (`scripts/dev-server.mjs`) serves the site with a working `/api` at http://localhost:8888/ and
  the dashboard at `/admin/` (password `local-admin` unless `ADMIN_TOKEN` is set). Dev data lives in `.data/`
  (git-ignored). Opening `index.html` from disk still works with the browser-only demo backend.
- Test: `npm test` (Node's built-in test runner) covers the bracket rules and the API (`tests/api.test.mjs`, in-memory
  store). Run it after any change to `js/logic.js` or `netlify/lib/api.mjs`. Run `npm install` once for
  `@netlify/blobs`, the only dependency (used by the Netlify Function only).
- WeChat development: import `wechat/project.config.json` in WeChat Developer Tools using a test account.
  The user requested a development version first, without a registered AppID. See `wechat/README.md` for the
  import guide, native verification limit, preview and media setup. `wechat/miniprogram/` is the native app root.
  Run `node --test wechat/tests/native.test.js` and `python3 wechat/scripts/preview.py --check` after changes.
- Preferred public website: https://bracket-sweepstakes.netlify.app/ (existing Netlify project
  `bracket-sweepstakes`, connected to `litchild/bracket-sweepstakes`). The user explicitly requested on November 15,
  2026 that future changes update this existing GitHub-connected project and preserve its URL. Work on a branch,
  open a PR, and merge the approved update to `main` so Netlify deploys the repository root automatically
  (`netlify.toml`, no build step; Netlify installs `@netlify/blobs` and bundles `netlify/functions/`). Verify the
  resulting deployment, including `/api/state`. Do not create another Netlify project.
- Backend: `/api/*` is a Netlify Function on Netlify Blobs, on the same domain as the site, so it loads wherever the
  site loads (no third-party database, which may be blocked in mainland China). Production uses the Blobs store
  `bracket-live`; deploy previews and branch deploys use `bracket-preview`. The dashboard at `/admin/` needs the
  `ADMIN_TOKEN` environment variable in the Netlify project settings; never commit it. Details: `docs/backend.md`.
- The November 13 manual review copy at https://timely-klepon-8e4d37.netlify.app/ is a separate, unlinked project.
  Keep it as an old review copy; use the original project for subsequent website updates. Exclude docs, tests,
  repository metadata and the WeChat development project from the public site.
- GitHub's connected app may still reject uploads with 403 despite the user's repository push permission.
  Direct GitHub CLI sign-in was authorized on November 15, 2026. Use the authenticated CLI for pushes and PRs
  when the connector cannot write. The CLI is installed in the user's local bin, and this checkout has a
  repository-specific `gh auth git-credential` helper. Reuse that sign-in; keep credentials outside the repo.

## Files

- `index.html`: markup only.
- `css/styles.css`: all styles, design tokens on `:root`, dark mode, self-hosted `@font-face` rules.
- `js/logic.js`: pure logic (team data, game tree, auto-fill rules, scoring, compact storage). Loaded as a classic
  script in the browser (globals) and via `require()` in tests. Keep it free of DOM code.
- `js/app.js`: UI, rendering and storage. Depends on globals from `logic.js` and `remote.js`.
- `js/remote.js`: `remoteBackend()` (entries and results through `/api`, polled every 30 seconds while visible) and
  `track()` (first-party visit events). Used on http(s); `file://` keeps `localBackend()`.
- `netlify/functions/api.mjs`: the Netlify Function wrapper. `netlify/lib/api.mjs`: every route, validation and the
  dashboard summary, written against a small store interface. `netlify/lib/memory-store.mjs`: the store for tests
  and the dev server. `scripts/dev-server.mjs`: `npm start`.
- `admin/`: the password-protected entries dashboard (`index.html`, `admin.js`, `admin.css`). It loads
  `../js/logic.js` read-only and is marked noindex.
- `js/guide.js`: first-visit journey, interactive home-region map and team profile dialogs.
- `js/discovery-data.js` and `js/discovery.js`: NBA alumni (with a recognition order and the 12 star picks), the
  2027 lottery watch, the 2026 first round from this bracket, alumni face-offs, per-school discovery and
  school-to-bracket navigation. Sources are in `docs/discovery-sources.md`.
- `js/home.js`: retained official clip catalog for native WeChat development and its content sync. The website
  does not load this file; it contains no browser playback or homepage behavior.
- `js/experience.js`: six historical practice games and archive views. `rankBrackets` stays for its test and as the
  WeChat sync script's split marker; the website no longer shows a leaderboard.
- `js/camp.js`: browser-local learning XP, badges, a four-team mini bracket and a rules quiz.
- `js/history-data.js`: complete 2023–2026 men's brackets, with actual scores and game source links.
- `js/profiles.js`: archived team identities and two season-record snapshots; see `docs/team-sources.md`.
- `js/players.js`: four featured Chinese-player profiles, with official roster sources and dated competition stats.
- `images/teams/`: self-hosted school logos for every team in the prototype field.
- `images/players/`: locally served official player portraits, resized for mobile loading.
- `images/moments/`: local official video previews and a Michigan championship photo. Court and trophy
  SVGs are original drawings.
- `images/history/`: local school marks for historical teams outside the current field.
- `images/brand/`: ESPN and Bilibili logo SVGs (Wikimedia Commons, editor metadata removed) for the hero link only.
- `images/hero/`: two local WebP sizes of the owner-supplied tournament banner.
- `fonts/`: Barlow and Barlow Condensed woff2 files (SIL OFL, see `fonts/OFL.txt`).
- `tests/logic.test.js`: rule and data checks. `tests/api.test.mjs`: API checks.
- `docs/`: project background, not part of the website.
- `404.html`: Netlify's not-found page.
- `wechat/`: native WXML/WXSS Mini Program, shared-data sync scripts, controller tests and a browser review adapter.
  Keep this directory off the public website with the `/wechat/*` 404 rule. Manual Netlify uploads exclude it.
- `AGENTS.md`: short pointer to this file for other coding tools (Codex reads `AGENTS.md`).
- `netlify.toml`: publish settings, the functions folder, Node 22, a noindex header for `/admin/*`, plus rules that keep
  `docs/`, `tests/`, `netlify/`, `scripts/`, `node_modules/`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `package.json`
  and `package-lock.json` off the public site. Add any new non-site file or folder to those rules (and to `HIDDEN`
  in `scripts/dev-server.mjs`).

## Hard constraints

- **Local page assets.** Classmates in mainland China may open the site without a VPN. Google Fonts, Google
  services and most foreign CDNs are blocked or very slow there, and a blocked stylesheet can leave the page blank.
  Keep fonts, scripts and images in the repo. User-initiated profile links may open an external team page in a new
  tab, but the experience must never depend on it. The website's video homepage and playback were removed at
  the user's request on November 15, 2026. On November 18 the user requested highlights as secondary content:
  Discover > History lists them after the past brackets. They link to official NCAA videos after a user click,
  with local previews and practice paths.
  Do not load external players, fonts, scripts or image assets. The native
  WeChat development project retains its separate clip catalog and media setup described below. Vercel is blocked
  in mainland China, so the site stays on Netlify. See `docs/history-sources.md` for video and archive sources.
- The header links the local ESPN and Bilibili logos to Bilibili. Keep them in this location only.
  The user requested that the public website omit the student and affiliation labels and demo wording.
  Keep the scope of recorded entries, simulated results and the proposed prize clear in plain language. The user
  chose (November 25, 2026) a class test with no prize: the nickname step at Enter, the pass-around card, Learn's
  Rules and the footer say "NYU class test. Entries are recorded for our study; no prize is paid." Keep the 50,000 RMB
  hero, entry bar tag and Learn step 4 as they are. The footer also states what is saved: nickname, picks and a
  random device ID that counts visits, with no contact details.
- **UI copy in English** (the audience is English-speaking), with Chinese characters for region names and the 中 badge.
- **Original color palette.** Preserve the original repository's red, black, gray and white surfaces, cyan pick
  accents, and home-region colors in light and dark modes. New sections and illustrations should fit that palette.
  Keep the interface sleek and clean; retain playful details in photos, drawings and interactions. Teams & regions
  uses solid regional reds and blues, matching region-button swatches, and a selected-region accent on the school
  list. Avoid faded map fills and extra gray panels around the map controls.
- **Writing style for all copy:** no em dashes, no litotes, no irony.
- The local basketball cursor applies to fine pointers with hover. Clickable controls use its cyan-ring version.
  Preserve native touch, text-entry and disabled cursor behavior. The header uses the owner's four-player
  tournament photo, faded into the dark background on desktop and mobile. The NBA introduction
  includes three clickable alumni school cards, and player cards have school logos and bold red/cyan accents.
  The bracket completion meter shows actual picks out of 63; its moving ball is decorative. A short manual-pick
  confirmation animates only the selected team, never changes picks or scoring, and respects reduced motion.
  Hover effects must have keyboard focus equivalents and must never be required to access information.
- Use `textContent` for anything a person types (nicknames, pass-around names), on the site and in the dashboard.
- Entries collect a nickname only (the user's choice). Never add contact fields, IP logging or third-party analytics.

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
  other-region matchups are seed-weighted coin flips. The champion always comes from the rooted region. The website
  stopped offering this on November 25, 2026 (old drafts that used it still load); `logic.js` keeps the rule.
- Root for Chinese players: the fan picks one of the four teams. That team wins every game. The other three beat
  every team without a Chinese player. Two of them meeting (neither the pick) is a seed-weighted coin flip.
- Root for an NBA star's school (added November 25, 2026): the fan picks one of 12 NBA stars. The star's college
  team wins every game; every other game is a seed-weighted coin flip. Stored as `root: "star"`, the school id in
  `cnTeam` and the NBA player id in `star`.
- Fill randomly (requested November 27, 2026): a pure coin flip, every game 50/50 whatever the seeds
  (`randomBracket({ coin: true })`, stored as `mode: "random"`). Older drafts with `mode: "seed"` keep the
  seed-weighted reshuffle.
- Scoring: `POINTS` and `score()` (10, 20, 40, 80, 160, 320 per correct pick, max 1,920) stay in `logic.js` for the
  WeChat app, the Concept Lab and tests. The website shows no points or leaderboard since November 25, 2026.
- Brackets lock once any result exists.

## UI behavior worth preserving

- The Concept Lab has a separate URL, requested on November 18, 2026: https://bracket-sweepstakes.netlify.app/concepts/.
  The `concepts/` directory contains the mobile mockups, local storyboards, practice interactions, research and
  journey maps. This review page is separate from the main prototype. Its practice does not save or alter entries;
  share cards are mockups. Publish only its HTML, CSS, JS and local assets; keep review notes, screenshots and ZIP
  files outside the public checkout.
- The Concept Lab shows six concepts. 01 to 03 are homepage directions built by a teammate: keep his concepts,
  journeys and recommendation as they are and add to them. 04 to 06 are feature ideas added on November 18, 2026:
  04 Your NBA star’s school (pick a player, his college wins the practice bracket), 05 Draft watch (2026 first-round
  picks on tournament teams, predict a prospect's run), 06 Beat the ambassador (three Final Four picks against a
  regional sample bracket). Each has a nav button, mockup, explainer, practice, journey row and evidence card.
  The page loads `../js/logic.js` and `../js/history-data.js` read-only for the field, game tree, seed strength,
  points and real 2026 results; never modify them for the Concept Lab. New code is appended to `concepts/app.js`
  in its compact style, and practice buttons for 04 to 06 use `data-feature`, because `data-practice` starts
  concept 03's practice. Concepts 04 to 06 use no league, team or player logos and no player photos: type and CSS
  art only. Ambassador brackets are always labeled as sample picks by region, never with names or as a real
  person's choices. Data and evidence sources, with inference labels, are in `docs/concept-sources.md`.
- The prize leads the page. The hero headline reads "One shot to win" (a red slashed tag on its own line) above a
  giant "50,000 RMB" (number in the display face, "RMB" in red), with "Bracket Sweepstakes" as a smaller line above
  and "Free to enter · Picks lock March 18" below on every screen size. Desktop adds a red "Make your picks" button.
  On phones the headline fits beside the tournament photo. The fixed entry bar carries a red
  "Win 50,000 RMB" tag on every screen size,
  and the browser tab title starts with "One shot to win 50,000 RMB". Learn's
  "What is a bracket?" steps end with a red step 4, "Win 50,000 RMB". Never state which
  prize rule applies or mention the odds (see `docs/pitch-context.md`).
- All website visits open My bracket, per the November 18 feedback. The compact mobile prize headline and bracket
  are immediately visible: at 390 x 844 the whole first game sits above the entry bar, and at 360 x 740 the first
  team's name and NBA hint show above it. Learn is optional through navigation and How it works. Keep existing drafts intact. Highlights belong
  in Discover > History, after the past brackets, never on the landing page.
  The native WeChat development app keeps its existing Home and eleven-clip experience.
- Learn explains March Madness and defines a bracket as predictions of every game's winner through the champion.
  Three short steps explain tapping a winner, advancing that pick, and choosing a champion, then step 4 is the prize. Keep the illustrated
  four-to-two-to-one practice path and clear phone-and-hand drawing, with readable team labels, a cyan selection and a check mark.
  The Learn/Explore/Pick stepper was removed on November 25, 2026 to cut a navigation layer. Fan camp opens on Mini bracket and offers ten learning
  challenges across three tabs: a three-pick Final Four mini bracket, six historical game picks, and three rules
  questions. XP and badges live in an expandable progress section. Each activity stays separate from real picks.
  Practice choices reveal scores, an explanation and a takeaway. Save the first choice, then make it read-only.
  Visitors may skip the warm-up and enter the real bracket at any time.
  Visiting My bracket stores `bs-onboarding: { started: true }`; returning visitors and saved drafts resume there.
  The Learn tab and the How it works link under "Your bracket" always reopen the guide. Auto-fill remains in the collapsed helper.
- Every bracket school has a local logo and a separate information button. Hover shows school name, seed, tournament
  group and Chinese-player context only. No home regions appear in hovers, profiles, game rows or results. Season record snapshots belong in the opened profile, never hover text;
  the information button opens a keyboard-accessible native dialog with archived recent history and form, Chinese
  player context where applicable, and an external team information link. Profile access remains available when
  predictions are locked.
- Removed on November 25, 2026: the "Bracket wire" ticker under the hero, and the 中 icon on bracket game rows (the
  Chinese players helper tab, Results tracker and Results game rows keep it).
- The "What is a seed?" key sits beside the round instruction ("Pick 8 winners.") and explains seeds, ⓘ and "NBA:".
  There is no color or icon legend and no home-region dots on team rows (removed November 25). One short line ("Tap
  who you think wins each game. How it works") sits under "Your bracket". "Clear all" appears only once there is a
  pick. The bracket header holds the view switch; on phones its progress meter is hidden because the entry bar shows
  the count.
- At 600px and below, the primary navigation is a fixed five-item bottom bar: Learn, Discover, My picks, Crowd,
  Results. Learn also remains available from the bracket's How it works button. The entry controls sit above it only
  on My picks. The header is smaller while picking, and pass-around controls follow the bracket. Keep both bars
  clear of content and honor safe-area insets. The section is named Discover in both navigation bars.
  Netlify's injected attribution badge stays visible in normal page flow after the content so it cannot cover
  the fixed navigation or entry controls on phones.
- Keep first-visit copy brief: one definition, a visual tournament path, and short practice activities. Extra rules,
  region explanations, and auto-fill mechanics belong in expandable details.
- Discover has three tabs: NBA stars (default), Draft watch and History. The Regions tab (map, roster, Chinese-player
  filter) was removed on November 25, 2026.
  NBA stars: 71 NBA alumni across 25 field schools, best-known names first (editorial `STAR_ORDER`: Jordan,
  Durant, Kyrie Irving, Tatum, ...). Each player is one compact row (portrait, name, school, NBA team and actual
  draft) that opens the profile, plus one small link to the school's games. Search accepts player, school or NBA team
  names, punctuation variations and UConn/Connecticut aliases; the school select shows counts; 12 rows at a time
  with Show more.
  NBA team affiliations were checked against official NBA profiles on November 25, 2026. Show the team on alumni
  rows, individual profiles, related-player rows and face-off tooltips, with a visible snapshot date and source in
  the profile. This is a curated snapshot, not a live roster feed. Aldridge is labeled Retired using the NBA
  retirement report; Jordan, Magic Johnson and Olajuwon are labeled Retired from their NBA.com profiles, which list
  them as inactive with careers that ended decades ago. Ivey, Morris, Jimmer Fredette and Patty Mills show No NBA team
  listed because their official profiles list no current team. Never fill these gaps with a former team or infer
  free-agent status. Recheck all affiliations and update the date when refreshing. Draft-watch prospects never
  receive NBA team affiliations. School profiles preview four clickable alumni, link to every featured connection
  and show prospect profiles; keep all 64 school profiles, including honest empty states. Alumni profiles show local portraits, dated NBA position/height, actual draft outcomes, related alumni and a
  school-to-bracket route. This is a curated collection, not a complete alumni database; empty schools say no
  featured data, never no alumni. Alumni are former college players, never current lineups.
  Discover leads directly from its featured alumni to the searchable directory. Alumni face-offs belong only
  to bracket matchups. In round view, a game card opens the poster when both schools have at least two alumni.
  Show up to five clickable former players per school. Identify them as former
  players. Portrait initials are a load fallback only and are hidden once the transparent headshot loads.
  Game cards in the round view show the school's two best-known alumni under its name ("NBA: Kyrie Irving, Jayson
  Tatum"). Hide these hints and face-off links in the full four-column view.
  Draft watch: a dark header card, "See them in March. Hear their names in June." Two views. 2027 lottery watch shows
  the top three as large dark cards (big rank, school logo, chips) and ranks 4 to 14 as a card grid. It lists ESPN's top 14
  (Jeremy Woo big board, November 5, 2026) with position, class and current team: college players link to their
  school (logo, seed in this bracket, profile); Stefan Joksimovic is marked as a pro club player. Always call these
  board ranks and projections, never a mock draft or draft order. 2026 first round lists the 25 first-round picks
  from 2026 tournament teams as cards with seed and a colored badge for the team's actual 2026 run (red for the title,
  cyan for the Final Four or final), a callout for the champion's picks, and links to the school's games.
  History: past brackets first, then the three highlight clips.
  "Help me choose" in My bracket offers three tabs (requested November 27, 2026): Random (default), NBA stars (12 star
  cards) and Chinese players. Random says "If you just want to try your luck, use this button." with a "Fill randomly"
  button (a pure 50/50 coin flip per game; it replaced the "Quick fill by seed" button). After a random fill the
  helper stays open and a "↻ Fill again" button refills. Never call any fill a draw or lottery.
  The standalone Players tab, cards and introduction were removed at the user's request on November 15, 2026.
  Four verified player profiles remain connected to
  their school profiles through School/Player tabs in the same dialog. On phones this dialog is a bottom sheet
  with a persistent close control. Stat labels must name the season and competition; never imply the snapshots
  are current NCAA performance. Player champion buttons use the existing Chinese-player auto-fill rule.
- Plain-language definitions: a "What is a seed?" button above the first game toggles a one-sentence definition,
  the ⓘ and "NBA:" explanations (tap, click or keyboard; Esc closes).
- Bracket views (November 25): a two-way switch, "Full bracket | Round by round", in the bracket header on every
  screen size. Desktop opens on the full four-column bracket; phones open round by round, and their full bracket
  scrolls sideways inside the card with a "Swipe sideways for later rounds" hint. Round by round shows round buttons
  (Round of 64, Round of 32, Sweet 16, Elite 8, each with picks made) and only that round's games. Phones use full-width cards with 68px team targets and a visible selection check; larger screens use two columns. A "Next round" button appears when the round is fully picked, and after
  the Elite 8 it leads to the next bracket tab or the Final Four. The Final Four tab stacks both semifinals, the
  championship and the champion banner. This is rendering
  only: picks still go through `applyPick` in `js/logic.js`. On phones, all five tournament tabs remain visible
  without horizontal scrolling. Number games within each round. When a future round has no available teams yet,
  offer a clear route back to the earlier round that needs picks.
- Pass-around entries is collapsed to one line with an expand toggle on every screen size, because every visitor to
  the public site sees it. It stays open while a pass-around entry is in progress.
- Crowd is for predictions: champion popularity, rooting preferences, and picks for upcoming matchups. It does
  not repeat completed-game results or perfect-bracket counts. Round of 64 percentages use all brackets. Later
  rounds use eligible brackets that picked one of the two teams playing. "Who fans root for" shows Chinese players,
  NBA star's school and own picks (no regions); simulated fans use Chinese-player or own-pick brackets. Results owns
  game results; its tracker does not repeat fan-popularity counts. Keep the short purpose line on each page.
- Past brackets lives in Discover > History. Years 2023 through 2026 each contain all 63 games after the First Four. Default
  to 2026, whose actual champion is Michigan. These completed results remain separate from the playable demo.
  Open on the champion's six wins. Full bracket uses region and round tabs on mobile; larger screens show round
  columns. Preserve adjacent-game ordering and source links. Historical results never populate current results.
- Results (the former Standings tab, renamed November 25, 2026, with its leaderboard, podium and points removed):
  collapsed simulation controls, game results by round with upset tags, three counts (brackets entered, perfect brackets
  left, games played) and the Chinese players tracker. The "Regions still alive" cards were removed. On the website,
  results come from the dashboard and are labeled "Simulated results" or "Results entered by our team"; the
  simulation controls appear only in the browser-only demo (`file://`).
- Pass-around entries let several people enter on one device during class. On the website each one is recorded as
  its own entry with the nickname typed there; the card counts entries made on this device (`bs-guests`).
- Entering on the website: a nickname dialog opens before the first entry from a device ("Choose a nickname", 24
  characters max, the class-test line). Updates reuse it. Entries lock for everyone once any result exists.

## Storage

The native WeChat development version stores its own validated state under `bs-wechat-v1` with
`wx.getStorageSync` / `wx.setStorageSync`. It has no configured shared backend or WeChat login flow. Keep the local
scope visible. Reuse `js/logic.js` through the content sync script, never copy DOM/browser globals into native
pages. Practice XP stays separate from bracket points. Eleven native clip pages accept licensed HTTPS sources
from `wechat/miniprogram/utils/videos.js`; no sources are configured yet. Keep the explicit playback state, local
poster and copy-source/practice fallback. Do not insert YouTube iframes or a website wrapper. Never commit an
AppSecret. The browser adapter is for review, not native compilation or a public Mini Program deployment.

On the website (http/https), `js/app.js` uses `remoteBackend()` from `js/remote.js`. It keeps the
`doc().get/set/delete/onSnapshot` and `collection().limit().onSnapshot` shape over the site's own API:

- `GET /api/state`: every entry's packed picks (no nicknames) plus `{ winners, source }`.
- `POST /api/entries`: `{ vid, name, pack, cnTeam, star, mode, guest, id?, secret? }`. A new entry returns an id and
  an edit secret, kept in `localStorage` under `bs-entry` (`{ id, secret, name }`); the server stores only its
  SHA-256 hash. `GET /api/entry?id=` with the `x-entry-secret` header reads it back on load.
- `POST /api/events`: `{ vid, events: [{ type, detail }] }`, types `visit src tab discover start fill complete`. The
  server adds `enter` and `update`. `vid` is a random 16-character id under `bs-vid`; `?src=name` on a link or QR
  code becomes the `src` event.
- `/api/admin/*` (Bearer `ADMIN_TOKEN`): `summary`, `results` (simulate, record, undo, reset), `delete-entries`,
  `clear-events`. Blobs keys and limits are documented in `netlify/lib/api.mjs` and `docs/backend.md`.

Opened from disk, `localBackend()` keeps everything in `localStorage` under `bs-local-db`, so each visitor sees only
their own entries plus simulated fans. Documents:

- `entries/<id>`: `{ picks: {gameId: teamId}, root: "east"|"south"|"west"|"midwest"|"cn"|"star"|"", cnTeam, star,
  mode, updatedAt, name?, guest? }`. `cnTeam` is the chosen team for the Chinese-player and NBA-star routes; `star` is
  the NBA player id for the star route. Pass-around entries use ids starting `g-`.
- `state/results`: `{ winners: {gameId: teamId} }`.
- `state/sims`: `{ list: [packed] }`, each packed string is a root code (`e s w m c n x`, `n` = NBA star) plus 11
  base64 characters holding the 63 pick bits in `GAMES` order. The API uses the same packed format.

Any replacement backend must load in mainland China without a VPN; same-origin Netlify Functions do.

The draft bracket is kept separately in `localStorage` under `bs-draft` (same fields as an entry, including `star`). Journey completion uses `bs-onboarding`.
The former `bs-intro` dismissal is no longer used. Validated practice choices use `bs-practice`, separately from
draft picks. Fan camp uses `bs-camp` for validated mini picks, a mini-completion flag and correct quiz answers.
Legacy practice choices retain their progress. XP is derived: 10 per game tried (60 total), 30 once for the mini
bracket, and 10 per correct quiz answer (30 total). Replaying never adds XP. Badges are First pick, Bracket builder,
and March ready (all ten challenges). Levels are Rookie, Playmaker (40 XP), and Bracket captain (90 XP).
Mini semifinal changes clear any incompatible champion pick. Mini replays keep the earned completion badge.
Practice XP is clearly labeled, never affects contest scoring, and saves only on this device. Practice is not sent
to the API; there is no signup or hosted leaderboard.

## Open items

- Decide the Midwest label: keep 北, show "北 Midwest (the northern heartland)", or switch to accurate names
  (东部, 南部, 西部, 中西部). Tell the teammates, since their slide uses the same mapping.
- The teammates' pitch lists Houran Dan at Hawaii Pacific. Sina lists the University of Hawaii (transfer from
  Seattle University). The site uses Hawaii.
- "Picks lock March 18" and the 2026 field are placeholders until the 2027 bracket is set.
- Set `ADMIN_TOKEN` in the Netlify project (Site configuration > Environment variables), then redeploy, to open
  `/admin/`. Clear test visits and delete test entries from the dashboard before the class test starts.
- Netlify Blobs listing reads every event key for the dashboard. That is fine for a class test (tens of thousands of
  events); a public launch would need daily rollups.
- An older copy of this page lives as a claude.ai artifact with its own shared entries. This repo is now the source of truth.
