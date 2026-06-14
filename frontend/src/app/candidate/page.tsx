'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquareText,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell, type WorkspaceAction } from '@/components/ui/WorkspaceShell'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 170, damping: 23 },
  },
}

const readinessStats = [
  { label: 'Role fit score', value: '84', note: '+11 after resume rewrite', icon: Target },
  { label: 'Resume readiness', value: '92%', note: 'ATS-safe and evidence rich', icon: FileText },
  { label: 'Interviews prepared', value: '14', note: 'STAR answers generated', icon: MessageSquareText },
  { label: 'Live matches', value: '6', note: 'Aligned with your profile', icon: BriefcaseBusiness },
]

const roleMatches = [
  { title: 'AI Product Engineer', company: 'Fintech scaleup', score: 91, reason: 'Strong LLM orchestration and product shipping evidence' },
  { title: 'Growth Product Manager', company: 'B2B SaaS', score: 86, reason: 'Good GTM and analytics overlap, needs more pricing examples' },
  { title: 'AI Solutions Consultant', company: 'Enterprise AI', score: 82, reason: 'Strong founder story, needs clearer enterprise implementation proof' },
]

const skillGaps = [
  { label: 'System design examples', level: 72 },
  { label: 'Enterprise stakeholder proof', level: 64 },
  { label: 'Metrics storytelling', level: 88 },
]

const candidateAgents = [
  { name: 'Resume Strategist', task: 'Turns projects into evidence-backed bullets', icon: FileText, state: 'Ready' },
  { name: 'Gap Analyst', task: 'Maps missing signals for each target role', icon: Target, state: 'Scanning' },
  { name: 'Interview Coach', task: 'Builds STAR answers and follow-up drills', icon: MessageSquareText, state: 'Ready' },
  { name: 'Application Writer', task: 'Drafts role-specific cover notes', icon: Sparkles, state: 'Drafting' },
]

