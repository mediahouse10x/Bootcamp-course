/* GET /api/thumb?video=<url> → { thumbnail }  (Vimeo thumbnail preview for the admin). */
module.exports = async function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  let video = "";
  try{ video = new URL(req.url, "http://x").searchParams.get("video") || ""; }catch(e){}
  const m = String(video).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if(!m){ res.statusCode = 200; return res.end(JSON.stringify({ thumbnail: null })); }
  try{
    const r = await fetch("https://vimeo.com/api/oembed.json?url=" + encodeURIComponent("https://vimeo.com/" + m[1]));
    if(r.ok){
      const j = await r.json();
      res.statusCode = 200;
      return res.end(JSON.stringify({ thumbnail: (j && j.thumbnail_url) || null }));
    }
  }catch(e){}
  res.statusCode = 200;
  res.end(JSON.stringify({ thumbnail: null }));
};
