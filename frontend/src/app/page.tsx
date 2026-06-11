'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { 
  Briefcase, 
  User, 
  ShieldAlert, 
  Cpu, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  AlertOctagon, 
  Terminal, 
  Search, 
  Sliders, 
  Users, 
  Lock, 
  Activity,
  Zap,
  Network,
  Fingerprint,
  FileCheck2,
  Waypoints,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import MeshBackground from '@/components/ui/MeshBackground'
import {
  fadeUpContainerVariants as sectionContainerVariants,
  fadeUpItemVariants as sectionItemVariants,
  EASE_OUT,
  appleTransition,
} from '@/lib/motion'
import TextReveal from '@/components/ui/TextReveal'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { HeroConvergenceScene } from '@/components/3d/HeroConvergenceScene'

const LedgerChainBackground = dynamic(() => import('@/components/3d/LedgerChainBackground').then(mod => ({ default: mod.LedgerChainBackground })), { ssr: false })

const featureCards = [
  {
    title: '6× Faster Screening',
    detail: 'Ingest thousands of resumes, parse credentials, and shortlist top talent in under 5 minutes without manual reading.',
    icon: Zap,
    colorClass: 'text-indigo-600',
    bgClass: 'from-indigo-50 to-white',
  },
  {
    title: 'Explainable Decisions',
    detail: 'Get a comprehensive written scorecard explaining exactly why every candidate was recommended or skipped.',
    icon: FileText,
    colorClass: 'text-purple-600',
    bgClass: 'from-purple-50 to-white',
  },
  {
    title: 'Evidence-Based Evaluation',
    detail: 'Verify skills against actual project history, timelines, and role scope, bypassing buzzword keyword packing.',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
    bgClass: 'from-emerald-50 to-white',
  },
  {
    title: 'Candidate Intelligence',
    detail: 'Enable candidates to run mock matches, discover skill gaps, and optimize resumes before submitting.',
    icon: Sliders,
    colorClass: 'text-cyan-500',
    bgClass: 'from-cyan-50 to-white',
  },
] as const

// Subcomponent: 3D Tilting Card for Agent Committee
interface AgentCardProps {
  title: string
  role: string
  mechanics: string
  colorClass: string
  borderColorClass: string
  icon: React.ComponentType<{ className?: string }>
}

