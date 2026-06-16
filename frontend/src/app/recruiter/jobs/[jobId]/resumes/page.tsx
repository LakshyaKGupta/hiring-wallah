'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { API_URL } from '@/lib/api'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type ResumeRow = { id: string; file_name: string; parse_status: string; candidate_name?: string; created_at: string }

export default function ResumeUploadPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const load = useCallback(() => {
    return apiFetch<{ resumes: ResumeRow[] }>(`/jobs/${jobId}/resumes`, {}, auth.currentUser)
      .then((data) => setResumes(data.resumes))
      .catch((err) => setMessage(err instanceof Error ? err.message : 'Unable to load resumes.'))
  }, [jobId])

  useEffect(() => { void load() }, [load])

  async function upload(e: React.FormEvent) {
    e.preventDefault()
    if (!files.length) return
    if (files.length > 20) {
      setMessage('Upload a maximum of 20 resumes at once.')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const form = new FormData()
      files.forEach((file) => form.append('files', file))
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${API_URL}/jobs/${jobId}/resumes`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed.')
      setMessage(data.message || 'Upload complete.')
      setFiles([])
      await load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <WorkspaceShell role="recruiter" activeId="resumes" title="Resume Upload" subtitle="Upload PDF, DOCX, TXT" primaryActionLabel="Evaluations" onPrimaryAction={() => router.push(`/recruiter/jobs/${jobId}/evaluations`)} action={null} onCloseAction={() => undefined}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Upload resumes</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Batch upload allowed. Maximum 20 resumes. Evaluation runs automatically when AI is configured.</p>
        <form onSubmit={upload} className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
          <input type="file" multiple accept=".pdf,.docx,.txt" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block w-full text-sm font-medium text-slate-700" />
          <button disabled={uploading || files.length === 0} className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{uploading ? 'Uploading...' : 'Upload resumes'}</button>
        </form>
        {message && <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm font-bold text-sky-800">{message}</div>}
      </section>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight">Uploaded resumes</h2>
          <Link href={`/recruiter/jobs/${jobId}/evaluations`} className="text-sm font-bold text-sky-700">View evaluations</Link>
        </div>
        {resumes.length === 0 ? <Empty text="Upload resumes to begin evaluation." /> : (
          <div className="mt-5 grid gap-3">
            {resumes.map((resume) => <div key={resume.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-bold">{resume.file_name}</div><div className="text-sm font-medium text-slate-500">{resume.parse_status}</div></div>)}
          </div>
        )}
      </section>
    </WorkspaceShell>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-extrabold text-slate-700">{text}</div>
}
