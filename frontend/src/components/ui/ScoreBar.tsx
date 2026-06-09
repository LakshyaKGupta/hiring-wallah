'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScoreBarProps {
  label: string
  score: number
  max?: number
  color?: string
}

export default function ScoreBar({ label, score, max = 100, color = 'bg-accent-primary' }: ScoreBarProps) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const calculatedPercent = Math.min(100, Math.max(0, (score / max) * 100))
    // Small timeout to trigger transition
    const timer = setTimeout(() => {
      setPercent(calculatedPercent)
    }, 100)
    return () => clearTimeout(timer)
  }, [score, max])

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between text-sm font-mono uppercase tracking-wide mb-1.5">
        <span className="text-text-secondary font-medium">
          {label.replace('_', ' ')}
        </span>
        <span className="text-text-primary font-bold">
          {score} / {max}
        </span>
      </div>

      <div className="w-full h-2.5 bg-bg-deep rounded-full overflow-hidden border border-border-subtle/50 relative">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}
