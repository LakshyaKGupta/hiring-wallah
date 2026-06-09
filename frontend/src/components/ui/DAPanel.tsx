'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

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
    <div className="border border-accent-da/30 bg-bg-surface rounded-xl p-5 relative overflow-hidden shadow-sm">
      {/* Background warning pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-da/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-accent-da/20 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="w-6 h-6 text-accent-da animate-pulse" />
          <div>
            <h3 className="font-display font-bold text-lg text-text-primary tracking-wide">
              DEVIL&apos;S ADVOCATE REPORT
            </h3>
            <span className="text-[10px] text-accent-da font-mono font-bold tracking-widest uppercase animate-pulse">
              ● CONTESTED ANALYSIS ACTIVE
            </span>
          </div>
        </div>

        {/* Penalty Badge */}
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-accent-da">
            {confidenceAdjustment} PTS
          </span>
          <span className="text-[9px] text-text-tertiary block font-mono uppercase">
            CONF ADJUSTMENT
          </span>
        </div>
      </div>

      {/* Overview Recommendations */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-bg-deep border border-border-subtle p-3 rounded-lg">
          <span className="text-[9px] text-text-tertiary font-mono uppercase block mb-1">
            DA RECOMMENDATION
          </span>
          <span className={`text-xs font-mono font-bold uppercase ${recommendation.toLowerCase() === 'approve' ? 'text-accent-green' : 'text-accent-da'}`}>
            {recommendation}
          </span>
        </div>
        <div className="bg-bg-deep border border-border-subtle p-3 rounded-lg">
          <span className="text-[9px] text-text-tertiary font-mono uppercase block mb-1">
            CONTESTED POINTS
          </span>
          <span className="text-xs font-mono font-bold text-text-primary">
            {claims.length} CLAIMS DETECTED
          </span>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono uppercase text-text-secondary tracking-wider block">
          Challenged Rubric Claims
        </span>

        {claims.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-accent-green border border-accent-green/20 bg-accent-green/5 p-3 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>No claims were contested. Evaluator claims are fully evidence-backed.</span>
          </div>
        ) : (
          claims.map((claim, idx) => {
            const isExpanded = expandedIndex === idx
            return (
              <div 
                key={idx} 
                className={`border rounded-lg bg-bg-deep transition-all duration-300 ${isExpanded ? 'border-accent-da/50' : 'border-border-subtle'}`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(idx)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-bg-raised transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider ${getSeverityColor(claim.severity)}`}>
                      {claim.severity}
                    </span>
                    <p className="text-xs font-semibold text-text-primary truncate font-sans">
                      {claim.original_claim}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                </div>

                {/* Counter Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-border-subtle/50 bg-bg-raised text-xs space-y-2.5">
                        <div>
                          <span className="text-[9px] text-text-tertiary font-mono uppercase block mb-0.5">
                            Original Evaluator Claim
                          </span>
                          <p className="text-text-secondary leading-relaxed font-sans">
                            {claim.original_claim}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] text-accent-da font-mono uppercase block mb-0.5">
                            Devil&apos;s Advocate Counter-Evidence
                          </span>
                          <p className="text-text-primary leading-relaxed font-sans font-medium">
                            {claim.counter}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="mt-5 border-t border-border-subtle/50 pt-4">
          <span className="text-[10px] font-mono uppercase text-text-secondary tracking-wider block mb-2">
            Critical Risk Factors
          </span>
          <ul className="space-y-1.5">
            {riskFactors.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-da shrink-0 mt-0.5" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
