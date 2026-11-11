-- Digital Business Bootcamp — Supabase setup
-- Run this once in your Supabase project:  SQL Editor → New query → paste → Run.
--
-- It creates a tiny key/value table that stores the whole course as one JSON row.
-- Row Level Security is ON with no policies, so the public "anon" key cannot read
-- or write it. The site's serverless functions use the secret service_role key,
-- which bypasses RLS — so only your backend can change the content.

create table if not exists public.app_kv (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.app_kv enable row level security;

-- (Intentionally no policies — only the service_role key may access this table.)
