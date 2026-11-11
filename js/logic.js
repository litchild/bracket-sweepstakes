// Pure bracket logic: team data, game tree, auto-fill rules, scoring and compact storage.
// Loaded as a classic script in the browser (globals) and with require() in tests.

const ROOTS = {
  east:    { zh: "东", name: "East",    color: "--east",    guides: "Wang Junjie (UMass), Xinyi Li (LIU)", see: "Lobster rolls, New York pizza, street ball" },
  south:   { zh: "南", name: "South",   color: "--south",   guides: "Zhang Boyuan (Louisville), Deng Yuting (Oklahoma State)", see: "Barbecue, cowboy culture, jazz" },
  west:    { zh: "西", name: "West",    color: "--west",    guides: "Lin Wei (Oregon), Houran Dan (Hawaii)", see: "Beaches, Hollywood, Mexican-American food" },
  midwest: { zh: "北", name: "Midwest", color: "--midwest", guides: "Sinan Huan (Purdue), Kejia Ran (Xavier)", see: "Deep-dish pizza, county fairs, game days" }
};
const ROOT_ORDER = ["east", "south", "west", "midwest"];
const BR = {
  E: { name: "East", t: [[1,"Duke","south"],[16,"Siena","east"],[8,"Ohio State","midwest"],[9,"TCU","south"],[5,"St. John’s","east"],[12,"Northern Iowa","midwest"],[4,"Kansas","midwest"],[13,"California Baptist","west"],[6,"Louisville","south"],[11,"South Florida","south"],[3,"Michigan State","midwest"],[14,"North Dakota State","midwest"],[7,"UCLA","west"],[10,"UCF","south"],[2,"UConn","east"],[15,"Furman","south"]] },
  W: { name: "West", t: [[1,"Arizona","west"],[16,"LIU","east"],[8,"Villanova","east"],[9,"Utah State","west"],[5,"Wisconsin","midwest"],[12,"High Point","south"],[4,"Arkansas","south"],[13,"Hawaii","west"],[6,"BYU","west"],[11,"Texas","south"],[3,"Gonzaga","west"],[14,"Kennesaw State","south"],[7,"Miami (FL)","south"],[10,"Missouri","midwest"],[2,"Purdue","midwest"],[15,"Queens","south"]] },
  S: { name: "South", t: [[1,"Florida","south"],[16,"Prairie View A&M","south"],[8,"Clemson","south"],[9,"Iowa","midwest"],[5,"Vanderbilt","south"],[12,"McNeese","south"],[4,"Nebraska","midwest"],[13,"Troy","south"],[6,"North Carolina","south"],[11,"VCU","south"],[3,"Illinois","midwest"],[14,"Penn","east"],[7,"Saint Mary’s","west"],[10,"Texas A&M","south"],[2,"Houston","south"],[15,"Idaho","west"]] },
  M: { name: "Midwest", t: [[1,"Michigan","midwest"],[16,"Howard","south"],[8,"Georgia","south"],[9,"Saint Louis","midwest"],[5,"Texas Tech","south"],[12,"Akron","midwest"],[4,"Alabama","south"],[13,"Hofstra","east"],[6,"Tennessee","south"],[11,"Miami (OH)","midwest"],[3,"Virginia","south"],[14,"Wright State","midwest"],[7,"Kentucky","south"],[10,"Santa Clara","west"],[2,"Iowa State","midwest"],[15,"Tennessee State","south"]] }
};
const RX = ["E", "W", "S", "M"];
const ROUND_NAME = { 1: "Round of 64", 2: "Round of 32", 3: "Sweet 16", 4: "Elite 8", 5: "Final Four", 6: "Championship" };
const POINTS = { 1: 10, 2: 20, 3: 40, 4: 80, 5: 160, 6: 320 };
// Teams with a Chinese player on the 2026-27 roster (Sina Sports list) that appear in the 2026 field.
const CN_PLAYERS = { W2: "Sinan Huan", E6: "Zhang Boyuan", W13: "Houran Dan", W16: "Xinyi Li" };
const CN_IDS = ["W2", "E6", "W13", "W16"];

const TEAMS = {};
for (const X of RX) {
  BR[X].ids = BR[X].t.map(([seed, name, home]) => { const id = X + seed; TEAMS[id] = { id, seed, name, home, br: X }; return id; });
}
const GAMES = [], G = {};
function addGame(g) { GAMES.push(g); G[g.id] = g; }
for (const X of RX) for (let i = 0; i < 8; i++) addGame({ id: `${X}1-${i}`, round: 1, br: X, idx: i, srcT: [BR[X].ids[2 * i], BR[X].ids[2 * i + 1]] });
for (let r = 2; r <= 4; r++) for (const X of RX) for (let i = 0; i < (8 >> (r - 1)); i++) addGame({ id: `${X}${r}-${i}`, round: r, br: X, idx: i, srcG: [`${X}${r - 1}-${2 * i}`, `${X}${r - 1}-${2 * i + 1}`] });
addGame({ id: "F5-0", round: 5, br: "F", idx: 0, srcG: ["E4-0", "S4-0"] });
addGame({ id: "F5-1", round: 5, br: "F", idx: 1, srcG: ["W4-0", "M4-0"] });
addGame({ id: "F6-0", round: 6, br: "F", idx: 0, srcG: ["F5-0", "F5-1"] });

