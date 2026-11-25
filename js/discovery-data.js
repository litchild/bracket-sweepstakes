// Curated school connections. Alumni are historical; prospect ranks are dated editorial projections.
const NBA_TEAM_AS_OF='November 25, 2026';
const NBA_RETIREMENT_SOURCE='https://www.nba.com/news/lamarcus-aldridge-retires-for-2nd-time-in-career';
const NBA_ALUMNI = [
  ['1628369','Jayson Tatum','E1',2017,3,'jayson-tatum',"Forward-Guard","6'8\" (2.03m)","Boston Celtics",'listed'],
  ['202681','Kyrie Irving','E1',2011,1,'kyrie-irving',"Guard","6'2\" (1.88m)","Dallas Mavericks",'listed'],
  ['1631094','Paolo Banchero','E1',2022,1,'paolo-banchero',"Forward","6'10\" (2.08m)","Orlando Magic",'listed'],
  ['1629627','Zion Williamson','E1',2019,1,'zion-williamson',"Forward","6'6\" (1.98m)","New Orleans Pelicans",'listed'],
  ['1627742','Brandon Ingram','E1',2016,2,'brandon-ingram',"Forward","6'8\" (2.03m)","LA Clippers",'listed'],
  ['1626164','Devin Booker','M7',2015,13,'devin-booker',"Guard","6'5\" (1.96m)","Phoenix Suns",'listed'],
  ['1628983','Shai Gilgeous-Alexander','M7',2018,11,'shai-gilgeous-alexander',"Guard","6'6\" (1.98m)","Oklahoma City Thunder",'listed'],
  ['203076','Anthony Davis','M7',2012,1,'anthony-davis',"Forward-Center","6'10\" (2.08m)","Washington Wizards",'listed'],
  ['1628389','Bam Adebayo','M7',2017,14,'bam-adebayo',"Center-Forward","6'9\" (2.06m)","Miami Heat",'listed'],
  ['1627750','Jamal Murray','M7',2016,7,'jamal-murray',"Guard","6'4\" (1.93m)","Denver Nuggets",'listed'],
  ['201142','Kevin Durant','W11',2007,2,'kevin-durant',"Forward","6'11\" (2.11m)","Houston Rockets",'listed'],
  ['1629628','RJ Barrett','E1',2019,3,'rj-barrett',"Forward-Guard","6'6\" (1.98m)","Toronto Raptors",'listed'],
  ['1641726','Dereck Lively II','E1',2023,12,'dereck-lively-ii',"Center","7'1\" (2.16m)","Dallas Mavericks",'listed'],
  ['1628976','Wendell Carter Jr.','E1',2018,7,'wendell-carter-jr',"Center-Forward","6'10\" (2.08m)","Orlando Magic",'listed'],
  ['1628960','Grayson Allen','E1',2018,21,'grayson-allen',"Guard","6'4\" (1.93m)","Charlotte Hornets",'listed'],
  ['1626157','Karl-Anthony Towns','M7',2015,1,'karl-anthony-towns',"Center-Forward","7'0\" (2.13m)","New York Knicks",'listed'],
  ['1628368','De’Aaron Fox','M7',2017,5,'deaaron-fox',"Guard","6'3\" (1.91m)","San Antonio Spurs",'listed'],
  ['1630178','Tyrese Maxey','M7',2020,21,'tyrese-maxey',"Guard","6'2\" (1.88m)","Philadelphia 76ers",'listed'],
  ['1629639','Tyler Herro','M7',2019,13,'tyler-herro',"Guard","6'5\" (1.96m)","Milwaukee Bucks",'listed'],
  ['1626167','Myles Turner','W11',2015,11,'myles-turner',"Center-Forward","6'11\" (2.11m)","Milwaukee Bucks",'listed'],
  ['1628386','Jarrett Allen','W11',2017,22,'jarrett-allen',"Center","6'9\" (2.06m)","Cleveland Cavaliers",'listed'],
  ['200746','LaMarcus Aldridge','W11',2006,2,'lamarcus-aldridge',"Center-Forward","6'11\" (2.11m)",null,'retired'],
  ['203954','Joel Embiid','E4',2014,3,'joel-embiid',"Center-Forward","7'0\" (2.13m)","Philadelphia 76ers",'listed'],
  ['203952','Andrew Wiggins','E4',2014,1,'andrew-wiggins',"Forward","6'6\" (1.98m)","Miami Heat",'listed'],
  ['1626162','Kelly Oubre Jr.','E4',2015,15,'kelly-oubre-jr',"Forward-Guard","6'7\" (2.01m)","Indiana Pacers",'listed'],
  ['1630532','Franz Wagner','M1',2021,8,'franz-wagner',"Forward","6'10\" (2.08m)","Orlando Magic",'listed'],
  ['1627747','Caris LeVert','M1',2016,20,'caris-levert',"Guard","6'7\" (2.01m)","Milwaukee Bucks",'listed'],
  ['1629673','Jordan Poole','M1',2019,28,'jordan-poole',"Guard","6'4\" (1.93m)","New Orleans Pelicans",'listed'],
  ['203083','Andre Drummond','E2',2012,9,'andre-drummond',"Center","6'10\" (2.08m)","New York Knicks",'listed'],
  ['1642270','Donovan Clingan','E2',2024,7,'donovan-clingan',"Center","7'2\" (2.18m)","Portland Trail Blazers",'listed'],
  ['1642264','Stephon Castle','E2',2024,4,'stephon-castle',"Guard","6'6\" (1.98m)","San Antonio Spurs",'listed'],
  ['1628374','Lauri Markkanen','W1',2017,7,'lauri-markkanen',"Forward-Center","7'1\" (2.16m)","Utah Jazz",'listed'],
  ['203932','Aaron Gordon','W1',2014,4,'aaron-gordon',"Forward","6'8\" (2.03m)","Denver Nuggets",'listed'],
  ['1629028','Deandre Ayton','W1',2018,1,'deandre-ayton',"Center","7'0\" (2.13m)","Washington Wizards",'listed'],
  ['201566','Russell Westbrook','E7',2008,4,'russell-westbrook',"Guard","6'4\" (1.93m)","Sacramento Kings",'listed'],
  ['203897','Zach LaVine','E7',2014,13,'zach-lavine',"Guard","6'5\" (1.96m)","Sacramento Kings",'listed'],
  ['201950','Jrue Holiday','E7',2009,17,'jrue-holiday',"Guard","6'4\" (1.93m)","Portland Trail Blazers",'listed'],
  ['1627734','Domantas Sabonis','W3',2016,11,'domantas-sabonis',"Forward-Center","6'10\" (2.08m)","Sacramento Kings",'listed'],
  ['1629060','Rui Hachimura','W3',2019,9,'rui-hachimura',"Forward","6'8\" (2.03m)","LA Clippers",'listed'],
  ['1630591','Jalen Suggs','W3',2021,5,'jalen-suggs',"Guard","6'5\" (1.96m)","Orlando Magic",'listed'],
  ['1631093','Jaden Ivey','W2',2022,5,'jaden-ivey',"Guard","6'3\" (1.91m)",null,'unlisted'],
  ['1641744','Zach Edey','W2',2024,9,'zach-edey',"Center","7'4\" (2.24m)","Memphis Grizzlies",'listed'],
  ['1628973','Jalen Brunson','W8',2018,33,'jalen-brunson',"Guard","6'2\" (1.88m)","New York Knicks",'listed'],
  ['1628969','Mikal Bridges','W8',2018,10,'mikal-bridges',"Guard-Forward","6'6\" (1.98m)","New York Knicks",'listed'],
  ['1628404','Josh Hart','W8',2017,30,'josh-hart',"Guard","6'5\" (1.96m)","New York Knicks",'listed'],
  ['203110','Draymond Green','E3',2012,35,'draymond-green',"Forward-Center","6'6\" (1.98m)","Golden State Warriors",'listed'],
  ['1628991','Jaren Jackson Jr.','E3',2018,4,'jaren-jackson-jr',"Forward-Center","6'10\" (2.08m)","Utah Jazz",'listed'],
  ['1629632','Coby White','S6',2019,7,'coby-white',"Guard","6'5\" (1.96m)","Charlotte Hornets",'listed'],
  ['1629661','Cameron Johnson','S6',2019,11,'cameron-johnson',"Forward","6'8\" (2.03m)","Denver Nuggets",'listed'],
  ['203084','Harrison Barnes','S6',2012,7,'harrison-barnes',"Forward","6'7\" (2.01m)","San Antonio Spurs",'listed'],
  ['1628378','Donovan Mitchell','E6',2017,13,'donovan-mitchell',"Guard","6'2\" (1.88m)","Cleveland Cavaliers",'listed'],
  ['1626179','Terry Rozier','E6',2015,16,'terry-rozier',"Guard","6'1\" (1.85m)","Miami Heat",'listed'],
  ['1631099','Keegan Murray','S9',2022,4,'keegan-murray',"Forward","6'8\" (2.03m)","Sacramento Kings",'listed'],
  ['1631200','Kris Murray','S9',2023,23,'kris-murray',"Forward","6'8\" (2.03m)","Memphis Grizzlies",'listed'],
  ['1630169','Tyrese Haliburton','M2',2020,12,'tyrese-haliburton',"Guard","6'5\" (1.96m)","Indiana Pacers",'listed'],
  ['1628420','Monte Morris','M2',2017,51,'monte-morris',"Guard","6'2\" (1.88m)",null,'unlisted'],
  ['201143','Al Horford','S1',2007,3,'al-horford',"Center","6'8\" (2.03m)","Golden State Warriors",'listed'],
  ['203078','Bradley Beal','S1',2012,3,'bradley-beal',"Guard","6'4\" (1.93m)","LA Clippers",'listed'],
  ['1641706','Brandon Miller','M4',2023,2,'brandon-miller',"Forward","6'7\" (2.01m)","Charlotte Hornets",'listed'],
  ['1630529','Herbert Jones','M4',2021,35,'herbert-jones',"Forward","6'7\" (2.01m)","New Orleans Pelicans",'listed'],
  ['1629656','Quentin Grimes','S2',2021,25,'quentin-grimes',"Guard","6'4\" (1.93m)","Los Angeles Lakers",'listed'],
  ['1631204','Marcus Sasser','S2',2023,25,'marcus-sasser',"Guard","6'2\" (1.88m)","Dallas Mavericks",'listed'],
  // Added November 25, 2026 from NBA.com bios. Retired legends cite their NBA.com profile (inactive, final season listed);
  // inactive players without a retirement report show "No NBA team listed".
  ['893','Michael Jordan','S6',1984,3,'michael-jordan',"Guard","6'6\" (1.98m)",null,'retired','https://www.nba.com/player/893/michael-jordan'],
  ['77142','Magic Johnson','E3',1979,1,'magic-johnson',"Forward-Guard","6'9\" (2.06m)",null,'retired','https://www.nba.com/player/77142/magic-johnson'],
  ['165','Hakeem Olajuwon','S2',1984,1,'hakeem-olajuwon',"Center","7'0\" (2.13m)",null,'retired','https://www.nba.com/player/165/hakeem-olajuwon'],
  ['1630162','Anthony Edwards','M8',2020,1,'anthony-edwards',"Guard","6'4\" (1.93m)","Minnesota Timberwolves",'listed'],
  ['202690','Jimmer Fredette','W6',2011,10,'jimmer-fredette',"Guard","6'2\" (1.88m)",null,'unlisted'],
  ['201144','Mike Conley','E8',2007,4,'mike-conley',"Guard","6'0\" (1.83m)","Boston Celtics",'listed'],
  ['203114','Khris Middleton','S10',2012,39,'khris-middleton',"Forward","6'7\" (2.01m)","Washington Wizards",'listed'],
  ['1629631','De’Andre Hunter','M3',2019,4,'deandre-hunter',"Forward-Guard","6'7\" (2.01m)","Sacramento Kings",'listed'],
  ['201988','Patty Mills','S7',2009,55,'patty-mills',"Guard","6'2\" (1.88m)",null,'unlisted']
].map(([id,name,team,year,pick,slug,position,height,nbaTeam,nbaStatus,statusSource])=>({id,name,team,year,pick,position,height,nbaTeam,nbaStatus,nbaSource:statusSource||(nbaStatus==='retired'?NBA_RETIREMENT_SOURCE:`https://www.nba.com/player/${id}/${slug}`),photo:`images/alumni/${id}.png`,source:`https://www.nba.com/player/${id}/${slug}`}));
// Editorial recognition order for Chinese NBA fans (our judgment): browse order, star picker and game-card hints.
const STAR_ORDER = ['893','201142','202681','1628369','203076','1628983','1626164','203954','201566','1629627','77142','165','1630162','1628973','1626157','203110','1628378','1630169','1629060','202690','201144','203114','201950','203897','1628368','1630178','1627750','1628389','1631094','1627742','203952','200746','201143','203078','1627734','1628374','203932','1629028','1628969','1628404','1629639','1630532','1628991','1631093','1641744','1642264','201988','1629631'];
const fameRank = id => { const i = STAR_ORDER.indexOf(id); return i < 0 ? STAR_ORDER.length : i; };
NBA_ALUMNI.sort((a, b) => fameRank(a.id) - fameRank(b.id));
// Twelve stars for the bracket's "NBA stars" auto-fill: recognizable names across different schools.
const STAR_PICKS = ['893','201142','202681','1628369','203076','1628983','203954','201566','1630162','77142','165','202690'];
// 2027 lottery watch: ESPN's top 14 (Jeremy Woo big board, November 5, 2026). Board ranks, not a mock draft.
// team is the school's id in the 2026 demo field, or null for players outside college basketball.
const DRAFT_SOURCE='https://abc11.com/post/2027-nba-draft-big-board-rankings-top-100-prospects/20017483/';
const DRAFT_WATCH = [
  [1,'Tyran Stokes','SF/PG','Kansas','Freshman','E4'],[2,'Stefan Joksimovic','PG','Baskonia','Pro club in Spain',null],
  [3,'Bruce Branch III','SG/SF','BYU','Freshman','W6'],[4,'Jordan Smith Jr.','SG/PG','Arkansas','Freshman','W4'],
  [5,'Caleb Holt','SG/PG','Arizona','Freshman','W1'],[6,'Quentin Coleman','SG/PG','Illinois','Freshman','S3'],
  [7,'Motiejus Krivas','C','Arizona','Senior','W1'],[8,'Braylon Mullins','SG','UConn','Sophomore','E2'],
  [9,'Thomas Haugh','SF/PF','Florida','Senior','S1'],[10,'Patrick Ngongba II','C','Duke','Junior','E1'],
  [11,'Ivan Kharchenkov','SF','Arizona','Sophomore','W1'],[12,'Obinna Ekezie Jr.','C','Louisville','Freshman','E6'],
  [13,'Austin Goosby','SG/PG','Texas','Freshman','W11'],[14,'Malachi Moreno','C','Kentucky','Sophomore','M7']
].map(([rank,name,position,club,level,team])=>({rank,name,position,club,level,team,year:2027,asOf:'November 5, 2026',source:DRAFT_SOURCE}));
// 2026 first round: picks whose college was in the 2026 field (Basketball Reference). Team runs come from js/history-data.js.
const DRAFT_2026_SOURCE='https://www.basketball-reference.com/draft/NBA_2026.html';
const FIRST_ROUND_2026 = [
  [1,'AJ Dybantsa','W6'],[2,'Darryn Peterson','E4'],[3,'Cameron Boozer','E1'],[4,'Caleb Wilson','S6'],[5,'Keaton Wagler','S3'],
  [6,'Mikel Brown Jr.','E6'],[7,'Darius Acuff Jr.','W4'],[8,'Kingston Flemings','S2'],[9,'Morez Johnson Jr.','M1'],[10,'Brayden Burries','W1'],
  [11,'Yaxel Lendeborg','M1'],[12,'Aday Mara','M1'],[13,'Nate Ament','M6'],[15,'Dailyn Swain','W11'],[16,'Bennett Stirtz','S9'],
  [18,'Christian Anderson Jr.','M5'],[19,'Allen Graves','M10'],[20,'Jayden Quaintance','M7'],[22,'Labaron Philon Jr.','M4'],[23,'Zuby Ejiofor','E5'],
  [26,'Tarris Reed Jr.','E2'],[27,'Chris Cenac Jr.','S2'],[28,'Joshua Jefferson','M2'],[29,'Alex Karaban','E2'],[30,'Koa Peat','W1']
].map(([pick,name,team])=>({pick,name,team,year:2026,source:DRAFT_2026_SOURCE}));
function nbaTeamLabel(player) { return player.nbaStatus==='retired'?'Retired':player.nbaTeam||'No NBA team listed'; }
function schoolConnections(team) { return {alumni:NBA_ALUMNI.filter(p=>p.team===team),prospects:DRAFT_WATCH.filter(p=>p.team===team)}; }
function alumniHint(team, n = 2) { return NBA_ALUMNI.filter(p => p.team === team).slice(0, n).map(p => p.name); }
function filterConnections(players,schools,school='all',query='') {
  const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const needle=normalize(query),aliases={E2:'Connecticut UConn',S6:'UNC North Carolina',E3:'MSU Michigan State'};
  return players.filter(p=>(school==='all'||p.team===school)&&normalize(p.name+' '+(schools[p.team]?.name||p.club||'')+' '+(p.nbaTeam||'')+' '+(aliases[p.team]||'')).includes(needle));
}
if(typeof module!=='undefined'&&module.exports)module.exports={NBA_ALUMNI,DRAFT_WATCH,FIRST_ROUND_2026,STAR_ORDER,STAR_PICKS,NBA_TEAM_AS_OF,nbaTeamLabel,schoolConnections,alumniHint,filterConnections};
