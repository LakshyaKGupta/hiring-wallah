'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ArrowLeft, RefreshCw, Copy, Check, Target, Compass, BookOpen, Layers, Edit2, FileText, CheckCircle } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import MeshBackground from '@/components/ui/MeshBackground'
import { appleTransition } from '@/lib/motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20
    }
  }
}

interface SessionDetail {
  session: {
    id: string
    candidate_id: string
    target_role: string
    fit_score: number
    skill_gaps: Record<string, string>
    tailored_resume_suggestions: Record<string, string>
    cover_letter: string
    interview_prep: Record<string, string>
    job_recommendations?: unknown
    created_at: string
  }
  candidate: {
    id: string
    name: string
    email: string
  }
}

export default function CandidateReportPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params?.sessionId as string

  const [data, setData] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'fit' | 'gaps' | 'resume' | 'cover' | 'interview'>('fit')
  
  // Interactions
  const [copiedCover, setCopiedCover] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/candidate/report/${sessionId}`)
      if (res.ok) {
        const report = await res.json()
        setData(report)
      }
    } catch (e) {
      console.error('Error fetching candidate report:', e)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    let active = true
    if (sessionId) {
      const handle = requestAnimationFrame(() => {
        if (active) {
          fetchReport()
        }
      })
      return () => {
        active = false
        cancelAnimationFrame(handle)
      }
    }
  }, [sessionId, fetchReport])

  const copyCoverLetter = () => {
    if (!data) return
    navigator.clipboard.writeText(data.session.cover_letter)
    setCopiedCover(true)
    setTimeout(() => setCopiedCover(false), 2000)
  }

  const toggleFlip = (key: string) => {
    setFlippedCards(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className="flex-1 bg-bg-deep flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="w-8 h-8 text-accent-primary animate-spin" />
        <span className="type-label text-text-tertiary">
          Compiling coach suggestions...
        </span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 bg-bg-deep flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-secondary text-sm mb-4">Candidate report details not found.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-bg-surface border border-border-subtle text-caption font-sans font-medium rounded text-text-primary hover:border-accent-primary"
        >
          Go Back
        </button>
      </div>
    )
  }

  const session = data.session
  const candidate = data.candidate

  // Radar Chart data formatting
  const chartData = Object.entries(session.skill_gaps).map(([skill, gapDesc]) => {
    const isMajorGap = gapDesc.toLowerCase().includes('lacks') || gapDesc.toLowerCase().includes('no evidence') || gapDesc.toLowerCase().includes('missing')
    return {
      subject: skill.length > 18 ? skill.slice(0, 15) + '...' : skill,
      Candidate: isMajorGap ? 40 : 80,
      Required: 100,
      fullMark: 100
    }
  })

  // Fit score visual settings
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (session.fit_score / 100) * circumference

  return (
    <div className="flex-1 bg-bg-deep min-h-screen text-text-primary font-sans flex flex-col relative">
      {/* Zoho Grid backdrop with Mesh Blobs */}
      <MeshBackground opacity={0.2} />

      {/* Sub Header */}
      <header className="border-b border-border-subtle bg-bg-surface py-4 px-6 sticky top-16 z-40 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/candidate" 
              className="w-9 h-9 rounded-full border border-border-subtle hover:border-accent-primary flex items-center justify-center text-text-secondary hover:text-accent-primary transition-apple"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="type-caption text-text-tertiary block">
                Application Blueprint
              </span>
              <h1 className="text-xl font-display font-extrabold text-text-primary tracking-tight">
                Targeting: {session.target_role}
              </h1>
            </div>
          </div>
          <div className="type-mono text-right text-xs text-text-secondary">
            Candidate: <span className="font-bold text-text-primary">{candidate.name}</span>
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="bg-bg-surface border-b border-border-subtle sticky top-[133px] z-30 font-sans">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-6 py-2">
            {[
              { id: 'fit', label: 'Fit Score', icon: Target },
              { id: 'gaps', label: 'Skill Gaps', icon: Compass },
              { id: 'resume', label: 'Resume Tips', icon: Edit2 },
              { id: 'cover', label: 'Cover Letter', icon: FileText },
              { id: 'interview', label: 'Interview Prep', icon: BookOpen }
            ].map(tab => {
              const TabIcon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'fit' | 'gaps' | 'resume' | 'cover' | 'interview')}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-caption font-sans font-medium transition-all select-none ${
                    isSelected 
                      ? 'border-accent-primary text-accent-primary' 
                      : 'border-transparent text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Panels content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <AnimatePresence mode="wait">
          {/* TAB 1: FIT SCORE CIRCULAR GAUGE */}
          {activeTab === 'fit' && (
            <motion.div
              key="fit"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* SVG Ring Gauge */}
              <motion.div variants={itemVariants} className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-bg-surface fill-transparent" strokeWidth="10" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="fill-transparent"
                    stroke="#00E5FF"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl type-mono-score font-bold text-text-primary">
                    {session.fit_score}%
                  </span>
                  <span className="text-[10px] text-text-tertiary block type-mono-score">
                    MATCH RATING
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="max-w-xl space-y-4">
                <h2 className="text-xl font-display font-extrabold text-text-primary tracking-tight">
                  Your Alignment for the {session.target_role} role
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed font-sans">
                  Our committee agents evaluated your experience evidence, technology ownership levels, and achievements against the target role requirements. We found key strengths, alongside addressable skill gaps detailed in subsequent tabs.
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 2: SKILL GAPS RADAR CHART */}
          {activeTab === 'gaps' && (
            <motion.div
              key="gaps"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Radar chart visual */}
              <motion.div variants={itemVariants} className="h-[300px] w-full bg-bg-surface/50 border border-border-subtle rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid stroke="#1A3050" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8BA0C0', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#4A6080' }} />
                    <Radar name="Target" dataKey="Required" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.05} />
                    <Radar name="You" dataKey="Candidate" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Gaps list */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="type-label text-text-tertiary">
                  Target Requirements Gaps
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {Object.entries(session.skill_gaps).map(([skill, gapDesc]) => (
                    <div key={skill} className="bg-bg-surface border border-border-subtle rounded-lg p-3">
                      <span className="text-xs type-label font-bold text-accent-primary">
                        {skill}
                      </span>
                      <p className="text-xs text-text-secondary mt-1 font-sans leading-relaxed">
                        {gapDesc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* TAB 3: RESUME SUGGESTIONS SIDE-BY-SIDE */}
          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent-green" />
                <p className="text-xs text-text-secondary">
                  To maximize your fit, optimize your resume bullets. Focus on outcomes and concrete evidence rather than generic summaries.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                {Object.entries(session.tailored_resume_suggestions).map(([orig, sugg], idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border-subtle/50 pb-4 last:border-b-0">
                    {/* Original */}
                    <div className="bg-bg-deep border border-accent-red/15 bg-accent-red/2 p-3 rounded-lg">
                      <span className="text-[9px] text-accent-red type-caption block mb-1 font-bold">
                        Current bullet point
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed font-sans">
                        {orig}
                      </p>
                    </div>

                    {/* Suggestion */}
                    <div className="bg-bg-surface border border-accent-green/20 p-3 rounded-lg">
                      <span className="text-[9px] text-accent-green type-caption block mb-1 font-bold">
                        Optimized suggestion
                      </span>
                      <p className="text-xs text-text-primary leading-relaxed font-sans font-medium">
                        {sugg}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* TAB 4: COVER LETTER TEXTAREA */}
          {activeTab === 'cover' && (
            <motion.div
              key="cover"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="flex justify-between items-center">
                <span className="type-label">
                  Tailored cover letter draft
                </span>

                <button
                  onClick={copyCoverLetter}
                  className="px-3 py-1.5 border border-border-subtle hover:border-accent-primary text-text-secondary hover:text-accent-primary font-sans text-caption font-medium rounded flex items-center gap-1.5 transition-apple bg-bg-surface"
                >
                  {copiedCover ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent-green" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
              </motion.div>

              <motion.textarea
                variants={itemVariants}
                readOnly
                value={session.cover_letter}
                rows={16}
                className="w-full bg-bg-surface border border-border-subtle rounded-xl p-6 text-xs text-text-secondary leading-relaxed focus:outline-none font-sans"
              />
            </motion.div>
          )}

          {/* TAB 5: INTERVIEW PREPARATION FLIP CARDS */}
          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {Object.entries(session.interview_prep).map(([q, ans], idx) => {
                const cardKey = `card-${idx}`
                const isFlipped = !!flippedCards[cardKey]

                return (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    onClick={() => toggleFlip(cardKey)}
                    className="h-44 relative cursor-pointer select-none group"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={appleTransition(0.3)}
                      className="w-full h-full relative"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* FRONT SIDE */}
                      <div 
                        className="absolute inset-0 bg-bg-surface border border-border-subtle hover:border-accent-primary/50 rounded-xl p-5 flex flex-col justify-between"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <span className="text-[9px] text-text-tertiary type-caption block">
                          Interview question #{idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-text-primary font-sans leading-relaxed flex-1 flex items-center">
                          {q}
                        </p>
                        <span className="text-[9px] text-accent-primary type-caption text-right block">
                          Click to reveal strategy ➔
                        </span>
                      </div>

                      {/* BACK SIDE */}
                      <div 
                        className="absolute inset-0 bg-bg-raised border border-accent-primary/20 rounded-xl p-5 flex flex-col justify-between"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <span className="text-[9px] text-accent-primary type-caption block">
                          STAR method answer strategy
                        </span>
                        <div className="flex-1 overflow-y-auto my-2 pr-1">
                          <p className="text-xs text-text-secondary font-sans leading-relaxed">
                            {ans}
                          </p>
                        </div>
                        <span className="text-[9px] text-text-tertiary type-caption text-right block">
                          Click to show question
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  )
}
