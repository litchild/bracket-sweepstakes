# Instructions for coding agents

This project's full instructions live in `CLAUDE.md`. Read `CLAUDE.md` and `docs/pitch-context.md` before making
any change, and follow them. When a rule or a behavior worth preserving changes, update `CLAUDE.md` (not this file)
so every tool working on the repo reads the same instructions.

The rules that matter most (details in `CLAUDE.md`):

- No external requests. Fonts, scripts and images stay in the repo, because visitors in mainland China may not have
  a VPN.
- No ESPN or Bilibili logos or wordmarks. Keep the "Student concept" tag and the footer disclaimer.
- UI copy is English, with Chinese characters for region names and the 中 badge. No em dashes, no litotes, no irony.
- Keep `js/logic.js` free of DOM code and run `npm test` after changing it.
- Non-site files must stay off the public site: add any new one to the 404 rules in `netlify.toml`.
- Work on a branch and open a pull request. Netlify publishes `main` and posts a preview link on each pull request.
