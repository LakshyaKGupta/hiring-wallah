'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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
  Search, 
  Sliders, 
  Users, 
  Zap,
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
import ScrollProgress from '@/components/ui/ScrollProgress'
import { HeroConvergenceScene } from '@/components/3d/HeroConvergenceScene'
import FloatingIcons from '@/components/ui/FloatingIcons'

const featureCards = [
  {
    title: '6× Faster Screening',
    detail: 'Ingest thousands of resumes, parse credentials, and shortlist top talent in under 5 minutes without manual reading.',
    icon: Zap,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    stat: '6x faster',
  },
  {
    title: 'Explainable Decisions',
    detail: 'Get a comprehensive written scorecard explaining exactly why every candidate was recommended or skipped.',
    icon: FileText,
    colorClass: 'text-slate-700',
    bgClass: 'bg-slate-50',
    stat: 'Full trail',
  },
  {
    title: 'Evidence-Based Evaluation',
    detail: 'Verify skills against actual project history, timelines, and role scope, bypassing buzzword keyword packing.',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    stat: 'Verified',
  },
  {
    title: 'Candidate Intelligence',
    detail: 'Enable candidates to run mock matches, discover skill gaps, and optimize resumes before submitting.',
    icon: Sliders,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
  stat: 'Actionable',
  },
] as const

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
      className="group grid gap-4 border-b border-slate-200 px-5 py-5 last:border-b-0 md:grid-cols-[56px_1fr_auto] md:items-center md:px-7"
      whileHover={{ x: 4 }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgClass} border border-gray-100`}>
        <Icon className={`h-5 w-5 ${colorClass}`} strokeWidth={2} />
      </div>
      <div>
        <div className="mb-1 flex items-center gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{title}</h3>
          <span className="hidden rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-500 sm:inline-flex">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-gray-500">{detail}</p>
      </div>
      <div className="justify-self-start rounded-full border border-slate-200 bg-white/75 px-3 py-1.5 text-xs font-extrabold text-slate-700 md:justify-self-end">
        {stat}
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

  useEffect(() => {
    const scrollToHash = () => {
      const sectionId = window.location.hash.replace('#', '')
      if (!sectionId) return
      if (sectionId === 'hero') {
        window.history.replaceState(null, '', window.location.pathname)
        return
      }

      window.requestAnimationFrame(() => {
        const element = document.getElementById(sectionId)
        if (!element) return

        const targetTop = Math.max(0, element.offsetTop - 64)
        document.documentElement.scrollTop = targetTop
        document.body.scrollTop = targetTop
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        })
        window.history.replaceState(null, '', window.location.pathname)
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
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
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname)
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
      <section id="hero" className="w-full relative overflow-hidden scroll-mt-16">
        <HeroConvergenceScene />
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 lg:py-20 relative overflow-hidden bg-white scroll-mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#f7f8fb]" />
        <FloatingIcons count={5} />

        <motion.div
          variants={sectionContainerVariants}
          initial="show"
          animate="show"
          className="relative z-10 mx-auto w-full max-w-7xl px-6"
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            <motion.div variants={sectionContainerVariants} className="space-y-5 lg:w-1/3">
              <motion.div variants={sectionItemVariants} className="inline-flex bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                Product Outcomes
              </motion.div>
              <motion.h2 variants={sectionItemVariants} className="outcome-headline-motion font-display text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                From 1,247 resumes to 3 finalists.
              </motion.h2>
              <motion.p variants={sectionItemVariants} className="outcome-copy-motion text-base leading-relaxed text-gray-500 font-medium">
                Shortlist top talent with absolute trust. Hiring Wallah replaces blind keyword filters with verified evidence auditing and consensus scoring.
              </motion.p>
              <motion.div
                variants={sectionItemVariants}
                className="outcome-ribbon relative overflow-hidden border-y border-slate-200 bg-white/70 px-3 py-2 text-xs font-extrabold tracking-wide text-slate-600"
              >
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span>Parse</span>
                  <span className="h-px w-8 bg-slate-300" />
                  <span>Verify</span>
                  <span className="h-px w-8 bg-slate-300" />
                  <span>Rank</span>
                  <span className="h-px w-8 bg-slate-300" />
                  <span>Sign</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={sectionContainerVariants} className="lg:w-2/3">
              <div className="overflow-hidden border-y border-slate-200 bg-white/50 backdrop-blur">
              {featureCards.map((feature, index) => (
                <FeatureReasoningCard key={feature.title} {...feature} index={index} />
              ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: WORKSPACES */}
      <section id="workspaces" className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 lg:py-20 relative overflow-hidden bg-[#f7f8fb] scroll-mt-16">
        <MeshBackground opacity={0.04} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        <FloatingIcons count={4} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="show"
          animate="show"
          className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-8 lg:space-y-10"
        >
          {/* Header & Tabs */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div variants={sectionItemVariants} className="inline-flex bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
                      See exactly why a candidate was recommended.
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed font-medium">
                      Hiring Wallah is not a black box. Each recommendation is backed by a structured reasoning trail from our AI committee. Drill down into individual objections, claim verification facts, and dynamic rubrics.
                    </p>
                  </div>

                  <div className="space-y-4">
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
                  <div className="bg-white/70 border-y border-gray-200/70 overflow-hidden relative z-10 flex min-h-[420px] flex-col backdrop-blur">
                    <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      </div>
                      <div className="flex-1 text-center text-xs font-bold text-gray-400 bg-white border border-gray-200 rounded-md py-1 mx-4">recruiter.hiringwallah.com</div>
                    </div>
                    <div className="flex-1 p-8 bg-gray-50/30 overflow-hidden relative">
                      <div className="bg-white/70 border-l border-gray-200 p-6 h-full flex flex-col">
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
                            <div className="mt-1 text-[10px] font-bold tracking-wide text-gray-400">Match score</div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-6">
                          <div>
                            <div className="mb-3 text-[10px] font-bold tracking-wide text-gray-400">Verified evidence, 6 agents</div>
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
                              <span className="text-[10px] font-bold tracking-wide text-gray-400">Consensus verdict</span>
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              >
                <div className="lg:col-span-6 space-y-6">
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
                            ? 'bg-accent-secondary text-white hover:bg-accent-secondary/95 hover:-translate-y-0.5'
                            : 'bg-white/70 border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 hover:-translate-y-0.5'
                        }`}
                      >
                        {c.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/70 border-l border-gray-200 p-6 space-y-4">
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

                  <div className="space-y-4 pt-2 bg-white/70 border-l border-gray-200 p-5">
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

                <div className="lg:col-span-6 bg-white/70 border-y border-gray-200 p-10 md:p-12 flex flex-col items-center justify-center text-center backdrop-blur">
                  <span className="mb-10 text-sm font-bold tracking-wide text-gray-400">Match score</span>
                  
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
      <section id="how-it-works" className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 lg:py-20 relative overflow-hidden bg-white scroll-mt-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
        <FloatingIcons count={4} />

        <motion.div 
          variants={sectionContainerVariants}
          initial="show"
          animate="show"
          className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-8 lg:space-y-10"
        >
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <motion.div variants={sectionItemVariants} className="inline-flex bg-gray-100 border border-gray-200 text-gray-600 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
              Decision Protocol
            </motion.div>
            <motion.h2 variants={sectionItemVariants} className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight leading-tight">
              How We Reach Decisions
            </motion.h2>
            <motion.p variants={sectionItemVariants} className="text-base text-gray-500 leading-relaxed font-medium">
              We replace black-box models with a multi-stage consensus pipeline. Hover a stage to see the underlying reasoning logic.
            </motion.p>
          </div>

          <motion.div
            variants={sectionContainerVariants}
            className="mx-auto max-w-5xl border-y border-slate-200 bg-white/55 backdrop-blur"
          >
            {[
              { num: '01', title: 'Requirement Analysis', role: 'Deconstructs natural language JDs into deterministic assessment parameters.', icon: Search, colorClass: 'text-accent-primary' },
              { num: '02', title: 'Rubric Strategy', role: 'Sets weight distributions for experience, skills, proof quality, and role level.', icon: Sliders, colorClass: 'text-accent-secondary' },
              { num: '03', title: 'Evidence Extraction', role: 'Maps resume timelines, projects, claims, and ownership signals into reviewable evidence.', icon: Cpu, colorClass: 'text-emerald-500' },
              { num: '04', title: 'Score Evaluation', role: 'Scores candidates directly against the rubric instead of keyword density.', icon: Award, colorClass: 'text-amber-500' },
              { num: '05', title: 'Self-Critique', role: 'Challenges inflated claims, missing proofs, timeline gaps, and unsupported assumptions.', icon: ShieldAlert, colorClass: 'text-rose-500' },
              { num: '06', title: 'Consensus Verdict', role: 'Publishes a signed recommendation with disagreements and confidence visible.', icon: Users, colorClass: 'text-slate-500' },
            ].map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  variants={sectionItemVariants}
                  className="grid gap-4 border-b border-slate-200 px-5 py-5 transition-all duration-300 hover:translate-x-1 hover:bg-white/70 last:border-b-0 md:grid-cols-[72px_1fr_52px] md:items-center md:px-7"
                >
                  <div className="text-sm font-black tracking-tight text-slate-400">{step.num}</div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">{step.title}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{step.role}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <Icon className={`h-5 w-5 ${step.colorClass}`} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: CTA */}
      <section id="cta" className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center py-16 lg:py-20 relative overflow-hidden bg-white scroll-mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.05),transparent_70%)]" />

        <motion.div 
          variants={sectionContainerVariants}
          initial="show"
          animate="show"
          className="max-w-7xl mx-auto px-6 w-full flex flex-col justify-center relative z-10 space-y-8 lg:space-y-10"
        >
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <motion.h2 variants={sectionItemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight text-gray-900">
              Ready to transform your hiring?
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
                className="px-10 py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/auth?mode=signin">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white/70 border border-gray-200 hover:bg-white text-gray-900 font-bold rounded-xl flex items-center justify-center cursor-pointer transition-all"
              >
                <span>Sign In</span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            variants={sectionContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/60 border-l border-gray-200 p-8 transition-all duration-300 hover:bg-white/85">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-accent-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Recruiter Workspace</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">Define evaluation rubrics, upload multiple resumes, inspect security hashes, and download forensic reports.</p>
              <Link href="/recruiter" className="text-accent-primary font-bold text-sm flex items-center gap-2 group">
                Enter Recruiter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="bg-white/60 border-l border-gray-200 p-8 transition-all duration-300 hover:bg-white/85">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
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

      </section>
    </div>
  )
}
