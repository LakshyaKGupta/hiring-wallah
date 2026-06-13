// src/lib/supabase.ts
// ─────────────────────────────────────────────
// Supabase client (PostgreSQL)
//
// SETUP: Fill in your own config from:
// Supabase Dashboard → Settings → API
// ─────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? 'https://YOUR_PROJECT.supabase.co'
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnon)

// ── Type helpers ──────────────────────────────

export type UserRow = {
  id:           string    // uuid
  firebase_uid: string
  email:        string
  name:         string
  role:         'recruiter' | 'candidate'
  created_at:   string
}

export type JobRow = {
  id:         string
  owner_uid:  string
  title:      string
  rubric:     Record<string, unknown>
  created_at: string
}

export type EvaluationRow = {
  id:               string
  job_id:           string
  candidate_email:  string
  score:            number
  verdict:          string
  evidence:         Record<string, unknown>
  created_at:       string
}

export type ReportRow = {
  id:            string
  evaluation_id: string
  sha256_hash:   string
  signed_at:     string
  report_data:   Record<string, unknown>
}
