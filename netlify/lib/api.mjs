// Bracket Sweepstakes API: recorded entries, first-party visit counts and the admin dashboard.
// netlify/functions/api.mjs runs it on Netlify Blobs. The local dev server and the tests run it on memoryStore().
// A store needs get(key, { type: "json" }), set(key, text), setJSON(key, value), delete(key) and
// list({ prefix, paginate: true }), the same calls as a Netlify Blobs store.
//
// Keys:
//   entries/<id>                     full entry, including the hashed edit secret
//   pub/<id>/<pack>                  public index read by GET /api/state (pack = logic.js packSim string)
//   ev/<day>/<type>/<vid>/<detail>/<n> one analytics event; counts come from listing keys
//   state/results                    { winners, source: "simulated" | "recorded", updatedAt }
import L from "../../js/logic.js";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const TIME_ZONE = "America/New_York";
export const LIMITS = { body: 8192, events: 20, name: 24, perDevicePerDay: 60, entries: 20000, deleteBatch: 1000 };
const CLIENT_EVENTS = new Set(["visit", "src", "tab", "discover", "start", "fill", "complete"]);
const DETAIL = /^[a-z0-9.-]{0,40}$/;
const VID = /^[a-z0-9]{8,32}$/;
const ID = /^[A-Za-z0-9_-]{12}$/;
const PACK = /^[eswmcnx][A-Za-z0-9_-]{11}$/;
const MODES = new Set(["manual", "seed", "cn", "star", "region"]);

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const noContent = () => new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
export const dayOf = t => dayFmt.format(new Date(t));
const sha = s => createHash("sha256").update(String(s)).digest();
const rand = n => randomBytes(n).toString("base64url");

async function listKeys(store, prefix) {
  const keys = [];
  for await (const page of store.list({ prefix, paginate: true })) for (const b of page.blobs || []) keys.push(b.key);
  return keys;
}
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}
async function readJSON(req) {
  const text = await req.text();
  if (text.length > LIMITS.body) throw new HttpError(413, "Request too large.");
  try { const v = JSON.parse(text || "{}"); return v && typeof v === "object" ? v : {}; } catch (e) { throw new HttpError(400, "Invalid JSON."); }
}
export function cleanName(v) {
  const s = String(v == null ? "" : v).normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, "")
    .replace(/\s+/g, " ").trim();
  return Array.from(s).slice(0, LIMITS.name).join("").trim();
}
const evKey = (t, type, vid, detail, i) => `ev/${dayOf(t)}/${type}/${vid}/${detail || "-"}/${t.toString(36)}${i || 0}${rand(3)}`;
async function results(store) { return (await store.get("state/results", { type: "json" })) || { winners: {}, source: "", updatedAt: null }; }
const played = r => L.decidedIds(r.winners || {}).length;
const publicEntry = e => ({ id: e.id, name: e.name, guest: !!e.guest, pack: e.pack, root: e.root || "", cnTeam: e.cnTeam || "", star: e.star || "", mode: e.mode || "manual", createdAt: e.createdAt, updatedAt: e.updatedAt });

