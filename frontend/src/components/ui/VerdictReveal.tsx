'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface VerdictRevealProps {
  verdict: 'Strong Hire' | 'Consider' | 'Reject' | string
  confidence: number
  explanation: string
  jobTitle?: string
}

export default function VerdictReveal({ verdict, confidence, explanation, jobTitle }: VerdictRevealProps) {
  const [stage, setStage] = useState(0)
  const [displayPercent, setDisplayPercent] = useState(0)

  // Verdict design configuration
  const config = {
    'Strong Hire': {
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.08)',
      icon: CheckCircle2,
      shadow: 'shadow-[0_4px_30px_rgba(16,185,129,0.1)]'
    },
    'Consider': {
      color: '#D97706',
      bgGlow: 'rgba(217, 119, 6, 0.08)',
      icon: AlertTriangle,
      shadow: 'shadow-[0_4px_30px_rgba(217,119,6,0.1)]'
    },
    'Reject': {
      color: '#EF4444',
      bgGlow: 'rgba(239, 68, 68, 0.08)',
      icon: XCircle,
      shadow: 'shadow-[0_4px_30px_rgba(239,68,68,0.1)]'
    }
  }[verdict] || {
    color: '#4F46E5',
    bgGlow: 'rgba(79, 70, 229, 0.08)',
    icon: Sparkles,
    shadow: 'shadow-[0_4px_30px_rgba(79,70,229,0.1)]'
  }

  useEffect(() => {
    // 1. All 6 nodes light up
    const t1 = setTimeout(() => setStage(1), 800)
    // 2. Expand glow ring
    const t2 = setTimeout(() => setStage(2), 1600)
    // 3. Verdict types in
    const t3 = setTimeout(() => setStage(3), 2200)
    // 4. Fill confidence ring and start percent count-up
    const t4 = setTimeout(() => setStage(4), 3000)
    // 5. Fade in description text
    const t5 = setTimeout(() => setStage(5), 4200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  // Percent count up timer
  useEffect(() => {
    if (stage >= 4) {
      let current = 0
      const increment = Math.ceil(confidence / 40)
      const timer = setInterval(() => {
        current += increment
        if (current >= confidence) {
          setDisplayPercent(confidence)
          clearInterval(timer)
        } else {
          setDisplayPercent(current)
        }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [stage, confidence])

  const agentsList = [
    'Requirement Analyst',
    'Hiring Strategist',
    'Resume Investigator',
    'Candidate Evaluator',
    "Devil's Advocate",
    'Hiring Committee'
  ]

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-bg-surface border border-border-subtle rounded-2xl relative overflow-hidden min-h-[450px]">
      
      {/* Background active glow grid */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${config.bgGlow} 0%, transparent 70%)`
        }}
      />

      {/* Stage 0/1: Agent nodes glowing */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8 w-full max-w-2xl relative z-10">
        {agentsList.map((agent, i) => (
          <div key={agent} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{
                scale: stage >= 1 ? 1.05 : 0.9,
                opacity: stage >= 1 ? 1 : 0.4,
                boxShadow: stage >= 1 ? '0 0 15px rgba(79, 70, 229, 0.2)' : 'none',
                borderColor: stage >= 1 ? '#4F46E5' : 'var(--color-border-subtle)'
              }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="w-10 h-10 rounded-full border bg-bg-deep flex items-center justify-center text-accent-primary"
            >
              <span className="text-xs font-mono">{i + 1}</span>
            </motion.div>
            <span className="text-[10px] text-text-tertiary text-center mt-1 font-mono uppercase tracking-wider hidden sm:block">
              {agent.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Stage 2: Glow Ring expansion */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full border-2 border-accent-primary pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Decision Card pop-up */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: stage >= 3 ? 1 : 0,
          y: stage >= 3 ? 0 : 30
        }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-lg bg-bg-deep border border-border-subtle rounded-xl p-6 relative z-10 flex flex-col items-center text-center ${stage >= 4 ? config.shadow : ''} transition-all duration-700`}
      >
        <span className="text-xs uppercase tracking-widest text-text-tertiary font-mono mb-1">
          Hiring Committee Verdict {jobTitle ? `for ${jobTitle}` : ''}
        </span>

        {/* Verdict typewriter reveal */}
        <div className="h-16 flex items-center justify-center">
          {stage >= 3 && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-4xl font-display uppercase font-bold tracking-wide"
              style={{ color: config.color }}
            >
              {verdict.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: i * 0.08 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
          )}
        </div>

        {/* Confidence Progress Ring & Percent */}
        <div className="flex items-center justify-center gap-6 my-4">
          {stage >= 4 && (
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Track */}
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-bg-surface fill-transparent"
                  strokeWidth="8"
                />
                {/* Progress */}
                <motion.circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="fill-transparent"
                  stroke={config.color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-mono font-bold text-text-primary">
                  {displayPercent}
                </span>
                <span className="text-[10px] text-text-secondary block font-mono">
                  CONFIDENCE
                </span>
              </div>
            </div>
          )}

          {stage >= 4 && (
            <div className="text-left max-w-xs flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1" style={{ color: config.color }}>
                <config.icon className="w-5 h-5" />
                <span className="font-mono text-sm font-semibold uppercase tracking-wider">
                  Committee Match
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Calculated from evaluation dimensions, adjusted for Devil's Advocate adversarial risk warnings.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Explanation */}
        <div className="w-full border-t border-border-subtle mt-4 pt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 5 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm text-text-secondary leading-relaxed text-left font-sans italic"
          >
            &ldquo;{explanation}&rdquo;
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
