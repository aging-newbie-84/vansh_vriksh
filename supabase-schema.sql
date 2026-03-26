-- ═══════════════════════════════════════════════════════════════════
-- Vansh Vriksha — Supabase Schema
-- Prefix: vv_ (safe to share Supabase project with other apps)
-- Run this in Supabase SQL Editor → New Query → paste → Run
-- ═══════════════════════════════════════════════════════════════════

-- Saved family trees (the whole tree is stored as a JSON blob)
create table if not exists vv_trees (
  id           uuid default gen_random_uuid() primary key,
  family_name  text not null,
  tree_data    jsonb not null,              -- full confirmed tree JSON (persons, relationships, etc.)
  share_code   text unique default substring(gen_random_uuid()::text, 1, 8),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Index for share code lookups (for shareable links)
create index if not exists idx_vv_trees_share_code on vv_trees (share_code);

-- Row Level Security: allow public reads (via share code) and inserts
alter table vv_trees enable row level security;

-- Anyone can read any tree (for shareable links)
create policy "Public read access" on vv_trees
  for select using (true);

-- Anyone can insert a new tree (no auth for Phase 1)
create policy "Public insert access" on vv_trees
  for insert with check (true);

-- Anyone can update their own tree (by id)
create policy "Public update access" on vv_trees
  for update using (true);
