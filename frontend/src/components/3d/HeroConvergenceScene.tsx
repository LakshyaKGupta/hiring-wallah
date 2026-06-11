'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Briefcase, 
  FileSearch, 
  ShieldCheck, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Activity, 
  Search, 
  ChevronRight,
  RefreshCw
} from 'lucide-react'

// Premium Apple-style transitions
const appleTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 30
}

interface CandidateSimulator {
  id: string
  name: string
  role: string
  experience: string
  description: string
  expMatch: number
  skillMatch: number
  evidence: string[]
  risks: string[]
  logs: string[]
  verdict: 'STRONG HIRE' | 'CONSIDER' | 'DEFER'
  verdictColor: string
  avatar: string
}

const SIMULATED_CANDIDATES: CandidateSimulator[] = [
  {
    id: 'cand_lg',
    name: 'Lakshya Gupta',
    role: 'Lead Product Designer',
    experience: '6.5 Years',
    avatar: 'LG',
    description: 'Vast product design tenure, led recruiter onboarding & UX research. Strong portfolio match.',
    expMatch: 90,
    skillMatch: 92,
    evidence: [
      'Built AI hiring platform (design case study)',
      'Led recruiter onboarding & UX research',
      'Reduced user drop-off by 42% at previous role'
    ],
    risks: [
      'Limited PM internship experience (flagged by Critic)'
    ],
    verdict: 'STRONG HIRE',
    verdictColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    logs: [
      'SYSTEM: Ingesting application dossier lakshya_gupta.pdf',
      'PARSER: Ingested dossier. Extracted 6.5 years experience, 12 skill matches',
      'EVALUATOR: Scoring skill match: 92/100, experience match: 90/100',
      'CRITIC: Auditing claims. Risk flagged: Limited PM internship experience',
      'COMMITTEE: Voting on verdict... APPROVED (5 Ayes, 1 Abstain)'
    ]
  },
  {
    id: 'cand_sc',
    name: 'Sasha Chen',
    role: 'Mid-level React Developer',
    experience: '2.5 Years',
    avatar: 'SC',
    description: 'Expert React/TypeScript skills. High tool alignment, but shorter overall career history.',
    expMatch: 40,
    skillMatch: 98,
    evidence: [
      'Expert React/TypeScript skills (100% test score)',
      'Built 4 production dashboard apps',
      'Implemented design tokens & Tailwind architectures'
    ],
    risks: [
      'Shorter tenure than target senior role',
      'No backend/infra experience (Node/Go)'
    ],
    verdict: 'CONSIDER',
    verdictColor: 'text-accent-primary bg-accent-primary/5 border-accent-primary/20',
    logs: [
      'SYSTEM: Ingesting application dossier sasha_chen.pdf',
      'PARSER: Ingested dossier. Extracted 2.5 years experience, 8 skill matches',
      'EVALUATOR: Scoring skill match: 98/100, experience match: 40/100',
      'CRITIC: WARNING: Shorter tenure than target senior role',
      'COMMITTEE: Voting on verdict... CONSIDER (4 Ayes, 2 Nays)'
    ]
  },
  {
    id: 'cand_dv',
    name: 'Derrick Vance',
    role: 'Staff Backend Engineer',
    experience: '9 Years',
    avatar: 'DV',
    description: 'Highly experienced backend engineer, but lacks Python & GraphQL stack matching.',
    expMatch: 95,
    skillMatch: 55,
    evidence: [
      '9 years Java/Node distributed systems experience',
      'Managed team of 8 backend engineers',
      'Implemented high-throughput event sourcing architectures'
    ],
    risks: [
      'Missing target skills: Python & GraphQL',
      'No frontend framework experience'
    ],
    verdict: 'DEFER',
    verdictColor: 'text-accent-amber bg-accent-amber/5 border-accent-amber/20',
    logs: [
      'SYSTEM: Ingesting application dossier derrick_vance.pdf',
      'PARSER: Ingested dossier. Extracted 9 years experience, 4 skill matches',
      'EVALUATOR: Scoring skill match: 55/100, experience match: 95/100',
      'CRITIC: Flagged: Missing target skills: Python & GraphQL',
      'COMMITTEE: Voting on verdict... DEFERRED (3 Ayes, 3 Nays)'
    ]
  }
]

