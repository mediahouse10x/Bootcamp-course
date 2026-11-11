/* Key/value storage over REST — no npm dependency required.
   Prefers Supabase (Postgres) and falls back to Upstash Redis / Vercel KV.

   Supabase (recommended):
     SUPABASE_URL                 e.g. https://xxxx.supabase.co
     SUPABASE_SERVICE_ROLE_KEY    the secret service_role key (server-side only)
     SUPABASE_TABLE               optional, defaults to "app_kv"

   Upstash / Vercel KV (fallback):
     KV_REST_API_URL        + KV_REST_API_TOKEN
     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
*/

function supa(){
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SERVICE_KEY
    || process.env.SUPABASE_KEY
    || "";
  const table = process.env.SUPABASE_TABLE || "app_kv";
  return { url: url.replace(/\/+$/, ""), key: key, table: table };
}
function kv(){
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL || "";
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN || "";
  return { url: url.replace(/\/+$/, ""), token: token };
}

function isConfigured(){
  const s = supa(); if(s.url && s.key) return true;
  const u = kv();   return !!(u.url && u.token);
}

function safeParse(s){ try{ return JSON.parse(s); }catch(e){ return s; } }

async function kvGet(key){
  const s = supa();
  if(s.url && s.key){
    const r = await fetch(s.url + "/rest/v1/" + s.table + "?key=eq." + encodeURIComponent(key) + "&select=value", {
      headers: { apikey: s.key, Authorization: "Bearer " + s.key }
    });
    if(!r.ok) return null;
    const rows = await r.json().catch(function(){ return null; });
    if(Array.isArray(rows) && rows.length && rows[0].value != null){
      const v = rows[0].value;
      return (typeof v === "string") ? v : JSON.stringify(v);
    }
    return null;
  }

  const u = kv();
  if(!u.url || !u.token) return null;
  const r = await fetch(u.url + "/get/" + encodeURIComponent(key), { headers: { Authorization: "Bearer " + u.token } });
  if(!r.ok) return null;
  const j = await r.json().catch(function(){ return null; });
  return j ? j.result : null;
}

async function kvSet(key, value){
  const s = supa();
  if(s.url && s.key){
    const valObj = (typeof value === "string") ? safeParse(value) : value;
    const r = await fetch(s.url + "/rest/v1/" + s.table + "?on_conflict=key", {
      method: "POST",
      headers: {
        apikey: s.key,
        Authorization: "Bearer " + s.key,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({ key: key, value: valObj })
    });
    if(!r.ok){
      const t = await r.text().catch(function(){ return ""; });
      throw new Error("Supabase write failed (" + r.status + ") " + t.slice(0, 180));
    }
    return true;
  }

  const u = kv();
  if(!u.url || !u.token) throw new Error("Storage is not configured");
  const body = (typeof value === "string") ? value : JSON.stringify(value);
  const r = await fetch(u.url + "/set/" + encodeURIComponent(key), {
    method: "POST", headers: { Authorization: "Bearer " + u.token }, body: body
  });
  if(!r.ok) throw new Error("Storage write failed (" + r.status + ")");
  return true;
}

module.exports = { isConfigured, kvGet, kvSet };
