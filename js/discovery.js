// NBA connections are a discovery route into school picks, never a fantasy-player bracket.
let nbaView='alumni',nbaSchool='all',nbaQuery='',nbaLimit=12;
function discoveryLink(text,url){const a=el('a','link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function alumniPortrait(player){const wrap=el('span','alumni-face'),initials=el('span','',player.name.split(' ').map(s=>s[0]).slice(0,2).join(''));initials.setAttribute('aria-hidden','true');wrap.append(initials);const img=el('img');img.src=player.photo;img.alt=player.name;img.width=130;img.height=95;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>{img.hidden=true;});wrap.append(img);return wrap;}
function goSchoolGames(team){if($('teamDialog').open)$('teamDialog').close();S.br=TEAMS[team].br;S.round=1;navigateTo('bracket',false);renderBTabs();renderBracket();$('btabs').scrollIntoView({block:'start'});$('btabs').querySelector('[aria-selected="true"]')?.focus({preventScroll:true});}
function schoolGamesButton(id){const b=el('button','btn',`Go to ${TEAMS[id].name}’s games`);b.type='button';b.addEventListener('click',()=>goSchoolGames(id));return b;}
function openDiscovery(mode,school='all'){nbaSchool=school;nbaQuery='';nbaLimit=12;$('nbaSearch').value='';if(mode==='nba')nbaView='alumni';discoverMode=mode;renderDiscovery();navigateTo('explore');}
function alumniRow(p){const b=el('button','connection-row');b.type='button';const words=el('span');words.append(el('b','',p.name),el('small','',`${p.year} NBA draft · Pick ${p.pick}`));b.append(alumniPortrait(p),words);b.setAttribute('aria-label',`View ${p.name} profile`);b.addEventListener('click',()=>showAlumniProfile(p.id));return b;}
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
  const t=TEAMS[id],bridge=el('section','profile-school-bridge'),words=el('div');words.append(el('p','kicker','Your college connection'),el('h3','',t.name),el('p','sub',`2026 demo field · Seed ${t.seed} · ${BR[t.br].name} bracket`));
  bridge.append(teamLogo(id),words);
  const actions=el('div','profile-actions');actions.append(schoolGamesButton(id));const school=el('button','link','Explore school profile');school.type='button';school.addEventListener('click',()=>showTeamProfile(id));actions.append(school);bridge.append(actions);body.append(bridge);
}
function showAlumniProfile(id){
  const p=NBA_ALUMNI.find(p=>p.id===id);if(!p)return;
  const body=prepareProfile(),hero=el('div','alumni-profile-hero'),words=el('div'),title=el('h2','',p.name);title.id='teamDialogTitle';
  words.append(el('p','kicker','NBA roots · Former college player'),title,el('p','',`${TEAMS[p.team].name} alumnus`));hero.append(alumniPortrait(p),words);body.append(hero);
  const facts=el('dl','player-facts alumni-facts');
  for(const [label,value] of [['Position',p.position],['Height',p.height]]){const f=el('div');f.append(el('dt','',label),el('dd','',value));facts.append(f);}body.append(facts);
  const path=el('section','alumni-path');path.append(el('h3','','College to the NBA'));
  const steps=el('ol');for(const [label,text] of [['College',TEAMS[p.team].name],['NBA draft',`${p.year} · Round ${p.pick<=30?1:2} · Pick ${p.pick}`],['Your bracket',`Follow ${TEAMS[p.team].name}’s college team`]]){const li=el('li');li.append(el('small','',label),el('b','',text));steps.append(li);}path.append(steps);body.append(path);
  profileSchoolBridge(body,p.team);
  const others=schoolConnections(p.team).alumni.filter(other=>other.id!==id);
  if(others.length){const related=el('section','school-connections');related.append(el('h3','',`More from ${TEAMS[p.team].name}`));const list=el('div','related-alumni');others.forEach(other=>list.append(alumniRow(other)));related.append(list);body.append(related);}
  body.append(discoveryLink('Official NBA biography & draft record',p.source),el('p','sub roster-note','Bio snapshot: November 23, 2026 · Photo: NBA. These alumni are former college players. Your picks follow the college teams in the demo field.'));finishProfile();
}
function showProspectProfile(name){
  const p=DRAFT_WATCH.find(p=>p.name===name);if(!p)return;
  const body=prepareProfile(),hero=el('div','profile-head'),words=el('div'),title=el('h2','',p.name);title.id='teamDialogTitle';
  words.append(el('p','kicker','2027 draft watch'),title,el('p','sub',TEAMS[p.team].name));hero.append(teamLogo(p.team),words);body.append(hero);
  const board=el('div','prospect-board');board.append(el('strong','',`#${p.rank}`),el('span','','Prospect board rank'),el('small','',p.asOf));body.append(board,el('p','sub','A prospect board ranks players an analyst is watching for the NBA draft. Rankings can change. This is a dated projection, not a draft result.'));
  profileSchoolBridge(body,p.team);
  body.append(discoveryLink('Read Jeremy Woo’s full prospect board',p.source),el('p','sub roster-note','ESPN / Jeremy Woo · November 5, 2026. The bracket uses the 2026 tournament field, separate from this 2027 watchlist.'));finishProfile();
}
function renderStartingFive(){
  const host=$('startingFive');host.textContent='';const details=el('details','alumni-matchup');details.id='alumniMatchup';details.append(el('summary','','Starting 5 · Duke vs. Kentucky alumni'));
  const poster=el('div','alumni-poster');poster.append(el('p','kicker','School pride · NBA alumni edition'),el('h4','','DUKE / KENTUCKY'),el('p','alumni-warning','Tap a face to explore. Former players, not the college teams in your bracket.'));
  const grid=el('div','alumni-matchup-grid');
  for(const id of ['E1','M7']){const column=el('div','alumni-side');column.dataset.school=id;const head=el('div','alumni-side-head');head.append(teamLogo(id),el('b','',TEAMS[id].name));column.append(head);
    NBA_ALUMNI.filter(p=>p.team===id).slice(0,5).forEach(p=>{const b=el('button','alumni-person');b.type='button';b.setAttribute('aria-label',`View ${p.name} profile`);b.append(alumniPortrait(p),el('span','',p.name));b.addEventListener('click',()=>showAlumniProfile(p.id));column.append(b);});column.append(schoolGamesButton(id));grid.append(column);}
  poster.append(grid,el('p','alumni-photo-credit','Photos: NBA · Curated alumni selection, not a ranking or predicted lineup. Duke and Kentucky are in different 2026 tournament groups.'));details.append(poster);host.append(details);
}
function renderNbaDiscovery(append=false){
  if(!$('nbaSchool').options.length)return;
  $('nbaSchool').value=nbaSchool;
  document.querySelectorAll('[data-nba-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.nbaView===nbaView)));
  const box=$('nbaCards'),watch=nbaView==='watch',start=append?box.children.length:0;
  if(!append)box.textContent='';
  $('nbaScope').textContent=watch?'2027 watch · Dated board ranks, not draft results · ESPN / Jeremy Woo, November 5, 2026.':nbaView==='past'?'Historical NBA draft selections. Tap a profile to trace the school connection.':`${NBA_ALUMNI.length} players. ${new Set(NBA_ALUMNI.map(p=>p.team)).size} schools. Find a familiar face, then meet his college team.`;
  for(const o of $('nbaSchool').options){const count=o.value==='all'?(watch?DRAFT_WATCH:NBA_ALUMNI).length:schoolConnections(o.value)[watch?'prospects':'alumni'].length;o.textContent=(o.value==='all'?'All featured schools':TEAMS[o.value].name)+` · ${count} ${watch?'prospects':'players'}`;}
  const schools=[...new Set(NBA_ALUMNI.map(p=>p.team))],groups=schools.map(id=>schoolConnections(id).alumni);
  const browse=Array.from({length:Math.max(...groups.map(g=>g.length))},(_,i)=>groups.map(g=>g[i]).filter(Boolean)).flat();
  const players=filterConnections(watch?DRAFT_WATCH:browse,TEAMS,nbaSchool,nbaQuery),shown=Math.min(nbaLimit,players.length);
  $('nbaCount').textContent=players.length?`Showing ${shown} of ${players.length} ${watch?'prospect':'player'}${players.length===1?'':'s'}`:'No matching players';
  $('nbaMore').hidden=shown>=players.length;$('nbaMore').textContent=`Show ${Math.min(12,players.length-shown)} more players`;
  if(!players.length){const empty=el('div','card discovery-empty');empty.append(el('h4','','Try another connection'),el('p','sub',nbaQuery?'Try a different name or clear the school filter.':'This school has no featured players in this curated collection yet.'));
    const reset=el('button','btn','Show all players');reset.type='button';reset.addEventListener('click',()=>{nbaSchool='all';nbaQuery='';nbaLimit=12;$('nbaSearch').value='';renderNbaDiscovery();$('nbaSearch').focus();});empty.append(reset);
    if(nbaSchool!=='all'){const b=el('button','link','Open school profile');b.type='button';b.addEventListener('click',()=>showTeamProfile(nbaSchool));empty.append(b);}box.append(empty);return;}
  for(const p of players.slice(start,shown)){const card=el('article','card nba-card');
    if(watch)card.append(teamLogo(p.team),el('p','kicker',`2027 watch · Board #${p.rank}`));else card.append(alumniPortrait(p),el('p','kicker',nbaView==='past'?`${p.year} NBA draft · Pick ${p.pick}`:p.position));
    const schoolName=el('b','nba-school-name');schoolName.append(teamLogo(p.team),document.createTextNode(TEAMS[p.team].name));
    card.append(el('h4','',p.name),schoolName);
    if(!watch)card.append(el('p','sub',`${p.year} draft · No. ${p.pick} pick`));
    const profile=el('button','btn','View player profile');profile.type='button';profile.setAttribute('aria-label',`View ${p.name} profile`);profile.addEventListener('click',()=>watch?showProspectProfile(p.name):showAlumniProfile(p.id));
    const school=el('button','link',`${TEAMS[p.team].name} school profile`);school.type='button';school.addEventListener('click',()=>showTeamProfile(p.team));card.append(profile,school);box.append(card);
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
  const select=$('nbaSchool');select.append(el('option','','All featured schools'));select.firstChild.value='all';
  Object.values(TEAMS).sort((a,b)=>a.name.localeCompare(b.name)).forEach(t=>{const o=el('option','',t.name);o.value=t.id;select.append(o);});
  select.addEventListener('change',()=>{nbaSchool=select.value;nbaLimit=12;renderNbaDiscovery();});
  document.querySelectorAll('[data-nba-view]').forEach(b=>b.addEventListener('click',()=>{nbaView=b.dataset.nbaView;nbaLimit=12;renderNbaDiscovery();}));
  $('nbaSearch').addEventListener('input',()=>{nbaQuery=$('nbaSearch').value;nbaLimit=12;renderNbaDiscovery();});
  $('nbaMore').addEventListener('click',()=>{const index=$('nbaCards').children.length;nbaLimit+=12;renderNbaDiscovery(true);$('nbaCards').children[index]?.querySelector('button')?.focus({preventScroll:true});});
  document.querySelectorAll('[data-discover-go]').forEach(b=>b.addEventListener('click',()=>openDiscovery(b.dataset.discoverGo)));
  $('bracketAlumni').addEventListener('click',()=>{openDiscovery('nba');$('alumniMatchup').open=true;$('startingFive').scrollIntoView({block:'start'});});
  $('chineseRosterFilter').addEventListener('change',renderRegion);renderStartingFive();renderDiscoveryClips();
}
