// Browser-rendered bracket and crowd views for the shared friends pilot.
// Depends on globals from js/logic.js.


// ---------- state ----------
const S = {
  tab: "bracket", br: "E", cbr: "E",
  root: null, cnTeam: null, star: null, picks: {}, mode: "manual", helpOpen: false, helpTab: "random",
  dbState: "connecting", busy:false, winners:{},
  round: 1, seedOpen: false, fullBracket: true
};
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString("en-US");
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function load(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
const draft = load("bs-draft");
if (draft && draft.picks) { S.picks = draft.picks; S.root = draft.root || null; S.cnTeam = draft.cnTeam || null; S.star = draft.star || null; S.mode = draft.mode || "manual"; }
function saveDraft() { recordProgress(countPicks(S.picks)); store("bs-draft", { picks: S.picks, root: S.root, cnTeam: S.cnTeam, star: S.star, mode: S.mode }); }
function locked() { return pilot.closed || Date.now() >= Date.parse(pilot.closesAt); }

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function teamColor(t) { return `var(${ROOTS[t.home].color})`; }
// translate="no" keeps browser page translation from turning 中 into "middle".
function cnBadge() { const b = el("span", "cnb"), z = el("span", null, "中"); z.setAttribute("translate", "no"); b.append(z); b.title = "Chinese player on the roster"; return b; }
function zhSpan(k, extra) { const z = el("span", "zh", ROOTS[k].zh + (extra || "")); z.style.setProperty("--c", `var(${ROOTS[k].color})`); return z; }
function homeCount(k) { return Object.values(TEAMS).filter(t => t.home === k).length; }
function isMine(tid) { if (S.root === "star") return tid === S.cnTeam; if (S.root === "cn") return tid in CN_PLAYERS; if (S.root && ROOTS[S.root]) return TEAMS[tid].home === S.root; return false; }
function fanText(root, cnTeam) {
  if (root === "cn") return `Chinese players${cnTeam && TEAMS[cnTeam] ? ` (${TEAMS[cnTeam].name})` : ""}`;
  if (root === "star") return `an NBA star’s school${cnTeam && TEAMS[cnTeam] ? ` (${TEAMS[cnTeam].name})` : ""}`;
  if (root && ROOTS[root]) return `${ROOTS[root].zh} ${ROOTS[root].name}`;
  return "Own picks";
}
function fanTag(root, cnTeam) {
  const s = el("span", "tagline");
  if (root === "cn") { s.append(cnBadge(), document.createTextNode(fanText(root, cnTeam))); }
  else if (root && ROOTS[root]) { s.append(zhSpan(root), document.createTextNode(ROOTS[root].name)); }
  else if (root === "star") s.textContent = cnTeam && TEAMS[cnTeam] ? `NBA star’s school (${TEAMS[cnTeam].name})` : "NBA star’s school";
  else s.textContent = "Own picks";
  return s;
}

// ---------- header ----------
function renderLive() {
  const N = pilot.board.length;
  $("liveWord").textContent = locked() ? "Closed" : "Open";
  $("eyeTxt").textContent = "March Madness 2026";
  if (S.dbState === "connecting") { $("liveN").textContent = "–"; $("liveL").textContent = "Connecting…"; }
  else if (S.dbState === "off") { $("liveN").textContent = "–"; $("liveL").textContent = "Shared entries unavailable here"; }
  else { $("liveN").textContent = fmt(N); $("liveL").textContent = `bracket${N === 1 ? "" : "s"} entered`; }
}

// ---------- seed definition ----------
function renderSeedTip() { $("seedBtn").setAttribute("aria-expanded", String(S.seedOpen)); $("seedTip").hidden = !S.seedOpen; }
$("seedBtn").addEventListener("click", () => { S.seedOpen = !S.seedOpen; renderSeedTip(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && S.seedOpen) { S.seedOpen = false; renderSeedTip(); $("seedBtn").focus(); } });

// ---------- helper (auto-fill) ----------
function helperSummary() {
  if (S.root === "cn" && S.cnTeam) { const t = TEAMS[S.cnTeam]; return { title: `${t.name} is your champion`, sub: `${CN_PLAYERS[S.cnTeam]} · Edit any pick below.` }; }
  if (S.root && ROOTS[S.root]) { const r = ROOTS[S.root]; return { title: `Rooting for ${r.zh} ${r.name}`, sub: "Bracket filled. Edit any pick below." }; }
  if (S.root === "star" && S.cnTeam) { const t = TEAMS[S.cnTeam], p = NBA_ALUMNI.find(x => x.id === S.star); return { title: `${t.name} is your champion`, sub: `${p ? `${p.name}’s school` : "Your star’s school"} wins every game. Edit any pick below.` }; }
  if (S.mode === "seed") return { title: "Filled randomly", sub: "Edit any pick below." };
  return { title: "Help me choose", sub: "Fill randomly, or start from an NBA star or a Chinese player." };
}
function fillWith(root, cnTeam, star) {
  if (locked()) return;
  track("fill",root || "seed");
  const team = root === "cn" || root === "star";
  S.root = root; S.cnTeam = team ? cnTeam : null; S.star = root === "star" ? star : null;
  S.mode = root === "cn" ? "cn" : root === "star" ? "star" : root ? "region" : "seed";
  S.picks = randomBracket(helperFor(S.root, S.cnTeam));
  // A random fill keeps the helper open so "Fill again" stays in reach; team fills close it.
  S.helpOpen = !root && S.helpOpen; S.round = 1;
  if (team && cnTeam) S.br = TEAMS[cnTeam].br;
  saveDraft(); renderAllLocal();
}
function renderHelper() {
  const sm = helperSummary();
  $("hbTitle").textContent = sm.title; $("hbSub").textContent = sm.sub;
  const bar = $("helperBar");
  bar.setAttribute("aria-expanded", String(S.helpOpen && !locked())); bar.disabled = locked();
  if (locked()) $("hbSub").textContent = "The entry deadline has passed.";
  $("helperBody").hidden = !S.helpOpen || locked();
  $("btnShuffle").hidden = !(S.root || S.mode === "seed") || locked();
  $("btnClear").disabled = locked(); $("btnClear").hidden = !countPicks(S.picks);
  document.querySelectorAll("#helperSeg button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.h === S.helpTab)));
  $("hRandom").hidden = S.helpTab !== "random"; $("hNba").hidden = S.helpTab !== "nba"; $("hCn").hidden = S.helpTab !== "cn";
  $("btnRefill").hidden = !(S.mode === "seed" && !S.root && countPicks(S.picks) === 63) || locked();
  if (!S.helpOpen) return;
  const so = $("starOpts"); so.textContent = "";
  STAR_PICKS.forEach(pid => {
    const p = NBA_ALUMNI.find(x => x.id === pid), t = TEAMS[p.team], b = el("button", "opt star-opt"); b.type = "button";
    b.setAttribute("aria-pressed", String(S.root === "star" && S.star === pid));
    b.setAttribute("aria-label", `${p.name}: make ${t.name} your champion`);
    const words = el("span", "star-opt-words"); words.append(el("span", "opt-nm", p.name), el("span", "opt-meta", `${t.name} · ${t.seed} seed`));
    b.append(alumniPortrait(p), words);
    b.addEventListener("click", () => fillWith("star", p.team, pid));
    so.append(b);
  });
  const co = $("cnOpts"); co.textContent = "";
  CN_IDS.forEach(id => {
    const t = TEAMS[id]; const b = el("button", "opt"); b.type = "button";
    b.style.setProperty("--c", "var(--cn)"); b.setAttribute("aria-pressed", String(S.root === "cn" && S.cnTeam === id));
    const top = el("span", "opt-top"); top.append(cnBadge(), document.createTextNode(`${t.seed} seed · ${BR[t.br].name} bracket`));
    b.append(top, el("span", "opt-nm", t.name), el("span", "opt-meta", `Player: ${CN_PLAYERS[id]}`), el("span", "opt-go", `Pick ${t.name} to win it all`));
    b.addEventListener("click", () => fillWith("cn", id));
    const item=el('div','helper-player'); const info=el('button','link','Player profile');info.type='button';info.addEventListener('click',()=>showPlayerProfile(id));item.append(b,info);co.append(item);
  });
}
$("helperBar").addEventListener("click", () => { if (locked()) return; S.helpOpen = !S.helpOpen; renderHelper(); });
document.querySelectorAll("#helperSeg button").forEach(b => b.addEventListener("click", () => { S.helpTab = b.dataset.h; renderHelper(); }));
$("btnSeed").addEventListener("click", () => fillWith(null, null));
$("btnRefill").addEventListener("click", () => fillWith(null, null));
$("btnShuffle").addEventListener("click", () => { if (locked()) return; S.picks = randomBracket(helperFor(S.root, S.cnTeam)); saveDraft(); renderAllLocal(); });
$("btnClear").addEventListener("click", () => { if (locked()) return; S.picks = {}; S.root = null; S.cnTeam = null; S.star = null; S.mode = "manual"; S.br = "E"; S.round = 1; saveDraft(); renderAllLocal(); });

// ---------- bracket ----------
function teamBtn(g, tid, elim) {
  if (!tid) { const d = el("div", "team tbd"); d.append(el("span", "seed", ""), el("span", "tn", "To be picked")); return d; }
  const t = TEAMS[tid];
  const b = el("button", "team"); b.type = "button";
  b.style.setProperty("--c", teamColor(t));
  if (S.picks[g.id] === tid) b.classList.add("picked");
  if (isMine(tid)) b.classList.add("mine");
  if (elim.has(tid)) b.classList.add("lost");
  b.setAttribute("aria-pressed", String(S.picks[g.id] === tid));
  b.title = `${t.name}, ${t.seed} seed${CN_PLAYERS[tid] ? `, Chinese player: ${CN_PLAYERS[tid]}` : ""}`;
  const hint = typeof alumniHint === "function" ? alumniHint(tid) : [];
  const name = el("span", "tn-wrap"); name.append(el("span", "tn", t.name)); if (hint.length) name.append(el("span", "tn-hint", `NBA: ${hint.join(", ")}`));
  b.append(el("span", "seed", String(t.seed)), teamLogo(tid), name);
  const check=el('span','pick-check','✓');check.setAttribute('aria-hidden','true');b.append(check);
  b.disabled = locked();
  b.setAttribute("aria-label", `Pick ${t.name}, seed ${t.seed}`);
  b.addEventListener("click", () => {
    hideTeamPeek(); S.picks = applyPick(S.picks, g.id, tid); if (!S.root) S.mode = "manual";
    saveDraft(); renderAllLocal();
    const selected = document.querySelector(`[data-game="${g.id}"] [data-pick="${tid}"]`);
    selected?.classList.add('just-picked'); selected?.focus({ preventScroll: true });
  });
  b.dataset.pick = tid;
  const row = el("div", "team-row");
  const info = el("button", "team-info", "ⓘ"); info.type = "button";
  info.setAttribute("aria-label", `About ${t.name}`); info.addEventListener("click", () => showTeamProfile(tid));
  row.append(b, info); attachTeamPeek(row, tid);
  return row;
}
function gameCard(g, elim) {
  const c = cands(g, S.picks); const d = el("div", "game"); d.dataset.game = g.id; const w = S.winners[g.id];
  if (w && S.picks[g.id]) d.classList.add(S.picks[g.id] === w ? "ok" : "miss");
  c.forEach(t => d.append(teamBtn(g, t, elim)));
  if (typeof faceoffReady === "function" && faceoffReady(c[0], c[1])) {
    const f = el("button", "faceoff-link", `NBA alumni face-off: ${TEAMS[c[0]].name} vs. ${TEAMS[c[1]].name}`); f.type = "button";
    f.addEventListener("click", () => showFaceoff(c[0], c[1])); d.append(f);
  }
  return d;
}
function renderBTabs() {
  const box = $("btabs"); box.textContent = "";
  RX.concat("F").forEach(X => {
    const b = el("button", "pill"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(S.br === X));
    b.append(el("span", null, X === "F" ? "Final Four" : BR[X].name), el("span", "c", `${countPicks(S.picks, X)}/${X === "F" ? 3 : 15}`));
    b.addEventListener("click", () => { S.br = X; S.round = openRound(X); renderBTabs(); renderBracket(); });
    box.append(b);
  });
}
function champBanner() {
  const champ = S.picks["F6-0"] ? TEAMS[S.picks["F6-0"]] : null;
  const ch = el("div", "champ"); const left = el("div");
  left.append(el("div", "k", "Your champion"), el("div", "v", champ ? champ.name : "Not picked yet"));
  ch.append(left);
  if (champ) ch.append(el("div", "k", `${champ.seed} seed · ${BR[champ.br].name} bracket${CN_PLAYERS[champ.id] ? ` · ${CN_PLAYERS[champ.id]}` : ""}`));
  return ch;
}
// Phone view (600px wide or less): one round at a time as full-width cards. Wider screens keep the four-column bracket.
const PHONE = typeof matchMedia === "function" ? matchMedia("(max-width: 600px)") : { matches: false };
function roundGames(X, r) { return GAMES.filter(g => g.br === X && g.round === r); }
function roundDone(X, r) { return roundGames(X, r).every(g => S.picks[g.id]); }
function openRound(X) { if (X === "F") return 1; for (let r = 1; r <= 4; r++) if (!roundDone(X, r)) return r; return 1; }
function goTo(X, r) { S.br = X; S.round = r; renderBTabs(); renderBracket(); const target = $(X === "F" ? "btabs" : "rndTabs"); target.scrollIntoView({ block: "start" }); target.querySelector('[aria-selected="true"]')?.focus({ preventScroll: true }); }
function renderPhoneBracket(view, elim) {
  const tabs = $("rndTabs"); const X = S.br;
  if (X === "F") {
    const stack = el("div", "rlist");
    const mk = (gid, label) => { const w = el("div"); w.append(el("div", "lab", label), gameCard(G[gid], elim)); return w; };
    stack.append(mk("F5-0", "Semifinal · East vs South"), mk("F5-1", "Semifinal · West vs Midwest"), mk("F6-0", "Championship"));
    view.append(stack, champBanner());
    return;
  }
  tabs.hidden = false;
  for (let r = 1; r <= 4; r++) {
    const games = roundGames(X, r);
    const b = el("button", "rnd"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(S.round === r));
    b.setAttribute('aria-label', ROUND_NAME[r]);
    b.append(el("span", null, PHONE.matches ? {1:'64 teams',2:'32 teams',3:'Sweet 16',4:'Elite 8'}[r] : ROUND_NAME[r]), el("span", "c", `${games.filter(g => S.picks[g.id]).length}/${games.length}`));
    b.addEventListener("click", () => { S.round = r; renderBracket(); $("rndTabs").querySelector('[aria-selected="true"]')?.focus({ preventScroll: true }); });
    tabs.append(b);
  }
  const games = roundGames(X, S.round); const list = el("div", "rlist");
  if (games.some(g => !cands(g, S.picks).every(Boolean))) {
    const help = el('div', 'round-recovery');
    const back = el('button', 'btn ghost', 'Finish the previous round →'); back.type = 'button';
    back.addEventListener('click', () => goTo(X, openRound(X)));
    help.append(el('p', 'sub', 'Your earlier winners become the teams here.'), back); list.append(help);
  }
  games.forEach((g, i) => { const card = gameCard(g, elim); card.prepend(el('span', 'game-step', `Game ${i + 1} of ${games.length}`)); list.append(card); });
  if (roundDone(X, S.round)) {
    const nx = RX[RX.indexOf(X) + 1] || "F";
    const b = el("button", "btn next", S.round < 4 ? `Next round: ${ROUND_NAME[S.round + 1]}` : nx === "F" ? "Next: Final Four" : `Next: ${BR[nx].name} bracket`); b.type = "button";
    b.addEventListener("click", () => { if (S.round < 4) goTo(X, S.round + 1); else goTo(nx, openRound(nx)); });
    list.append(b);
  }
  view.append(list);
}
if (PHONE.addEventListener) PHONE.addEventListener("change", () => { renderBTabs(); renderBracket(); });
// Desktop opens on the full bracket; phones open round by round. Either view is one tap away.
S.fullBracket = !PHONE.matches;
function renderBracket() {
  hideTeamPeek();
  const view = $("bracketView"); view.textContent = ""; const elim = eliminated(S.winners);
  $("rndTabs").textContent = ""; $("rndTabs").hidden = true;
  const guided = !S.fullBracket;
  view.classList.toggle("phone", guided); view.classList.toggle("full", !guided);
  document.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", String((b.dataset.view === "full") === S.fullBracket)));
  const done = S.br === "F" ? countPicks(S.picks, "F") : roundGames(S.br, S.round).filter(g => S.picks[g.id]).length;
  const total = S.br === "F" ? 3 : roundGames(S.br, S.round).length;
  $("roundCoach").textContent = countPicks(S.picks) === 63 ? "All 63 picked. Your bracket is ready." : S.br === "F" ? `${done} of 3 picked · Choose your champion.` : done === total ? "Round complete. Next round below ↓" : `Pick ${total - done} winner${total - done === 1 ? "" : "s"}.`;
  if (guided) { renderPhoneBracket(view, elim); return; }
  if (PHONE.matches) view.append(el("p", "swipe-hint", "Swipe sideways for later rounds →"));
  if (S.br !== "F") $("roundCoach").textContent = countPicks(S.picks) === 63 ? "All 63 picked. Your bracket is ready." : `${BR[S.br].name}: pick every game. Winners move right.`;
  if (S.br !== "F") {
    const grid = el("div", "bracket");
    for (let r = 1; r <= 4; r++) {
      const col = el("div", "col"); col.append(el("h3", null, ROUND_NAME[r]));
      const body = el("div", "col-body");
      GAMES.filter(g => g.br === S.br && g.round === r).forEach(g => body.append(gameCard(g, elim)));
      col.append(body); grid.append(col);
    }
    view.append(grid);
  } else {
    const grid = el("div", "ff");
    const mk = (gid, label) => { const w = el("div"); w.append(el("div", "lab", label), gameCard(G[gid], elim)); return w; };
    grid.append(mk("F5-0", "Semifinal · East vs South"), mk("F6-0", "Championship"), mk("F5-1", "Semifinal · West vs Midwest"));
    view.append(grid, champBanner());
  }
}
document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => { S.fullBracket = b.dataset.view === "full"; renderBracket(); }));

