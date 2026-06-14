'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Bot,
  Briefcase,
  CalendarCheck,
  ChevronDown,
  FileSearch,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export type WorkspaceRole = 'recruiter' | 'candidate'

export interface WorkspaceNavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  contribution: string
}

export interface WorkspaceAction {
  title: string
  description: string
  steps?: string[]
  cta?: string
}

interface WorkspaceShellProps {
  role: WorkspaceRole
  activeId: string
  title: string
  subtitle: string
  primaryActionLabel: string
  onPrimaryAction: () => void
  children: React.ReactNode
  toast?: string
  action: WorkspaceAction | null
  onCloseAction: () => void
}

const recruiterNav: WorkspaceNavItem[] = [
  { id: 'command', label: 'Command', href: '#command', icon: LayoutDashboard, contribution: 'Daily operating view' },
  { id: 'roles', label: 'Roles', href: '#roles', icon: Briefcase, contribution: 'Open hiring demand' },
  { id: 'shortlist', label: 'Shortlist', href: '#shortlist', icon: FileSearch, contribution: 'Evidence-ranked talent' },
  { id: 'agents', label: 'AI Agents', href: '#agents', icon: Bot, contribution: 'Screening automation' },
  { id: 'reports', label: 'Reports', href: '#reports', icon: ShieldCheck, contribution: 'Decision records' },
]

const candidateNav: WorkspaceNavItem[] = [
  { id: 'studio', label: 'Studio', href: '#studio', icon: LayoutDashboard, contribution: 'Readiness overview' },
  { id: 'resume', label: 'Resume', href: '#resume', icon: UploadCloud, contribution: 'Profile analysis' },
  { id: 'matches', label: 'Matches', href: '#matches', icon: Target, contribution: 'Role alignment' },
  { id: 'coach', label: 'Coach', href: '#coach', icon: Sparkles, contribution: 'Skill gap closure' },
  { id: 'interviews', label: 'Interviews', href: '#interviews', icon: CalendarCheck, contribution: 'Panel prep' },
]

export function WorkspaceShell({
  role,
  activeId,
  title,
  subtitle,
  primaryActionLabel,
  onPrimaryAction,
  children,
  toast,
  action,
  onCloseAction,
}: WorkspaceShellProps) {
  const { user, signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const nav = role === 'recruiter' ? recruiterNav : candidateNav
  const roleLabel = role === 'recruiter' ? 'Recruiter workspace' : 'Candidate workspace'
  const initials = useMemo(() => {
    const name = user?.displayName || user?.email || 'User'
    return name.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2)
  }, [user?.displayName, user?.email])

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white/94 py-5 text-slate-950 shadow-[8px_0_40px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col ${
        sidebarCollapsed ? 'w-[88px] px-3' : 'w-[272px] px-4'
      }`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
          <Link href="/" className={`flex min-w-0 items-center rounded-2xl ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-base font-black text-white">W</div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold tracking-tight text-slate-950">Hiring Wallah</div>
                <div className="truncate text-xs font-semibold text-slate-500">Hiring intelligence OS</div>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            className={`${sidebarCollapsed ? 'absolute right-[-14px] top-6' : ''} grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950`}
            aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
            title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <div className={`mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 ${
          sidebarCollapsed ? 'text-center' : ''
        }`}>
          {sidebarCollapsed ? roleLabel.split(' ')[0] : roleLabel}
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = activeId === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                title={sidebarCollapsed ? `${item.label}: ${item.contribution}` : undefined}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`group rounded-2xl border transition duration-150 ${
                  sidebarCollapsed ? 'flex h-12 items-center justify-center px-0 py-0' : 'px-3 py-3'
                } ${
                  active
                    ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                </div>
                {!sidebarCollapsed && (
                  <div className={`mt-1 pl-7 text-[11px] font-semibold leading-4 ${
                    active ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-500'
                  }`}>
                    {item.contribution}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Workspace sample data
            </div>
            <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
              Interactive frontend state for validating the workflow before backend wiring.
            </p>
          </div>
        )}
      </aside>

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[272px]'}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/86 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="min-w-0">
              <div className="hidden text-[11px] font-bold text-slate-500 sm:block">
                {role === 'recruiter' ? 'Recruiter operating console' : 'Candidate career console'}
              </div>
              <h1 className="truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">{title}</h1>
            </div>

            <div className="hidden min-w-[280px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 md:flex">
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate">{subtitle}</span>
              <kbd className="rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="hidden rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex"
              >
                {primaryActionLabel}
              </button>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent-primary text-xs font-black text-white">{initials}</div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                      <div className="border-b border-slate-100 p-4">
                        <p className="truncate text-sm font-extrabold text-slate-950">{user?.displayName ?? 'Hiring Wallah User'}</p>
                        <p className="truncate text-xs font-semibold text-slate-500">{user?.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void signOut()}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {nav.map((item) => {
              const Icon = item.icon
              const active = activeId === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
                    active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              )
            })}
          </div>
        </header>

        <main className="relative px-4 py-6 sm:px-6 lg:px-8">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
          {children}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {action && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm"
              onClick={onCloseAction}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                <div>
                  <p className="text-xs font-bold text-slate-500">Prototype action</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>{action.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{action.description}</p>
                </div>
                <button type="button" onClick={onCloseAction} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50" aria-label="Close action">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {(action.steps ?? []).map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</div>
                    <p className="text-sm font-semibold leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 p-5">
                <button type="button" onClick={onCloseAction} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800">
                  {action.cta ?? 'Close prototype action'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
