'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, User, ShieldAlert, Cpu, Award, ArrowRight, CheckCircle2, ChevronDown, Check, AlertTriangle } from 'lucide-react'
import AgentOrb from '@/components/ui/AgentOrb'

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0)

  // Rotate active agent node every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const pipelineSteps = [
    { name: 'Requirement Analyst', desc: 'Deconstructs job descriptions into MUST-HAVES and implicit criteria.', icon: Cpu },
    { name: 'Hiring Strategist', desc: 'Creates a mathematically balanced scoring framework (rubric = 100%).', icon: Award },
    { name: 'Resume Investigator', desc: 'Forensically scans candidate histories for explicit evidence (not buzzwords).', icon: User },
    { name: 'Candidate Evaluator', desc: 'Calculates dimension scores strictly aligning experience with the rubric.', icon: Award },
    { name: "Devil's Advocate", desc: 'Challenges assumptions, contests weak evidence, and adjusts confidence score.', icon: ShieldAlert },
    { name: 'Hiring Committee', desc: 'Reconciles evaluator reports and advocate critiques for the final verdict.', icon: CheckCircle2 }
  ]

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory scroll-smooth bg-bg-deep relative">
      {/* 3D Wireframe canvas background */}
      <AgentOrb />

      {/* SECTION 1: EDITORIAL HERO */}
      <section className="snap-section flex flex-col justify-center items-center px-6 text-center relative border-b border-border-subtle/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-accent-primary/20 bg-accent-primary/5 text-accent-primary font-mono text-[10px] uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>Autonomous Hiring Committee</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-text-primary leading-[1.05]">
            Decisions backed by <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-da bg-clip-text text-transparent">
              evidence, not keywords.
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            Hiring Wallah is not a resume parser. It is a 6-agent sequential reasoning pipeline that converts hiring requirements into structured evaluations, challenges its own assumptions, and makes defensible committee decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/recruiter" className="group w-full sm:w-auto">
              <div className="px-7 py-3.5 bg-accent-primary text-white rounded-xl font-mono uppercase font-bold text-xs tracking-wider hover:bg-accent-primary/95 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Start Hiring</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link href="/candidate" className="group w-full sm:w-auto">
              <div className="px-7 py-3.5 bg-bg-surface border border-border-subtle text-text-primary rounded-xl font-mono uppercase font-bold text-xs tracking-wider hover:border-accent-primary hover:bg-bg-raised transition-all flex items-center justify-center gap-2 shadow-sm">
                <User className="w-4 h-4 text-text-secondary" />
                <span>Optimize Resume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70">
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CORE PHILOSOPHY */}
      <section className="snap-section flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-bg-raised border-b border-border-subtle/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="space-y-6"
          >
            <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest block font-bold">
              01 / Core Philosophy
            </span>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
              Why keyword screening fails qualified talent.
            </h2>
            
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              Traditional ATS software matches resumes against arbitrary keyword lists. Good candidates are ignored because they use synonyms, while underqualified candidates slip through by keyword stuffing.
            </p>
            
            <div className="space-y-3.5 pt-2">
              {[
                { title: 'Semantic Understanding', desc: 'Our agents read between the lines to comprehend technology ownership.' },
                { title: 'Explicit Evidence Parsing', desc: 'No credit is given for listing skills; we extract achievements and metrics.' },
                { title: 'Adversarial Self-Critique', desc: 'Every score is contested by a Devil\'s Advocate before final consensus.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <span className="text-[10px] text-text-tertiary font-mono uppercase">CV Evidence Scan</span>
              <span className="px-2 py-0.5 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded font-mono text-[9px] uppercase font-bold">Verified</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-bg-raised border border-border-subtle rounded-lg">
                <span className="text-[9px] text-text-tertiary font-mono uppercase block">Candidate Statement</span>
                <p className="text-xs text-text-primary italic mt-1">"Managed high-performance backend APIs using Python and Postgres."</p>
              </div>
              <div className="p-3 bg-accent-secondary/5 border border-accent-secondary/10 rounded-lg space-y-2">
                <span className="text-[9px] text-accent-secondary font-mono uppercase block font-bold">Investigated Evidence</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Ownership Level:</span>
                  <span className="font-bold text-text-primary">Primary (Architecture Design)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Quantified Scale:</span>
                  <span className="font-bold text-accent-secondary">10,000 req/sec, 99.9% Uptime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: THE 6-AGENT PROCESS */}
      <section className="snap-section flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-bg-deep border-b border-border-subtle/50">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest block font-bold mb-2">
              02 / The Agent Chain
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
              6 reasoning agents. 1 consensus verdict.
            </h2>
            <p className="text-xs text-text-secondary mt-2">
              Our backend orchestrates a multi-step audit pipeline to inspect profiles objectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineSteps.map((step, idx) => {
              const isActive = idx === activeStep
              const Icon = step.icon

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col justify-between h-44 ${
                    isActive 
                      ? 'bg-bg-surface border-accent-primary shadow-[0_4px_20px_rgba(79,70,229,0.08)] scale-[1.02]' 
                      : 'bg-bg-surface/50 border-border-subtle opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isActive 
                        ? 'bg-accent-primary/10 border-accent-primary text-accent-primary' 
                        : 'border-border-subtle text-text-tertiary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary">0{idx + 1}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                      {step.name}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: DEVIL'S ADVOCATE CRITIQUE */}
      <section className="snap-section flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-bg-raised border-b border-border-subtle/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2 text-accent-da border-b border-border-subtle pb-4 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Devil's Advocate Audit Log</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-accent-da/5 border border-accent-da/10 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-accent-da uppercase font-mono text-[10px]">Contested Claim</span>
                  <span className="text-text-tertiary font-mono text-[9px]">Confidence: -15%</span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  "Candidate asserts senior leadership in React Native project, but fails to define codebase structure, specific build steps, or native bridge integration details."
                </p>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-accent-amber/5 border border-accent-amber/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-accent-amber shrink-0" />
                <span className="text-text-secondary font-mono text-[10px]">Decision Impact: Score adjusted from 92 to 77.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="space-y-6"
          >
            <span className="text-[10px] font-mono text-accent-da uppercase tracking-widest block font-bold">
              03 / Blind-Spot Audit
            </span>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
              Self-critique builds unshakeable confidence.
            </h2>
            
            <p className="text-sm text-text-secondary leading-relaxed">
              AI models are prone to hallucinating candidate strengths or accepting generic resume statements at face value. To protect accuracy, our system enforces a Devil's Advocate node that actively searches for missing evidence, highlights gaps, and ensures conclusions are completely bulletproof.
            </p>

            <div className="pt-2">
              <div className="px-5 py-3 border border-border-subtle rounded-xl bg-bg-surface flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-text-secondary">Average Confidence Adjustment</span>
                <span className="font-mono font-bold text-accent-da text-sm">-4.2% (Strictness Factor)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION & FOOTER */}
      <section className="snap-section flex flex-col justify-between px-6 pt-24 pb-8 bg-bg-deep relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 my-auto">
          <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest block font-bold">
            04 / Gateway Setup
          </span>

          <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tight leading-none">
            Hire with certainty.<br />
            Apply with strategy.
          </h2>

          <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Create structured positions, score candidates objectively, and configure interview frameworks. Candidate coach reports are completely private and client-encrypted.
          </p>

          <div className="flex justify-center items-center pt-2">
            <Link href="/auth">
              <div className="px-8 py-4 bg-accent-primary text-white rounded-xl font-mono uppercase font-bold text-xs tracking-wider hover:bg-accent-primary/95 transition-all shadow-md flex items-center gap-2">
                <span>Sign Up / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-border-subtle/40 pt-6 text-center">
          <p className="text-[10px] text-text-tertiary font-mono">
            © 2026 Hiring Wallah Inc. Built for objective meritocracy. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  )
}
