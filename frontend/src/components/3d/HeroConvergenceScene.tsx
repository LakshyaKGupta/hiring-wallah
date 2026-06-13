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

/*
  ── Hero Signal Map ──
  SVG viewBox: 0 0 560 520
  Score core centre: cx=180, cy=260

  Signal node anchors (top-left of pill, in viewBox coords):
    Rubric:   (280, 60)  → top-right
    Resume:   (380, 170) → right
    Ledger:   (250, 390) → bottom-right
    Evidence: (360, 310) → right-bottom

  Paths converge at (180, 260).
*/

type NodeDef = {
  label: string
  value: string
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  // pixel position within the 560×520 container (matches viewBox)
  cx: number
  cy: number
  floatDelay: string
  floatDuration: string
}

const NODE_DEFS: NodeDef[] = [
  { label: 'Rubric',   value: 'weighted',  Icon: BarChart3,   cx: 118, cy:  98, floatDelay: '0s',    floatDuration: '6.1s' },
  { label: 'Resume',   value: '42 claims', Icon: FileCheck2,  cx: 522, cy: 160, floatDelay: '-2.1s', floatDuration: '5.7s' },
  { label: 'Evidence', value: '18 proofs', Icon: ShieldCheck, cx: 524, cy: 360, floatDelay: '-3.9s', floatDuration: '6.5s' },
  { label: 'Ledger',   value: 'signed',    Icon: Fingerprint, cx: 124, cy: 420, floatDelay: '-1.3s', floatDuration: '7.1s' },
]

// Path end-point (score core centre in SVG units)
const CORE_CX = 280
const CORE_CY = 260

// Bezier control points (node cx/cy + some curve offset)
function signalPath({ cx, cy }: NodeDef) {
  const mx = (cx + CORE_CX) / 2
  const my = (cy + CORE_CY) / 2
  return `M ${cx} ${cy} Q ${mx} ${my} ${CORE_CX} ${CORE_CY}`
}

// The container is displayed at w-full up to 560px. To place nodes in px:
// we scale: containerWidth * (cx / 560), etc.
// But since we use SVG viewBox + absolute positioning inside the same container,
// we can position nodes using inline style with percentage derived from the viewBox:
// left = cx / 560 * 100%,  top = cy / 520 * 100%
function nodePct(node: NodeDef) {
  return {
    left: `${(node.cx / 560) * 100}%`,
    top:  `${(node.cy / 520) * 100}%`,
  }
}

