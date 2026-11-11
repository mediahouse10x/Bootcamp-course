/* Tiny key/value storage backed by Upstash Redis (a.k.a. Vercel KV).
   Uses the REST API over fetch — no npm dependency required.

   It reads whichever of these env-var pairs your project has:
     - KV_REST_API_URL        + KV_REST_API_TOKEN          (Vercel KV / Marketplace Upstash)
     - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN   (Upstash direct)
*/
function creds(){
  const url = process.env.KV_REST_API_URL
    || process.env.UPSTASH_REDIS_REST_URL
    || process.env.REDIS_REST_URL
    || "";
  const token = process.env.KV_REST_API_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN
    || process.env.REDIS_REST_TOKEN
    || "";
  return { url: url.replace(/\/+$/, ""), token: token };
}

function isConfigured(){
  const c = creds();
  return !!(c.url && c.token);
}

async function kvGet(key){
  const c = creds();
  if(!c.url || !c.token) return null;
  const r = await fetch(c.url + "/get/" + encodeURIComponent(key), {
    headers: { Authorization: "Bearer " + c.token }
  });
  if(!r.ok) return null;
  const j = await r.json().catch(function(){ return null; });
  return j ? j.result : null;     // Upstash returns { result: <value|null> }
}

async function kvSet(key, value){
  const c = creds();
  if(!c.url || !c.token) throw new Error("Storage is not configured");
  const body = (typeof value === "string") ? value : JSON.stringify(value);
  const r = await fetch(c.url + "/set/" + encodeURIComponent(key), {
    method: "POST",
    headers: { Authorization: "Bearer " + c.token },
    body: body
  });
  if(!r.ok) throw new Error("Storage write failed (" + r.status + ")");
  return true;
}

module.exports = { isConfigured, kvGet, kvSet };
