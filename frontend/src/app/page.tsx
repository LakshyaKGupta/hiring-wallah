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
  BarChart2,
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
import FloatingIcons from '@/components/ui/FloatingIcons'

const featureCards = [
  {
    title: '6× Faster Screening',
    detail: 'Ingest thousands of resumes, parse credentials, and shortlist top talent in under 5 minutes without manual reading.',
    icon: Zap,
    colorClass: 'text-amber-600',
    bgClass: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
    stat: '600% Speed',
  },
  {
    title: 'Explainable Decisions',
    detail: 'Get a comprehensive written scorecard explaining exactly why every candidate was recommended or skipped.',
    icon: FileText,
    colorClass: 'text-teal-600',
    bgClass: 'bg-gradient-to-br from-teal-50 to-teal-100/50',
    stat: '100% Transparent',
  },
  {
    title: 'Evidence-Based Evaluation',
    detail: 'Verify skills against actual project history, timelines, and role scope, bypassing buzzword keyword packing.',
    icon: CheckCircle2,
    colorClass: 'text-rose-600',
    bgClass: 'bg-gradient-to-br from-rose-50 to-rose-100/50',
    stat: 'Zero Bias',
  },
  {
    title: 'Candidate Intelligence',
    detail: 'Enable candidates to run mock matches, discover skill gaps, and optimize resumes before submitting.',
    icon: Sliders,
    colorClass: 'text-purple-600',
    bgClass: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
    stat: 'Actionable Insights',
  },
] as const

interface AgentCardProps {
  title: string
  role: string
  mechanics: string
  colorClass: string
  borderColorClass: string
  icon: React.ComponentType<{ className?: string }>
  stepNumber: string
}

