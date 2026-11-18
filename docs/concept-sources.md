# Concept Lab sources: concepts 04 to 06

Verified November 18, 2026, for the feature ideas in `concepts/` (04 Your NBA star’s school, 05 Draft watch,
06 Beat the ambassador). Concepts 01 to 03 cite their own sources on the page.

2026 tournament results come from `js/history-data.js` (provenance in `docs/history-sources.md`). The Concept Lab
loads `../js/logic.js` and `../js/history-data.js` read-only. It maps archive teams to the field by region and seed,
so it shows the field's school names.

## 04: player colleges

Each college is the "College:" line on the player's Basketball Reference page. The page shows the first 14 players.
Rui Hachimura and Tyrese Haliburton are verified alternates.

| Player | College | Source | 2026 seed and bracket | Real 2026 result |
|---|---|---|---|---|
| Michael Jordan | UNC (North Carolina) | https://www.basketball-reference.com/players/j/jordami01.html | 6 South | Lost Round of 64 to 11 VCU, 82–78 |
| Kevin Durant | Texas | https://www.basketball-reference.com/players/d/duranke01.html | 11 West | Lost Sweet 16 to 2 Purdue, 79–77 |
| Kyrie Irving | Duke | https://www.basketball-reference.com/players/i/irvinky01.html | 1 East | Lost Elite 8 to 2 UConn, 73–72 |
| Jayson Tatum | Duke | https://www.basketball-reference.com/players/t/tatumja01.html | 1 East | Same as Irving |
| Anthony Davis | Kentucky | https://www.basketball-reference.com/players/d/davisan02.html | 7 Midwest | Lost Round of 32 to 2 Iowa State, 82–63 |
| Devin Booker | Kentucky | https://www.basketball-reference.com/players/b/bookede01.html | 7 Midwest | Same as Davis |
| Shai Gilgeous-Alexander | Kentucky | https://www.basketball-reference.com/players/g/gilgesh01.html | 7 Midwest | Same as Davis |
| Joel Embiid | Kansas | https://www.basketball-reference.com/players/e/embiijo01.html | 4 East | Lost Round of 32 to 5 St. John’s, 67–65 |
| Hakeem Olajuwon | Houston | https://www.basketball-reference.com/players/o/olajuha01.html | 2 South | Lost Sweet 16 to 3 Illinois, 65–55 |
| Russell Westbrook | UCLA | https://www.basketball-reference.com/players/w/westbru01.html | 7 East | Lost Round of 32 to 2 UConn, 73–57 |
| Magic Johnson | Michigan State | https://www.basketball-reference.com/players/j/johnsma02.html | 3 East | Lost Sweet 16 to 2 UConn, 67–63 |
| Jalen Brunson | Villanova | https://www.basketball-reference.com/players/b/brunsja01.html | 8 West | Lost Round of 64 to 9 Utah State, 86–76 |
| Anthony Edwards | Georgia | https://www.basketball-reference.com/players/e/edwaran01.html | 8 Midwest | Lost Round of 64 to 9 Saint Louis, 102–77 |
| Donovan Mitchell | Louisville | https://www.basketball-reference.com/players/m/mitchdo01.html | 6 East | Lost Round of 32 to 3 Michigan State, 77–69 |
| Rui Hachimura (alternate) | Gonzaga | https://www.basketball-reference.com/players/h/hachiru01.html | 3 West | Lost Round of 32 to 11 Texas, 74–68 |
| Tyrese Haliburton (alternate) | Iowa State | https://www.basketball-reference.com/players/h/halibty01.html | 2 Midwest | Lost Sweet 16 to 6 Tennessee, 76–62 |

The practice path is generated, not historical. The chosen school wins all six games. Every other game is a coin flip
weighted by `strength()` in `js/logic.js`.

## 05: 2026 NBA draft, first round

Source: https://www.basketball-reference.com/draft/NBA_2026.html (pick, drafting team and college as listed).

25 of the 30 first-round picks list a college that was in the 2026 field. "Came from a tournament team" means the
listed college was in the field. We did not check that each player appeared in tournament games. The practice uses
the top 10 picks.

