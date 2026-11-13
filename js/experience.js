// Practice, historical brackets, and standings presentation. Static data stays separate from live picks.
const PRACTICE_GAMES = [
  {year:2024, team:'Oakland', title:'Can the underdog win?', label:'Seeds & upsets', clue:'Kentucky was a No. 3 seed. Oakland was No. 14. A smaller seed number means a higher rank.', why:'Oakland’s Jack Gohlke made 10 three-pointers. Hot shooting helped the No. 14 seed beat Kentucky, 80–76.', lesson:'A seed is a ranking, not a promise. A lower-ranked winner is an upset.', source:'https://ukathletics.com/news/2024/03/21/kentucky-falls-to-oakland-in-ncaa-first-round/'},
  {year:2023, team:'FDU', title:'What does one loss mean?', label:'Win or go home', clue:'Purdue was a No. 1 seed. FDU was No. 16. Choose who you think advanced.', why:'FDU held Purdue to 58 points and won by five. Purdue’s tournament ended after this single game.', lesson:'Every round is knockout basketball. Your winner moves forward; the other team goes home.', source:'https://purduesports.com/news/2023/03/17/purdue-season-ends-with-first-round-upset'},
  {year:2025, team:'Florida', title:'Two No. 1 seeds. One title.', label:'Pick a champion', clue:'Florida and Houston both won their regions. Each entered the tournament as a No. 1 seed.', why:'Florida rallied from 12 points down and forced turnovers on Houston’s final two possessions to win, 65–63.', lesson:'Seeds belong to regions, so two No. 1 seeds can meet. Six straight wins make a champion.', source:'https://floridagators.com/news/2025/4/8/mens-basketball-florida-houston-ncaa-championship-game-april-7-2025'}
];
let practiceIndex=0, practiceAnswers={}, archiveYear=2026, archiveView='path', archiveRegion='East', archiveRound=1;
function archiveRoundGames(tournament,region,round) {
  const slot={}, order=[1,8,5,4,6,3,7,2];
  tournament.games.filter(g=>g.round===1&&g.region===region).forEach(g=>{
    const index=order.indexOf(Math.min(...g.teams.map(t=>t.seed)));
    g.teams.forEach(t=>{slot[t.id]=index;});
  });
  return tournament.games.filter(g=>g.round===round&&(round>4||g.region===region)).sort((a,b)=>Math.min(...a.teams.map(t=>slot[t.id]??99))-Math.min(...b.teams.map(t=>slot[t.id]??99)));
}
function rankBrackets(entries,winners,gamePoints) {
  const rows=entries.map(e=>{
    let pts=0,correct=0;
    Object.keys(gamePoints).forEach(id=>{if(winners[id]&&e.picks[id]===winners[id]){correct++;pts+=gamePoints[id];}});
    return {e,pts,correct};
  }).sort((a,b)=>b.pts-a.pts);
  rows.forEach((r,i)=>{r.rank=i&&rows[i-1].pts===r.pts?rows[i-1].rank:i+1;});return rows;
}
function historyLogo(team) {
  const current=Object.keys(TEAM_PROFILES).find(id=>TEAM_PROFILES[id].espnId===team.id);
  const img=el('img','team-logo');img.src=current?`images/teams/${current}.png`:`images/history/${team.id}.png`;
  img.alt='';img.width=36;img.height=36;return img;
}
function practiceGame(def,tournaments=ARCHIVE) {return tournaments[def.year].games.find(g=>g.round===(def.year===2025?6:1)&&g.teams.some(t=>t.name===def.team));}
function renderPractice() {
  const def=PRACTICE_GAMES[practiceIndex], game=practiceGame(def), answer=practiceAnswers[practiceIndex], complete=Object.keys(practiceAnswers).length;
  $('practiceCount').textContent=`${complete} / 3 tried`; $('practiceFinish').hidden=complete!==3;
  const steps=$('practiceSteps');steps.textContent='';
  PRACTICE_GAMES.forEach((p,i)=>{const b=el('button','',`${practiceAnswers[i]?'✓':i+1} ${p.label}`);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(practiceIndex===i));b.addEventListener('click',()=>{practiceIndex=i;renderPractice();$('practiceSteps').children[i].focus();});steps.append(b);});
  const box=$('practiceGame');box.textContent='';
  box.append(el('p','kicker',`${def.year} · ${ROUND_NAME[game.round]}`),el('h4','practice-question',def.title),el('p','sub','Pick a winner, then reveal the real result.'));
  const clues=el('details','practice-clue');clues.append(el('summary','','A clue before you pick'),el('p','',def.clue));box.append(clues);
  const match=el('div','practice-match');
  const teams=game.teams.slice().sort((a,b)=>a.seed-b.seed);
  teams.forEach((t,i)=>{
    if(i)match.append(el('span','versus','VS'));
    const b=el('button',answer?(t.won?'practice-winner':'practice-loser'):'');b.type='button';b.setAttribute('aria-pressed',String(answer===t.id));
    const text=el('span');text.append(el('b','',t.name),el('small','',`#${t.seed} seed`));b.append(historyLogo(t),text);
    if(answer)b.append(el('strong','practice-score',String(t.score)));
    b.addEventListener('click',()=>{practiceAnswers[practiceIndex]=t.id;store('bs-practice',practiceAnswers);renderPractice();$('practiceReveal').focus({preventScroll:true});});match.append(b);
  });box.append(match);
  if(answer){
    const reveal=el('div','practice-reveal');reveal.id='practiceReveal';reveal.tabIndex=-1;reveal.setAttribute('aria-live','polite');
    reveal.append(el('b','result-label',game.teams.find(t=>t.won).id===answer?'You called it.':'That was the surprise.'),el('p','',def.why),el('div','lesson-label','Take this into your bracket'),el('p','',def.lesson));
    const source=el('a','link','Read the game story ↗');source.href=def.source;source.target='_blank';source.rel='noopener noreferrer';reveal.append(source);box.append(reveal);
    const next=el('button','btn practice-next',practiceIndex<2?'Try the next game →':'Explore past brackets →');next.type='button';
    next.addEventListener('click',()=>{if(practiceIndex<2){practiceIndex++;renderPractice();$('practiceTitle').focus();}else{discoverMode='archive';renderDiscovery();navigateTo('explore');}});box.append(next);
  }
}
function archiveGameCard(game) {
  const link=el('a','archive-game');link.href=game.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`${game.teams.map(t=>`${t.name} ${t.score}`).join(', ')}. Open historical box score`);
  game.teams.forEach(t=>{const row=el('span','archive-team'+(t.won?' won':''));row.append(el('small','',String(t.seed)),historyLogo(t),el('span','',t.name),el('strong','',String(t.score)),el('span','archive-check',t.won?'✓':''));link.append(row);});return link;
}
function renderArchive() {
  const tournament=ARCHIVE[archiveYear], final=tournament.games.find(g=>g.round===6), champion=final.teams.find(t=>t.won), runner=final.teams.find(t=>!t.won);
  const years=$('archiveYears');years.textContent='';
  Object.keys(ARCHIVE).map(Number).sort((a,b)=>b-a).forEach(y=>{const b=el('button','pill',String(y));b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(y===archiveYear));b.addEventListener('click',()=>{archiveYear=y;renderArchive();$('archiveYears').querySelector('[aria-selected="true"]').focus();});years.append(b);});
  const hero=$('archiveChampion');hero.textContent='';const art=el('img','archive-trophy');art.src='images/trophy.svg';art.alt='';art.width=100;art.height=90;
  const text=el('div');text.append(el('p','kicker',`${archiveYear} national champion`),el('h4','',champion.name),el('p','',`${champion.score}–${runner.score} over ${runner.name}`));hero.append(art,text,historyLogo(champion));
  document.querySelectorAll('[data-archive-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.archiveView===archiveView)));
  const full=archiveView==='full';$('archiveRegions').hidden=!full;$('archiveRounds').hidden=!full||archiveRegion==='Final Four';
  const regions=$('archiveRegions');regions.textContent='';
  ['East','West','South','Midwest','Final Four'].forEach(region=>{const b=el('button','pill',region);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(region===archiveRegion));b.addEventListener('click',()=>{archiveRegion=region;renderArchive();$('archiveRegions').querySelector('[aria-selected="true"]').focus();});regions.append(b);});
  const rounds=$('archiveRounds');rounds.textContent='';
  [1,2,3,4].forEach(r=>{const b=el('button','rnd',ROUND_NAME[r]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(r===archiveRound));b.addEventListener('click',()=>{archiveRound=r;renderArchive();$('archiveRounds').querySelector('[aria-selected="true"]').focus();});rounds.append(b);});
  const box=$('archiveGames');box.textContent='';
  if(!full){
    const path=el('ol','champion-path');tournament.games.filter(g=>g.teams.some(t=>t.id===champion.id)).sort((a,b)=>a.round-b.round).forEach(g=>{const li=el('li');li.append(el('span','path-round',ROUND_NAME[g.round]),archiveGameCard(g));path.append(li);});box.append(path);return;
  }
  const isPhone=matchMedia('(max-width:600px)').matches;
  const grid=el('div',isPhone?'archive-stack':'archive-bracket');
  const shown=archiveRegion==='Final Four'?[5,6]:isPhone?[archiveRound]:[1,2,3,4];
  shown.forEach(r=>{const col=el('div','archive-col');col.append(el('h4','',ROUND_NAME[r]));const games=el('div','archive-col-games');archiveRoundGames(tournament,archiveRegion,r).forEach(g=>games.append(archiveGameCard(g)));col.append(games);grid.append(col);});box.append(grid);
  $('archiveRounds').hidden=!isPhone||archiveRegion==='Final Four';
}
function renderBoardEmpty(count,isDemo) {
  const box=$('boardEmpty');box.textContent='';const art=el('img');art.src='images/trophy.svg';art.alt='';art.width=120;art.height=100;
  box.append(art,el('h4','',count?'First bracket in. Who’s next?':'The board starts with you.'),el('p','',isDemo?'Add simulated fans in Demo controls to preview rankings.':count?'Standings appear when a second fan enters on this device.':'Enter your bracket. Standings appear when two fans have entered on this device.'));
  const go=el('button','btn',count?'Back to my picks':'Make my picks →');go.type='button';go.addEventListener('click',()=>navigateTo('bracket'));box.append(go);
}
function initExperience() {
  const saved=load('bs-practice');if(saved&&typeof saved==='object'){PRACTICE_GAMES.forEach((d,i)=>{if(practiceGame(d).teams.some(t=>t.id===saved[i]))practiceAnswers[i]=saved[i];});}
  $('tryPractice').addEventListener('click',()=>{$('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});});
  document.querySelectorAll('[data-archive-view]').forEach(b=>b.addEventListener('click',()=>{archiveView=b.dataset.archiveView;renderArchive();}));
  document.querySelectorAll('[data-board]').forEach(b=>b.addEventListener('click',()=>{S.boardMode=b.dataset.board;renderStandings();}));
  document.querySelectorAll('[data-standings]').forEach(b=>b.addEventListener('click',()=>{S.standingsPanel=b.dataset.standings;renderStandings();}));
  matchMedia('(max-width:600px)').addEventListener('change',()=>{if(discoverMode==='archive')renderArchive();});
  renderPractice();renderArchive();
}
if(typeof module!=='undefined'&&module.exports)module.exports={archiveRoundGames,rankBrackets,PRACTICE_GAMES,practiceGame};
