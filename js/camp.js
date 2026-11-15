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
let campState={mini:{},quiz:{},miniDone:false},campReady=false,campMode='games',quizIndex=0,quizAttempts={};
function persistCamp(){store('bs-camp',campState);}
function refreshCamp(before=null) {
  if(!campReady)return;
  const stats=campStats(practiceAnswers,campState),box=$('campStatus');box.textContent='';
  const head=el('div','camp-progress-head'),rank=el('div');rank.append(el('p','kicker','Practice XP'),el('strong','camp-level',stats.level));
  const score=el('div','camp-xp');score.append(el('b','',String(stats.xp)),el('span','',' / 120 XP'));head.append(rank,score);
  const meter=el('div','camp-meter');meter.setAttribute('role','progressbar');meter.setAttribute('aria-label','Practice experience');meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','120');meter.setAttribute('aria-valuenow',String(stats.xp));
  const fill=el('i');fill.style.width=`${stats.xp/120*100}%`;meter.append(fill);box.append(head,meter,el('p','camp-challenge-count',`${stats.completed} / 10 challenges complete`));
  const badges=$('campBadges');badges.textContent='';
  stats.badges.forEach(b=>{const item=el('div','camp-badge'+(b.earned?' earned':''));item.setAttribute('aria-label',`${b.name}: ${b.earned?'earned':b.hint}`);const icon=el('span','camp-badge-icon',b.earned?'✓':b.icon);icon.setAttribute('aria-hidden','true');item.append(icon,el('b','',b.name),el('small','',b.earned?'Earned':b.hint));badges.append(item);});
  $('practiceFinish').hidden=stats.completed!==10;
  $('homeCampProgress').textContent=stats.completed===10?'Warm-up complete · 120 practice XP':stats.completed?`Warm-up: ${stats.completed} / 10 challenges · ${stats.xp} XP`:'Warm up with 10 short challenges.';
  $('homeWarmup').textContent=stats.completed===10?'View my badges →':stats.completed?'Continue the warm-up →':'Start the warm-up →';
  $('tryPractice').textContent=$('homeWarmup').textContent;
  $('campNotice').textContent=before!==null&&stats.xp>before?`+${stats.xp-before} practice XP · ${stats.level}`:'';
}
function setCampMode(mode,focus=false) {
  campMode=['games','mini','quiz'].includes(mode)?mode:'games';
  ['games','mini','quiz'].forEach(m=>{$(`camp-${m}`).hidden=m!==campMode;});
  document.querySelectorAll('[data-camp]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.camp===campMode)));
  if(campMode==='mini')renderMini();else if(campMode==='quiz')renderQuiz();
  if(focus){$(`camp-${campMode}`).scrollIntoView({block:'start'});$(campMode==='mini'?'miniTitle':campMode==='quiz'?'quizTitle':'practiceTitle').focus({preventScroll:true});}
}
function resumeCamp() {
  navigateTo('learn',false);
  const next=PRACTICE_GAMES.findIndex((_,i)=>!practiceAnswers[i]);
  if(next>=0){practiceIndex=next;renderPractice();setCampMode('games');}
  else if(!campState.miniDone)setCampMode('mini');
  else {quizIndex=Math.max(0,QUIZ_ITEMS.findIndex(q=>campState.quiz[q.id]!==q.answer));setCampMode('quiz');}
  $('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});
}
function campTeam(id){return ARCHIVE[2026].games.find(g=>g.round===1&&g.teams.some(t=>t.id===id)).teams.find(t=>t.id===id);}
function renderMini() {
  const grid=$('miniBracket');grid.textContent='';
  for(const [slot,label] of [['a','Semifinal 1'],['b','Semifinal 2'],['final','Championship']]){
    const card=el('div','mini-game'),candidates=slot==='final'?(campState.mini.a&&campState.mini.b?[campState.mini.a,campState.mini.b]:[]):MINI_SIDES[slot];
    card.append(el('p','kicker',label));
    if(!candidates.length)card.append(el('p','mini-wait','Choose both semifinal winners to set the final.'));
    candidates.forEach(id=>{const team=campTeam(id),b=el('button','mini-team');b.type='button';b.dataset.miniSlot=slot;b.dataset.teamId=id;b.setAttribute('aria-label',`Pick ${team.name} in ${label.toLowerCase()}`);b.setAttribute('aria-pressed',String(campState.mini[slot]===id));
      const words=el('span');words.append(el('b','',team.name),el('small','',`#${team.seed} seed`));b.append(historyLogo(team),words,el('span','mini-check',campState.mini[slot]===id?'✓':''));
      b.addEventListener('click',()=>{const before=campStats(practiceAnswers,campState).xp,oldFinal=campState.mini.final;campState.mini=applyMiniPick(campState.mini,slot,id);if(campState.mini.final)campState.miniDone=true;persistCamp();renderMini();refreshCamp(before);if(oldFinal&&!campState.mini.final)$('miniFeedback').prepend(el('p','sub','Your finalists changed. Pick a new champion.'));document.querySelector(`[data-mini-slot="${slot}"][data-team-id="${id}"]`)?.focus({preventScroll:true});});card.append(b);
    });grid.append(card);
  }
  const feedback=$('miniFeedback');feedback.textContent='';
  if(campState.mini.final){const team=campTeam(campState.mini.final),win=el('div','mini-champion');win.append(historyLogo(team),el('div','','Your mini champion'),el('strong','',team.name),el('span','camp-reward','Bracket builder · 30 XP'));feedback.append(win);}
  if(campState.miniDone){const row=el('div','mini-actions'),next=el('button','btn','Next: quick quiz →'),replay=el('button','link','Try another bracket');next.type=replay.type='button';next.addEventListener('click',()=>setCampMode('quiz',true));replay.addEventListener('click',()=>{campState.mini={};persistCamp();renderMini();refreshCamp();$('miniTitle').focus();});row.append(next,replay);feedback.append(row,el('p','sub camp-scope','Badge earned. Replays keep your XP.'));}
}
function renderQuiz() {
  const q=QUIZ_ITEMS[quizIndex],done=campState.quiz[q.id]===q.answer,attempt=done?q.answer:quizAttempts[q.id];
  const steps=$('quizSteps');steps.textContent='';
  QUIZ_ITEMS.forEach((question,i)=>{const b=el('button','',campState.quiz[question.id]===question.answer?'✓':String(i+1));b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-label',`Question ${i+1}`);b.setAttribute('aria-selected',String(i===quizIndex));b.addEventListener('click',()=>{quizIndex=i;renderQuiz();$('quizSteps').children[i].focus();});steps.append(b);});
  const box=$('campQuiz');box.textContent='';box.append(el('p','kicker',`Question ${quizIndex+1} / 3`),el('h5','quiz-question',q.question));
  const choices=el('div','quiz-choices');q.options.forEach((option,i)=>{const b=el('button','',option);b.type='button';b.disabled=done;b.setAttribute('aria-pressed',String(attempt===i));b.addEventListener('click',()=>{const before=campStats(practiceAnswers,campState).xp;quizAttempts[q.id]=i;if(i===q.answer){campState.quiz[q.id]=i;persistCamp();}renderQuiz();refreshCamp(before);$('quizFeedback').focus({preventScroll:true});});choices.append(b);});box.append(choices);
  if(attempt!==undefined){const result=el('div','quiz-feedback'+(done?' correct':''));result.id='quizFeedback';result.tabIndex=-1;result.setAttribute('aria-live','polite');result.append(el('b','',done?'That’s it. +10 practice XP':'Try again.'),el('p','',q.why));box.append(result);}
  if(done){const next=el('button','btn',quizIndex<2?'Next question →':'Back to my badges');next.type='button';next.addEventListener('click',()=>{if(quizIndex<2){quizIndex++;renderQuiz();$('quizTitle').focus();}else{$('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});}});box.append(next);}
}
function initCamp() {
  campState=cleanCampState(load('bs-camp'));campReady=true;
  document.querySelectorAll('[data-camp]').forEach(b=>b.addEventListener('click',()=>setCampMode(b.dataset.camp)));
  $('homeWarmup').addEventListener('click',resumeCamp);
  refreshCamp();renderMini();renderQuiz();setCampMode('games');
}
if(typeof module!=='undefined'&&module.exports)module.exports={MINI_SIDES,QUIZ_ITEMS,applyMiniPick,cleanCampState,campStats};
