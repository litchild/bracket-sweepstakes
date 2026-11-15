# Team profile sources

Profiles and school marks were retrieved on November 13, 2026. The site makes no background requests to these
services. School marks are bundled in `images/teams/` and remain the property of the respective schools.

- Team identity, profile URLs and logo references: ESPN's public team directory,
  `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?limit=500`.
- Archived season records: ESPN's public team endpoint,
  `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/{espnId}?season={year}`,
  using 2025 and 2026. Values are the `record.items` entry with `type: total`. The UI labels them as source
  snapshots, rather than asserting they are final season records. Each profile retains its ESPN ID and original
  logo URL in `js/profiles.js` for traceability. The season ending in 2025 is labeled 2024–25, and 2026 is 2025–26.
- Team home regions, ambassadors and Chinese-player connections: the existing `js/logic.js` and
  `docs/pitch-context.md`. The map is a simplified illustration of those pitch groups, rather than state boundaries.
- Tournament-group and seeding explanation: NCAA, [Explaining NCAA Tournament Selection and Seeding](https://www.ncaa.org/news/march-basketball/media-center-building-the-brackets-a-deep-dive-on-the-ncaa-tournament-selection-and-seeding-process/).

The prototype still uses its existing 64-team 2026 field. The introduction explicitly starts after opening games.
Profile links are ordinary user-initiated external navigation. They are the only point at which the visitor would
leave the locally served experience to access team news, rosters or results.

## Featured players and portraits

Verified November 13, 2026. The cards use 2026–27 roster details and metric heights rounded from each official
roster. The bracket still uses the 2026 tournament field. Every player has an official-bio link in the UI.

- [Sinan Huan, Purdue](https://purduesports.com/sports/mens-basketball/roster/player/sinan-huan): center, 7-1,
  freshman, Beijing, No. 33. Stats shown are from the 2025 FIBA U19 World Cup, not Purdue: 11.3 points and 5.0
  blocks per game. Portrait: Chris Lyons/Purdue Athletics, September 2026, sourced from the official bio's image.
- [Boyuan Zhang, Louisville](https://gocards.com/sports/mens-basketball/roster/boyuan-zhang/18082): displayed as
  Zhang Boyuan, consistent with the pitch; forward, 6-9, freshman, Changchun, No. 6. Stats shown are from the
  2025 FIBA U19 World Cup: 14.7 points and 5.1 rebounds per game. Portrait: Louisville Athletics, official bio
  image `images/2026/9/29/BoyuanZhang.png` on its Sidearm CDN.
- [Houran Dan, Hawaii](https://hawaiiathletics.com/sports/mens-basketball/roster/houran-dan/22718): center, 6-10,
  junior, Neimenggu, No. 6. Stats shown are 2025–26 at Seattle: 5.7 points and 2.5 rebounds per game.
  Portrait: Hawaii Athletics, official bio image `images/2026/9/15/Dan__Houran26_9126.jpg`.
- [Xinyi Li, LIU](https://www.liuathletics.com/sports/mens-basketball/roster/xinyi-li/7579): forward, 6-9,
  senior, Beijing, No. 34; previously at Manhattan. Stats shown are 2024–25 at LIU: 2.4 points and 1.1 rebounds
  per game. The current bio was accessible through search, but direct requests for the newest image returned
  403. The site uses his official 2025–26 portrait from the prior roster, explicitly dated in the credit:
  `https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/longislandu/images/2025/10/3/34_Xinyi_Li.png`.

Portraits are bundled locally in `images/players/`. No player details are fetched while a visitor uses the site.
