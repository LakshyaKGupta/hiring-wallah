'use client'

import React, { useMemo } from 'react'
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

function rounded(value: number, precision = 3) {
  return Number(value.toFixed(precision))
}

function createConfig(index: number): FloatingIconConfig {
  const Icon = iconsList[index % iconsList.length]
  const xPercent = rounded(seededValue(index + 1) * 100)
  const yPercent = rounded(seededValue(index + 11) * 100)
  const xSign = seededValue(index + 21) > 0.5 ? 1 : -1
  const ySign = seededValue(index + 31) > 0.5 ? 1 : -1
  const rotateSign = seededValue(index + 41) > 0.5 ? 1 : -1

  return {
    id: index,
    Icon,
    x: `${Math.max(2, Math.min(98, xPercent))}%`,
    y: `${Math.max(2, Math.min(98, yPercent))}%`,
    scale: rounded(0.6 + seededValue(index + 51) * 0.5),
    opacity: rounded(0.15 + seededValue(index + 61) * 0.10),
    delay: rounded(seededValue(index + 71) * 4),
    duration: rounded(12 + seededValue(index + 81) * 8),
    xDrift: [0, rounded(xSign * (20 + seededValue(index + 91) * 30)), 0],
    yDrift: [0, rounded(ySign * (25 + seededValue(index + 101) * 35)), 0],
    rotateDrift: [0, rounded(rotateSign * (15 + seededValue(index + 111) * 20)), 0],
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
          <div
            key={config.id}
            className="floating-icon-drift absolute text-accent-primary will-change-transform"
            style={{
              left: config.x,
              top: config.y,
              opacity: config.opacity,
              '--float-scale': config.scale,
              '--float-x': `${config.xDrift[1]}px`,
              '--float-y': `${config.yDrift[1]}px`,
              '--float-rotate': `${config.rotateDrift[1]}deg`,
              animationDelay: `${config.delay * -1}s`,
              animationDuration: `${config.duration * 1.35}s`,
            } as React.CSSProperties}
          >
            <Icon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.2} />
          </div>
        )
      })}
    </div>
  )
}