// ---------- public routes ----------
async function postEvents(req, store, t) {
  const b = await readJSON(req);
  if (!VID.test(String(b.vid || ""))) throw new HttpError(400, "Missing device id.");
  const list = (Array.isArray(b.events) ? b.events : []).slice(0, LIMITS.events)
    .map(e => ({ type: String(e && e.type || ""), detail: String(e && e.detail || "").toLowerCase().slice(0, 40) }))
    .filter(e => CLIENT_EVENTS.has(e.type) && DETAIL.test(e.detail));
  await Promise.all(list.map((e, i) => store.set(evKey(t, e.type, b.vid, e.detail, i), "1")));
  return noContent();
}
async function getState(store) {
  const [keys, r] = await Promise.all([listKeys(store, "pub/"), results(store)]);
  const byId = new Map();
  for (const k of keys) { const p = k.split("/"); if (p.length === 3 && ID.test(p[1]) && PACK.test(p[2])) byId.set(p[1], p[2]); }
  return json(200, { entries: [...byId.values()], winners: r.winners || {}, source: r.source || "", updatedAt: r.updatedAt || null });
}
async function readOwn(store, id, secret) {
  if (!ID.test(String(id || ""))) throw new HttpError(400, "Invalid entry id.");
  const e = await store.get(`entries/${id}`, { type: "json" });
  if (!e) throw new HttpError(404, "That entry no longer exists.");
  if (!secret || !e.secretHash || !timingSafeEqual(sha(secret), Buffer.from(e.secretHash, "hex"))) throw new HttpError(403, "This device can’t change that entry.");
  return e;
}
async function getEntry(req, url, store) {
  const e = await readOwn(store, url.searchParams.get("id"), req.headers.get("x-entry-secret"));
  return json(200, { entry: publicEntry(e) });
}
async function postEntry(req, store, t) {
  const b = await readJSON(req);
  const vid = String(b.vid || "");
  if (!VID.test(vid)) throw new HttpError(400, "Missing device id.");
  const name = cleanName(b.name);
  if (!name) throw new HttpError(400, "Type a nickname first.");
  if (!PACK.test(String(b.pack || ""))) throw new HttpError(400, "Pick all 63 games before entering.");
  if (played(await results(store))) throw new HttpError(409, "Brackets are locked because games have started.");
  const u = L.unpackSim(b.pack), root = u.root || "", picks = u.picks, pack = L.packSim(root, picks);
  const fields = {
    name, root, pack, champion: picks["F6-0"],
    cnTeam: L.TEAMS[b.cnTeam] ? b.cnTeam : "",
    star: /^\d{1,12}$/.test(String(b.star || "")) ? String(b.star) : "",
    mode: MODES.has(b.mode) ? b.mode : "manual",
    updatedAt: new Date(t).toISOString()
  };
  let entry, secret = null;
  if (b.id) {
    const old = await readOwn(store, b.id, b.secret);
    entry = Object.assign({}, old, fields);
    await store.setJSON(`entries/${old.id}`, entry);
    if (old.pack !== pack) await store.delete(`pub/${old.id}/${old.pack}`);
    await store.set(`pub/${old.id}/${pack}`, "1");
  } else {
    const [mine, all] = await Promise.all([listKeys(store, `ev/${dayOf(t)}/enter/${vid}/`), listKeys(store, "pub/")]);
    if (mine.length >= LIMITS.perDevicePerDay) throw new HttpError(429, "This device has entered the daily maximum. Try again tomorrow.");
    if (all.length >= LIMITS.entries) throw new HttpError(507, "The entry list is full.");
    secret = rand(18);
    entry = Object.assign({ id: rand(9), guest: !!b.guest, vid, createdAt: fields.updatedAt, secretHash: sha(secret).toString("hex") }, fields);
    await store.setJSON(`entries/${entry.id}`, entry);
    await store.set(`pub/${entry.id}/${pack}`, "1");
  }
  await store.set(evKey(t, secret ? "enter" : "update", vid, entry.guest ? "pass" : "own"), "1");
  return json(secret ? 201 : 200, Object.assign({ entry: publicEntry(entry) }, secret ? { secret } : {}));
}

