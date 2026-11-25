# Bracket Sweepstakes

The friends pilot is a free 63-game college basketball bracket challenge. The prize is 500 RMB. Entries close at the end of December 2, 2026, Beijing time.

- [Public website](https://bracket-sweepstakes.netlify.app/). First-time visitors see Simplified Chinese and can switch to US English in the top-right corner.
- [Private organizer dashboard](https://bracket-sweepstakes.netlify.app/organizer/). Sign in with the separate organizer key to review entries, check participation, and enter the result bracket. Save private winners as you go. After the deadline, release scores. Each correct pick earns one point and tied entries share a rank.
- Submitted entries and participation counts are stored on the existing Netlify project. Each browser can edit its own entry until the deadline. The public leaderboard shows nicknames and scores. The result bracket stays private.
- Earlier study entries and detailed traffic reports are available from the organizer dashboard. The earlier study uses its own store.
- For local development, run `npm install` and `npm start`, then visit http://localhost:8888/. The local organizer key defaults to `local-admin`. Local data is separate from the live site.
- `npm test` checks the bracket rules and the API.
- First-time visitors start with How it works and a practice pick, then explore school home regions and tournament
  groups before building their bracket one round at a time. Returning visitors resume their picks.
- All 64 school profiles and logos load locally. Profiles include archived season records and optional external
  links for more information. Source notes are in `docs/team-sources.md`.
- Website updates go through a pull request to `main`; the existing Netlify project deploys `main` automatically.
- A native [WeChat development version](wechat/README.md) is available in `wechat/`. Import its
  `project.config.json` in WeChat Developer Tools using a test account.

Project context for Claude Code is in `CLAUDE.md`.
