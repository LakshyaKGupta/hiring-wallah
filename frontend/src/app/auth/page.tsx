'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import MeshBackground from '@/components/ui/MeshBackground'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const activeTab: 'signin' | 'signup' = mode === 'signup' ? 'signup' : 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'recruiter' | 'candidate'>('recruiter')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [authNotice, setAuthNotice] = useState('')

  const switchTab = (tab: 'signin' | 'signup') => {
    setAuthNotice('')
    router.replace(`/auth?mode=${tab}`, { scroll: false })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      setTimeout(() => {
        router.push(`/${role}`)
      }, 1000)
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-deep relative overflow-hidden flex items-center justify-center px-6 py-12">
      <MeshBackground opacity={0.35} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 22 }}
        className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 shadow-sm relative z-10"
      >
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
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-12 h-12 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green mb-4"
              >
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display font-extrabold text-lg text-text-primary uppercase tracking-tight">
                Authentication Successful
              </h3>
              <p className="type-caption text-text-secondary mt-1">
                Redirecting to {role === 'recruiter' ? 'Recruiter' : 'Candidate'} workspace...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center font-display font-extrabold text-lg text-white mx-auto shadow-sm mb-3"
          >
            W
          </motion.div>
          <h2 className="font-display font-extrabold text-xl text-text-primary tracking-tight">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="type-caption text-text-tertiary mt-1">
            {activeTab === 'signin'
              ? 'Sign in to access your workspace'
              : 'Join the evidence-backed hiring platform'}
          </p>
        </div>

        <div className="relative flex p-1 bg-bg-raised border border-border-subtle rounded-xl mb-6">
          <motion.div
            layoutId="active-auth-tab"
            className="absolute top-1 bottom-1 bg-bg-surface border border-border-subtle rounded-lg shadow-sm"
            style={{
              left: activeTab === 'signin' ? '4px' : 'calc(50% + 2px)',
              right: activeTab === 'signin' ? 'calc(50% + 2px)' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />

          <motion.button
            type="button"
            onClick={() => switchTab('signin')}
            whileTap={{ scale: 0.97 }}
            className={`w-1/2 py-2.5 font-sans text-caption font-medium rounded-lg z-10 transition-colors cursor-pointer ${
              activeTab === 'signin' ? 'text-text-primary font-bold' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Sign In
          </motion.button>
          <motion.button
            type="button"
            onClick={() => switchTab('signup')}
            whileTap={{ scale: 0.97 }}
            className={`w-1/2 py-2.5 font-sans text-caption font-medium rounded-lg z-10 transition-colors cursor-pointer ${
              activeTab === 'signup' ? 'text-text-primary font-bold' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Sign Up
          </motion.button>
        </div>

        <div className="space-y-1.5 mb-6">
          <label className="type-label block">
            Workspace Role
          </label>
          <div className="relative flex p-1 bg-bg-raised border border-border-subtle rounded-xl w-full">
            <motion.div
              layoutId="active-role-tab"
              className="absolute top-1 bottom-1 bg-bg-surface border border-border-subtle rounded-lg z-0 shadow-sm"
              style={{
                left: role === 'recruiter' ? '4px' : 'calc(50% + 2px)',
                right: role === 'recruiter' ? 'calc(50% + 2px)' : '4px',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />

            <motion.button
              type="button"
              onClick={() => setRole('recruiter')}
              whileHover={{ y: -0.5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-1/2 py-2.5 text-[11px] font-sans font-bold tracking-tight rounded-lg z-10 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'recruiter' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setRole('candidate')}
              whileHover={{ y: -0.5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-1/2 py-2.5 text-[11px] font-sans font-bold tracking-tight rounded-lg z-10 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'candidate' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate</span>
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'signup' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="type-label block mb-1">
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
            <label className="type-label block mb-1">
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
            <label className="type-label block mb-1">
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

          {activeTab === 'signin' && (
            <div className="space-y-2 text-right">
              <button
                type="button"
                onClick={() => setAuthNotice('Password reset is mocked for this demo. Use any email and password to enter a workspace.')}
                className="type-label text-[10px] text-text-tertiary hover:text-accent-primary transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
              <AnimatePresence>
                {authNotice && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="rounded-lg border border-accent-primary/15 bg-accent-primary/5 px-3 py-2 text-left text-[10px] leading-relaxed text-text-secondary"
                  >
                    {authNotice}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-full mt-2 py-3 bg-accent-primary hover:bg-accent-primary/95 text-white disabled:opacity-50 rounded-xl font-sans font-bold text-caption transition-all flex items-center justify-center gap-2 cursor-pointer border border-accent-primary"
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
          </motion.button>
        </form>

        <p className="text-center text-[10px] text-text-tertiary type-label mt-5">
          {activeTab === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => switchTab('signup')} className="text-accent-primary font-bold hover:underline cursor-pointer">
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('signin')} className="text-accent-primary font-bold hover:underline cursor-pointer">
                Sign in
              </button>
            </>
          )}
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-border-subtle/40 type-caption text-text-tertiary group">
          <div className="p-0.5 rounded bg-accent-secondary/10 text-accent-secondary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-secondary" />
          </div>
          <span>Client-Side Log Encryption Enforced</span>
        </div>
      </motion.div>
    </div>
  )
}

function AuthFallback() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-deep flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthForm />
    </Suspense>
  )
}
