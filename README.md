# Bracket Sweepstakes

Student concept prototype for NYU Experience Studio | ESPN China: a free March Madness bracket sweepstakes for
Chinese basketball fans, with a 50,000 RMB prize. Fans fill a bracket themselves, or auto-fill it by rooting for an
American region or for the teams with Chinese players.

Not affiliated with or endorsed by ESPN, Bilibili or the NCAA.

- [Public review site](https://timely-klepon-8e4d37.netlify.app/). This Netlify project uses manual static uploads;
  it is not currently connected to GitHub.
- Open `index.html` in a browser to try it.
- `npm test` checks the bracket rules.
- First-time visitors start with How it works and a practice pick, then explore school home regions and tournament
  groups before building their bracket one round at a time. Returning visitors resume their picks.
- All 64 school profiles and logos load locally. Profiles include archived season records and optional external
  links for more information. Source notes are in `docs/team-sources.md`.
- The original Netlify configuration publishes `main`; the current review site requires a separate upload.

Project context for Claude Code is in `CLAUDE.md`.
