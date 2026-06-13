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

const reviewSteps = [
  { label: 'Resume evidence', value: '42 claims parsed', Icon: FileCheck2 },
  { label: 'Rubric fit', value: '91% weighted match', Icon: BarChart3 },
  { label: 'Signed verdict', value: '7c2e...94fa', Icon: Fingerprint },
]

const scoreBars = [
  { label: 'Skill signal', score: 94, color: 'bg-blue-600' },
  { label: 'Evidence trust', score: 91, color: 'bg-emerald-500' },
  { label: 'Claim risk', score: 12, color: 'bg-slate-900' },
]

const floatingGlyphs = [
  { Icon: FileCheck2, label: 'resume', className: 'left-[7%] top-[20%]', delay: 0 },
  { Icon: Fingerprint, label: 'identity', className: 'right-[10%] top-[18%]', delay: 0.35 },
  { Icon: Sparkles, label: 'signal', className: 'right-[16%] bottom-[18%]', delay: 0.7 },
]

function HeroFloatingGlyphs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
      {floatingGlyphs.map(({ Icon, label, className, delay }) => (
        <motion.div
          key={label}
          initial={false}
          animate={{ y: [0, -12, 0], rotate: [0, 3, -2, 0], opacity: [0.34, 0.58, 0.34] }}
          transition={{ duration: 7, delay, repeat: Infinity, ease: heroEase }}
          className={`absolute ${className} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-blue-600 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur-xl`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </motion.div>
      ))}
    </div>
  )
}

function ReviewSheet({
  className,
  title,
  delay,
}: {
  className: string
  title: string
  delay: number
}) {
  return (
    <motion.div
      initial={false}
      animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 7.2, delay, repeat: Infinity, ease: heroEase }}
      className={`absolute hidden w-44 rounded-3xl border border-white/80 bg-white/82 p-4 shadow-[0_28px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:block ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <span className="text-[11px] font-bold text-slate-400">{title}</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 rounded-full bg-slate-200" />
        <div className="h-2 w-3/5 rounded-full bg-slate-200" />
      </div>
    </motion.div>
  )
}

function HeroReviewCanvas() {
  return (
    <div className="relative mx-auto h-[610px] w-full max-w-[660px] [perspective:1400px]">
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_64%)] blur-3xl" />
      <ReviewSheet title="Resume" delay={0} className="left-0 top-20 -rotate-6" />
      <ReviewSheet title="Rubric" delay={0.45} className="right-0 top-28 rotate-6" />
      <ReviewSheet title="Ledger" delay={0.9} className="bottom-24 left-10 rotate-3" />

      <motion.div
        initial={false}
        animate={{ y: [0, -12, 0], rotateX: [0, 1.6, 0], rotateY: [-7, -3, -7] }}
        transition={{ duration: 8, repeat: Infinity, ease: heroEase }}
        whileHover={{ rotateY: -2, rotateX: 2, scale: 1.01 }}
        className="absolute left-1/2 top-1/2 z-20 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
      >
        <div className="rounded-[2.25rem] border border-slate-200/80 bg-white/88 p-4 shadow-[0_42px_110px_rgba(15,23,42,0.16)] backdrop-blur-xl [transform:translateZ(48px)]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#fbfbf9] p-5 md:p-6">
            <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-50/90 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold tracking-tight text-slate-950">Live candidate review</p>
                <p className="text-xs font-semibold text-slate-500">Lead Product Designer</p>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                6 agents agree
              </div>
            </div>

            <div className="relative z-10 mt-6 grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
                <motion.div
                  aria-hidden
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-blue-200"
                />
                <div className="absolute inset-5 rounded-full border-[14px] border-slate-100" />
                <div className="absolute inset-5 rounded-full border-[14px] border-transparent border-t-blue-600 border-r-emerald-500" />
                <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                  <span className="text-6xl font-black leading-none tracking-[-0.06em] text-slate-950">91</span>
                  <span className="-mt-1 text-sm font-extrabold text-emerald-600">Strong hire</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviewSteps.map(({ label, value, Icon }, index) => (
                  <motion.div
                    key={label}
                    initial={false}
                    animate={{ x: [0, index % 2 === 0 ? 5 : -5, 0] }}
                    transition={{ duration: 6 + index * 0.3, repeat: Infinity, ease: heroEase }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/86 p-3 shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-slate-950">{label}</span>
                      <span className="block truncate text-xs font-semibold text-slate-500">{value}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">Weighted scorecard</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-3">
                {scoreBars.map((row, index) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{row.label}</span>
                      <span>{row.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <motion.div
                        initial={false}
                        animate={{ width: `${row.score}%` }}
                        transition={{ duration: 1, delay: index * 0.08, ease: heroEase }}
                        className={`h-full rounded-full ${row.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-950 px-4 py-3 text-white">
              <div>
                <p className="text-xs font-semibold text-slate-300">Signed decision ledger</p>
                <p className="text-sm font-extrabold text-white">Report ready</p>
              </div>
              <Fingerprint className="h-5 w-5 text-emerald-300" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/60 lg:block"
      />
    </div>
  )
}

export function HeroConvergenceScene() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f8f8f6] px-5 py-12 md:px-6 md:py-14">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <motion.div
        aria-hidden
        animate={{ x: [-18, 18, -18], y: [0, 14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.11),transparent_68%)] blur-3xl"
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
      <HeroFloatingGlyphs />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
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
            <Link href="/#workspaces" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-7 py-4 text-base font-bold text-slate-900 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white">
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

        <div className="hidden md:block lg:justify-self-end">
          <HeroReviewCanvas />
        </div>
      </div>
    </section>
  )
}
