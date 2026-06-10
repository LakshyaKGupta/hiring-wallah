'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'

const ACCENT = '#1A5F7A'
const ACCENT_EMISSIVE = '#145A70'
const ACCENT_LIGHT = '#2A8FAD'

const count = 60
const connectionThreshold = 4.2

const staticPositions = new Float32Array(count * 3)
const staticVelocities = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
  staticPositions[i * 3] = (Math.random() - 0.5) * 14
  staticPositions[i * 3 + 1] = (Math.random() - 0.5) * 14
  staticPositions[i * 3 + 2] = (Math.random() - 0.5) * 14

  staticVelocities[i * 3] = (Math.random() - 0.5) * 0.01
  staticVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
  staticVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
}

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

function CentralOrb({ paused }: { paused: boolean }) {
  const orbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!orbRef.current || paused) return
    const t = state.clock.elapsedTime
    orbRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06)
    orbRef.current.rotation.y = t * 0.15
    orbRef.current.rotation.x = Math.sin(t * 0.4) * 0.1
  })

  return (
    <Float speed={paused ? 0 : 1.5} rotationIntensity={paused ? 0 : 0.4} floatIntensity={paused ? 0 : 1.2}>
      <Sphere ref={orbRef} args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT_EMISSIVE}
          emissiveIntensity={0.55}
          transparent
          opacity={0.85}
          roughness={0.25}
          metalness={0.75}
        />
      </Sphere>
      <Sphere args={[1.6, 16, 16]}>
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
    </Float>
  )
}

function NodeNetwork({
  mouse,
  paused,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  paused: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const points = pointsRef.current
    const lines = linesRef.current
    const group = groupRef.current

    if (!points || !lines || !group) return

    if (!paused) {
      group.rotation.y += 0.0008
      group.rotation.x += 0.0003
      group.rotation.y += mouse.current.x * 0.0003
      group.rotation.x += mouse.current.y * 0.0002

      const posAttr = points.geometry.attributes.position
      const positionsArr = posAttr.array as Float32Array

      for (let i = 0; i < count; i++) {
        const idx = i * 3
        positionsArr[idx] += staticVelocities[idx]
        positionsArr[idx + 1] += staticVelocities[idx + 1]
        positionsArr[idx + 2] += staticVelocities[idx + 2]

        if (Math.abs(positionsArr[idx]) > 7) staticVelocities[idx] *= -1
        if (Math.abs(positionsArr[idx + 1]) > 7) staticVelocities[idx + 1] *= -1
        if (Math.abs(positionsArr[idx + 2]) > 7) staticVelocities[idx + 2] *= -1
      }
      posAttr.needsUpdate = true
    }

    const posAttr = points.geometry.attributes.position
    const positionsArr = posAttr.array as Float32Array

    const connections: number[] = []
    for (let i = 0; i < count; i++) {
      const x1 = positionsArr[i * 3]
      const y1 = positionsArr[i * 3 + 1]
      const z1 = positionsArr[i * 3 + 2]

      for (let j = i + 1; j < count; j++) {
        const x2 = positionsArr[j * 3]
        const y2 = positionsArr[j * 3 + 1]
        const z2 = positionsArr[j * 3 + 2]

        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)

        if (dist < connectionThreshold) {
          connections.push(x1, y1, z1, x2, y2, z2)
        }
      }
    }

    const lineGeo = lines.geometry
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connections), 3))
    if (lineGeo.attributes.position) {
      lineGeo.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[staticPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_LIGHT}
          size={0.12}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={ACCENT} transparent opacity={0.15} linewidth={1} />
      </lineSegments>
    </group>
  )
}

function Scene({
  mouse,
  paused,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>
  paused: boolean
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={ACCENT_LIGHT} />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color={ACCENT_EMISSIVE} />
      <CentralOrb paused={paused} />
      <NodeNetwork mouse={mouse} paused={paused} />
    </>
  )
}

function StaticOrbFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      <div
        className="w-[min(420px,70vw)] h-[min(420px,70vw)] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, color-mix(in oklch, var(--color-accent-primary) 22%, transparent), transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

export default function AgentOrb() {
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let active = true
    const handle = requestAnimationFrame(() => {
      if (active) setMounted(true)
    })

    if (reducedMotion) return () => {
      active = false
      cancelAnimationFrame(handle)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      active = false
      cancelAnimationFrame(handle)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [reducedMotion])

  if (!mounted) {
    return <div className="absolute inset-0 bg-transparent" aria-hidden />
  }

  if (reducedMotion) {
    return <StaticOrbFallback />
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-55" aria-hidden>
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 1.5]}>
        <Scene mouse={mouse} paused={false} />
      </Canvas>
    </div>
  )
}
