'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Search,
  Brain,
  FileSearch,
  BarChart3,
  ShieldAlert,
  Users,
} from 'lucide-react';

// Agent icon mappings with lucide icons
export const AGENT_ICONS = {
  Parser: { icon: Search, color: '#0067FF', desc: 'Parses job requirements and candidate profiles' },
  Strategist: { icon: Brain, color: '#4A5D78', desc: 'Sets role strategy and scoring weights' },
  Analyst: { icon: FileSearch, color: '#0D1B2E', desc: 'Extracts evidence from projects and timelines' },
  Evaluator: { icon: BarChart3, color: '#E37400', desc: 'Scores candidate fit against the rubric' },
  Advocate: { icon: ShieldAlert, color: '#D93025', desc: 'Challenges inflated claims and missing proof' },
  Committee: { icon: Users, color: '#0F9D58', desc: 'Facilitates consensus and final decision' },
};

// 3D SVG Icon Wrapper - Displays 2D SVG with 3D perspective rotation
interface Icon3DProps {
  icon: React.ElementType;
  color: string;
  size?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  interactive?: boolean;
}

export function Icon3D({
  icon: IconComponent,
  color,
  size = 64,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  interactive = false,
}: Icon3DProps) {
  const [rotation, setRotation] = useState({ x: rotateX, y: rotateY, z: rotateZ });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientY - rect.top) / rect.height - 0.5;
      const y = (e.clientX - rect.left) / rect.width - 0.5;

      setRotation({
        x: x * 30,
        y: y * 30,
        z: 0,
      });
    };

    const handleMouseLeave = () => {
      setRotation({ x: rotateX, y: rotateY, z: rotateZ });
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive, rotateX, rotateY, rotateZ]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        perspective: '1000px',
        width: size + 32,
        height: size + 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        style={{
          rotateX: `${rotation.x}deg`,
          rotateY: `${rotation.y}deg`,
          rotateZ: `${rotation.z}deg`,
        }}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          rotateZ: rotation.z,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
        }}
      >
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}20, ${color}05)`,
            border: `2px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 30px ${color}30, inset 0 0 20px ${color}10`,
          }}
        >
          {React.createElement(IconComponent, { size, color, strokeWidth: 1.5 })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// 3D Canvas Icon - Renders icon in a Three.js canvas with rotation
interface CanvasIcon3DProps {
  icon: React.ElementType;
  color: string;
  agentName: string;
  size?: number;
}

function CanvasIconScene({
  color,
}: {
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.006;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

export function CanvasIcon3D({
  icon: IconComponent,
  color,
  agentName,
  size = 120,
}: CanvasIcon3DProps) {
  return (
    <div aria-label={`${agentName} 3D icon`} style={{ width: size, height: size, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
      <Canvas>
        <CanvasIconScene color={color} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color={color} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {React.createElement(IconComponent, { size: Math.round(size * 0.36), color: '#ffffff', strokeWidth: 1.7 })}
      </div>
    </div>
  );
}

// Icon Grid Component - Displays all 6 agent icons
export function AgentIconGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {Object.entries(AGENT_ICONS).map(([agentName, { icon, color, desc }]) => (
        <motion.div
          key={agentName}
          className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          whileHover={{ scale: 1.05, backgroundColor: `${color}15` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon3D icon={icon} color={color} size={48} interactive={true} />
          <div className="text-center">
            <h3 className="font-semibold text-white text-sm">{agentName}</h3>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Icon Showcase Component - Large animated icon display
export function IconShowcase({
  agentName,
  size = 140,
}: {
  agentName: keyof typeof AGENT_ICONS;
  size?: number;
}) {
  const agent = AGENT_ICONS[agentName];

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Glow background */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40"
          style={{ backgroundColor: agent.color }}
        />

        {/* Icon container */}
        <Icon3D
          icon={agent.icon}
          color={agent.color}
          size={size}
          interactive={true}
        />
      </div>

      <div className="text-center max-w-xs">
        <h2 className="text-2xl font-bold text-white">{agentName}</h2>
        <p className="text-sm text-gray-400 mt-2">{agent.desc}</p>
      </div>
    </motion.div>
  );
}

// Icon Badge - Small icon for use in cards/sections
export function IconBadge({
  agentName,
  size = 40,
}: {
  agentName: keyof typeof AGENT_ICONS;
  size?: number;
}) {
  const agent = AGENT_ICONS[agentName];

  return (
    <Icon3D
      icon={agent.icon}
      color={agent.color}
      size={size}
      interactive={false}
    />
  );
}

// Animated Icon Row - Shows all icons in a row (for feature section)
export function AnimatedIconRow() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 w-full">
      {Object.entries(AGENT_ICONS).map(([agentName, { icon, color }], index) => (
        <motion.div
          key={agentName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.15, rotate: 5 }}
        >
          <Icon3D
            icon={icon}
            color={color}
            size={56}
            interactive={false}
            rotateY={(index % 3) * 10 - 10}
          />
        </motion.div>
      ))}
    </div>
  );
}
