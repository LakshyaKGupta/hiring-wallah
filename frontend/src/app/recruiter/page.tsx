'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'
import {
  AlertCircle,
  Bot,
  Briefcase,
  CheckCircle2,
  FileSearch,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell, type WorkspaceAction } from '@/components/ui/WorkspaceShell'

type Job = {
  id: string
  title: string
  company?: string | null
  description: string
  created_at: string
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 190, damping: 24 },
  },
}

export default function RecruiterDashboard() {
  const { user, loading, profileLoading } = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState('command')
  const [action, setAction] = useState<WorkspaceAction | null>(null)
  const [toast, setToast] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [form, setForm] = useState({ title: '', company: '', description: '' })

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?mode=signin')
    if (!loading && user?.role && user.role !== 'recruiter') router.replace(`/${user.role}`)
  }, [user, loading, router])

  useEffect(() => {
    const validViews = new Set(['command', 'roles', 'shortlist', 'agents', 'reports'])
    const syncFromHash = () => {
      const next = window.location.hash.replace('#', '')
      if (validViews.has(next)) setActiveView(next)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const userUid = user?.uid
  const userRole = user?.role

  useEffect(() => {
    if (!userUid || userRole !== 'recruiter') return
    void loadJobs()
  }, [userUid, userRole])

  const firstName = user?.displayName?.split(' ')[0] ?? 'there'
  const hasJobs = jobs.length > 0
  const summary = useMemo(() => ([
    { label: 'Open jobs', value: String(jobs.length), icon: Briefcase },
    { label: 'Resume batches', value: '0', icon: UploadCloud },
    { label: 'Evaluations', value: '0', icon: FileSearch },
    { label: 'Reports', value: '0', icon: ShieldCheck },
  ]), [jobs.length])

  async function loadJobs() {
    setJobsLoading(true)
    setJobsError('')
    try {
      const nextJobs = await apiFetch<Job[]>('/jobs')
      setJobs(nextJobs)
    } catch (error) {
      setJobsError(error instanceof Error ? error.message : 'Unable to load jobs.')
    } finally {
      setJobsLoading(false)
    }
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault()
    setCreateLoading(true)
    setJobsError('')
    try {
      const created = await apiFetch<Job>(
        '/jobs',
        {
          method: 'POST',
          body: JSON.stringify({
            title: form.title.trim(),
            company: form.company.trim() || 'Hiring Wallah Workspace',
            description: form.description.trim(),
          }),
        },
        auth.currentUser,
      )
      setJobs((prev) => [created, ...prev])
      setForm({ title: '', company: '', description: '' })
      setCreateOpen(false)
      showToast('Job created and rubric generated.')
      setActiveView('roles')
    } catch (error) {
      setJobsError(error instanceof Error ? error.message : 'Unable to create job.')
    } finally {
      setCreateLoading(false)
    }
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  if (loading || profileLoading || !user || !user.role) {
    return <WorkspaceLoader label="Opening recruiter workspace..." />
  }

  return (
    <WorkspaceShell
      role="recruiter"
      activeId={activeView}
      title="Recruiter Workspace"
      subtitle="Search jobs, candidates, reports..."
      primaryActionLabel="Create job"
      onNavSelect={setActiveView}
      onPrimaryAction={() => setCreateOpen(true)}
      toast={toast}
      action={action}
      onCloseAction={() => setAction(null)}
    >
      {activeView === 'command' && (
        <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <motion.div variants={itemVariants} className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Autonomous Hiring Intelligence
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                  Welcome, {firstName}. Start with a job, then upload resumes.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                  Hiring Wallah’s MVP flow is focused: create a JD, upload resumes, rank candidates, and revisit every AI evaluation report.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Create Your First Job
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summary.map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div key={stat.label} variants={itemVariants} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="rounded-xl border border-sky-100 bg-sky-50 p-2.5 text-sky-700 w-fit">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950">{stat.value}</div>
                    <div className="mt-1 text-sm font-bold text-slate-800">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.aside variants={itemVariants} className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6 text-slate-950 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-700">Today&apos;s priority</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
                  {hasJobs ? 'Upload resumes for your newest job.' : 'Create Your First Job'}
                </h2>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium leading-6 text-slate-600">
              {hasJobs
                ? 'The next MVP step is resume upload and immediate evaluation against the selected job rubric.'
                : 'A job gives the AI pipeline the JD, requirements, and scoring rubric needed before any candidate ranking can be real.'}
            </p>
            <button
              type="button"
              onClick={() => hasJobs ? setActiveView('shortlist') : setCreateOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/15 transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {hasJobs ? <UploadCloud className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {hasJobs ? 'Prepare Resume Upload' : 'Create job'}
            </button>
          </motion.aside>
        </motion.section>
      )}

      {activeView === 'roles' && (
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel title="Open hiring demand" description="Jobs created through the real backend. Resume upload and ranking will attach to these job records.">
            <JobsBody loading={jobsLoading} error={jobsError} jobs={jobs} onCreate={() => setCreateOpen(true)} onRetry={loadJobs} />
          </Panel>
          <SidePanel
            icon={Briefcase}
            title="MVP scope"
            body="This workspace now starts at JD creation. ATS pipelines, CRM, interviews, and team collaboration stay out until the core JD → resume analysis → ranking → decision loop is working."
            cta="Create job"
            onClick={() => setCreateOpen(true)}
          />
        </section>
      )}

      {activeView === 'shortlist' && (
        <Panel title="Resume upload" description="Candidate ranking starts only after resumes are uploaded against a real job.">
          <EmptyState icon={UploadCloud} title="Upload resumes is next" body="Phase 4 will connect PDF uploads to the selected job and trigger immediate Gemini evaluation. No fake finalists are shown here." />
        </Panel>
      )}

      {activeView === 'agents' && (
        <Panel title="AI evaluation" description="The engine will run immediately after resume upload. No background workers or queues in the MVP.">
          <EmptyState icon={Bot} title="No AI runs yet" body="Create a job and upload resumes first. Evaluation activity will appear here only after the backend has real candidate data." />
        </Panel>
      )}

      {activeView === 'reports' && (
        <Panel title="Reports" description="Every evaluation report should be permanent and revisitable.">
          <EmptyState icon={ShieldCheck} title="No reports yet" body="Reports will be generated from real evaluations, not sample scorecards. The first reports arrive after resume upload and ranking." />
        </Panel>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm">
          <motion.form
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={createJob}
            className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Create job</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">Paste the real role brief. Hiring Wallah will generate the first evaluation rubric through FastAPI.</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-slate-200 px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-50">Esc</button>
            </div>

            {jobsError && <InlineError message={jobsError} />}

            <label className="mt-5 block text-sm font-bold text-slate-800">
              Job title
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100" placeholder="Senior Product Designer" />
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-800">
              Company / workspace
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100" placeholder="Acme AI" />
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-800">
              Job description
              <textarea required minLength={80} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 min-h-40 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100" placeholder="Responsibilities, must-have skills, evaluation criteria, deal-breakers..." />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button disabled={createLoading} type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                {createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create job
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </WorkspaceShell>
  )
}

function WorkspaceLoader({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
    </div>
  )
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 24 }} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </motion.section>
  )
}

function JobsBody({ loading, error, jobs, onCreate, onRetry }: { loading: boolean; error: string; jobs: Job[]; onCreate: () => void; onRetry: () => void }) {
  if (loading) return <LoadingBlock label="Loading real jobs..." />
  if (error) return <ErrorBlock message={error} onRetry={onRetry} />
  if (!jobs.length) return <EmptyState icon={Briefcase} title="Create Your First Job" body="No jobs exist yet. Create a job to generate a rubric and unlock resume upload." cta="Create job" onClick={onCreate} />

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <article key={job.id} className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-4 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="font-bold text-slate-950">{job.title}</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">{job.company || 'Hiring Wallah Workspace'}</p>
            </div>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Rubric ready</span>
          </div>
          <p className="mt-4 line-clamp-3 text-sm font-medium leading-6 text-slate-600">{job.description}</p>
        </article>
      ))}
    </div>
  )
}

function EmptyState({ icon: Icon, title, body, cta, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; cta?: string; onClick?: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-700 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-600">{body}</p>
      {cta && onClick && (
        <button type="button" onClick={onClick} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          {cta}
        </button>
      )}
    </div>
  )
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  )
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-900">
      <div className="flex items-center gap-2 text-sm font-extrabold">
        <AlertCircle className="h-4 w-4" />
        Could not load workspace data
      </div>
      <p className="mt-2 text-sm font-medium leading-6 text-red-800">{message}</p>
      <button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm">Retry</button>
    </div>
  )
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {message}
    </div>
  )
}

function SidePanel({ icon: Icon, title, body, cta, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; cta: string; onClick: () => void }) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{body}</p>
      <button type="button" onClick={onClick} className="mt-6 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
        {cta}
      </button>
    </aside>
  )
}
