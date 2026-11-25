// Entries dashboard: reads /api/admin/* with the ADMIN_TOKEN password. Uses globals from ../js/logic.js.
// Everything typed by visitors (nicknames) is inserted with textContent.
const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString("en-US");
const pctOf = (a, b) => (b ? Math.round(a / b * 100) : 0);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
const KEY = "bs-admin";
let token = ""; try { token = sessionStorage.getItem(KEY) || ""; } catch (e) {}
let data = null, showAll = false;
const selected = new Set();
const LABELS = {
  tabs: { bracket: "My picks", learn: "Learn", explore: "Discover", crowd: "Crowd", standings: "Results" },
  discover: { nba: "NBA stars", draft: "Draft watch", archive: "History" },
  fills: { star: "NBA star’s school", cn: "Chinese players", seed: "Quick fill by seed", region: "Region (older drafts)" },
  devices: { phone: "Phone", tablet: "Tablet", desktop: "Desktop" },
  rooting: { own: "Own picks", star: "NBA star’s school", cn: "Chinese players", region: "Region (older drafts)" },
  modes: { manual: "Own picks", seed: "Quick fill by seed", cn: "Chinese players", star: "NBA star’s school", region: "Region" }
};
const teamLabel = id => (TEAMS[id] ? `${TEAMS[id].seed} ${TEAMS[id].name}` : "Unknown");
const when = iso => (iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "");
const shortDay = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
function say(id, text, ok) { $(id).textContent = text; $(id).className = "msg" + (text ? (ok ? " good" : " bad") : ""); }