| Pick | Player | Drafted by | College (seed, bracket) | Real 2026 run |
|---|---|---|---|---|
| 1 | AJ Dybantsa | WAS | BYU (6 West) | Lost Round of 64 to 11 Texas, 79–71 |
| 2 | Darryn Peterson | UTA | Kansas (4 East) | Lost Round of 32 to 5 St. John’s, 67–65 |
| 3 | Cameron Boozer | MEM | Duke (1 East) | Lost Elite 8 to 2 UConn, 73–72 |
| 4 | Caleb Wilson | CHI | North Carolina (6 South) | Lost Round of 64 to 11 VCU, 82–78 |
| 5 | Keaton Wagler | LAC | Illinois (3 South) | Lost Final Four to 2 UConn, 71–62 |
| 6 | Mikel Brown Jr. | BRK | Louisville (6 East) | Lost Round of 32 to 3 Michigan State, 77–69 |
| 7 | Darius Acuff Jr. | SAC | Arkansas (4 West) | Lost Sweet 16 to 1 Arizona, 109–88 |
| 8 | Kingston Flemings | ATL | Houston (2 South) | Lost Sweet 16 to 3 Illinois, 65–55 |
| 9 | Morez Johnson Jr. | DAL | Michigan (1 Midwest) | Won the title |
| 10 | Brayden Burries | MIL | Arizona (1 West) | Lost Final Four to 1 Michigan, 91–73 |
| 11 | Yaxel Lendeborg | GSW | Michigan (1 Midwest) | Won the title |
| 12 | Aday Mara | OKC | Michigan (1 Midwest) | Won the title |
| 13 | Nate Ament | MIA | Tennessee (6 Midwest) | Lost Elite 8 to 1 Michigan, 95–62 |
| 15 | Dailyn Swain | CHI | Texas (11 West) | Lost Sweet 16 to 2 Purdue, 79–77 |
| 16 | Bennett Stirtz | MEM | Iowa (9 South) | Lost Elite 8 to 3 Illinois, 71–59 |
| 18 | Christian Anderson Jr. | CHA | Texas Tech (5 Midwest) | Lost Round of 32 to 4 Alabama, 90–65 |
| 19 | Allen Graves | TOR | Santa Clara (10 Midwest) | Lost Round of 64 to 7 Kentucky, 89–84 |
| 20 | Jayden Quaintance | SAS | Kentucky (7 Midwest) | Lost Round of 32 to 2 Iowa State, 82–63 |
| 22 | Labaron Philon Jr. | PHI | Alabama (4 Midwest) | Lost Sweet 16 to 1 Michigan, 90–77 |
| 23 | Zuby Ejiofor | ATL | St. John’s (5 East) | Lost Sweet 16 to 1 Duke, 80–75 |
| 26 | Tarris Reed Jr. | DEN | UConn (2 East) | Lost the final to 1 Michigan, 69–63 |
| 27 | Chris Cenac Jr. | BOS | Houston (2 South) | Lost Sweet 16 to 3 Illinois, 65–55 |
| 28 | Joshua Jefferson | MIN | Iowa State (2 Midwest) | Lost Sweet 16 to 6 Tennessee, 76–62 |
| 29 | Alex Karaban | CLE | UConn (2 East) | Lost the final to 1 Michigan, 69–63 |
| 30 | Koa Peat | DAL | Arizona (1 West) | Lost Final Four to 1 Michigan, 91–73 |

Not from the field: 14 Hannes Steinbach (Washington), 17 Ebuka Okorie (Stanford), 24 Cameron Carr (Baylor),
21 Karim López and 25 Sergio de Larrea (no college listed).

## 06: sample ambassador brackets

These picks were written for the mockup. They lean toward each region's home schools where one reached the Final
Four, and they are never a real person's choices. The page labels them by region only, for example "East
ambassadors’ bracket (sample picks)", and shows no ambassador names. Scoring uses `POINTS` from `js/logic.js`.

| Sample group | Michigan v Arizona | UConn v Illinois | Champion | Score vs 2026 |
|---|---|---|---|---|
| East | Michigan | UConn | UConn | 320 |
| South (no South team reached the Final Four) | Arizona | Illinois | Arizona | 0 |
| West | Arizona | UConn | Arizona | 160 |
| Midwest | Michigan | Illinois | Michigan | 480 |
| Actual 2026 | Michigan 91–73 | UConn 71–62 | Michigan 69–63 | 640 max |

## Evidence cards

| Card | Source | What the page says (quoted or close paraphrase) |
|---|---|---|
| 04 | https://cronkitenews.azpbs.org/2025/03/20/ncaa-2025-men-tournament-features-former-phoenix-suns-players/ (March 20, 2025) | "14 of the 18 players on the roster attended colleges competing in this year’s tournament." Durant: "I’m focused on that, you know it ... I’ll be locked into it." |
| 04 | https://www.wfdd.org/2019-04-02/star-power-boosts-ncaa-tournament-ratings (AP, April 2, 2019) | Michigan State over Duke "drew a 10.5 percent television rating. That's the highest for a late Sunday regional final in over a decade." "Interest in the Blue Devils has been propelled this year by freshman sensation Zion Williamson." |
| 05 | https://awfulannouncing.com/nba/yang-hansen-summer-league-better-finals-china.html (November 21, 2025) | NBA deputy commissioner Mark Tatum: "Hansen Yang from Portland, his Summer League games did more than our NBA Finals in terms of viewership in China." |
| 05 | https://frontofficesports.com/article/a-march-madness-ratings-resurgence-may-depend-on-cooper-flagg/ (March 19, 2025) | The 2024 women’s title game with Caitlin Clark "smashed the record ... (18.9 million)". Flagg "could drive massive ratings if the Blue Devils make a deep run." |
| 05 | https://www.nba.com/news/nba-academy-basketball-without-borders-alumni-2026-ncaa-tournament (March 18, 2026) | "This year's NCAA Tournament will showcase 48 NBA Academy & BWB alumni." |
| 05 | https://www.basketball-reference.com/draft/NBA_2026.html | Our count of 25 of 30 first-round picks from 2026 tournament teams (table above). |
| 06 | https://espnpressroom.com/press-release/barack-etology-president-obama-fills-out-final-mens-bracket-in-espn-exclusive-wednesday/ (March 16, 2016) | "This marks the eighth straight year President Obama has completed a men’s bracket exclusively with ESPN." His brackets "will appear alongside those from the millions of fans". |
| 06 | https://espnpressroom.com/press-release/26-6-million-brackets-espn-tournament-challenge-sets-new-record-for-fourth-consecutive-year/ (March 19, 2026) | "For the fourth-consecutive year ... a new all-time record with 26.6 million completed brackets". |

The supplied links for WFDD, Front Office Sports and the 2016 ESPN Press Room page redirect, and the 2026 ESPN link
was given over plain HTTP. The page uses the final HTTPS URLs above.

Conclusions on each card are labeled as our inference: fans following a player's school (04), draft interest as a
way into March (05), and whether ambassador brackets work for Chinese fans (06). They need testing with Chinese fans.
