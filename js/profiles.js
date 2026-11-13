// Archived ESPN team snapshots. Records are wins-losses as supplied by the season endpoints, not live standings.
// Source details: docs/team-sources.md. School logos are stored locally.
const TEAM_PROFILES = {
  "E1": {
    "espnId": "150",
    "fullName": "Duke Blue Devils",
    "nickname": "Blue Devils",
    "previous": "31-3",
    "recent": "32-2",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/150/duke-blue-devils",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png"
  },
  "E16": {
    "espnId": "2561",
    "fullName": "Siena Saints",
    "nickname": "Saints",
    "previous": "14-18",
    "recent": "23-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2561/siena-saints",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2561.png"
  },
  "E8": {
    "espnId": "194",
    "fullName": "Ohio State Buckeyes",
    "nickname": "Buckeyes",
    "previous": "17-15",
    "recent": "21-12",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/194/ohio-state-buckeyes",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/194.png"
  },
  "E9": {
    "espnId": "2628",
    "fullName": "TCU Horned Frogs",
    "nickname": "Horned Frogs",
    "previous": "16-16",
    "recent": "22-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2628/tcu-horned-frogs",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png"
  },
  "E5": {
    "espnId": "2599",
    "fullName": "St. John's Red Storm",
    "nickname": "Red Storm",
    "previous": "30-4",
    "recent": "28-6",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2599/st-johns-red-storm",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2599.png"
  },
  "E12": {
    "espnId": "2460",
    "fullName": "Northern Iowa Panthers",
    "nickname": "Panthers",
    "previous": "20-12",
    "recent": "23-12",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2460/northern-iowa-panthers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2460.png"
  },
  "E4": {
    "espnId": "2305",
    "fullName": "Kansas Jayhawks",
    "nickname": "Jayhawks",
    "previous": "21-12",
    "recent": "23-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2305/kansas-jayhawks",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png"
  },
  "E13": {
    "espnId": "2856",
    "fullName": "California Baptist Lancers",
    "nickname": "Lancers",
    "previous": "17-15",
    "recent": "25-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2856/california-baptist-lancers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2856.png"
  },
  "E6": {
    "espnId": "97",
    "fullName": "Louisville Cardinals",
    "nickname": "Cardinals",
    "previous": "27-7",
    "recent": "23-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/97/louisville-cardinals",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/97.png"
  },
  "E11": {
    "espnId": "58",
    "fullName": "South Florida Bulls",
    "nickname": "Bulls",
    "previous": "13-19",
    "recent": "25-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/58/south-florida-bulls",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/58.png"
  },
  "E3": {
    "espnId": "127",
    "fullName": "Michigan State Spartans",
    "nickname": "Spartans",
    "previous": "27-6",
    "recent": "25-7",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/127/michigan-state-spartans",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/127.png"
  },
  "E14": {
    "espnId": "2449",
    "fullName": "North Dakota State Bison",
    "nickname": "Bison",
    "previous": "21-11",
    "recent": "27-7",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2449/north-dakota-state-bison",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2449.png"
  },
  "E7": {
    "espnId": "26",
    "fullName": "UCLA Bruins",
    "nickname": "Bruins",
    "previous": "22-10",
    "recent": "23-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/26/ucla-bruins",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/26.png"
  },
  "E10": {
    "espnId": "2116",
    "fullName": "UCF Knights",
    "nickname": "Knights",
    "previous": "17-16",
    "recent": "21-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2116/ucf-knights",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png"
  },
  "E2": {
    "espnId": "41",
    "fullName": "UConn Huskies",
    "nickname": "Huskies",
    "previous": "23-10",
    "recent": "29-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/41/uconn-huskies",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/41.png"
  },
  "E15": {
    "espnId": "231",
    "fullName": "Furman Paladins",
    "nickname": "Paladins",
    "previous": "25-9",
    "recent": "22-12",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/231/furman-paladins",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/231.png"
  },
  "W1": {
    "espnId": "12",
    "fullName": "Arizona Wildcats",
    "nickname": "Wildcats",
    "previous": "22-12",
    "recent": "32-2",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/12/arizona-wildcats",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/12.png"
  },
  "W16": {
    "espnId": "112358",
    "fullName": "Long Island University Sharks",
    "nickname": "Sharks",
    "previous": "17-16",
    "recent": "24-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/112358/long-island-university-sharks",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/112358.png"
  },
  "W8": {
    "espnId": "222",
    "fullName": "Villanova Wildcats",
    "nickname": "Wildcats",
    "previous": "19-14",
    "recent": "24-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/222/villanova-wildcats",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/222.png"
  },
  "W9": {
    "espnId": "328",
    "fullName": "Utah State Aggies",
    "nickname": "Aggies",
    "previous": "26-7",
    "recent": "28-6",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/328/utah-state-aggies",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/328.png"
  },
  "W5": {
    "espnId": "275",
    "fullName": "Wisconsin Badgers",
    "nickname": "Badgers",
    "previous": "26-9",
    "recent": "24-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/275/wisconsin-badgers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/275.png"
  },
  "W12": {
    "espnId": "2272",
    "fullName": "High Point Panthers",
    "nickname": "Panthers",
    "previous": "29-5",
    "recent": "30-4",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2272/high-point-panthers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2272.png"
  },
  "W4": {
    "espnId": "8",
    "fullName": "Arkansas Razorbacks",
    "nickname": "Razorbacks",
    "previous": "20-13",
    "recent": "26-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/8/arkansas-razorbacks",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/8.png"
  },
  "W13": {
    "espnId": "62",
    "fullName": "Hawai'i Rainbow Warriors",
    "nickname": "Rainbow Warriors",
    "previous": "15-16",
    "recent": "24-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/62/hawaii-rainbow-warriors",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/62.png"
  },
  "W6": {
    "espnId": "252",
    "fullName": "BYU Cougars",
    "nickname": "Cougars",
    "previous": "24-9",
    "recent": "23-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/252/byu-cougars",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/252.png"
  },
  "W11": {
    "espnId": "251",
    "fullName": "Texas Longhorns",
    "nickname": "Longhorns",
    "previous": "19-15",
    "recent": "18-14",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/251/texas-longhorns",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png"
  },
  "W3": {
    "espnId": "2250",
    "fullName": "Gonzaga Bulldogs",
    "nickname": "Bulldogs",
    "previous": "25-8",
    "recent": "30-3",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2250/gonzaga-bulldogs",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2250.png"
  },
  "W14": {
    "espnId": "338",
    "fullName": "Kennesaw State Owls",
    "nickname": "Owls",
    "previous": "19-14",
    "recent": "21-13",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/338/kennesaw-state-owls",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/338.png"
  },
  "W7": {
    "espnId": "2390",
    "fullName": "Miami Hurricanes",
    "nickname": "Hurricanes",
    "previous": "7-24",
    "recent": "25-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2390/miami-hurricanes",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png"
  },
  "W10": {
    "espnId": "142",
    "fullName": "Missouri Tigers",
    "nickname": "Tigers",
    "previous": "22-11",
    "recent": "20-12",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/142/missouri-tigers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/142.png"
  },
  "W2": {
    "espnId": "2509",
    "fullName": "Purdue Boilermakers",
    "nickname": "Boilermakers",
    "previous": "22-11",
    "recent": "27-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2509/purdue-boilermakers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2509.png"
  },
  "W15": {
    "espnId": "2511",
    "fullName": "Queens University Royals",
    "nickname": "Royals",
    "previous": "19-14",
    "recent": "21-13",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2511/queens-university-royals",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2511.png"
  },
  "S1": {
    "espnId": "57",
    "fullName": "Florida Gators",
    "nickname": "Gators",
    "previous": "30-4",
    "recent": "26-7",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/57/florida-gators",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/57.png"
  },
  "S16": {
    "espnId": "2504",
    "fullName": "Prairie View A&M Panthers",
    "nickname": "Panthers",
    "previous": "5-27",
    "recent": "18-17",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2504/prairie-view-am-panthers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2504.png"
  },
  "S8": {
    "espnId": "228",
    "fullName": "Clemson Tigers",
    "nickname": "Tigers",
    "previous": "27-6",
    "recent": "24-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/228/clemson-tigers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/228.png"
  },
  "S9": {
    "espnId": "2294",
    "fullName": "Iowa Hawkeyes",
    "nickname": "Hawkeyes",
    "previous": "17-16",
    "recent": "21-12",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2294/iowa-hawkeyes",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png"
  },
  "S5": {
    "espnId": "238",
    "fullName": "Vanderbilt Commodores",
    "nickname": "Commodores",
    "previous": "20-12",
    "recent": "26-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/238/vanderbilt-commodores",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/238.png"
  },
  "S12": {
    "espnId": "2377",
    "fullName": "McNeese Cowboys",
    "nickname": "Cowboys",
    "previous": "27-6",
    "recent": "28-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2377/mcneese-cowboys",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2377.png"
  },
  "S4": {
    "espnId": "158",
    "fullName": "Nebraska Cornhuskers",
    "nickname": "Cornhuskers",
    "previous": "17-14",
    "recent": "26-6",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/158/nebraska-cornhuskers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/158.png"
  },
  "S13": {
    "espnId": "2653",
    "fullName": "Troy Trojans",
    "nickname": "Trojans",
    "previous": "23-10",
    "recent": "22-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2653/troy-trojans",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2653.png"
  },
  "S6": {
    "espnId": "153",
    "fullName": "North Carolina Tar Heels",
    "nickname": "Tar Heels",
    "previous": "22-13",
    "recent": "24-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/153/north-carolina-tar-heels",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/153.png"
  },
  "S11": {
    "espnId": "2670",
    "fullName": "VCU Rams",
    "nickname": "Rams",
    "previous": "28-6",
    "recent": "27-7",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2670/vcu-rams",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2670.png"
  },
  "S3": {
    "espnId": "356",
    "fullName": "Illinois Fighting Illini",
    "nickname": "Fighting Illini",
    "previous": "21-12",
    "recent": "24-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/356/illinois-fighting-illini",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/356.png"
  },
  "S14": {
    "espnId": "219",
    "fullName": "Pennsylvania Quakers",
    "nickname": "Quakers",
    "previous": "8-19",
    "recent": "18-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/219/pennsylvania-quakers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/219.png"
  },
  "S7": {
    "espnId": "2608",
    "fullName": "Saint Mary's Gaels",
    "nickname": "Gaels",
    "previous": "28-5",
    "recent": "27-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2608/saint-marys-gaels",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2608.png"
  },
  "S10": {
    "espnId": "245",
    "fullName": "Texas A&M Aggies",
    "nickname": "Aggies",
    "previous": "22-10",
    "recent": "21-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/245/texas-am-aggies",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/245.png"
  },
  "S2": {
    "espnId": "248",
    "fullName": "Houston Cougars",
    "nickname": "Cougars",
    "previous": "30-4",
    "recent": "28-6",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/248/houston-cougars",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/248.png"
  },
  "S15": {
    "espnId": "70",
    "fullName": "Idaho Vandals",
    "nickname": "Vandals",
    "previous": "14-19",
    "recent": "21-14",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/70/idaho-vandals",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/70.png"
  },
  "M1": {
    "espnId": "130",
    "fullName": "Michigan Wolverines",
    "nickname": "Wolverines",
    "previous": "25-9",
    "recent": "31-3",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/130/michigan-wolverines",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/130.png"
  },
  "M16": {
    "espnId": "47",
    "fullName": "Howard Bison",
    "nickname": "Bison",
    "previous": "12-20",
    "recent": "23-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/47/howard-bison",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/47.png"
  },
  "M8": {
    "espnId": "61",
    "fullName": "Georgia Bulldogs",
    "nickname": "Bulldogs",
    "previous": "20-12",
    "recent": "22-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/61/georgia-bulldogs",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png"
  },
  "M9": {
    "espnId": "139",
    "fullName": "Saint Louis Billikens",
    "nickname": "Billikens",
    "previous": "19-14",
    "recent": "28-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/139/saint-louis-billikens",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/139.png"
  },
  "M5": {
    "espnId": "2641",
    "fullName": "Texas Tech Red Raiders",
    "nickname": "Red Raiders",
    "previous": "25-8",
    "recent": "22-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2641/texas-tech-red-raiders",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png"
  },
  "M12": {
    "espnId": "2006",
    "fullName": "Akron Zips",
    "nickname": "Zips",
    "previous": "28-6",
    "recent": "29-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2006/akron-zips",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2006.png"
  },
  "M4": {
    "espnId": "333",
    "fullName": "Alabama Crimson Tide",
    "nickname": "Crimson Tide",
    "previous": "25-8",
    "recent": "23-9",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/333/alabama-crimson-tide",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png"
  },
  "M13": {
    "espnId": "2275",
    "fullName": "Hofstra Pride",
    "nickname": "Pride",
    "previous": "15-18",
    "recent": "24-10",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2275/hofstra-pride",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2275.png"
  },
  "M6": {
    "espnId": "2633",
    "fullName": "Tennessee Volunteers",
    "nickname": "Volunteers",
    "previous": "27-7",
    "recent": "22-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2633/tennessee-volunteers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png"
  },
  "M11": {
    "espnId": "193",
    "fullName": "Miami (OH) RedHawks",
    "nickname": "RedHawks",
    "previous": "25-9",
    "recent": "31-1",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/193/miami-oh-redhawks",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/193.png"
  },
  "M3": {
    "espnId": "258",
    "fullName": "Virginia Cavaliers",
    "nickname": "Cavaliers",
    "previous": "15-17",
    "recent": "29-5",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/258/virginia-cavaliers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/258.png"
  },
  "M14": {
    "espnId": "2750",
    "fullName": "Wright State Raiders",
    "nickname": "Raiders",
    "previous": "15-18",
    "recent": "23-11",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2750/wright-state-raiders",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2750.png"
  },
  "M7": {
    "espnId": "96",
    "fullName": "Kentucky Wildcats",
    "nickname": "Wildcats",
    "previous": "22-11",
    "recent": "21-13",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/96/kentucky-wildcats",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/96.png"
  },
  "M10": {
    "espnId": "2541",
    "fullName": "Santa Clara Broncos",
    "nickname": "Broncos",
    "previous": "20-12",
    "recent": "26-8",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2541/santa-clara-broncos",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2541.png"
  },
  "M2": {
    "espnId": "66",
    "fullName": "Iowa State Cyclones",
    "nickname": "Cyclones",
    "previous": "24-9",
    "recent": "27-7",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/66/iowa-state-cyclones",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/66.png"
  },
  "M15": {
    "espnId": "2634",
    "fullName": "Tennessee State Tigers",
    "nickname": "Tigers",
    "previous": "17-16",
    "recent": "23-9",
    "url": "https://www.espn.com/mens-college-basketball/team/_/id/2634/tennessee-state-tigers",
    "logoSource": "https://a.espncdn.com/i/teamlogos/ncaa/500/2634.png"
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = TEAM_PROFILES;

