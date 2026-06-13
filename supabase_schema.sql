-- ─────────────────────────────────────────────────────────────
-- Hiring Wallah — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────
-- Mirrors Firebase Auth, stores role selection
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  firebase_uid text unique not null,
  email        text not null,
  name         text not null default '',
  role         text not null check (role in ('recruiter', 'candidate')),
  created_at   timestamptz not null default now()
);

-- ── Jobs ──────────────────────────────────────────────────────
-- Created by recruiters — stores JD + rubric
create table if not exists public.jobs (
  id         uuid primary key default gen_random_uuid(),
  owner_uid  text not null references public.users(firebase_uid) on delete cascade,
  title      text not null,
  rubric     jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ── Evaluations ───────────────────────────────────────────────
-- One row per candidate-job pair
create table if not exists public.evaluations (
  id               uuid primary key default gen_random_uuid(),
  job_id           uuid references public.jobs(id) on delete cascade,
  candidate_email  text not null,
  score            integer not null check (score between 0 and 100),
  verdict          text not null,
  evidence         jsonb not null default '{}',
  created_at       timestamptz not null default now()
);

-- ── Reports ───────────────────────────────────────────────────
-- Signed, tamper-evident report for each evaluation
create table if not exists public.reports (
  id             uuid primary key default gen_random_uuid(),
  evaluation_id  uuid unique references public.evaluations(id) on delete cascade,
  sha256_hash    text not null,
  signed_at      timestamptz not null default now(),
  report_data    jsonb not null default '{}'
);

-- ── Row Level Security ────────────────────────────────────────
-- Recruiters see only their own jobs; candidates see their evaluations

alter table public.users       enable row level security;
alter table public.jobs        enable row level security;
alter table public.evaluations enable row level security;
alter table public.reports     enable row level security;

-- Users: can only read/write their own row
create policy "users_self" on public.users
  for all using (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Jobs: owner can see/edit
create policy "jobs_owner" on public.jobs
  for all using (owner_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Evaluations: job owner can see all evals for their jobs
create policy "evals_owner" on public.evaluations
  for select using (
    job_id in (
      select id from public.jobs
      where owner_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Reports: same as evaluations
create policy "reports_owner" on public.reports
  for select using (
    evaluation_id in (
      select id from public.evaluations e
      join public.jobs j on e.job_id = j.id
      where j.owner_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_jobs_owner   on public.jobs(owner_uid);
create index if not exists idx_evals_job    on public.evaluations(job_id);
create index if not exists idx_reports_eval on public.reports(evaluation_id);
