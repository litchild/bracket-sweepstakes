// API checks with an in-memory store. Run with: npm test
import test from "node:test";
import assert from "node:assert";
import L from "../js/logic.js";
import { handle, cleanName, dayOf, LIMITS } from "../netlify/lib/api.mjs";
import { memoryStore } from "../netlify/lib/memory-store.mjs";

const T0 = Date.parse("2026-11-25T15:00:00Z");
function api(opts = {}) {
  const store = memoryStore(); let t = T0;
  const call = async (method, path, body, headers = {}) => {
    const init = { method, headers: Object.assign({ "content-type": "application/json" }, headers) };
    if (body !== undefined) init.body = typeof body === "string" ? body : JSON.stringify(body);
    const r = await handle(new Request("https://example.test/api" + path, init), { store, adminToken: "adminpass", now: () => t, ...opts });
    const text = await r.text();
    return { status: r.status, body: text ? JSON.parse(text) : null };
  };
  const admin = (method, path, body) => call(method, path, body, { authorization: "Bearer adminpass" });
  return { store, call, admin, tick: ms => { t += ms; } };
}
const bracket = (root = null, cn = null) => { const p = L.randomBracket(L.helperFor(root, cn)); return { pack: L.packSim(root, p), picks: p }; };
const VID = "abcdefgh12345678";

test("nicknames are trimmed, cleaned and capped", () => {
  assert.strictEqual(cleanName("  Ever \n  C  "), "Ever C");
  assert.strictEqual(cleanName("a\u200bb\u0007c"), "abc");
  assert.strictEqual(Array.from(cleanName("篮".repeat(40))).length, LIMITS.name);
  assert.strictEqual(cleanName(null), "");
});

test("an entry is recorded, listed, read back and updated with its secret", async () => {
  const { call } = api();
  const b = bracket("star", "W11");
  const made = await call("POST", "/entries", { vid: VID, name: "  Lin ", pack: b.pack, cnTeam: "W11", star: "201142", mode: "star" });
  assert.strictEqual(made.status, 201);
  assert.match(made.body.secret, /^[A-Za-z0-9_-]{24}$/);
  assert.strictEqual(made.body.entry.name, "Lin");
  assert.strictEqual(made.body.entry.root, "star");
  const id = made.body.entry.id;

  let st = await call("GET", "/state");
  assert.deepStrictEqual(st.body.entries, [b.pack]);
  assert.strictEqual(JSON.stringify(st.body).includes("Lin"), false, "nicknames stay out of the public state");

  const read = await call("GET", `/entry?id=${id}`, undefined, { "x-entry-secret": made.body.secret });
  assert.strictEqual(read.status, 200);
  assert.strictEqual(read.body.entry.pack, b.pack);
  assert.strictEqual((await call("GET", `/entry?id=${id}`, undefined, { "x-entry-secret": "wrong" })).status, 403);

  const b2 = bracket();
  const up = await call("POST", "/entries", { vid: VID, id, secret: made.body.secret, name: "Lin", pack: b2.pack });
  assert.strictEqual(up.status, 200);
  assert.strictEqual(up.body.secret, undefined);
  st = await call("GET", "/state");
  assert.deepStrictEqual(st.body.entries, [b2.pack], "the old public pick list is replaced");
  assert.strictEqual((await call("POST", "/entries", { vid: VID, id, secret: "nope", name: "X", pack: b2.pack })).status, 403);
});

test("entries are validated", async () => {
  const { call } = api();
  const b = bracket();
  assert.strictEqual((await call("POST", "/entries", { vid: VID, name: "", pack: b.pack })).status, 400);
  assert.strictEqual((await call("POST", "/entries", { vid: VID, name: "A", pack: "short" })).status, 400);
  assert.strictEqual((await call("POST", "/entries", { vid: "x", name: "A", pack: b.pack })).status, 400);
  assert.strictEqual((await call("POST", "/entries", "{not json")).status, 400);
  assert.strictEqual((await call("POST", "/entries", "x".repeat(LIMITS.body + 1))).status, 413);
  const odd = await call("POST", "/entries", { vid: VID, name: "A", pack: b.pack, cnTeam: "ZZ", star: "<b>", mode: "hack", guest: 1 });
  assert.strictEqual(odd.status, 201);
  assert.strictEqual(odd.body.entry.cnTeam, "");
  assert.strictEqual(odd.body.entry.star, "");
  assert.strictEqual(odd.body.entry.mode, "manual");
  assert.strictEqual(odd.body.entry.guest, true);
  assert.strictEqual((await call("GET", "/nope")).status, 404);
  assert.strictEqual((await call("GET", "/entries")).status, 405);
});

