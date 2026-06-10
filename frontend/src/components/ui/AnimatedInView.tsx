'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { fadeUpContainerVariants, fadeUpItemVariants } from '@/lib/motion'

export { fadeUpContainerVariants, fadeUpItemVariants }

interface AnimatedInViewProps {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number
}

export function AnimatedInView({
  children,
  className = '',
  delay = 0,
  amount = 0.15,
}: AnimatedInViewProps) {
  return (
    <motion.div
      variants={fadeUpContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpItem({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      variants={fadeUpItemVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
