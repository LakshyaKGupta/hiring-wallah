'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, RefreshCw, Trophy, FileSearch, ShieldAlert } from 'lucide-react'
import ScoreCard from '@/components/ui/ScoreCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface CandidateResult {
  evaluation_id: string
  profile: {
    id: string
    name: string
  }
  evaluation: {
    score: number
    breakdown: any
    devils_advocate?: any
  }
  decision: {
    id: string
    verdict: string
    confidence: number
    ranking: number
  }
}

export default function ResultsPage() {
  const params = useParams()
  const jobId = params?.jobId as string
  
  const [jobTitle, setJobTitle] = useState('')
  const [results, setResults] = useState<CandidateResult[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchResults = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      // Fetch Job Info
      const jobRes = await fetch(`${API_URL}/jobs`)
      if (jobRes.ok) {
        const jobs = await jobRes.json()
        const job = jobs.find((j: any) => j.id === jobId)
        if (job) setJobTitle(job.title)
      }

      // Fetch Evaluations Results
      const res = await fetch(`${API_URL}/recruiter/job/${jobId}/results`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
      } else {
        setErrorMsg('Failed to load assessment results.')
      }
    } catch (e) {
      setErrorMsg('Could not connect to the backend server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (jobId) {
      fetchResults()
    }
  }, [jobId])

  return (
    <div className="flex-1 bg-bg-deep min-h-screen text-text-primary font-sans flex flex-col relative">
      {/* Zoho Grid backdrop */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-surface py-5 px-6 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/recruiter" 
              className="w-9 h-9 rounded-full border border-border-subtle hover:border-accent-primary flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-widest block">
                Ranked Candidates Summary
              </span>
              <h1 className="text-xl font-display font-bold text-text-primary tracking-wide">
                {jobTitle || 'Evaluation Position'}
              </h1>
            </div>
          </div>

          <button 
            onClick={fetchResults}
            className="w-9 h-9 rounded-full border border-border-subtle hover:border-accent-primary flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Results Body */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-accent-primary animate-spin" />
            <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
              Syncing reasoning logs...
            </span>
          </div>
        ) : errorMsg ? (
          <div className="border border-accent-red/20 bg-accent-red/5 rounded-xl p-6 text-center max-w-md mx-auto my-12">
            <ShieldAlert className="w-10 h-10 text-accent-red mx-auto mb-3" />
            <p className="text-sm font-semibold text-text-primary mb-1">Retrieval Failed</p>
            <p className="text-xs text-text-secondary mb-4">{errorMsg}</p>
            <button 
              onClick={fetchResults}
              className="px-4 py-2 bg-bg-surface border border-border-subtle text-xs font-mono uppercase tracking-wider rounded hover:border-accent-primary hover:bg-bg-raised transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="border border-border-subtle bg-bg-surface rounded-xl p-10 text-center max-w-md mx-auto my-12 shadow-sm">
            <FileSearch className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-sm font-semibold text-text-primary mb-1">No Assessments Found</p>
            <p className="text-xs text-text-secondary mb-5">
              We found the position setup, but no candidate resumes have been evaluated yet.
            </p>
            <Link href="/recruiter">
              <div className="px-4 py-2 bg-accent-primary hover:bg-white hover:text-accent-primary text-white border border-accent-primary font-mono text-xs uppercase font-bold tracking-wider rounded transition-colors inline-block cursor-pointer">
                Upload Resumes
              </div>
            </Link>
          </div>
        ) : (
          <div>
            {/* Top Stats Banner */}
            <div className="flex items-center justify-between mb-8 bg-bg-surface border border-border-subtle rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-accent-primary" />
                <span className="text-xs text-text-secondary font-sans font-medium">
                  Hiring Committee generated {results.length} ranked candidate recommendation{results.length > 1 ? 's' : ''}.
                </span>
              </div>
              <span className="text-[10px] text-text-tertiary font-mono uppercase">
                Sorted by Confidence
              </span>
            </div>

            {/* 3D Stack Container */}
            <div 
              className="relative py-6"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px'
              }}
            >
              {results.map((res, index) => {
                // Determine Devil's Advocate flag count
                const claims = res.evaluation?.devils_advocate?.contested_claims || []
                const da_flags = claims.filter((c: any) => c.severity === 'high' || c.severity === 'medium').length

                const cardCandidate = {
                  id: res.evaluation_id,
                  name: res.profile.name,
                  verdict: res.decision.verdict,
                  score: res.evaluation.score,
                  confidence: res.decision.confidence,
                  da_flags,
                  breakdown: res.evaluation.breakdown
                }

                return (
                  <ScoreCard
                    key={res.evaluation_id}
                    candidate={cardCandidate}
                    rank={index + 1}
                  />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
