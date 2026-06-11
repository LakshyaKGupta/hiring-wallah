'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  hoverGlow?: boolean
  glassmorphism?: boolean
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'var(--color-accent-primary)',
  hoverGlow = true,
  glassmorphism = true,
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -4 } : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      className={`
        relative rounded-2xl border border-white/10
        ${glassmorphism ? 'bg-white/5 backdrop-blur-xl' : 'bg-white'}
        ${className}
      `}
      style={{
        boxShadow: hoverGlow
          ? `0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.03), 0 20px 48px rgba(0,0,0,0.06)`
          : undefined,
      }}
    >
      {/* Gradient border effect */}
      <div
        className="absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColor}20, transparent 50%, ${glowColor}10)`,
        }}
      />
      {/* Inner glow */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
