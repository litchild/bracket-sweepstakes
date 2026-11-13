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
