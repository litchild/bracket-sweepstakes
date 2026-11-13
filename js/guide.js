// Guided learning, region discovery and school profiles. All content and assets load locally.
let mapMode = 'home', mapRegion = 'east', peekTimer, profileTrigger, discoverMode = 'players';
function teamLogo(id) {
  const img = document.createElement('img'); img.className = 'team-logo';
  img.src = `images/teams/${id}.png`; img.alt = ''; img.width = 28; img.height = 28;
  img.addEventListener('error', () => { img.hidden = true; });
  return img;
}
function navigateTo(tab, focus = true) {
  S.tab = tab;
  if (tab === 'bracket') store('bs-onboarding', { started: true });
  updateJourney(); renderAllLocal(); hideTeamPeek();
  if (focus) {
    const heading = document.querySelector(`#v-${tab} h2`);
    heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
    document.querySelector(`#v-${tab}`).scrollIntoView({ block: 'start' });
  }
}
function updateJourney() {
  document.body.dataset.page = S.tab;
  ['learn','explore','bracket','crowd','standings'].forEach(tab => { $(`v-${tab}`).hidden = S.tab !== tab; });
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)));
  document.querySelectorAll('[data-step]').forEach(b => {
    if (b.dataset.step === S.tab) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  document.querySelector('.journey').hidden = ['bracket','crowd','standings'].includes(S.tab);
  document.querySelector('.bar').hidden = S.tab !== 'bracket';
  document.querySelectorAll('.mobile-nav button').forEach(b=>{
    if (b.dataset.go === S.tab) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
}
function showTeamProfile(id) {
  const body = prepareProfile(), t = TEAMS[id], p = TEAM_PROFILES[id];
  addProfileTabs(body,id,'school');
  const head = el('div', 'profile-head');
  const names = el('div'); names.append(el('p', 'kicker', `#${t.seed} seed · ${BR[t.br].name} bracket`), el('h2', '', p.fullName)); names.lastChild.id = 'teamDialogTitle';
  head.append(teamLogo(id), names); body.append(head);
  body.append(el('p','sub',`${ROOTS[t.home].zh} ${ROOTS[t.home].name} school · ${t.seed<=4?'Top-four seed':t.seed>=12?'Underdog seed':'Middle seed'}`));
  const history = el('div', 'profile-records');
  for (const [label, record] of [['2025–26',p.recent],['2024–25',p.previous]]) {
    const item = el('div'); item.append(el('p','kicker',label),el('strong','',record || 'Unavailable'),el('small','','Wins–losses')); history.append(item);
  }
  body.append(history, el('p','sub roster-note','Archived record snapshots · ESPN'));
  if (PLAYER_PROFILES[id]) {
    const player=PLAYER_PROFILES[id], b=el('button','profile-player-row'); b.type='button';
    const words=el('span'); words.append(el('small','','Player to follow'),el('b','',player.name));
    b.append(playerPhoto(id),words,el('span','','→')); b.addEventListener('click',()=>showPlayerProfile(id)); body.append(b);
  }
  const link = el('a','link profile-link','Team & roster ↗'); link.href = p.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  body.append(link); finishProfile();
}
function playerPhoto(id) {
  const p=PLAYER_PROFILES[id], wrap=el('span','player-photo'); wrap.style.setProperty('--player-color',p.color);
  const fallback=el('span','photo-number',p.number); fallback.setAttribute('aria-hidden','true');
  const img=el('img'); img.src=p.photo; img.alt=p.name; img.width=320; img.height=400; img.loading='lazy'; img.decoding='async';
  img.addEventListener('error',()=>{img.hidden=true;}); wrap.append(fallback,img); return wrap;
}
function prepareProfile() {
  hideTeamPeek(); if(!$('teamDialog').open) profileTrigger=document.activeElement;
  const body=$('teamDialogBody'); body.textContent=''; return body;
}
function finishProfile() {
  const dialog=$('teamDialog'); if(!dialog.open) dialog.showModal(); dialog.scrollTop=0;
  $('teamDialogTitle').tabIndex=-1; $('teamDialogTitle').focus({preventScroll:true});
}
function addProfileTabs(body,id,active) {
  if(!PLAYER_PROFILES[id]) return;
  const tabs=el('div','profile-tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','Profile type');
  for(const [key,label] of [['school','School'],['player','Player']]) {
    const b=el('button','',label); b.type='button'; b.setAttribute('role','tab'); b.setAttribute('aria-selected',String(key===active));
    b.addEventListener('click',()=>{if(key==='school')showTeamProfile(id);else showPlayerProfile(id); $('teamDialogBody').querySelector('[aria-selected="true"]').focus();}); tabs.append(b);
  } body.append(tabs);
}
function showPlayerProfile(id) {
  const p=PLAYER_PROFILES[id], t=TEAMS[id], body=prepareProfile(); addProfileTabs(body,id,'player');
  const hero=el('div','player-hero'); hero.style.setProperty('--player-color',p.color);
  const words=el('div','player-hero-copy'); const name=el('h2','',p.name); name.id='teamDialogTitle';
  words.append(el('p','kicker',`${t.name} · #${p.number}`),name,el('p','',p.hometown)); hero.append(playerPhoto(id),words); body.append(hero);
  const facts=el('dl','player-facts');
  for(const [label,value] of [['Position',p.position],['Height',p.height],['Year',p.year]]) {const f=el('div');f.append(el('dt','',label),el('dd','',value));facts.append(f);} body.append(facts);
  body.append(el('p','player-story',p.story),el('p','kicker',p.statLabel));
  const stats=el('div','profile-records player-stats'); p.stats.forEach(([value,label])=>{const d=el('div');d.append(el('strong','',value),el('small','',label));stats.append(d);});body.append(stats);
  const fill=el('button','btn red player-pick',`Pick ${t.name} as champion`);fill.type='button';fill.disabled=locked();
  fill.addEventListener('click',()=>{$('teamDialog').close();navigateTo('bracket');fillWith('cn',id);});body.append(fill,el('p','sub roster-note','Auto-fills all 63 picks. You can edit each one.'));
  const source=el('a','link profile-link','Official player bio ↗');source.href=p.source;source.target='_blank';source.rel='noopener noreferrer';
  body.append(source,el('p','sub roster-note',`2026–27 roster · Photo: ${p.credit}`));finishProfile();
}
function renderPlayers() {
  const box=$('playerCards');box.textContent='';
  CN_IDS.forEach(id=>{const p=PLAYER_PROFILES[id],t=TEAMS[id],b=el('button','player-card');b.type='button';b.setAttribute('aria-label',`View ${p.name} player profile`);
    const art=el('span','player-card-art');art.append(playerPhoto(id),teamLogo(id));
    const copy=el('span','player-card-copy');copy.append(el('b','',p.name),el('span','',t.name),el('small','',`${p.position} · ${p.year}`));b.append(art,copy);b.addEventListener('click',()=>showPlayerProfile(id));box.append(b);
  });
}
function renderDiscovery() {
  $('discoverPlayers').hidden=discoverMode!=='players';$('discoverRegions').hidden=discoverMode!=='regions';
  document.querySelectorAll('[data-discover]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.discover===discoverMode)));
}
function hideTeamPeek() { clearTimeout(peekTimer); $('teamPeek').hidden = true; document.querySelectorAll('[aria-describedby="teamPeek"]').forEach(n=>n.removeAttribute('aria-describedby')); }
function attachTeamPeek(row, id) {
  const show = () => {
    if ($('teamDialog').open) return;
    clearTimeout(peekTimer);
    const t = TEAMS[id], p = TEAM_PROFILES[id], tip = $('teamPeek'); tip.textContent = '';
    tip.append(el('strong','',p.fullName),el('span','',`#${t.seed} seed · ${BR[t.br].name} tournament group`),el('span','',`Home: ${ROOTS[t.home].name}`),el('span','',`2024–25 snapshot: ${p.previous || 'unavailable'}`),el('span','',`2025–26 snapshot: ${p.recent || 'unavailable'}`),el('small','',CN_PLAYERS[id] ? `${CN_PLAYERS[id]} · 2026–27 roster` : 'Records show wins-losses. Tap ⓘ for more.'));
    tip.hidden = false; row.querySelector('button')?.setAttribute('aria-describedby','teamPeek');
    const r = row.getBoundingClientRect();
    tip.style.left = `${Math.max(8,Math.min(r.left,innerWidth-tip.offsetWidth-8))}px`;
    tip.style.top = `${r.top > tip.offsetHeight+12 ? r.top-tip.offsetHeight-6 : Math.min(innerHeight-tip.offsetHeight-8,r.bottom+6)}px`;
  };
  row.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) show(); });
  row.addEventListener('mouseleave', () => { peekTimer = setTimeout(hideTeamPeek,150); });
  row.addEventListener('focusin', e => { if (e.target.classList.contains('team-info')) show(); });
  row.addEventListener('focusout', hideTeamPeek);
}
function selectRegion(key) {
  if (mapRegion === key) return;
  mapRegion = key; renderRegion();
}
function renderRegion() {
  const home = mapMode === 'home', root = ROOTS[mapRegion];
  const bracketKey = {east:'E',west:'W',south:'S',midwest:'M'}[mapRegion];
  const teams = Object.values(TEAMS).filter(t => home ? t.home === mapRegion : t.br === bracketKey).sort((a,b)=>a.seed-b.seed || a.name.localeCompare(b.name));
  $('regionTitle').textContent = `${root.zh} ${root.name}`;
  $('regionCount').textContent = `${teams.length} schools · ${home ? 'Home region' : 'Tournament group'}`;
  $('regionExplanation').textContent = home ? 'Where schools are based. Tap a region to explore.' : 'Who plays whom. Each group sends one team to the Final Four.';
  $('homeMap').hidden = !home; $('tournamentGroups').hidden = home;
  document.querySelectorAll('[data-region]').forEach(g=>g.setAttribute('aria-pressed',String(g.dataset.region === mapRegion)));
  document.querySelectorAll('[data-map-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapChoice === mapRegion)));
  const story = $('regionStory'); story.textContent = '';
  if (home) {
    story.append(el('p','sub',root.see));
    const detail=el('details','region-details');detail.append(el('summary','','Regional ambassadors'),el('p','',root.guides));story.append(detail);
    const fill = el('button','btn',`Pick for the ${root.name}`); fill.type='button'; fill.disabled=locked();
    fill.addEventListener('click',()=>{ navigateTo('bracket'); fillWith(mapRegion,null); }); story.append(fill);
    story.append(el('p','sub','Auto-fills 63 picks for this region. Edit any game.'));
  } else story.append(el('p','sub',`${root.name}: 16 teams → 1 Final Four place`));
  const list=$('regionTeams'); list.textContent='';
  teams.forEach(t=>{
    const b=el('button','school-item'); b.type='button';
    const words=el('span'); words.append(el('b','',t.name),el('small','',home ? `${BR[t.br].name} tournament group · #${t.seed} seed` : `${ROOTS[t.home].name} school · #${t.seed} seed`));
    b.append(teamLogo(t.id),words); if(CN_PLAYERS[t.id]) b.append(cnBadge()); b.append(el('span','school-arrow','→'));
    b.addEventListener('click',()=>showTeamProfile(t.id)); list.append(b);
  });
}
function initGuide() {
  const onboard=load('bs-onboarding'); S.tab = countPicks(S.picks) || onboard?.started ? 'bracket' : 'learn';
  // Class-demo controls follow the main bracket rather than preceding a fan's first game.
  $('v-bracket').append($('pass'));
  document.querySelectorAll('[data-go],[data-step]').forEach(b=>b.addEventListener('click',()=>navigateTo(b.dataset.go || b.dataset.step)));
  document.addEventListener('keydown',e=>{
    const list=e.target.closest('[role="tablist"]'); if(!list)return;
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    const tabs=[...list.querySelectorAll('[role="tab"]')], index=tabs.indexOf(e.target);
    if(index<0 || !tabs.length) return;
    e.preventDefault();
    const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    tabs[next].click(); list.querySelectorAll('[role="tab"]')[next]?.focus({preventScroll:true});
  });
  document.querySelectorAll('[data-discover]').forEach(b=>b.addEventListener('click',()=>{discoverMode=b.dataset.discover;renderDiscovery();}));
  document.querySelectorAll('[data-practice]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-practice]').forEach(x=>x.setAttribute('aria-pressed',String(b===x)));
    $('practiceFeedback').textContent = b.dataset.practice === 'underdog' ? 'Northern Iowa advances. A lower-ranked team beating a favorite is an upset.' : "St. John's advances. You've made your first pick.";
    $('practiceFeedback').classList.add('complete');
  }));
  document.querySelectorAll('[data-map-mode]').forEach(b=>b.addEventListener('click',()=>{
    mapMode=b.dataset.mapMode; document.querySelectorAll('[data-map-mode]').forEach(x=>x.setAttribute('aria-selected',String(x===b))); renderRegion();
  }));
  ROOT_ORDER.forEach(k=>{
    const b=el('button','pill',`${ROOTS[k].zh} ${ROOTS[k].name}`); b.type='button'; b.dataset.mapChoice=k; b.addEventListener('click',()=>selectRegion(k)); $('mapButtons').append(b);
    const g=el('button','tournament-group'); g.type='button'; g.dataset.mapChoice=k; g.append(el('b','',ROOTS[k].name),el('span','','16 teams'),el('strong','','↓'),el('span','','1 Final Four place')); g.addEventListener('click',()=>selectRegion(k)); $('tournamentGroups').append(g);
  });
  document.querySelectorAll('[data-region]').forEach(g=>{
    g.addEventListener('mouseenter',()=>{ if(matchMedia('(hover: hover)').matches) selectRegion(g.dataset.region); });
    g.addEventListener('focus',()=>selectRegion(g.dataset.region)); g.addEventListener('click',()=>selectRegion(g.dataset.region));
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRegion(g.dataset.region);} });
  });
  $('teamDialogClose').addEventListener('click',()=>$('teamDialog').close());
  $('teamDialog').addEventListener('close',()=>{ if(profileTrigger?.isConnected) profileTrigger.focus({preventScroll:true}); hideTeamPeek(); });
  $('teamPeek').addEventListener('mouseenter',()=>clearTimeout(peekTimer)); $('teamPeek').addEventListener('mouseleave',hideTeamPeek);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTeamPeek();});
  window.addEventListener('scroll',hideTeamPeek,true); window.addEventListener('resize',hideTeamPeek);
  renderPlayers(); renderDiscovery(); renderRegion(); updateJourney();
}