function AgentCard({ title, role, mechanics, colorClass, borderColorClass, icon: Icon, index = 0 }: AgentCardProps & { index?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={sectionItemVariants}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className={`relative bg-bg-surface/90 backdrop-blur-sm border ${borderColorClass} rounded-xl p-5 shadow-sm select-none cursor-pointer flex flex-col justify-between h-full group overflow-hidden`}
      whileHover={{
        y: -6,
        boxShadow: '0 12px 24px rgba(0, 103, 255, 0.08)',
        rotateZ: 0,
      }}
      whileTap={{ scale: 0.98 }}
      transition={appleTransition(0.35)}
      style={{
        animation: `float-gentle 4s ease-in-out infinite`,
        animationDelay: `${index * 0.5}s`,
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className="p-2 rounded-lg bg-bg-raised border border-border-subtle group-hover:border-accent-primary/30 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 6 }}
          >
            <Icon className="w-5 h-5 text-text-primary group-hover:text-accent-primary transition-colors duration-200" />
          </motion.div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-text-primary tracking-tight">
              {title}
            </h4>
            <p className="type-caption text-indigo-600 font-bold">
              Reasoning Stage
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          {role}
        </p>
      </div>

      <div className="border-t border-border-subtle pt-3 mt-auto relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-text-tertiary text-[10px] font-bold">Reasoning Logic:</span>
          <motion.span 
            className="text-accent-green bg-accent-green/5 border border-accent-green/15 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-1"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse" />
            Active
          </motion.span>
        </div>
        
        <div className="bg-bg-raised border border-border-subtle rounded p-2 text-text-secondary h-16 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="mechanics"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={appleTransition(0.22)}
                className="text-text-primary text-[9px] font-medium"
              >
                {mechanics}
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="italic text-text-tertiary text-[9px]"
              >
                Hover card to reveal active thinking...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// Subcomponent: Portal entrance card (hover lift only — no 3D tilt)
function PortalCard({ 
  title, 
  description, 
  href, 
  buttonText, 
  icon: Icon, 
  colorClass, 
  borderColorClass 
}: {
  title: string
  description: string
  href: string
  buttonText: string
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  borderColorClass: string
}) {
  return (
    <Link href={href} className="block w-full">
      <motion.div
        variants={sectionItemVariants}
        className={`bg-bg-surface/80 backdrop-blur-sm border ${borderColorClass} rounded-2xl p-4 text-left shadow-sm cursor-pointer flex flex-col justify-between h-[170px] group relative overflow-hidden hover:shadow-lg transition-shadow duration-500`}
        whileHover={{
          y: -8,
          boxShadow: '0 20px 40px rgba(0, 103, 255, 0.12)',
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        {/* Border beam on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,103,255,0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'border-beam 2.5s linear infinite',
            maskImage: 'linear-gradient(#fff 0 0)',
            WebkitMaskImage: 'linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: 2,
          }}
        />
        
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorClass}`} />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-bg-raised border border-border-subtle group-hover:border-accent-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Icon className="w-4 h-4 text-text-primary group-hover:text-accent-primary transition-colors duration-200" />
            </div>
            <h3 className="text-sm font-sans font-bold text-text-primary tracking-tight group-hover:text-accent-primary transition-colors duration-200">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-text-secondary leading-normal">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-2 flex items-center gap-2 type-label font-bold text-accent-primary text-xs">
          <span>{buttonText}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-200" />
        </div>
      </motion.div>
    </Link>
  )
}

function FeatureReasoningCard({
  title,
  detail,
  icon: Icon,
  colorClass,
  bgClass,
  index,
}: {
  title: string
  detail: string
  icon: LucideIcon
  colorClass: string
  bgClass: string
  index: number
}) {
  return (
    <motion.div
      variants={sectionItemVariants}
      className="group relative min-h-[220px] rounded-2xl border border-border-subtle bg-white p-4 shadow-sm flex flex-col justify-between overflow-hidden"
      whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 150, damping: 24 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} opacity-40`} />
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-40" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="space-y-2.5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-xs ${colorClass}`}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold tracking-tight text-gray-900">
              {title}
            </h3>
            <p className="text-[11px] leading-normal text-gray-500">
              {detail}
            </p>
          </div>
        </div>

        {/* Dynamic mockup visual at bottom of card */}
        {index === 0 && (
          <div className="bg-slate-50 border border-gray-100 rounded-lg p-3 space-y-1.5 font-mono text-[9px] text-gray-500 text-left">
            <div className="flex items-center justify-between">
              <span className="truncate max-w-[120px]">cv_developer.pdf</span>
              <span className="text-indigo-600 font-bold">100% Ingested</span>
            </div>
            <div className="flex items-center justify-between opacity-80">
              <span className="truncate max-w-[120px]">cv_designer.pdf</span>
              <span className="text-indigo-600 font-bold">100% Ingested</span>
            </div>
            <div className="flex items-center justify-between opacity-60">
              <span className="truncate max-w-[120px]">cv_manager.pdf</span>
              <span className="text-gray-400 font-medium">Parsing...</span>
            </div>
          </div>
        )}

        {index === 1 && (
          <div className="bg-slate-50 border border-gray-100 rounded-lg p-3 font-mono text-[9px] text-gray-500 text-left">
            <div className="text-gray-900 font-bold border-b border-gray-100 pb-1 mb-1">DECISION LOG</div>
            <div>Parser: Extracted 5+ years React exp</div>
            <div className="text-red-500">Critic: ⚠ Lack of Cloud deployment exp</div>
            <div className="text-emerald-600 font-bold mt-1">Verdict: 91% Match (Strong Hire)</div>
          </div>
        )}

        {index === 2 && (
          <div className="bg-slate-50 border border-gray-100 rounded-lg p-3 font-mono text-[9px] text-gray-600 space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span>✓</span>
              <span>Built Go Microservices (Page 2)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span>✓</span>
              <span>Led Design System (Page 1)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
              <span>⚠</span>
              <span>No direct PM title (Page 3)</span>
            </div>
          </div>
        )}

        {index === 3 && (
          <div className="bg-slate-50 border border-gray-100 rounded-lg p-3 font-mono text-[9px] text-gray-600 text-left">
            <div className="text-gray-400 mb-1">Target Skill Gap Audit:</div>
            <div className="flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-bold">React</span>
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-bold">Node.js</span>
              <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded-md border border-red-100 font-bold">Docker [Missing]</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Subcomponent: Live counter numbers for the playground score
function AnimatedScore({ value }: { value: number }) {
  const motionValue = useMotionValue(value)
  const [display, setDisplay] = useState(value)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      motionValue.set(value)
      setDisplay(value)
      return
    }

    const controls = animate(motionValue, value, {
      duration: 0.5,
      ease: EASE_OUT as [number, number, number, number],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, motionValue])

  return (
    <motion.span
      className="inline-block"
    >
      {display}
    </motion.span>
  )
}

const LANDING_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Outcomes' },
  { id: 'for-recruiters', label: 'For Recruiters' },
  { id: 'for-candidates', label: 'For Candidates' },
  { id: 'how-it-works', label: 'Decision Flow' },
  { id: 'cta', label: 'Get Started' },
] as const

const simulatedLogPool = [
  'PARSER: Ingesting application dossier candidate_4920.pdf',
  'STRATEGIST: Applying rubric weight distribution: Experience (40%), Skills (60%)',
  'ANALYST: Extracting target parameters: "FastAPI", "React", "PostgreSQL"',
  'PARSER: PDF parsing complete. Extracted 3 years experience, 5 skill matches',
  'EVALUATOR: Assessing evidence for React context hook architecture... matched.',
  'EVALUATOR: Dimension Score for React: 92/100 (Level: High-Autonomy)',
  'DEVILS_ADVOCATE: Reviewing Evaluator verdict for candidate_4920',
  'DEVILS_ADVOCATE: WARNING: No native iOS details found for stated React Native role',
  'DEVILS_ADVOCATE: Adjusted confidence interval to 88% due to sparse project details',
  'EVALUATOR: Recalculating score with Devil\'s Advocate inputs: 89.5/100',
  'COMMITTEE: Consensus phase started. 6/6 Agents presenting evaluations...',
  'COMMITTEE: Voting on verdict for candidate_4920... PASSED (5 Ayes, 1 Abstain)',
  'LEDGER: Committing consensus transaction to database ledger...',
  'LEDGER: Consensus Hash signed: sha256:8b4f17c3e... verified.',
  'LEDGER: Transaction broadcasted. Permanent evaluation record stored securely.',
  'SYSTEM: Standing by for next candidate dossier...'
]

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate stable timestamps for log simulation (deterministic between server/client)
  const logBaseTime = useRef(new Date(2024, 0, 1, 15, 20, 0))
  const logTimeIndex = useRef(4)

  const [logLines, setLogLines] = useState<Array<{ text: string; timestamp: string }>>([
    { text: 'SYSTEM: Booting Hiring Agent OS v2.4.0...', timestamp: '3:20:00 PM' },
    { text: 'SECURE: Establishing end-to-end consensus ledger bridge...', timestamp: '3:20:01 PM' },
    { text: 'DB: SQLite local fallback db loaded successfully.', timestamp: '3:20:02 PM' },
    { text: 'COMMITTEE: Consensus broker initialized.', timestamp: '3:20:03 PM' },
  ])

  const [activeJson, setActiveJson] = useState({
    candidate_id: "cnd_982",
    status: "STANDBY",
    consensus_score: 0.0,
    confidence: "100%",
    active_agent: "HiringCommittee"
  })

  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lineIdx = 0
    const interval = setInterval(() => {
      const nextLine = simulatedLogPool[lineIdx]
      setLogLines((prev) => {
        const idx = logTimeIndex.current
        logTimeIndex.current = idx + 1
        const base = logBaseTime.current
        const nextTime = new Date(base.getTime() + idx * 1000).toLocaleTimeString()
        const nextLines = [...prev, { text: nextLine, timestamp: nextTime }]
        if (nextLines.length > 12) nextLines.shift()
        return nextLines
      })

      // Update active JSON matching the active agent
      if (nextLine.includes('PARSER')) {
        setActiveJson({
          candidate_id: "cnd_4920",
          status: "PARSING",
          consensus_score: 45.0,
          confidence: "91.8%",
          active_agent: "ResumeParser"
        })
      } else if (nextLine.includes('EVALUATOR')) {
        setActiveJson({
          candidate_id: "cnd_4920",
          status: "EVALUATING",
          consensus_score: 92.0,
          confidence: "95.5%",
          active_agent: "CandidateEvaluator"
        })
      } else if (nextLine.includes('DEVILS')) {
        setActiveJson({
          candidate_id: "cnd_4920",
          status: "CRITIQUING",
          consensus_score: 88.0,
          confidence: "98.1%",
          active_agent: "DevilsAdvocate"
        })
      } else if (nextLine.includes('COMMITTEE') || nextLine.includes('LEDGER')) {
        setActiveJson({
          candidate_id: "cnd_4920",
          status: "APPROVED",
          consensus_score: 89.5,
          confidence: "99.9%",
          active_agent: "HiringCommittee"
        })
      }

      lineIdx = (lineIdx + 1) % simulatedLogPool.length
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logLines])

  // Section 5 Playground Simulator Data
  const candidatesData = [
    {
      name: "Derrick Vance (The Vet)",
      experience: "9 Years",
      role: "Staff Engineer (Java/Node focus)",
      description: "Former Staff Engineer at Enterprise scale. High ownership, but missing target skills (Python & GraphQL).",
      expMatch: 95,
      skillMatch: 55,
      gaps: ["Python", "GraphQL", "Kubernetes"]
    },
    {
      name: "Sasha Chen (The Match)",
      experience: "2.5 Years",
      role: "Mid Developer (Full-Stack stack)",
      description: "Exceptional skill alignment across all required tools. Fast learner with shorter timeline exposure.",
      expMatch: 45,
      skillMatch: 100,
      gaps: []
    },
    {
      name: "Elena Rostova (The All-Rounder)",
      experience: "5 Years",
      role: "Senior Software Engineer",
      description: "Strong candidate with balanced tenure and skills. Only missing target cloud infrastructure tool (Docker).",
      expMatch: 75,
      skillMatch: 80,
      gaps: ["Docker"]
    }
  ]

  const [activeCandidateIdx, setActiveCandidateIdx] = useState(0)
  const [expWeight, setExpWeight] = useState(50)
  const skillWeight = 100 - expWeight

  const candidate = candidatesData[activeCandidateIdx]
  const suitabilityScore = Math.round((candidate.expMatch * expWeight + candidate.skillMatch * skillWeight) / 100)

  // Circular gauge config
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (suitabilityScore / 100) * circumference
  const scrollToSection = useCallback((idx: number) => {
    const section = LANDING_SECTIONS[idx]
    if (section && typeof window !== 'undefined') {
      const element = document.getElementById(section.id)
      if (element) {
        const navbarOffset = 64
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition - navbarOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        setActiveSection(idx)
      }
    }
  }, [])

  const activeSectionRef = useRef(activeSection)
  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    const handleWindowScroll = () => {
      if (typeof window === 'undefined') return
      const navbarOffset = 64
      const scrollPosition = window.scrollY + navbarOffset + 120 // trigger threshold

      let currentSectionIdx = 0
      for (let i = 0; i < LANDING_SECTIONS.length; i++) {
        const element = document.getElementById(LANDING_SECTIONS[i].id)
        if (element) {
          const top = element.offsetTop - navbarOffset
          if (scrollPosition >= top) {
            currentSectionIdx = i
          }
        }
      }

      const prevSectionIdx = activeSectionRef.current
      if (currentSectionIdx !== prevSectionIdx) {
        setActiveSection(currentSectionIdx)
        const section = LANDING_SECTIONS[currentSectionIdx]
        if (section) {
          window.history.replaceState(null, '', `#${section.id}`)
        }
      }
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  useEffect(() => {
    const syncHashToSection = () => {
      if (typeof window === 'undefined') return
      const hash = window.location.hash.replace('#', '')
      const idx = LANDING_SECTIONS.findIndex((section) => section.id === hash)
      if (idx >= 0) {
        setTimeout(() => scrollToSection(idx), 60)
      }
    }

    syncHashToSection()
    window.addEventListener('hashchange', syncHashToSection)
    return () => window.removeEventListener('hashchange', syncHashToSection)
  }, [scrollToSection])

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
    >
      <ScrollProgress />
      


      {/* SECTION 1: HERO - 3D CONVERGENCE CHAMBER */}
      <section id="hero" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-center relative overflow-hidden">
        <HeroConvergenceScene />
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 md:py-24 relative overflow-hidden border-b border-border-subtle bg-slate-50">
        <MeshBackground opacity={0.18} showGrid />

        <motion.div
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-12 lg:gap-8"
        >
          {/* Full-width Metrics Bar */}
          <motion.div 
            variants={sectionItemVariants}
            className="lg:col-span-12 w-full border border-gray-150 bg-white/80 backdrop-blur-sm py-5 px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center rounded-2xl shadow-xs"
          >
            {[
              { value: '50+', label: 'Enterprise Teams' },
              { value: '10,000+', label: 'Resumes Screened' },
              { value: '6×', label: 'Faster Screening' },
              { value: '90%', label: 'Reduction in Manual Review' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight">{metric.value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={sectionContainerVariants} className="space-y-5 text-left lg:col-span-4">
            <motion.p variants={sectionItemVariants} className="type-caption font-bold text-accent-primary">
              Product Outcomes
            </motion.p>
            <motion.h2 variants={sectionItemVariants} className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
              <TextReveal effect="blur" staggerDelay={0.035}>From 1,247 resumes to 3 finalists.</TextReveal>
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-sm leading-relaxed text-text-secondary font-medium">
              Shortlist top talent with absolute trust. Hiring Wallah replaces blind keyword filters with verified evidence auditing and consensus scoring.
            </motion.p>
          </motion.div>

          <motion.div variants={sectionContainerVariants} className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {featureCards.map((feature, index) => (
              <FeatureReasoningCard key={feature.title} {...feature} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </section>



      {/* SECTION 3: FOR RECRUITERS */}
      <section id="for-recruiters" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 md:py-24 relative overflow-hidden border-b border-border-subtle bg-white">
        <MeshBackground opacity={0.06} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column outcome copy */}
          <motion.div 
            variants={sectionContainerVariants}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="space-y-3">
              <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
                For Recruiters
              </motion.p>
              <motion.h2 variants={sectionItemVariants} className="text-3xl md:text-4xl font-sans font-extrabold text-gray-900 tracking-tight leading-tight">
                <TextReveal effect="slide" staggerDelay={0.04}>See exactly why a candidate was recommended.</TextReveal>
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="text-sm font-semibold text-gray-500">
                Every score. Every assumption. Every decision.
              </motion.p>
              <motion.p variants={sectionItemVariants} className="text-xs text-text-secondary leading-relaxed font-medium">
                Hiring Wallah is not a black box. Each recommendation is backed by a structured reasoning trail from our AI committee. Drill down into individual objections, claim verification facts, and dynamic rubrics.
              </motion.p>
              <motion.div variants={sectionItemVariants}>
                <Link href="/recruiter">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-accent-primary text-white font-sans text-caption font-bold rounded-lg border border-accent-primary cursor-pointer shadow-xs"
                  >
                    Open Recruiter Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column details report mockup */}
          <motion.div 
            variants={sectionItemVariants}
            className="lg:col-span-6 w-full flex items-center justify-center"
          >
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-md relative max-w-md w-full text-left font-sans">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    LG
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 tracking-tight">Lakshya Gupta</h4>
                    <p className="text-[10px] text-gray-500 font-medium">Lead Product Designer</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-indigo-600 tracking-tight">91%</div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Match Score</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verified Evidence (6 Agents Consensus)</div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <div>
                      <span className="font-semibold text-gray-900">Built AI hiring platform</span>
                      <span className="text-gray-400 block text-[9px]">Verified in project portfolio (Page 2)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <div>
                      <span className="font-semibold text-gray-900">Led recruiter onboarding</span>
                      <span className="text-gray-400 block text-[9px]">Verified via previous role history (Page 1)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <div>
                      <span className="font-semibold text-gray-900">Reduced screening time 6×</span>
                      <span className="text-gray-400 block text-[9px]">Verified from metric case studies</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mb-4 border-t border-gray-100 pt-4">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Identified Risks</div>
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                  <div>
                    <span className="font-semibold text-gray-900">Limited PM internship experience</span>
                    <span className="text-gray-400 block text-[9px]">Flagged by Critic Agent (Self-Critique phase)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Consensus Verdict</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">STRONG HIRE</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-gray-400 block">HASH: sha256:7c2e9b1d...</span>
                  <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-1 justify-end font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Committee Sealed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4: FOR CANDIDATES */}
      <section id="for-candidates" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 md:py-24 relative overflow-hidden border-b border-border-subtle bg-slate-50">
        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Panel: Candidate tabs & weights */}
          <motion.div 
            variants={sectionContainerVariants}
            className="lg:col-span-7 space-y-6 w-full text-left"
          >
            <div className="space-y-3">
              <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
                For Candidates
              </motion.p>
              <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-3xl lg:text-4xl font-sans font-extrabold text-gray-900 tracking-tight leading-tight">
                <TextReveal effect="slide" staggerDelay={0.04}>Know your score before recruiters do.</TextReveal>
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="text-sm text-gray-500 font-medium leading-relaxed">
                Upload your resume, run mock evaluations against target roles, identify critical skill gaps, and optimize your application strategy before applying.
              </motion.p>
            </div>

            {/* Step Workflow */}
            <motion.div 
              variants={sectionItemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-gray-150 rounded-xl p-3.5 shadow-xs"
            >
              {[
                { step: '01', title: 'Resume Upload', desc: 'Timeline extraction' },
                { step: '02', title: 'Job Matching', desc: 'Consensus scoring' },
                { step: '03', title: 'Gap Analysis', desc: 'Identify skill leaks' },
                { step: '04', title: 'Prep Strategy', desc: 'Custom interview prep' }
              ].map((s) => (
                <div key={s.step} className="space-y-1 border-l-2 border-indigo-100 pl-3">
                  <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                    {s.step}
                  </div>
                  <h5 className="text-xs font-bold text-gray-900 tracking-tight leading-none">{s.title}</h5>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight">{s.desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={sectionItemVariants}>
              <Link href="/candidate">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-secondary text-white font-sans text-caption font-bold rounded-lg border border-accent-secondary cursor-pointer shadow-xs"
                >
                  Open Candidate Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Candidate Selector Tabs */}
            <motion.div 
              variants={sectionContainerVariants}
              className="flex flex-wrap gap-2 border-b border-border-subtle pb-3"
            >
              {candidatesData.map((c, idx) => (
                <motion.button
                  key={idx}
                  variants={sectionItemVariants}
                  onClick={() => setActiveCandidateIdx(idx)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className={`px-3 py-1.5 rounded-lg border text-caption font-sans font-bold transition-all duration-200 cursor-pointer ${
                    activeCandidateIdx === idx
                      ? 'bg-accent-primary border-accent-primary text-white shadow-xs'
                      : 'bg-bg-surface border-border-subtle text-text-secondary hover:bg-bg-raised hover:text-text-primary'
                  }`}
                >
                  {c.name.split(' ')[0]}
                </motion.button>
              ))}
            </motion.div>

            {/* Active Candidate Info */}
            <motion.div 
              variants={sectionItemVariants}
              className="bg-bg-raised border border-border-subtle rounded-xl p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/50 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-text-primary tracking-tight">{candidate.name}</h4>
                  <p className="type-caption text-accent-primary font-bold mt-0.5">{candidate.role}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-mono bg-bg-surface border border-border-subtle px-2 py-0.5 rounded text-text-secondary">
                    Base Exp: {candidate.expMatch}%
                  </span>
                  <span className="text-[9px] font-mono bg-bg-surface border border-border-subtle px-2 py-0.5 rounded text-text-secondary">
                    Base Skills: {candidate.skillMatch}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {candidate.description}
              </p>

              {candidate.gaps.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="type-caption font-bold text-accent-red">Identified gaps:</span>
                  {candidate.gaps.map((g, i) => (
                    <span key={i} className="type-caption font-bold bg-accent-red/5 border border-accent-red/10 text-accent-red px-2 py-0.5 rounded">
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-accent-green type-caption font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  Zero Skill Gaps Detected
                </div>
              )}
            </motion.div>

            {/* Weight Sliders */}
            <motion.div 
              variants={sectionItemVariants}
              className="space-y-4 pt-2"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between type-label text-[11px] font-bold">
                  <span className="text-text-primary">Experience weight: {expWeight}%</span>
                  <span className="text-text-secondary">Skill alignment weight: {skillWeight}%</span>
                </div>
                
                {/* Single range slider adjusts both to sum to 100% */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={expWeight}
                  onChange={(e) => setExpWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-primary"
                />
              </div>

              <div className="flex justify-between items-center type-caption text-text-tertiary font-bold">
                <span>← Prioritize Tech Stack Match</span>
                <span>Prioritize Career Length →</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel: Gauge and Score */}
          <motion.div 
            variants={sectionItemVariants}
            className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto w-full"
          >
            <span className="type-caption text-text-tertiary font-bold">Consensus match score</span>
            
            {/* Animated Score Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-border-subtle"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-accent-primary"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-extrabold text-text-primary leading-none">
                  <AnimatedScore value={suitabilityScore} />
                </span>
                <span className="type-caption text-text-tertiary font-bold mt-1">Grade</span>
              </div>
            </div>

            {/* Suitability Rating Badge */}
            <div className="w-full">
              {suitabilityScore >= 85 ? (
                <div className="inline-flex items-center gap-1.5 text-accent-green bg-accent-green/5 border border-accent-green/20 px-3 py-1 rounded-full text-caption font-sans font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Excellent Match
                </div>
              ) : suitabilityScore >= 70 ? (
                <div className="inline-flex items-center gap-1.5 text-accent-primary bg-accent-primary/5 border border-accent-primary/20 px-3 py-1 rounded-full text-caption font-sans font-bold">
                  <Check className="w-3.5 h-3.5" />
                  Strong Match
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-accent-amber bg-accent-amber/5 border border-accent-amber/20 px-3 py-1 rounded-full text-caption font-sans font-bold">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Marginal Fit
                </div>
              )}
            </div>

            {/* Contribution details */}
            <div className="w-full border-t border-border-subtle pt-4 space-y-2 text-left font-mono text-[10px] text-text-secondary">
              <div className="flex justify-between">
                <span>Experience Contrib:</span>
                <span className="font-bold text-text-primary">{((candidate.expMatch * expWeight) / 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Skills Contrib:</span>
                <span className="font-bold text-text-primary">{((candidate.skillMatch * skillWeight) / 100).toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: HOW IT WORKS / DECISION FLOW */}
      <section id="how-it-works" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 md:py-24 relative overflow-hidden border-b border-border-subtle bg-white">
        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center space-y-6 md:space-y-8"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
              Decision Protocol
            </motion.p>
            <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-4xl lg:text-5xl font-sans font-extrabold text-gray-900 tracking-tight leading-tight">
              <TextReveal effect="blur" staggerDelay={0.04}>How Hiring Wallah Reaches Decisions</TextReveal>
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-xs md:text-sm text-text-secondary leading-relaxed">
              We replace black-box models with a multi-stage consensus pipeline. Hover a stage to see the underlying reasoning logic.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto"
          >
            <AgentCard 
              title="Requirement Analysis"
              role="Deconstructs natural language JDs into deterministic objective assessment parameters."
              mechanics="Strips marketing buzzwords from job roles, defining hard technical criteria and experience limits."
              icon={Search}
              colorClass="bg-indigo-600"
              borderColorClass="border-indigo-100"
              index={0}
            />

            <AgentCard 
              title="Rubric Strategy"
              role="Determines weight distributions. Establishes a balanced, target evaluation rubric."
              mechanics="Reviews role level and allocates proportion variables (experience vs skill alignment) totalling 100%."
              icon={Sliders}
              colorClass="bg-purple-600"
              borderColorClass="border-purple-100"
              index={1}
            />

            <AgentCard 
              title="Evidence Extraction"
              role="Deconstructs resume formatting, mapping timeline records, projects, and roles."
              mechanics="Forensically extracts plain text from resumes, mapping timestamps and ownership levels."
              icon={Cpu}
              colorClass="bg-emerald-600"
              borderColorClass="border-emerald-100"
              index={2}
            />

            <AgentCard 
              title="Score Evaluation"
              role="Measures candidate experience and proofs directly against Strategist rubric."
              mechanics="Rates applicant project details based on autonomy, assigning quantitative evaluation scores."
              icon={Award}
              colorClass="bg-amber-500"
              borderColorClass="border-amber-100"
              index={3}
            />

            <AgentCard 
              title="Self-Critique & Risks"
              role="Challenges scores, flags inflated claims, unverified statements, and logical gaps."
              mechanics="Cross-checks resume gaps and matches claims with project timelines to temper optimistic scoring."
              icon={ShieldAlert}
              colorClass="bg-rose-500"
              borderColorClass="border-rose-100"
              index={4}
            />

            <AgentCard 
              title="Consensus Verdict"
              role="Aggregates agent scores, conducts consensus voting, and publishes final reports."
              mechanics="Brokers conflict resolution between Evaluator and Advocate, signing off on secure reports."
              icon={Users}
              colorClass="bg-slate-600"
              borderColorClass="border-slate-200"
              index={5}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 6: CTA */}
      <section id="cta" className="snap-section w-full min-h-[calc(100vh-64px)] flex flex-col justify-between pt-16 pb-12 relative overflow-hidden border-b border-border-subtle bg-slate-50">
        <MeshBackground opacity={0.06} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center space-y-8 my-auto"
        >
          <div className="max-w-xl mx-auto space-y-3">
            <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
              Get Started
            </motion.p>
            <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight leading-tight">
              <TextReveal effect="scale" staggerDelay={0.04}>Ready to transform your hiring?</TextReveal>
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Create a free account or sign in to access your recruiter or candidate workspace. No credit card required.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth?mode=signup">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-3.5 bg-accent-primary hover:bg-accent-primary/95 text-white font-sans text-caption font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-accent-primary"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/auth?mode=signin">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-3.5 bg-bg-surface border border-border-subtle hover:bg-bg-raised text-text-secondary hover:text-text-primary font-sans text-caption font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Sign In</span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch pt-4"
          >
            <PortalCard 
              title="Recruiter Workspace"
              description="Define evaluation rubrics, upload multiple resumes, inspect security hashes, and download forensic reports."
              href="/recruiter"
              buttonText="Enter Recruiter Portal"
              icon={Briefcase}
              colorClass="bg-accent-primary"
              borderColorClass="border-accent-primary/20"
            />

            <PortalCard 
              title="Candidate Workspace"
              description="Identify alignment leaks, formatting blocks, verify skill matches, and optimize credentials before applying."
              href="/candidate"
              buttonText="Enter Candidate Portal"
              icon={User}
              colorClass="bg-accent-secondary"
              borderColorClass="border-accent-secondary/20"
            />
          </motion.div>
        </motion.div>

        {/* Clean compact Zoho Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full border-t border-border-subtle bg-bg-surface/50 backdrop-blur-xs py-5 mt-auto relative z-10"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 type-label text-[9px] text-text-tertiary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-accent-primary flex items-center justify-center font-bold text-[10px] text-white">
                W
              </div>
              <span className="font-bold text-text-secondary">Hiring Wallah</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-semibold">
              <Link href="/#how-it-works" className="hover:text-accent-primary transition-apple">Consensus Protocol</Link>
              <Link href="/#for-recruiters" className="hover:text-accent-primary transition-apple">Cryptography Spec</Link>
              <Link href="/auth?mode=signup" className="hover:text-accent-primary transition-apple">Privacy Guidelines</Link>
              <Link href="/#features" className="hover:text-accent-primary transition-apple">Documentation</Link>
            </div>

            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-accent-green">Systems Operational</span>
            </div>
          </div>
        </motion.footer>
      </section>

    </div>
  )
}
