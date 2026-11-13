const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {TEAMS, CN_IDS} = require('../js/logic.js');
const schools = require('../js/profiles.js');
const players = require('../js/players.js');

test('every school profile has a local, valid PNG logo', () => {
  for (const id of Object.keys(TEAMS)) {
    assert.ok(schools[id]?.fullName, id);
    assert.equal(new URL(schools[id].url).hostname, 'www.espn.com');
    const bytes = fs.readFileSync(path.join(__dirname, '../images/teams', id + '.png'));
    assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a', id);
  }
});

test('featured players map to the Chinese-player teams and have dated stats and local portraits', () => {
  assert.deepEqual(Object.keys(players).sort(), CN_IDS.slice().sort());
  for (const [id, p] of Object.entries(players)) {
    assert.ok(TEAMS[id]);
    assert.match(p.statLabel, /202[45]/);
    assert.equal(new URL(p.source).protocol, 'https:');
    assert.match(p.photo, /^images\/players\/[^/]+\.(jpg|png)$/);
    const bytes = fs.readFileSync(path.join(__dirname,'..',p.photo));
    const png = bytes.subarray(0,8).toString('hex') === '89504e470d0a1a0a';
    const jpeg = bytes.subarray(0,3).toString('hex') === 'ffd8ff';
    assert.ok(png || jpeg, `Undecodable portrait format: ${id}`);
    for (const [value, label] of p.stats) {
      assert.ok(Number(value) >= 0 && Number(value) < 50, id);
      assert.ok(label.length > 0);
    }
  }
});
