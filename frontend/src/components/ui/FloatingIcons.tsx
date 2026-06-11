'use client'

import React, { useEffect, useState } from 'react'
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

export default function FloatingIcons({ count = 8 }: { count?: number }) {
  const [mounted, setMounted] = useState(false)
  const [configs, setConfigs] = useState<FloatingIconConfig[]>([])

  useEffect(() => {
    setMounted(true)
    
    // Generate random layout configs on mount to avoid SSR mismatch
    const generated = Array.from({ length: count }).map((_, i) => {
      const Icon = iconsList[i % iconsList.length]
      
      // Distribute coordinates across sections with wider margins
      const xPercent = Math.random() * 100
      const yPercent = Math.random() * 100
      
      const scale = 0.6 + Math.random() * 0.5
      const opacity = 0.15 + Math.random() * 0.10 // Visible: between 15% and 25% opacity
      
      const delay = Math.random() * 4
      const duration = 12 + Math.random() * 8 // Slow: 12s to 20s
      
      const xDrift = [0, (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 30), 0]
      const yDrift = [0, (Math.random() > 0.5 ? 1 : -1) * (25 + Math.random() * 35), 0]
      const rotateDrift = [0, (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20), 0]

      return {
        id: i,
        Icon,
        x: `${Math.max(2, Math.min(98, xPercent))}%`,
        y: `${Math.max(2, Math.min(98, yPercent))}%`,
        scale,
        opacity,
        delay,
        duration,
        xDrift,
        yDrift,
        rotateDrift
      }
    })
    
    setConfigs(generated)
  }, [count])

  if (!mounted) return null

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
