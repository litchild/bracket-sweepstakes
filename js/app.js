// Page UI: rendering, auto-fill helper, pass-around entries, crowd, standings, demo controls.
// Depends on globals from js/logic.js.


// ---------- state ----------
const S = {
  tab: "bracket", br: "E", cbr: "E",
  root: null, cnTeam: null, picks: {}, mode: "manual", helpOpen: false, helpTab: "region",
  db: null, user: null, uid: null, canEdit: false, dbState: "connecting",
  real: [], sims: [], simEntries: [], winners: {},
  entered: false, savedSig: null, busy: false,
  guest: null, ownerSnap: null, resRound: null, tickerText: ""
};
const MAX_SIMS = 5000;
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString("en-US");
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const sig = (p, r, c) => encode(p) + "|" + (r || "") + "|" + (c || "") + "|" + countPicks(p);
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function load(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
const draft = load("bs-draft");
if (draft && draft.picks) { S.picks = draft.picks; S.root = draft.root || null; S.cnTeam = draft.cnTeam || null; S.mode = draft.mode || "manual"; }
function saveDraft() { if (S.guest) return; store("bs-draft", { picks: S.picks, root: S.root, cnTeam: S.cnTeam, mode: S.mode }); }
function locked() { return decidedIds(S.winners).length > 0; }
function allEntries() { return S.real.concat(S.simEntries); }
function classEntries() { return S.real.filter(e => e.guest); }
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function teamColor(t) { return `var(${ROOTS[t.home].color})`; }
function cnBadge() { const b = el("span", "cnb", "中"); b.title = "Chinese player on the roster"; return b; }
function zhSpan(k, extra) { const z = el("span", "zh", ROOTS[k].zh + (extra || "")); z.style.setProperty("--c", `var(${ROOTS[k].color})`); return z; }
function homeCount(k) { return Object.values(TEAMS).filter(t => t.home === k).length; }
function isMine(tid) { if (S.root === "cn") return tid in CN_PLAYERS; if (S.root && ROOTS[S.root]) return TEAMS[tid].home === S.root; return false; }
function fanText(root, cnTeam) {
  if (root === "cn") return `Chinese players${cnTeam && TEAMS[cnTeam] ? ` (${TEAMS[cnTeam].name})` : ""}`;
  if (root && ROOTS[root]) return `${ROOTS[root].zh} ${ROOTS[root].name}`;
  return "Own picks";
}
function fanTag(root, cnTeam) {
  const s = el("span", "tagline");
  if (root === "cn") { s.append(cnBadge(), document.createTextNode(fanText(root, cnTeam))); }
  else if (root && ROOTS[root]) { s.append(zhSpan(root), document.createTextNode(ROOTS[root].name)); }
  else s.textContent = "Own picks";
  return s;
}

// ---------- ticker ----------
function tickerItems() {
  const E = allEntries(), N = E.length, win = S.winners, items = [];
  const last = latestRound(win);
  if (last) {
    const games = GAMES.filter(g => g.round === last && win[g.id]).map(g => { const [a, b] = cands(g, win); const w = TEAMS[win[g.id]], l = TEAMS[win[g.id] === a ? b : a]; return { w, l, d: w.seed - l.seed }; }).sort((x, y) => y.d - x.d).slice(0, 4);
    games.forEach(x => items.push(`${ROUND_NAME[last]}: ${x.w.seed} ${x.w.name} beat ${x.l.seed} ${x.l.name}${x.d > 0 ? " (upset)" : ""}`));
    const cnAlive = CN_IDS.filter(id => !lostIn(id, win)).length;
    items.push(`${cnAlive} of ${CN_IDS.length} teams with Chinese players still alive`);
    if (N) items.push(`${fmt(E.filter(e => isPerfect(e.picks, win)).length)} perfect brackets left`);
  }
  if (N) {
    items.push(`${fmt(N)} brackets entered`);
    const cnt = {}; E.forEach(e => { const c = e.picks["F6-0"]; if (c) cnt[c] = (cnt[c] || 0) + 1; });
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
    if (top) items.push(`${pct(top[1], N)}% pick ${TEAMS[top[0]].name} to win it all`);
    const rc = ROOT_ORDER.map(k => [k, E.filter(e => e.root === k).length]).sort((a, b) => b[1] - a[1])[0];
    if (rc && rc[1]) items.push(`Most popular region: ${ROOTS[rc[0]].name} (${pct(rc[1], N)}% of fans)`);
    const cnFans = E.filter(e => e.root === "cn").length;
    if (cnFans) items.push(`${fmt(cnFans)} fans rooting for Chinese players`);
  }
  items.push("Win 50,000 RMB", "Free to enter", "Picks lock March 18");
  if (!last) items.push(`Chinese players to follow: ${CN_IDS.map(id => `${CN_PLAYERS[id]} (${TEAMS[id].name})`).join(", ")}`);
  return items;
}
function renderTicker() {
  const items = tickerItems(); const text = items.join("|");
  if (text === S.tickerText) return;
  S.tickerText = text;
  const tr = $("tTrack"); tr.textContent = "";
  for (let k = 0; k < 2; k++) {
    const grp = el("span"); if (k) grp.setAttribute("aria-hidden", "true");
    items.forEach(t => grp.append(el("span", null, t), el("b", null, "/")));
    tr.append(grp);
  }
  tr.style.setProperty("--dur", `${Math.max(28, Math.round(text.length * 0.2))}s`);
}

// ---------- header ----------
function renderLive() {
  const N = allEntries().length;
  $("liveWord").textContent = locked() ? "Live" : "Open";
  $("eyeTxt").textContent = locked() ? "March Madness 2026 · Tournament in progress" : "March Madness 2026 · Men’s college basketball";
  if (S.dbState === "connecting") { $("liveN").textContent = "–"; $("liveL").textContent = "Connecting…"; }
  else if (S.dbState === "off") { $("liveN").textContent = "–"; $("liveL").textContent = "Shared entries unavailable here"; }
  else { $("liveN").textContent = fmt(N); $("liveL").textContent = `bracket${N === 1 ? "" : "s"} entered${S.simEntries.length ? ` · ${fmt(S.simEntries.length)} simulated` : ""}`; }
  renderTicker();
}

// ---------- helper (auto-fill) ----------
function helperSummary() {
  if (S.root === "cn" && S.cnTeam) { const t = TEAMS[S.cnTeam]; return { title: `Rooting for Chinese players: ${t.name} wins it all`, sub: `${t.name} (${CN_PLAYERS[S.cnTeam]}) wins every game, and the other teams with Chinese players beat everyone else. Tap any game to change it.` }; }
  if (S.root && ROOTS[S.root]) { const r = ROOTS[S.root]; return { title: `Rooting for ${r.zh} ${r.name}`, sub: `${r.name} teams beat every team from another region. Tap any game to change it.` }; }
  if (S.mode === "seed") return { title: "Filled randomly by seed", sub: "Higher seeds win more often. Tap any game to change it." };
  return { title: "Not sure who to pick?", sub: "Root for a region or for Chinese players and we’ll fill in your bracket." };
}
function fillWith(root, cnTeam) {
  if (locked()) return;
  S.root = root; S.cnTeam = root === "cn" ? cnTeam : null;
  S.mode = root === "cn" ? "cn" : root ? "region" : "seed";
  S.picks = randomBracket(helperFor(S.root, S.cnTeam));
  S.helpOpen = false;
  if (root === "cn" && cnTeam) S.br = TEAMS[cnTeam].br;
  saveDraft(); renderAllLocal();
}
function renderHelper() {
  const sm = helperSummary();
  $("hbTitle").textContent = sm.title; $("hbSub").textContent = sm.sub;
  const bar = $("helperBar");
  bar.setAttribute("aria-expanded", String(S.helpOpen && !locked())); bar.disabled = locked();
  if (locked()) $("hbSub").textContent = "Brackets are locked because games have started.";
  $("helperBody").hidden = !S.helpOpen || locked();
  $("btnShuffle").hidden = !(S.root || S.mode === "seed") || locked();
  $("btnClear").disabled = locked();
  document.querySelectorAll("#helperSeg button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.h === S.helpTab)));
  $("hRegion").hidden = S.helpTab !== "region"; $("hCn").hidden = S.helpTab !== "cn";
  if (!S.helpOpen) return;
  const ro = $("regionOpts"); ro.textContent = "";
  ROOT_ORDER.forEach(k => {
    const r = ROOTS[k]; const b = el("button", "opt"); b.type = "button";
    b.style.setProperty("--c", `var(${r.color})`); b.setAttribute("aria-pressed", String(S.root === k));
    b.append(el("span", "opt-zh", r.zh), el("span", "opt-nm", r.name), el("span", "opt-meta", `${homeCount(k)} teams · ${r.see}`), el("span", "opt-meta", `Ambassadors: ${r.guides}`), el("span", "opt-go", `Fill my bracket for ${r.name}`));
    b.addEventListener("click", () => fillWith(k, null));
    ro.append(b);
  });
  const co = $("cnOpts"); co.textContent = "";
  CN_IDS.forEach(id => {
    const t = TEAMS[id]; const b = el("button", "opt"); b.type = "button";
    b.style.setProperty("--c", "var(--cn)"); b.setAttribute("aria-pressed", String(S.root === "cn" && S.cnTeam === id));
    const top = el("span", "opt-top"); top.append(cnBadge(), document.createTextNode(`${t.seed} seed · ${BR[t.br].name} bracket`));
    b.append(top, el("span", "opt-nm", t.name), el("span", "opt-meta", `Player: ${CN_PLAYERS[id]}`), el("span", "opt-go", `Pick ${t.name} to win it all`));
    b.addEventListener("click", () => fillWith("cn", id));
    co.append(b);
  });
}
$("helperBar").addEventListener("click", () => { if (locked()) return; S.helpOpen = !S.helpOpen; renderHelper(); });
document.querySelectorAll("#helperSeg button").forEach(b => b.addEventListener("click", () => { S.helpTab = b.dataset.h; renderHelper(); }));
$("btnSeed").addEventListener("click", () => fillWith(null, null));
$("btnShuffle").addEventListener("click", () => { if (locked()) return; S.picks = randomBracket(helperFor(S.root, S.cnTeam)); saveDraft(); renderAllLocal(); });
$("btnClear").addEventListener("click", () => { if (locked()) return; S.picks = {}; S.root = null; S.cnTeam = null; S.mode = "manual"; saveDraft(); renderAllLocal(); });

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
  b.title = `${t.name}, ${ROOTS[t.home].name} school${CN_PLAYERS[tid] ? `, Chinese player: ${CN_PLAYERS[tid]}` : ""}`;
  b.append(el("span", "seed", String(t.seed)), el("span", "tn", t.name));
  if (CN_PLAYERS[tid]) b.append(cnBadge());
  b.append(el("span", "dot"));
  b.disabled = locked();
  b.addEventListener("click", () => { S.picks = applyPick(S.picks, g.id, tid); if (!S.root) S.mode = "manual"; saveDraft(); renderAllLocal(); });
  return b;
}
function gameCard(g, elim) {
  const c = cands(g, S.picks); const d = el("div", "game"); const w = S.winners[g.id];
  if (w && S.picks[g.id]) d.classList.add(S.picks[g.id] === w ? "ok" : "miss");
  c.forEach(t => d.append(teamBtn(g, t, elim)));
  return d;
}
function renderBTabs() {
  const box = $("btabs"); box.textContent = "";
  RX.concat("F").forEach(X => {
    const b = el("button", "pill"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(S.br === X));
    b.append(el("span", null, X === "F" ? "Final Four" : BR[X].name), el("span", "c", `${countPicks(S.picks, X)}/${X === "F" ? 3 : 15}`));
    b.addEventListener("click", () => { S.br = X; renderBTabs(); renderBracket(); });
    box.append(b);
  });
}
function renderBracket() {
  const view = $("bracketView"); view.textContent = ""; const elim = eliminated(S.winners);
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
    view.append(grid);
    const champ = S.picks["F6-0"] ? TEAMS[S.picks["F6-0"]] : null;
    const ch = el("div", "champ"); const left = el("div");
    left.append(el("div", "k", "Your champion"), el("div", "v", champ ? champ.name : "Not picked yet"));
    ch.append(left);
    if (champ) ch.append(el("div", "k", `${ROOTS[champ.home].name} school · ${champ.seed} seed${CN_PLAYERS[champ.id] ? ` · ${CN_PLAYERS[champ.id]}` : ""}`));
    view.append(ch);
  }
}
function renderLegend() {
  const lg = $("legend"); lg.textContent = "";
  lg.append(el("span", null, "School’s home region:"));
  ROOT_ORDER.forEach(k => { const s = el("span"); const d = el("span", "dot"); d.style.setProperty("--c", `var(${ROOTS[k].color})`); s.append(d, document.createTextNode(`${ROOTS[k].zh} ${ROOTS[k].name}`)); lg.append(s); });
  const c = el("span"); c.append(cnBadge(), document.createTextNode("Chinese player on the roster")); lg.append(c);
}

