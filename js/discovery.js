// NBA connections are a discovery route into school picks, never a fantasy-player bracket.
let nbaView='alumni',nbaSchool='all';
function discoveryLink(text,url){const a=el('a','link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function alumniPortrait(player){const wrap=el('span','alumni-face'),initials=el('span','',player.name.split(' ').map(s=>s[0]).slice(0,2).join(''));initials.setAttribute('aria-hidden','true');wrap.append(initials);const img=el('img');img.src=player.photo;img.alt=player.name;img.width=130;img.height=95;img.loading='lazy';img.addEventListener('error',()=>{img.hidden=true;});wrap.append(img);return wrap;}
function goSchoolGames(team){if($('teamDialog').open)$('teamDialog').close();S.br=TEAMS[team].br;S.round=1;navigateTo('bracket',false);renderBTabs();renderBracket();$('btabs').scrollIntoView({block:'start'});$('btabs').querySelector('[aria-selected="true"]')?.focus({preventScroll:true});}
function schoolGamesButton(id){const b=el('button','btn',`Go to ${TEAMS[id].name}’s games →`);b.type='button';b.addEventListener('click',()=>goSchoolGames(id));return b;}
function openDiscovery(mode,school='all'){nbaSchool=school;if(mode==='nba')nbaView='alumni';discoverMode=mode;renderDiscovery();navigateTo('explore');}
function appendSchoolConnections(body,id){
  const data=schoolConnections(id),section=el('section','school-connections');section.append(el('h3','','NBA roots & draft watch'));
  const alumni=el('div');alumni.append(el('p','kicker','Notable alumni'));
  alumni.append(el('p','sub',data.alumni.length?data.alumni.map(p=>p.name).join(' · '):'No featured alumni in this curated collection yet.'));
  const watch=el('div');watch.append(el('p','kicker','2027 prospects · November 5, 2026'));
  watch.append(el('p','sub',data.prospects.length?data.prospects.map(p=>`${p.name} · board rank ${p.rank}`).join(' / '):'No featured prospect in this watchlist snapshot.'));
  const more=el('button','link',`Explore ${TEAMS[id].name}’s NBA connections →`);more.type='button';more.addEventListener('click',()=>{$('teamDialog').close();openDiscovery('nba',id);});
  section.append(alumni,watch,more,el('small','sub','Alumni are former students. Prospect ranks are projections, not confirmed picks.'));body.append(section);
}
function renderStartingFive(){
  const host=$('startingFive');host.textContent='';const details=el('details','alumni-matchup');details.id='alumniMatchup';
  details.append(el('summary','','Starting 5 · Duke vs. Kentucky alumni'));
  const poster=el('div','alumni-poster');poster.append(el('p','kicker','School pride · NBA alumni edition'),el('h4','','DUKE / KENTUCKY'),el('p','alumni-warning','Five notable alumni per school. They are former players, not the college teams in your bracket.'));
  const grid=el('div','alumni-matchup-grid');
  for(const id of ['E1','M7']){const column=el('div','alumni-side');column.dataset.school=id;const head=el('div','alumni-side-head');head.append(teamLogo(id),el('b','',TEAMS[id].name));column.append(head);
    NBA_ALUMNI.filter(p=>p.team===id).slice(0,5).forEach(p=>{const figure=el('figure','alumni-person');figure.append(alumniPortrait(p),el('figcaption','',p.name));column.append(figure);});column.append(schoolGamesButton(id));grid.append(column);}
  poster.append(grid,el('p','alumni-photo-credit','Photos: NBA · Curated alumni selection, not a ranking or predicted lineup. Duke and Kentucky are in different 2026 tournament groups.'));
  details.append(poster);host.append(details);
}
function renderNbaDiscovery(){
  if(!$('nbaSchool').options.length)return;
  $('nbaSchool').value=nbaSchool;
  document.querySelectorAll('[data-nba-view]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.nbaView===nbaView)));
  const box=$('nbaCards');box.textContent='';const watch=nbaView==='watch';
  $('nbaScope').textContent=watch?'2027 prospect watch · Board ranks, not predicted pick numbers · ESPN / Jeremy Woo, November 5, 2026. This demo still uses the 2026 tournament field.':nbaView==='past'?'Past NBA draft selections · Historical year and pick. These players are alumni, not current college participants.':'Follow a familiar name to his college team. Alumni are former students; you predict the college teams, not these players.';
  const players=(watch?DRAFT_WATCH:NBA_ALUMNI).filter(p=>nbaSchool==='all'||p.team===nbaSchool);
  if(!players.length){box.append(el('p','card sub','No featured '+(watch?'prospects':'alumni')+' for this school in the curated collection. Explore its school profile or choose another school.'));if(nbaSchool!=='all'){const b=el('button','btn','Open school profile');b.type='button';b.addEventListener('click',()=>showTeamProfile(nbaSchool));box.append(b);}return;}
  for(const p of players){const card=el('article','card nba-card');
    if(watch)card.append(teamLogo(p.team),el('p','kicker',`2027 watch · Board #${p.rank}`));else card.append(alumniPortrait(p),el('p','kicker',nbaView==='past'?`${p.year} NBA draft · Pick ${p.pick}`:'Notable NBA alumnus'));
    card.append(el('h4','',p.name),el('b','nba-school-name',TEAMS[p.team].name));
    if(!watch&&nbaView==='alumni')card.append(el('p','sub',`${p.year} draft · No. ${p.pick} pick`));
    card.append(schoolGamesButton(p.team));const profile=el('button','link','School profile & connections');profile.type='button';profile.addEventListener('click',()=>showTeamProfile(p.team));card.append(profile,discoveryLink(watch?'Dated prospect board ↗':'NBA bio & draft source ↗',p.source));box.append(card);
  }
  if(watch)box.append(discoveryLink('Full 2027 board · November 5, 2026 ↗',DRAFT_SOURCE));
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
  const select=$('nbaSchool');select.append(el('option','','All featured schools'));select.firstChild.value='all';
  Object.values(TEAMS).sort((a,b)=>a.name.localeCompare(b.name)).forEach(t=>{const o=el('option','',t.name);o.value=t.id;select.append(o);});
  select.addEventListener('change',()=>{nbaSchool=select.value;renderNbaDiscovery();});
  document.querySelectorAll('[data-nba-view]').forEach(b=>b.addEventListener('click',()=>{nbaView=b.dataset.nbaView;renderNbaDiscovery();}));
  document.querySelectorAll('[data-discover-go]').forEach(b=>b.addEventListener('click',()=>openDiscovery(b.dataset.discoverGo)));
  $('bracketAlumni').addEventListener('click',()=>{openDiscovery('nba');$('alumniMatchup').open=true;$('startingFive').scrollIntoView({block:'start'});});
  $('chineseRosterFilter').addEventListener('change',renderRegion);renderStartingFive();renderDiscoveryClips();
}
