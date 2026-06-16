'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type Job = { id: string; title: string; company?: string; location?: string; experience_range?: string; description: string; ai_status?: string }

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<Job>(`/jobs/${jobId}`, {}, auth.currentUser).then(setJob).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load job.'))
  }, [jobId])

  return (
    <WorkspaceShell role="recruiter" activeId="jobs" title="Job" subtitle="Open job workspace" primaryActionLabel="Upload resumes" onPrimaryAction={() => router.push(`/recruiter/jobs/${jobId}/resumes`)} action={null} onCloseAction={() => undefined}>
      {error && <State title="Could not load job" body={error} />}
      {!error && !job && <State title="Loading job..." />}
      {job && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{job.title}</h1>
                <p className="mt-2 text-sm font-bold text-slate-500">{job.company || 'Company not set'}{job.location ? ` · ${job.location}` : ''}{job.experience_range ? ` · ${job.experience_range}` : ''}</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">{job.ai_status}</span>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{job.description}</p>
          </section>
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold tracking-tight">Next actions</h2>
            <div className="mt-5 grid gap-3">
              <Action href={`/recruiter/jobs/${job.id}/resumes`} title="Upload resumes" body="PDF, DOCX, TXT. Max 20 per upload." />
              <Action href={`/recruiter/jobs/${job.id}/evaluations`} title="Candidate rankings" body="Review completed evaluations." />
              <Action href={`/recruiter/jobs/${job.id}/reports`} title="Reports" body="Open web reports." />
            </div>
          </aside>
        </div>
      )}
    </WorkspaceShell>
  )
}

function Action({ href, title, body }: { href: string; title: string; body: string }) {
  return <Link href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-white"><div className="font-bold text-slate-950">{title}</div><p className="mt-1 text-sm font-medium text-slate-500">{body}</p></Link>
}

function State({ title, body }: { title: string; body?: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><h2 className="font-extrabold">{title}</h2>{body && <p className="mt-2 text-sm font-medium text-slate-500">{body}</p>}</div>
}
