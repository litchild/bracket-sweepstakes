// School names stay in English in both languages. Chinese names live in SCHOOL_ZH for team profiles.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const L = require("../js/logic.js");

const [ZH_COPY, SCHOOL_ZH] = vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../js/zh-dictionary.js"), "utf8") + ";[ZH_COPY, SCHOOL_ZH]");

test("field school names are never translated, and each has a Chinese name for its profile", () => {
  for (const t of Object.values(L.TEAMS)) {
    assert.ok(!Object.hasOwn(ZH_COPY, t.name), `${t.name} should stay in English`);
    assert.match(SCHOOL_ZH[t.name] || "", /\p{Script=Han}/u, `${t.name} needs a Chinese name`);
  }
  assert.ok(!Object.values(ZH_COPY).includes("中"), "nothing translates to or from the 中 badge");
});
