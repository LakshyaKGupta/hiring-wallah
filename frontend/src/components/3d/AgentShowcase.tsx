'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon3D, AGENT_ICONS } from './AgentIcons3D';

// Enhanced Agent Showcase Card with 3D Icon
interface AgentShowcaseCardProps {
  agentName: keyof typeof AGENT_ICONS;
  index: number;
}

function AgentShowcaseCard({ agentName, index }: AgentShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const agent = AGENT_ICONS[agentName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Background gradient card */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"
        style={{
          backgroundImage: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
        }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
      />

      {/* Card content */}
      <div
        className="relative rounded-2xl border-2 p-8 flex flex-col items-center text-center h-full backdrop-blur-sm transition-all duration-300"
        style={{
          borderColor: `${agent.color}40`,
          backgroundColor: `${agent.color}05`,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: agent.color }}
        />

        {/* 3D Icon */}
        <motion.div
          className="mb-6"
          animate={{
            y: isHovered ? -8 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon3D
            icon={agent.icon}
            color={agent.color}
            size={72}
            interactive={true}
          />
        </motion.div>

        {/* Agent Name */}
        <motion.h3
          className="text-2xl font-bold mb-3 leading-tight"
          style={{ color: agent.color }}
        >
          {agentName}
        </motion.h3>

        {/* Agent Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
          {agent.desc}
        </p>

        {/* Action indicator */}
        <motion.div
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: `${agent.color}80` }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
        >
          Click to learn more →
        </motion.div>
      </div>
    </motion.div>
  );
}

// Full Agent Showcase Section
export function AgentShowcaseSection() {
  return (
    <section
      id="agents-showcase"
      className="w-full min-h-screen flex flex-col justify-center py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-16"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
            Core Team
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Six Specialized AI Agents
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Each agent brings specialized expertise to the hiring evaluation process. Together, they form a transparent, auditable, and fair hiring system.
          </p>
        </motion.div>

        {/* 6 Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(AGENT_ICONS).map((agentName, index) => (
            <AgentShowcaseCard
              key={agentName}
              agentName={agentName as keyof typeof AGENT_ICONS}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto text-center p-8 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Collaborative Intelligence
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Unlike traditional AI hiring tools that operate as a black box, Hiring Wallah&apos;s multi-agent system makes every decision transparent. You can see each agent&apos;s reasoning, understand how consensus was reached, and audit the entire evaluation trail.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
