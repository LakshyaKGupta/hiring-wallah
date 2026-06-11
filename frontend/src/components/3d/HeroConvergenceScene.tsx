'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls, Line } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, FileSearch, ShieldCheck, User } from 'lucide-react'

// Orbital node positions and colors (using premium AI accent palette: Indigo, Purple, Cyan)
const ORBITAL_NODES = [
  { color: '#4F46E5', angle: 0 },
  { color: '#7C3AED', angle: Math.PI / 3 },
  { color: '#06B6D4', angle: (2 * Math.PI) / 3 },
  { color: '#4F46E5', angle: Math.PI },
  { color: '#7C3AED', angle: (4 * Math.PI) / 3 },
  { color: '#06B6D4', angle: (5 * Math.PI) / 3 },
]

// Enhanced core sphere with better lighting
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0004
      meshRef.current.rotation.y += 0.0006
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2, 6]} />
      <meshStandardMaterial
        color="#003D99"
        roughness={0.2}
        metalness={0.8}
        emissive="#0067FF"
        emissiveIntensity={0.8}
        wireframe={false}
        transparent={true}
        opacity={0.35}
      />
    </mesh>
  )
}

// Enhanced glowing core with pulsing effect
function GlowingCore() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.25
      meshRef.current.scale.x = pulse
      meshRef.current.scale.y = pulse
      meshRef.current.scale.z = pulse
      meshRef.current.rotation.x += 0.0005
      meshRef.current.rotation.y += 0.0008
    }
  })

  return (
    <>
      {/* Main core */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshBasicMaterial
          color="#0067FF"
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color="#3399FF"
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.1, 16, 48]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </>
  )
}

// Enhanced orbital data node with glow (de-branded)
function DataNode({ node, index }: { node: typeof ORBITAL_NODES[0]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const orbitRadius = 4.5
  const orbitSpeed = 0.35 + index * 0.025
  const verticalAmplitude = 0.5 + index * 0.1

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime()
      const angle = node.angle + time * orbitSpeed
      groupRef.current.position.x = Math.cos(angle) * orbitRadius
      groupRef.current.position.y = Math.sin(time * 0.5) * verticalAmplitude
      groupRef.current.position.z = Math.sin(angle * 0.8) * orbitRadius * 0.4
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.006
      meshRef.current.rotation.y += 0.009
      meshRef.current.rotation.z += 0.003
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main node geometry */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={1.0}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Glow aura around node */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color={node.color}
          transparent={true}
          opacity={0.12}
        />
      </mesh>

      {/* Inner bright sphere */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          transparent={true}
          opacity={0.25}
          emissive={node.color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

// Enhanced orbital lines with gradient
function OrbitalLines() {
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 64
    const radius = 4.5

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * 0.4))
    }

    return points
  }, [])

  return (
    <>
      {/* Orbital ring */}
      <Line
        points={linePoints}
        color="#0067FF"
        lineWidth={1.5}
        transparent={true}
        opacity={0.3}
        dashed={false}
      />

      {/* Vertical connection lines to data nodes (subtle) */}
      {ORBITAL_NODES.map((node, idx) => {
        const angle = node.angle
        const x = Math.cos(angle) * 4.5
        const z = Math.sin(angle) * 4.5 * 0.4
        return (
          <Line
            key={`connection-${idx}`}
            points={[
              [0, 0, 0],
              [x, 0, z],
            ]}
            color={node.color}
            lineWidth={0.75}
            transparent={true}
            opacity={0.15}
          />
        )
      })}
    </>
  )
}

// Enhanced particle system with color gradient
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 1200
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Start positions in sphere
      const theta = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * Math.PI * 2
      const phi = (Math.sin(i * 78.233) * 19341.123 % 1 + 1) % 1 * Math.PI
      const r = ((Math.sin(i * 37.719) * 9713.531 % 1 + 1) % 1) * 3

      pos[i3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i3 + 1] = Math.cos(phi) * r
      pos[i3 + 2] = Math.sin(phi) * Math.sin(theta) * r
    }

    return pos
  }, [])

  useFrame(() => {
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position
      const pos = positionAttr.array as Float32Array
      const time = Date.now() * 0.0003

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Convergence/divergence wave
        const distance = Math.sqrt(pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2)
        const convergence = Math.sin(time * 0.5 - distance * 0.3) * 0.5 + 0.5

        // Towards center when convergence high, outward when low
        const targetDist = 0.5 + convergence * 2.5
        const pull = Math.min(targetDist / (distance || 0.1), 1.02)

        pos[i3] *= 0.985 * pull
        pos[i3 + 1] *= 0.985 * pull
        pos[i3 + 2] *= 0.985 * pull

        // Add some drift
        pos[i3] += Math.sin(time + i) * 0.02
        pos[i3 + 1] += Math.cos(time + i * 0.5) * 0.01
        pos[i3 + 2] += Math.sin(time * 0.7 + i * 0.3) * 0.02
      }

      positionAttr.needsUpdate = true
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        sizeAttenuation={true}
        size={0.08}
        color="#0067FF"
        transparent={true}
        opacity={0.7}
      />
    </Points>
  )
}