async function api(path, body) {
  const r = await fetch("/api/admin/" + path, {
    method: body ? "POST" : "GET", cache: "no-store",
    headers: { authorization: "Bearer " + token, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const out = await r.json().catch(() => ({}));
  if (r.status === 401 || r.status === 503) { signOut(out.error || "Sign in again."); throw new Error(out.error || "Signed out"); }
  if (!r.ok) throw new Error(out.error || "Request failed. Try again.");
  return out;
}
function signOut(msg) {
  token = ""; try { sessionStorage.removeItem(KEY); } catch (e) {}
  $("dash").hidden = true; $("topActions").hidden = true; $("login").hidden = false;
  say("loginMsg", msg || "", false); $("token").focus();
}
async function load() {
  document.body.style.cursor = "progress"; $("dash").style.opacity = data ? ".6" : "";
  try {
    data = await api("summary?days=30");
    $("login").hidden = true; $("dash").hidden = false; $("topActions").hidden = false;
    render();
  } catch (e) { if (token) say("loginMsg", e.message, false); }
  finally { document.body.style.cursor = ""; $("dash").style.opacity = ""; }
}

// ---------- pieces ----------
function kpi(label, value, note) { const c = el("div", "card kpi"); c.append(el("div", "label", label), el("div", "value", value), el("div", "note", note)); return c; }
function meters(box, rows, total, opts = {}) {
  box.textContent = "";
  const list = rows.filter(r => r[1] > 0 || opts.keepZero);
  if (!list.length) { box.append(el("p", "empty", opts.empty || "No data yet.")); return; }
  list.forEach(([name, n]) => {
    const row = el("div", "meter"), bar = el("div", "bar"), fill = el("i"), share = pctOf(n, total);
    fill.style.width = `${Math.min(100, total ? n / total * 100 : 0)}%`; bar.append(fill);
    bar.setAttribute("role", "img"); bar.setAttribute("aria-label", `${name}: ${fmt(n)}, ${share}%`);
    const fig = el("span", "fig"); fig.append(el("b", null, fmt(n)), document.createTextNode(` · ${share}%`));
    row.append(el("span", "name", name), bar, fig); box.append(row);
  });
}
const ranked = (obj, labels) => Object.entries(obj || {}).map(([k, n]) => [labels ? labels[k] || k : k, n]).sort((a, b) => b[1] - a[1]);
function niceMax(v) { if (v <= 4) return 4; const p = Math.pow(10, Math.floor(Math.log10(v))); const m = [1, 2, 2.5, 5, 10].map(k => k * p).find(k => k >= v); return m < 10 && m % 2 ? m + 1 : m; } // even, so the middle tick is a whole number
function columns(box, days, key, describe) {
  box.textContent = "";
  const max = niceMax(Math.max(...days.map(d => d[key]))), y = el("div", "yaxis"), plot = el("div", "plot");
  [0, .5, 1].forEach(f => {
    const t = el("span", null, fmt(Math.round(max * f))); t.style.top = `${(1 - f) * 100}%`; y.append(t);
    if (f) { const g = el("div", "grid-line"); g.style.top = `${(1 - f) * 100}%`; plot.append(g); }
  });
  const peak = days.reduce((a, d, i) => (d[key] > days[a][key] ? i : a), 0);
  days.forEach((d, i) => {
    const b = el("button", "col"), bar = el("i"), h = `${d[key] / max * 100}%`;
    b.type = "button"; bar.style.height = h; b.style.setProperty("--h", h); b.append(bar);
    if (d[key] && (i === peak || i === days.length - 1)) b.append(el("b", null, fmt(d[key])));
    const text = describe(d); b.setAttribute("aria-label", `${shortDay(d.day)}: ${text}`);
    const show = e => tip(e, shortDay(d.day), text);
    b.addEventListener("pointerenter", show); b.addEventListener("pointermove", show); b.addEventListener("focus", show);
    b.addEventListener("pointerleave", hideTip); b.addEventListener("blur", hideTip);
    plot.append(b);
  });
  const x = el("div", "xaxis"); x.append(el("span", null, shortDay(days[0].day)), el("span", null, shortDay(days[Math.floor(days.length / 2)].day)), el("span", null, "Today"));
  box.append(y, plot, x);
}
function tip(e, title, text) {
  const t = $("tip"); t.textContent = ""; t.append(el("strong", null, text), document.createTextNode(title)); t.hidden = false;
  const r = e.currentTarget.getBoundingClientRect(), w = t.offsetWidth;
  t.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2))}px`;
  t.style.top = `${Math.max(8, r.top - t.offsetHeight - 8)}px`;
}
function hideTip() { $("tip").hidden = true; }
function table(tbl, head, rows) {
  tbl.textContent = "";
  const thead = el("thead"), tr = el("tr");
  head.forEach(([h, cls]) => { const th = el("th", cls, h); th.scope = "col"; tr.append(th); }); thead.append(tr);
  const tbody = el("tbody"); rows.forEach(r => tbody.append(r)); tbl.append(thead, tbody);
}
function csv(name, rows) {
  const safe = v => { let s = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const blob = new Blob(["﻿" + rows.map(r => r.map(safe).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = el("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- render ----------
function render() {
  const d = data, t = d.totals, f = d.funnel;
  $("updated").textContent = `Updated ${when(d.generatedAt)}`;
  $("scope").textContent = `Counts since the first recorded visit. Days follow ${d.timeZone.replace("_", " ")} time. Visitors are counted by a random ID saved in each browser, so one person on two devices counts twice.`;
  const k = $("kpis"); k.textContent = "";
  k.append(
    kpi("Visitors", fmt(t.visitors), `${fmt(t.visitorsToday)} today · ${fmt(t.newToday)} new`),
    kpi("Visits", fmt(t.visits), "Page loads"),
    kpi("Brackets entered", fmt(t.entries), `${fmt(t.entriesToday)} today · ${fmt(t.passAround)} pass-around`),
    kpi("Visitors who entered", `${pctOf(f.entered, f.visited)}%`, `${fmt(f.entered)} of ${fmt(f.visited)} devices`)
  );
  columns($("chartVisitors"), d.daily, "visitors", x => `${fmt(x.visitors)} visitor${x.visitors === 1 ? "" : "s"} (${fmt(x.newVisitors)} new) · ${fmt(x.visits)} visits`);
  columns($("chartEntries"), d.daily, "entries", x => `${fmt(x.entries)} bracket${x.entries === 1 ? "" : "s"} entered`);
  table($("dailyTable"), [["Day"], ["Visitors", "num"], ["New visitors", "num"], ["Visits", "num"], ["Brackets entered", "num"]],
    d.daily.slice().reverse().map(x => { const r = el("tr"); r.append(el("td", null, shortDay(x.day)), el("td", "num", fmt(x.visitors)), el("td", "num", fmt(x.newVisitors)), el("td", "num", fmt(x.visits)), el("td", "num", fmt(x.entries))); return r; }));
  meters($("funnel"), [["Visited the site", f.visited], ["Made at least one pick", f.started], ["Picked all 63 games", f.completed], ["Entered a bracket", f.entered]], f.visited, { keepZero: true });
  meters($("tabs"), ranked(d.tabs, LABELS.tabs), f.visited);
  meters($("discover"), ranked(d.discover, LABELS.discover), f.visited);
  const fillTotal = Object.values(d.fills).reduce((a, b) => a + b, 0);
  meters($("fills"), ranked(d.fills, LABELS.fills), fillTotal, { empty: "No auto-fills yet." });
  meters($("sources"), ranked(d.sources, { direct: "Direct or unknown" }), f.visited);
  meters($("devices"), ranked(d.devices, LABELS.devices), f.visited);
  meters($("rooting"), ranked(d.rooting, LABELS.rooting), t.entries, { empty: "No entries yet." });
  meters($("champions"), ranked(d.champions).slice(0, 10).map(([id, n]) => [teamLabel(id), n]), t.entries, { empty: "No entries yet." });
  renderEntries(); renderResults();
}
function filteredEntries() { const q = $("search").value.trim().toLowerCase(); return data.entries.filter(e => !q || e.name.toLowerCase().includes(q)); }
function renderEntries() {
  const played = data.results.played, list = filteredEntries(), rows = showAll ? list : list.slice(0, 50);
  [...selected].forEach(id => { if (!data.entries.some(e => e.id === id)) selected.delete(id); });
  $("entriesSub").textContent = data.entries.length
    ? `${fmt(data.entries.length)} entr${data.entries.length === 1 ? "y" : "ies"}, newest first.${played ? ` Correct picks count the ${played} game${played === 1 ? "" : "s"} with results.` : ""}`
    : "No entries yet. They appear here as soon as someone taps Enter.";
  const all = el("input"); all.type = "checkbox"; all.setAttribute("aria-label", "Select all shown entries");
  all.checked = rows.length > 0 && rows.every(e => selected.has(e.id));
  all.addEventListener("change", () => { rows.forEach(e => (all.checked ? selected.add(e.id) : selected.delete(e.id))); renderEntries(); });
  const head = [["", ""], ["Nickname"], ["Champion"], ["Made with"], ["Type"], ["Entered"], ["Updated"]];
  if (played) head.push(["Correct picks", "num"], ["Perfect so far"]);
  table($("entries"), head, rows.map(e => {
    const r = el("tr"), box = el("input"), c = el("td"); box.type = "checkbox"; box.checked = selected.has(e.id);
    box.setAttribute("aria-label", `Select ${e.name}`);
    box.addEventListener("change", () => { box.checked ? selected.add(e.id) : selected.delete(e.id); $("deleteSel").disabled = !selected.size; $("deleteSel").textContent = selected.size ? `Delete selected (${selected.size})` : "Delete selected"; });
    c.append(box);
    const type = el("td"); type.append(el("span", "tag" + (e.guest ? " yes" : ""), e.guest ? "Pass-around" : "Own device"));
    r.append(c, el("td", "nick", e.name), el("td", null, teamLabel(e.champion)), el("td", null, LABELS.modes[e.mode] || e.mode), type, el("td", null, when(e.createdAt)), el("td", null, e.updatedAt !== e.createdAt ? when(e.updatedAt) : ""));
    if (played) r.append(el("td", "num", `${e.correct} / ${played}`), el("td", null, e.perfect ? "Yes" : "No"));
    return r;
  }));
  $("entries").querySelector("thead th").append(all);
  $("moreEntries").hidden = showAll || list.length <= 50;
  $("moreEntries").textContent = `Show all ${fmt(list.length)} entries`;
  $("deleteSel").disabled = !selected.size;
  $("deleteSel").textContent = selected.size ? `Delete selected (${selected.size})` : "Delete selected";
}
function renderResults() {
  const r = data.results, w = r.winners || {};
  $("resultsSub").textContent = r.played
    ? `${r.played} of 63 games have results (${r.source === "simulated" ? "includes simulated rounds" : "recorded by your team"}). Brackets are locked.`
    : "No results yet. Entries are open.";
  $("simulate").disabled = r.played === 63; $("resetResults").disabled = !r.played;
  const next = GAMES.filter(g => !w[g.id] && cands(g, w).every(Boolean)), box = $("nextGames"); box.textContent = "";
  if (!next.length) box.append(el("p", "empty", "Every game has a result."));
  next.forEach(g => {
    const card = el("div", "ng"), pick = el("div", "pick");
    card.append(el("div", "lab", `${ROUND_NAME[g.round]} · ${g.br === "F" ? "Final Four" : BR[g.br].name}`));
    cands(g, w).forEach(tid => {
      const b = el("button", "btn", teamLabel(tid)); b.type = "button"; b.setAttribute("aria-label", `${TEAMS[tid].name} won this ${ROUND_NAME[g.round]} game`);
      b.addEventListener("click", () => results({ action: "record", game: g.id, team: tid }, `Recorded: ${TEAMS[tid].name} won.`));
      pick.append(b);
    });
    card.append(pick); box.append(card);
  });
  const done = GAMES.filter(g => w[g.id]), rec = $("recorded"); rec.textContent = "";
  $("recordedSum").textContent = `Games with results (${done.length})`;
  if (!done.length) rec.append(el("p", "empty", "None yet."));
  done.slice().reverse().forEach(g => {
    const [a, b] = cands(g, w), loser = w[g.id] === a ? b : a, row = el("div", "rec");
    const u = el("button", "btn ghost", "Undo"); u.type = "button"; u.setAttribute("aria-label", `Undo ${ROUND_NAME[g.round]} result ${TEAMS[w[g.id]].name} over ${TEAMS[loser].name}`);
    u.addEventListener("click", () => results({ action: "undo", game: g.id }, "Result removed. Later results that depended on it were removed too."));
    row.append(el("span", null, `${ROUND_NAME[g.round]} · ${teamLabel(w[g.id])} beat ${teamLabel(loser)}`), u); rec.append(row);
  });
}
async function results(body, okMsg) {
  document.querySelectorAll("#resultsTitle ~ * button").forEach(b => (b.disabled = true));
  try { await api("results", body); await load(); say("resultsMsg", okMsg, true); }
  catch (e) { say("resultsMsg", e.message, false); renderResults(); }
}

// ---------- events ----------
$("loginForm").addEventListener("submit", e => {
  e.preventDefault(); token = $("token").value.trim();
  if (!token) { say("loginMsg", "Type the admin password.", false); return; }
  try { sessionStorage.setItem(KEY, token); } catch (err) {}
  say("loginMsg", "", true); $("token").value = ""; load();
});
$("signOut").addEventListener("click", () => signOut(""));
$("refresh").addEventListener("click", load);
$("search").addEventListener("input", () => { showAll = false; renderEntries(); });
$("moreEntries").addEventListener("click", () => { showAll = true; renderEntries(); });
$("simulate").addEventListener("click", () => results({ action: "simulate" }, "Next round simulated."));
$("resetResults").addEventListener("click", () => { if (confirm("Remove every result? Entries open again on the website.")) results({ action: "reset" }, "All results removed. Entries are open."); });
$("deleteSel").addEventListener("click", async () => {
  const ids = [...selected]; if (!ids.length || !confirm(`Delete ${ids.length} entr${ids.length === 1 ? "y" : "ies"}? This can’t be undone.`)) return;
  try { let n = 0; for (let i = 0; i < ids.length; i += 200) n += (await api("delete-entries", { ids: ids.slice(i, i + 200) })).deleted; selected.clear(); await load(); say("entriesMsg", `Deleted ${n} entr${n === 1 ? "y" : "ies"}.`, true); }
  catch (e) { say("entriesMsg", e.message, false); }
});
$("clearVisits").addEventListener("click", async () => {
  if (!confirm("Clear all visit data? Visitor counts start from zero. Entries stay.")) return;
  try { let left = 1, n = 0; while (left > 0) { const r = await api("clear-events", {}); n += r.deleted; left = r.remaining; say("dataMsg", `Clearing… ${fmt(n)} removed`, true); } await load(); say("dataMsg", `Visit data cleared (${fmt(n)} records).`, true); }
  catch (e) { say("dataMsg", e.message, false); }
});
$("entriesCsv").addEventListener("click", () => {
  const played = data.results.played;
  const head = ["id", "nickname", "type", "entered_at", "updated_at", "made_with", "champion", "correct_picks", "perfect_so_far"].concat(GAMES.map(g => `${g.id} ${ROUND_NAME[g.round]}`));
  const rows = filteredEntries().map(e => {
    const picks = (unpackSim(e.pack) || {}).picks || {};
    return [e.id, e.name, e.guest ? "pass-around" : "own device", e.createdAt, e.updatedAt, LABELS.modes[e.mode] || e.mode, teamLabel(e.champion), played ? e.correct : "", played ? (e.perfect ? "yes" : "no") : ""]
      .concat(GAMES.map(g => (TEAMS[picks[g.id]] || {}).name || ""));
  });
  csv(`bracket-entries-${data.today}.csv`, [head].concat(rows));
});
$("dailyCsv").addEventListener("click", () => csv(`bracket-daily-${data.today}.csv`, [["day", "visitors", "new_visitors", "visits", "brackets_entered"]].concat(data.daily.map(x => [x.day, x.visitors, x.newVisitors, x.visits, x.entries]))));
addEventListener("scroll", hideTip, { passive: true });
if (token) load(); else $("token").focus();
