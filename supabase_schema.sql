-- Hiring Wallah MVP Supabase PostgreSQL schema
-- Stack: Firebase Auth + FastAPI + Supabase Postgres. Do not use Firestore.
-- Run in Supabase SQL Editor for the `hiring-wallah-prod` environment.

create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text unique not null,
  email text,
  display_name text,
  photo_url text,
  role text not null check (role in ('recruiter', 'candidate')),
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_uid text references public.users(firebase_uid) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  title text not null,
  company text,
  description text not null,
  requirement_analysis jsonb not null default '{}',
  evaluation_framework jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  parsed_profile jsonb not null default '{}',
  raw_resume_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  file_name text,
  raw_text text,
  parsed_profile jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  score integer not null default 0 check (score between 0 and 100),
  breakdown jsonb not null default '{}',
  strengths jsonb not null default '[]',
  weaknesses jsonb not null default '[]',
  evidence jsonb not null default '[]',
  devils_advocate jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  verdict text not null,
  confidence integer not null default 0 check (confidence between 0 and 100),
  explanation text not null default '',
  interview_questions jsonb not null default '[]',
  ranking integer,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid references public.evaluations(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  report_data jsonb not null default '{}',
  sha256_hash text,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.candidate_sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade,
  target_role text not null,
  fit_score integer not null default 0 check (fit_score between 0 and 100),
  skill_gaps jsonb not null default '{}',
  tailored_resume_suggestions jsonb not null default '{}',
  cover_letter text not null default '',
  interview_prep jsonb not null default '{}',
  job_recommendations jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_users_firebase_uid on public.users(firebase_uid);
create index if not exists idx_users_company on public.users(company_id);
create index if not exists idx_jobs_owner on public.jobs(owner_uid);
create index if not exists idx_jobs_company on public.jobs(company_id);
create index if not exists idx_resumes_job on public.resumes(job_id);
create index if not exists idx_evaluations_job on public.evaluations(job_id);
create index if not exists idx_evaluations_candidate on public.evaluations(candidate_id);
create index if not exists idx_decisions_job on public.decisions(job_id);
create index if not exists idx_reports_job on public.reports(job_id);
create index if not exists idx_candidate_sessions_candidate on public.candidate_sessions(candidate_id);
