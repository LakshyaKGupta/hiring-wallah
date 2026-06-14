'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, type Variants } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileSearch,
  MessageSquareText,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { WorkspaceShell, type WorkspaceAction } from '@/components/ui/WorkspaceShell'

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 190, damping: 24 },
  },
}

const commandStats = [
  { label: 'Active roles', value: '8', delta: '+3 this week', icon: Briefcase, tone: 'blue' },
  { label: 'Candidates screened', value: '1,247', delta: '6.1x faster review', icon: Users, tone: 'violet' },
  { label: 'Strong finalists', value: '36', delta: '12 ready for panel', icon: Target, tone: 'emerald' },
  { label: 'Avg evidence score', value: '91', delta: '+8 vs last cycle', icon: ShieldCheck, tone: 'sky' },
]

const roles = [
  { title: 'Senior Product Designer', team: 'Growth Product', stage: 'Shortlist review', screened: 184, finalists: 5, score: 92, sla: '2h left' },
  { title: 'Backend Platform Engineer', team: 'Core Infrastructure', stage: 'Evidence verification', screened: 312, finalists: 8, score: 88, sla: 'On track' },
  { title: 'Founding GTM Lead', team: 'Revenue', stage: 'Interview kit ready', screened: 96, finalists: 3, score: 94, sla: 'Ready' },
]

const shortlist = [
  { name: 'Aarav Mehta', role: 'Senior Product Designer', score: 94, signal: 'Strong portfolio evidence', risk: 'Needs enterprise SaaS depth' },
  { name: 'Naina Kapoor', role: 'Backend Platform Engineer', score: 91, signal: 'High systems ownership', risk: 'Limited hiring loop exposure' },
  { name: 'Rohan Iyer', role: 'Founding GTM Lead', score: 89, signal: 'Clear 0-1 pipeline wins', risk: 'Compensation expectations high' },
]

const agentLanes = [
  { name: 'JD Analyst', task: 'Extracting must-have criteria from 3 open roles', status: 'Running', icon: FileSearch, progress: 76 },
  { name: 'Evidence Verifier', task: 'Checking claims against project and tenure signals', status: 'Auditing', icon: ShieldCheck, progress: 61 },
  { name: 'Interview Designer', task: 'Drafting structured panel questions', status: 'Ready', icon: MessageSquareText, progress: 100 },
  { name: 'Consensus Board', task: 'Resolving score disagreement on 11 profiles', status: 'Review', icon: Bot, progress: 48 },
]

const reports = [
  { label: 'Signed scorecards', value: '42', note: 'SHA-256 evidence reports' },
  { label: 'Panel briefs', value: '18', note: 'Interview-ready packets' },
  { label: 'Risk flags', value: '7', note: 'Needs recruiter decision' },
]

const toneClass: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
}

