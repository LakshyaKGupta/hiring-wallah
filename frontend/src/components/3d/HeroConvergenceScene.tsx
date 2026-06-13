'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  FileCheck2,
  Fingerprint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const signalNodes = [
  { label: 'Resume', value: '42 claims', Icon: FileCheck2, className: 'left-[8%] top-[14%]', delay: '0s' },
  { label: 'Rubric', value: 'weighted', Icon: BarChart3, className: 'right-[7%] top-[18%]', delay: '-1.5s' },
  { label: 'Evidence', value: '18 proofs', Icon: ShieldCheck, className: 'left-[11%] bottom-[15%]', delay: '-3s' },
  { label: 'Ledger', value: 'signed', Icon: Fingerprint, className: 'right-[11%] bottom-[12%]', delay: '-4.5s' },
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
  delay: string
}) {
  return (
    <div
      className={`hero-signal-node absolute z-20 flex items-center gap-3 ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border border-white/90 bg-white/75 text-slate-800 shadow-[0_22px_52px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="hidden rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md lg:block">
        <span className="block text-xs font-extrabold leading-none text-slate-950">{label}</span>
        <span className="mt-1 block text-[11px] font-semibold leading-none text-slate-500">{value}</span>
      </span>
    </div>
  )
}

function HeroSignalMap() {
  return (
    <div className="relative mx-auto h-[540px] w-full max-w-[640px] overflow-visible">
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_66%)] blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 540" fill="none" aria-hidden>
        <circle
          className="hero-orbit-ring"
          cx="320"
          cy="270"
          r="204"
          stroke="rgba(37,99,235,0.18)"
          strokeWidth="1"
          strokeDasharray="8 10"
          style={{ transformOrigin: '320px 270px' }}
        />
        <circle
          className="hero-orbit-ring hero-orbit-ring-reverse"
          cx="320"
          cy="270"
          r="136"
          stroke="rgba(15,23,42,0.10)"
          strokeWidth="1"
          strokeDasharray="4 9"
          style={{ transformOrigin: '320px 270px' }}
        />
        {[
          'M152 116 C214 154 258 204 320 270',
          'M493 132 C438 166 392 214 320 270',
          'M166 414 C230 374 270 324 320 270',
          'M474 420 C426 370 382 320 320 270',
        ].map((path, index) => (
          <path
            key={path}
            className="hero-signal-path"
            d={path}
            stroke={index % 2 === 0 ? 'rgba(37,99,235,0.30)' : 'rgba(16,185,129,0.28)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 12"
            style={{ animationDelay: `${index * -0.9}s` }}
          />
        ))}
      </svg>

      <div
        className="hero-score-core absolute left-1/2 top-1/2 z-30 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/60 shadow-[0_30px_74px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
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
      </div>

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
            <h1
              className="hero-copy-drift font-display text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 md:text-7xl lg:text-[5.15rem]"
            >
              Hiring decisions with receipts.
            </h1>
            <p
              className="hero-copy-drift mx-auto max-w-xl text-lg font-medium leading-8 text-slate-600 lg:mx-0"
              style={{ animationDelay: '-2s' }}
            >
              Hiring Wallah turns resumes, job requirements, and recruiter rules into defensible scorecards with visible evidence trails and signed consensus reports.
            </p>
          </div>

          <div
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
          </div>

          <div
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
          </div>
        </div>

        <div className="hidden md:flex md:justify-center lg:justify-self-center">
          <HeroSignalMap />
        </div>
      </div>
    </section>
  )
}
