-- Hiring Wallah MVP Neon PostgreSQL schema
-- Stack: Firebase Auth + FastAPI + Neon PostgreSQL.
-- Set backend DATABASE_URL to the Neon connection string.

create table if not exists companies (
  id text primary key,
  name text not null,
  created_at timestamptz not null
);

create table if not exists users (
  id text primary key,
  firebase_uid text unique not null,
  email text,
  display_name text,
  photo_url text,
  role text not null check (role in ('recruiter', 'candidate')),
  company_id text references companies(id) on delete set null,
  created_at timestamptz not null,
  updated_at timestamptz
);

create table if not exists jobs (
  id text primary key,
  title text not null,
  company text,
  location text,
  experience_range text,
  description text not null,
  requirement_analysis jsonb not null default '{}',
  evaluation_framework jsonb not null default '{}',
  ai_status text not null default 'not_configured',
  owner_uid text references users(firebase_uid) on delete cascade,
  company_id text references companies(id) on delete set null,
  created_at timestamptz not null
);

create table if not exists candidates (
  id text primary key,
  name text,
  email text,
  parsed_profile jsonb not null default '{}',
  raw_resume_text text,
  created_at timestamptz not null
);

create table if not exists resumes (
  id text primary key,
  candidate_id text references candidates(id) on delete cascade,
  job_id text references jobs(id) on delete cascade,
  file_name text,
  file_type text,
  raw_text text,
  parse_status text not null default 'parsed',
  error_message text,
  created_at timestamptz not null
);

create table if not exists evaluations (
  id text primary key,
  candidate_id text references candidates(id) on delete cascade,
  job_id text references jobs(id) on delete cascade,
  resume_id text references resumes(id) on delete set null,
  score integer not null default 0 check (score between 0 and 100),
  breakdown jsonb not null default '{}',
  strengths jsonb not null default '[]',
  weaknesses jsonb not null default '[]',
  evidence jsonb not null default '[]',
  devils_advocate jsonb not null default '{}',
  status text not null default 'completed',
  error_message text,
  created_at timestamptz not null
);

create table if not exists decisions (
  id text primary key,
  candidate_id text references candidates(id) on delete cascade,
  job_id text references jobs(id) on delete cascade,
  verdict text,
  confidence integer default 0 check (confidence between 0 and 100),
  explanation text default '',
  interview_questions jsonb not null default '[]',
  ranking integer,
  created_at timestamptz not null
);

create table if not exists reports (
  id text primary key,
  evaluation_id text references evaluations(id) on delete cascade,
  candidate_id text references candidates(id) on delete cascade,
  job_id text references jobs(id) on delete cascade,
  report_data jsonb not null default '{}',
  created_at timestamptz not null
);

create table if not exists candidate_sessions (
  id text primary key,
  candidate_id text references candidates(id) on delete cascade,
  target_role text,
  fit_score integer default 0 check (fit_score between 0 and 100),
  skill_gaps jsonb not null default '{}',
  tailored_resume_suggestions jsonb not null default '{}',
  cover_letter text default '',
  interview_prep jsonb not null default '{}',
  job_recommendations jsonb not null default '{}',
  created_at timestamptz not null
);

create index if not exists idx_users_firebase_uid on users(firebase_uid);
create index if not exists idx_jobs_owner on jobs(owner_uid);
create index if not exists idx_jobs_company on jobs(company_id);
create index if not exists idx_resumes_job on resumes(job_id);
create index if not exists idx_evaluations_job on evaluations(job_id);
create index if not exists idx_decisions_job on decisions(job_id);
create index if not exists idx_reports_job on reports(job_id);
