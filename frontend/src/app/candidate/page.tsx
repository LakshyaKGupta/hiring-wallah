'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCheck, Upload, ArrowLeft, Loader2, Sparkles, AlertOctagon } from 'lucide-react'
import AgentOrb from '@/components/ui/AgentOrb'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CandidateDashboard() {
  const router = useRouter()
  
  const [targetRole, setTargetRole] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const pipelineSteps = [
    'Parsing PDF & Extracting Resume Text',
    'Investigating project evidence & achievements',
    'Analyzing target role criteria & prerequisites',
    'Evaluating skill gaps & drafting improvements',
    'Composing optimized custom cover letter',
    'Building STAR interview preparation questions'
  ]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/pdf') {
        setResumeFile(file)
      } else {
        setErrorMsg('Only PDF files are supported.')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf') {
        setResumeFile(file)
      } else {
        setErrorMsg('Only PDF files are supported.')
      }
    }
  }

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile || !targetRole) return

    setIsRunning(true)
    setCurrentStep(0)
    setErrorMsg('')

    // Animate through candidate pipeline steps
    const stepInterval = 2500 // 2.5s per step
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 5) {
          return prev
        }
        return prev + 1
      })
    }, stepInterval)

    try {
      const formData = new FormData()
      formData.append('target_role', targetRole)
      formData.append('resume', resumeFile)

      const res = await fetch(`${API_URL}/candidate/analyze`, {
        method: 'POST',
        body: formData
      })

      clearInterval(interval)

      if (res.ok) {
        const data = await res.json()
        const sessionId = data.session.id
        router.push(`/candidate/report/${sessionId}`)
      } else {
        const err = await res.json()
        setErrorMsg(err.detail || 'Candidate profile analysis failed.')
        setIsRunning(false)
      }
    } catch (e) {
      clearInterval(interval)
      setErrorMsg('Could not connect to backend service.')
      setIsRunning(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg-deep overflow-hidden flex flex-col font-sans">
      
      {/* 3D background */}
      <AgentOrb />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="w-9 h-9 rounded-full border border-border-subtle hover:border-accent-primary flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display font-bold text-xl text-text-primary tracking-wide">
            Application Strategist
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 relative z-10 w-full">
        
        {/* Loading Overlay */}
        {isRunning && (
          <div className="absolute inset-0 bg-bg-deep/95 z-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg bg-bg-surface border border-border-subtle rounded-xl p-8 shadow-sm text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
                <h3 className="font-display font-bold text-lg text-text-primary tracking-wide uppercase">
                  Analyzing Job Fit Strategy
                </h3>
              </div>

              <div className="space-y-3 text-left">
                {pipelineSteps.map((step, idx) => {
                  const isActive = idx === currentStep
                  const isDone = idx < currentStep
                  return (
                    <div 
                      key={step} 
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-all duration-500 flex items-center justify-between ${
                        isActive 
                          ? 'border-accent-primary bg-accent-primary/5 glow-pulse text-text-primary' 
                          : isDone 
                            ? 'border-accent-green/20 bg-accent-green/5 text-text-secondary opacity-60' 
                            : 'border-border-subtle text-text-tertiary opacity-30'
                      }`}
                    >
                      <span>{step}</span>
                      <span>
                        {isDone ? '✓' : isActive ? '...' : 'WAITING'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-bg-surface border border-border-subtle rounded-xl p-6 md:p-8 shadow-2xl relative"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-4">
            <Sparkles className="w-5 h-5 text-accent-primary" />
            <div>
              <h1 className="font-display font-bold text-xl text-text-primary tracking-wide uppercase">
                Analyze Candidate Profile
              </h1>
              <span className="text-[10px] text-text-tertiary font-mono tracking-wider block mt-0.5">
                Optimize your application matching for any target role
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 bg-accent-red/5 border border-accent-red/20 text-accent-red text-xs rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRunAnalysis} className="space-y-6">
            {/* Target Role Input */}
            <div>
              <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1.5">
                Target Role / Title *
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-bg-deep border border-border-subtle rounded px-3 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
              />
            </div>

            {/* Resume dropzone */}
            <div>
              <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1.5">
                Upload Resume (PDF only) *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${
                  isDragOver 
                    ? 'border-accent-primary bg-accent-primary/5' 
                    : 'border-border-subtle hover:border-accent-primary/35'
                }`}
              >
                <input
                  type="file"
                  required={!resumeFile}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-text-tertiary mb-3" />
                
                {resumeFile ? (
                  <div>
                    <p className="text-sm font-semibold text-accent-primary">
                      {resumeFile.name}
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Drag & Drop Your Resume
                    </p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">
                      Click to browse files locally
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Trigger button */}
            <button
              type="submit"
              disabled={!resumeFile || !targetRole}
              className="w-full py-3.5 bg-accent-primary hover:bg-white hover:text-accent-primary text-white border border-accent-primary disabled:opacity-40 disabled:hover:bg-accent-primary disabled:hover:text-white rounded font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span>Analyze My Profile</span>
            </button>
          </form>
        </motion.div>

      </main>

    </div>
  )
}
