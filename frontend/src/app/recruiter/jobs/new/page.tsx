'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { apiFetch } from '@/lib/api'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

type Job = { id: string }

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', company: '', location: '', experience_range: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const job = await apiFetch<Job>('/jobs', {
        method: 'POST',
        body: JSON.stringify(form),
      }, auth.currentUser)
      router.push(`/recruiter/jobs/${job.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create job.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <WorkspaceShell role="recruiter" activeId="jobs" title="Create Job" subtitle="Simple job setup" primaryActionLabel="Jobs" onPrimaryAction={() => router.push('/recruiter/jobs')} action={null} onCloseAction={() => undefined}>
      <form onSubmit={submit} className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Create job</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Job creation saves first. AI rubric generation is optional and will not block this workflow.</p>
        {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
        <Field label="Job Title" value={form.title} onChange={(title) => setForm({ ...form, title })} required />
        <Field label="Company Name" value={form.company} onChange={(company) => setForm({ ...form, company })} required />
        <Field label="Location" value={form.location} onChange={(location) => setForm({ ...form, location })} />
        <Field label="Experience Range" value={form.experience_range} onChange={(experience_range) => setForm({ ...form, experience_range })} placeholder="2-5 years" />
        <label className="mt-5 block text-sm font-bold text-slate-800">
          Job Description
          <textarea required minLength={40} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 min-h-48 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
        </label>
        <button disabled={saving} className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Creating...' : 'Create job'}</button>
      </form>
    </WorkspaceShell>
  )
}

function Field({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="mt-5 block text-sm font-bold text-slate-800">
      {label}
      <input required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
    </label>
  )
}
