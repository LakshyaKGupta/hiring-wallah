'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 180,
              damping: 24,
              mass: 0.9,
            }
      }
      className="flex-1 flex flex-col relative w-full"
    >
      {children}
    </motion.div>
  )
}
