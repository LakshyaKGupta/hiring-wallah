'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface MeshBackgroundProps {
  opacity?: number
  className?: string
  /** Pin behind the entire viewport (use in root layout) */
  fixed?: boolean
  /** `full` = all layers; `grid-only` = grid overlay for section scoping */
  mode?: 'full' | 'grid-only'
  /** Show subtle paper grid — off by default to avoid wallpaper feel */
  showGrid?: boolean
}

const PARTICLE_COUNT = 18

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export default function MeshBackground({
  opacity = 0.2,
  className = '',
  fixed = false,
  mode = 'full',
  showGrid = false,
}: MeshBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion()
  const rafRef = useRef<number>(0)
  const scrollYRef = useRef(0)
  const [parallax, setParallax] = useState({ far: { x: 0, y: 0 }, near: { x: 0, y: 0 } })

  const applyParallax = useCallback(
    (mouseX: number, mouseY: number) => {
      const scrollY = scrollYRef.current
      setParallax({
        far: { x: mouseX * 12, y: mouseY * 10 + scrollY * 0.025 },
        near: { x: mouseX * 28, y: mouseY * 22 + scrollY * 0.05 },
      })
    },
    []
  )

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotion) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        applyParallax(nx, ny)
      })
    },
    [reducedMotion, applyParallax]
  )

  useEffect(() => {
    if (reducedMotion || mode === 'grid-only') return
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [onMouseMove, reducedMotion, mode])

  useEffect(() => {
    if (reducedMotion || !fixed || mode === 'grid-only') return

    const onScroll = () => {
      scrollYRef.current = window.scrollY
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        applyParallax(0, 0)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion, fixed, mode, applyParallax])

  const positionClass = fixed ? 'fixed inset-0' : 'absolute inset-0'

  if (mode === 'grid-only') {
    return (
      <div
        className={`${positionClass} overflow-hidden pointer-events-none z-0 ${className}`}
        aria-hidden
      >
        <div
          className="absolute inset-0 grid-bg grid-bg-drift pointer-events-none"
          style={{ opacity }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${positionClass} overflow-hidden pointer-events-none z-0 mesh-background ${className}`}
      aria-hidden
    >
      {/* Layer 0 — shifting base gradient wash */}
      <div className="mesh-base-gradient" />

      {/* Layer 1 — far parallax blobs (slow drift) */}
      <div
        className="mesh-parallax-layer mesh-parallax-far"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `translate3d(${parallax.far.x}px, ${parallax.far.y}px, 0)`,
              }
        }
      >
        <div className="animate-blob-1 -top-[22%] -left-[12%] w-[62vw] h-[62vw] max-w-[680px] max-h-[680px] min-w-[280px] min-h-[280px]" />
        <div className="animate-blob-4 top-[55%] right-[5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] min-w-[220px] min-h-[220px]" />
      </div>

      {/* Layer 2 — near parallax blobs (faster drift) */}
      <div
        className="mesh-parallax-layer mesh-parallax-near"
        style={
          reducedMotion
            ? undefined
            : {
                transform: `translate3d(${parallax.near.x}px, ${parallax.near.y}px, 0)`,
              }
        }
      >
        <div className="animate-blob-2 -bottom-[18%] -right-[8%] w-[72vw] h-[72vw] max-w-[760px] max-h-[760px] min-w-[340px] min-h-[340px]" />
        <div className="animate-blob-3 top-[28%] left-[18%] w-[52vw] h-[52vw] max-w-[560px] max-h-[560px] min-w-[240px] min-h-[240px]" />
        <div className="animate-blob-5 top-[8%] right-[25%] w-[38vw] h-[38vw] max-w-[420px] max-h-[420px] min-w-[180px] min-h-[180px]" />
      </div>

      {/* Layer 3 — aurora ribbon */}
      <div className="mesh-aurora" />

      {/* Layer 4 — animated noise grain */}
      <div className="mesh-noise" />

      {/* Layer 5 — floating particles */}
      {!reducedMotion && (
        <div className="mesh-particles">
          {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
            <span
              key={i}
              className="mesh-particle"
              style={
                {
                  '--particle-x': `${8 + ((i * 37) % 84)}%`,
                  '--particle-y': `${6 + ((i * 53) % 88)}%`,
                  '--particle-delay': `${(i * 1.7) % 12}s`,
                  '--particle-duration': `${14 + (i % 5) * 3}s`,
                  '--particle-size': `${2 + (i % 3)}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Layer 6 — optional grid overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 grid-bg grid-bg-drift pointer-events-none"
          style={{ opacity }}
        />
      )}
    </div>
  )
}