export function HeroConvergenceScene() {
  const [selectedCandId, setSelectedCandId] = useState<string>('cand_lg')
  const [screeningState, setScreeningState] = useState<'idle' | 'processing' | 'done'>('done')
  const [expWeight, setExpWeight] = useState<number>(50)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [logIndex, setLogIndex] = useState<number>(0)
  
  const activeCand = SIMULATED_CANDIDATES.find(c => c.id === selectedCandId) || SIMULATED_CANDIDATES[0]
  const skillWeight = 100 - expWeight

  // Recalculated score
  const suitabilityScore = Math.round((activeCand.expMatch * expWeight + activeCand.skillMatch * skillWeight) / 100)

  // Circular gauge config
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (suitabilityScore / 100) * circumference

  // Run processing simulation when candidate changes
  const runScreening = useCallback((candId: string) => {
    setSelectedCandId(candId)
    setScreeningState('processing')
    setConsoleLogs([])
    setLogIndex(0)
  }, [])

  useEffect(() => {
    if (screeningState !== 'processing') return

    const targetCand = SIMULATED_CANDIDATES.find(c => c.id === selectedCandId) || activeCand
    
    if (logIndex < targetCand.logs.length) {
      const timer = setTimeout(() => {
        setConsoleLogs(prev => [...prev, targetCand.logs[logIndex]])
        setLogIndex(prev => prev + 1)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setScreeningState('done')
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [screeningState, logIndex, selectedCandId, activeCand])

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_75%_45%,rgba(79,70,229,0.12),transparent_38%),linear-gradient(135deg,#fbfbf8_0%,#f3f6fb_48%,#e9eef7_100%)] py-12 md:py-0">
      <div className="absolute inset-0 grid-bg grid-bg-drift opacity-50" />
      
      {/* Background orbs */}
      <motion.div
        className="absolute left-[-12%] top-[18%] h-[34rem] w-[34rem] rounded-full bg-accent-primary/5 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent-secondary/5 blur-3xl"
        animate={{ x: [0, -15, 0], y: [0, 12, 0], scale: [1, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        {/* Left Column: Core Copy */}
        <div className="max-y-space space-y-7 lg:col-span-6 text-left select-text">
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-extrabold leading-[0.96] tracking-[-0.05em] text-text-primary md:text-7xl">
              Forensic hiring, without the black box.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Hiring Wallah converts resumes and job requirements into transparent agent reasoning, weighted consensus scores, and signed reports recruiters can defend.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pointer-events-auto">
            <Link href="/auth?mode=signup" className="group inline-flex items-center justify-center gap-2 rounded-xl border border-accent-primary bg-accent-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-apple hover:bg-accent-primary/95">
              Create account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/recruiter" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface/80 px-6 py-3 text-sm font-bold text-text-primary shadow-sm backdrop-blur-md transition-apple hover:border-accent-primary/30 hover:bg-bg-raised">
              <Briefcase className="h-4 w-4 text-accent-primary" />
              Open recruiter demo
            </Link>
          </div>

          <div className="grid max-w-xl grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
            {[
              { icon: FileSearch, label: 'Resume evidence', value: 'Parsed' },
              { icon: User, label: 'Candidate fit', value: 'Scored' },
              { icon: ShieldCheck, label: 'Decision trail', value: 'Signed' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-surface/70 p-3 shadow-xs backdrop-blur-md">
                <item.icon className="mb-2 h-4 w-4 text-accent-primary" />
                <div className="text-sm font-bold leading-none text-text-primary">{item.value}</div>
                <div className="type-label mt-1 text-[10px] text-text-tertiary">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive AI Screening Playground */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-xl bg-white border border-gray-150 rounded-2xl shadow-xl overflow-hidden flex flex-col font-sans text-left"
          >
            {/* macOS Window Title Bar */}
            <div className="bg-slate-50 border-b border-gray-150 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-medium">hiring-wallah-screener.sh</span>
              <div className="w-12" />
            </div>

            {/* Split Pane Workspace */}
            <div className="flex grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
              {/* Left Pane: Candidate List */}
              <div className="md:col-span-4 border-r border-gray-150 bg-slate-50/50 p-3 flex flex-col gap-2">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1">
                  Candidates (3)
                </div>
                {SIMULATED_CANDIDATES.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      if (screeningState !== 'processing') {
                        runScreening(cand.id)
                      }
                    }}
                    disabled={screeningState === 'processing'}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                      selectedCandId === cand.id
                        ? 'bg-white border-accent-primary text-gray-900 shadow-xs'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-white/40 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        selectedCandId === cand.id ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cand.avatar}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold leading-tight">{cand.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-gray-400 font-medium truncate">{cand.experience} exp</div>
                      </div>
                    </div>
                    {selectedCandId === cand.id && screeningState === 'processing' ? (
                      <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin shrink-0 ml-1" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right Pane: Workspace Board */}
              <div className="md:col-span-8 p-4 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {screeningState === 'processing' ? (
                    // Processing Terminal
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-gray-950 font-mono text-[10px] text-gray-300 p-4 rounded-xl flex-1 flex flex-col gap-1.5 overflow-y-auto leading-relaxed shadow-inner"
                    >
                      {consoleLogs.map((log, idx) => (
                        <div key={idx} className={`${idx === consoleLogs.length - 1 ? 'text-indigo-400 font-semibold' : ''}`}>
                          <span className="text-gray-600">&gt;</span> {log}
                        </div>
                      ))}
                      {consoleLogs.length < activeCand.logs.length && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <span className="w-1.5 h-3 bg-indigo-500 animate-pulse inline-block" />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    // Scorecard Result View
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-between space-y-4"
                    >
                      {/* Name Header & Gauge */}
                      <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 tracking-tight">{activeCand.name}</h4>
                          <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{activeCand.role}</p>
                        </div>
                        
                        {/* Interactive Score Circle */}
                        <div className="relative w-18 h-18 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="36"
                              cy="36"
                              r={radius}
                              className="stroke-gray-100"
                              strokeWidth="4"
                              fill="transparent"
                            />
                            <motion.circle
                              cx="36"
                              cy="36"
                              r={radius}
                              className="stroke-indigo-600"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={circumference}
                              animate={{ strokeDashoffset }}
                              transition={appleTransition}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-sm font-display font-extrabold text-gray-950 leading-none">
                              {suitabilityScore}%
                            </span>
                            <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">FIT</span>
                          </div>
                        </div>
                      </div>

                      {/* Info & Badges */}
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[170px] pr-1 scrollbar-thin">
                        <div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Verified Evidence Check</div>
                          <ul className="space-y-1.5 text-[11px]">
                            {activeCand.evidence.map((ev, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-gray-700">
                                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                <span className="leading-tight">{ev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t border-gray-100 pt-2.5">
                          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assumptions & Risks</div>
                          <div className="flex items-start gap-1.5 text-[11px] text-gray-700">
                            <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                            <span className="leading-tight">{activeCand.risks[0]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Weight Sliders in Hero */}
                      <div className="border-t border-gray-100 pt-3 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-600">
                          <span>Tenure Weight: {expWeight}%</span>
                          <span>Skills Weight: {skillWeight}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={expWeight}
                          onChange={(e) => setExpWeight(Number(e.target.value))}
                          className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex items-center justify-between text-[8px] font-bold text-gray-400">
                          <span>VERDICT: <span className={`px-2 py-0.5 rounded text-[8px] border ml-1 ${activeCand.verdictColor}`}>{activeCand.verdict}</span></span>
                          <span className="font-mono">HASH: sha256:7c2e...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