// ---------- pass-around ----------
function renderPass() {
  const box = $("pass");
  box.hidden = !(S.canEdit && S.db);
  if (box.hidden) return;
  box.classList.toggle("active", !!S.guest);
  const n = classEntries().length;
  if (locked()) {
    $("passForm").hidden = true; $("passOn").hidden = true;
    $("passSub").textContent = `Entries are closed because results are in. ${n} pass-around entr${n === 1 ? "y" : "ies"} collected. Reset results on Standings to collect more.`;
    return;
  }
  $("passForm").hidden = !!S.guest; $("passOn").hidden = !S.guest;
  if (S.guest) $("passWho").textContent = S.guest.name;
  $("passSub").textContent = `Hand this device around. Each person types their name, fills a bracket and taps Enter. ${n} so far.`;
}
function startGuest() {
  if (locked()) return;
  const name = $("passName").value.trim().replace(/\s+/g, " ").slice(0, 40);
  if (!name) { $("passMsg").textContent = "Type their name first."; $("passMsg").className = "msg bad"; $("passName").focus(); return; }
  if (!S.guest) S.ownerSnap = { picks: S.picks, root: S.root, cnTeam: S.cnTeam, mode: S.mode };
  S.guest = { id: "g-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name };
  S.picks = {}; S.root = null; S.cnTeam = null; S.mode = "manual"; S.br = "E"; S.helpOpen = false;
  $("passName").value = ""; $("passMsg").textContent = ""; $("sMsg").textContent = "";
  renderAllLocal();
}
function exitGuest(msg) {
  if (S.ownerSnap) { S.picks = S.ownerSnap.picks; S.root = S.ownerSnap.root; S.cnTeam = S.ownerSnap.cnTeam; S.mode = S.ownerSnap.mode; }
  S.guest = null; S.ownerSnap = null; S.br = "E"; S.helpOpen = false;
  $("passMsg").textContent = msg || ""; $("passMsg").className = "msg good";
  renderAllLocal();
}
$("passStart").addEventListener("click", startGuest);
$("passName").addEventListener("keydown", e => { if (e.key === "Enter") startGuest(); });
$("passExit").addEventListener("click", () => exitGuest(""));

// ---------- entry bar ----------
function renderBar() {
  const n = countPicks(S.picks);
  $("pT").textContent = `${n} of 63 picked`; $("progMini").textContent = `${n} / 63`;
  $("pM").style.width = `${(n / 63) * 100}%`;
  const who = (S.guest ? `Entering for ${S.guest.name} · ` : "") + (S.root ? `Rooting for ${fanText(S.root, S.cnTeam)}` : "Picking on your own");
  const btn = $("btnEnter");
  const dirty = sig(S.picks, S.root, S.cnTeam) !== S.savedSig;
  if (locked()) { $("pS").textContent = `${who} · Brackets are locked: games have started.`; btn.disabled = true; btn.textContent = S.entered ? "Entered" : "Closed"; return; }
  if (!S.db) { $("pS").textContent = `${who} · Shared entries aren’t available in this view.`; btn.disabled = true; btn.textContent = "Enter free"; return; }
  if (!S.uid) { $("pS").textContent = `${who} · Sign in to claude.ai to enter.`; btn.disabled = true; btn.textContent = "Enter free"; return; }
  $("pS").textContent = n < 63 ? `${who} · Fill all 63 games to enter.` : `${who} · Ready to enter.`;
  if (S.guest) { btn.textContent = `Enter ${S.guest.name}`; btn.disabled = S.busy || n < 63; return; }
  if (S.entered && !dirty && n === 63) $("pS").textContent = `${who} · You’re entered. Change any pick to update your entry.`;
  btn.textContent = S.entered ? (dirty ? "Update entry" : "Entered") : "Enter free";
  btn.disabled = S.busy || n < 63 || (S.entered && !dirty);
}
async function submit() {
  if (!S.db || !S.uid || locked() || countPicks(S.picks) < 63) return;
  S.busy = true; renderBar(); $("sMsg").textContent = ""; $("sMsg").className = "msg";
  const doc = { picks: Object.assign({}, S.picks), root: S.root || "", cnTeam: S.cnTeam || "", mode: S.mode, updatedAt: new Date().toISOString() };
  if (S.guest) {
    const g = S.guest;
    try {
      await S.db.doc("entries/" + g.id).set(Object.assign(doc, { name: g.name, guest: true }));
      S.busy = false;
      exitGuest(`${g.name} is in. Type the next person’s name to start their entry.`);
      window.scrollTo({ top: 0, behavior: "smooth" }); $("passName").focus({ preventScroll: true });
    } catch (e) {
      S.busy = false;
      $("sMsg").textContent = e && e.code === "quota_exceeded" ? "The entry list is full. Remove some entries first." : "Couldn’t save this entry. Try again in a moment.";
      $("sMsg").className = "msg bad"; renderBar();
    }
    return;
  }
  try {
    await S.db.doc("entries/" + S.uid).set(doc);
    S.entered = true; S.savedSig = sig(S.picks, S.root, S.cnTeam);
    $("sMsg").textContent = "You’re in. Good luck!"; $("sMsg").className = "msg good";
  } catch (e) {
    $("sMsg").textContent = e && e.code === "quota_exceeded" ? "The entry list is full. Ask the host to clear space." : "Couldn’t save your entry. Try again in a moment.";
    $("sMsg").className = "msg bad";
  }
  S.busy = false; renderBar();
}
$("btnEnter").addEventListener("click", submit);

// ---------- crowd ----------
function hbar(labelNodes, frac, cssColor) {
  const row = el("div", "hbar"); const nm = el("span", "nm"); labelNodes.forEach(n => nm.append(n));
  const tr = el("span", "tr"); const i = el("i"); i.style.width = `${Math.round(frac * 100)}%`; if (cssColor) i.style.setProperty("--c", cssColor); tr.append(i);
  row.append(nm, tr, el("span", "pc", `${Math.round(frac * 100)}%`));
  return row;
}
function renderCrowd() {
  const E = allEntries(); const N = E.length; const simN = S.simEntries.length;
  $("crowdSub").textContent = N ? `${fmt(N)} bracket${N === 1 ? "" : "s"} entered${simN ? `, including ${fmt(simN)} simulated` : ""}. Updates live as people enter.` : "No brackets yet. Enter yours and the crowd’s picks fill in here.";
  const cb = $("champBars"); cb.textContent = "";
  if (!N) cb.append(el("p", "empty", "Waiting for the first entry."));
  else {
    const cnt = {}; E.forEach(e => { const c = e.picks["F6-0"]; if (c) cnt[c] = (cnt[c] || 0) + 1; });
    Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([tid, n]) => {
      const t = TEAMS[tid]; const d = el("span", "dot"); d.style.setProperty("--c", teamColor(t));
      const nodes = [d, document.createTextNode(`${t.seed} ${t.name}`)]; if (CN_PLAYERS[tid]) nodes.push(cnBadge());
      cb.append(hbar(nodes, n / N, teamColor(t)));
    });
  }
  const rb = $("rootBars"); rb.textContent = "";
  if (!N) rb.append(el("p", "empty", "Waiting for the first entry."));
  else {
    ROOT_ORDER.forEach(k => rb.append(hbar([zhSpan(k), document.createTextNode(ROOTS[k].name)], E.filter(e => e.root === k).length / N, `var(${ROOTS[k].color})`)));
    rb.append(hbar([cnBadge(), document.createTextNode("Chinese players")], E.filter(e => e.root === "cn").length / N, "var(--cn)"));
    const own = E.filter(e => !e.root || (e.root !== "cn" && !ROOTS[e.root])).length;
    rb.append(hbar([document.createTextNode("Own picks")], own / N, "var(--faint)"));
  }
  const ct = $("ctabs"); ct.textContent = "";
  RX.concat("F").forEach(X => {
    const b = el("button", "pill", X === "F" ? "Final Four" : BR[X].name); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(S.cbr === X));
    b.addEventListener("click", () => { S.cbr = X; renderCrowd(); });
    ct.append(b);
  });
  const ml = $("muList"); ml.textContent = "";
  const win = S.winners; const started = locked();
  const perfect = E.filter(e => isPerfect(e.picks, win));
  $("muTitle").textContent = started ? "Live matchups" : "First-round picks";
  $("muSub").textContent = started
    ? `Round of 64 shows all ${fmt(N)} brackets. Later rounds show only the brackets still live in that game, meaning they picked one of the two teams playing. ${fmt(perfect.length)} of ${fmt(N)} brackets are still perfect.`
    : "Share of all brackets picking each team. Once games start, later rounds show only the brackets still live in each game.";
  if (!N) { ml.append(el("p", "empty", "No picks to show yet.")); return; }
  const live = GAMES.filter(g => g.br === S.cbr && cands(g, win).every(Boolean));
  if (!live.length) { ml.append(el("p", "empty", "These matchups aren’t set yet. They fill in as games are played.")); return; }
  live.forEach(g => {
    const [a, b] = cands(g, win);
    const pool = g.round === 1 ? E : E.filter(e => e.picks[g.id] === a || e.picks[g.id] === b);
    const na = pool.filter(e => e.picks[g.id] === a).length, nb = pool.filter(e => e.picks[g.id] === b).length, tot = na + nb;
    const w = win[g.id];
    const box = el("div", "mu"); const row = el("div", "row");
    const la = el("span"); la.append(el("b", null, tot ? `${pct(na, tot)}%` : "–"), document.createTextNode(` ${TEAMS[a].seed} ${TEAMS[a].name}${CN_PLAYERS[a] ? " 中" : ""}${w === a ? " (won)" : ""}`));
    const lb = el("span"); lb.append(document.createTextNode(`${TEAMS[b].seed} ${TEAMS[b].name}${CN_PLAYERS[b] ? " 中" : ""}${w === b ? " (won)" : ""} `), el("b", null, tot ? `${pct(nb, tot)}%` : "–"));
    row.append(la, lb);
    const sp = el("div", "split"); const ia = el("i", "a"), ib = el("i", "b");
    ia.style.width = tot ? `${na / tot * 100}%` : "0"; ib.style.width = tot ? `${nb / tot * 100}%` : "0"; sp.append(ia, ib);
    const meta = el("div", "row"); meta.append(el("span", "empty", `${ROUND_NAME[g.round]} · ${g.round === 1 ? "all brackets" : `${fmt(tot)} live bracket${tot === 1 ? "" : "s"}`}`), el("span", "empty", w ? "Final" : (g.round > 1 && !tot ? "No brackets picked this matchup" : "Upcoming")));
    box.append(row, sp, meta); ml.append(box);
  });
}