// Dynamic light rays effect
function LightRays() {
  return (
    <>
      {/* Multiple colored light sources for rays */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#0067FF" distance={20} />
      <pointLight position={[2, 1, 2]} intensity={1.5} color="#00D9FF" distance={15} />
      <pointLight position={[-2, -1, -2]} intensity={1.5} color="#9D4EDD" distance={15} />
    </>
  )
}

// Main convergence scene
function ConvergenceScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ camera }) => {
    if (cameraRef.current) {
      // Auto rotate camera slightly
      const time = Date.now() * 0.0001
      camera.position.x = Math.cos(time) * 7
      camera.position.z = Math.sin(time) * 7
    }
  })

  return (
    <>
      <LightRays />
      <CoreSphere />
      <GlowingCore />
      <ParticleField />
      <OrbitalLines />
      {ORBITAL_NODES.map((node, index) => (
        <DataNode key={index} node={node} index={index} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
    </>
  )
}

// Main component with full-screen immersive experience
export function HeroConvergenceScene() {
  const [showText, setShowText] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleCanvasHover = () => {
    setShowText(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_75%_45%,rgba(0,103,255,0.20),transparent_34%),linear-gradient(135deg,#fbfbf8_0%,#f3f6fb_48%,#e9eef7_100%)]"
      onMouseEnter={handleCanvasHover}
    >
      <div className="absolute inset-0 grid-bg grid-bg-drift opacity-60" />
      <motion.div
        className="absolute left-[-12%] top-[18%] h-[34rem] w-[34rem] rounded-full bg-accent-primary/10 blur-3xl"
        animate={{ x: [0, 28, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent-amber/10 blur-3xl"
        animate={{ x: [0, -22, 0], y: [0, 16, 0], scale: [1, 0.94, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3D Canvas - product visualization */}
      <div className="absolute inset-y-0 right-0 z-0 w-full lg:w-[64%]">
        <Canvas
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
          camera={{
            position: [7, 3, 7],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
        >
          <ConvergenceScene />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-bg-raised via-bg-raised/78 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[6] w-full bg-gradient-to-l from-accent-primary/10 via-transparent to-transparent" />

      {/* Text overlay */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 px-6 lg:grid-cols-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: showText ? 1 : 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-2xl space-y-7 lg:col-span-6 pointer-events-auto select-text">


            <div className="space-y-4">
              <h1 className="font-display text-5xl font-extrabold leading-[0.96] tracking-[-0.05em] text-text-primary md:text-7xl">
                Forensic hiring, without the black box.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                Hiring Wallah converts resumes and job requirements into transparent agent reasoning, weighted consensus scores, and signed reports recruiters can defend.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pointer-events-auto">
              <Link href="/auth?mode=signup" className="group inline-flex items-center justify-center gap-2 rounded-xl border border-accent-primary bg-accent-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-apple hover:bg-accent-primary/95">
                Create account
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link href="/recruiter" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface/80 px-6 py-3 text-sm font-bold text-text-primary shadow-sm backdrop-blur-md transition-apple hover:border-accent-primary/30 hover:bg-bg-raised">
                <Briefcase className="h-4 w-4 text-accent-primary" />
                Open recruiter demo
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {[
                { icon: FileSearch, label: 'Resume evidence', value: 'Parsed' },
                { icon: User, label: 'Candidate fit', value: 'Scored' },
                { icon: ShieldCheck, label: 'Decision trail', value: 'Signed' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-surface/70 p-3 shadow-sm backdrop-blur-md">
                  <item.icon className="mb-2 h-4 w-4 text-accent-primary" />
                  <div className="text-sm font-bold leading-none text-text-primary">{item.value}</div>
                  <div className="type-label mt-1 text-[10px] text-text-tertiary">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>



      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 hidden text-text-tertiary text-sm font-medium sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore →
      </motion.div>
    </div>
  )
}
