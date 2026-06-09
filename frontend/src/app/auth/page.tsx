'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import AgentOrb from '@/components/ui/AgentOrb'

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)
    
    // Simulate API Auth Request
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      
      // Redirect to landing dashboard after success animation
      setTimeout(() => {
        router.push('/recruiter')
      }, 1000)
    }, 1500)
  }

  return (
    <div className="flex-1 bg-bg-deep relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* 3D background wireframe */}
      <AgentOrb />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 shadow-md relative z-10"
      >
        {/* Success Screen */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-surface rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-12 h-12 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green mb-4"
              >
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display font-bold text-lg text-text-primary uppercase tracking-wide">
                Authentication Successful
              </h3>
              <p className="text-xs text-text-secondary mt-1 font-mono uppercase tracking-wider">
                Redirecting to Workspace...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center font-display font-bold text-lg text-white mx-auto shadow-sm mb-3">
            W
          </div>
          <h2 className="font-display font-bold text-xl text-text-primary tracking-wide">
            Access Hiring Wallah
          </h2>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-wider mt-1">
            Secure, evidence-backed recruitment
          </p>
        </div>

        {/* Tabs navigation */}
        <div className="relative flex p-1 bg-bg-raised border border-border-subtle rounded-xl mb-6">
          {/* Active Tab Sliding background */}
          <motion.div
            layoutId="active-auth-tab"
            className="absolute top-1 bottom-1 bg-bg-surface border border-border-subtle rounded-lg -z-0"
            style={{
              left: activeTab === 'signin' ? '4px' : 'calc(50% + 2px)',
              right: activeTab === 'signin' ? 'calc(50% + 2px)' : '4px'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />

          <button
            onClick={() => {
              setActiveTab('signin')
              setErrorMsg('')
            }}
            className={`w-1/2 py-2 text-xs font-mono uppercase tracking-wider rounded-lg z-10 transition-colors ${
              activeTab === 'signin' ? 'text-text-primary font-bold' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup')
              setErrorMsg('')
            }}
            className={`w-1/2 py-2 text-xs font-mono uppercase tracking-wider rounded-lg z-10 transition-colors ${
              activeTab === 'signup' ? 'text-text-primary font-bold' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Input Forms */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-bg-raised border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full bg-bg-raised border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-text-secondary font-mono uppercase tracking-wide block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-raised border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-accent-primary hover:bg-accent-primary/95 text-white disabled:opacity-50 rounded-xl font-mono uppercase font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-border-subtle/40 text-[9px] text-text-tertiary font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-secondary" />
          <span>Client-Side Log Encryption Enforced</span>
        </div>
      </motion.div>
    </div>
  )
}
