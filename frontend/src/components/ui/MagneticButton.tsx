'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useMagneticHover } from '@/hooks/useMagneticHover'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  glowClassName?: string
  onClick?: () => void
  as?: 'button' | 'div'
}

export default function MagneticButton({
  children,
  className = '',
  glowClassName = 'shadow-[0_0_20px_rgba(0,103,255,0.25)]',
  onClick,
  as = 'div',
}: MagneticButtonProps) {
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticHover(0.28)
  const Component = as === 'button' ? motion.button : motion.div

  return (
    <Component
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`relative cursor-pointer transition-shadow duration-400 ease-apple hover:${glowClassName} ${className}`}
    >
      {children}
    </Component>
  )
}