test("a device has a daily entry limit", async () => {
  const { call } = api();
  for (let i = 0; i < LIMITS.perDevicePerDay; i++) assert.strictEqual((await call("POST", "/entries", { vid: VID, name: "P" + i, pack: bracket().pack, guest: true })).status, 201);
  assert.strictEqual((await call("POST", "/entries", { vid: VID, name: "One more", pack: bracket().pack })).status, 429);
  assert.strictEqual((await call("POST", "/entries", { vid: "otherdevice123", name: "Other", pack: bracket().pack })).status, 201);
});

test("events accept known types and safe details only", async () => {
  const { call, store } = api();
  const r = await call("POST", "/events", { vid: VID, events: [
    { type: "visit", detail: "phone" }, { type: "tab", detail: "Crowd" }, { type: "src", detail: "bilibili.com" },
    { type: "enter", detail: "own" }, { type: "tab", detail: "../../x" }, { type: "bogus" }
  ] });
  assert.strictEqual(r.status, 204);
  const keys = [...store.data.keys()].filter(k => k.startsWith("ev/"));
  assert.strictEqual(keys.length, 3);
  assert.ok(keys.every(k => k.startsWith(`ev/${dayOf(T0)}/`)));
  assert.ok(keys.some(k => k.includes("/tab/" + VID + "/crowd/")));
  assert.strictEqual((await call("POST", "/events", { events: [{ type: "visit" }] })).status, 400);
  const many = Array.from({ length: 50 }, () => ({ type: "tab", detail: "learn" }));
  await call("POST", "/events", { vid: VID, events: many });
  assert.strictEqual([...store.data.keys()].filter(k => k.startsWith("ev/")).length, 3 + LIMITS.events);
});

test("admin routes need the password", async () => {
  const { call, admin } = api();
  assert.strictEqual((await call("GET", "/admin/summary")).status, 401);
  assert.strictEqual((await call("GET", "/admin/summary", undefined, { authorization: "Bearer wrong" })).status, 401);
  assert.strictEqual((await admin("GET", "/admin/summary")).status, 200);
  const off = api({ adminToken: "" });
  assert.strictEqual((await off.admin("GET", "/admin/summary")).status, 503);
});

test("the summary counts visitors, the entry funnel and days", async () => {
  const { call, admin, tick } = api();
  const ev = (vid, ...events) => call("POST", "/events", { vid, events: events.map(([type, detail]) => ({ type, detail })) });
  await ev("visitor000000001", ["visit", "phone"], ["src", "qr-class"], ["tab", "learn"], ["start"], ["complete"]);
  await ev("visitor000000002", ["visit", "desktop"], ["src", "direct"], ["tab", "crowd"], ["start"], ["fill", "star"]);
  await ev("visitor000000003", ["visit", "phone"], ["tab", "learn"]);
  await call("POST", "/entries", { vid: "visitor000000001", name: "Ana", pack: bracket("cn", "W2").pack, cnTeam: "W2", mode: "cn" });
  tick(864e5);
  await ev("visitor000000001", ["visit", "phone"]);
  await ev("visitor000000004", ["visit", "tablet"]);
  const s = (await admin("GET", "/admin/summary?days=7")).body;
  assert.strictEqual(s.totals.visitors, 4);
  assert.strictEqual(s.totals.visits, 5);
  assert.strictEqual(s.totals.visitorsToday, 2);
  assert.strictEqual(s.totals.newToday, 1);
  assert.strictEqual(s.totals.entries, 1);
  assert.deepStrictEqual(s.funnel, { visited: 4, started: 2, completed: 1, entered: 1 });
  assert.deepStrictEqual(s.devices, { phone: 2, desktop: 1, tablet: 1 });
  assert.deepStrictEqual(s.tabs, { learn: 2, crowd: 1 });
  assert.deepStrictEqual(s.sources, { "qr-class": 1, direct: 1 });
  assert.deepStrictEqual(s.fills, { star: 1 });
  assert.strictEqual(s.daily.length, 7);
  assert.deepStrictEqual(s.daily.slice(-2).map(d => [d.visitors, d.newVisitors, d.entries]), [[3, 3, 1], [2, 1, 0]]);
  assert.strictEqual(s.rooting.cn, 1);
  assert.strictEqual(s.entries[0].name, "Ana");
  assert.strictEqual(s.entries[0].secretHash, undefined);
  assert.strictEqual(s.entries[0].vid, undefined);
});

