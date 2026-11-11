/* Request body parsing, course validation, and Vimeo thumbnail resolution. */

async function readJson(req){
  if(req.body !== undefined && req.body !== null){
    if(typeof req.body === "string"){
      try{ return JSON.parse(req.body); }catch(e){ return null; }
    }
    return req.body;                       // already parsed by the platform
  }
  return await new Promise(function(resolve){
    let data = "";
    req.on("data", function(c){ data += c; if(data.length > 2e6){ data = ""; req.destroy(); resolve(null); } });
    req.on("end", function(){ try{ resolve(JSON.parse(data || "null")); }catch(e){ resolve(null); } });
    req.on("error", function(){ resolve(null); });
  });
}

function str(x, max){
  let s = (x == null) ? "" : String(x);
  if(max && s.length > max) s = s.slice(0, max);
  return s.trim();
}
function newId(){
  return "lesson-" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}

const RES_TYPES = ["prompt", "document", "reference", "link"];

function sanitizeCourse(body){
  if(!body || typeof body !== "object" || !Array.isArray(body.videos)) return null;

  const seen = {};
  const videos = body.videos.slice(0, 300).map(function(v){
    v = v || {};
    const resources = Array.isArray(v.resources)
      ? v.resources.slice(0, 40).map(function(r){
          r = r || {};
          const type = RES_TYPES.indexOf(r.type) >= 0 ? r.type : "link";
          return { label: str(r.label, 200), url: str(r.url, 2000), type: type };
        }).filter(function(r){ return r.label || r.url; })
      : [];
    let id = str(v.id, 80) || newId();
    if(seen[id]) id = newId();
    seen[id] = 1;
    return {
      id: id,
      title: str(v.title, 200),
      description: str(v.description, 8000),
      video: str(v.video, 2000),
      thumbnail: str(v.thumbnail, 2000),
      resources: resources
    };
  });

  return {
    name: str(body.name, 160) || "Course",
    tagline: str(body.tagline, 400),
    videos: videos
  };
}

/* Fill each Vimeo lesson that has no thumbnail with Vimeo's own thumbnail. */
async function resolveThumbs(course){
  await Promise.all(course.videos.map(async function(v){
    if(v.thumbnail) return;
    const m = String(v.video || "").match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if(!m) return;
    try{
      const r = await fetch("https://vimeo.com/api/oembed.json?url=" + encodeURIComponent("https://vimeo.com/" + m[1]));
      if(r.ok){
        const j = await r.json();
        if(j && j.thumbnail_url) v.thumbnail = j.thumbnail_url;
      }
    }catch(e){ /* leave blank — the site falls back to a generated thumbnail */ }
  }));
}

module.exports = { readJson, sanitizeCourse, resolveThumbs };