// ---------- admin routes (Authorization: Bearer <ADMIN_TOKEN>) ----------
function authorize(req, token) {
  if (!token) throw new HttpError(503, "The dashboard is off. Set ADMIN_TOKEN in the Netlify environment variables, then redeploy.");
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!got || !timingSafeEqual(sha(got), sha(token))) throw new HttpError(401, "That password is incorrect.");
}
const lastDays = (today, n) => { const base = Date.parse(today + "T12:00:00Z"); return Array.from({ length: n }, (_, i) => new Date(base - (n - 1 - i) * 864e5).toISOString().slice(0, 10)); };
export async function buildSummary(store, t, days) {
  const [evKeys, entryKeys, r] = await Promise.all([listKeys(store, "ev/"), listKeys(store, "entries/"), results(store)]);
  const entries = (await pool(entryKeys, 25, k => store.get(k, { type: "json" }))).filter(Boolean);
  const win = r.winners || {};
  const first = new Map(), device = new Map(), dayVis = new Map(), sets = {}, counts = {};
  const set = (k, v) => (sets[k] || (sets[k] = new Set())).add(v);
  const count = (k, d) => { const c = counts[k] || (counts[k] = {}); c[d] = (c[d] || 0) + 1; };
  let visits = 0; const visitsByDay = {};
  for (const key of evKeys) {
    const [, day, type, vid, rawDetail] = key.split("/"); if (!vid) continue;
    const detail = rawDetail === "-" ? "" : rawDetail;
    if (!first.has(vid) || day < first.get(vid)) first.set(vid, day);
    (dayVis.get(day) || dayVis.set(day, new Set()).get(day)).add(vid);
    set(type, vid);
    if (type === "visit") { visits++; visitsByDay[day] = (visitsByDay[day] || 0) + 1; if (detail) device.set(vid, detail); }
    if (type === "tab" || type === "discover" || type === "fill" || type === "src") { set(`${type}:${detail}`, vid); count(type, detail); }
  }
  const distinct = (type, list) => Object.fromEntries(list.map(d => [d || "direct", (sets[`${type}:${d}`] || new Set()).size]));
  const devices = {}; device.forEach(d => { devices[d] = (devices[d] || 0) + 1; });
  const today = dayOf(t), entriesByDay = {};
  entries.forEach(e => { const d = dayOf(Date.parse(e.createdAt)); entriesByDay[d] = (entriesByDay[d] || 0) + 1; });
  const newByDay = {}; first.forEach(d => { newByDay[d] = (newByDay[d] || 0) + 1; });
  const daily = lastDays(today, days).map(day => ({ day, visitors: (dayVis.get(day) || new Set()).size, newVisitors: newByDay[day] || 0, visits: visitsByDay[day] || 0, entries: entriesByDay[day] || 0 }));
  const rows = entries.map(e => {
    const picks = L.unpackSim(e.pack).picks;
    const correct = L.decidedIds(win).filter(k => picks[k] === win[k]).length;
    return Object.assign(publicEntry(e), { champion: e.champion, correct, perfect: L.isPerfect(picks, win) });
  }).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const champions = {}; rows.forEach(e => { champions[e.champion] = (champions[e.champion] || 0) + 1; });
  const rooting = { own: 0, star: 0, cn: 0, region: 0 };
  rows.forEach(e => { rooting[e.root === "star" || e.root === "cn" ? e.root : e.root ? "region" : "own"]++; });
  const size = k => (sets[k] || new Set()).size;
  return {
    generatedAt: new Date(t).toISOString(), timeZone: TIME_ZONE, today,
    totals: {
      visitors: first.size, visits, visitorsToday: (dayVis.get(today) || new Set()).size, newToday: newByDay[today] || 0,
      entries: rows.length, entriesToday: entriesByDay[today] || 0, passAround: rows.filter(e => e.guest).length,
      enteringDevices: size("enter"), updates: evKeys.filter(k => k.split("/")[2] === "update").length
    },
    funnel: { visited: size("visit"), started: size("start"), completed: size("complete"), entered: size("enter") },
    daily, devices,
    tabs: distinct("tab", Object.keys(counts.tab || {})), tabViews: counts.tab || {},
    discover: distinct("discover", Object.keys(counts.discover || {})),
    fills: counts.fill || {}, sources: distinct("src", Object.keys(counts.src || {})),
    champions, rooting, entries: rows,
    results: { winners: win, source: r.source || "", updatedAt: r.updatedAt || null, played: played(r) }
  };
}
function prune(w) { for (const g of L.GAMES) if (w[g.id]) { const c = L.cands(g, w); if (!c.every(Boolean) || !c.includes(w[g.id])) delete w[g.id]; } return w; }
async function postResults(req, store, t) {
  const b = await readJSON(req), r = await results(store);
  let winners = Object.assign({}, r.winners || {}), source = r.source || "recorded";
  if (b.action === "simulate") {
    const nx = L.nextRound(winners); if (!nx) throw new HttpError(409, "Every game has a result.");
    winners = nx.winners; source = "simulated";
  } else if (b.action === "record") {
    const g = L.G[b.game]; const c = g ? L.cands(g, winners) : [];
    if (!g || !c.every(Boolean) || !c.includes(b.team)) throw new HttpError(400, "That team isn’t playing in that game yet.");
    if (winners[g.id]) throw new HttpError(409, "That game already has a result. Undo it first.");
    winners[g.id] = b.team; if (!played(r)) source = "recorded";
  } else if (b.action === "undo") {
    if (!L.G[b.game] || !winners[b.game]) throw new HttpError(400, "That game has no result.");
    delete winners[b.game]; prune(winners);
  } else if (b.action === "reset") { winners = {}; source = ""; }
  else throw new HttpError(400, "Unknown action.");
  const doc = { winners, source: L.decidedIds(winners).length ? source : "", updatedAt: new Date(t).toISOString() };
  await store.setJSON("state/results", doc);
  return json(200, { results: Object.assign(doc, { played: played(doc) }) });
}
async function deleteEntries(req, store) {
  const b = await readJSON(req);
  const ids = (Array.isArray(b.ids) ? b.ids : []).filter(id => ID.test(String(id))).slice(0, 200);
  let deleted = 0;
  await pool(ids, 10, async id => {
    const keys = await listKeys(store, `pub/${id}/`);
    const e = await store.get(`entries/${id}`, { type: "json" });
    await Promise.all(keys.map(k => store.delete(k)));
    if (e) { await store.delete(`entries/${id}`); deleted++; }
  });
  return json(200, { deleted });
}
async function clearEvents(store) {
  const keys = await listKeys(store, "ev/"), batch = keys.slice(0, LIMITS.deleteBatch);
  await pool(batch, 25, k => store.delete(k));
  return json(200, { deleted: batch.length, remaining: keys.length - batch.length });
}

// ---------- router ----------
export async function handle(req, { store, adminToken = "", now = Date.now } = {}) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  const m = req.method, t = now();
  const routes = {
    "/events": { POST: () => postEvents(req, store, t) },
    "/state": { GET: () => getState(store) },
    "/entry": { GET: () => getEntry(req, url, store) },
    "/entries": { POST: () => postEntry(req, store, t) },
    "/admin/summary": { GET: () => buildSummary(store, t, Math.max(7, Math.min(90, Number(url.searchParams.get("days")) || 30))).then(s => json(200, s)) },
    "/admin/results": { POST: () => postResults(req, store, t) },
    "/admin/delete-entries": { POST: () => deleteEntries(req, store) },
    "/admin/clear-events": { POST: () => clearEvents(store) }
  };
  try {
    const route = routes[path];
    if (!route) throw new HttpError(404, "Not found.");
    if (!route[m]) throw new HttpError(405, "Method not allowed.");
    if (path.startsWith("/admin/")) authorize(req, adminToken);
    return await route[m]();
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.message });
    console.error(e);
    return json(500, { error: "Something went wrong on the server. Try again in a moment." });
  }
}
