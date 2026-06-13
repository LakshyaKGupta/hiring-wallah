'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  FileCheck2,
  Fingerprint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const heroEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const signalNodes = [
  { label: 'Resume', value: '42 claims', Icon: FileCheck2, className: 'left-[12%] top-[19%]', delay: 0 },
  { label: 'Rubric', value: 'weighted', Icon: BarChart3, className: 'right-[11%] top-[24%]', delay: 0.25 },
  { label: 'Evidence', value: '18 proofs', Icon: ShieldCheck, className: 'left-[15%] bottom-[21%]', delay: 0.5 },
  { label: 'Ledger', value: 'signed', Icon: Fingerprint, className: 'right-[15%] bottom-[18%]', delay: 0.75 },
]

function SignalNode({
  label,
  value,
  Icon,
  className,
  delay,
}: {
  label: string
  value: string
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  className: string
  delay: number
}) {
  return (
    <motion.div
      initial={false}
      animate={{ y: [0, -10, 0], scale: [1, 1.025, 1] }}
      transition={{ duration: 6.8, delay, repeat: Infinity, ease: heroEase }}
      className={`absolute z-20 flex items-center gap-3 ${className}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/90 bg-white/75 text-slate-800 shadow-[0_22px_52px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="hidden rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md lg:block">
        <span className="block text-xs font-extrabold leading-none text-slate-950">{label}</span>
        <span className="mt-1 block text-[11px] font-semibold leading-none text-slate-500">{value}</span>
      </span>
    </motion.div>
  )
}

function HeroSignalMap() {
  return (
    <div className="relative mx-auto h-[500px] w-full max-w-[600px] overflow-visible">
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_66%)] blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 500" fill="none" aria-hidden>
        <motion.circle
          cx="300"
          cy="250"
          r="188"
          stroke="rgba(37,99,235,0.18)"
          strokeWidth="1"
          strokeDasharray="8 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 250px' }}
        />
        <motion.circle
          cx="300"
          cy="250"
          r="126"
          stroke="rgba(15,23,42,0.10)"
          strokeWidth="1"
          strokeDasharray="4 9"
          animate={{ rotate: -360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '300px 250px' }}
        />
        {[
          'M150 128 C206 158 244 194 300 250',
          'M453 140 C404 166 366 204 300 250',
          'M164 378 C218 350 256 306 300 250',
          'M440 386 C402 346 363 308 300 250',
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke={index % 2 === 0 ? 'rgba(37,99,235,0.30)' : 'rgba(16,185,129,0.28)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 12"
            animate={{ strokeDashoffset: [0, -44] }}
            transition={{ duration: 5.5 + index * 0.4, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>

      <motion.div
        initial={false}
        animate={{ y: [0, -12, 0], scale: [1, 1.015, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-1/2 z-30 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/60 shadow-[0_30px_74px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
      >
        <div className="absolute inset-5 rounded-full border-[12px] border-slate-100" />
        <div className="absolute inset-5 rounded-full border-[12px] border-transparent border-r-emerald-500 border-t-blue-600" />
        <div className="relative z-10 text-center">
          <div className="text-7xl font-black leading-none tracking-[-0.07em] text-slate-950">91</div>
          <div className="mt-1 text-sm font-extrabold text-emerald-600">Strong hire</div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Consensus
          </div>
        </div>
      </motion.div>

      {signalNodes.map((node) => (
        <SignalNode key={node.label} {...node} />
      ))}
    </div>
  )
}

export function HeroConvergenceScene() {
  const scrollToWorkspaces = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById('workspaces')
    if (!element) return

    event.preventDefault()
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({
      top: Math.max(0, element.offsetTop - 64),
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f8f8f6] px-5 py-12 md:px-6 md:py-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.11),transparent_68%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <div className="mx-auto max-w-2xl space-y-7 text-center lg:mx-0 lg:max-w-none lg:text-left">
          <div className="space-y-5">
            <motion.h1
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: heroEase }}
              className="font-display text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 md:text-7xl lg:text-[5.15rem]"
            >
              Hiring decisions with receipts.
            </motion.h1>
            <motion.p
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: heroEase }}
              className="mx-auto max-w-xl text-lg font-medium leading-8 text-slate-600 lg:mx-0"
            >
              Hiring Wallah turns resumes, job requirements, and recruiter rules into defensible scorecards with visible evidence trails and signed consensus reports.
            </motion.p>
          </div>

          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: heroEase }}
            className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/auth?mode=signup" className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-950 bg-slate-950 px-7 py-4 text-base font-bold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_22px_42px_rgba(15,23,42,0.22)]">
              Create account
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/" onClick={scrollToWorkspaces} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-7 py-4 text-base font-bold text-slate-900 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white">
              <Briefcase className="h-5 w-5 text-blue-600" />
              See workspaces
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: heroEase }}
            className="mx-auto grid max-w-xl grid-cols-3 gap-3 pt-2 lg:mx-0"
          >
            {[
              ['6x', 'faster screening'],
              ['100%', 'explainable'],
              ['SHA', 'signed reports'],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white/75 p-4 text-left shadow-sm backdrop-blur">
                <div className="text-2xl font-black tracking-[-0.04em] text-slate-950">{stat}</div>
                <div className="mt-1 text-xs font-semibold leading-snug text-slate-500">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hidden md:flex md:justify-center lg:justify-self-center">
          <HeroSignalMap />
        </div>
      </div>
    </section>
  )
}
