// In-memory stand-in for a Netlify Blobs store, used by the tests and the local dev server.
// Pass a file path to keep the data between dev-server restarts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function memoryStore(file) {
  const data = new Map(file && existsSync(file) ? Object.entries(JSON.parse(readFileSync(file, "utf8"))) : []);
  let timer = null;
  const save = () => {
    if (!file || timer) return;
    timer = setTimeout(() => { timer = null; mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(Object.fromEntries(data))); }, 100);
  };
  const page = keys => ({ blobs: keys.map(key => ({ key, etag: "" })), directories: [] });
  return {
    data,
    async get(key, opts) { if (!data.has(key)) return null; const v = data.get(key); return opts && opts.type === "json" ? JSON.parse(v) : v; },
    async set(key, v) { data.set(key, String(v)); save(); },
    async setJSON(key, v) { data.set(key, JSON.stringify(v)); save(); },
    async delete(key) { data.delete(key); save(); },
    list({ prefix = "", paginate = false } = {}) {
      const keys = [...data.keys()].filter(k => k.startsWith(prefix)).sort();
      if (!paginate) return Promise.resolve(page(keys));
      return (async function* () { for (let i = 0; i === 0 || i < keys.length; i += 1000) yield page(keys.slice(i, i + 1000)); })();
    }
  };
}
