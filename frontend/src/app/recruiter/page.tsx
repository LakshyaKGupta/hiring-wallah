'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Upload, Play, CheckCircle2, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Job {
  id: string
  title: string
  company: string
  description: string
  requirement_analysis?: any
  evaluation_framework?: any
}

export default function RecruiterDashboard() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  
  // Forms
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newDescription, setNewDescription] = useState('')
  
  // Uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  
  // Pipeline Running States
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const pipelineSteps = [
    { label: 'Requirement Analyst', desc: 'Agent 1 deconstructing JD into structured must-haves & flags' },
    { label: 'Hiring Strategist', desc: 'Agent 2 creating weighted rubric framework' },
    { label: 'Resume Investigator', desc: 'Agent 3 forensically parsing and extracting resume evidence' },
    { label: 'Candidate Evaluator', desc: 'Agent 4 scoring profile strictly against rubric' },
    { label: "Devil's Advocate", desc: 'Agent 5 challenging claims and adjusting confidence scores' },
    { label: 'Hiring Committee', desc: 'Agent 6 synthesizing reports and rendering verdicts' }
  ]

  // Load jobs list
  const loadJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`)
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
        if (data.length > 0 && !selectedJob && !isCreatingJob) {
          setSelectedJob(data[0])
        }
      }
    } catch (e) {
      console.error('Error fetching jobs:', e)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  // Create Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newDescription) return
    
    setIsRunning(true)
    setCurrentStep(0) // Start requirement analyst animations
    setErrorMsg('')

    // Run simulated steps 1-2 progress
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 1) {
          clearInterval(interval)
          return 1
        }
        return prev + 1
      })
    }, 1200)

    try {
      const res = await fetch(`${API_URL}/recruiter/job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          company: newCompany,
          description: newDescription
        })
      })

      clearInterval(interval)

      if (res.ok) {
        const job = await res.json()
        setJobs(prev => [job, ...prev])
        setSelectedJob(job)
        setIsCreatingJob(false)
        setNewTitle('')
        setNewCompany('')
        setNewDescription('')
      } else {
        const err = await res.json()
        setErrorMsg(err.detail || 'Failed to create job rubric.')
      }
    } catch (e) {
      clearInterval(interval)
      setErrorMsg('Server connection failed.')
    } finally {
      setIsRunning(false)
      setCurrentStep(0)
    }
  }

  // Handle Drag & Drop Files
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
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx))
  }

  // Run Pipeline on Resume uploads
  const handleRunPipeline = async () => {
    if (!selectedJob || uploadedFiles.length === 0) return
    setIsRunning(true)
    setCurrentStep(2) // Jump directly to Agent 3: Resume Investigator
    setErrorMsg('')

    // Animate through agents 3, 4, 5, 6
    const totalSteps = 6
    const stepInterval = 4000 // 4 seconds per agent
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps - 1) {
          return prev
        }
        return prev + 1
      })
    }, stepInterval)

    try {
      const formData = new FormData()
      formData.append('job_id', selectedJob.id)
      uploadedFiles.forEach(file => {
        formData.append('resumes', file)
      })

      const res = await fetch(`${API_URL}/recruiter/evaluate`, {
        method: 'POST',
        body: formData
      })

      clearInterval(interval)

      if (res.ok) {
        // Redirect to results page
        router.push(`/recruiter/results/${selectedJob.id}`)
      } else {
        const err = await res.json()
        setErrorMsg(err.detail || 'Evaluation pipeline failed.')
        setIsRunning(false)
      }
    } catch (e) {
      clearInterval(interval)
      setErrorMsg('Connection to backend failed.')
      setIsRunning(false)
    }
  }

  return (
    <div className="flex-1 flex bg-bg-deep overflow-hidden h-[calc(100vh-4rem)]">
      
      {/* 1. Left Sidebar: Job list */}
      <aside className="w-80 border-r border-border-subtle bg-bg-surface flex flex-col shrink-0">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="font-display font-bold text-md tracking-wider text-text-primary uppercase">
            Hiring Positions
          </h2>
          <button 
            onClick={() => {
              setIsCreatingJob(true)
              setSelectedJob(null)
            }}
            className="w-7 h-7 rounded bg-accent-primary/10 border border-accent-primary/20 hover:bg-accent-primary hover:text-white flex items-center justify-center text-accent-primary transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => {
                setSelectedJob(job)
                setIsCreatingJob(false)
                setUploadedFiles([])
                setErrorMsg('')
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                selectedJob?.id === job.id 
                  ? 'bg-bg-raised border border-accent-primary/30 text-text-primary' 
                  : 'hover:bg-bg-raised/40 text-text-secondary border border-transparent'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0 text-text-tertiary" />
              <div className="truncate">
                <p className="font-semibold text-sm truncate">{job.title}</p>
                <p className="text-[10px] text-text-tertiary truncate font-mono uppercase">{job.company || 'Private Co'}</p>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-8 text-xs text-text-tertiary">
              No jobs configured. Click + to setup.
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        
        {/* Loader Overlays */}
        {isRunning && (
          <div className="absolute inset-0 bg-bg-deep/90 z-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xl bg-bg-surface border border-border-subtle rounded-xl p-8 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
                <h3 className="font-display font-bold text-lg text-text-primary tracking-wide">
                  RUNNING ASSESSMENT COMMITTEE PIPELINE
                </h3>
              </div>

              <div className="space-y-4">
                {pipelineSteps.map((step, idx) => {
                  const isActive = idx === currentStep
                  const isDone = idx < currentStep
                  return (
                    <div 
                      key={step.label} 
                      className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-500 ${
                        isActive 
                          ? 'border-accent-primary bg-accent-primary/5 glow-pulse' 
                          : isDone 
                            ? 'border-accent-green/20 bg-accent-green/5 opacity-60' 
                            : 'border-border-subtle opacity-30'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-mono font-bold tracking-wider uppercase text-text-primary">
                          {step.label}
                        </p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{step.desc}</p>
                      </div>
                      <div>
                        {isDone ? (
                          <span className="text-[10px] font-mono text-accent-green font-bold uppercase">DONE</span>
                        ) : isActive ? (
                          <span className="text-[10px] font-mono text-accent-primary font-bold uppercase animate-pulse">PROCESSING...</span>
                        ) : (
                          <span className="text-[10px] font-mono text-text-tertiary font-bold uppercase">WAITING</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- CREATE NEW JOB FORM --- */}
        {isCreatingJob && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-border-subtle pb-4">
              <Sparkles className="w-5 h-5 text-accent-primary" />
              <h1 className="font-display font-bold text-xl text-text-primary tracking-wide">
                CREATE POSITION EVALUATION STRATEGY
              </h1>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-accent-red/5 border border-accent-red/20 text-accent-red text-xs rounded">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full bg-bg-deep border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. LakshyaCorp"
                    className="w-full bg-bg-deep border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
                  Full Job Description *
                </label>
                <textarea
                  required
                  rows={8}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Paste the full job requirements, skills, guidelines, responsibilities..."
                  className="w-full bg-bg-deep border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent-primary hover:bg-white hover:text-accent-primary text-white rounded font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Requirements Analysis (Agent 1 + 2)</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* --- DISPLAY SELECTED JOB Rubrics & Resume dropzone --- */}
        {selectedJob && (
          <div className="space-y-6 max-w-4xl">
            {/* Title block */}
            <div className="border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
                  {selectedJob.title}
                </h1>
                <p className="text-xs text-text-secondary font-mono uppercase tracking-wide mt-1">
                  {selectedJob.company || 'Private Co'}
                </p>
              </div>

              <Link href={`/recruiter/results/${selectedJob.id}`}>
                <div className="px-4 py-2 border border-accent-primary/20 bg-accent-primary/5 hover:bg-accent-primary/10 text-accent-primary font-mono text-xs uppercase tracking-wider rounded transition-colors">
                  View Ranked Results
                </div>
              </Link>
            </div>

            {errorMsg && (
              <div className="p-3 bg-accent-red/5 border border-accent-red/20 text-accent-red text-xs rounded">
                {errorMsg}
              </div>
            )}

            {/* Rubrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Requirements summary (Agent 1) */}
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
                <h3 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-3">
                  Parsed Job Requirements
                </h3>
                <div className="space-y-3 text-xs">
                  {selectedJob.requirement_analysis ? (
                    <>
                      <div>
                        <span className="font-mono text-[10px] text-accent-primary block uppercase mb-1">Must Have</span>
                        <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                          {selectedJob.requirement_analysis.must_have?.slice(0, 4).map((m: string) => (
                            <li key={m} className="truncate">{m}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-accent-da block uppercase mb-1">Red Flags</span>
                        <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                          {selectedJob.requirement_analysis.red_flags?.slice(0, 3).map((r: string) => (
                            <li key={r} className="truncate">{r}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-text-tertiary">No requirements parsed.</p>
                  )}
                </div>
              </div>

              {/* Rubric evaluation (Agent 2) */}
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-5">
                <h3 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-3">
                  Weighted scoring Rubric
                </h3>
                <div className="space-y-3">
                  {selectedJob.evaluation_framework?.evaluation_framework ? (
                    Object.entries(selectedJob.evaluation_framework.evaluation_framework).map(([dim, weight]) => (
                      <div key={dim} className="flex items-center justify-between text-xs font-mono border-b border-border-subtle/50 pb-1.5 last:border-b-0">
                        <span className="text-text-secondary uppercase">{dim.replace('_', ' ')}</span>
                        <span className="text-accent-primary font-bold">{weight as number}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-text-tertiary text-xs">No scoring framework found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload Zone */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
              <h3 className="text-xs uppercase font-mono tracking-widest text-text-tertiary mb-4">
                Candidate Resume Assessment
              </h3>

              {/* Dropzone container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${
                  isDragOver 
                    ? 'border-accent-primary bg-accent-primary/5' 
                    : 'border-border-subtle hover:border-accent-primary/40'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-text-tertiary mb-3 group-hover:text-accent-primary transition-colors" />
                <p className="text-sm font-semibold text-text-primary">
                  Drag & Drop PDF Resumes
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  Supports multiple PDF files up to 10.
                </p>
              </div>

              {/* Uploaded File Chip list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider block">
                    Staged Resumes ({uploadedFiles.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="bg-bg-deep border border-border-subtle px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                        <span className="text-text-secondary truncate max-w-[180px]">
                          {file.name}
                        </span>
                        <button 
                          onClick={() => removeFile(idx)}
                          className="text-accent-da hover:text-white font-bold text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Run Pipeline Trigger Button */}
                  <button
                    onClick={handleRunPipeline}
                    className="w-full mt-4 py-3 bg-accent-primary hover:bg-white hover:text-accent-primary text-white rounded font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Committee Assessment Chain</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
