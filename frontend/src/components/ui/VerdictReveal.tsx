'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, CheckCircle2, AlertTriangle, XCircle,
  Search, Sliders, Cpu, Award, ShieldAlert, Users, Quote,
} from 'lucide-react'
import { EASE_SPRING, appleTransition } from '@/lib/motion'
interface VerdictRevealProps {
  verdict: 'Strong Hire' | 'Consider' | 'Reject' | string
  confidence: number
  explanation: string
  jobTitle?: string
}

const agentIcons = [Search, Sliders, Cpu, Award, ShieldAlert, Users]

export default function VerdictReveal({ verdict, confidence, explanation, jobTitle }: VerdictRevealProps) {
  const config = {
    'Strong Hire': {
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.08)',
      icon: CheckCircle2,
      shadow: 'shadow-[0_4px_30px_rgba(16,185,129,0.1)]',
    },
    'Consider': {
      color: '#D97706',
      bgGlow: 'rgba(217, 119, 6, 0.08)',
      icon: AlertTriangle,
      shadow: 'shadow-[0_4px_30px_rgba(217,119,6,0.1)]',
    },
    'Reject': {
      color: '#EF4444',
      bgGlow: 'rgba(239, 68, 68, 0.08)',
      icon: XCircle,
      shadow: 'shadow-[0_4px_30px_rgba(239,68,68,0.1)]',
    },
  }[verdict] || {
    color: '#4F46E5',
    bgGlow: 'rgba(79, 70, 229, 0.08)',
    icon: Sparkles,
    shadow: 'shadow-[0_4px_30px_rgba(79,70,229,0.1)]',
  }

  const agentsList = [
    'Requirement Analyst',
    'Hiring Strategist',
    'Resume Investigator',
    'Candidate Evaluator',
    "Devil's Advocate",
    'Hiring Committee',
  ]

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (confidence / 100) * circumference
  const VerdictIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={appleTransition(0.5)}
      className="flex flex-col items-center justify-center p-8 bg-bg-surface border border-border-subtle rounded-2xl relative overflow-hidden min-h-[450px] w-full group"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle at center, ${config.bgGlow} 0%, transparent 70%)` }}
      />

      {/* Floating decorative icons */}
      <Sparkles className="absolute top-8 left-8 w-5 h-5 text-accent-primary/20 animate-float pointer-events-none" />
      <ShieldAlert className="absolute bottom-12 right-10 w-4 h-4 text-accent-da/20 animate-float-delayed pointer-events-none" />

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8 w-full max-w-2xl relative z-10"
      >
        {agentsList.map((agent, i) => {
          const AgentIcon = agentIcons[i]
          return (
            <motion.div
              key={agent}
              variants={{ hidden: { opacity: 0, y: 12, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
              className="flex flex-col items-center group/agent"
            >
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={appleTransition(0.25)}
                className="w-10 h-10 rounded-full border border-accent-primary/40 bg-bg-deep flex items-center justify-center text-accent-primary cursor-pointer hover:border-accent-primary hover:bg-bg-raised transition-colors duration-300"
              >
                <AgentIcon className="w-4 h-4" />
              </motion.div>
              <span className="type-caption text-text-tertiary text-center mt-1 hidden sm:block transition-colors duration-300 group-hover/agent:text-text-secondary">
                {agent.split(' ')[0]}
              </span>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={appleTransition(0.45, 0.2)}
        whileHover={{ y: -3, boxShadow: `0 16px 32px ${config.bgGlow}` }}
        className={`w-full max-w-lg bg-bg-deep border border-border-subtle rounded-xl p-6 relative z-10 flex flex-col items-center text-center ${config.shadow} hover:border-border-normal transition-colors duration-300`}
      >
        <span className="type-caption text-text-tertiary mb-1">
          Hiring Committee Verdict {jobTitle ? `for ${jobTitle}` : ''}
        </span>

        <div className="h-16 flex items-center justify-center">
          <motion.h2
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASE_SPRING as [number, number, number, number] }}
            className="text-4xl font-display uppercase font-extrabold tracking-tighter flex items-center gap-3"
            style={{ color: config.color }}
          >
            <VerdictIcon className="w-8 h-8" />
            {verdict}
          </motion.h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4 w-full">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="45" className="stroke-bg-surface fill-transparent" strokeWidth="8" />
              <motion.circle
                cx="56"
                cy="56"
                r="45"
                className="fill-transparent"
                stroke={config.color}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset }}
                viewport={{ once: true }}
                transition={appleTransition(0.8, 0.4)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
                className="text-2xl type-mono-score font-bold text-text-primary"
              >
                {confidence}
              </motion.span>
              <span className="text-[10px] text-text-secondary block type-mono-score">Confidence</span>
            </div>
          </div>

          <div className="text-left max-w-xs flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5" style={{ color: config.color }}>
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="p-1.5 rounded-lg border border-border-subtle bg-bg-surface flex items-center justify-center"
              >
                <VerdictIcon className="w-4 h-4" />
              </motion.div>
              <span className="type-label font-semibold">Committee Match</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Calculated from evaluation dimensions, adjusted for {"Devil's"} Advocate adversarial risk warnings.
            </p>
          </div>
        </div>

        <div className="w-full border-t border-border-subtle mt-4 pt-4">
          <div className="flex gap-2 text-sm text-text-secondary leading-relaxed text-left font-sans italic">
            <Quote className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
            <span>&ldquo;{explanation}&rdquo;</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
