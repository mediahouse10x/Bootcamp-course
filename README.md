# Digital Business Bootcamp — video course + admin panel

A video-based learning site where learners open a link, watch each lesson in
order, and unlock the next only after fully watching the current one. You manage
**all** content — lessons, Vimeo/YouTube/MP4 links, descriptions, thumbnails,
resources, and lesson order — from a password-protected **admin panel**. No code
edits needed to add or change lessons.

Supports Vimeo, YouTube, and direct video files. Completion can't be faked:
watch progress is tracked across the whole timeline, so skipping ahead never
marks a lesson complete.

## What's in here

```
index.html        The learner site (loads content live from /api/course)
admin.html        The admin panel  (open at /admin)
api/
  course.js       GET = public course · PUT = save (admin only)
  login.js        POST password → session token
  thumb.js        Vimeo thumbnail preview for the admin
  _lib/           storage (Supabase / KV), auth, validation, seed content
supabase-setup.sql  one-time SQL to create the storage table
vercel.json       Vercel config (clean URLs, no-cache API)
package.json
```

The content lives in a free **Supabase** (Postgres) database. The learner site
reads it; the admin panel writes it. (The code also accepts Upstash / Vercel KV
as an alternative, if you ever switch.)

---

## Deploy to Vercel (one-time, ~5–10 min)

You'll do these in your own Vercel account (I can't log in for you). Everything
below is on Vercel's free tier.

### 1. Put the project on Vercel
- Easiest: push this `digital-business-bootcamp` folder to a **GitHub** repo,
  then in Vercel click **Add New → Project → Import** that repo.
- Or with the CLI: `npm i -g vercel`, then run `vercel` inside this folder.

Framework preset: **Other**. No build command needed.

### 2. Set up the Supabase database
1. In [supabase.com](https://supabase.com) create a project (free tier).
2. Open **SQL Editor → New query**, paste the contents of `supabase-setup.sql`
   (in this folder), and click **Run**. This creates the storage table.
3. Go to **Project Settings → API** and copy two values:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - the **`service_role`** key (under *Project API keys* — the secret one)

### 3. Add environment variables in Vercel
Project → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `ADMIN_PASSWORD` | the password you'll use to log into the admin panel |
| `AUTH_SECRET` | any long random string (e.g. from a password generator) |
| `SUPABASE_URL` | your Supabase **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase **service_role** secret key |

> The `service_role` key is powerful — keep it only in Vercel's env vars. It's
> used server-side only and never reaches the browser.

### 4. Redeploy
Project → **Deployments** → **Redeploy** (so the new env vars take effect).

### 5. Add your content
- Open `https://your-site.vercel.app/admin`
- Log in with your `ADMIN_PASSWORD`
- Add your lessons, paste your **Vimeo** links, write descriptions, add resources,
  reorder with the ▲▼ buttons, then click **Save & publish**.
- Learners use `https://your-site.vercel.app/`

That's it — from then on you manage everything in the admin panel.

---

## Using the admin panel

- **Course details** — course name + tagline (shown on the landing page).
- **Lessons** — add / edit / delete, and reorder with ▲▼ (order = learning order).
- **Each lesson** — title, video link (Vimeo / YouTube / .mp4), description,
  optional thumbnail (Vimeo's own thumbnail is used automatically if you leave it
  blank), and any number of resource links (prompt / document / reference / link).
- **Save & publish** — edits are kept as a draft until you click this; then they
  go live for everyone. The top bar shows whether you have unpublished changes.

Your password and the login token are never stored in the site's code — the
password lives only in Vercel's environment variables.

---

## Run locally (optional)

- Static preview only (uses built-in sample content): open `index.html`, or
  `python3 -m http.server 8080` and visit http://localhost:8080
- Full app with the admin panel + database working locally:
  `npm i -g vercel`, then `vercel dev` (after step 2–3 above, with `vercel env pull`).

## Notes

- Videos must allow embedding (YouTube: *Allow embedding*; Vimeo: privacy set to
  play on other sites). Most do by default.
- Learner progress is saved per-person in their browser.
- The free Upstash tier is generous (plenty for course content); no card needed.
