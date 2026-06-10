'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { appleTransition } from '@/lib/motion'

interface ScoreBarProps {
  label: string
  score: number
  max?: number
  color?: string
  index?: number
}

export default function ScoreBar({ label, score, max = 100, color = 'bg-accent-primary', index = 0 }: ScoreBarProps) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const calculatedPercent = Math.min(100, Math.max(0, (score / max) * 100))
    const timer = setTimeout(() => setPercent(calculatedPercent), 120 + index * 80)
    return () => clearTimeout(timer)
  }, [score, max, index])

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={appleTransition(0.4, index * 0.08)}
      whileHover={{ x: 4 }}
      className="mb-4 last:mb-0 group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="type-label text-text-secondary flex items-center gap-2 transition-colors duration-300 group-hover:text-text-primary">
          <BarChart3 className="w-3.5 h-3.5 text-accent-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          {label.replace('_', ' ')}
        </span>
        <motion.span
          key={score}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={appleTransition(0.3)}
          className="type-mono-score text-text-primary font-bold"
        >
          {score} / {max}
        </motion.span>
      </div>

      <div className="w-full h-2.5 bg-bg-deep rounded-full overflow-hidden border border-border-subtle/50 relative group-hover:border-accent-primary/20 transition-colors duration-400">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={appleTransition(0.5, index * 0.06)}
          className={`h-full rounded-full ${color} relative overflow-hidden`}
        >
          <div className="bar-shimmer" />
        </motion.div>
      </div>
    </motion.div>
  )
}
