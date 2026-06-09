'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, User, ShieldAlert, Cpu, Award, ArrowRight, CheckCircle2 } from 'lucide-react'
import AgentOrb from '@/components/ui/AgentOrb'

export default function LandingPage() {
  const [pipelineActiveIndex, setPipelineActiveIndex] = useState(0)

  // Rotate through pipeline steps every 1.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineActiveIndex((prev) => (prev + 1) % 6)
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  const pipelineSteps = [
    { name: 'Requirement Analyst', role: 'Deconstructs job description into must-haves & red flags', icon: Cpu },
    { name: 'Hiring Strategist', role: 'Creates a weighted rubric framework summing to 100%', icon: Award },
    { name: 'Resume Investigator', role: 'Forensically extracts explicit evidence (not keywords)', icon: User },
    { name: 'Candidate Evaluator', role: 'Scores profiles strictly against the weighted criteria', icon: Award },
    { name: "Devil's Advocate", role: 'Adversarially critiques scores and adjusts confidence', icon: ShieldAlert },
    { name: 'Hiring Committee', role: 'Reconciles report vs critique for a final verdict', icon: CheckCircle2 }
  ]

  return (
    <div className="relative min-h-screen bg-bg-deep overflow-hidden flex flex-col font-sans">
      
      {/* 3D background */}
      <AgentOrb />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center font-display font-bold text-lg text-bg-deep shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            W
          </div>
          <span className="font-display font-bold text-xl text-text-primary tracking-wide">
            Hiring Wallah
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/recruiter" 
            className="text-sm font-mono uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors"
          >
            Recruiters
          </Link>
          <Link 
            href="/candidate" 
            className="text-sm font-mono uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors"
          >
            Candidates
          </Link>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
        
        {/* Title and Headlines */}
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-primary/20 bg-accent-primary/5 text-accent-primary font-mono text-xs uppercase tracking-wider mb-5"
          >
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>Autonomous 6-Agent Reasoning System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary mb-6 leading-none"
          >
            Your AI Hiring Committee.<br />
            <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-da bg-clip-text text-transparent">
              Always On. Never Biased.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-lg text-text-secondary leading-relaxed max-w-xl"
          >
            Hiring Wallah is not a resume scorer. It is a multi-agent system that converts requirements into weighted rubrics, forensically extracts evidence, and challenges its own conclusions to make defensible, transparent decisions.
          </motion.p>
        </div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          {/* Recruiter CTA */}
          <Link href="/recruiter" className="group">
            <div className="px-8 py-4 bg-accent-primary text-bg-deep rounded-xl font-mono uppercase font-bold tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Start Hiring</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Candidate CTA */}
          <Link href="/candidate" className="group">
            <div className="px-8 py-4 bg-bg-surface border border-border-subtle text-text-primary rounded-xl font-mono uppercase font-bold tracking-wider hover:border-accent-primary hover:bg-bg-raised transition-all flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <span>Analyze Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Below fold: Animated Agent Pipeline Visualizer */}
        <div className="border-t border-border-subtle/50 pt-10">
          <h2 className="text-xs uppercase tracking-widest text-text-tertiary font-mono mb-8 text-center sm:text-left">
            The 6-Agent Decision Chain
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {pipelineSteps.map((step, index) => {
              const isActive = index === pipelineActiveIndex
              const isPast = index < pipelineActiveIndex
              const StepIcon = step.icon

              return (
                <div
                  key={step.name}
                  className={`border rounded-xl p-4 transition-all duration-500 relative flex flex-col justify-between ${
                    isActive 
                      ? 'border-accent-primary bg-accent-primary/5 shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.03]' 
                      : 'border-border-subtle bg-bg-surface/50'
                  }`}
                >
                  {/* Connection arrow for desktop */}
                  {index < 5 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-border-subtle">
                      <ArrowRight className={`w-6 h-6 ${isActive ? 'text-accent-primary animate-pulse' : 'text-border-subtle'}`} />
                    </div>
                  )}

                  <div>
                    {/* Node status index indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono font-bold text-xs mb-3 ${
                      isActive 
                        ? 'bg-accent-primary text-bg-deep border-accent-primary' 
                        : isPast 
                          ? 'border-accent-primary text-accent-primary' 
                          : 'border-border-subtle text-text-tertiary'
                    }`}>
                      {index + 1}
                    </div>

                    <h3 className={`font-sans font-bold text-sm leading-snug mb-1 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {step.name}
                    </h3>
                  </div>

                  <p className="text-xs text-text-tertiary font-sans mt-2 leading-relaxed">
                    {step.role}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle/30 py-6 text-center text-xs text-text-tertiary font-mono relative z-10">
        © 2026 Hiring Wallah Inc. All reasoning logs are client-encrypted.
      </footer>

    </div>
  )
}
