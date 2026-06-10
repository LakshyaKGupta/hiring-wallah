'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ChevronRight, Trophy, Medal, Award, ShieldCheck } from 'lucide-react'
import { appleTransition } from '@/lib/motion'

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
  index?: number
}

const verdictConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  'Strong Hire': { color: 'text-accent-green border-accent-green/20 bg-accent-green/5', icon: Trophy },
  'Consider': { color: 'text-accent-amber border-accent-amber/20 bg-accent-amber/5', icon: Medal },
  'Reject': { color: 'text-accent-red border-accent-red/20 bg-accent-red/5', icon: AlertCircle },
}

const rankIcons = [Trophy, Medal, Award]

export default function ScoreCard({ candidate, rank, index = 0 }: ScoreCardProps) {
  const config = verdictConfig[candidate.verdict] || {
    color: 'text-accent-primary border-accent-primary/20 bg-accent-primary/5',
    icon: ShieldCheck,
  }
  const VerdictIcon = config.icon
  const RankIcon = rankIcons[Math.min(rank - 1, 2)] || Award

  const zOffset = -(rank - 1) * 35
  const yOffset = (rank - 1) * 15
  const opacity = Math.max(0.5, 1 - (rank - 1) * 0.15)

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 20 }}
      whileInView={{ opacity, y: yOffset }}
      viewport={{ once: true, amount: 0.2 }}
      style={{
        zIndex: 100 - rank,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        z: zOffset,
      }}
      whileHover={{
        y: yOffset - 8,
        z: zOffset + 10,
        opacity: 1,
        boxShadow: '0 12px 24px rgba(26, 95, 122, 0.08)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        layout: appleTransition(0.4),
        default: { type: 'spring', stiffness: 150, damping: 20 },
        delay: index * 0.06,
      }}
      className="tilt-card w-full bg-bg-surface border border-border-subtle rounded-xl p-5 mb-4 last:mb-0 relative transition-colors duration-400 select-none cursor-pointer group overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="w-10 h-10 rounded-lg bg-bg-deep border border-border-subtle flex items-center justify-center type-mono font-bold text-sm text-text-secondary group-hover:border-accent-primary/30 group-hover:text-accent-primary transition-all duration-400"
          >
            {rank <= 3 ? <RankIcon className="w-4 h-4" /> : `#${rank}`}
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight font-display group-hover:text-accent-primary transition-colors duration-300">
              {candidate.name}
            </h3>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-xs type-label border flex items-center gap-1 ${config.color}`}>
                <VerdictIcon className="w-3 h-3" />
                {candidate.verdict}
              </span>
              <span className="text-xs text-text-tertiary type-label">
                {candidate.confidence}% Conf
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xs hidden lg:block">
          <div className="space-y-1.5">
            {Object.entries(candidate.breakdown).slice(0, 2).map(([dimension, item], i) => (
              <motion.div
                key={dimension}
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="text-xs"
              >
                <div className="flex justify-between type-caption text-text-secondary mb-0.5">
                  <span className="truncate max-w-[120px]">{dimension.replace('_', ' ')}</span>
                  <span>{item.score}</span>
                </div>
                <div className="w-full h-1 bg-bg-deep rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={appleTransition(0.5, 0.3 + i * 0.1)}
                    className="h-full bg-accent-primary/80 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border-subtle pt-3 md:pt-0">
          {candidate.da_flags > 0 ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 text-accent-da type-label text-xs px-2 py-1 rounded border border-accent-da/10 bg-accent-da/5 transition-all duration-300 group-hover:bg-accent-da/10"
            >
              <div className="flex items-center justify-center p-0.5 rounded bg-accent-da/10 transition-transform duration-300 group-hover:rotate-12">
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span>{candidate.da_flags} DA FLAG{candidate.da_flags > 1 ? 'S' : ''}</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-accent-green type-label hidden md:flex">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Match
            </div>
          )}

          <div className="text-right">
            <motion.span
              key={candidate.score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-3xl type-mono-score font-bold text-accent-primary"
            >
              {candidate.score}
            </motion.span>
            <span className="text-[10px] text-text-tertiary block type-mono-score">OVERALL</span>
          </div>

          <Link href={`/recruiter/candidate/${candidate.id}`}>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-8 h-8 rounded-full border border-border-subtle group-hover:border-accent-primary group-hover:text-accent-primary flex items-center justify-center cursor-pointer transition-colors duration-300 bg-bg-deep"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