// ---------- results ----------
function resGame(g, label) {
  const win = S.winners; const [a, b] = cands(g, win); const w = win[g.id]; const l = w === a ? b : a;
  const wrap = el("div", "res-col"); if (label) wrap.append(el("div", "rg-lab", label));
  const box = el("div", "rg");
  [[w, true], [l, false]].forEach(([tid, isW]) => {
    const t = TEAMS[tid]; const row = el("div", "rt " + (isW ? "w" : "l"));
    row.style.setProperty("--c", teamColor(t));
    row.append(el("span", "seed", String(t.seed)), el("span", "tn", t.name));
    if (CN_PLAYERS[tid]) row.append(cnBadge());
    if (isW && t.seed > TEAMS[l].seed) row.append(el("span", "up", "Upset"));
    row.append(el("span", "dot"));
    row.title = `${t.name}${isW ? " won" : " lost"}`;
    box.append(row);
  });
  wrap.append(box); return wrap;
}
function renderResults() {
  const win = S.winners; const last = latestRound(win);
  const tabs = $("rtabs"); tabs.textContent = ""; const body = $("resBody"); body.textContent = "";
  if (!last) { $("resSub").textContent = S.canEdit && S.db ? "No games played yet. Tap Simulate next round to play the Round of 64." : "Results appear here as games are played."; return; }
  const r = S.resRound && S.resRound <= last ? S.resRound : last;
  for (let k = 1; k <= last; k++) {
    const t = el("button", "pill", ROUND_NAME[k]); t.type = "button"; t.setAttribute("role", "tab"); t.setAttribute("aria-selected", String(k === r));
    t.addEventListener("click", () => { S.resRound = k; renderResults(); });
    tabs.append(t);
  }
  const games = GAMES.filter(g => g.round === r && win[g.id]);
  let ups = 0, big = null;
  games.forEach(g => { const [a, b] = cands(g, win); const w = TEAMS[win[g.id]], l = TEAMS[win[g.id] === a ? b : a]; if (w.seed > l.seed) { ups++; if (!big || w.seed - l.seed > big.d) big = { d: w.seed - l.seed, w, l }; } });
  $("resSub").textContent = `${ROUND_NAME[r]}${r === last ? " (latest)" : ""} · ${games.length} game${games.length === 1 ? "" : "s"} · ${ups} upset${ups === 1 ? "" : "s"}` + (big ? `. Biggest upset: ${big.w.seed} ${big.w.name} over ${big.l.seed} ${big.l.name}.` : ".");
  if (r <= 4) {
    const grid = el("div", "res-grid");
    RX.forEach(X => { const col = el("div", "res-col"); col.append(el("h4", null, `${BR[X].name} bracket`)); games.filter(g => g.br === X).forEach(g => col.append(resGame(g))); grid.append(col); });
    body.append(grid);
  } else if (r === 5) {
    const grid = el("div", "res-grid narrow"); grid.append(resGame(G["F5-0"], "East vs South"), resGame(G["F5-1"], "West vs Midwest")); body.append(grid);
  } else {
    const grid = el("div", "res-grid narrow"); grid.append(resGame(G["F6-0"], "Championship")); body.append(grid);
    const c = TEAMS[win["F6-0"]]; const ch = el("div", "champ"); const left = el("div");
    left.append(el("div", "k", "National champion"), el("div", "v", c.name)); ch.append(left);
    ch.append(el("div", "k", `${ROOTS[c.home].name} school · ${c.seed} seed${CN_PLAYERS[c.id] ? ` · ${CN_PLAYERS[c.id]}` : ""}`));
    body.append(ch);
  }
}

