'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function NodeNetwork() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const count = 50
  const connectionThreshold = 4.0
  
  // Generate random starting positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
      
      vel[i * 3] = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008
    }
    return [pos, vel]
  }, [])
  
  useFrame(() => {
    const points = pointsRef.current
    const lines = linesRef.current
    
    if (!points || !lines) return
    
    // Slow rotational drift
    points.rotation.y += 0.0005
    points.rotation.x += 0.0002
    lines.rotation.y += 0.0005
    lines.rotation.x += 0.0002
    
    const posAttr = points.geometry.attributes.position
    const positionsArr = posAttr.array as Float32Array
    
    // Move nodes and bounce within virtual boundaries
    for (let i = 0; i < count; i++) {
      const idx = i * 3
      positionsArr[idx] += velocities[idx]
      positionsArr[idx + 1] += velocities[idx + 1]
      positionsArr[idx + 2] += velocities[idx + 2]
      
      if (Math.abs(positionsArr[idx]) > 7) velocities[idx] *= -1
      if (Math.abs(positionsArr[idx + 1]) > 7) velocities[idx + 1] *= -1
      if (Math.abs(positionsArr[idx + 2]) > 7) velocities[idx + 2] *= -1
    }
    posAttr.needsUpdate = true
    
    // Recalculate node connections
    const connections: number[] = []
    for (let i = 0; i < count; i++) {
      const x1 = positionsArr[i * 3]
      const y1 = positionsArr[i * 3 + 1]
      const z1 = positionsArr[i * 3 + 2]
      
      for (let j = i + 1; j < count; j++) {
        const x2 = positionsArr[j * 3]
        const y2 = positionsArr[j * 3 + 1]
        const z2 = positionsArr[j * 3 + 2]
        
        const dist = Math.sqrt(
          (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2
        )
        
        if (dist < connectionThreshold) {
          connections.push(x1, y1, z1, x2, y2, z2)
        }
      }
    }
    
    const lineGeo = lines.geometry
    const newPositions = new Float32Array(connections)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    if (lineGeo.attributes.position) {
      lineGeo.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#6366F1"
          size={0.10}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
        />
      </points>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#6366F1"
          transparent={true}
          opacity={0.12}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}

export default function AgentOrb() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <div className="absolute inset-0 bg-transparent" />
  }
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <NodeNetwork />
      </Canvas>
    </div>
  )
}
