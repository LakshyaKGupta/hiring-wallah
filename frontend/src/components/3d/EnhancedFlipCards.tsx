'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icon3D } from './AgentIcons3D';
import { AGENT_ICONS } from './AgentIcons3D';

// Enhanced 3D Flip Card with Agent Icons
interface EnhancedFlip3DCardProps {
  agentName: keyof typeof AGENT_ICONS;
  reasoning: string[];
  color: string;
  index: number;
}

export function EnhancedFlip3DCard({
  agentName,
  reasoning,
  color,
  index,
}: EnhancedFlip3DCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const agent = AGENT_ICONS[agentName];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      className="h-[420px] cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full relative"
      >
        {/* Front side - Icon + Title */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            backgroundColor: `${color}08`,
            borderColor: `${color}40`,
          }}
          className="absolute inset-0 w-full h-full border-2 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Agent Icon */}
          <div className="mb-8">
            <Icon3D
              icon={agent.icon}
              color={color}
              size={72}
              interactive={false}
              rotateY={(index % 3) * 8 - 8}
            />
          </div>

          {/* Title and Description */}
          <h3
            className="text-2xl font-bold mb-3 text-center"
            style={{ color }}
          >
            {agentName}
          </h3>
          <p className="text-text-secondary text-center text-sm leading-relaxed">
            {agent.desc}
          </p>

          {/* Flip hint */}
          <div className="mt-6 text-xs text-gray-400">↻ Hover to reveal reasoning</div>
        </div>

        {/* Back side - Reasoning Terminal */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0F1419',
            borderColor: color,
          }}
          className="absolute inset-0 w-full h-full border-2 rounded-2xl p-6 flex flex-col justify-between shadow-lg overflow-hidden"
        >
          {/* Terminal header */}
          <div className="mb-4">
            <div
              className="text-xs font-mono mb-3"
              style={{ color: `${color}cc` }}
            >
              $ reasoning_{agentName.toLowerCase()}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
          </div>

          {/* Terminal output */}
          <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono">
            {reasoning.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ color: `${color}dd` }}
                className="leading-relaxed"
              >
                <span style={{ color: `${color}66` }}>&gt;</span> {line}
              </motion.div>
            ))}
          </div>

          {/* Terminal footer */}
          <div className="mt-4 pt-4 border-t border-gray-700/30 text-xs" style={{ color: `${color}66` }}>
            ✓ Consensus verified
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced Feature Section with Flip Cards
export function EnhancedFeatureSection() {
  const agentReasonings = {
    Parser: [
      'Parsing job description "Senior React Developer"',
      'Extracting requirements: React, TypeScript, 5+ years',
      'Analyzing resume for matching skills',
      'Found: React (8 years), TypeScript (6 years), Node.js',
      'Match confidence: 94%',
    ],
    Strategist: [
      'Evaluating role tier: Senior (40% exp weight)',
      'Setting rubric: Experience 50%, Skills 30%, Culture 20%',
      'Target score threshold: 75/100 minimum',
      'Weighting distribution: BALANCED',
      'Ready for evaluation phase',
    ],
    Analyst: [
      'Analyzing candidate projects for autonomy level',
      'Project 1: "Built React dashboard" → Independent',
      'Project 2: "Led team refactor" → Leadership',
      'Extracting metrics: 8 years exp, 12 projects',
      'Data quality: VERIFIED',
    ],
    Evaluator: [
      'Scoring React expertise: 92/100',
      'Scoring TypeScript mastery: 88/100',
      'Scoring system design: 85/100',
      'Weighted average: 88.3/100',
      'Verdict: STRONG MATCH',
    ],
    Advocate: [
      '✓ Confirms all claims with project evidence',
      '✗ No leadership experience mentioned',
      '⚠ TypeScript gap in early career',
      'Risk assessment: LOW (recent growth)',
      'Final recommendation: APPROVE with growth plan',
    ],
    Committee: [
      'Aggregating all agent verdicts...',
      'Parser: POSITIVE (94% match)',
      'Evaluator: STRONG (88/100)',
      'Advocate: APPROVE (with growth)',
      'CONSENSUS REACHED: HIRE ✓ (6/6 agents)',
    ],
  };

  return (
    <section
      id="capabilities"
      className="w-full min-h-screen flex flex-col justify-center py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white border-b border-gray-200"
    >
      {/* Background gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

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
            How Agents Reason
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Transparent Multi-Agent Analysis
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Hover each card to witness the reasoning logic of every agent as they evaluate candidates. Every decision is auditable and transparent.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Object.entries(AGENT_ICONS).map(([agentName, { color }], index) => (
            <EnhancedFlip3DCard
              key={agentName}
              agentName={agentName as keyof typeof AGENT_ICONS}
              reasoning={agentReasonings[agentName as keyof typeof agentReasonings]}
              color={color}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-text-secondary mb-6">
            Every hiring decision is auditable. View full evaluation reports and agent transcripts.
          </p>
          <motion.button
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Audit Logs →
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
