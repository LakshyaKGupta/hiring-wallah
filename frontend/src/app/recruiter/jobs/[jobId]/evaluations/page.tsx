'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type Result = {
  evaluation_id: string
  profile: { name?: string; email?: string }
  evaluation: { score: number; strengths: string[]; weaknesses: string[]; status?: string }
  decision: { verdict?: string; ranking?: number; explanation?: string }
}

export default function EvaluationsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [status, setStatus] = useState('Loading evaluations...')

  useEffect(() => {
    apiFetch<{ results: Result[] }>(`/jobs/${jobId}/evaluations`, {}, auth.currentUser)
      .then((data) => {
        setResults(data.results)
        setStatus('')
      })
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load evaluations.'))
  }, [jobId])

  return (
    <WorkspaceShell role="recruiter" activeId="evaluations" title="Evaluations" subtitle="Candidate ranking" primaryActionLabel="Upload resumes" onPrimaryAction={() => router.push(`/recruiter/jobs/${jobId}/resumes`)} action={null} onCloseAction={() => undefined}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Candidate rankings</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Evaluations appear after resumes are uploaded and AI is configured.</p>
          </div>
          <Link href={`/recruiter/jobs/${jobId}/reports`} className="text-sm font-bold text-sky-700">Reports</Link>
        </div>
        {status && <Empty text={status} />}
        {!status && results.length === 0 && <Empty text="Run evaluation to generate reports." />}
        {!status && results.length > 0 && (
          <div className="mt-5 grid gap-3">
            {results.map((result, index) => (
              <article key={result.evaluation_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-950">#{result.decision.ranking || index + 1} {result.profile.name || 'Candidate'}</h2>
                    <p className="text-sm font-medium text-slate-500">{result.decision.verdict || result.evaluation.status || 'Evaluation'}</p>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-950">{result.evaluation.score}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </WorkspaceShell>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-extrabold text-slate-700">{text}</div>
}
