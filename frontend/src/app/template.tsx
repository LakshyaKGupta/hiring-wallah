'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      className="flex-1 flex flex-col relative w-full"
    >
      {children}
    </motion.div>
  )
}
