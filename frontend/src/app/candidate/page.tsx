'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, BriefcaseBusiness, FileText, Loader2, Sparkles, Target, UploadCloud } from 'lucide-react'
import { API_URL } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell } from '@/components/ui/WorkspaceShell'

export default function CandidateDashboard() {
  const router = useRouter()
  const { user, loading, profileLoading } = useAuth()
  const [targetRole, setTargetRole] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?mode=signin')
    if (!loading && user?.role && user.role !== 'candidate') router.replace(`/${user.role}`)
  }, [user, loading, router])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const acceptFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF resumes are supported for the MVP.')
      return
    }
    setResumeFile(file)
    setErrorMsg('')
  }

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile || !targetRole.trim()) return

    setIsRunning(true)
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('target_role', targetRole.trim())
      formData.append('resume', resumeFile)

      const res = await fetch(`${API_URL}/candidate/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Resume analysis failed.')
      }

      const data = await res.json()
      router.push(`/candidate/report/${data.session.id}`)
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not connect to the analysis backend.')
      setIsRunning(false)
    }
  }

  if (loading || profileLoading || !user || !user.role) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Opening candidate workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <WorkspaceShell
      role="candidate"
      activeId="studio"
      title="Candidate Workspace"
      subtitle="Resume analysis, role fit, skill gaps..."
      primaryActionLabel="Upload resume"
      onPrimaryAction={() => document.getElementById('resume-upload')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
      toast={toast}
      action={null}
      onCloseAction={() => undefined}
    >
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.form
          id="resume-upload"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          onSubmit={handleRunAnalysis}
          className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Candidate intelligence
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Upload Your Resume
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
            The MVP candidate flow starts with real resume analysis, then moves into role matching and skill gap reports.
          </p>

          <label className="mt-8 block text-sm font-bold text-slate-800">
            Target role
            <input
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              placeholder="AI Product Engineer"
            />
          </label>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40">
            <UploadCloud className="h-9 w-9 text-emerald-600" />
            <span className="mt-4 text-base font-extrabold text-slate-950">
              {resumeFile ? resumeFile.name : 'Choose a PDF resume'}
            </span>
            <span className="mt-1 text-sm font-medium text-slate-500">PDF only. The backend will parse and analyze the file.</span>
            <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])} />
          </label>

          {errorMsg && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            disabled={isRunning || !resumeFile || !targetRole.trim()}
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isRunning ? 'Analyzing resume...' : 'Analyze resume'}
          </button>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.05 }}
          className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 text-slate-950 shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">No fabricated matches</h2>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
            Role matching and skill gap reports will appear only after real resume analysis data exists.
          </p>
          <div className="mt-6 grid gap-3">
            <PendingItem icon={FileText} label="Resume Upload & Analysis" ready />
            <PendingItem icon={BriefcaseBusiness} label="Role Matching" />
            <PendingItem icon={AlertCircle} label="Skill Gap Report" />
          </div>
          <button
            type="button"
            onClick={() => showToast('Role matching starts after the first real resume analysis.')}
            className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-emerald-200"
          >
            View MVP order
          </button>
        </motion.aside>
      </section>
    </WorkspaceShell>
  )
}

function PendingItem({ icon: Icon, label, ready = false }: { icon: React.ComponentType<{ className?: string }>; label: string; ready?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <span className={`ml-auto rounded-full px-2 py-1 text-[11px] font-bold ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {ready ? 'Now' : 'Next'}
      </span>
    </div>
  )
}
