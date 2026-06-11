'use client'

import React from 'react'

interface BorderBeamProps {
  children: React.ReactNode
  className?: string
  beamColor?: string
  beamWidth?: number
  beamDuration?: number
}

export default function BorderBeam({
  children,
  className = '',
  beamColor = 'var(--color-accent-primary)',
  beamWidth = 2,
  beamDuration = 3,
}: BorderBeamProps) {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${beamColor}, transparent)`,
          backgroundSize: '200% 100%',
          animation: `border-beam ${beamDuration}s linear infinite`,
          maskImage: 'linear-gradient(#fff 0 0)',
          WebkitMaskImage: 'linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: beamWidth,
        }}
      />
    </div>
  )
}
