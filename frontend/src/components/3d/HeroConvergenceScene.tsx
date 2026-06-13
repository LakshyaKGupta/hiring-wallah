'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const heroEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const reviewRows = [
  { label: 'Resume parsed', value: '42 claims', icon: FileCheck2, tone: 'bg-blue-50 text-blue-700' },
  { label: 'Evidence matched', value: '18 proofs', icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Rubric scored', value: '91%', icon: BarChart3, tone: 'bg-slate-100 text-slate-800' },
  { label: 'Report signed', value: '7c2e...', icon: Fingerprint, tone: 'bg-indigo-50 text-indigo-700' },
]

const scoreBars = [
  { label: 'Skills', score: 94, color: 'bg-blue-600' },
  { label: 'Evidence', score: 91, color: 'bg-emerald-500' },
  { label: 'Risk', score: 12, color: 'bg-slate-900' },
]

const floatingGlyphs = [
  { Icon: FileCheck2, label: 'resume', className: 'left-[6%] top-[18%]', delay: 0 },
  { Icon: Fingerprint, label: 'identity', className: 'right-[9%] top-[17%]', delay: 0.4 },
  { Icon: BarChart3, label: 'score', className: 'left-[13%] bottom-[20%]', delay: 0.8 },
  { Icon: Sparkles, label: 'signal', className: 'right-[16%] bottom-[16%]', delay: 1.2 },
]

function HeroFloatingGlyphs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden md:block">
      {floatingGlyphs.map(({ Icon, label, className, delay }) => (
        <motion.div
          key={label}
          initial={false}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 4, -3, 0],
            opacity: [0.42, 0.72, 0.42],
          }}
          transition={{
            duration: 5.8,
            delay,
            repeat: Infinity,
            ease: heroEase,
          }}
          className={`absolute ${className} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-blue-600 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </motion.div>
      ))}
    </div>
  )
}

function EvidencePanel() {
  return (
    <motion.div
      initial={false}
      animate={{ y: [0, -10, 0], rotateX: [0, 1.2, 0], rotateY: [-5, -2, -5] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: heroEase }}
      whileHover={{ rotateY: -1.5, rotateX: 1.8, scale: 1.012 }}
      className="relative mx-auto w-full max-w-[610px] [perspective:1400px] [transform-style:preserve-3d]"
    >
      <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.16),transparent_58%)] blur-2xl" />
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 26, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-200/70 lg:block"
      />
      <div className="absolute -right-3 top-16 h-44 w-44 rounded-full border border-blue-200/70 bg-blue-50/60 blur-sm" />
      <div className="absolute -left-6 bottom-16 h-36 w-36 rounded-full border border-emerald-200/70 bg-emerald-50/60 blur-sm" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {reviewRows.map((item, index) => {
          const Icon = item.icon
          const placement = [
            'left-[8%] top-[5%]',
            'right-[2%] top-[24%]',
            'bottom-[10%] right-[8%]',
            'bottom-[18%] left-[1%]',
          ][index]

          return (
            <motion.div
              key={item.label}
              initial={false}
              animate={{
                y: [0, index % 2 === 0 ? -10 : 10, 0],
                x: [0, index % 2 === 0 ? 8 : -8, 0],
                rotate: [0, index % 2 === 0 ? 2 : -2, 0],
              }}
              transition={{ duration: 5.6 + index * 0.25, delay: index * 0.35, repeat: Infinity, ease: heroEase }}
              className={`absolute ${placement} z-30 flex min-w-[148px] items-center gap-3 rounded-2xl border border-white/80 bg-white/82 px-3.5 py-3 shadow-[0_24px_55px_rgba(15,23,42,0.13)] backdrop-blur-xl`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-xs font-extrabold text-slate-900">{item.label}</span>
                <span className="block text-[11px] font-semibold text-slate-500">{item.value}</span>
              </span>
            </motion.div>
          )
        })}
      </div>

      <div className="relative z-20 rounded-[2.25rem] border border-slate-200/80 bg-white/90 p-3 shadow-[0_42px_110px_rgba(15,23,42,0.16)] backdrop-blur-xl [transform:translateZ(44px)]">
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: ['-18%', '118%'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: heroEase }}
          className="absolute left-0 top-14 h-px w-1/3 bg-gradient-to-r from-transparent via-blue-500/45 to-transparent"
        />
        <div className="rounded-[1.65rem] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold tracking-tight text-slate-950">Candidate review</p>
              <p className="text-xs font-semibold text-slate-500">Lead Product Designer</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              live evaluation
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.45rem] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-50/80 to-transparent" />
            <div className="relative z-10 p-5 md:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.03, 1] }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: heroEase }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-lg font-black text-blue-700 shadow-sm"
                  >
                    LG
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-extrabold tracking-tight text-slate-950">Lakshya Gupta</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Design systems, onboarding, AI product ops</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-5xl font-black leading-none tracking-[-0.06em] text-slate-950">91</div>
                  <div className="mt-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
                    Strong hire
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: heroEase }}
                  className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified proof
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-600">
                    Led recruiter onboarding and shipped four product surfaces with measurable adoption.
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 5.6, repeat: Infinity, ease: heroEase, delay: 0.3 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Risk check
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-600">
                    No title inflation detected. Two ambiguous timeline claims were down-weighted.
                  </p>
                </motion.div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-extrabold tracking-tight text-slate-950">Scorecard</p>
                  <p className="text-xs font-bold text-slate-500">6/6 agents agree</p>
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
                          transition={{ duration: 1, delay: 0.2 + index * 0.08, ease: heroEase }}
                          className={`h-full rounded-full ${row.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-900 bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Decision ledger</p>
                  <p className="mt-1 text-sm font-extrabold text-white">Signed report ready</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-bold text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.18)]" />
                  7c2e...94fa
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-4">
              <div className="grid grid-cols-4 gap-2">
                {reviewRows.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 shadow-sm">
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroConvergenceScene() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f8f8f6] px-5 py-10 md:px-6 md:py-12 lg:h-[calc(100vh-64px)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <motion.div
        aria-hidden
        animate={{ x: [-24, 24, -24], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_68%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [18, 0, 18] }}
        transition={{ duration: 16, repeat: Infinity, ease: heroEase }}
        className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.11),transparent_68%)] blur-3xl"
      />
      <HeroFloatingGlyphs />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
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
          <EvidencePanel />
        </div>
      </div>
    </section>
  )
}
