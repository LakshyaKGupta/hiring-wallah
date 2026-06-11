'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Sliders,
  Cpu,
  Briefcase,
  User,
  Zap,
  Network,
  Waypoints,
  Fingerprint
} from 'lucide-react'

const iconsList = [
  FileText,
  Sparkles,
  CheckCircle2,
  Sliders,
  Cpu,
  Briefcase,
  User,
  Zap,
  Network,
  Waypoints,
  Fingerprint
]

interface FloatingIconConfig {
  id: number
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  x: string
  y: string
  scale: number
  opacity: number
  delay: number
  duration: number
  xDrift: number[]
  yDrift: number[]
  rotateDrift: number[]
}

function seededValue(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280
  return value - Math.floor(value)
}

function createConfig(index: number): FloatingIconConfig {
  const Icon = iconsList[index % iconsList.length]
  const xPercent = seededValue(index + 1) * 100
  const yPercent = seededValue(index + 11) * 100
  const xSign = seededValue(index + 21) > 0.5 ? 1 : -1
  const ySign = seededValue(index + 31) > 0.5 ? 1 : -1
  const rotateSign = seededValue(index + 41) > 0.5 ? 1 : -1

  return {
    id: index,
    Icon,
    x: `${Math.max(2, Math.min(98, xPercent))}%`,
    y: `${Math.max(2, Math.min(98, yPercent))}%`,
    scale: 0.6 + seededValue(index + 51) * 0.5,
    opacity: 0.15 + seededValue(index + 61) * 0.10,
    delay: seededValue(index + 71) * 4,
    duration: 12 + seededValue(index + 81) * 8,
    xDrift: [0, xSign * (20 + seededValue(index + 91) * 30), 0],
    yDrift: [0, ySign * (25 + seededValue(index + 101) * 35), 0],
    rotateDrift: [0, rotateSign * (15 + seededValue(index + 111) * 20), 0],
  }
}

export default function FloatingIcons({ count = 8 }: { count?: number }) {
  const configs = useMemo(
    () => Array.from({ length: count }).map((_, index) => createConfig(index)),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {configs.map((config) => {
        const { Icon } = config
        return (
          <motion.div
            key={config.id}
            className="absolute text-accent-primary"
            style={{
              left: config.x,
              top: config.y,
              scale: config.scale,
              opacity: config.opacity,
            }}
            animate={{
              x: config.xDrift,
              y: config.yDrift,
              rotate: config.rotateDrift,
            }}
            transition={{
              duration: config.duration,
              delay: config.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.2} />
          </motion.div>
        )
      })}
    </div>
  )
}
