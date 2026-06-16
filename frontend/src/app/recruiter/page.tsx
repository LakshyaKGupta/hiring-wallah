'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Briefcase, FileSearch, ShieldCheck, Upload } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'
import { useRouter } from 'next/navigation'

type Job = {
  id: string
  title: string
  company?: string | null
  location?: string | null
  experience_range?: string | null
  ai_status?: string | null
  created_at: string
}

export default function RecruiterDashboard() {
  const router = useRouter()
  const { user, loading, profileLoading } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?mode=signin')
    if (!loading && user?.role && user.role !== 'recruiter') router.replace(`/${user.role}`)
  }, [user, loading, router])

  useEffect(() => {
    if (!user || user.role !== 'recruiter') return
    apiFetch<Job[]>('/jobs', {}, auth.currentUser)
      .then(setJobs)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load jobs.'))
      .finally(() => setIsLoading(false))
  }, [user])

  if (loading || profileLoading || !user || !user.role) return <FullScreenLoader label="Opening recruiter workspace..." />

  return (
    <WorkspaceShell
      role="recruiter"
      activeId="dashboard"
      title="Recruiter Dashboard"
      subtitle="Create jobs, upload resumes, review rankings"
      primaryActionLabel="Create job"
      onPrimaryAction={() => router.push('/recruiter/jobs/new')}
      action={null}
      onCloseAction={() => undefined}
    >
      <div className="grid gap-5 lg:grid-cols-4">
        <Metric icon={Briefcase} label="Jobs" value={jobs.length} />
        <Metric icon={Upload} label="Resume upload" value="Per job" />
        <Metric icon={FileSearch} label="Evaluations" value="Auto" />
        <Metric icon={ShieldCheck} label="Reports" value="Web" />
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Open jobs</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Start with a job, then upload resumes for evaluation.</p>
          </div>
          <Link href="/recruiter/jobs/new" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Create job</Link>
        </div>

        {isLoading && <StateBlock title="Loading jobs..." />}
        {error && <StateBlock tone="error" title="Could not load jobs" body={error} />}
        {!isLoading && !error && jobs.length === 0 && (
          <StateBlock title="Create your first job." body="No jobs exist yet. Create a job to begin resume upload and evaluation." action={<Link href="/recruiter/jobs/new" className="font-bold text-sky-700">Create job</Link>} />
        )}
        {!isLoading && jobs.length > 0 && (
          <div className="mt-5 grid gap-3">
            {jobs.slice(0, 5).map((job) => (
              <Link key={job.id} href={`/recruiter/jobs/${job.id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">{job.title}</h3>
                    <p className="text-sm font-medium text-slate-500">{job.company || 'Company not set'}{job.location ? ` · ${job.location}` : ''}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">{job.ai_status || 'not_configured'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </WorkspaceShell>
  )
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-sky-600" />
      <div className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">{value}</div>
      <div className="mt-1 text-sm font-bold text-slate-500">{label}</div>
    </div>
  )
}

function StateBlock({ title, body, action, tone = 'neutral' }: { title: string; body?: string; action?: React.ReactNode; tone?: 'neutral' | 'error' }) {
  return (
    <div className={`mt-5 rounded-3xl border border-dashed p-8 text-center ${tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-300 bg-slate-50 text-slate-700'}`}>
      <h3 className="font-extrabold">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

function FullScreenLoader({ label }: { label: string }) {
  return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-bold text-slate-600">{label}</div>
}