export default function CandidateDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [targetRole, setTargetRole] = useState('AI Product Engineer')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState('')
  const [action, setAction] = useState<WorkspaceAction | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'candidate')) {
      router.replace('/auth?mode=signin')
    }
  }, [user, loading, router])

  const pipelineSteps = [
    'Parsing resume evidence',
    'Mapping target role criteria',
    'Scoring strengths and gaps',
    'Drafting resume improvements',
    'Preparing interview answers',
    'Generating application strategy',
  ]

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openAction = (nextAction: WorkspaceAction) => setAction(nextAction)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const acceptFile = (file: File) => {
    if (file.type === 'application/pdf') {
      setResumeFile(file)
      setErrorMsg('')
      return
    }
    setErrorMsg('Only PDF files are supported.')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.[0]) acceptFile(e.dataTransfer.files[0])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) acceptFile(e.target.files[0])
  }

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile || !targetRole) return

    setIsRunning(true)
    setCurrentStep(0)
    setErrorMsg('')

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= pipelineSteps.length - 1 ? prev : prev + 1))
    }, 1600)

    try {
      const formData = new FormData()
      formData.append('target_role', targetRole)
      formData.append('resume', resumeFile)

      const res = await fetch(`${API_URL}/candidate/analyze`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(interval)

      if (res.ok) {
        const data = await res.json()
        router.push(`/candidate/report/${data.session.id}`)
      } else {
        const err = await res.json()
        setErrorMsg(err.detail || 'Candidate profile analysis failed.')
        setIsRunning(false)
      }
    } catch {
      clearInterval(interval)
      setErrorMsg('Could not connect to backend service. The frontend workspace is ready; backend analysis can be connected next.')
      setIsRunning(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Opening candidate studio...</span>
        </div>
      </div>
    )
  }

  const firstName = user.displayName?.split(' ')[0] ?? 'Candidate'

  return (
    <WorkspaceShell
      role="candidate"
      activeId="studio"
      title="Candidate Career Studio"
      subtitle="Search matches, resume gaps, interview prep..."
      primaryActionLabel="Analyze resume"
      onPrimaryAction={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      toast={toast}
      action={action}
      onCloseAction={() => setAction(null)}
    >
      {isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-white/15 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">Building your application strategy</h2>
                <p className="text-sm font-medium text-slate-500">Running the candidate agent workflow.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {pipelineSteps.map((step, idx) => {
                const isDone = idx < currentStep
                const isActive = idx === currentStep
                return (
                  <div
                    key={step}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-sm font-semibold ${
                      isDone
                        ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                        : isActive
                          ? 'border-sky-100 bg-sky-50 text-sky-800'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span>{step}</span>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <motion.section
        id="studio"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Candidate preparation system
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            {firstName}, improve the evidence behind every application.
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
            This workspace is built around the real candidate journey: evaluate fit, strengthen resume evidence, prepare interviews, and track target-role readiness.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {readinessStats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.button
                  key={stat.label}
                  type="button"
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => showToast(`${stat.label}: sample readiness metric selected.`)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
                >
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 w-fit">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950">{stat.value}</div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{stat.label}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{stat.note}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <motion.form
          id="resume"
          variants={itemVariants}
          onSubmit={handleRunAnalysis}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Run a profile analysis</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Upload a PDF resume and choose the role you want.</p>
            </div>
            <UserCheck className="h-5 w-5 text-slate-400" />
          </div>

          {errorMsg && (
            <div className="mb-4 flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <label className="text-xs font-bold text-slate-500">Target role</label>
          <input
            type="text"
            required
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. AI Product Engineer"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          />

          <div className="mt-5">
            <label className="text-xs font-bold text-slate-500">Resume PDF</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative mt-2 flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-6 text-center transition ${
                isDragOver ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <input
                type="file"
                required={!resumeFile}
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600">
                <Upload className="h-5 w-5" />
              </div>
              {resumeFile ? (
                <>
                  <p className="mt-3 text-sm font-extrabold text-slate-950">{resumeFile.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB PDF selected</p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm font-extrabold text-slate-950">Drop your resume here</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">or click to browse locally</p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!resumeFile || !targetRole}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            Analyze my profile
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </motion.section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div
          id="matches"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Role match board</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Every match explains what helps and what still needs proof.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {roleMatches.map((role) => (
              <button
                key={role.title}
                type="button"
                onClick={() => openAction({
                  title: `${role.title} match plan`,
                  description: `${role.company} is sample data. This drawer shows how a match plan will guide candidate action.`,
                  steps: [`Current match score: ${role.score}.`, role.reason, 'Recommended next step: update resume evidence and prepare role-specific interview answers.', 'Backend connection: saved target roles and candidate strategy sessions.'],
                })}
                className="w-full rounded-2xl border border-slate-200 bg-[#fbfcff] p-4 text-left transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">{role.title}</h3>
                    <p className="mt-1 text-xs font-bold text-slate-500">{role.company}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-600 px-3 py-2 text-center text-white">
                    <div className="font-display text-xl font-extrabold leading-none">{role.score}</div>
                    <div className="mt-0.5 text-[10px] font-bold text-emerald-100">Match</div>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{role.reason}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="coach"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Skill gap map</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Where candidate agents should improve your hiring signal.</p>
            </div>
            <Target className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-5">
            {skillGaps.map((gap) => (
              <button key={gap.label} type="button" onClick={() => showToast(`${gap.label}: mock improvement plan selected.`)} className="block w-full rounded-2xl p-1 text-left transition hover:bg-slate-50">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{gap.label}</span>
                  <span className="text-slate-500">{gap.level}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${gap.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-emerald-400"
                  />
                </div>
              </button>
            ))}
          </div>

          <button
            id="interviews"
            type="button"
            onClick={() => openAction({
              title: 'Interview prep queue',
              description: 'Mock queue for structured interview preparation based on target-role gaps.',
              steps: ['Generate behavioral prompts from resume evidence.', 'Create product/technical answer outlines.', 'Run a mock interview session.', 'Save improved answers into candidate preparation history.'],
            })}
            className="mt-6 w-full rounded-2xl border border-sky-100 bg-sky-50 p-4 text-left transition hover:bg-sky-100/60"
          >
            <div className="flex items-center gap-2 text-sm font-extrabold text-sky-900">
              <CalendarCheck className="h-4 w-4" />
              Interview prep queue
            </div>
            <p className="mt-2 text-sm font-medium leading-6 text-sky-800">
              14 answers prepared across product sense, technical judgment, founder story, and execution examples.
            </p>
          </button>
        </motion.div>
      </section>

      <motion.section
        id="agents"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="mt-6 rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] md:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight" style={{ color: '#ffffff' }}>Candidate AI agent bench</h2>
            <p className="mt-1 text-sm font-medium text-slate-400">Purpose-built helpers for the application workflow.</p>
          </div>
          <Bot className="h-5 w-5 text-sky-300" />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {candidateAgents.map((agent) => {
            const Icon = agent.icon
            return (
              <button
                key={agent.name}
                type="button"
                onClick={() => showToast(`${agent.name}: mock agent selected.`)}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:bg-white/[0.1]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-sky-300 p-2.5 text-slate-950">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-200">{agent.state}</span>
                </div>
                <h3 className="font-bold" style={{ color: '#ffffff' }}>{agent.name}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-400">{agent.task}</p>
              </button>
            )
          })}
        </div>
      </motion.section>
    </WorkspaceShell>
  )
}
