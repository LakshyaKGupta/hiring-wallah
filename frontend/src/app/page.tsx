'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  XCircle,
  AlertOctagon, 
  Terminal, 
  Search, 
  Sliders, 
  Users, 
  Lock, 
  Activity,
  Upload,
  FileSearch,
  Scale,
  Gavel,
  Sparkles,
  Cloud,
  Zap,
} from 'lucide-react'
import { use3DTilt } from '@/hooks/use3DTilt'
import MeshBackground from '@/components/ui/MeshBackground'
import MagneticButton from '@/components/ui/MagneticButton'
import {
  fadeUpContainerVariants as sectionContainerVariants,
  fadeUpItemVariants as sectionItemVariants,
  EASE_OUT,
  appleTransition,
} from '@/lib/motion'

const AgentOrb = dynamic(() => import('@/components/ui/AgentOrb'), { ssr: false })

// Subcomponent: Comparative Analysis card (hover lift only — no 3D tilt)
function ComparativeCard({
  title,
  subtitle,
  items,
  isPositive,
  colorClass,
  borderColorClass
}: {
  title: string
  subtitle: string
  items: string[]
  isPositive: boolean
  colorClass: string
  borderColorClass: string
}) {
  return (
    <motion.div
      variants={sectionItemVariants}
      className={`bg-bg-surface border ${borderColorClass} rounded-2xl p-6 md:p-8 text-left shadow-sm hover:shadow-md select-none cursor-default flex flex-col justify-between h-full relative overflow-hidden`}
      whileHover={{
        y: -6,
        borderColor: isPositive ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorClass}`} />
      
      <div className="space-y-4 relative z-10">
        <span className={`type-caption font-bold flex items-center gap-1.5 ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
          {isPositive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
          {title}
        </span>
        <h4 className="text-lg md:text-xl font-bold text-text-primary tracking-tight">
          {subtitle}
        </h4>
        <ul className="space-y-3 pt-2">
          {items.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={appleTransition(0.35, 0.1 + index * 0.06)}
              className="flex items-start gap-2.5 text-xs text-text-secondary"
            >
              {isPositive ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-green" />
              ) : (
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-red" />
              )}
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Subcomponent: 3D Tilting Card for Agent Committee
interface AgentCardProps {
  title: string
  role: string
  mechanics: string
  colorClass: string
  borderColorClass: string
  icon: React.ComponentType<{ className?: string }>
}

function AgentCard({ title, role, mechanics, colorClass, borderColorClass, icon: Icon }: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={sectionItemVariants}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className={`relative bg-bg-surface border ${borderColorClass} rounded-xl p-5 shadow-sm select-none cursor-pointer flex flex-col justify-between h-full group overflow-hidden`}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 24px rgba(0, 103, 255, 0.08)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={appleTransition(0.35)}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />
      
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-bg-raised border border-border-subtle group-hover:border-accent-primary/30 transition-all duration-300 group-hover:scale-108 group-hover:rotate-6">
            <Icon className="w-5 h-5 text-text-primary group-hover:text-accent-primary transition-colors duration-200" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-text-primary tracking-tight">
              {title}
            </h4>
            <p className="type-caption text-accent-primary font-semibold">
              Agent Module
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          {role}
        </p>
      </div>

      <div className="border-t border-border-subtle pt-3 mt-auto font-mono text-[10px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-text-tertiary uppercase tracking-wider font-bold">Reasoning Logic:</span>
          <span className="text-accent-green bg-accent-green/5 border border-accent-green/15 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">Active</span>
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
        className={`bg-bg-surface border ${borderColorClass} rounded-2xl p-6 md:p-8 text-left shadow-sm cursor-pointer flex flex-col justify-between h-[240px] group relative overflow-hidden`}
        whileHover={{
          y: -6,
          boxShadow: '0 16px 40px rgba(0, 103, 255, 0.1)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={appleTransition(0.35)}
      >
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorClass}`} />
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-bg-raised border border-border-subtle group-hover:border-accent-primary/20 transition-all duration-300 group-hover:scale-108 group-hover:rotate-6">
              <Icon className="w-6 h-6 text-text-primary group-hover:text-accent-primary transition-colors duration-200" />
            </div>
            <h3 className="text-lg md:text-xl font-display font-extrabold text-text-primary tracking-tight group-hover:text-accent-primary transition-colors duration-200">
              {title}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-2 type-label font-bold text-accent-primary">
          <span>{buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
        </div>
      </motion.div>
    </Link>
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
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'for-recruiters', label: 'For Recruiters' },
  { id: 'for-candidates', label: 'For Candidates' },
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
  const [activeNode, setActiveNode] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroTilt = use3DTilt(4)

  // Section 1 Pipeline Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const pipelineSteps = [
    { title: 'Upload', detail: 'Ingest PDF resume files', tip: 'Forensic parser strips formatting limits', icon: Upload },
    { title: 'Parsed', detail: 'Deconstruct timeline & titles', tip: 'No keyword biases — reads project scope', icon: FileSearch },
    { title: 'Weighted', detail: 'Set customized evaluation weights', tip: 'Hiring Strategist balances parameters', icon: Sliders },
    { title: 'Scored', detail: 'Verify accomplishments against JD', tip: 'Candidate Evaluator grades ownership', icon: Scale },
    { title: 'Critiqued', detail: 'Devil\'s Advocate reviews verdicts', tip: 'Challenges scores & catches inflation', icon: Gavel },
    { title: 'Verdict', detail: 'Aggregate committee consensus', tip: 'Generates secure verified ledger trail', icon: CheckCircle2 },
  ]

  // Section 4 Automated Logs Simulation
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
        const nextLines = [...prev, { text: nextLine, timestamp: new Date().toLocaleTimeString() }]
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

  // Navigation handlers
  const scrollToSection = (idx: number) => {
    if (containerRef.current) {
      const sectionHeight = containerRef.current.clientHeight
      containerRef.current.scrollTo({
        top: idx * sectionHeight,
        behavior: 'smooth'
      })
      setActiveSection(idx)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const sectionHeight = e.currentTarget.clientHeight
    if (sectionHeight > 0) {
      const idx = Math.round(scrollTop / sectionHeight)
      if (idx !== activeSection) {
        setActiveSection(idx)
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-64px)] snap-y snap-mandatory overflow-y-auto scroll-smooth relative"
    >
      
      {/* Side Dot Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 bg-white/80 backdrop-blur-md p-3 rounded-full border border-border-subtle shadow-sm">
        {LANDING_SECTIONS.map((section, idx) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(idx)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-3.5 h-3.5 rounded-full cursor-pointer border ${
              activeSection === idx
                ? 'bg-accent-primary border-accent-primary scale-125'
                : 'bg-transparent border-text-tertiary hover:border-accent-primary'
            }`}
            title={section.label}
            aria-label={section.label}
          />
        ))}
      </div>

      {/* SECTION 1: HERO */}
      <section id="hero" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-center py-12 md:py-0 relative overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] pointer-events-none">
          <AgentOrb />
        </div>

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left copy */}
          <motion.div variants={sectionContainerVariants} className="lg:col-span-7 space-y-6 text-left">
            <motion.h1 
              variants={sectionItemVariants}
              className="text-4xl md:text-6xl font-display font-extrabold tracking-tighter text-text-primary leading-[1.1]"
            >
              Evaluate Resumes <br />
              <span className="text-accent-primary">
                in the Cloud.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={sectionItemVariants}
              className="text-sm md:text-base text-text-secondary max-w-xl leading-relaxed"
            >
              Objective, affordable candidate evaluations for your team. Upload from anywhere, pay only for what you use, and make evidence-backed hires without keyword parsing loopholes.
            </motion.p>

            <motion.ul 
              variants={sectionContainerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg"
            >
              {[
                'Extract experience evidence objectively',
                'Zero keyword-stuffing exploits',
                'Full self-critiquing audit trail',
                'Consensus committee verdicts'
              ].map((text, idx) => (
                <motion.li key={idx} variants={sectionItemVariants} className="flex items-center gap-2.5 text-xs text-text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                  <span>{text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              variants={sectionItemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/recruiter">
                <MagneticButton className="btn-glow-primary px-6 py-3 bg-accent-primary hover:bg-accent-primary/95 text-white font-sans text-caption font-bold rounded-lg flex items-center justify-center gap-2 border border-accent-primary">
                  <span>Start Hiring</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </MagneticButton>
              </Link>

              <Link href="/candidate">
                <MagneticButton className="px-6 py-3 bg-bg-surface border border-border-subtle hover:bg-bg-raised text-text-secondary hover:text-text-primary font-sans text-caption font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm">
                  <User className="w-3.5 h-3.5" />
                  <span>Optimize My Resume</span>
                </MagneticButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right interactive panel */}
          <motion.div 
            variants={sectionItemVariants}
            onMouseMove={heroTilt.handleMouseMove}
            onMouseLeave={heroTilt.handleMouseLeave}
            onMouseEnter={heroTilt.handleMouseEnter}
            style={{
              rotateX: heroTilt.rotateX,
              rotateY: heroTilt.rotateY,
              scale: heroTilt.scale,
              transformPerspective: 1200,
              transformStyle: 'preserve-3d',
            }}
            className="tilt-card lg:col-span-5 bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm relative w-full max-w-md mx-auto"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <span className="type-caption text-text-tertiary font-bold flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-accent-primary" />
                System Pipeline
              </span>
              <span className="text-[10px] text-accent-primary type-label font-bold">Upload → Verdict</span>
            </div>

            <motion.div variants={sectionContainerVariants} className="space-y-2.5">
              {pipelineSteps.map((step, idx) => {
                const isActive = idx === activeNode
                const StepIcon = step.icon
                return (
                  <motion.div 
                    key={idx}
                    variants={sectionItemVariants}
                    animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                    transition={appleTransition(0.35)}
                    className={`p-2.5 rounded-xl border transition-all duration-400 flex items-center justify-between ${
                      isActive 
                        ? 'bg-bg-raised border-accent-primary/30 shadow-sm' 
                        : 'bg-bg-surface border-border-subtle/50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={isActive ? { rotate: [0, 8, -8, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                          isActive ? 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary' : 'bg-bg-deep border-border-subtle text-text-tertiary'
                        }`}
                      >
                        <StepIcon className="w-3.5 h-3.5" />
                      </motion.div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary tracking-tight">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-text-tertiary">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] type-label text-accent-primary font-bold bg-accent-primary/5 px-2 py-0.5 border border-accent-primary/10 rounded"
                      >
                        {step.tip}
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-center py-12 md:py-0 relative overflow-hidden bg-bg-raised/45 backdrop-blur-[1px] border-b border-border-subtle">
        
        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center space-y-8 md:space-y-12"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
              Platform Features
            </motion.p>
            <motion.h2 variants={sectionItemVariants} className="text-3xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight">
              Evidence over keywords
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Standard parser algorithms grade fit based on matching keywords. We map verified evidence ledgers instead.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto items-stretch"
          >
            <ComparativeCard 
              title="Traditional ATS Method"
              subtitle="Keyword-Matching Scanner"
              items={[
                "Scans for exact keywords, ignoring candidate context",
                "Easily cheated by copying and pasting job description text",
                "Presents a single raw score without explanation or confidence logs"
              ]}
              isPositive={false}
              colorClass="bg-accent-red"
              borderColorClass="border-accent-red/20"
            />

            <ComparativeCard 
              title="Hiring Wallah Solution"
              subtitle="Deterministic Evidence Ledger"
              items={[
                "Forensically extracts experience history and ownership scales",
                "Ignores stuffed buzzwords without matching project proofs",
                "Enforces a self-critique loop to verify grading reliability"
              ]}
              isPositive={true}
              colorClass="bg-accent-green"
              borderColorClass="border-accent-green/20"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-center py-12 md:py-0 relative overflow-hidden bg-bg-deep border-b border-border-subtle">
        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center space-y-6 md:space-y-8"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
              How It Works
            </motion.p>
            <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight">
              Six agents, one consensus verdict
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Six parallel intelligence modules executing multi-stage evaluation protocols. Hover a card to witness their underlying mechanics.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto"
          >
            <AgentCard 
              title="Requirement Analyst"
              role="Deconstructs natural language JDs into deterministic objective assessment parameters."
              mechanics="Strips marketing buzzwords from job roles, defining hard technical criteria and experience limits."
              icon={Search}
              colorClass="bg-accent-primary"
              borderColorClass="border-accent-primary/20"
            />

            <AgentCard 
              title="Hiring Strategist"
              role="Determines weight distributions. Establishes a balanced, target evaluation rubric."
              mechanics="Reviews role level and allocates proportion variables (experience vs skill alignment) totalling 100%."
              icon={Sliders}
              colorClass="bg-accent-secondary"
              borderColorClass="border-accent-secondary/20"
            />

            <AgentCard 
              title="Resume Parser"
              role="Deconstructs resume formatting, mapping timeline records, projects, and roles."
              mechanics="Forensically extracts plain text from resumes, mapping timestamps and ownership levels."
              icon={Cpu}
              colorClass="bg-accent-green"
              borderColorClass="border-accent-green/20"
            />

            <AgentCard 
              title="Candidate Evaluator"
              role="Measures candidate experience and proofs directly against Strategist rubric."
              mechanics="Rates applicant project details based on autonomy, assigning quantitative evaluation scores."
              icon={Award}
              colorClass="bg-accent-amber"
              borderColorClass="border-accent-amber/20"
            />

            <AgentCard 
              title="Devil's Advocate"
              role="Challenges scores, flags inflated claims, unverified statements, and logical gaps."
              mechanics="Cross-checks resume gaps and matches claims with project timelines to temper optimistic scoring."
              icon={ShieldAlert}
              colorClass="bg-accent-red"
              borderColorClass="border-accent-red/20"
            />

            <AgentCard 
              title="Hiring Committee"
              role="Aggregates agent scores, conducts consensus voting, and publishes final reports."
              mechanics="Brokers conflict resolution between Evaluator and Advocate, signing off on secure reports."
              icon={Users}
              colorClass="bg-slate-500"
              borderColorClass="border-slate-300"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4: FOR RECRUITERS */}
      <section id="for-recruiters" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-center py-12 md:py-0 relative overflow-hidden bg-bg-raised border-b border-border-subtle">
        <MeshBackground opacity={0.2} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column terminal mock */}
          <motion.div variants={sectionItemVariants} className="lg:col-span-7 space-y-4 w-full">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono text-[11px]">
              <div className="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
                <div className="window-dots-container">
                  <span className="window-dot bg-[#EF4444] w-2.5 h-2.5" />
                  <span className="window-dot bg-[#F59E0B] w-2.5 h-2.5" />
                  <span className="window-dot bg-[#10B981] w-2.5 h-2.5" />
                </div>
                <span className="type-label text-slate-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent-primary" />
                  committee_consensus_trail.log
                </span>
                <span className="w-16" />
              </div>

              {/* Log stream panel */}
              <div 
                ref={logContainerRef}
                className="p-4 h-48 overflow-y-auto space-y-2 text-slate-300 border-b border-slate-800 bg-slate-950 scrollbar-thin"
              >
                {logLines.map((lineObj, idx) => {
                  const line = lineObj.text
                  let tone = 'text-slate-300'
                  if (line.startsWith('SYSTEM')) tone = 'text-accent-primary font-bold'
                  else if (line.startsWith('SECURE')) tone = 'text-accent-secondary'
                  else if (line.startsWith('EVALUATOR')) tone = 'text-accent-amber'
                  else if (line.startsWith('DEVILS')) tone = 'text-accent-red font-semibold'
                  else if (line.startsWith('COMMITTEE') || line.startsWith('LEDGER')) tone = 'text-accent-green'

                  return (
                    <div key={idx} className={`${tone} tracking-wide leading-relaxed`}>
                      <span className="text-slate-600 mr-2">[{lineObj.timestamp}]</span>
                      {line}
                    </div>
                  )
                })}
              </div>

              {/* JSON Mock Data output */}
              <div className="p-4 bg-slate-900/60 flex items-center justify-between border-t border-slate-800">
                <div className="space-y-1 w-2/3">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Evaluated Ledger Target</span>
                  <pre className="text-accent-green font-medium text-[10px] overflow-x-auto p-2 bg-slate-950 rounded border border-slate-800">
                    {JSON.stringify(activeJson, null, 2)}
                  </pre>
                </div>
                
                <div className="text-right flex flex-col justify-end items-end h-full pl-4 w-1/3">
                  <span className="text-[9px] type-label font-bold text-slate-500 mb-2">Ledger Health</span>
                  <div className="flex items-center gap-1.5 text-accent-green bg-accent-green/5 border border-accent-green/20 px-2 py-1 rounded font-bold type-label text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    Consensus Verified
                  </div>
                  <span className="text-[9px] text-slate-500 mt-2 font-mono break-all font-semibold">
                    HASH: {activeJson.consensus_score > 0 ? 'sha256:7c2e9b1d...' : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column details */}
          <motion.div 
            variants={sectionContainerVariants}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="space-y-3">
              <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
                For Recruiters
              </motion.p>
              <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
                Hire with forensic-grade audit trails
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Define rubrics, batch-upload resumes, and inspect every agent decision in real time. Download consensus reports with cryptographic hashes for compliance and stakeholder review.
              </motion.p>
              <motion.div variants={sectionItemVariants}>
                <Link href="/recruiter">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-accent-primary text-white font-sans text-caption font-bold rounded-lg border border-accent-primary cursor-pointer"
                  >
                    Open Recruiter Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            </div>

            <motion.div 
              variants={sectionContainerVariants}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'SSL/TLS Gateway', status: 'SECURE HANDSHAKE', icon: Lock },
                { label: 'Consensus Sign-Off', status: '6/6 VERIFIED', icon: CheckCircle2 },
                { label: 'Database Ledgers', status: 'SQLITE STABLE', icon: Activity },
                { label: 'Audit Protections', status: 'ANONYMIZED', icon: ShieldAlert }
              ].map((item, idx) => (
                <motion.div key={idx} variants={sectionItemVariants} className="p-3 bg-bg-surface border border-border-subtle rounded-xl flex items-center gap-3 shadow-xs">
                  <item.icon className="w-5 h-5 text-accent-green shrink-0" />
                  <div>
                    <h5 className="type-caption text-text-tertiary font-bold">{item.label}</h5>
                    <p className="text-[10px] font-mono font-bold text-text-primary">{item.status}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: FOR CANDIDATES */}
      <section id="for-candidates" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-center py-12 md:py-0 relative overflow-hidden bg-bg-deep border-b border-border-subtle">
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
            <div className="space-y-2">
              <motion.p variants={sectionItemVariants} className="type-caption text-accent-primary font-bold">
                For Candidates
              </motion.p>
              <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
                See how recruiters will score you
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="text-xs text-text-secondary">
                Upload your resume, target a role, and preview your alignment score before you apply. Adjust weight priorities to understand where your profile shines and where to improve.
              </motion.p>
              <motion.div variants={sectionItemVariants}>
                <Link href="/candidate">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 bg-accent-secondary text-white font-sans text-caption font-bold rounded-lg border border-accent-secondary cursor-pointer"
                  >
                    Open Candidate Portal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            </div>

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

      {/* SECTION 6: CTA */}
      <section id="cta" className="snap-section w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] snap-start snap-always flex flex-col justify-between pt-16 pb-6 relative overflow-hidden bg-bg-raised border-b border-border-subtle">
        <MeshBackground opacity={0.2} />

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
            <motion.h2 variants={sectionItemVariants} className="text-2xl md:text-4xl font-display font-extrabold text-text-primary tracking-tight">
              Ready to transform your hiring?
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
              <a href="#" className="hover:text-accent-primary transition-apple">Consensus Protocol</a>
              <a href="#" className="hover:text-accent-primary transition-apple">Cryptography Spec</a>
              <a href="#" className="hover:text-accent-primary transition-apple">Privacy Guidelines</a>
              <a href="#" className="hover:text-accent-primary transition-apple">Documentation</a>
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
