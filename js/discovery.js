// NBA connections are a discovery route into school picks, never a fantasy-player bracket.
let nbaSchool='all',nbaQuery='',nbaLimit=12,draftView='lottery';
function discoveryLink(text,url){const a=el('a','link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function alumniPortrait(player){const wrap=el('span','alumni-face'),initials=el('span','',player.name.split(' ').map(s=>s[0]).slice(0,2).join(''));initials.setAttribute('aria-hidden','true');wrap.append(initials);const img=el('img');img.alt=player.name;img.width=130;img.height=95;img.loading='lazy';img.decoding='async';
  // Initials are only a fallback: hide them once the transparent portrait loads, so they never show through it.
  img.addEventListener('load',()=>wrap.classList.add('has-photo'));img.addEventListener('error',()=>{img.hidden=true;});img.src=player.photo;if(img.complete&&img.naturalWidth)wrap.classList.add('has-photo');wrap.append(img);return wrap;}
function goSchoolGames(team){if($('teamDialog').open)$('teamDialog').close();S.br=TEAMS[team].br;S.round=1;navigateTo('bracket',false);renderBTabs();renderBracket();$('btabs').scrollIntoView({block:'start'});$('btabs').querySelector('[aria-selected="true"]')?.focus({preventScroll:true});}
function schoolGamesButton(id){const b=el('button','btn',`Go to ${TEAMS[id].name}’s games`);b.type='button';b.addEventListener('click',()=>goSchoolGames(id));return b;}
function openDiscovery(mode,school='all'){nbaSchool=school;nbaQuery='';nbaLimit=12;$('nbaSearch').value='';discoverMode=mode;renderDiscovery();navigateTo('explore');}
function alumniRow(p){const b=el('button','connection-row');b.type='button';const words=el('span');words.append(el('b','',p.name),el('small','',`NBA · ${nbaTeamLabel(p)}`));b.append(alumniPortrait(p),words);b.setAttribute('aria-label',`View ${p.name} profile`);b.addEventListener('click',()=>showAlumniProfile(p.id));return b;}
function nbaAffiliation(p){const badge=el('p','nba-affiliation');badge.append(el('span','','NBA'),el('b','',nbaTeamLabel(p)));return badge;}
function appendSchoolConnections(body,id){
  const data=schoolConnections(id),section=el('section','school-connections');section.append(el('h3','','NBA roots & draft watch'));
  const alumni=el('div','connection-list');alumni.append(el('p','kicker',`${data.alumni.length} featured NBA alumni`));
  if(data.alumni.length)data.alumni.slice(0,4).forEach(p=>alumni.append(alumniRow(p)));
  else alumni.append(el('p','sub','No featured alumni in this curated collection yet.'));
  section.append(alumni);
  if(data.prospects.length){const watch=el('div','connection-list');watch.append(el('p','kicker','2027 prospects · November 5, 2026'));
    data.prospects.forEach(p=>{const b=el('button','connection-row prospect-row');b.type='button';b.append(el('b','',p.name),el('small','',`Board #${p.rank} · View profile`));b.addEventListener('click',()=>showProspectProfile(p.name));watch.append(b);});section.append(watch);}
  const more=el('button','link',`Browse all ${TEAMS[id].name} connections`);more.type='button';more.addEventListener('click',()=>{$('teamDialog').close();openDiscovery('nba',id);$('nbaSchool').focus({preventScroll:true});$('nbaSchool').scrollIntoView({block:'center'});});
  section.append(more,el('small','sub','Alumni are former students. Prospect ranks are projections, not confirmed picks.'));body.append(section);
}
function profileSchoolBridge(body,id){
  const t=TEAMS[id],bridge=el('section','profile-school-bridge'),words=el('div');words.append(el('p','kicker','Your college connection'),el('h3','',t.name),el('p','sub',`2026 tournament field · Seed ${t.seed} · ${BR[t.br].name} bracket`));
  bridge.append(teamLogo(id),words);
  const actions=el('div','profile-actions');actions.append(schoolGamesButton(id));const school=el('button','link','Explore school profile');school.type='button';school.addEventListener('click',()=>showTeamProfile(id));actions.append(school);bridge.append(actions);body.append(bridge);
}
function showAlumniProfile(id){
  const p=NBA_ALUMNI.find(p=>p.id===id);if(!p)return;
  const body=prepareProfile(),hero=el('div','alumni-profile-hero'),words=el('div'),title=el('h2','',p.name);title.id='teamDialogTitle';
  words.append(el('p','kicker','NBA roots · Former college player'),title,el('p','',`${TEAMS[p.team].name} alumnus`));hero.append(alumniPortrait(p),words);body.append(hero);
  const affiliation=el('section','nba-profile-affiliation');affiliation.append(nbaAffiliation(p),el('p','sub',`NBA status checked ${NBA_TEAM_AS_OF}`),discoveryLink(p.nbaSource.includes('/player/')?'NBA.com profile':p.nbaStatus==='retired'?'NBA retirement report':'NBA team source',p.nbaSource));body.append(affiliation);
  const facts=el('dl','player-facts alumni-facts');
  for(const [label,value] of [['Position',p.position],['Height',p.height]]){const f=el('div');f.append(el('dt','',label),el('dd','',value));facts.append(f);}body.append(facts);
  const path=el('section','alumni-path');path.append(el('h3','','College to the NBA'));
  const steps=el('ol');for(const [label,text] of [['College',TEAMS[p.team].name],['NBA draft',`${p.year} · Round ${p.pick<=30?1:2} · Pick ${p.pick}`],['Your bracket',`Follow ${TEAMS[p.team].name}’s college team`]]){const li=el('li');li.append(el('small','',label),el('b','',text));steps.append(li);}path.append(steps);body.append(path);
  profileSchoolBridge(body,p.team);
  const others=schoolConnections(p.team).alumni.filter(other=>other.id!==id);
  if(others.length){const related=el('section','school-connections');related.append(el('h3','',`More from ${TEAMS[p.team].name}`));const list=el('div','related-alumni');others.forEach(other=>list.append(alumniRow(other)));related.append(list);body.append(related);}
  body.append(discoveryLink('Official NBA biography & draft record',p.source),el('p','sub roster-note','Bio snapshot: November 23, 2026 · Photo: NBA. These alumni are former college players. Your picks follow the college teams in this bracket.'));finishProfile();
}
function showProspectProfile(name){
  const p=DRAFT_WATCH.find(p=>p.name===name);if(!p)return;
  const body=prepareProfile(),hero=el('div','profile-head'),words=el('div'),title=el('h2','',p.name);title.id='teamDialogTitle';
  words.append(el('p','kicker','2027 draft watch'),title,el('p','sub',`${p.position} · ${p.team?TEAMS[p.team].name:p.club} · ${p.level}`));if(p.team)hero.append(teamLogo(p.team));hero.append(words);body.append(hero);
  const board=el('div','prospect-board');board.append(el('strong','',`#${p.rank}`),el('span','','Prospect board'),el('small','',p.asOf));body.append(board,el('p','sub','A prospect board ranks the players an analyst expects NBA teams to want most. It is a projection that changes during the season, not the draft order.'));
  if(p.team)profileSchoolBridge(body,p.team);else body.append(el('p','sub',`${p.name} plays for ${p.club}, a professional club, so he is not in the college tournament.`));
  body.append(el('p','sub roster-note','Jeremy Woo · November 5, 2026. The bracket uses the 2026 tournament field as a stand-in for 2027.'));finishProfile();
}
// NBA alumni face-off: up to five former players per school, faces in circles. A school-pride graphic, never a lineup.
function faceoffPoster(a,b){
  const poster=el('div','alumni-poster');poster.append(el('p','kicker','NBA alumni face-off'),el('h4','',`${TEAMS[a].name} / ${TEAMS[b].name}`));
  const grid=el('div','alumni-matchup-grid');
  for(const id of [a,b]){const column=el('div','alumni-side');column.dataset.school=id;const head=el('div','alumni-side-head');head.append(teamLogo(id),el('b','',TEAMS[id].name));column.append(head);
    NBA_ALUMNI.filter(p=>p.team===id).slice(0,5).forEach(p=>{const btn=el('button','alumni-person');btn.type='button';btn.setAttribute('aria-label',`View ${p.name} profile`);btn.title=`${p.name} · NBA: ${nbaTeamLabel(p)} · ${NBA_TEAM_AS_OF}`;btn.append(alumniPortrait(p),el('span','',p.name));btn.addEventListener('click',()=>showAlumniProfile(p.id));column.append(btn);});column.append(schoolGamesButton(id));grid.append(column);}
  poster.append(grid,el('p','alumni-photo-credit','Former college players, not this season’s teams. Photos: NBA.'));return poster;
}
function faceoffReady(a,b){return a&&b&&schoolConnections(a).alumni.length>=2&&schoolConnections(b).alumni.length>=2;}
function showFaceoff(a,b){const body=prepareProfile(),title=el('h2','',`${TEAMS[a].name} vs. ${TEAMS[b].name}`);title.id='teamDialogTitle';title.className='visually-hidden';body.append(title,faceoffPoster(a,b));finishProfile();}
function renderNbaDiscovery(append=false){
  if(!$('nbaSchool').options.length)return;
  $('nbaSchool').value=nbaSchool;
  const box=$('nbaCards'),start=append?box.children.length:0;
  if(!append)box.textContent='';
  $('nbaScope').textContent=`${NBA_ALUMNI.length} NBA players from ${new Set(NBA_ALUMNI.map(p=>p.team)).size} schools in this bracket. Best-known names first.`;
  $('nbaTeamNote').textContent=`NBA teams checked ${NBA_TEAM_AS_OF}. A snapshot, not a live roster feed.`;
  for(const o of $('nbaSchool').options){const count=o.value==='all'?NBA_ALUMNI.length:schoolConnections(o.value).alumni.length;o.textContent=(o.value==='all'?'All schools':TEAMS[o.value].name)+(count?` · ${count}`:'');}
  const players=filterConnections(NBA_ALUMNI,TEAMS,nbaSchool,nbaQuery,ZH_COPY),shown=Math.min(nbaLimit,players.length);
  $('nbaCount').textContent=players.length?`Showing ${shown} of ${players.length} player${players.length===1?'':'s'}`:'No matching players';
  $('nbaMore').hidden=shown>=players.length;$('nbaMore').textContent=`Show ${Math.min(12,players.length-shown)} more players`;
  if(!players.length){const empty=el('div','card discovery-empty');empty.append(el('h4','','Try another name'),el('p','sub',nbaQuery?'Try a different name or clear the school filter.':'This school has no featured NBA alumni in this collection yet.'));
    const reset=el('button','btn','Show all players');reset.type='button';reset.addEventListener('click',()=>{nbaSchool='all';nbaQuery='';nbaLimit=12;$('nbaSearch').value='';renderNbaDiscovery();$('nbaSearch').focus();});empty.append(reset);
    if(nbaSchool!=='all'){const b=el('button','link','Open school profile');b.type='button';b.addEventListener('click',()=>showTeamProfile(nbaSchool));empty.append(b);}box.append(empty);return;}
  for(const p of players.slice(start,shown)){const card=el('article','card nba-card');
    // One tap target per player opens the profile; a single small link goes to the school's games.
    const main=el('button','nba-card-main');main.type='button';main.setAttribute('aria-label',`View ${p.name} profile`);main.addEventListener('click',()=>showAlumniProfile(p.id));
    const words=el('span','nba-card-words'),school=el('span','nba-school-name');school.append(teamLogo(p.team),document.createTextNode(TEAMS[p.team].name));
    words.append(el('b','',p.name),school,el('small','',`NBA: ${nbaTeamLabel(p)} · ${p.year} draft, No. ${p.pick}`));main.append(alumniPortrait(p),words);
    const games=el('button','link nba-games',`${TEAMS[p.team].name}’s games →`);games.type='button';games.addEventListener('click',()=>goSchoolGames(p.team));
    card.append(main,games);box.append(card);
  }
}
// Draft watch: ESPN's projected 2027 lottery range with each player's college, and the 2026 picks who played in this bracket.
let runCache=null;
function teamRun(id){
  // Map 2026 archive teams to field ids by region and seed (archive names are spelled differently, such as "Michigan St").
  if(!runCache){runCache={};const A=ARCHIVE['2026'],ids={};A.games.filter(g=>g.round===1).forEach(g=>g.teams.forEach(t=>{ids[t.id]=RX.find(X=>BR[X].name===g.region)+t.seed;}));
    A.games.forEach(g=>g.teams.forEach(t=>{const o=runCache[ids[t.id]]=runCache[ids[t.id]]||{last:0,won:true};o.last=Math.max(o.last,g.round);if(!t.won)o.won=false;}));}
  return runCache[id]||{last:0,won:false};
}
function runLabel(id){const r=teamRun(id);if(!r.last)return '';if(r.won&&r.last===6)return 'Won the 2026 title';return r.last===6?'Lost the 2026 final':`Out in the ${ROUND_NAME[r.last]}`;}
function draftLogo(p){const box=el('span','draft-logo');if(p.team)box.append(teamLogo(p.team));else box.append(el('span','draft-pro','PRO'));return box;}
function runBadge(id){const r=teamRun(id),label=runLabel(id),tone=r.won&&r.last===6?'gold':r.last>=5?'deep':r.last>=3?'mid':'early';return el('span',`run-badge ${tone}`,label);}
function renderDraftWatch(){
  document.querySelectorAll('[data-draft-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.draftView===draftView)));
  const board=$('draftList'),lottery=draftView==='lottery';board.textContent='';
  $('draftScope').textContent=lottery?'The NBA lottery is the first 14 picks. These are the 14 players Jeremy Woo ranks highest for 2027, and where they play now.':'25 of the 30 first-round picks in June 2026 played for teams in this bracket.';
  $('draftSource').textContent=lottery?'Source: Jeremy Woo’s prospect board, November 5, 2026. Board ranks are projections, not a mock draft or the draft order. The bracket uses the 2026 field.':'Source: Basketball Reference 2026 draft. Tournament runs from the official 2026 bracket.';
  const card=(p,top)=>{
    const li=el('li',`draft-card${top?' is-top':''}`),num=lottery?p.rank:p.pick;
    li.append(el('span','draft-rank',String(num)),draftLogo(p));
    const info=el('div','draft-info');info.append(el('b','',p.name),el('span','draft-school',p.team?TEAMS[p.team].name:`${p.club} · pro club`));
    const chips=el('span','draft-chips');
    if(lottery){chips.append(el('i','',p.position),el('i','',p.level));if(p.team)chips.append(el('i','seed-chip',`${TEAMS[p.team].seed} seed · ${BR[TEAMS[p.team].br].name}`));}
    else chips.append(el('i','',`No. ${p.pick} pick`),el('i','seed-chip',`${TEAMS[p.team].seed} seed`),runBadge(p.team));
    info.append(chips);li.append(info);
    if(p.team){const go=el('button','draft-go',lottery?'Profile →':'Games →');go.type='button';go.setAttribute('aria-label',lottery?`View ${p.name} profile`:`Go to ${TEAMS[p.team].name}’s games`);go.addEventListener('click',()=>lottery?showProspectProfile(p.name):goSchoolGames(p.team));li.append(go);}
    return li;
  };
  if(lottery){
    const top=el('ol','draft-top');top.setAttribute('aria-label','Top three on the board');DRAFT_WATCH.slice(0,3).forEach(p=>top.append(card(p,true)));
    const rest=el('ol','draft-grid');rest.start=4;rest.setAttribute('aria-label','Ranks 4 to 14');DRAFT_WATCH.slice(3).forEach(p=>rest.append(card(p,false)));
    board.append(top,rest);
  }else{
    const champs=FIRST_ROUND_2026.filter(p=>teamRun(p.team).won&&teamRun(p.team).last===6);
    if(champs.length){const note=el('p','draft-callout');note.append(el('b','',`${champs.length} first-round picks came from the champion, ${TEAMS[champs[0].team].name}.`),document.createTextNode(` ${champs.map(p=>p.name).join(', ')}.`));board.append(note);}
    const grid=el('ol','draft-grid');grid.setAttribute('aria-label','2026 first-round picks from this bracket');FIRST_ROUND_2026.forEach(p=>grid.append(card(p,false)));board.append(grid);
  }
}
function renderDiscoveryClips(){
  const clips=[
    {title:'Michigan’s 2026 title',poster:'images/moments/michigan-champions.jpg',video:'2ZLXQ62lWlQ',line:'One more win. One national champion.',game:5},
    {title:'Ten threes. One upset.',poster:'images/moments/oakland.jpg',video:'PwY129KC_30',line:'Oakland knocks out Kentucky in 2024.',game:0},
    {title:'Before the NBA: Curry',poster:'concepts/assets/curry.jpg',video:'tQN9hdPNVS4',line:'Davidson’s 2008 run. A historical NCAA story.',game:1}
  ];const box=$('discoveryClips');
  clips.forEach(c=>{const card=el('article','card clip-discovery');const img=el('img');img.src=c.poster;img.alt=c.title;img.width=480;img.height=270;img.loading='lazy';card.append(img,el('h4','',c.title),el('p','sub',c.line),discoveryLink('Watch official NCAA highlights ▶',`https://www.youtube.com/watch?v=${c.video}`));
    const tryIt=el('button','btn',c.title.includes('Curry')?'Try an underdog pick →':'Practice this game →');tryIt.type='button';tryIt.addEventListener('click',()=>{practiceIndex=c.game;renderPractice();navigateTo('learn',false);setCampMode('games');$('practiceLab').scrollIntoView({block:'start'});$('practiceTitle').focus({preventScroll:true});});card.append(tryIt);box.append(card);});
}
function initDiscovery(){
  document.querySelectorAll('[data-alumni-profile]').forEach(b=>b.addEventListener('click',()=>showAlumniProfile(b.dataset.alumniProfile)));
  const select=$('nbaSchool');select.append(el('option','','All schools'));select.firstChild.value='all';
  Object.values(TEAMS).sort((a,b)=>a.name.localeCompare(b.name)).forEach(t=>{const o=el('option','',t.name);o.value=t.id;select.append(o);});
  select.addEventListener('change',()=>{nbaSchool=select.value;nbaLimit=12;renderNbaDiscovery();});
  $('nbaSearch').addEventListener('input',()=>{nbaQuery=$('nbaSearch').value.trim();nbaLimit=12;renderNbaDiscovery();});
  $('nbaMore').addEventListener('click',()=>{const index=$('nbaCards').children.length;nbaLimit+=12;renderNbaDiscovery(true);$('nbaCards').children[index]?.querySelector('button')?.focus({preventScroll:true});});
  document.querySelectorAll('[data-draft-view]').forEach(b=>b.addEventListener('click',()=>{draftView=b.dataset.draftView;renderDraftWatch();}));
  document.querySelectorAll('[data-discover-go]').forEach(b=>b.addEventListener('click',()=>openDiscovery(b.dataset.discoverGo)));
  renderDiscoveryClips();
}
