# Bracket Sweepstakes prototype

Student concept for NYU Stern's Experience Studio | ESPN China course (fall 2026), built by Ever Chin with teammates.
The pitch is a free March Madness bracket challenge for Chinese basketball fans, streamed free on Bilibili, with a
prize capped at 50,000 RMB (China's lottery-style prize cap under the Anti-Unfair Competition Law). This repo is the
working prototype shown to classmates and the professor. It is a demo, not a live contest.

**Read `docs/pitch-context.md` before changing copy, content or features.** It summarizes the pitch deck, the
teammates' regional pitch, the prize options, precedents, promotion plan and the fan persona (a Chinese NBA fan who
knows nothing about March Madness or brackets). Put new source material from the team in `docs/` too.

## Run, test, deploy

- Run: open `index.html` in a browser, or `npm start` to serve the folder locally.
- Test: `npm test` (Node's built-in test runner; no dependencies). Run it after any change to `js/logic.js`.
- WeChat development: import `wechat/project.config.json` in WeChat Developer Tools using a test account.
  The user requested a development version first, without a registered AppID. See `wechat/README.md` for the
  import guide, native verification limit, preview and media setup. `wechat/miniprogram/` is the native app root.
  Run `node --test wechat/tests/native.test.js` and `python3 wechat/scripts/preview.py --check` after changes.
- Current public review site: https://timely-klepon-8e4d37.netlify.app/ (Netlify project
  `timely-klepon-8e4d37`, Derrick Li's team). Published November 13, 2026 by manually uploading the static site
  files. This project is not connected to GitHub; update it with another static upload until that connection is
  configured. Exclude docs, tests, repository metadata and other non-site files from manual uploads.
- The original repository deployment configuration publishes the repository root on pushes to `main`
  (`netlify.toml`, no build step), with pull-request previews. Do not assume those pushes update the current review
  site. The GitHub integration can read this repo but its upload endpoint currently returns 403, so the reviewed
  changes are committed locally on `feat/guided-onboarding` and have not been pushed or merged.

## Files

- `index.html`: markup only.
- `css/styles.css`: all styles, design tokens on `:root`, dark mode, self-hosted `@font-face` rules.
- `js/logic.js`: pure logic (team data, game tree, auto-fill rules, scoring, compact storage). Loaded as a classic
  script in the browser (globals) and via `require()` in tests. Keep it free of DOM code.
- `js/app.js`: UI, rendering and storage. Depends on globals from `logic.js`.
- `js/guide.js`: first-visit journey, interactive home-region map and team profile dialogs.
- `js/home.js`: official highlight playback and links into practice, players, archives and standings.
- `js/experience.js`: six historical practice games, archive views and leaderboard presentation helpers.
- `js/camp.js`: browser-local learning XP, badges, a four-team mini bracket and a rules quiz.
- `js/history-data.js`: complete 2023–2026 men's brackets, with actual scores and game source links.
- `js/profiles.js`: archived team identities and two season-record snapshots; see `docs/team-sources.md`.
- `js/players.js`: four featured Chinese-player profiles, with official roster sources and dated competition stats.
- `images/teams/`: self-hosted school logos for every team in the prototype field.
- `images/players/`: locally served official player portraits, resized for mobile loading.
- `images/moments/`: local official video previews and a Michigan championship photo. Court and trophy
  SVGs are original drawings.
- `images/history/`: local school marks for historical teams outside the current field.
- `fonts/`: Barlow and Barlow Condensed woff2 files (SIL OFL, see `fonts/OFL.txt`).
- `tests/logic.test.js`: rule and data checks.
- `docs/`: project background, not part of the website.
- `404.html`: Netlify's not-found page.
- `wechat/`: native WXML/WXSS Mini Program, shared-data sync scripts, controller tests and a browser review adapter.
  Keep this directory off the public website with the `/wechat/*` 404 rule. Manual Netlify uploads exclude it.
- `AGENTS.md`: short pointer to this file for other coding tools (Codex reads `AGENTS.md`).
- `netlify.toml`: publish settings, plus rules that keep `docs/`, `tests/`, `CLAUDE.md`, `AGENTS.md`, `README.md` and
  `package.json` off the public site. Add any new non-site file or folder to those rules.

## Hard constraints

- **Local page assets.** Classmates in mainland China may open the site without a VPN. Google Fonts, Google
  services and most foreign CDNs are blocked or very slow there, and a blocked stylesheet can leave the page blank.
  Keep fonts, scripts and images in the repo. User-initiated profile links may open an external team page in a new
  tab, but the experience must never depend on it. The user's requested video playback is the only runtime
  exception: pressing Play may create an official youtube-nocookie.com iframe. Never preload external players,
  fonts, scripts or image assets. Remove the iframe on close and offer external video and game-story links plus
  a local practice path. Label the mainland-China playback limitation. Vercel is blocked in mainland China, so the
  site stays on Netlify. See `docs/history-sources.md` for video and archive sources.
- **No ESPN or Bilibili logos or wordmarks.** A working entry page with real logos could pass as an official contest.
  The look borrows the feel (black broadcast hero, red slashes, condensed italic headlines, a scrolling ticker,
  Bilibili-style gray canvas with white rounded cards). Keep the "Student concept" tag and the footer disclaimer.
- **UI copy in English** (the audience is English-speaking), with Chinese characters for region names and the 中 badge.
- **Original color palette.** Preserve the original repository's red, black, gray and white surfaces, cyan pick
  accents, and home-region colors in light and dark modes. New sections and illustrations should fit that palette.
  Keep the interface sleek and clean; retain playful details in photos, drawings and interactions. Teams & regions
  uses solid regional reds and blues, matching region-button swatches, and a selected-region accent on the school
  list. Avoid faded map fills and extra gray panels around the map controls.
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

- First visits open Home. Michigan's 2026 title game is the featured headline, photo and clip. Eleven unique
  official videos are available: one featured clip and five each in 2026 and Classics. Each appears once in
  Home's cards. Previous/Next controls browse all eleven in one dialog; preserve the original trigger for focus
  restoration and replace the iframe on each change. Local previews load before explicit playback.
- Home and the game intro use the phone-and-hand illustration. How it works has a three-step journey:
  learn, explore, pick. Fan camp offers ten learning challenges in three tabs: six historical game picks,
  a three-pick Final Four mini bracket, and three rules questions. Each activity stays separate from real picks.
  Practice choices reveal scores, an explanation and a takeaway. Save the first choice, then make it read-only.
  Visitors may skip the warm-up and enter the real bracket at any time.
  Visiting My bracket stores `bs-onboarding: { started: true }`; returning visitors and saved drafts resume there.
  The How it works tab and bracket-header link always reopen the guide. Auto-fill remains in the collapsed helper.
- Teams & regions separates school home regions from NCAA tournament groups. The map supports hover, focus,
  Enter/Space and touch; the buttons provide the same selection. Every roster row opens a school profile.
  Keep the explicit Purdue example and illustrative-map label so the two kinds of region cannot be confused.
- The East map outline is simplified, with both labels inside the region and no leader line. Keep the labels
  white and readable in light and dark modes.
- Every bracket school has a local logo and a separate information button. Hover shows school name, seed, home
  region and Chinese-player context only. Season record snapshots belong in the opened profile, never hover text;
  the information button opens a keyboard-accessible native dialog with archived recent history and form, Chinese
  player context where applicable, and an external team information link. Profile access remains available when
  predictions are locked.
- The bracket key and home-region color legend appear above the picks.
- At 600px and below, the primary navigation is a fixed five-item bottom bar: Home, Explore, My picks, Crowd,
  Standings. Learn remains available from Home and the bracket's How it works button. The entry controls sit above it only
  on My picks. The header is smaller while picking, and pass-around controls follow the bracket. Keep both bars
  clear of content and honor safe-area insets. The three-step journey appears only in Learn and Explore.
- Keep first-visit copy brief: one definition, a visual tournament path, and short practice activities. Extra rules,
  region explanations, and auto-fill mechanics belong in expandable details.
- Teams & regions opens on the original regional map and school list. Players and Past brackets remain separate
  tabs. Four verified player profiles connect to
  their school profiles through School/Player tabs in the same dialog. On phones this dialog is a bottom sheet
  with a persistent close control. Stat labels must name the season and competition; never imply the snapshots
  are current NCAA performance. Player champion buttons use the existing Chinese-player auto-fill rule.
- Plain-language definitions: a "What is a seed?" button above the first game toggles a one-sentence definition
  (tap, click or keyboard; Esc closes). The "Root for a region" panel starts with one line saying home regions
  (东 南 西 北) are different from the NCAA's four bracket tabs.
- All sizes default to round buttons (Round of 64, Round of 32, Sweet 16, Elite 8, each with picks made) and only
  that round's games. Phones use full-width cards with 68px team targets and a visible selection check; larger screens use two columns. Desktop
  visitors can choose Show full bracket to see the original four-column layout. A "Next round" button appears when the round is fully picked, and after
  the Elite 8 it leads to the next bracket tab or the Final Four. The Final Four tab stacks both semifinals, the
  championship and the champion banner. This is rendering
  only: picks still go through `applyPick` in `js/logic.js`.
- Pass-around entries is collapsed to one line with an expand toggle on every screen size, because every visitor to
  the public site sees it. It stays open while a pass-around entry is in progress.
- Crowd is for predictions: champion popularity, rooting preferences, and picks for upcoming matchups. It does
  not repeat completed-game results or perfect-bracket counts. Round of 64 percentages use all brackets. Later
  rounds use eligible brackets that picked one of the two teams playing. Standings owns scoring, rankings and
  results; its survival trackers do not repeat fan-popularity counts. Keep the short purpose line on each page.
- Past brackets lives in Explore. Years 2023 through 2026 each contain all 63 games after the First Four. Default
  to 2026, whose actual champion is Michigan. These completed results remain separate from the playable demo.
  Open on the champion's six wins. Full bracket uses region and round tabs on mobile; larger screens show round
  columns. Preserve adjacent-game ordering and source links. Historical results never populate current results.
- Standings defaults to Leaderboard, with a separate Tournament tab for results, KPIs and trackers. Demo controls
  are collapsed. The leaderboard shows a friendly empty state until two real local entries exist. Simulated fans
  use a separate Demo fans tab and never count toward revealing the real-entry board. Ties share ranks. Show
  podiums only after results exist and label demo results. Preserve the explicit browser-local scope. The
  Game results tab owns tournament outcomes; the leaderboard table focuses on fan, champion pick, correct picks
  and points, without repeating rooting preferences from Crowd.
- Pass-around entries let several people enter on one device during class.

## Storage

The native WeChat development version stores its own validated state under `bs-wechat-v1` with
`wx.getStorageSync` / `wx.setStorageSync`. It has no configured shared backend or WeChat login flow. Keep the local
scope visible. Reuse `js/logic.js` through the content sync script, never copy DOM/browser globals into native
pages. Practice XP stays separate from bracket points. Eleven native clip pages accept licensed HTTPS sources
from `wechat/miniprogram/utils/videos.js`; no sources are configured yet. Keep the explicit playback state, local
poster and copy-source/practice fallback. Do not insert YouTube iframes or a website wrapper. Never commit an
AppSecret. The browser adapter is for review, not native compilation or a public Mini Program deployment.

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

The draft bracket is kept separately in `localStorage` under `bs-draft`. Journey completion uses `bs-onboarding`.
The former `bs-intro` dismissal is no longer used. Validated practice choices use `bs-practice`, separately from
draft picks. Fan camp uses `bs-camp` for validated mini picks, a mini-completion flag and correct quiz answers.
Legacy practice choices retain their progress. XP is derived: 10 per game tried (60 total), 30 once for the mini
bracket, and 10 per correct quiz answer (30 total). Replaying never adds XP. Badges are First pick, Bracket builder,
and March ready (all ten challenges). Levels are Rookie, Playmaker (40 XP), and Bracket captain (90 XP).
Mini semifinal changes clear any incompatible champion pick. Mini replays keep the earned completion badge.
Practice XP is clearly labeled, never affects contest scoring, and saves only on this device. No shared signup or
hosted leaderboard service is configured.

## Open items

- Decide the Midwest label: keep 北, show "北 Midwest (the northern heartland)", or switch to accurate names
  (东部, 南部, 西部, 中西部). Tell the teammates, since their slide uses the same mapping.
- The teammates' pitch lists Houran Dan at Hawaii Pacific. Sina lists the University of Hawaii (transfer from
  Seattle University). The site uses Hawaii.
- "Picks lock March 18" and the 2026 field are placeholders until the 2027 bracket is set.
- Shared entries across visitors need a hosted database (see Storage).
- An older copy of this page lives as a claude.ai artifact with its own shared entries. This repo is now the source of truth.
