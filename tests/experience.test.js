const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const archive=require('../js/history-data.js');
const profiles=require('../js/profiles.js');
const {archiveRoundGames,rankBrackets,PRACTICE_GAMES,practiceGame}=require('../js/experience.js');
const {MOMENTS,FEATURED_MOMENT,videoOrder,momentPoster}=require('../js/home.js');

test('archives contain complete, consistent 63-game knockout tournaments',()=>{
  for(const [year,t] of Object.entries(archive)){
    assert.equal(t.games.length,63);
    assert.equal(new Set(t.games.map(g=>g.id)).size,63);
    assert.deepEqual([1,2,3,4,5,6].map(r=>t.games.filter(g=>g.round===r).length),[32,16,8,4,2,1]);
    for(const g of t.games){
      assert.equal(g.teams.length,2);assert.equal(g.teams.filter(t=>t.won).length,1);
      const winner=g.teams.find(t=>t.won),loser=g.teams.find(t=>!t.won);
      assert.ok(winner.score>loser.score);
      if(g.round<6){const next=t.games.filter(n=>n.round===g.round+1&&n.teams.some(x=>x.id===winner.id));assert.equal(next.length,1,`${year}: ${winner.name} advances once`);}
    }
    const final=t.games.find(g=>g.round===6);assert.equal(final.teams.find(t=>t.won).name,({2023:'UConn',2024:'UConn',2025:'Florida',2026:'Michigan'})[year]);
  }
});
test('2026 archive includes the complete field and six Michigan wins',()=>{
  const games=archive[2026].games;
  assert.equal(new Set(games.filter(g=>g.round===1).flatMap(g=>g.teams.map(t=>t.id))).size,64);
  const run=games.filter(g=>g.teams.some(t=>t.id===archive[2026].champion));
  assert.equal(run.length,6);assert.ok(run.every(g=>g.teams.find(t=>t.won).id===archive[2026].champion));
  assert.deepEqual(Object.fromEntries(games.find(g=>g.round===6).teams.map(t=>[t.name,t.score])),{UConn:63,Michigan:69});
});
test('Home videos have unique clips, local previews and valid onward links',()=>{
  const videos=Object.entries(MOMENTS);assert.ok(videos.length>=10);
  assert.equal(new Set(videos.map(([,m])=>m.video)).size,videos.length);
  assert.equal(FEATURED_MOMENT,'michigan');assert.equal(MOMENTS[FEATURED_MOMENT].year,2026);
  assert.equal(new Set(videoOrder()).size,videos.length);assert.equal(videoOrder()[0],FEATURED_MOMENT);
  videos.forEach(([key,m])=>{
    assert.match(m.video,/^[\w-]{11}$/);
    assert.equal(fs.readFileSync(path.join(__dirname,'..',momentPoster(key))).subarray(0,3).toString('hex'),'ffd8ff');
    if(m.archive)assert.equal(archive[m.archive].games.filter(g=>g.round===m.round&&g.region===m.region&&g.teams.some(t=>t.name===m.team)).length,1);
    else assert.ok(m.source||PRACTICE_GAMES[m.practice]?.source);
  });
});
test('regional bracket columns preserve adjacent winners and all 15 games',()=>{
  for(const t of Object.values(archive))for(const region of ['East','West','South','Midwest']){
    const cols=[1,2,3,4].map(r=>archiveRoundGames(t,region,r));
    assert.deepEqual(cols.map(c=>c.length),[8,4,2,1]);
    for(let r=0;r<3;r++)cols[r+1].forEach((g,i)=>assert.deepEqual(new Set(g.teams.map(t=>t.id)),new Set(cols[r].slice(i*2,i*2+2).map(g=>g.teams.find(t=>t.won).id))));
  }
});
test('practice games reveal the matching historical matchup, including the title game',()=>{
  const games=PRACTICE_GAMES.map(d=>practiceGame(d,archive));
  assert.deepEqual(games.map(g=>g.teams.find(t=>t.won).score),[80,63,65,73,73,69]);
  assert.deepEqual(games.map(g=>g.teams.find(t=>!t.won).score),[76,58,63,72,72,63]);
  assert.equal(games[2].round,6);
});
test('rankings award round points, count correct picks, and share tied ranks',()=>{
  const entries=[{id:'a',picks:{a:'Duke',b:'UConn'}},{id:'b',picks:{a:'Duke',b:'UConn'}},{id:'c',picks:{a:'Duke',b:'Other'}}];
  const rows=rankBrackets(entries,{a:'Duke',b:'UConn'},{a:10,b:320});
  assert.deepEqual(rows.map(r=>[r.pts,r.correct,r.rank]),[[330,2,1],[330,2,1],[10,1,3]]);
  assert.deepEqual(rankBrackets(entries,{}, {a:10,b:320}).map(r=>r.pts),[0,0,0]);
});
test('every historical school has a valid local PNG logo',()=>{
  for(const t of Object.values(archive))for(const g of t.games)for(const team of g.teams){
    const current=Object.keys(profiles).find(id=>profiles[id].espnId===team.id);
    const file=path.join(__dirname,'..',current?`images/teams/${current}.png`:`images/history/${team.id}.png`);
    assert.equal(fs.readFileSync(file).subarray(0,8).toString('hex'),'89504e470d0a1a0a',team.name);
  }
});
