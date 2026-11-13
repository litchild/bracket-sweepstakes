// Browser-local learning rewards. Practice XP never enters contest scoring.
const MINI_SIDES={a:['130','12'],b:['41','356']};
const QUIZ_ITEMS=[
  {id:'seed',question:'What does a No. 1 seed mean?',options:['Highest-ranked team in its group','Already the national champion','Guaranteed to win its first game'],answer:0,why:'A seed is a ranking within a tournament group. The game still decides who advances.'},
  {id:'knockout',question:'A team loses one tournament game. What happens?',options:['It tries again next round','Its tournament ends','It keeps its place'],answer:1,why:'March Madness is single elimination. One loss ends a team’s run.'},
  {id:'regions',question:'What do the four tournament groups produce?',options:['Four national champions','The four teams in the Final Four','Four groups of nearby schools only'],answer:1,why:'Each group sends one winner to the Final Four. Those teams play for one national title.'}
];
function applyMiniPick(picks,slot,teamId) {
  const next={};
  for(const key of ['a','b'])if(MINI_SIDES[key].includes(picks?.[key]))next[key]=picks[key];
  if(next.a&&next.b&&[next.a,next.b].includes(picks?.final))next.final=picks.final;
  const candidates=slot==='final'?(next.a&&next.b?[next.a,next.b]:[]):MINI_SIDES[slot]||[];
  if(!candidates.includes(teamId))return next;
  next[slot]=teamId;
  if(next.final&&![next.a,next.b].includes(next.final))delete next.final;
  return next;
}
function cleanCampState(value) {
  const state={mini:{},quiz:{},miniDone:false};
  if(!value||typeof value!=='object')return state;
  state.mini=applyMiniPick(value.mini||{},'',null);
  QUIZ_ITEMS.forEach(q=>{if(value.quiz?.[q.id]===q.answer)state.quiz[q.id]=q.answer;});
  state.miniDone=value.miniDone===true||!!state.mini.final;
  return state;
}
function campStats(answers,state) {
  const games=Array.from({length:6},(_,i)=>i).filter(i=>typeof answers?.[i]==='string'&&answers[i]).length;
  const quiz=QUIZ_ITEMS.filter(q=>state.quiz?.[q.id]===q.answer).length;
  const mini=state.miniDone?1:0,completed=games+quiz+mini,xp=games*10+quiz*10+mini*30;
  return {games,quiz,completed,xp,max:120,total:10,level:xp>=90?'Bracket captain':xp>=40?'Playmaker':'Rookie',badges:[
    {name:'First pick',icon:'1',hint:'Try one game',earned:games>0},
    {name:'Bracket builder',icon:'4',hint:'Finish the mini bracket',earned:!!mini},
    {name:'March ready',icon:'★',hint:'Complete all 10',earned:completed===10}
  ]};
}

module.exports={MINI_SIDES,QUIZ_ITEMS,applyMiniPick,cleanCampState,campStats};
