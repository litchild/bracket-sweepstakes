// Netlify Function behind every /api/* request. The site calls its own domain, so the API loads wherever the
// site loads. Production and deploy previews use separate Blobs stores, so testing a pull request never
// changes the live entries or visit counts.
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";
import keyDigest from "../../server/admin-digest.json" with {type:"json"};
import { handle } from "../lib/api.mjs";

export default async (req, context) => {
  const production = context && context.deploy && context.deploy.context === "production";
  const store = getStore({ name: production ? "bracket-live" : "bracket-preview", consistency: "strong" });
  const env = globalThis.Netlify && globalThis.Netlify.env;
  const adminToken = (env && env.get("ADMIN_TOKEN")) || process.env.ADMIN_TOKEN || "";
  const token = (req.headers.get("authorization") || "").replace(/^Bearer /,"");
  const matchesPilotKey = timingSafeEqual(createHash("sha256").update(token).digest(), Buffer.from(keyDigest,"hex"));
  return handle(req, { store, adminToken: matchesPilotKey ? token : adminToken });
};

export const config = { path: ["/api/events","/api/admin/*"] };