// ---------- entry bar ----------
function renderBar() {
  const n = countPicks(S.picks);
  $("pT").textContent = `${n} of 63 picked`; $("progMini").textContent = `${n} / 63`;
  $('shotMeter').setAttribute('aria-valuenow',String(n));
  $('shotMeter').setAttribute('aria-valuetext',`${n} of 63 games picked`);
  $('shotMeter').style.setProperty('--completion',`${n / 63 * 100}%`);
  $("pM").style.width = `${(n / 63) * 100}%`;
  const btn = $("btnEnter");
  const same = pilot.mine && encode(pilot.mine.picks) === encode(S.picks) && n === 63;
  $("pS").textContent = locked() ? "Entries closed" : same ? "Your entry is saved online." : "Complete all 63 picks to enter.";
  btn.textContent = locked() ? "Closed" : same ? "Entered" : pilot.mine ? "Update entry" : "Enter free";
  btn.disabled = locked() || S.busy || n < 63 || same;
}
$("btnEnter").addEventListener("click", openEntryDialog);

// ---------- crowd ----------
function hbar(labelNodes, frac, cssColor) {
  const row = el("div", "hbar"); const nm = el("span", "nm"); labelNodes.forEach(n => nm.append(n));
  const tr = el("span", "tr"); const i = el("i"); i.style.width = `${Math.round(frac * 100)}%`; if (cssColor) i.style.setProperty("--c", cssColor); tr.append(i);
  row.append(nm, tr, el("span", "pc", `${Math.round(frac * 100)}%`));
  return row;
}
function renderCrowd() {
  const N = pilot.board.length; const crowd = pilot.crowd;
  $("crowdSub").textContent = N ? String(N) : "Waiting for the first entry.";
  const cb = $("champBars"); cb.textContent = "";
  if (!N) cb.append(el("p", "empty", "Waiting for the first entry."));
  else {
    const cnt = crowd.champions;
    Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([tid, n]) => {
      const t = TEAMS[tid]; const d = teamLogo(tid); d.classList.add("bar-logo");
      const nodes = [d, document.createTextNode(`${t.seed} ${t.name}`)]; if (CN_PLAYERS[tid]) nodes.push(cnBadge());
      cb.append(hbar(nodes, n / N, "var(--blue)"));
    });
  }
  const rb = $("rootBars"); rb.textContent = "";
  if (!N) rb.append(el("p", "empty", "Waiting for the first entry."));
  else {
    rb.append(hbar([cnBadge(), document.createTextNode("Chinese players")], (crowd.roots.cn || 0) / N, "var(--cn)"));
    rb.append(hbar([document.createTextNode("NBA star’s school")], (crowd.roots.star || 0) / N, "var(--blue)"));
    const own = crowd.roots.manual || 0;
    rb.append(hbar([document.createTextNode("Own picks")], own / N, "var(--faint)"));
  }
  const ct = $("ctabs"); ct.textContent = "";
  RX.concat("F").forEach(X => {
    const b = el("button", "pill", X === "F" ? "Final Four" : BR[X].name); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(S.cbr === X));
    b.addEventListener("click", () => { S.cbr = X; renderCrowd(); });
    ct.append(b);
  });
  const ml = $("muList"); ml.textContent = "";
  const win = S.winners; const started = false;
  $("muTitle").textContent = started ? "Next matchup picks" : "First-round picks";
  $("muSub").textContent = started
    ? "Share of eligible brackets picking each team. Later rounds count brackets that picked one of the teams playing."
    : "The percentage of brackets picking each team to advance.";
  if (!N) { ml.append(el("p", "empty", "No picks to show yet.")); return; }
  const live = GAMES.filter(g => g.br === S.cbr && !win[g.id] && cands(g, win).every(Boolean));
  if (!live.length) { ml.append(el("p", "empty", decidedIds(win).length===63 ? "All games are finished. See the final rankings in Standings." : "No upcoming matchups in this group. Choose another group or explore fan favorites above.")); return; }
  live.forEach(g => {
    const [a, b] = cands(g, win);
    const counts = crowd.games[g.id] || {};
    const na = counts[a] || 0, nb = counts[b] || 0, tot = na + nb;
    const box = el("div", "mu"); const row = el("div", "row");
    const la = el("span"); la.append(el("b", null, tot ? `${pct(na, tot)}%` : "–"), document.createTextNode(` ${TEAMS[a].seed} ${TEAMS[a].name} `)); if (CN_PLAYERS[a]) la.append(cnBadge());
    const lb = el("span"); if (CN_PLAYERS[b]) lb.append(cnBadge(), document.createTextNode(" ")); lb.append(document.createTextNode(`${TEAMS[b].seed} ${TEAMS[b].name} `), el("b", null, tot ? `${pct(nb, tot)}%` : "–"));
    row.append(la, lb);
    const sp = el("div", "split"); const ia = el("i", "a"), ib = el("i", "b");
    ia.style.width = tot ? `${na / tot * 100}%` : "0"; ib.style.width = tot ? `${nb / tot * 100}%` : "0"; sp.append(ia, ib);
    const meta = el("div", "row"); meta.append(el("span", "empty", `${ROUND_NAME[g.round]} · ${g.round === 1 ? "all brackets" : `${fmt(tot)} eligible bracket${tot === 1 ? "" : "s"}`}`), el("span", "empty", g.round > 1 && !tot ? "No brackets picked this matchup" : "Upcoming"));
    box.append(row, sp, meta); ml.append(box);
  });
}

// ---------- render ----------
function renderAllLocal() {
  renderHelper(); renderBTabs(); renderBracket(); renderBar();
  updateJourney();
  if (S.tab === "crowd") renderCrowd();
  if (S.tab === "standings") renderPilotBoard();
}
function renderAll() { renderLive(); renderAllLocal(); }
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => navigateTo(t.dataset.tab)));

initGuide();
renderAll();
initPilot();
