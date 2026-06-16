'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type Job = {
  id: string
  title: string
  company?: string | null
  location?: string | null
  experience_range?: string | null
  ai_status?: string | null
  created_at: string
}

export default function RecruiterJobsPage() {
  const router = useRouter()
  const { user, loading, profileLoading } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [status, setStatus] = useState('Loading jobs...')

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?mode=signin')
    if (!loading && user?.role && user.role !== 'recruiter') router.replace(`/${user.role}`)
  }, [user, loading, router])

  useEffect(() => {
    if (!user || user.role !== 'recruiter') return
    apiFetch<Job[]>('/jobs', {}, auth.currentUser)
      .then((data) => {
        setJobs(data)
        setStatus('')
      })
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load jobs.'))
  }, [user])

  if (loading || profileLoading || !user || !user.role) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-bold text-slate-600">Opening jobs...</div>

  return (
    <WorkspaceShell role="recruiter" activeId="jobs" title="Jobs" subtitle="Create and view jobs" primaryActionLabel="Create job" onPrimaryAction={() => router.push('/recruiter/jobs/new')} action={null} onCloseAction={() => undefined}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Jobs</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Create your first job, then upload resumes.</p>
          </div>
          <Link href="/recruiter/jobs/new" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Create job</Link>
        </div>

        {status && <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-bold text-slate-600">{status}</div>}
        {!status && jobs.length === 0 && <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-extrabold text-slate-700">Create your first job.</div>}
        {!status && jobs.length > 0 && (
          <div className="mt-6 grid gap-3">
            {jobs.map((job) => (
              <Link key={job.id} href={`/recruiter/jobs/${job.id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white">
                <h2 className="font-bold text-slate-950">{job.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">{job.company || 'Company not set'}{job.location ? ` · ${job.location}` : ''}{job.experience_range ? ` · ${job.experience_range}` : ''}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </WorkspaceShell>
  )
}