// ---------- standings ----------
async function renderStandings() {
  renderResults();
  const E = allEntries(); const N = E.length; const win = S.winners; const played = decidedIds(win).length;
  const perfect = E.filter(e => isPerfect(e.picks, win));
  $("kEntries").textContent = fmt(N);
  $("kPerfect").textContent = fmt(perfect.length);
  $("kPerfectL").textContent = played ? `Perfect brackets left of ${fmt(N)}` : "Perfect brackets left (all of them, until games start)";
  $("kGames").textContent = `${played} / 63`;
  const nr = GAMES.filter(g => !win[g.id] && cands(g, win).every(Boolean));
  $("kGamesL").textContent = played === 63 ? "Tournament complete" : `Next: ${nr.length ? ROUND_NAME[Math.min(...nr.map(g => g.round))] : "Round of 64"}`;
  $("stSub").textContent = played ? "Scoring: 10 points per first-round win, doubling each round up to 320 for the champion." : "Games haven’t started. Scores and eliminations appear as rounds are played.";
  // Chinese players tracker
  const ctk = $("cnTrack"); ctk.textContent = "";
  CN_IDS.forEach(id => {
    const t = TEAMS[id]; const out = lostIn(id, win); const champ = win["F6-0"] === id;
    const c = el("div", "cnt");
    const top = el("span", "opt-top"); top.append(cnBadge(), document.createTextNode(`${t.seed} seed · ${BR[t.br].name} bracket`));
    const st = champ ? el("span", "status champ-s", "Champion") : out ? el("span", "status out", `Out in ${ROUND_NAME[out]}`) : el("span", "status alive-s", "Alive");
    const fans = E.filter(e => e.picks["F6-0"] === id).length;
    c.append(top, el("span", "nm", t.name), el("span", "sub", `Player: ${CN_PLAYERS[id]}`), st, el("span", "sub", `${fmt(fans)} picked them to win it all`));
    ctk.append(c);
  });
  // regions alive
  const elim = eliminated(win); const ac = $("aliveCards"); ac.textContent = "";
  ROOT_ORDER.forEach(k => {
    const teams = Object.values(TEAMS).filter(t => t.home === k); const alive = teams.filter(t => !elim.has(t.id)).length;
    const fans = E.filter(e => e.root === k).length;
    const c = el("div", "card"); c.style.setProperty("--c", `var(${ROOTS[k].color})`);
    const hh = el("h3", "card-h"); hh.append(zhSpan(k, " "), document.createTextNode(ROOTS[k].name)); c.append(hh);
    c.append(el("div", "big", `${alive} / ${teams.length}`), el("div", "empty", alive ? "teams still alive" : "eliminated"), el("div", "empty", `${fmt(fans)} fan${fans === 1 ? "" : "s"} rooting`));
    ac.append(c);
  });
  // leaderboard
  const rows = E.map(e => ({ e, pts: score(e.picks, win) })).sort((a, b) => b.pts - a.pts || (a.e.sim === b.e.sim ? 0 : a.e.sim ? 1 : -1));
  const top = rows.slice(0, 10);
  const meRow = rows.find(r => r.e.id === S.uid);
  if (meRow && !top.includes(meRow)) top.push(meRow);
  $("lbSub").textContent = N ? (played ? "Best bracket so far. Ties share a rank." : "Everyone starts at zero until games are played.") : "No entries yet.";
  const ids = top.filter(r => !r.e.sim && !r.e.guest).map(r => r.e.id);
  let ps = {};
  if (S.user && ids.length) { try { ps = await S.user.profiles(ids); } catch (e) { ps = {}; } }
  const tb = $("lb"); tb.textContent = "";
  top.forEach(r => {
    const tr = el("tr"); if (r.e.id === S.uid) tr.className = "me";
    const rank = rows.findIndex(x => x.pts === r.pts) + 1;
    const pn = (ps[r.e.id] && ps[r.e.id].name) || "";
    const name = r.e.sim ? `Simulated fan ${r.e.n}` : r.e.guest ? (r.e.name || "Guest") : r.e.id === S.uid ? (pn ? `${pn} (you)` : "You") : (pn || "Someone");
    const rc = el("td"); rc.append(fanTag(r.e.root, r.e.cnTeam));
    const ch = r.e.picks["F6-0"] ? TEAMS[r.e.picks["F6-0"]] : null;
    tr.append(el("td", "n", String(rank)), el("td", null, name), rc, el("td", null, ch ? `${ch.seed} ${ch.name}${elim.has(ch.id) ? " (out)" : ""}` : "–"), el("td", "n", String(r.pts)));
    tb.append(tr);
  });
  $("demo").hidden = !S.canEdit || !S.db;
  $("dSim").disabled = S.busy || played === 63; $("dReset").disabled = S.busy || !played;
  $("dFans").disabled = S.busy || S.sims.length >= MAX_SIMS; $("dNoFans").disabled = S.busy || !S.sims.length;
  $("dNoClass").disabled = S.busy || !classEntries().length;
}

