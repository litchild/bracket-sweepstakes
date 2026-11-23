// Curated school connections. Alumni are historical; prospect ranks are dated editorial projections.
const NBA_ALUMNI = [
  ['1628369','Jayson Tatum','E1',2017,3,'jayson-tatum',"Forward-Guard","6'8\" (2.03m)"],
  ['202681','Kyrie Irving','E1',2011,1,'kyrie-irving',"Guard","6'2\" (1.88m)"],
  ['1631094','Paolo Banchero','E1',2022,1,'paolo-banchero',"Forward","6'10\" (2.08m)"],
  ['1629627','Zion Williamson','E1',2019,1,'zion-williamson',"Forward","6'6\" (1.98m)"],
  ['1627742','Brandon Ingram','E1',2016,2,'brandon-ingram',"Forward","6'8\" (2.03m)"],
  ['1626164','Devin Booker','M7',2015,13,'devin-booker',"Guard","6'5\" (1.96m)"],
  ['1628983','Shai Gilgeous-Alexander','M7',2018,11,'shai-gilgeous-alexander',"Guard","6'6\" (1.98m)"],
  ['203076','Anthony Davis','M7',2012,1,'anthony-davis',"Forward-Center","6'10\" (2.08m)"],
  ['1628389','Bam Adebayo','M7',2017,14,'bam-adebayo',"Center-Forward","6'9\" (2.06m)"],
  ['1627750','Jamal Murray','M7',2016,7,'jamal-murray',"Guard","6'4\" (1.93m)"],
  ['201142','Kevin Durant','W11',2007,2,'kevin-durant',"Forward","6'11\" (2.11m)"],
  ['1629628','RJ Barrett','E1',2019,3,'rj-barrett',"Forward-Guard","6'6\" (1.98m)"],
  ['1641726','Dereck Lively II','E1',2023,12,'dereck-lively-ii',"Center","7'1\" (2.16m)"],
  ['1628976','Wendell Carter Jr.','E1',2018,7,'wendell-carter-jr',"Center-Forward","6'10\" (2.08m)"],
  ['1628960','Grayson Allen','E1',2018,21,'grayson-allen',"Guard","6'4\" (1.93m)"],
  ['1626157','Karl-Anthony Towns','M7',2015,1,'karl-anthony-towns',"Center-Forward","7'0\" (2.13m)"],
  ['1628368','De’Aaron Fox','M7',2017,5,'deaaron-fox',"Guard","6'3\" (1.91m)"],
  ['1630178','Tyrese Maxey','M7',2020,21,'tyrese-maxey',"Guard","6'2\" (1.88m)"],
  ['1629639','Tyler Herro','M7',2019,13,'tyler-herro',"Guard","6'5\" (1.96m)"],
  ['1626167','Myles Turner','W11',2015,11,'myles-turner',"Center-Forward","6'11\" (2.11m)"],
  ['1628386','Jarrett Allen','W11',2017,22,'jarrett-allen',"Center","6'9\" (2.06m)"],
  ['200746','LaMarcus Aldridge','W11',2006,2,'lamarcus-aldridge',"Center-Forward","6'11\" (2.11m)"],
  ['203954','Joel Embiid','E4',2014,3,'joel-embiid',"Center-Forward","7'0\" (2.13m)"],
  ['203952','Andrew Wiggins','E4',2014,1,'andrew-wiggins',"Forward","6'6\" (1.98m)"],
  ['1626162','Kelly Oubre Jr.','E4',2015,15,'kelly-oubre-jr',"Forward-Guard","6'7\" (2.01m)"],
  ['1630532','Franz Wagner','M1',2021,8,'franz-wagner',"Forward","6'10\" (2.08m)"],
  ['1627747','Caris LeVert','M1',2016,20,'caris-levert',"Guard","6'7\" (2.01m)"],
  ['1629673','Jordan Poole','M1',2019,28,'jordan-poole',"Guard","6'4\" (1.93m)"],
  ['203083','Andre Drummond','E2',2012,9,'andre-drummond',"Center","6'10\" (2.08m)"],
  ['1642270','Donovan Clingan','E2',2024,7,'donovan-clingan',"Center","7'2\" (2.18m)"],
  ['1642264','Stephon Castle','E2',2024,4,'stephon-castle',"Guard","6'6\" (1.98m)"],
  ['1628374','Lauri Markkanen','W1',2017,7,'lauri-markkanen',"Forward-Center","7'1\" (2.16m)"],
  ['203932','Aaron Gordon','W1',2014,4,'aaron-gordon',"Forward","6'8\" (2.03m)"],
  ['1629028','Deandre Ayton','W1',2018,1,'deandre-ayton',"Center","7'0\" (2.13m)"],
  ['201566','Russell Westbrook','E7',2008,4,'russell-westbrook',"Guard","6'4\" (1.93m)"],
  ['203897','Zach LaVine','E7',2014,13,'zach-lavine',"Guard","6'5\" (1.96m)"],
  ['201950','Jrue Holiday','E7',2009,17,'jrue-holiday',"Guard","6'4\" (1.93m)"],
  ['1627734','Domantas Sabonis','W3',2016,11,'domantas-sabonis',"Forward-Center","6'10\" (2.08m)"],
  ['1629060','Rui Hachimura','W3',2019,9,'rui-hachimura',"Forward","6'8\" (2.03m)"],
  ['1630591','Jalen Suggs','W3',2021,5,'jalen-suggs',"Guard","6'5\" (1.96m)"],
  ['1631093','Jaden Ivey','W2',2022,5,'jaden-ivey',"Guard","6'3\" (1.91m)"],
  ['1641744','Zach Edey','W2',2024,9,'zach-edey',"Center","7'4\" (2.24m)"],
  ['1628973','Jalen Brunson','W8',2018,33,'jalen-brunson',"Guard","6'2\" (1.88m)"],
  ['1628969','Mikal Bridges','W8',2018,10,'mikal-bridges',"Guard-Forward","6'6\" (1.98m)"],
  ['1628404','Josh Hart','W8',2017,30,'josh-hart',"Guard","6'5\" (1.96m)"],
  ['203110','Draymond Green','E3',2012,35,'draymond-green',"Forward-Center","6'6\" (1.98m)"],
  ['1628991','Jaren Jackson Jr.','E3',2018,4,'jaren-jackson-jr',"Forward-Center","6'10\" (2.08m)"],
  ['1629632','Coby White','S6',2019,7,'coby-white',"Guard","6'5\" (1.96m)"],
  ['1629661','Cameron Johnson','S6',2019,11,'cameron-johnson',"Forward","6'8\" (2.03m)"],
  ['203084','Harrison Barnes','S6',2012,7,'harrison-barnes',"Forward","6'7\" (2.01m)"],
  ['1628378','Donovan Mitchell','E6',2017,13,'donovan-mitchell',"Guard","6'2\" (1.88m)"],
  ['1626179','Terry Rozier','E6',2015,16,'terry-rozier',"Guard","6'1\" (1.85m)"],
  ['1631099','Keegan Murray','S9',2022,4,'keegan-murray',"Forward","6'8\" (2.03m)"],
  ['1631200','Kris Murray','S9',2023,23,'kris-murray',"Forward","6'8\" (2.03m)"],
  ['1630169','Tyrese Haliburton','M2',2020,12,'tyrese-haliburton',"Guard","6'5\" (1.96m)"],
  ['1628420','Monte Morris','M2',2017,51,'monte-morris',"Guard","6'2\" (1.88m)"],
  ['201143','Al Horford','S1',2007,3,'al-horford',"Center","6'8\" (2.03m)"],
  ['203078','Bradley Beal','S1',2012,3,'bradley-beal',"Guard","6'4\" (1.93m)"],
  ['1641706','Brandon Miller','M4',2023,2,'brandon-miller',"Forward","6'7\" (2.01m)"],
  ['1630529','Herbert Jones','M4',2021,35,'herbert-jones',"Forward","6'7\" (2.01m)"],
  ['1629656','Quentin Grimes','S2',2021,25,'quentin-grimes',"Guard","6'4\" (1.93m)"],
  ['1631204','Marcus Sasser','S2',2023,25,'marcus-sasser',"Guard","6'2\" (1.88m)"]
].map(([id,name,team,year,pick,slug,position,height])=>({id,name,team,year,pick,position,height,photo:`images/alumni/${id}.png`,source:`https://www.nba.com/player/${id}/${slug}`}));
const DRAFT_SOURCE='https://abc11.com/post/2027-nba-draft-big-board-rankings-top-100-prospects/20017483/';
const DRAFT_WATCH = [
  ['Tyran Stokes','E4',1],['Bruce Branch III','W6',3],['Jordan Smith Jr.','W4',4],
  ['Caleb Holt','W1',5],['Quentin Coleman','S3',6],['Motiejus Krivas','W1',7],
  ['Patrick Ngongba II','E1',10],['Austin Goosby','W11',13],['Malachi Moreno','M7',14]
].map(([name,team,rank])=>({name,team,rank,year:2027,asOf:'November 5, 2026',source:DRAFT_SOURCE}));
function schoolConnections(team) { return {alumni:NBA_ALUMNI.filter(p=>p.team===team),prospects:DRAFT_WATCH.filter(p=>p.team===team)}; }
function filterConnections(players,schools,school='all',query='') {
  const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const needle=normalize(query),aliases={E2:'Connecticut UConn',S6:'UNC North Carolina',E3:'MSU Michigan State'};
  return players.filter(p=>(school==='all'||p.team===school)&&normalize(p.name+' '+schools[p.team].name+' '+(aliases[p.team]||'')).includes(needle));
}
if(typeof module!=='undefined'&&module.exports)module.exports={NBA_ALUMNI,DRAFT_WATCH,schoolConnections,filterConnections};
