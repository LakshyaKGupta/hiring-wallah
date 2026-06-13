'use client'

import React, { useEffect, useRef } from 'react'

type RevealVariant = 'default' | 'stagger' | 'left' | 'scale'

interface SectionRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RevealVariant
  delay?: number
  threshold?: number
}

const variantClass: Record<RevealVariant, string> = {
  default: 'section-reveal',
  stagger: 'section-reveal-stagger',
  left: 'section-reveal-left',
  scale: 'section-reveal-scale',
}

export function SectionReveal({
  children,
  className = '',
  variant = 'default',
  delay = 0,
  threshold = 0.12,
  ...rest
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold])

  return (
    <div ref={ref} className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </div>
  )
}
