const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {TEAMS}=require('../js/logic.js');
const {NBA_ALUMNI,DRAFT_WATCH,schoolConnections}=require('../js/discovery-data.js');
test('alumni cards resolve to field schools, unique NBA identities and valid local portraits',()=>{
  assert.equal(new Set(NBA_ALUMNI.map(p=>p.id)).size,NBA_ALUMNI.length);
  for(const p of NBA_ALUMNI){assert.ok(TEAMS[p.team]);assert.ok(p.year<=2026);assert.ok(p.pick>=1&&p.pick<=60);assert.match(p.source,new RegExp(`/player/${p.id}/`));assert.equal(fs.readFileSync(path.join(__dirname,'..',p.photo)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');}
  for(const school of ['E1','M7'])assert.equal(schoolConnections(school).alumni.length,5);
  assert.equal(NBA_ALUMNI.find(p=>p.name==='Shai Gilgeous-Alexander').id,'1628983');
});
test('school discovery separates dated projections from actual draft outcomes and supports every school',()=>{
  for(const p of DRAFT_WATCH){assert.ok(TEAMS[p.team]);assert.equal(p.year,2027);assert.equal(p.asOf,'November 5, 2026');assert.ok(p.rank>=1);assert.equal(p.pick,undefined);assert.match(p.source,/2027-nba-draft/);}
  for(const id of Object.keys(TEAMS)){const data=schoolConnections(id);assert.ok(data.alumni.every(p=>p.team===id));assert.ok(data.prospects.every(p=>p.team===id));}
  assert.deepEqual(schoolConnections('E16'),{alumni:[],prospects:[]});
});
