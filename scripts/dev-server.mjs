// Local server for `npm start`: serves the site and runs the same /api handler as the Netlify Function.
// Data is kept in .data/dev-store.json (ignored by git). DEV_STORE=memory keeps it in memory only.
// The admin password is ADMIN_TOKEN, or "local-admin" when that is unset.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { handle } from "../netlify/lib/api.mjs";
import { memoryStore } from "../netlify/lib/memory-store.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT) || 8888;
const adminToken = process.env.ADMIN_TOKEN || "local-admin";
const store = memoryStore(process.env.DEV_STORE === "memory" ? null : join(root, ".data", "dev-store.json"));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon" };
// Mirrors the 404 rules in netlify.toml.
const HIDDEN = /^\/(wechat|docs|tests|netlify|scripts|node_modules|\.data|\.git)(\/|$)|^\/(CLAUDE|README|AGENTS)\.md$|^\/package(-lock)?\.json$/;

async function notFound(res) { res.writeHead(404, { "content-type": TYPES[".html"] }); res.end(await readFile(join(root, "404.html"))); }

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname.startsWith("/api/")) {
      const chunks = []; for await (const c of req) chunks.push(c);
      const headers = {}; ["content-type", "authorization", "x-entry-secret"].forEach(h => { if (req.headers[h]) headers[h] = req.headers[h]; });
      const body = req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks);
      const r = await handle(new Request(url, { method: req.method, headers, body }), { store, adminToken });
      res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }
    let p = decodeURIComponent(url.pathname);
    if (HIDDEN.test(p)) return notFound(res);
    if (p.endsWith("/")) p += "index.html";
    const file = normalize(join(root, p));
    if (file !== root && !file.startsWith(root + sep)) return notFound(res);
    const s = await stat(file).catch(() => null);
    if (!s) return notFound(res);
    if (s.isDirectory()) { res.writeHead(301, { location: url.pathname + "/" }); res.end(); return; }
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
    res.end(await readFile(file));
  } catch (e) {
    console.error(e); res.writeHead(500); res.end("Server error");
  }
}).listen(port, () => {
  console.log(`Bracket Sweepstakes: http://localhost:${port}/`);
  console.log(`Dashboard: http://localhost:${port}/admin/ (password: ${process.env.ADMIN_TOKEN ? "your ADMIN_TOKEN" : adminToken})`);
});