// ---------- render ----------
function renderAllLocal() {
  renderPass(); renderHelper(); renderBTabs(); renderBracket(); renderBar();
  if (S.tab === "crowd") renderCrowd();
  if (S.tab === "standings") renderStandings();
}
function renderAll() { renderLive(); renderAllLocal(); }
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  S.tab = t.dataset.tab;
  document.querySelectorAll(".tab").forEach(x => x.setAttribute("aria-selected", String(x === t)));
  $("v-bracket").hidden = S.tab !== "bracket"; $("v-crowd").hidden = S.tab !== "crowd"; $("v-standings").hidden = S.tab !== "standings";
  renderAllLocal();
}));

// ---------- demo controls ----------
async function demo(fn, okMsg) {
  S.busy = true; renderStandings(); $("dMsg").textContent = ""; $("dMsg").className = "msg";
  try { await fn(); $("dMsg").textContent = okMsg; $("dMsg").className = "msg good"; }
  catch (e) { $("dMsg").textContent = "That didn’t save. Try again in a moment."; $("dMsg").className = "msg bad"; }
  S.busy = false; renderAll();
}
$("dSim").addEventListener("click", () => demo(async () => {
  S.resRound = null;
  const nx = nextRound(S.winners); if (!nx) return;
  await S.db.doc("state/results").set({ winners: nx.winners, updatedAt: new Date().toISOString() });
}, "Round simulated. The winners are under Results."));
$("dReset").addEventListener("click", () => demo(() => S.db.doc("state/results").set({ winners: {}, updatedAt: new Date().toISOString() }), "Results cleared. Brackets are open again."));
$("dFans").addEventListener("click", () => demo(async () => {
  const opts = ["east", "south", "west", "midwest", "cn", "east", "south", "west", "midwest", "cn", ""];
  const list = S.sims.map(x => typeof x === "string" ? x : (() => { const u = unpackSim(x); return u ? packSim(u.root, u.picks) : null; })()).filter(Boolean);
  const add = Math.min(1000, MAX_SIMS - list.length);
  for (let i = 0; i < add; i++) {
    const r = opts[Math.floor(Math.random() * opts.length)] || null;
    const cn = r === "cn" ? CN_IDS[Math.floor(Math.random() * CN_IDS.length)] : null;
    list.push(packSim(r, randomBracket(helperFor(r, cn))));
  }
  await S.db.doc("state/sims").set({ list, updatedAt: new Date().toISOString() });
}, "Added 1,000 simulated fans."));
$("dNoFans").addEventListener("click", () => demo(() => S.db.doc("state/sims").set({ list: [], updatedAt: new Date().toISOString() }), "Simulated fans removed."));
$("dNoClass").addEventListener("click", () => demo(() => Promise.all(classEntries().map(e => S.db.doc("entries/" + e.id).delete())), "Pass-around entries removed."));

