'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, AlertTriangle, ShieldCheck, ChevronDown, Scale, FileWarning } from 'lucide-react'
import { appleTransition } from '@/lib/motion'
interface Claim {
  original_claim: string
  counter: string
  severity: 'low' | 'medium' | 'high' | string
}

interface DAPanelProps {
  claims: Claim[]
  riskFactors: string[]
  confidenceAdjustment: number
  recommendation: string
}

export default function DAPanel({ claims, riskFactors, confidenceAdjustment, recommendation }: DAPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-accent-red border-accent-red/20 bg-accent-red/5'
      case 'medium': return 'text-accent-amber border-accent-amber/20 bg-accent-amber/5'
      default: return 'text-text-secondary border-border-subtle bg-bg-surface'
    }
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={appleTransition(0.4)}
      whileHover={{ boxShadow: '0 12px 32px rgba(155, 35, 53, 0.06)' }}
      className="border border-accent-da/30 bg-bg-surface rounded-xl p-5 relative overflow-hidden shadow-sm transition-shadow duration-300"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-da/10 to-transparent rounded-bl-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between border-b border-accent-da/20 pb-4 mb-4"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={appleTransition(0.25)}
            className="p-1.5 rounded-lg border border-accent-da/20 bg-accent-da/5 text-accent-da"
          >
            <AlertOctagon className="w-5 h-5 text-accent-da animate-pulse" />
          </motion.div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-text-primary tracking-tight">
              DEVIL&apos;S ADVOCATE REPORT
            </h3>
            <span className="text-[10px] text-accent-da type-label font-bold animate-pulse">
              ● Contested analysis active
            </span>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={appleTransition(0.35, 0.15)}
          className="text-right"
        >
          <span className="text-xl type-mono font-bold text-accent-da">{confidenceAdjustment} pts</span>
          <span className="text-[9px] text-text-tertiary block type-caption">Conf adjustment</span>
        </motion.div>
      </motion.div>

      <motion.div
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -2, borderColor: 'var(--color-accent-da)' }}
          className="bg-bg-deep border border-border-subtle p-3 rounded-lg transition-all duration-300"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Scale className="w-3 h-3 text-accent-da" />
            <span className="text-[9px] text-text-tertiary type-caption">DA recommendation</span>
          </div>
          <span className={`text-xs type-label font-bold ${recommendation.toLowerCase() === 'approve' ? 'text-accent-green' : 'text-accent-da'}`}>
            {recommendation}
          </span>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -2 }}
          className="bg-bg-deep border border-border-subtle p-3 rounded-lg transition-all duration-300"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <FileWarning className="w-3 h-3 text-accent-amber" />
            <span className="text-[9px] text-text-tertiary type-caption">Contested points</span>
          </div>
          <span className="text-xs type-label font-bold text-text-primary">{claims.length} claims detected</span>
        </motion.div>
      </motion.div>

      <div className="space-y-3">
        <span className="type-label block">
          Challenged Rubric Claims
        </span>

        {claims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-accent-green border border-accent-green/20 bg-accent-green/5 p-3 rounded-lg"
          >
            <div className="p-0.5 rounded bg-accent-green/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>No claims were contested. Evaluator claims are fully evidence-backed.</span>
          </motion.div>
        ) : (
          claims.map((claim, idx) => {
            const isExpanded = expandedIndex === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={appleTransition(0.35, idx * 0.06)}
                className={`border rounded-lg bg-bg-deep transition-all duration-400 ${isExpanded ? 'border-accent-da/50 shadow-sm' : 'border-border-subtle'}`}
              >
                <motion.div
                  onClick={() => toggleExpand(idx)}
                  whileHover={{ backgroundColor: 'var(--color-bg-raised)' }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-between p-3 cursor-pointer transition-colors duration-300"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] type-label border ${getSeverityColor(claim.severity)}`}>
                      {claim.severity}
                    </span>
                    <p className="text-xs font-semibold text-text-primary truncate font-sans">{claim.original_claim}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={appleTransition(0.3)}
                    className="w-6 h-6 rounded border border-border-subtle bg-bg-deep flex items-center justify-center text-text-tertiary"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={appleTransition(0.35)}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-border-subtle/50 bg-bg-raised text-xs space-y-2.5">
                        <div>
                          <span className="text-[9px] text-text-tertiary type-caption block mb-0.5">Original evaluator claim</span>
                          <p className="text-text-secondary leading-relaxed font-sans">{claim.original_claim}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-accent-da type-caption block mb-0.5">Devil&apos;s advocate counter-evidence</span>
                          <p className="text-text-primary leading-relaxed font-sans font-medium">{claim.counter}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>

      {riskFactors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-5 border-t border-border-subtle/50 pt-4"
        >
          <span className="type-label block mb-2">
            Critical Risk Factors
          </span>
          <ul className="space-y-1.5">
            {riskFactors.map((risk, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-2 text-xs text-text-secondary group"
              >
                <div className="p-0.5 rounded bg-accent-da/10 text-accent-da shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span>{risk}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}
