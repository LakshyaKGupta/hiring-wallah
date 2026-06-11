import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Briefcase, RefreshCw, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import FloatingIcons from '@/components/ui/FloatingIcons'

const SIMULATED_CANDIDATES = [
  { id: 'c1', name: 'Lakshya Gupta', experience: '5', avatar: 'LG', role: 'Lead Product Designer', logs: [
    'PARSER: Ingesting application dossier candidate_4920.pdf',
    'STRATEGIST: Applying rubric weight distribution: Experience (40%), Skills (60%)',
    'ANALYST: Extracting target parameters: "React", "Design Systems"',
    'EVALUATOR: Dimension Score for React: 92/100 (Level: High-Autonomy)',
    'COMMITTEE: Consensus phase started. 6/6 Agents presenting evaluations...',
    'COMMITTEE: Voting on verdict for candidate_4920... PASSED (5 Ayes, 1 Abstain)',
  ]},
  { id: 'c2', name: 'Derrick Vance', experience: '9', avatar: 'DV', role: 'Staff Engineer', logs: [
    'PARSER: Ingesting application dossier candidate_1192.pdf',
    'ANALYST: Extracting target parameters: "Python", "GraphQL"',
    'DEVILS_ADVOCATE: WARNING: No native iOS details found for stated React Native role',
    'EVALUATOR: Recalculating score with Devil\'s Advocate inputs: 89.5/100',
  ]},
  { id: 'c3', name: 'Sasha Chen', experience: '2.5', avatar: 'SC', role: 'Full-Stack Developer', logs: [
    'PARSER: Ingesting application dossier candidate_3041.pdf',
    'STRATEGIST: Applying rubric weight distribution: Experience (50%), Skills (50%)',
    'COMMITTEE: Waiting on background verification check...',
  ]}
]