export default function RecruiterDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [action, setAction] = useState<WorkspaceAction | null>(null)
  const [toast, setToast] = useState('')
  const [activeView, setActiveView] = useState('command')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'recruiter')) {
      router.replace('/auth?mode=signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    const validViews = new Set(['command', 'roles', 'shortlist', 'agents', 'reports'])
    const syncFromHash = () => {
      const next = window.location.hash.replace('#', '')
      if (validViews.has(next)) setActiveView(next)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openAction = (nextAction: WorkspaceAction) => setAction(nextAction)

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Opening recruiter workspace...</span>
        </div>
      </div>
    )
  }

  const firstName = user.displayName?.split(' ')[0] ?? 'Lakshya'

  return (
    <WorkspaceShell
      role="recruiter"
      activeId={activeView}
      title="Recruiter Command Center"
      subtitle="Search roles, candidates, reports..."
      primaryActionLabel="Create role"
      onNavSelect={setActiveView}
      onPrimaryAction={() => openAction({
        title: 'Create a hiring role',
        description: 'This mock flow shows how a recruiter will configure a role before the AI agents build the rubric.',
        steps: ['Add role title, team, seniority, location, and compensation band.', 'Paste the JD or generate it from role requirements.', 'Let JD Analyst turn requirements into weighted evaluation criteria.', 'Publish role and open resume intake.'],
        cta: 'Save mock role draft',
      })}
      toast={toast}
      action={action}
      onCloseAction={() => setAction(null)}
    >
      {activeView === 'command' && <motion.section
        id="command"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"
      >
        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Recruiter operating system
              </div>
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                Welcome back, {firstName}. Run the hiring loop from here.
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                Every module contributes to one workflow: define role requirements, verify candidate evidence, align the panel, and produce auditable hiring decisions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openAction({
                  title: 'Create role draft',
                  description: 'A role draft workspace will collect requirement evidence before publishing.',
                  steps: ['Choose department and hiring owner.', 'Set critical competencies and deal-breakers.', 'Generate a role rubric preview.', 'Invite the hiring manager to approve.'],
                })}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Create role
              </button>
              <button
                type="button"
                onClick={() => openAction({
                  title: 'Upload resume batch',
                  description: 'This opens the planned resume intake flow for batch processing.',
                  steps: ['Upload PDFs or connect an ATS source.', 'Map resumes to the target role.', 'Run parsing, evidence verification, and consensus scoring.', 'Send finalists to recruiter review.'],
                })}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <FileCheck2 className="h-4 w-4" />
                Upload resumes
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {commandStats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.button
                  type="button"
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => showToast(`${stat.label}: sample analytics panel selected.`)}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-xl border p-2.5 ${toneClass[stat.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950">{stat.value}</div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{stat.label}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">{stat.delta}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <motion.aside
          variants={itemVariants}
          className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 text-slate-950 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-sky-700">Today&apos;s priority</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">5 finalists need recruiter review.</h2>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
              <Zap className="h-5 w-5 text-sky-600" />
            </div>
          </div>
          <div className="mt-7 space-y-3">
            {['Approve product design shortlist', 'Resolve 2 evidence conflicts', 'Send panel brief to hiring manager'].map((task, index) => (
              <button
                key={task}
                type="button"
                onClick={() => openAction({
                  title: task,
                  description: 'This mock task shows the exact recruiter action that will be connected to the backend workflow.',
                  steps: ['Open candidate evidence trail.', 'Review AI rationale and contested claims.', 'Choose approve, reject, or request more evidence.', 'Write activity back to the hiring ledger.'],
                })}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-black text-white">{index + 1}</div>
                <span className="text-sm font-semibold text-slate-800">{task}</span>
              </button>
            ))}
          </div>
        </motion.aside>
      </motion.section>}

      {activeView === 'roles' && <section id="roles" className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Active hiring roles</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Each role owns a rubric, candidate queue, panel brief, and audit trail.</p>
            </div>
            <button type="button" onClick={() => showToast('Showing all sample roles. Backend role list will replace this next.')} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50">View all</button>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <motion.article
                key={role.title}
                variants={itemVariants}
                className="group rounded-2xl border border-slate-200 bg-[#fbfcff] p-4 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">{role.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{role.team} · {role.stage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAction({
                      title: `${role.title} role room`,
                      description: 'This role room will combine job requirements, candidate queue, scorecards, and panel status.',
                      steps: [`${role.screened} candidates screened so far.`, `${role.finalists} finalists are ready for recruiter inspection.`, `Current average evidence score is ${role.score}.`, 'Next backend step: connect this card to real role and evaluation records.'],
                    })}
                    className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                  >
                    {role.sla}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniMetric label="Screened" value={String(role.screened)} />
                  <MiniMetric label="Finalists" value={String(role.finalists)} />
                  <MiniMetric label="Evidence score" value={`${role.score}`} />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
        <WorkspaceSideNote
          title="Role workspace"
          icon={Briefcase}
          body="This page is for opening roles, editing rubrics, uploading candidate batches, and tracking role-level hiring progress."
          cta="Create role draft"
          onClick={() => openAction({
            title: 'Create role draft',
            description: 'A role draft workspace will collect requirement evidence before publishing.',
            steps: ['Choose department and hiring owner.', 'Set critical competencies and deal-breakers.', 'Generate a role rubric preview.', 'Invite the hiring manager to approve.'],
          })}
        />
      </section>}

      {activeView === 'shortlist' && (
        <motion.div
          id="shortlist"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-violet-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Shortlist intelligence</h2>
              <p className="text-sm font-medium text-slate-500">Top candidates with reasons, risks, and next actions.</p>
            </div>
          </div>

          <div className="space-y-3">
            {shortlist.map((candidate) => (
              <button
                key={candidate.name}
                type="button"
                onClick={() => openAction({
                  title: `${candidate.name} evidence brief`,
                  description: `${candidate.name} is sample data, but this drawer represents the candidate dossier experience.`,
                  steps: [`Signal: ${candidate.signal}.`, `Risk: ${candidate.risk}.`, 'Open signed scorecard, interview prompts, and hiring-manager notes.', 'Backend connection: candidate evaluation detail route.'],
                })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:border-violet-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">{candidate.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{candidate.role}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white">
                    <div className="font-display text-xl font-extrabold leading-none">{candidate.score}</div>
                    <div className="mt-0.5 text-[10px] font-bold text-slate-300">Score</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-800">{candidate.signal}</div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-amber-800">{candidate.risk}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {activeView === 'agents' && <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          id="agents"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">AI agent operations</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Dedicated work lanes for the hiring engine.</p>
            </div>
            <Bot className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {agentLanes.map((agent) => {
              const Icon = agent.icon
              return (
                <button
                  type="button"
                  key={agent.name}
                  onClick={() => showToast(`${agent.name}: mock lane selected for inspection.`)}
                  className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-100 bg-sky-50 p-2.5 text-sky-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-slate-950">{agent.name}</h3>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">{agent.status}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-500">{agent.task}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${agent.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-sky-400"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
        <WorkspaceSideNote
          title="Agent control room"
          icon={Bot}
          body="This page will let recruiters inspect agent status, rerun evaluations, pause workflows, and review automation failures."
          cta="Open agent runbook"
          onClick={() => openAction({
            title: 'AI agent runbook',
            description: 'Mock operational runbook for the multi-agent hiring workflow.',
            steps: ['Inspect each agent lane.', 'Review failed or contested runs.', 'Rerun evidence verification where needed.', 'Write final output to the decision ledger.'],
          })}
        />
      </section>}

      {activeView === 'reports' && (
        <motion.div
          id="reports"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Decision quality room</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Reports, risks, and recruiter actions before offers move.</p>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {reports.map((report) => (
              <button key={report.label} type="button" onClick={() => showToast(`${report.label}: sample report metric selected.`)} className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-4 text-left transition hover:bg-white hover:shadow-sm">
                <div className="font-display text-3xl font-extrabold tracking-tight text-slate-950">{report.value}</div>
                <div className="mt-1 text-sm font-bold text-slate-800">{report.label}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{report.note}</div>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <CheckCircle2 className="h-4 w-4" />
                Ready for hiring manager
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-emerald-800">
                Product Designer shortlist has clean evidence trails and aligned interview prompts.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <AlertTriangle className="h-4 w-4" />
                Recruiter attention
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-amber-800">
                Two backend candidates have strong scores but unresolved seniority signals.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => openAction({ title: 'Schedule panel', description: 'Mock scheduling flow for moving finalists into structured interviews.', steps: ['Choose finalist candidates.', 'Select interviewers and competencies.', 'Generate panel brief and calendar invite.', 'Send reminders and log panel status.'] })} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              <CalendarClock className="h-4 w-4" />
              Schedule panel
            </button>
            <button type="button" onClick={() => openAction({ title: 'Review queue', description: 'Mock queue of recruiter decisions waiting for action.', steps: ['Review unresolved risk flags.', 'Approve or request more evidence.', 'Send selected candidates to panel.', 'Archive rejected profiles with rationale.'] })} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-300">
              <Clock3 className="h-4 w-4" />
              Review queue
            </button>
          </div>
        </motion.div>
      )}
    </WorkspaceShell>
  )
}

function WorkspaceSideNote({
  title,
  body,
  cta,
  icon: Icon,
  onClick,
}: {
  title: string
  body: string
  cta: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-6 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        {cta}
      </button>
    </aside>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="font-display text-xl font-extrabold tracking-tight text-slate-950">{value}</div>
      <div className="mt-0.5 text-[11px] font-bold text-slate-500">{label}</div>
    </div>
  )
}