function HeroSignalMap() {
  return (
    <div
      className="relative h-[520px] w-[560px] max-w-full select-none"
      style={{ overflow: 'visible' }}
    >
      {/* Ambient radial glow behind core */}
      <div
        className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_60%)] blur-3xl"
        style={{ width: 320, height: 320, left: CORE_CX - 160, top: CORE_CY - 160 }}
      />

      {/* SVG: orbit rings + signal paths */}
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 560 520"
        fill="none"
        aria-hidden
      >
        {/* Outer dashed orbit */}
        <circle
          className="hero-orbit-ring"
          cx={CORE_CX}
          cy={CORE_CY}
          r={220}
          stroke="rgba(37,99,235,0.14)"
          strokeWidth="1"
          strokeDasharray="8 11"
          style={{ transformOrigin: `${CORE_CX}px ${CORE_CY}px` }}
        />
        {/* Inner dashed orbit */}
        <circle
          className="hero-orbit-ring hero-orbit-ring-reverse"
          cx={CORE_CX}
          cy={CORE_CY}
          r={145}
          stroke="rgba(15,23,42,0.07)"
          strokeWidth="1"
          strokeDasharray="4 9"
          style={{ transformOrigin: `${CORE_CX}px ${CORE_CY}px` }}
        />
        {/* Signal paths from each node to the core */}
        {NODE_DEFS.map((node, i) => (
          <path
            key={node.label}
            className="hero-signal-path"
            d={signalPath(node)}
            stroke={i % 2 === 0 ? 'rgba(37,99,235,0.28)' : 'rgba(16,185,129,0.26)'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="8 12"
            style={{ animationDelay: `${i * -1.3}s` }}
          />
        ))}
      </svg>

      {/* Score core — positioned via CSS to match SVG coordinate */}
      <div
        className="hero-score-cluster absolute z-30"
        style={{
          left: `${(CORE_CX / 560) * 100}%`,
          top:  `${(CORE_CY / 520) * 100}%`,
          '--score-transform': 'translate(-50%, -50%)',
        } as React.CSSProperties}
      >
        {/* Pulsing ambient glow */}
        <div className="hero-score-glow pointer-events-none absolute -inset-6 rounded-full bg-blue-500/8 blur-xl" />
        {/* Spinning gradient arc */}
        <svg
          className="hero-arc-spin absolute"
          viewBox="0 0 224 224"
          fill="none"
          style={{
            width: 224,
            height: 224,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
          }}
          aria-hidden
        >
          <circle
            cx="112" cy="112" r="108"
            stroke="url(#arcGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="70 274"
          />
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="224" y2="224" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgb(14,165,233)"  stopOpacity="0.95" />
              <stop offset="100%" stopColor="rgb(56,189,248)" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
        {/* Frosted glass circle */}
        <div className="hero-score-core relative flex h-52 w-52 flex-col items-center justify-center rounded-full border border-white/85 bg-white/60 shadow-[0_20px_52px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
          <div className="absolute inset-5 rounded-full border-[10px] border-slate-100/60" />
          <div className="relative z-10 text-center">
            <div className="text-[4.5rem] font-black leading-none tracking-[-0.07em] text-slate-950">91</div>
            <div className="mt-0.5 text-sm font-extrabold text-emerald-600">Strong hire</div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Consensus
            </div>
          </div>
        </div>
      </div>

      {/* Signal Nodes — positioned to match SVG anchors */}
      {NODE_DEFS.map((node) => {
        const Icon = node.Icon
        const isLeftNode = node.cx < CORE_CX
        return (
          <div
            key={node.label}
            className={`hero-signal-node absolute z-20 flex items-center gap-2.5 ${
              isLeftNode ? 'flex-row-reverse text-right' : ''
            }`}
            style={{
              ...nodePct(node),
              '--node-transform': isLeftNode ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
              animationDelay: node.floatDelay,
              animationDuration: node.floatDuration,
            } as React.CSSProperties}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/85 bg-white/80 text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="rounded-2xl border border-slate-200/80 bg-white/75 px-3 py-2 shadow-sm backdrop-blur-md">
              <span className="block text-xs font-extrabold leading-none text-slate-950">{node.label}</span>
              <span className="mt-1 block text-[11px] font-semibold leading-none text-slate-400">{node.value}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Main export ── */
export function HeroConvergenceScene() {
  const scrollToWorkspaces = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const element = document.getElementById('workspaces')
    if (!element) return
    event.preventDefault()
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo({ top: Math.max(0, element.offsetTop - 64), behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f8f8f6] px-5 py-14 md:px-6 lg:py-10">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      {/* Radial glow */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_68%)] blur-3xl" />
      {/* Fade to white at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />

      <div
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
      >
        {/* ── Left: Copy ── */}
        <div className="mx-auto max-w-2xl space-y-8 text-center lg:mx-0 lg:max-w-none lg:text-left">
          <CyclingHeadline />

          <div className="space-y-7">
            <div className="hero-copy-drift relative inline-block pb-3">
              <h1 className="font-display text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 md:text-7xl lg:text-[5.15rem]">
                Hiring decisions{' '}
                <span className="whitespace-nowrap">with receipts.</span>
              </h1>
              <svg
                className="hero-pencil-underline pointer-events-none absolute -bottom-2 left-1/2 h-8 w-[94%] -translate-x-1/2 overflow-visible lg:left-0 lg:w-[88%] lg:translate-x-0"
                viewBox="0 0 560 44"
                fill="none"
                aria-hidden
              >
                <path
                  className="hero-pencil-glow"
                  d="M8 29 C88 9 148 31 226 18 C312 4 366 35 552 16"
                />
                <path
                  className="hero-pencil-path"
                  d="M8 29 C88 9 148 31 226 18 C312 4 366 35 552 16"
                />
              </svg>
            </div>
            <p className="mx-auto max-w-xl text-lg font-medium leading-8 text-slate-500 lg:mx-0">
              From{' '}
              <span className="font-extrabold text-slate-950">1,247 resumes</span> to{' '}
              <span className="font-extrabold text-emerald-600">3 finalists</span>. Hiring Wallah replaces
              blind keyword filters with verified evidence auditing and consensus scoring — every decision
              backed by a signed paper trail.
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
              { stat: '6x',   label: 'faster screening', delay: 300 },
              { stat: '100%', label: 'explainable',      delay: 450 },
              { stat: 'SHA',  label: 'signed reports',   delay: 600 },
            ].map(({ stat, label, delay }) => (
              <AnimatedStat key={label} stat={stat} label={label} delay={delay} />
            ))}
          </div>
        </div>

        {/* ── Right: Signal Map ── */}
        <div className="hidden w-full md:flex md:justify-center lg:justify-self-center">
          <HeroSignalMap />
        </div>
      </div>
    </section>
  )
}
