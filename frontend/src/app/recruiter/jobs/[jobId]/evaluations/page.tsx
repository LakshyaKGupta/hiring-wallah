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
  evaluation: {
    score: number
    strengths: EvidenceClaim[]
    weaknesses: WeaknessClaim[]
    evidence_items?: EvidenceItem[]
    status?: string
  }
  critique?: { risk_factors?: string[] }
  decision: { verdict?: string; confidence?: number; ranking?: number; explanation?: string; ranking_rationale?: RankingRationale }
}

type EvidenceClaim = string | { claim?: string; evidence?: string; resume_section?: string }
type WeaknessClaim = string | { claim?: string; missing_or_weak_evidence?: string }
type EvidenceItem = { claim?: string; evidence?: string; resume_section?: string; quality?: string }
type RankingRationale = { summary?: string; why_hire?: string[]; why_not_hire?: string[]; risks?: string[]; evidence_count?: number }

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
              <article key={result.evaluation_id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">#{result.decision.ranking || index + 1} {result.profile.name || 'Candidate'}</h2>
                    <p className="mt-1 text-sm font-bold text-emerald-700">{result.decision.verdict || result.evaluation.status || 'Evaluation'}</p>
                    {result.decision.ranking_rationale?.summary && <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">{result.decision.ranking_rationale.summary}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-slate-950">{result.evaluation.score}</div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{result.decision.confidence || 0}% trust</div>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <SignalList title="Why" items={result.decision.ranking_rationale?.why_hire || result.evaluation.strengths.map(labelFor)} tone="good" />
                  <SignalList title="Risks" items={result.decision.ranking_rationale?.risks || result.critique?.risk_factors || result.evaluation.weaknesses.map(labelFor)} tone="risk" />
                  <div className="rounded-2xl border border-white bg-white p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Evidence</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-950">{result.decision.ranking_rationale?.evidence_count ?? result.evaluation.evidence_items?.length ?? 0}</p>
                    <p className="text-sm font-medium text-slate-500">traceable resume signals</p>
                  </div>
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

function labelFor(item: EvidenceClaim | WeaknessClaim) {
  if (typeof item === 'string') return item
  const evidence = 'evidence' in item ? item.evidence : undefined
  const missing = 'missing_or_weak_evidence' in item ? item.missing_or_weak_evidence : undefined
  return item.claim || evidence || missing || 'Evidence signal'
}

function SignalList({ title, items = [], tone }: { title: string; items?: string[]; tone: 'good' | 'risk' }) {
  const color = tone === 'good' ? 'text-emerald-700' : 'text-amber-700'
  if (!items.length) return <div className="rounded-2xl border border-white bg-white p-4"><p className="text-sm font-bold text-slate-500">No {title.toLowerCase()} recorded.</p></div>
  return (
    <div className="rounded-2xl border border-white bg-white p-4">
      <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${color}`}>{title}</p>
      <ul className="mt-3 space-y-2 text-sm font-medium leading-6 text-slate-600">
        {items.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
