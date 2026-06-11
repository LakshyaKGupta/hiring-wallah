'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Individual ledger block in the chain
function LedgerBlock({ position, delay }: { position: [number, number, number]; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      const time = Date.now() * 0.001 + delay
      // Slow vertical scroll
      groupRef.current.position.y = position[1] - (time * 0.8) % 15
      // Slight rotation
      groupRef.current.rotation.x += 0.001
      groupRef.current.rotation.y += 0.0015
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshPhongMaterial
          color="#0067FF"
          emissive="#0067FF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.4}
          shininess={100}
        />
      </mesh>
      {/* Wireframe outline */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshBasicMaterial wireframe color="#0067FF" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// Connection lines between blocks
function LedgerConnections() {
  const lineGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (lineGroupRef.current) {
      lineGroupRef.current.position.y -= 0.008
      // Wrap around for infinite scroll
      if (lineGroupRef.current.position.y < -15) {
        lineGroupRef.current.position.y = 0
      }
    }
  })

  return (
    <group ref={lineGroupRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Line
          key={i}
          points={[
            [0, 0.4 + i * 1.5, 0],
            [0, 0 + (i + 1) * 1.5, 0],
          ]}
          color="#10A45E"
          transparent
          opacity={0.4}
          lineWidth={0.5}
        />
      ))}
    </group>
  )
}

// Particle field for ledger ledger visualization
function LedgerParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200

  useEffect(() => {
    if (particlesRef.current && particlesRef.current.geometry) {
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10
        positions[i + 1] = (Math.random() - 0.5) * 20
        positions[i + 2] = (Math.random() - 0.5) * 5
      }
      particlesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )
    }
  }, [])

  useFrame(() => {
    if (particlesRef.current && particlesRef.current.geometry) {
      const positionAttr = particlesRef.current.geometry.attributes.position
      if (!positionAttr) return

      const pos = positionAttr.array as Float32Array
      const time = Date.now() * 0.001

      for (let i = 0; i < particleCount * 3; i += 3) {
        // Slow downward drift
        pos[i + 1] -= 0.01
        // Wrap around
        if (pos[i + 1] < -10) {
          pos[i + 1] = 10
        }
        // Slight horizontal sway
        pos[i] += Math.sin(time * 0.5 + i * 0.01) * 0.005
      }

      positionAttr.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef} frustumCulled={false}>
      <bufferGeometry />
      <pointsMaterial
        color="#10A45E"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.4}
      />
    </points>
  )
}

// Main 3D scene
function LedgerChainScene() {
  return (
    <>
      <color attach="background" args={['#FFFFFF']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 10, 5]} intensity={0.6} color="#0067FF" />
      <pointLight position={[-5, -10, -5]} intensity={0.3} color="#10A45E" />

      {/* Ledger blocks chain */}
      <group>
        {Array.from({ length: 15 }).map((_, i) => (
          <LedgerBlock
            key={i}
            position={[0, i * 1.5 - 5, 0]}
            delay={i * 0.1}
          />
        ))}
      </group>

      <LedgerConnections />
      <LedgerParticles />

      {/* Fixed camera looking at the descending chain */}
    </>
  )
}

export function LedgerChainBackground() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <Canvas
        camera={{
          position: [3, 0, 6],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
      >
        <React.Suspense fallback={null}>
          <LedgerChainScene />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
