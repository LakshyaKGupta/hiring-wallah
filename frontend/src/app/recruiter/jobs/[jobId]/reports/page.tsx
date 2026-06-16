'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type Report = {
  id: string
  candidate_name?: string
  score?: number
  verdict?: string
  ranking?: number
  report_data: {
    candidate_score?: number
    strengths?: string[]
    weaknesses?: string[]
    evidence?: string[]
    risk_factors?: unknown
    final_recommendation?: string
    interview_questions?: string[]
    explanation?: string
  }
}

export default function ReportsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [status, setStatus] = useState('Loading reports...')

  useEffect(() => {
    apiFetch<{ reports: Report[] }>(`/jobs/${jobId}/reports`, {}, auth.currentUser)
      .then((data) => {
        setReports(data.reports)
        setStatus('')
      })
      .catch((err) => setStatus(err instanceof Error ? err.message : 'Unable to load reports.'))
  }, [jobId])

  return (
    <WorkspaceShell role="recruiter" activeId="reports" title="Reports" subtitle="Web reports" primaryActionLabel="Upload resumes" onPrimaryAction={() => router.push(`/recruiter/jobs/${jobId}/resumes`)} action={null} onCloseAction={() => undefined}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Web-only reports for evaluated candidates.</p>
        {status && <Empty text={status} />}
        {!status && reports.length === 0 && <Empty text="Run evaluation to generate reports." />}
        {!status && reports.length > 0 && (
          <div className="mt-5 grid gap-4">
            {reports.map((report) => (
              <article key={report.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">{report.candidate_name || 'Candidate'}</h2>
                    <p className="text-sm font-bold text-slate-500">{report.report_data.final_recommendation || report.verdict || 'Recommendation pending'}</p>
                  </div>
                  <div className="text-3xl font-extrabold">{report.report_data.candidate_score ?? report.score ?? 0}</div>
                </div>
                <ReportList title="Strengths" items={report.report_data.strengths} />
                <ReportList title="Weaknesses" items={report.report_data.weaknesses} />
                <ReportList title="Evidence" items={report.report_data.evidence} />
                <ReportList title="Interview Questions" items={report.report_data.interview_questions} />
              </article>
            ))}
          </div>
        )}
      </section>
    </WorkspaceShell>
  )
}

function ReportList({ title, items = [] }: { title: string; items?: string[] }) {
  if (!items.length) return null
  return <div className="mt-4"><h3 className="text-sm font-extrabold text-slate-800">{title}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium leading-6 text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-extrabold text-slate-700">{text}</div>
}
