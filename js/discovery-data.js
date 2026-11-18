// Curated school connections. Alumni are historical; prospect ranks are dated editorial projections.
const NBA_ALUMNI = [
  ['1628369','Jayson Tatum','E1',2017,3,'jayson-tatum'],
  ['202681','Kyrie Irving','E1',2011,1,'kyrie-irving'],
  ['1631094','Paolo Banchero','E1',2022,1,'paolo-banchero'],
  ['1629627','Zion Williamson','E1',2019,1,'zion-williamson'],
  ['1627742','Brandon Ingram','E1',2016,2,'brandon-ingram'],
  ['1626164','Devin Booker','M7',2015,13,'devin-booker'],
  ['1628983','Shai Gilgeous-Alexander','M7',2018,11,'shai-gilgeous-alexander'],
  ['203076','Anthony Davis','M7',2012,1,'anthony-davis'],
  ['1628389','Bam Adebayo','M7',2017,14,'bam-adebayo'],
  ['1627750','Jamal Murray','M7',2016,7,'jamal-murray'],
  ['201142','Kevin Durant','W11',2007,2,'kevin-durant']
].map(([id,name,team,year,pick,slug])=>({id,name,team,year,pick,photo:`images/alumni/${id}.png`,source:`https://www.nba.com/player/${id}/${slug}`}));
const DRAFT_SOURCE='https://abc11.com/post/2027-nba-draft-big-board-rankings-top-100-prospects/20017483/';
const DRAFT_WATCH = [
  ['Tyran Stokes','E4',1],['Bruce Branch III','W6',3],['Jordan Smith Jr.','W4',4],
  ['Caleb Holt','W1',5],['Quentin Coleman','S3',6],['Motiejus Krivas','W1',7],
  ['Patrick Ngongba II','E1',10],['Austin Goosby','W11',13],['Malachi Moreno','M7',14]
].map(([name,team,rank])=>({name,team,rank,year:2027,asOf:'November 5, 2026',source:DRAFT_SOURCE}));
function schoolConnections(team) { return {alumni:NBA_ALUMNI.filter(p=>p.team===team),prospects:DRAFT_WATCH.filter(p=>p.team===team)}; }
if(typeof module!=='undefined'&&module.exports)module.exports={NBA_ALUMNI,DRAFT_WATCH,schoolConnections};