function AgentCard({ title, role, mechanics, colorClass, borderColorClass, icon: Icon, index = 0, stepNumber }: AgentCardProps & { index?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={sectionItemVariants}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className={`relative bg-white border-l-4 ${borderColorClass} border-y border-r border-y-border-subtle border-r-border-subtle rounded-xl p-6 shadow-sm select-text cursor-pointer flex flex-col justify-between h-full group overflow-hidden`}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={appleTransition(0.35)}
    >
      <div className="absolute top-4 right-4 text-[40px] font-extrabold text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none select-none">
        {stepNumber}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="p-3 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-all duration-300 shadow-sm"
            whileHover={{ scale: 1.05, rotate: 4 }}
          >
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </motion.div>
          <div className="text-xs font-bold text-gray-400 font-mono tracking-widest">{stepNumber}</div>
        </div>

        <h4 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
          {title}
        </h4>

        <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
          {role}
        </p>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Logic Engine</span>
            <motion.span 
              className="text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5"
              animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </motion.span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-gray-600 h-[72px] overflow-hidden relative border border-gray-100">
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="mechanics"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={appleTransition(0.22)}
                  className="text-gray-800 text-[11px] font-medium leading-relaxed"
                >
                  {mechanics}
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="italic text-gray-400 text-[11px] h-full flex items-center"
                >
                  Hover to reveal reasoning protocol...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FeatureReasoningCard({
  title,
  detail,
  icon: Icon,
  colorClass,
  bgClass,
  stat,
  index,
}: {
  title: string
  detail: string
  icon: LucideIcon
  colorClass: string
  bgClass: string
  stat: string
  index: number
}) {
  return (
    <motion.div
      variants={sectionItemVariants}
      className="group relative min-h-[280px] rounded-3xl border border-gray-200/60 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer select-text"
      whileHover={{ y: -8 }}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-60" />

      <div className="relative z-10 flex flex-col h-full gap-6">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-accent-primary shrink-0 shadow-sm">
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 flex items-center gap-2">
            <BarChart2 className={`w-3.5 h-3.5 ${colorClass}`} />
            <span className="text-[10px] font-bold text-gray-600 tracking-wide uppercase">{stat}</span>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 font-medium">
            {detail}
          </p>
        </div>

        {/* Dynamic mockup visual at bottom of card */}
        <div className="mt-auto">
          {index === 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-[10px] text-gray-500">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-900 font-bold">10,000+ Profiles</span>
                <span className="text-accent-primary animate-pulse">Processing...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-accent-primary h-1.5 rounded-full w-[85%]"></div>
              </div>
            </div>
          )}

          {index === 1 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-[10px] text-gray-500">
              <div className="text-gray-900 font-bold border-b border-gray-200 pb-1.5 mb-1.5">DECISION LOG</div>
              <div>Parser: Extracted 5+ years React exp</div>
              <div className="text-emerald-600 font-bold mt-1.5">Verdict: 91% Match (Strong Hire)</div>
            </div>
          )}

          {index === 2 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-[10px] text-gray-600 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Built Go Microservices (Pg 2)
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <AlertOctagon className="w-3.5 h-3.5" /> No direct PM title (Pg 3)
              </div>
            </div>
          )}

          {index === 3 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-[10px] text-gray-600">
              <div className="text-gray-400 mb-2">Target Skill Gap Audit:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-bold">React</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-bold">Node.js</span>
                <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-100 font-bold line-through">Docker</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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

  return <motion.span className="inline-block">{display}</motion.span>
}

const LANDING_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Outcomes' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'how-it-works', label: 'Decision Flow' },
  { id: 'cta', label: 'Get Started' },
] as const

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [workspaceTab, setWorkspaceTab] = useState<'recruiter' | 'candidate'>('recruiter')
  const containerRef = useRef<HTMLDivElement>(null)

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
  const radius = 54
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
      const scrollPosition = window.scrollY + navbarOffset + 120 

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

  return (
    <div ref={containerRef} className="relative w-full bg-white scroll-smooth">
      <ScrollProgress />
      
      {/* SECTION 1: HERO */}
      <section id="hero" className="w-full relative overflow-hidden">
        <HeroConvergenceScene />
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="w-full min-h-screen flex flex-col justify-center py-24 relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <FloatingIcons count={12} />

        <motion.div
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6"
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <motion.div variants={sectionContainerVariants} className="space-y-6 lg:w-1/3 sticky top-32">
              <motion.div variants={sectionItemVariants} className="inline-flex bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                Product Outcomes
              </motion.div>
              <motion.h2 variants={sectionItemVariants} className="font-display text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                <TextReveal effect="blur" staggerDelay={0.035}>From 1,247 resumes to 3 finalists.</TextReveal>
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="text-base leading-relaxed text-gray-500 font-medium">
                Shortlist top talent with absolute trust. Hiring Wallah replaces blind keyword filters with verified evidence auditing and consensus scoring.
              </motion.p>
            </motion.div>

            <motion.div variants={sectionContainerVariants} className="grid sm:grid-cols-2 gap-6 lg:w-2/3">
              {featureCards.map((feature, index) => (
                <FeatureReasoningCard key={feature.title} {...feature} index={index} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: WORKSPACES */}
      <section id="workspaces" className="w-full min-h-screen flex flex-col justify-center py-24 relative overflow-hidden bg-[#F4F4F6] border-b border-gray-200">
        <MeshBackground opacity={0.04} />
        <FloatingIcons count={10} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-16"
        >
          {/* Header & Tabs */}
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <motion.div variants={sectionItemVariants} className="inline-flex bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Workspace Portals
            </motion.div>
            <motion.h2 variants={sectionItemVariants} className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
              Enterprise-Grade Workspaces
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-base text-gray-500 leading-relaxed font-medium max-w-lg mx-auto">
              Explore role alignment, consensus scorecards, and verification trails from both sides of the hiring equation.
            </motion.p>
            
            {/* Sliding Pill Tab Switcher */}
            <motion.div 
              variants={sectionItemVariants}
              className="inline-flex p-1.5 bg-gray-200/50 rounded-2xl relative"
            >
              {(['recruiter', 'candidate'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setWorkspaceTab(tab)}
                  className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-200 z-10 ${
                    workspaceTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {workspaceTab === tab && (
                    <motion.div
                      layoutId="workspace-tab"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="capitalize">{tab} {tab === 'recruiter' ? 'Workspace' : 'Portal'}</span>
                </button>
              ))}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {workspaceTab === 'recruiter' ? (
              <motion.div
                key="recruiter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={appleTransition(0.4)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
                      See exactly why a candidate was recommended.
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed font-medium">
                      Hiring Wallah is not a black box. Each recommendation is backed by a structured reasoning trail from our AI committee. Drill down into individual objections, claim verification facts, and dynamic rubrics.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { num: '01', title: 'Generative Job Descriptions', desc: 'Create tailored rubrics with explicit skill and experience limits.' },
                      { num: '02', title: 'Automated Scheduling', desc: 'Book recruiter & manager interviews in single or bulk batches.' },
                      { num: '03', title: 'Consent & Verification Trails', desc: 'Track signed candidate validation facts cryptographically.' }
                    ].map((item) => (
                      <div key={item.num} className="flex items-start gap-4">
                        <div className="text-sm font-bold text-accent-primary bg-white shadow-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                          {item.num}
                        </div>
                        <div className="pt-1.5">
                          <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/recruiter" className="inline-block pt-4">
                    <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all hover:-translate-y-0.5">
                      Open Recruiter Workspace
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>

                <div className="lg:col-span-7 relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 blur-3xl opacity-50 rounded-[3rem]" />
                  <div className="bg-white border border-gray-200/60 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col h-[500px]">
                    <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      </div>
                      <div className="flex-1 text-center text-xs font-bold text-gray-400 bg-white border border-gray-200 rounded-md py-1 mx-4">recruiter.hiringwallah.com</div>
                    </div>
                    <div className="flex-1 p-8 bg-gray-50/30 overflow-hidden relative">
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                         <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-lg">
                              LG
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Lakshya Gupta</h4>
                              <p className="text-xs text-gray-500 font-medium">Lead Product Designer</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-extrabold text-accent-primary tracking-tight">91%</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Match Score</div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-6">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Verified Evidence (6 Agents)</div>
                            <div className="space-y-3">
                              {[
                                { text: "Built AI hiring platform", sub: "Verified in project portfolio (Page 2)" },
                                { text: "Led recruiter onboarding", sub: "Verified via role history (Page 1)" }
                              ].map((ev, i) => (
                                <div key={i} className="flex gap-3">
                                  <div className="mt-0.5 text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">{ev.text}</div>
                                    <div className="text-xs text-gray-500">{ev.sub}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consensus Verdict</span>
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">STRONG HIRE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={appleTransition(0.4)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                <div className="lg:col-span-6 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
                      Know your score before recruiters do.
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed font-medium">
                      Upload your resume, run mock evaluations against target roles, identify critical skill gaps, and optimize your application strategy before applying.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {candidatesData.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCandidateIdx(idx)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                          activeCandidateIdx === idx
                            ? 'bg-accent-secondary text-white shadow-md hover:bg-accent-secondary/95 hover:-translate-y-0.5'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5 shadow-sm'
                        }`}
                      >
                        {c.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm font-bold text-accent-secondary mt-1">{candidate.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {candidate.description}
                    </p>
                    {candidate.gaps.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs font-bold text-rose-500">Gaps:</span>
                        {candidate.gaps.map((g, i) => (
                          <span key={i} className="text-[11px] font-bold bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-1 rounded-md">
                            {g}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold pt-2">
                        <CheckCircle2 className="w-4 h-4" /> Zero Skill Gaps Detected
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-2 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-900">Experience: {expWeight}%</span>
                      <span className="text-gray-500">Skills: {skillWeight}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={expWeight}
                      onChange={(e) => setExpWeight(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-secondary"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-xl flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Match Score</span>
                  
                  <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="112" cy="112" r={radius} className="stroke-gray-100" strokeWidth="12" fill="transparent" />
                      <motion.circle
                        cx="112"
                        cy="112"
                        r={radius}
                        className="stroke-accent-secondary"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-7xl font-display font-extrabold text-gray-900 leading-none">
                        <AnimatedScore value={suitabilityScore} />
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-xs mx-auto">
                    {suitabilityScore >= 85 ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 py-3 rounded-xl text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5" /> Excellent Match
                      </div>
                    ) : suitabilityScore >= 70 ? (
                      <div className="flex items-center justify-center gap-2 text-accent-secondary bg-accent-secondary/10 border border-accent-secondary/20 py-3 rounded-xl text-sm font-bold">
                        <Check className="w-5 h-5" /> Strong Match
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 py-3 rounded-xl text-sm font-bold">
                        <AlertOctagon className="w-5 h-5" /> Marginal Fit
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="w-full min-h-screen flex flex-col justify-center py-24 relative overflow-hidden bg-white border-b border-gray-100">
        <FloatingIcons count={10} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <motion.div variants={sectionItemVariants} className="inline-flex bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              Decision Protocol
            </motion.div>
            <motion.h2 variants={sectionItemVariants} className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
              <TextReveal effect="blur" staggerDelay={0.04}>How We Reach Decisions</TextReveal>
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-base text-gray-500 leading-relaxed font-medium">
              We replace black-box models with a multi-stage consensus pipeline. Hover a stage to see the underlying reasoning logic.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative"
          >
            {/* Connecting line behind cards */}
            <div className="absolute top-[80px] left-10 right-10 h-0.5 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/30 to-emerald-500/20 hidden lg:block z-0" />

            <AgentCard 
              title="Requirement Analysis"
              role="Deconstructs natural language JDs into deterministic objective assessment parameters."
              mechanics="Strips marketing buzzwords from job roles, defining hard technical criteria and experience limits."
              icon={Search}
              colorClass="text-accent-primary"
              borderColorClass="border-l-accent-primary"
              stepNumber="01"
              index={0}
            />
            <AgentCard 
              title="Rubric Strategy"
              role="Determines weight distributions. Establishes a balanced, target evaluation rubric."
              mechanics="Reviews role level and allocates proportion variables (experience vs skill alignment) totalling 100%."
              icon={Sliders}
              colorClass="text-accent-secondary"
              borderColorClass="border-l-accent-secondary"
              stepNumber="02"
              index={1}
            />
            <AgentCard 
              title="Evidence Extraction"
              role="Deconstructs resume formatting, mapping timeline records, projects, and roles."
              mechanics="Forensically extracts plain text from resumes, mapping timestamps and ownership levels."
              icon={Cpu}
              colorClass="text-emerald-500"
              borderColorClass="border-l-emerald-500"
              stepNumber="03"
              index={2}
            />
            <AgentCard 
              title="Score Evaluation"
              role="Measures candidate experience and proofs directly against Strategist rubric."
              mechanics="Rates applicant project details based on autonomy, assigning quantitative evaluation scores."
              icon={Award}
              colorClass="text-amber-500"
              borderColorClass="border-l-amber-500"
              stepNumber="04"
              index={3}
            />
            <AgentCard 
              title="Self-Critique"
              role="Challenges scores, flags inflated claims, unverified statements, and logical gaps."
              mechanics="Cross-checks resume gaps and matches claims with project timelines to temper optimistic scoring."
              icon={ShieldAlert}
              colorClass="text-rose-500"
              borderColorClass="border-l-rose-500"
              stepNumber="05"
              index={4}
            />
            <AgentCard 
              title="Consensus Verdict"
              role="Aggregates agent scores, conducts consensus voting, and publishes final reports."
              mechanics="Brokers conflict resolution between Evaluator and Advocate, signing off on secure reports."
              icon={Users}
              colorClass="text-slate-500"
              borderColorClass="border-l-slate-400"
              stepNumber="06"
              index={5}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: CTA */}
      <section id="cta" className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-24 relative overflow-hidden bg-white border-t border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.05),transparent_70%)]" />

        <motion.div 
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center relative z-10 space-y-16"
        >
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <motion.h2 variants={sectionItemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight text-gray-900">
              <TextReveal effect="scale" staggerDelay={0.04}>Ready to transform your hiring?</TextReveal>
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-lg text-gray-500 leading-relaxed font-medium">
              Create a free account or sign in to access your workspace. No credit card required.
            </motion.p>
          </div>

          <motion.div 
            variants={sectionItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth?mode=signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-accent-primary text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-[0_8px_16px_rgba(124,58,237,0.2)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/auth?mode=signin">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl flex items-center justify-center cursor-pointer shadow-sm transition-all"
              >
                <span>Sign In</span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8"
          >
            <div className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Briefcase className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Recruiter Workspace</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">Define evaluation rubrics, upload multiple resumes, inspect security hashes, and download forensic reports.</p>
              <Link href="/recruiter" className="text-accent-primary font-bold text-sm flex items-center gap-2 group">
                Enter Recruiter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <User className="w-6 h-6 text-accent-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Candidate Workspace</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">Identify alignment leaks, formatting blocks, verify skill matches, and optimize credentials before applying.</p>
              <Link href="/candidate" className="text-accent-secondary font-bold text-sm flex items-center gap-2 group">
                Enter Candidate Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 bg-gray-50 py-8 mt-auto relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-[14px] text-white">
                W
              </div>
              <span className="text-gray-900">Hiring Wallah</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">Protocol</Link>
              <Link href="/#workspaces" className="hover:text-gray-900 transition-colors">Workspaces</Link>
              <Link href="/auth?mode=signup" className="hover:text-gray-900 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