test("results lock entries, track correct picks and can be undone or reset", async () => {
  const { call, admin } = api();
  const b = bracket();
  const made = await call("POST", "/entries", { vid: VID, name: "Kai", pack: b.pack });
  let r = await admin("POST", "/admin/results", { action: "simulate" });
  assert.strictEqual(r.body.results.played, 32);
  assert.strictEqual(r.body.results.source, "simulated");
  assert.strictEqual((await call("POST", "/entries", { vid: VID, name: "Late", pack: bracket().pack })).status, 409);
  assert.strictEqual((await call("POST", "/entries", { vid: VID, id: made.body.entry.id, secret: made.body.secret, name: "Kai", pack: bracket().pack })).status, 409);
  const st = await call("GET", "/state");
  assert.strictEqual(Object.keys(st.body.winners).length, 32);
  const s = (await admin("GET", "/admin/summary")).body;
  const expect = L.decidedIds(st.body.winners).filter(k => b.picks[k] === st.body.winners[k]).length;
  assert.strictEqual(s.entries[0].correct, expect);

  r = await admin("POST", "/admin/results", { action: "reset" });
  assert.strictEqual(r.body.results.played, 0);
  const w = {};
  const g = L.G["E1-0"];
  assert.strictEqual((await admin("POST", "/admin/results", { action: "record", game: "E2-0", team: "E1" })).status, 400);
  r = await admin("POST", "/admin/results", { action: "record", game: g.id, team: "E1" });
  assert.strictEqual(r.body.results.source, "recorded");
  await admin("POST", "/admin/results", { action: "record", game: "E1-1", team: "E8" });
  await admin("POST", "/admin/results", { action: "record", game: "E2-0", team: "E8" });
  assert.strictEqual((await admin("POST", "/admin/results", { action: "record", game: "E2-0", team: "E1" })).status, 409);
  r = await admin("POST", "/admin/results", { action: "undo", game: "E1-1" });
  assert.deepStrictEqual(r.body.results.winners, Object.assign(w, { "E1-0": "E1" }), "undo also clears later games that depended on it");
});

test("admin can delete entries and clear visit data", async () => {
  const { call, admin, store } = api();
  const a = await call("POST", "/entries", { vid: VID, name: "Test", pack: bracket().pack });
  await call("POST", "/entries", { vid: VID, name: "Keep", pack: bracket().pack });
  await call("POST", "/events", { vid: VID, events: [{ type: "visit", detail: "phone" }] });
  const d = await admin("POST", "/admin/delete-entries", { ids: [a.body.entry.id, "bad id"] });
  assert.strictEqual(d.body.deleted, 1);
  assert.strictEqual((await call("GET", "/state")).body.entries.length, 1);
  const c = await admin("POST", "/admin/clear-events", {});
  assert.strictEqual(c.body.remaining, 0);
  assert.strictEqual([...store.data.keys()].filter(k => k.startsWith("ev/")).length, 0);
  assert.strictEqual((await admin("GET", "/admin/summary")).body.totals.entries, 1);
});
