/* Minimal stateless admin tokens, signed with HMAC-SHA256.
   The secret is AUTH_SECRET (falls back to ADMIN_PASSWORD if unset). */
const crypto = require("crypto");

function b64url(buf){
  return Buffer.from(buf).toString("base64").replace(/=+$/,"").replace(/\+/g,"-").replace(/\//g,"_");
}
function sign(payload, secret){
  return b64url(crypto.createHmac("sha256", secret).update(payload).digest());
}

function signToken(secret, ttlMs){
  const payload = b64url(JSON.stringify({ exp: Date.now() + (ttlMs || 14 * 24 * 3600 * 1000) }));
  return payload + "." + sign(payload, secret);
}

function verifyToken(token, secret){
  if(!token || typeof token !== "string" || !secret) return false;
  const parts = token.split(".");
  if(parts.length !== 2) return false;
  const expected = sign(parts[0], secret);
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expected);
  if(a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try{
    const json = Buffer.from(parts[0].replace(/-/g,"+").replace(/_/g,"/"), "base64").toString("utf8");
    const payload = JSON.parse(json);
    return typeof payload.exp === "number" && payload.exp > Date.now();
  }catch(e){ return false; }
}

function safeEqual(a, b){
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if(ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

module.exports = { signToken, verifyToken, safeEqual };
