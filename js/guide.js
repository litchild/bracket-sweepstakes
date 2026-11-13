// Guided learning, region discovery and school profiles. All content and assets load locally.
let mapMode = 'home', mapRegion = 'east', peekTimer, profileTrigger;
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
    document.querySelector('.journey').scrollIntoView({ block: 'start' });
  }
}
function updateJourney() {
  ['learn','explore','bracket','crowd','standings'].forEach(tab => { $(`v-${tab}`).hidden = S.tab !== tab; });
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)));
  document.querySelectorAll('[data-step]').forEach(b => {
    if (b.dataset.step === S.tab) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  document.querySelector('.journey').hidden = ['crowd','standings'].includes(S.tab);
  document.querySelector('.bar').hidden = S.tab !== 'bracket';
}
function recordWords(record) {
  if (!record) return 'Record unavailable';
  const [wins, losses] = record.split('-'); return `${wins} wins · ${losses} losses`;
}
function showTeamProfile(id) {
  hideTeamPeek(); profileTrigger = document.activeElement;
  const t = TEAMS[id], p = TEAM_PROFILES[id], body = $('teamDialogBody'); body.textContent = '';
  const head = el('div', 'profile-head');
  const names = el('div'); names.append(el('p', 'kicker', 'Meet the school'), el('h2', '', p.fullName)); names.lastChild.id = 'teamDialogTitle';
  head.append(teamLogo(id), names); body.append(head);
  const badges = el('div', 'profile-tags'); badges.append(el('span', 'pill', `#${t.seed} seed`), el('span', 'pill', `${BR[t.br].name} tournament group`), el('span', 'pill', `${ROOTS[t.home].zh} ${ROOTS[t.home].name} home region`)); body.append(badges);
  body.append(el('p', '', `${t.name} enters this prototype as a No. ${t.seed} seed in the ${BR[t.br].name} group. ${t.seed <= 4 ? 'A top-four seed is one of the higher-ranked teams in its group.' : t.seed >= 12 ? 'A lower-ranked team can become an upset story by beating a higher-ranked opponent.' : 'Middle seeds can face closely matched opponents early in the bracket.'}`));
  const history = el('div', 'profile-records');
  for (const [label, record] of [['2024–25 · Recent history',p.previous],['2025–26 · Recent form',p.recent]]) {
    const item = el('div'); item.append(el('p','kicker',label),el('strong','',recordWords(record))); history.append(item);
  }
  body.append(history, el('p','sub','Archived season records from ESPN. These are source snapshots, not live standings or final tournament results. Records include wins and losses; they do not guarantee a future result.'));
  if (CN_PLAYERS[id]) {
    const cn = el('p', 'player-callout'); cn.append(cnBadge(), document.createTextNode(` Follow ${CN_PLAYERS[id]}, listed on the 2026–27 roster. This prototype places that roster connection in the 2026 tournament field.`)); body.append(cn);
  }
  const link = el('a','btn profile-link','Team news, roster & results ↗'); link.href = p.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  body.append(link, el('p','sub','Opens ESPN in a new tab. External sites may be slower to access in mainland China.'));
  $('teamDialog').showModal(); $('teamDialogClose').focus();
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
  $('regionExplanation').textContent = home ? 'Home regions tell you where schools are based. A school can play in a differently named tournament group: Purdue is a Midwest school in the West bracket.' : 'The NCAA places teams into four balanced tournament groups, considering seeding, geography, and matchup rules. Each has 16 teams ranked 1–16. Each group winner reaches the Final Four. These groups are not maps of school locations.';
  $('homeMap').hidden = !home; $('tournamentGroups').hidden = home;
  document.querySelectorAll('[data-region]').forEach(g=>g.setAttribute('aria-pressed',String(g.dataset.region === mapRegion)));
  document.querySelectorAll('[data-map-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapChoice === mapRegion)));
  const story = $('regionStory'); story.textContent = '';
  if (home) {
    story.append(el('h4','',`A taste of the ${root.name}`),el('p','sub',root.see),el('p','sub',`Meet the ambassadors: ${root.guides}`));
    const fill = el('button','btn',`Root for the ${root.name} & auto-fill`); fill.type='button'; fill.disabled=locked();
    fill.addEventListener('click',()=>{ navigateTo('bracket'); fillWith(mapRegion,null); }); story.append(fill);
    story.append(el('p','sub','Replaces your current picks. This region’s schools advance whenever they meet a school from another region. You can edit every pick.'));
  } else story.append(el('h4','',`${root.name}: 16 teams → 1 Final Four place`),el('p','sub','First-round matchups pair 1 vs 16, 8 vs 9, 5 vs 12, 4 vs 13, 6 vs 11, 3 vs 14, 7 vs 10, and 2 vs 15.'));
  const list=$('regionTeams'); list.textContent='';
  teams.forEach(t=>{
    const b=el('button','school-item'); b.type='button';
    const words=el('span'); words.append(el('b','',t.name),el('small','',home ? `${BR[t.br].name} tournament group · #${t.seed} seed` : `${ROOTS[t.home].name} school · #${t.seed} seed`));
    b.append(teamLogo(t.id),words); if(CN_PLAYERS[t.id]) b.append(cnBadge()); b.append(el('span','school-arrow','↗'));
    b.addEventListener('click',()=>showTeamProfile(t.id)); list.append(b);
  });
}
function initGuide() {
  const onboard=load('bs-onboarding'); S.tab = countPicks(S.picks) || onboard?.started ? 'bracket' : 'learn';
  document.querySelectorAll('[data-go],[data-step]').forEach(b=>b.addEventListener('click',()=>navigateTo(b.dataset.go || b.dataset.step)));
  document.querySelectorAll('[role="tablist"]').forEach(list=>list.addEventListener('keydown',e=>{
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    const tabs=[...list.querySelectorAll('[role="tab"]')], index=tabs.indexOf(e.target);
    if(index<0 || !tabs.length) return;
    e.preventDefault();
    const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    tabs[next].click(); list.querySelectorAll('[role="tab"]')[next]?.focus({preventScroll:true});
  }));
  document.querySelectorAll('[data-practice]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-practice]').forEach(x=>x.setAttribute('aria-pressed',String(b===x)));
    $('practiceFeedback').textContent = b.dataset.practice === 'underdog' ? 'Upset called! If the No. 12 seed wins, it advances and you earn points. That surprise is part of March Madness. Your practice pick is complete.' : 'Favorite picked! If the No. 5 seed wins, it advances and you earn points. Higher-ranked teams can still lose. Your practice pick is complete.';
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
  renderRegion(); updateJourney();
}