function cands(g, sel) { return g.srcT ? g.srcT.slice() : g.srcG.map(s => sel[s]); }
function strength(tid) { return Math.pow(TEAMS[tid].seed, -1.2); }
function helperFor(root, cnTeam) {
  if (root === "cn" && cnTeam && CN_PLAYERS[cnTeam]) return { cn: cnTeam };
  if (root && ROOTS[root]) return { root };
  return null;
}
// Region rule: your region's team always beats a team from another region.
// Chinese-player rule: your chosen team wins every game; other Chinese-player teams beat everyone else.
// Every other matchup is a coin flip weighted by seed.
function winProb(a, b, h) {
  if (h && h.cn) {
    if (a === h.cn) return 1;
    if (b === h.cn) return 0;
    const ca = a in CN_PLAYERS, cb = b in CN_PLAYERS;
    if (ca && !cb) return 1;
    if (cb && !ca) return 0;
  } else if (h && h.root) {
    const ha = TEAMS[a].home === h.root, hb = TEAMS[b].home === h.root;
    if (ha && !hb) return 1;
    if (hb && !ha) return 0;
  }
  const sa = strength(a), sb = strength(b);
  return sa / (sa + sb);
}
function randomBracket(h, rng) {
  rng = rng || Math.random;
  const p = {};
  for (const g of GAMES) { const [a, b] = cands(g, p); p[g.id] = rng() < winProb(a, b, h) ? a : b; }
  return p;
}
function applyPick(sel, gid, tid) {
  const out = Object.assign({}, sel);
  out[gid] = tid;
  const r0 = G[gid].round;
  for (const g of GAMES) { if (g.round <= r0) continue; const c = cands(g, out); if (out[g.id] && !c.includes(out[g.id])) delete out[g.id]; }
  return out;
}
function encode(sel) { let s = ""; for (const g of GAMES) { const c = cands(g, sel); s += sel[g.id] === c[1] ? "1" : "0"; } return s; }
function decode(bits) { const p = {}; GAMES.forEach((g, i) => { const c = cands(g, p); p[g.id] = bits[i] === "1" ? c[1] : c[0]; }); return p; }
function countPicks(sel, br) { return GAMES.filter(g => (br ? g.br === br : true) && sel[g.id]).length; }
function decidedIds(win) { return Object.keys(win || {}).filter(k => G[k]); }
function isPerfect(sel, win) { return decidedIds(win).every(k => sel[k] === win[k]); }
function score(sel, win) { let s = 0; for (const k of decidedIds(win)) if (sel[k] === win[k]) s += POINTS[G[k].round]; return s; }
function eliminated(win) { const out = new Set(); for (const k of decidedIds(win)) for (const t of cands(G[k], win)) if (t && t !== win[k]) out.add(t); return out; }
function lostIn(tid, win) { for (const k of decidedIds(win)) { if (win[k] !== tid && cands(G[k], win).includes(tid)) return G[k].round; } return 0; }
function nextRound(win, rng) {
  rng = rng || Math.random;
  const pending = GAMES.filter(g => !win[g.id] && cands(g, win).every(Boolean));
  if (!pending.length) return null;
  const r = Math.min(...pending.map(g => g.round));
  const out = Object.assign({}, win);
  for (const g of pending.filter(g => g.round === r)) { const [a, b] = cands(g, out); out[g.id] = rng() < winProb(a, b, null) ? a : b; }
  return { winners: out, round: r };
}
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const RCODE = { east: "e", south: "s", west: "w", midwest: "m", cn: "c" };
function packBits(bits) { let out = ""; for (let i = 0; i < bits.length; i += 6) out += B64[parseInt((bits.slice(i, i + 6) + "00000").slice(0, 6), 2)]; return out; }
function unpackBits(str) { let bits = ""; for (const ch of str) bits += Math.max(0, B64.indexOf(ch)).toString(2).padStart(6, "0"); return bits.slice(0, 63); }
function packSim(root, picks) { return (RCODE[root] || "x") + packBits(encode(picks)); }
function unpackSim(x) {
  let root = null, picks = null;
  if (typeof x === "string" && x.length >= 12) { root = Object.keys(RCODE).find(k => RCODE[k] === x[0]) || null; picks = decode(unpackBits(x.slice(1))); }
  else if (x && typeof x === "object" && typeof x.b === "string") { root = x.r || null; picks = decode(x.b); }
  else return null;
  return { root, picks, cnTeam: root === "cn" ? picks["F6-0"] : null };
}
function latestRound(win) { const ids = decidedIds(win); return ids.length ? Math.max(...ids.map(k => G[k].round)) : 0; }

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ROOTS, ROOT_ORDER, BR, RX, ROUND_NAME, POINTS, CN_PLAYERS, CN_IDS, TEAMS, GAMES, G,
    cands, strength, helperFor, winProb, randomBracket, applyPick, encode, decode, countPicks, decidedIds,
    isPerfect, score, eliminated, lostIn, nextRound, packSim, unpackSim, latestRound };
}
