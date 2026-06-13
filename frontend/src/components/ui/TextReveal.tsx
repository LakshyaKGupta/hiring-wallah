'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface TextRevealProps {
  children: string
  className?: string
  effect?: 'fade' | 'slide' | 'blur' | 'scale'
  staggerDelay?: number
  once?: boolean
}

const effectVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
}

export default function TextReveal({
  children,
  className = '',
  effect = 'fade',
  staggerDelay = 0.04,
}: TextRevealProps) {
  const words = children.split(' ')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.02,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: effectVariants[effect].hidden || effectVariants.fade.hidden,
    visible: {
      ...(effectVariants[effect].visible || effectVariants.fade.visible),
      transition: {
        duration: 0.4,
        ease: EASE_OUT,
      },
    },
  }

  return (
    <motion.span
      variants={containerVariants}
      initial="visible"
      animate="visible"
      className={`inline ${className}`}
      aria-label={children}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={itemVariants}
          className="inline-block mr-[0.25em] will-change-transform"
          style={{ whiteSpace: 'nowrap' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
