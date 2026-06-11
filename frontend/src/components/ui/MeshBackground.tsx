'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface MeshBackgroundProps {
  opacity?: number
  className?: string
  fixed?: boolean
  mode?: 'full' | 'grid-only'
  showGrid?: boolean
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  // Draw animated mesh gradient on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const t = timeRef.current

    ctx.clearRect(0, 0, w, h)

    // Create radial gradient points that drift over time
    const centerX = w / 2 + Math.sin(t * 0.0003) * w * 0.15 + mouseRef.current.x * 20
    const centerY = h / 2 + Math.cos(t * 0.0004) * h * 0.1 + mouseRef.current.y * 20

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, w * 0.8
    )

    // Zoho palette colors with very low opacity
    const colors = [
      `rgba(0, 103, 255, ${0.06 * opacity})`,
      `rgba(74, 93, 120, ${0.04 * opacity})`,
      `rgba(13, 27, 46, ${0.03 * opacity})`,
      `rgba(250, 250, 248, ${0.5 * opacity})`,
    ]

    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(0.4, colors[1])
    gradient.addColorStop(0.7, colors[2])
    gradient.addColorStop(1, colors[3])

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Draw second, smaller orb
    const orb2X = w * 0.7 + Math.cos(t * 0.0005) * w * 0.2
    const orb2Y = h * 0.3 + Math.sin(t * 0.0006) * h * 0.15
    const orb2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, w * 0.4)
    orb2.addColorStop(0, `rgba(0, 103, 255, ${0.04 * opacity})`)
    orb2.addColorStop(1, 'rgba(250, 250, 248, 0)')
    ctx.fillStyle = orb2
    ctx.fillRect(0, 0, w, h)

    // Draw third, warm orb
    const orb3X = w * 0.2 + Math.sin(t * 0.0004) * w * 0.15
    const orb3Y = h * 0.8 + Math.cos(t * 0.0007) * h * 0.2
    const orb3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, w * 0.3)
    orb3.addColorStop(0, `rgba(227, 116, 0, ${0.025 * opacity})`)
    orb3.addColorStop(1, 'rgba(250, 250, 248, 0)')
    ctx.fillStyle = orb3
    ctx.fillRect(0, 0, w, h)
  }, [opacity])

  // Animation loop
  useEffect(() => {
    if (reducedMotion || mode === 'grid-only') return

    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      timeRef.current = timestamp - startTime
      draw()
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion, mode, draw])

  // Mouse tracking
  useEffect(() => {
    if (reducedMotion || mode === 'grid-only') return

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [reducedMotion, mode])

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
      {/* Layer 0 — animated canvas mesh gradient */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 1 }}
        />
      )}

      {/* Fallback for reduced motion */}
      {reducedMotion && <div className="mesh-base-gradient" />}

      {/* Layer 1 — far parallax blobs (slow drift) */}
      <div className="mesh-parallax-layer mesh-parallax-far">
        <div className="animate-blob-1 -top-[22%] -left-[12%] w-[62vw] h-[62vw] max-w-[680px] max-h-[680px] min-w-[280px] min-h-[280px]" />
        <div className="animate-blob-4 top-[55%] right-[5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] min-w-[220px] min-h-[220px]" />
      </div>

      {/* Layer 2 — near parallax blobs (faster drift) */}
      <div className="mesh-parallax-layer mesh-parallax-near">
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
          {Array.from({ length: 24 }, (_, i) => (
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
