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
  ['1631204','Marcus Sasser','S2',2023,25,'marcus-sasser',"Guard","6'2\" (1.88m)","Dallas Mavericks",'listed']
].map(([id,name,team,year,pick,slug,position,height,nbaTeam,nbaStatus])=>({id,name,team,year,pick,position,height,nbaTeam,nbaStatus,nbaSource:nbaStatus==='retired'?NBA_RETIREMENT_SOURCE:`https://www.nba.com/player/${id}/${slug}`,photo:`images/alumni/${id}.png`,source:`https://www.nba.com/player/${id}/${slug}`}));
const DRAFT_SOURCE='https://abc11.com/post/2027-nba-draft-big-board-rankings-top-100-prospects/20017483/';
const DRAFT_WATCH = [
  ['Tyran Stokes','E4',1],['Bruce Branch III','W6',3],['Jordan Smith Jr.','W4',4],
  ['Caleb Holt','W1',5],['Quentin Coleman','S3',6],['Motiejus Krivas','W1',7],
  ['Patrick Ngongba II','E1',10],['Austin Goosby','W11',13],['Malachi Moreno','M7',14]
].map(([name,team,rank])=>({name,team,rank,year:2027,asOf:'November 5, 2026',source:DRAFT_SOURCE}));
function nbaTeamLabel(player) { return player.nbaStatus==='retired'?'Retired':player.nbaTeam||'No NBA team listed'; }
function schoolConnections(team) { return {alumni:NBA_ALUMNI.filter(p=>p.team===team),prospects:DRAFT_WATCH.filter(p=>p.team===team)}; }
function filterConnections(players,schools,school='all',query='') {
  const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const needle=normalize(query),aliases={E2:'Connecticut UConn',S6:'UNC North Carolina',E3:'MSU Michigan State'};
  return players.filter(p=>(school==='all'||p.team===school)&&normalize(p.name+' '+schools[p.team].name+' '+(p.nbaTeam||'')+' '+(aliases[p.team]||'')).includes(needle));
}
if(typeof module!=='undefined'&&module.exports)module.exports={NBA_ALUMNI,DRAFT_WATCH,NBA_TEAM_AS_OF,nbaTeamLabel,schoolConnections,filterConnections};
