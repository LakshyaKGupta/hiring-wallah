'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, User, ShieldAlert, Cpu, Award, ArrowRight, CheckCircle2, ChevronDown, Check, AlertOctagon, Terminal } from 'lucide-react'

export default function LandingPage() {
  const [activeNode, setActiveNode] = useState(0)

  // Rotate through pipeline nodes to show active tips, similar to Zoho's deck highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const pipelineSteps = [
    { title: 'Upload', detail: 'drag & drop PDF resumes', tip: 'Forensic parsing handles multiple files', tone: 'text-accent-primary' },
    { title: 'Parsed', detail: 'text extracted & catalogued', tip: 'No keywords — extracts experience levels', tone: 'text-accent-secondary' },
    { title: 'Weighted', detail: 'dimension rubric = 100%', tip: 'Hiring Strategist balances criteria', tone: 'text-accent-green' },
    { title: 'Scored', detail: 'experience aligned to rubric', tip: 'Candidate Evaluator awards grades', tone: 'text-accent-amber' },
    { title: 'Critiqued', desc: 'assumptions challenged', tip: 'Devil\'s Advocate flags unverified assertions', tone: 'text-accent-red' },
    { title: 'Verdict', detail: 'committee reaches consensus', tip: 'Hiring Committee delivers final report', tone: 'text-accent-secondary' }
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-deep relative font-sans overflow-x-hidden">
      
      {/* SECTION 1: ZOHO-STYLE HERO */}
      <section className="relative py-20 md:py-28 border-b border-border-subtle bg-bg-deep overflow-hidden">
        {/* Zoho Grid backdrop */}
        <div className="absolute inset-0 grid-bg opacity-40 z-0 pointer-events-none" />
        
        {/* Accent glow representing cursor glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-text-primary leading-[1.05]">
              Evaluate Resumes <br />
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                in the Cloud.
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
              Objective, affordable candidate evaluations for your team. Upload from anywhere, pay only for what you use, and make evidence-backed hires.
            </p>

            {/* Zoho Proof Bullet Items */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg">
              {[
                'Extract experience evidence objectively',
                'Zero keyword-stuffing exploits',
                'Full self-critiquing audit trail',
                'Consensus committee verdicts'
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-text-secondary">
                  <span className="w-2 h-2 rounded-full bg-accent-primary shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/recruiter">
                <div className="px-6 py-3 bg-accent-primary hover:bg-accent-primary/95 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-accent-primary">
                  <span>Start Hiring</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link href="/candidate">
                <div className="px-6 py-3 bg-bg-surface border border-border-subtle hover:bg-bg-raised text-text-secondary hover:text-text-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <span>Optimize My Resume</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Zoho Flow pipeline track */}
          <div className="lg:col-span-5 bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <span className="text-[10px] text-text-tertiary font-mono uppercase font-bold tracking-wider">System Pipeline</span>
              <span className="text-[10px] text-accent-primary font-mono font-bold uppercase tracking-wider">Upload → Verdict</span>
            </div>

            {/* Simulated Zoho flow list */}
            <div className="space-y-3 relative">
              {pipelineSteps.map((step, idx) => {
                const isActive = idx === activeNode
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      isActive 
                        ? 'bg-bg-raised border-accent-primary/30 shadow-sm' 
                        : 'bg-bg-surface border-border-subtle/50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-primary animate-pulse' : 'bg-border-subtle'}`} />
                      <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-text-tertiary mt-0.5">
                          {step.detail || 'analyzing criteria'}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-mono text-accent-primary font-bold uppercase tracking-wide bg-accent-primary/5 px-2 py-0.5 border border-accent-primary/10 rounded">
                        {step.tip}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPARATIVE GRID */}
      <section className="py-20 bg-bg-raised border-b border-border-subtle relative">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-[10px] font-mono text-accent-primary uppercase tracking-widest font-bold">
              Objective Meritocracy
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
              Why keyword screening fails qualified talent
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Standard resume parsers estimate fit based on matching keywords. We model deep ownership levels and evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Bad approach */}
            <div className="bg-bg-surface border border-accent-red/20 rounded-2xl p-6 text-left shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent-red/20" />
              <h3 className="font-mono text-xs uppercase text-accent-red font-bold tracking-wider">Traditional ATS Method</h3>
              <h4 className="text-lg font-bold text-text-primary tracking-tight">Keyword-Matching Screening</h4>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-0.5">✕</span>
                  <span>Scans for exact keywords, ignoring candidate context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-0.5">✕</span>
                  <span>Easily cheated by copying and pasting job description text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-red mt-0.5">✕</span>
                  <span>Presents a single raw score without explanation or confidence logs</span>
                </li>
              </ul>
            </div>

            {/* Good approach */}
            <div className="bg-bg-surface border border-accent-green/30 rounded-2xl p-6 text-left shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent-green/30" />
              <h3 className="font-mono text-xs uppercase text-accent-green font-bold tracking-wider">Hiring Wallah Solution</h3>
              <h4 className="text-lg font-bold text-text-primary tracking-tight">Deterministic Evidence Ledger</h4>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-0.5">✓</span>
                  <span>Forensically extracts experience history and ownership scales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-0.5">✓</span>
                  <span>Ignores stuffed buzzwords without matching project proofs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-green mt-0.5">✓</span>
                  <span>Enforces a self-critique loop to verify grading reliability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SYSTEM ARCHITECTURE & LEDGER INTEGRITY */}
      <section className="py-20 bg-bg-deep border-b border-border-subtle relative">
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-[10px] font-mono text-accent-primary uppercase tracking-widest font-bold">
              Ledger Integrity
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
              Every evaluation action is permanently logged
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every analysis step is saved in the database. Gaps, critiques, and scores represent a permanent, verifiable audit trail that you can download as JSON or inspect in the candidate reports.
            </p>
            
            <div className="pt-2">
              <Link href="/auth">
                <div className="px-5 py-3 bg-accent-primary hover:bg-accent-primary/95 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer border border-accent-primary shadow-sm">
                  <span>Sign In to Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* Terminal Window Mockup representing Ledger Panel */}
          <div className="bg-bg-raised border border-border-subtle rounded-2xl shadow-sm overflow-hidden font-mono text-xs">
            <div className="bg-bg-surface border-b border-border-subtle px-4 py-3 flex items-center justify-between">
              <div className="window-dots-container">
                <span className="window-dot bg-[#EF4444]" />
                <span className="window-dot bg-[#F59E0B]" />
                <span className="window-dot bg-[#10B981]" />
              </div>
              <span className="text-[10px] text-text-tertiary uppercase font-bold">committee_audit_log.json</span>
              <Terminal className="w-3.5 h-3.5 text-text-tertiary" />
            </div>

            <div className="p-4 space-y-3 text-[11px] text-text-secondary leading-relaxed overflow-x-auto">
              <div className="border-b border-border-subtle pb-2">
                <span className="text-accent-primary">#48291</span> <span className="text-text-tertiary">hash: a3f2d1e9...</span>
                <p className="text-text-primary font-semibold mt-0.5">Agent 1: Position Must-Haves parsed (FastAPI SDE)</p>
              </div>
              <div className="border-b border-border-subtle pb-2">
                <span className="text-accent-primary">#48292</span> <span className="text-text-tertiary">hash: b7c3e2f1...</span>
                <p className="text-text-primary font-semibold mt-0.5">Agent 3: Resume parsed (Jane_Doe_CV.pdf) - 4 projects identified</p>
              </div>
              <div className="border-b border-border-subtle pb-2">
                <span className="text-accent-primary">#48293</span> <span className="text-accent-da">hash: c9d4f3a2...</span>
                <p className="text-accent-da font-semibold mt-0.5">Agent 5: Devil's Advocate flagged lack of native iOS bridge details</p>
              </div>
              <div>
                <span className="text-accent-green">● Ledgers State:</span> <span className="text-accent-green font-bold">STABLE & VALIDATED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-bg-deep border-t border-border-subtle text-center text-[10px] text-text-tertiary font-mono uppercase tracking-wider">
        © 2026 Hiring Wallah Inc. • System Status: All Systems Operational • Uptime: 99.999%
      </footer>

    </div>
  )
}