export function HeroConvergenceScene() {
  const [selectedCandId, setSelectedCandId] = useState('c1')
  const [screeningState, setScreeningState] = useState<'idle' | 'processing' | 'done'>('idle')
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const activeCand = SIMULATED_CANDIDATES.find(c => c.id === selectedCandId) || SIMULATED_CANDIDATES[0]

  const runScreening = (candId: string) => {
    setSelectedCandId(candId)
    setScreeningState('processing')
    setConsoleLogs([])
    
    if (logIntervalRef.current) clearInterval(logIntervalRef.current)

    const targetCand = SIMULATED_CANDIDATES.find(c => c.id === candId) || SIMULATED_CANDIDATES[0]
    let logIdx = 0

    logIntervalRef.current = setInterval(() => {
      setConsoleLogs(prev => [...prev, targetCand.logs[logIdx]])
      logIdx++
      if (logIdx >= targetCand.logs.length) {
        if (logIntervalRef.current) clearInterval(logIntervalRef.current)
        setTimeout(() => setScreeningState('done'), 1000)
      }
    }, 600)
  }

  // Initial animation
  useEffect(() => {
    setTimeout(() => runScreening('c1'), 1500)
    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current)
    }
  }, [])

  const radius = 32
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (0.91) * circumference

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden bg-bg-deep pt-20 md:pt-16 pb-12">
      {/* Dynamic Aurora Glow & Grain Texture */}
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="grain-overlay" />

      {/* Increased Floating Icons with varied sizing and distances */}
      <FloatingIcons count={12} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:gap-16 px-6 lg:grid-cols-12">
        {/* Left Column: Core Copy */}
        <div className="space-y-8 lg:col-span-6 text-left select-text">
          <div className="space-y-6">
            <h1 className="font-display text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[0.92] tracking-[-0.04em] text-text-primary">
              Forensic hiring,<br />
              <span className="shimmer-text">without the black box.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl leading-relaxed text-text-secondary font-medium">
              Hiring Wallah converts resumes and job requirements into transparent agent reasoning, weighted consensus scores, and signed reports recruiters can defend.
              <span className="block mt-4 text-sm font-bold text-accent-primary opacity-90">
                <span className="mr-3">6× Faster Screening</span> • <span className="mx-3">10,000+ Screened</span> • <span className="ml-3">99% Accuracy</span>
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row pointer-events-auto">
            <Link href="/auth?mode=signup" className="group inline-flex items-center justify-center gap-2 rounded-xl border border-accent-primary bg-accent-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_16px_rgba(124,58,237,0.2)] transition-apple hover:bg-accent-primary/95 hover:shadow-[0_12px_24px_rgba(124,58,237,0.3)] hover:-translate-y-0.5">
              Create account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/recruiter" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface/80 px-7 py-3.5 text-sm font-bold text-text-primary shadow-sm backdrop-blur-md transition-apple hover:border-accent-primary/30 hover:bg-bg-raised hover:-translate-y-0.5">
              <Briefcase className="h-4 w-4 text-accent-primary" />
              Open recruiter demo
            </Link>
          </div>

          {/* Marquee Trust Bar */}
          <div className="pt-6 overflow-hidden max-w-lg border-t border-border-subtle/50 relative">
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg-deep to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg-deep to-transparent z-10" />
            <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] gap-6 text-[11px] font-bold text-text-tertiary uppercase tracking-widest">
              <span>Evidence-Based Scoring</span>
              <span className="text-border-subtle">•</span>
              <span>SHA-256 Signed Reports</span>
              <span className="text-border-subtle">•</span>
              <span>Multi-Agent Consensus</span>
              <span className="text-border-subtle">•</span>
              <span>6× Faster Screening</span>
              <span className="text-border-subtle">•</span>
              <span>Zero Black Box</span>
              <span className="text-border-subtle">•</span>
              <span>Evidence-Based Scoring</span>
              <span className="text-border-subtle">•</span>
              <span>SHA-256 Signed Reports</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive AI Screening Playground */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end relative">
          <div className="absolute -inset-10 bg-accent-primary/10 blur-[100px] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1000 }}
            className="w-full max-w-[540px] bg-white border border-gray-150 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.06),0_12px_24px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col font-sans text-left relative z-20"
          >
            {/* macOS Window Title Bar */}
            <div className="bg-slate-50 border-b border-gray-150 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm" />
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-medium tracking-wide">screening.ai</span>
              <div className="w-12" />
            </div>

            {/* Split Pane Workspace */}
            <div className="flex grid grid-cols-1 md:grid-cols-12 h-[380px]">
              {/* Left Pane: Candidate List */}
              <div className="md:col-span-4 border-r border-gray-150 bg-slate-50/40 p-3 flex flex-col gap-2 relative">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1">
                  Queue (3)
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
                        ? 'bg-white border-accent-primary/30 text-gray-900 shadow-sm scale-[1.02]'
                        : 'bg-transparent border-transparent text-gray-500 hover:bg-white/60 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${
                        selectedCandId === cand.id ? 'bg-purple-50 text-accent-primary border border-purple-100' : 'bg-gray-100 text-gray-500 border border-border-subtle'
                      }`}>
                        {cand.avatar}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold leading-tight tracking-tight">{cand.name.split(' ')[0]}</div>
                        <div className="text-[9px] text-gray-400 font-medium truncate">{cand.experience} yr exp</div>
                      </div>
                    </div>
                    {selectedCandId === cand.id && screeningState === 'processing' ? (
                      <RefreshCw className="w-3 h-3 text-accent-primary animate-spin shrink-0 ml-1" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right Pane: Workspace Board */}
              <div className="md:col-span-8 p-4 bg-white flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {screeningState === 'processing' ? (
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#0b0f19] font-mono text-[10px] text-gray-300 p-4 rounded-xl flex-1 flex flex-col gap-2 overflow-y-auto leading-relaxed shadow-inner border border-gray-800"
                    >
                      {consoleLogs.map((log, idx) => (
                        <div key={idx} className={`${idx === consoleLogs.length - 1 ? 'text-[#8b5cf6] font-semibold' : 'text-gray-400'} flex items-start gap-2`}>
                          <span className="text-gray-600 shrink-0">&gt;</span> 
                          <span>{log}</span>
                        </div>
                      ))}
                      {consoleLogs.length < activeCand.logs.length && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-gray-600 shrink-0">&gt;</span>
                          <span className="w-1.5 h-3 bg-[#8b5cf6] animate-pulse inline-block" />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 tracking-tight">{activeCand.name}</h4>
                          <p className="text-[10px] text-accent-primary font-bold mt-1 bg-accent-primary/10 px-2 py-0.5 rounded-full inline-block">{activeCand.role}</p>
                        </div>
                        
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r={radius} className="stroke-gray-100" strokeWidth="4" fill="transparent" />
                            <motion.circle
                              cx="32"
                              cy="32"
                              r={radius}
                              className="stroke-accent-primary"
                              strokeWidth="4"
                              strokeLinecap="round"
                              fill="transparent"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold text-gray-900">91</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 py-4 space-y-4">
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Verified Strengths</div>
                          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg p-2.5 flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 font-bold text-[10px]">✓</div>
                            <div className="text-xs text-gray-700 leading-tight">Led Design Systems implementation across 4 major product lines</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Flagged Risks</div>
                          <div className="bg-rose-50/50 border border-rose-100/50 rounded-lg p-2.5 flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 text-rose-600 font-bold text-[10px]">!</div>
                            <div className="text-xs text-gray-700 leading-tight">Missing direct GraphQL enterprise scale exposure</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">HASH: sha256:7c2e...</span>
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Consensus Reached
                        </span>
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
