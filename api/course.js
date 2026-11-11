/* GET  /api/course  → public: the live course (or the seed if empty)
   PUT  /api/course  → admin only: save the whole course (Bearer token)   */
const { isConfigured, kvGet, kvSet } = require("./_lib/store");
const { verifyToken } = require("./_lib/auth");
const { readJson, sanitizeCourse, resolveThumbs } = require("./_lib/util");
const SEED = require("./_lib/seed");

const COURSE_KEY = "dbb:course";

module.exports = async function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  if(req.method === "OPTIONS"){ res.statusCode = 204; return res.end(); }

  if(req.method === "GET"){
    res.setHeader("Cache-Control", "no-store");
    let course = null;
    try{ const raw = await kvGet(COURSE_KEY); if(raw) course = JSON.parse(raw); }catch(e){}
    if(!course || !Array.isArray(course.videos)) course = SEED;
    return send(res, 200, course);
  }

  if(req.method === "PUT" || req.method === "POST"){
    const secret = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "";
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if(!secret || !verifyToken(token, secret)){
      return send(res, 401, { error: "Not authorized. Please log in again." });
    }
    if(!isConfigured()){
      return send(res, 500, { error: "The content database isn't set up yet. Add the KV / Upstash env vars in Vercel, then redeploy." });
    }
    const course = sanitizeCourse(await readJson(req));
    if(!course){ return send(res, 400, { error: "Invalid course data." }); }
    try{ await resolveThumbs(course); }catch(e){}
    try{ await kvSet(COURSE_KEY, JSON.stringify(course)); }
    catch(e){ return send(res, 500, { error: "Could not save your changes: " + e.message }); }
    return send(res, 200, course);
  }

  return send(res, 405, { error: "Method not allowed" });
};

function send(res, status, obj){
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}
