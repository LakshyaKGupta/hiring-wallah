import type { Transition, Variants } from 'framer-motion'

/** Premium out easing — cubic-bezier(0.16, 1, 0.3, 1) */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Spring-like exaggerated easing */
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

/** Kore.ai elegant transition easing — Power 3 */
export const EASE_KORE: [number, number, number, number] = [0.22, 0.6, 0.36, 1]

/** Kore.ai fast transition easing — Expo out */
export const EASE_KORE_FAST: [number, number, number, number] = [0.165, 0.84, 0.44, 1]

export const fadeUpContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
}

export const fadeUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT as [number, number, number, number],
    },
  },
}

export function appleTransition(duration = 0.4, delay = 0): Transition {
  return { duration, delay, ease: EASE_OUT as [number, number, number, number] }
}
