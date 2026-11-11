// Run with: npm test   (or: node --test)
const test = require("node:test");
const assert = require("node:assert");
const L = require("../js/logic.js");

const N = 400; // random brackets per rule check

test("field and game tree", () => {
  assert.strictEqual(Object.keys(L.TEAMS).length, 64);
  assert.strictEqual(L.GAMES.length, 63);
  const homes = {};
  Object.values(L.TEAMS).forEach(t => { homes[t.home] = (homes[t.home] || 0) + 1; });
  assert.deepStrictEqual(homes, { south: 30, midwest: 17, east: 7, west: 10 });
  L.CN_IDS.forEach(id => assert.ok(L.TEAMS[id], `Chinese-player team ${id} is in the field`));
});

test("region rule: rooted region beats every other region; champion comes from it", () => {
  for (const root of L.ROOT_ORDER) {
    for (let i = 0; i < N; i++) {
      const p = L.randomBracket(L.helperFor(root, null));
      assert.strictEqual(L.countPicks(p), 63);
      for (const g of L.GAMES) {
        const [a, b] = L.cands(g, p);
        const ha = L.TEAMS[a].home === root, hb = L.TEAMS[b].home === root;
        if (ha !== hb) assert.strictEqual(L.TEAMS[p[g.id]].home, root);
      }
      assert.strictEqual(L.TEAMS[p["F6-0"]].home, root);
    }
  }
});

test("Chinese-player rule: chosen team wins it all; Chinese-player teams never lose to other teams", () => {
  for (const pick of L.CN_IDS) {
    for (let i = 0; i < N; i++) {
      const p = L.randomBracket(L.helperFor("cn", pick));
      assert.strictEqual(p["F6-0"], pick);
      for (const g of L.GAMES) {
        const [a, b] = L.cands(g, p);
        if (a === pick || b === pick) assert.strictEqual(p[g.id], pick);
        const ca = a in L.CN_PLAYERS, cb = b in L.CN_PLAYERS;
        if (ca !== cb) assert.ok(p[g.id] in L.CN_PLAYERS);
      }
    }
  }
});

test("changing an early pick clears later picks that depended on it", () => {
  const p = L.randomBracket(null);
  const champ = p["F6-0"];
  const first = L.GAMES.find(g => g.round === 1 && g.srcT.includes(champ));
  const other = first.srcT.find(t => t !== champ);
  const q = L.applyPick(p, first.id, other);
  assert.ok(!q["F6-0"]);
  assert.ok(L.countPicks(q) < 63);
});

test("compact storage round-trips", () => {
  for (const root of [...L.ROOT_ORDER, "cn", null]) {
    const cn = root === "cn" ? "W2" : null;
    const p = L.randomBracket(L.helperFor(root, cn));
    assert.strictEqual(L.encode(L.decode(L.encode(p))), L.encode(p));
    const u = L.unpackSim(L.packSim(root, p));
    assert.strictEqual(u.root, root);
    assert.strictEqual(L.encode(u.picks), L.encode(p));
    if (root === "cn") assert.strictEqual(u.cnTeam, "W2");
  }
});

test("simulated tournament completes and scoring adds up", () => {
  let w = {}, r;
  while ((r = L.nextRound(w))) w = r.winners;
  assert.strictEqual(L.decidedIds(w).length, 63);
  assert.ok(L.isPerfect(w, w));
  assert.strictEqual(L.score(w, w), 32 * 10 + 16 * 20 + 8 * 40 + 4 * 80 + 2 * 160 + 320);
  assert.strictEqual(L.latestRound(w), 6);
});
