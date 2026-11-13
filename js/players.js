// Official 2026-27 roster profiles, verified November 13, 2026.
// Snapshot stats always carry their original season and competition. See docs/team-sources.md.
const PLAYER_PROFILES = {
  W2: {
    name: 'Sinan Huan', number: '33', position: 'Center', height: '2.16 m', year: 'Freshman', hometown: 'Beijing, China',
    photo: 'images/players/W2.jpg', color: '#a58a4d',
    story: 'From Beijing to Purdue, via Georgetown Prep. Represented China at the 2025 U19 World Cup.',
    statLabel: '2025 FIBA U19 World Cup', stats: [['11.3','Points / game'],['5.0','Blocks / game']],
    source: 'https://purduesports.com/sports/mens-basketball/roster/player/sinan-huan',
    credit: 'Chris Lyons / Purdue Athletics'
  },
  E6: {
    name: 'Zhang Boyuan', number: '6', position: 'Forward', height: '2.06 m', year: 'Freshman', hometown: 'Changchun, China',
    photo: 'images/players/E6.jpg', color: '#b7192c',
    story: 'Played for China at the U17 and U19 World Cups. Joins Louisville from Veritas Academy in California.',
    statLabel: '2025 FIBA U19 World Cup', stats: [['14.7','Points / game'],['5.1','Rebounds / game']],
    source: 'https://gocards.com/sports/mens-basketball/roster/boyuan-zhang/18082',
    credit: 'Louisville Athletics'
  },
  W13: {
    name: 'Houran Dan', number: '6', position: 'Center', height: '2.08 m', year: 'Junior', hometown: 'Neimenggu, China',
    photo: 'images/players/W13.jpg', color: '#175c4d',
    story: 'A former Chinese high-school national champion. Joins Hawaii after two seasons at Seattle.',
    statLabel: '2025–26 at Seattle', stats: [['5.7','Points / game'],['2.5','Rebounds / game']],
    source: 'https://hawaiiathletics.com/sports/mens-basketball/roster/houran-dan/22718',
    credit: 'Hawaii Athletics'
  },
  W16: {
    name: 'Xinyi Li', number: '34', position: 'Forward', height: '2.06 m', year: 'Senior', hometown: 'Beijing, China',
    photo: 'images/players/W16.jpg', color: '#347aa6',
    story: 'A Beijing native who began his college career at Manhattan. Now a senior with the LIU Sharks.',
    statLabel: '2024–25 at LIU', stats: [['2.4','Points / game'],['1.1','Rebounds / game']],
    source: 'https://www.liuathletics.com/sports/mens-basketball/roster/xinyi-li/7579',
    credit: 'LIU Athletics · 2025–26 portrait'
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_PROFILES;
