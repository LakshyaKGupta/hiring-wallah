'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ChevronRight, TrendingUp } from 'lucide-react'

interface ScoreCardProps {
  candidate: {
    id: string
    name: string
    verdict: string
    score: number
    confidence: number
    da_flags: number
    breakdown: Record<string, { score: number; justification: string }>
  }
  rank: number
}

export default function ScoreCard({ candidate, rank }: ScoreCardProps) {
  // Verdict styling
  const verdictColors: Record<string, string> = {
    'Strong Hire': 'text-accent-green border-accent-green/20 bg-accent-green/5',
    'Consider': 'text-accent-amber border-accent-amber/20 bg-accent-amber/5',
    'Reject': 'text-accent-red border-accent-red/20 bg-accent-red/5'
  }

  const badgeColor = verdictColors[candidate.verdict] || 'text-accent-primary border-accent-primary/20 bg-accent-primary/5'

  // Receding 3D layout settings based on ranking
  const getPerspectiveStyle = () => {
    // Top 4 cards are stacked recedely in 3D
    const zOffset = -(rank - 1) * 35
    const yOffset = (rank - 1) * 15
    const scale = 1 - (rank - 1) * 0.04
    const opacity = Math.max(0.5, 1 - (rank - 1) * 0.15)

    return {
      transform: `perspective(1200px) translateZ(${zOffset}px) translateY(${yOffset}px) scale(${scale})`,
      zIndex: 100 - rank,
      opacity
    }
  }

  return (
    <motion.div
      style={getPerspectiveStyle()}
      whileHover={{
        y: (rank - 1) * 15 - 12,
        scale: (1 - (rank - 1) * 0.04) * 1.02,
        z: -(rank - 1) * 35 + 15,
        boxShadow: '0 20px 40px rgba(79, 70, 229, 0.08)',
        borderColor: 'var(--color-accent-primary)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full bg-bg-surface border border-border-subtle rounded-xl p-5 mb-4 last:mb-0 relative transition-colors duration-300 select-none cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Rank, Name, Verdict */}
        <div className="flex items-center gap-4">
          {/* Rank Circle */}
          <div className="w-10 h-10 rounded-lg bg-bg-deep border border-border-subtle flex items-center justify-center font-mono font-bold text-sm text-text-secondary">
            #{rank}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary tracking-tight font-sans">
              {candidate.name}
            </h3>
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-xs font-mono border uppercase tracking-wider ${badgeColor}`}>
                {candidate.verdict}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                {candidate.confidence}% CONF
              </span>
            </div>
          </div>
        </div>

        {/* Center Side: Score bars */}
        <div className="flex-1 max-w-xs hidden lg:block">
          <div className="space-y-1.5">
            {Object.entries(candidate.breakdown).slice(0, 2).map(([dimension, item]) => (
              <div key={dimension} className="text-xs">
                <div className="flex justify-between text-[10px] text-text-secondary uppercase font-mono tracking-wide mb-0.5">
                  <span className="truncate max-w-[120px]">{dimension.replace('_', ' ')}</span>
                  <span>{item.score}</span>
                </div>
                <div className="w-full h-1 bg-bg-deep rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-primary/80 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Score, DA flags, Details CTA */}
        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border-subtle pt-3 md:pt-0">
          
          {/* DA warning flags */}
          {candidate.da_flags > 0 ? (
            <div className="flex items-center gap-1.5 text-accent-da font-mono text-xs px-2 py-1 rounded border border-accent-da/10 bg-accent-da/5">
              <AlertCircle className="w-4 h-4 animate-pulse" />
              <span>{candidate.da_flags} DA FLAG{candidate.da_flags > 1 ? 'S' : ''}</span>
            </div>
          ) : (
            <div className="text-[10px] text-text-tertiary font-mono hidden md:block">
              SECURE MATCH
            </div>
          )}

          {/* Large Overall Score */}
          <div className="text-right">
            <span className="text-3xl font-mono font-bold text-accent-primary">
              {candidate.score}
            </span>
            <span className="text-[10px] text-text-tertiary block font-mono">
              OVERALL
            </span>
          </div>

          <Link href={`/recruiter/candidate/${candidate.id}`}>
            <div className="w-8 h-8 rounded-full border border-border-subtle hover:border-accent-primary hover:text-accent-primary flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

      </div>
    </motion.div>
  )
}
