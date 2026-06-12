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
  Sparkles,
} from 'lucide-react'

const heroEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const evidenceTrail = [
  { label: 'Resume parsed', value: '42 claims', icon: FileCheck2 },
  { label: 'Rubric matched', value: '91%', icon: BarChart3 },
  { label: 'Report signed', value: 'sha256', icon: Fingerprint },
]

const scoreRows = [
  { label: 'System design', score: 94, color: 'bg-slate-900' },
  { label: 'Role ownership', score: 88, color: 'bg-blue-600' },
  { label: 'Evidence quality', score: 96, color: 'bg-emerald-500' },
]

const floatingGlyphs = [
  { Icon: FileCheck2, label: 'resume', className: 'left-[6%] top-[18%]', delay: 0 },
  { Icon: Fingerprint, label: 'identity', className: 'right-[9%] top-[17%]', delay: 0.4 },
  { Icon: BarChart3, label: 'score', className: 'left-[13%] bottom-[20%]', delay: 0.8 },
  { Icon: Sparkles, label: 'signal', className: 'right-[16%] bottom-[16%]', delay: 1.2 },
]

const orbitCards = [
  { label: 'Resume', value: '42 claims', position: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', delay: 0, icon: FileCheck2 },
  { label: 'Rubric', value: 'weighted', position: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', delay: 0.7, icon: BarChart3 },
  { label: 'Score', value: '91%', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', delay: 1.4, icon: CheckCircle2 },
  { label: 'Signed', value: '7c2e...', position: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', delay: 2.1, icon: Fingerprint },
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

function DecisionOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block [transform-style:preserve-3d]">
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-200/70"
      />
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: heroEase }}
        className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
      >
        {orbitCards.map(({ label, value, position, delay, icon: Icon }) => (
          <motion.div
            key={label}
            initial={false}
            animate={{ rotate: [0, -360], y: [0, -8, 0], scale: [1, 1.035, 1] }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: heroEase },
              y: { duration: 4.8, delay, repeat: Infinity, ease: heroEase },
              scale: { duration: 4.8, delay, repeat: Infinity, ease: heroEase },
            }}
            className={`absolute ${position} z-30 flex min-w-[128px] items-center gap-3 rounded-2xl border border-white/80 bg-white/78 px-3.5 py-3 shadow-[0_24px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl [transform-style:preserve-3d]`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-black text-slate-900">{label}</span>
              <span className="block text-[11px] font-semibold text-slate-500">{value}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function EvidencePanel() {
  return (
    <motion.div
      initial={false}
      animate={{ y: [0, -10, 0], rotateX: [0, 1.4, 0], rotateY: [-6, -3, -6] }}
      transition={{
        duration: 7.5,
        repeat: Infinity,
        ease: heroEase,
      }}
      whileHover={{ rotateY: -2, rotateX: 2, scale: 1.015 }}
      className="relative mx-auto w-full max-w-[560px] [perspective:1200px] [transform-style:preserve-3d]"
    >
      <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.18),transparent_58%)] blur-2xl" />
      <DecisionOrbit />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: heroEase }}
        className="absolute -inset-5 rounded-[2.75rem] border border-blue-200/60"
      />
      <div className="absolute -right-4 top-14 h-44 w-44 rounded-full border border-blue-200/70 bg-blue-50/60 blur-sm" />
      <div className="absolute -left-5 bottom-16 h-36 w-36 rounded-full border border-emerald-200/70 bg-emerald-50/60 blur-sm" />

      <div className="relative z-20 rounded-[2rem] border border-slate-200/80 bg-white/88 p-3 shadow-[0_38px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl [transform:translateZ(40px)]">
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: ['-18%', '118%'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: heroEase }}
          className="absolute left-0 top-9 h-px w-1/3 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
              live evaluation
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: heroEase }}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Candidate dossier</p>
                    <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">Lakshya Gupta</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 font-extrabold text-blue-700">
                    LG
                  </div>
                </div>
                <div className="space-y-2.5">
                  {['Design systems lead', '4 shipped product lines', 'Recruiter onboarding'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: heroEase, delay: 0.4 }}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Role rubric</span>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">weighted</span>
                </div>
                <div className="space-y-3">
                  {scoreRows.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>{row.label}</span>
                        <span>{row.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <motion.div
                          initial={false}
                          animate={{ width: `${row.score}%` }}
                          transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${row.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="absolute left-8 top-20 h-[230px] w-px bg-gradient-to-b from-blue-200 via-slate-200 to-emerald-200" />
              <div className="relative z-10 mb-7">
                <p className="text-xs font-semibold text-slate-500">Consensus report</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-6xl font-black tracking-[-0.06em] text-slate-950">91</div>
                    <p className="-mt-1 text-sm font-bold text-emerald-600">Strong hire</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                    6/6 agents agree
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                {evidenceTrail.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.label}
                      initial={false}
                      animate={{ y: [0, index % 2 === 0 ? -3 : 3, 0] }}
                      transition={{ duration: 4.4, delay: index * 0.25, repeat: Infinity, ease: heroEase }}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/90 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white bg-white shadow-sm">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs font-medium text-slate-500">{item.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="relative z-10 mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Decision ledger</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.18)]" />
                </div>
                <div className="h-2.5 w-4/5 rounded-full bg-white/18" />
                <div className="mt-2 h-2.5 w-3/5 rounded-full bg-white/12" />
                <div className="mt-4 text-xs font-semibold text-slate-300">Signed: 7c2e...94fa</div>
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
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center overflow-hidden bg-[#f7f8fb] px-6 py-10 md:py-12 lg:h-[calc(100vh-64px)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.13),transparent_68%)] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_68%)] blur-3xl" />
      <HeroFloatingGlyphs />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-7 text-left lg:col-span-5">
          <div className="space-y-5">
            <motion.h1
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: heroEase }}
              className="font-display text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-7xl lg:text-[5.15rem]"
            >
              Hiring decisions with receipts.
            </motion.h1>
            <motion.p
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: heroEase }}
              className="max-w-xl text-lg font-medium leading-8 text-slate-600"
            >
              Hiring Wallah turns resumes, job requirements, and recruiter rules into defensible scorecards with visible evidence trails and signed consensus reports.
            </motion.p>
          </div>

          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: heroEase }}
            className="flex flex-col gap-3 sm:flex-row"
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
            className="grid max-w-xl grid-cols-3 gap-3 pt-2"
          >
            {[
              ['6x', 'faster screening'],
              ['100%', 'explainable'],
              ['SHA', 'signed reports'],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black tracking-[-0.04em] text-slate-950">{stat}</div>
                <div className="mt-1 text-xs font-semibold leading-snug text-slate-500">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hidden md:block lg:col-span-7">
          <EvidencePanel />
        </div>
      </div>
    </section>
  )
}
