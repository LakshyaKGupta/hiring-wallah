'use client'

import React, { useEffect, useRef, useState } from 'react'
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

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1800, startTrigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!startTrigger) return
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, startTrigger])
  return count
}

/* ── Animated stat ticker ── */
function AnimatedStat({ stat, label, delay = 0 }: { stat: string; label: string; delay?: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isNumber = /^\d+/.test(stat)
  const numericPart = parseInt(stat.replace(/\D/g, '')) || 0
  const suffix = stat.replace(/^\d+/, '')
  const count = useCountUp(numericPart, 1400, visible)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-slate-200 bg-white/75 p-4 text-left shadow-sm backdrop-blur"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="text-2xl font-black tracking-[-0.04em] text-slate-950">
        {isNumber ? `${count}${suffix}` : stat}
      </div>
      <div className="mt-1 text-xs font-semibold leading-snug text-slate-500">{label}</div>
    </div>
  )
}

/* ── Signal nodes ── */
const signalNodes = [
  { label: 'Resume', value: '42 claims', Icon: FileCheck2, className: 'left-[4%] top-[12%]', delay: '0s' },
  { label: 'Rubric', value: 'weighted', Icon: BarChart3, className: 'right-[3%] top-[16%]', delay: '-1.8s' },
  { label: 'Evidence', value: '18 proofs', Icon: ShieldCheck, className: 'left-[6%] bottom-[14%]', delay: '-3.4s' },
  { label: 'Ledger', value: 'signed', Icon: Fingerprint, className: 'right-[6%] bottom-[10%]', delay: '-5s' },
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

/* ── Cycling headline phrases ── */
const cyclingPhrases = [
  { from: '1,247', to: '3', label: 'resumes → finalists' },
  { from: '6×', to: '1hr', label: 'faster · same outcome' },
  { from: '100%', to: 'SHA', label: 'evidence · signed' },
]

function CyclingHeadline() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % cyclingPhrases.length)
        setVisible(true)
      }, 320)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const phrase = cyclingPhrases[index]

  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
        transition: 'opacity 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span className="text-base font-black tracking-tight text-blue-600">{phrase.from}</span>
      <span className="text-slate-400">→</span>
      <span className="text-base font-black tracking-tight text-emerald-600">{phrase.to}</span>
      <span className="text-xs font-semibold text-slate-500">{phrase.label}</span>
    </div>
  )
}

/* ── Hero signal map ── */
function HeroSignalMap() {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[660px] overflow-visible">
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_66%)] blur-3xl" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 660 560" fill="none" aria-hidden>
        <circle
          className="hero-orbit-ring"
          cx="330"
          cy="280"
          r="210"
          stroke="rgba(37,99,235,0.16)"
          strokeWidth="1"
          strokeDasharray="8 10"
          style={{ transformOrigin: '330px 280px' }}
        />
        <circle
          className="hero-orbit-ring hero-orbit-ring-reverse"
          cx="330"
          cy="280"
          r="140"
          stroke="rgba(15,23,42,0.09)"
          strokeWidth="1"
          strokeDasharray="4 9"
          style={{ transformOrigin: '330px 280px' }}
        />
        {[
          'M158 128 C222 166 268 216 330 280',
          'M508 142 C452 178 404 226 330 280',
          'M172 428 C238 386 278 334 330 280',
          'M490 436 C440 384 394 332 330 280',
        ].map((path, index) => (
          <path
            key={path}
            className="hero-signal-path"
            d={path}
            stroke={index % 2 === 0 ? 'rgba(37,99,235,0.28)' : 'rgba(16,185,129,0.26)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 12"
            style={{ animationDelay: `${index * -0.9}s` }}
          />
        ))}
      </svg>

      {/* Central score core */}
      <div className="hero-score-core absolute left-1/2 top-1/2 z-30 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/60 shadow-[0_30px_74px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
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

/* ── Main export ── */
export function HeroConvergenceScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const scrollToWorkspaces = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById('workspaces')
    if (!element) return
    event.preventDefault()
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({ top: Math.max(0, element.offsetTop - 64), behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f8f8f6] px-5 py-16 md:px-6">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      {/* Radial glow */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.09),transparent_68%)] blur-3xl" />
      {/* Fade to white at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />

      <div
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* ── Left: Copy ── */}
        <div className="mx-auto max-w-2xl space-y-8 text-center lg:mx-0 lg:max-w-none lg:text-left">
          {/* Cycling metric pill */}
          <CyclingHeadline />

          <div className="space-y-6">
            <h1 className="hero-copy-drift font-display text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 md:text-7xl lg:text-[5.15rem]">
              Hiring decisions with receipts.
            </h1>
            <p
              className="hero-copy-drift mx-auto max-w-xl text-lg font-medium leading-8 text-slate-600 lg:mx-0"
              style={{ animationDelay: '-2s' }}
            >
              From{' '}
              <span className="font-extrabold text-slate-950">1,247 resumes</span> to{' '}
              <span className="font-extrabold text-emerald-600">3 finalists</span>. Hiring Wallah replaces blind keyword filters with verified evidence auditing and consensus scoring — every decision backed by a signed paper trail.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/auth?mode=signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-950 bg-slate-950 px-7 py-4 text-base font-bold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_22px_42px_rgba(15,23,42,0.22)]"
            >
              Create account
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/"
              onClick={scrollToWorkspaces}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-7 py-4 text-base font-bold text-slate-900 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              <Briefcase className="h-5 w-5 text-blue-600" />
              See workspaces
            </Link>
          </div>

          <div className="mx-auto grid max-w-xl grid-cols-3 gap-4 pt-1 lg:mx-0">
            {[
              { stat: '6x', label: 'faster screening', delay: 300 },
              { stat: '100%', label: 'explainable', delay: 450 },
              { stat: 'SHA', label: 'signed reports', delay: 600 },
            ].map(({ stat, label, delay }) => (
              <AnimatedStat key={label} stat={stat} label={label} delay={delay} />
            ))}
          </div>
        </div>

        {/* ── Right: Signal Map ── */}
        <div className="hidden md:flex md:justify-center lg:justify-self-center">
          <HeroSignalMap />
        </div>
      </div>
    </section>
  )
}
