const test=require('node:test');
const assert=require('node:assert/strict');
const {MINI_SIDES,QUIZ_ITEMS,applyMiniPick,cleanCampState,campStats}=require('../js/camp.js');
const {PRACTICE_GAMES,practiceGame}=require('../js/experience.js');
const archive=require('../js/history-data.js');

test('the mini bracket only accepts its semifinalists and selected finalists',()=>{
  let picks=applyMiniPick({},'final','130');assert.deepEqual(picks,{});
  picks=applyMiniPick(picks,'a','130');picks=applyMiniPick(picks,'b','41');
  assert.deepEqual(applyMiniPick(picks,'final','12'),picks);
  picks=applyMiniPick(picks,'final','130');assert.equal(picks.final,'130');
  picks=applyMiniPick(picks,'a','12');assert.equal(picks.final,undefined);assert.equal(picks.b,'41');
  picks=applyMiniPick(picks,'final','41');picks=applyMiniPick(picks,'a','130');assert.equal(picks.final,'41');
  const field=new Set(archive[2026].games.filter(g=>g.round===5).flatMap(g=>g.teams.map(t=>t.id)));
  assert.deepEqual(new Set(Object.values(MINI_SIDES).flat()),field);
});
test('stored camp progress rejects invalid teams, finalist paths and quiz choices',()=>{
  assert.deepEqual(cleanCampState(null),{mini:{},quiz:{},miniDone:false});
  const clean=cleanCampState({mini:{a:'fake',b:'41',final:'130'},quiz:{seed:2,knockout:1,regions:'1',extra:0}});
  assert.deepEqual(clean,{mini:{b:'41'},quiz:{knockout:1},miniDone:false});
  assert.equal(cleanCampState({mini:{a:'130',b:'41',final:'41'}}).miniDone,true);
});
test('practice rewards learning once per challenge, independent of prediction accuracy',()=>{
  assert.equal(PRACTICE_GAMES.length,6);
  const loser=practiceGame(PRACTICE_GAMES[0],archive).teams.find(t=>!t.won).id;
  const state=cleanCampState(null),answers={0:loser};
  assert.equal(campStats(answers,state).xp,10);
  answers[0]=practiceGame(PRACTICE_GAMES[0],archive).teams.find(t=>t.won).id;
  assert.equal(campStats(answers,state).xp,10);
  answers[99]='extra';assert.equal(campStats(answers,state).xp,10);
});
test('badges, levels and XP match all ten completed learning challenges',()=>{
  const state=cleanCampState(null);
  assert.equal(campStats({},state).level,'Rookie');
  assert.equal(campStats({0:'130'},state).badges[0].earned,true);
  const answers=Object.fromEntries(PRACTICE_GAMES.map((d,i)=>[i,practiceGame(d,archive).teams[0].id]));
  assert.equal(campStats(answers,state).level,'Playmaker');
  state.miniDone=true;assert.equal(campStats(answers,state).level,'Bracket captain');
  QUIZ_ITEMS.forEach(q=>{state.quiz[q.id]=q.answer;assert.ok(q.options[q.answer]);});
  const full=campStats(answers,state);assert.equal(full.completed,10);assert.equal(full.xp,120);assert.ok(full.badges.every(b=>b.earned));
  state.mini={};assert.equal(campStats(answers,state).xp,120,'replaying the mini bracket neither removes nor farms XP');
  const restored=cleanCampState(JSON.parse(JSON.stringify(state)));assert.deepEqual(campStats(answers,restored),full);
});
