// Hosted backend for the website: the site's own /api (netlify/functions/api.mjs on Netlify Blobs).
// The API is on the same domain as the page, so it loads wherever the site loads, including mainland China.
// remoteBackend() has the same db.doc()/db.collection() shape as localBackend() in app.js.
// track() records first-party visit events with a random device id. No contact details or IP addresses are stored.
// Opening index.html from disk (file://) keeps the browser-only demo backend.
const LIVE = typeof location !== "undefined" && /^https?:$/.test(location.protocol);
const API = "/api";
function lsGet(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function randomId(n) { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, x => "abcdefghijklmnopqrstuvwxyz0123456789"[x % 36]).join(""); }
let memoryVid = null;
function deviceId() {
  let v = lsGet("bs-vid");
  if (typeof v !== "string" || !/^[a-z0-9]{16}$/.test(v)) { v = memoryVid || randomId(16); lsSet("bs-vid", v); }
  memoryVid = v; return v;
}

// ---------- visit tracking ----------
const trackQueue = [], trackSeen = new Set(); let trackTimer = null;
function track(type, detail) {
  if (!LIVE) return;
  detail = String(detail || "").toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(0, 40);
  const k = type + ":" + detail; if (trackSeen.has(k)) return; trackSeen.add(k); // once per page load
  trackQueue.push({ type, detail }); clearTimeout(trackTimer); trackTimer = setTimeout(flushTrack, 1500);
}
function flushTrack() {
  clearTimeout(trackTimer);
  while (trackQueue.length) {
    const body = JSON.stringify({ vid: deviceId(), events: trackQueue.splice(0, 20) });
    let sent = false;
    try { sent = !!(navigator.sendBeacon && navigator.sendBeacon(API + "/events", new Blob([body], { type: "text/plain" }))); } catch (e) {}
    if (!sent) fetch(API + "/events", { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain" } }).catch(() => {});
  }
}
function trackVisit() {
  if (!LIVE) return;
  track("visit", innerWidth <= 600 ? "phone" : innerWidth <= 1024 ? "tablet" : "desktop");
  let first = true; try { first = !sessionStorage.getItem("bs-src"); sessionStorage.setItem("bs-src", "1"); } catch (e) {}
  if (!first) return;
  const q = new URLSearchParams(location.search); let src = q.get("src") || q.get("utm_source") || "";
  if (!src && document.referrer) { try { const h = new URL(document.referrer).hostname.replace(/^www\./, ""); if (h !== location.hostname) src = h; } catch (e) {} }
  track("src", src || "direct");
}
if (LIVE) {
  addEventListener("pagehide", flushTrack);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushTrack(); });
}

// ---------- entries and results ----------
function remoteBackend() {
  let state = null, failed = false, inflight = null, timer = null;
  const subs = new Set(), decoded = new Map();
  async function call(method, path, body, headers) {
    const r = await fetch(API + path, { method, cache: "no-store", headers: Object.assign({ "content-type": "application/json" }, headers || {}), body: body ? JSON.stringify(body) : undefined });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(data.error || "Request failed"); e.status = r.status;
      e.code = { 409: "locked", 429: "rate_limited", 507: "quota_exceeded" }[r.status] || "error";
      throw e;
    }
    return data;
  }
  function schedule() { clearTimeout(timer); if (document.visibilityState === "visible") timer = setTimeout(refresh, 30000); }
  function refresh() {
    if (inflight) return inflight;
    inflight = call("GET", "/state").then(s => { state = s; failed = false; }, () => { failed = true; })
      .then(() => { inflight = null; subs.forEach(f => f()); schedule(); });
    return inflight;
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") refresh(); else clearTimeout(timer); });
  function watch(onData, onError) {
    const f = () => { if (state) onData(); else if (failed && onError) onError(); };
    subs.add(f); if (state || failed) setTimeout(f, 0); else refresh();
    return () => subs.delete(f);
  }
  const unpack = p => { if (!decoded.has(p)) decoded.set(p, unpackSim(p)); return decoded.get(p); };
  const snap = (id, v) => ({ id, exists: v != null, data: () => (v == null ? undefined : JSON.parse(JSON.stringify(v))) });
  const fromEntry = e => { const u = unpackSim(e.pack) || {}; return { picks: u.picks || {}, root: e.root || null, cnTeam: e.cnTeam || null, star: e.star || null, mode: e.mode || "manual", name: e.name || "" }; };
  async function save(id, v) {
    const own = id === "me", creds = own ? lsGet("bs-entry") : null;
    const body = { vid: deviceId(), name: v.name || (creds && creds.name) || "", pack: packSim(v.root || null, v.picks), cnTeam: v.cnTeam || "", star: v.star || "", mode: v.mode || "manual", guest: !own };
    let r;
    try { r = await call("POST", "/entries", creds && creds.id ? Object.assign({ id: creds.id, secret: creds.secret }, body) : body); }
    catch (e) {
      if (!(creds && (e.status === 404 || e.status === 403))) throw e;
      lsSet("bs-entry", null); r = await call("POST", "/entries", body); // the saved entry was removed, so record a new one
    }
    if (own) lsSet("bs-entry", { id: r.entry.id, secret: r.secret || creds.secret, name: r.entry.name });
    else lsSet("bs-guests", (lsGet("bs-guests") || []).concat(r.entry.id).slice(-200));
    refresh();
    return r.entry;
  }
  const doc = path => {
    const id = path.split("/").pop();
    return {
      get: async () => {
        if (path !== "entries/me") return snap(id, null);
        const creds = lsGet("bs-entry"); if (!creds || !creds.id) return snap(id, null);
        try { const r = await call("GET", `/entry?id=${encodeURIComponent(creds.id)}`, null, { "x-entry-secret": creds.secret }); return snap(id, fromEntry(r.entry)); }
        catch (e) { if (e.status === 404 || e.status === 403) lsSet("bs-entry", null); return snap(id, null); }
      },
      set: v => save(id, v),
      delete: async () => { throw Object.assign(new Error("Entries are removed from the dashboard."), { code: "error" }); },
      onSnapshot: (fn, err) => {
        if (path === "state/results") return watch(() => fn(snap(id, { winners: state.winners || {}, source: state.source || "" })), err);
        return watch(() => fn(snap(id, null)), err);
      }
    };
  };
  const collection = () => {
    const q = { limit: () => q, onSnapshot: (fn, err) => watch(() => fn({ docs: (state.entries || []).map((p, i) => { const u = unpack(p); return snap("r" + i, u ? { picks: u.picks, root: u.root, cnTeam: u.cnTeam } : null); }) }), err) };
    return q;
  };
  return {
    live: true, refresh,
    db: { doc, collection },
    user: { id: async () => "me", canEdit: async () => false, name: () => (lsGet("bs-entry") || {}).name || "" }
  };
}
