# Archive, practice and media sources

Verified November 13, 2026. Archive years are 2023–2026. Actual completed results are separate from the playable demo and its simulated results.

## Results

`js/history-data.js` contains all 63 men's tournament games from the Round of 64 onward for each year. First Four games are excluded. The source is ESPN's public daily scoreboard endpoint:

`https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=YYYYMMDD&groups=100&limit=100`

- 2023: March 16–19, 23–26; April 1, 3. Champion UConn, 76–59 over San Diego State.
- 2024: March 21–24, 28–31; April 6, 8. Champion UConn, 75–60 over Purdue.
- 2025: March 20–23, 27–30; April 5, 7. Champion Florida, 65–63 over Houston.
- 2026: March 19–22, 26–29; April 4, 6. Champion Michigan, 69–63 over UConn. Cross-checked with the [NCAA championship history](https://www.ncaa.com/history/basketball-men/d1) and [official bracket](https://www.ncaa.com/march-madness-live/bracket).

Each record retains its original ESPN box-score URL. Seeds and bracket-region labels come from the tournament notes. Locally served historical school marks use ESPN's school logo service, resized to 96 pixels. Current-field marks are reused when IDs match. School marks belong to their respective owners.

## Practice explanations

- [Kentucky's official Oakland recap](https://ukathletics.com/news/2024/03/21/kentucky-falls-to-oakland-in-ncaa-first-round/): Oakland 80, Kentucky 76; Jack Gohlke made 10 threes.
- [Purdue's official FDU recap](https://purduesports.com/news/2023/03/17/purdue-season-ends-with-first-round-upset): FDU 63, Purdue 58.
- [Florida's official championship recap](https://floridagators.com/news/2025/4/8/mens-basketball-florida-houston-ncaa-championship-game-april-7-2025): Florida 65, Houston 63; 12-point comeback; Houston turnovers on its final two possessions.
- [Official UConn–Duke 2026 finish](https://www.youtube.com/watch?v=vHOJ4Gsk7oE): UConn 73, Duke 72; Braylon Mullins' late three for a Final Four place.
- [Iowa's official 2026 Florida recap](https://hawkeyesports.com/news/2026/03/22/hawkeyes-punch-ticket-to-sweet-16): Iowa 73, Florida 72; Alvaro Folgueiras' go-ahead three with 4.5 seconds remaining.
- [Michigan's official 2026 title recap](https://mgoblue.com/news/2026/4/7/mens-basketball-wolverines-triumph-over-huskies-to-win-second-national-championship): Michigan 69, UConn 63; UConn shot .309 from the field; late Michigan free throws sealed the win.

These are historical games. Practice answers never write to the visitor's bracket or contest results.

## Home media

Reference: [NCAA March Madness Live](https://www.ncaa.com/march-madness-live/watch). All eleven videos are from the official March Madness YouTube channel, verified with YouTube oEmbed author metadata:

- [Florida vs. Houston, 2025 national championship extended highlights](https://www.youtube.com/watch?v=igDpFxg60qU).
- [Oakland vs. Kentucky, 2024 first-round extended highlights](https://www.youtube.com/watch?v=PwY129KC_30).
- [FDU vs. Purdue, players and fans react after the final buzzer](https://www.youtube.com/watch?v=fPN0AlPBRvA).
- [Michigan vs. UConn, 2026 championship highlights](https://www.youtube.com/watch?v=2ZLXQ62lWlQ).
- [UConn vs. Duke, 2026 Elite Eight full finish](https://www.youtube.com/watch?v=vHOJ4Gsk7oE).
- [Iowa vs. Florida, 2026 second-round highlights](https://www.youtube.com/watch?v=1RY_UbM3BeY).
- [Villanova vs. North Carolina, Kris Jenkins' 2016 title-winning shot](https://www.youtube.com/watch?v=L7FFJUz0tdo). Context from [NCAA's Villanova title history](https://www.ncaa.com/basketball-men/d1/villanova-college-basketball-championships-complete-history).
- [Michigan vs. Arizona, 2026 Final Four highlights](https://www.youtube.com/watch?v=-OmxGRrPry4).
- [Michigan vs. Tennessee, 2026 Elite Eight highlights](https://www.youtube.com/watch?v=jZXyRxUWuG4).
- [The best moments of the 2026 tournament](https://www.youtube.com/watch?v=r2gg4c0zhNY).
- [Michigan vs. Houston, final 90 seconds in 2018](https://www.youtube.com/watch?v=47W42BPvU4o).

Local video previews are in `images/moments/`, downloaded from `i.ytimg.com/vi/<video-id>/maxresdefault.jpg` or the oEmbed thumbnail when a large preview is unavailable. The Michigan headline photo comes from the [official championship recap](https://mgoblue.com/news/2026/4/7/mens-basketball-wolverines-triumph-over-huskies-to-win-second-national-championship) and is credited to Michigan Photography. The original is `mgoblue.com/images/2026/4/6/EB2_2313.jpg` on Sidearm's image service, served locally as `michigan-champions.jpg`.

The older Florida hero photo, `championship.jpg`, is retained as an unused local asset. Its source is the [Florida Athletics recap](https://floridagators.com/news/2025/4/8/mens-basketball-florida-houston-ncaa-championship-game-april-7-2025), credited to Florida Athletics / Maddie Washburn.

Video and photo ownership is credited on the page. Videos remain on the publisher's player; no video files are copied. No external request or embed exists before Play. Explicit playback creates a youtube-nocookie.com iframe, removed when the dialog closes. Playback availability is not guaranteed in mainland China; game stories and practice remain accessible without the player. Replace with publisher-authorized locally accessible video sources before a mainland launch.

`images/court.svg`, `images/trophy.svg` and the new phone-and-hand `images/your-turn.svg` are original vector drawings made for this prototype.

## Fan camp

Six historical picks, one mini bracket and three rules questions form ten learning challenges. Practice XP rewards completing a game regardless of prediction accuracy, completing the mini bracket once, and answering each rules question correctly. XP, levels and three badges are educational progress indicators with no prize value or effect on contest points. The mini bracket uses the actual 2026 Final Four teams and allows hypothetical outcomes; it never writes to the tournament results or the real draft. All progress stays in local storage, and replays never add XP.

## Leaderboard

Real entries are the browser's saved entries. Rankings appear at two entries. Simulated fans have a separate mode, never presented as real registrations. Results are always simulated in this prototype. A shared sign-up service and database remain prerequisites for public cross-device rankings.
