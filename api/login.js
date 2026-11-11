/* POST /api/login  { password }  → { token }  (used by the admin panel). */
const { signToken, safeEqual } = require("./_lib/auth");
const { readJson } = require("./_lib/util");

module.exports = async function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if(req.method === "OPTIONS"){ res.statusCode = 204; return res.end(); }
  if(req.method !== "POST"){ return send(res, 405, { error: "Method not allowed" }); }

  const expected = process.env.ADMIN_PASSWORD;
  if(!expected){
    return send(res, 500, { error: "Admin password isn't configured. Set ADMIN_PASSWORD in your Vercel project settings." });
  }
  const body = await readJson(req);
  const pass = body && body.password;
  if(!pass || !safeEqual(pass, expected)){
    return send(res, 401, { error: "Incorrect password." });
  }
  const secret = process.env.AUTH_SECRET || expected;
  return send(res, 200, { token: signToken(secret, 14 * 24 * 3600 * 1000), expiresInDays: 14 });
};

function send(res, status, obj){
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}