// ---------- local storage backend ----------
function localBackend() {
  const KEY = "bs-local-db";
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { data = {}; }
  const subs = new Set();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  const notify = () => setTimeout(() => subs.forEach(f => f()), 0);
  const snapDoc = path => ({ id: path.split("/").pop(), exists: path in data, data: () => (path in data ? JSON.parse(JSON.stringify(data[path])) : undefined) });
  const watch = f => { subs.add(f); setTimeout(f, 0); return () => subs.delete(f); };
  const doc = path => ({
    get: async () => snapDoc(path),
    set: async v => { data[path] = JSON.parse(JSON.stringify(v)); persist(); notify(); },
    delete: async () => { delete data[path]; persist(); notify(); },
    onSnapshot: fn => watch(() => fn(snapDoc(path)))
  });
  const collection = path => {
    const q = { limit: () => q, onSnapshot: fn => watch(() => fn({ docs: Object.keys(data).filter(k => k.startsWith(path + "/") && k.split("/").length === 2).map(snapDoc) })) };
    return q;
  };
  return {
    db: { doc, collection },
    user: { id: async () => "local-you", canEdit: async () => true, profiles: async ids => Object.fromEntries([].concat(ids).map(i => [i, { id: i, name: "" }])) }
  };
}

// ---------- boot ----------
renderLegend();
renderAll();
(async () => {
  // Storage backend. localBackend() keeps everything in this browser.
  // To share entries between visitors, replace it with an object that has the same
  // doc(path).get/set/delete/onSnapshot and collection(path).limit(n).onSnapshot shape,
  // backed by a hosted database.
  const { db, user } = localBackend();
  S.db = db; S.user = user; S.dbState = "on";
  S.uid = user ? await user.id() : null;
  S.canEdit = user ? await user.canEdit() : false;
  if (S.uid) {
    try {
      const s = await db.doc("entries/" + S.uid).get();
      if (s.exists) {
        const d = s.data() || {}; S.entered = true; S.savedSig = sig(d.picks || {}, d.root || null, d.cnTeam || null);
        if (!draft || !draft.picks || !countPicks(draft.picks)) { S.picks = Object.assign({}, d.picks); S.root = d.root || null; S.cnTeam = d.cnTeam || null; S.mode = d.mode || "manual"; }
      }
    } catch (e) {}
  }
  db.collection("entries").limit(1000).onSnapshot(snap => {
    S.real = snap.docs.filter(d => d.exists).map(d => { const v = d.data() || {}; return { id: d.id, picks: v.picks || {}, root: v.root || null, cnTeam: v.cnTeam || null, guest: !!v.guest, name: typeof v.name === "string" ? v.name.slice(0, 40) : "" }; });
    renderLive(); if (S.tab !== "bracket") renderAllLocal(); else renderPass();
  }, () => { S.dbState = "off"; renderLive(); });
  db.doc("state/results").onSnapshot(s => { const v = s.exists ? s.data() : null; S.winners = Object.assign({}, (v && v.winners) || {}); renderAll(); }, () => {});
  db.doc("state/sims").onSnapshot(s => {
    const v = s.exists ? s.data() : null; S.sims = v && Array.isArray(v.list) ? v.list : [];
    S.simEntries = S.sims.map((x, i) => { const u = unpackSim(x); return u ? { id: "sim-" + i, sim: true, n: i + 1, root: u.root, cnTeam: u.cnTeam, picks: u.picks } : null; }).filter(Boolean);
    renderLive(); if (S.tab !== "bracket") renderAllLocal();
  }, () => {});
  renderAll();
})();
