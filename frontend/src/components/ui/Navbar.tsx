'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  UserPlus,
  LogIn,
  ClipboardCheck,
  FileText,
  Sparkles,
  Network,
} from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home', icon: Home, match: (pathname: string) => pathname === '/' },
]

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  className = '',
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  className?: string
}) {
  return (
    <motion.div whileTap={{ scale: 0.95 }} className="relative">
      <Link
        href={href}
        className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 type-label font-medium select-none text-text-secondary hover:text-text-primary group/nav ${className}`}
      >
        <div className="p-0.5 rounded border border-border-subtle bg-bg-deep transition-transform duration-300 group-hover/nav:scale-110 group-hover/nav:rotate-6">
          <Icon className={`w-3 h-3 ${isActive ? 'text-accent-primary' : 'text-text-tertiary'}`} />
        </div>
        <span className="hidden md:inline">{label}</span>
        {isActive && (
          <motion.div
            layoutId="navbar-active-indicator"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute inset-0 bg-accent-primary/5 border border-accent-primary/20 rounded-lg -z-10"
          />
        )}
      </Link>
    </motion.div>
  )
}

function NavbarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams?.get('mode')
  const isAuthPage = pathname === '/auth'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-surface/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center font-display font-bold text-base text-white shadow-sm relative overflow-hidden"
          >
            <span className="relative z-10">W</span>
            <motion.div
              className="absolute inset-0 bg-accent-primary/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
          <span className="font-display font-extrabold text-base sm:text-lg text-text-primary tracking-tight transition-all duration-200 group-hover:text-accent-primary">
            Hiring Wallah
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={item.match(pathname ?? '')}
            />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth?mode=signin"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 type-label font-medium font-bold transition-all duration-200 ${
                isAuthPage && mode === 'signin'
                  ? 'text-accent-primary bg-accent-primary/5 border border-accent-primary/20'
                  : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-border-subtle'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/auth?mode=signup"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 type-label font-medium font-bold transition-all duration-200 ${
                isAuthPage && mode === 'signup'
                  ? 'bg-accent-primary/90 text-white border border-accent-primary'
                  : 'bg-accent-primary hover:bg-accent-primary/95 text-white border border-accent-primary shadow-sm'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

function NavbarFallback() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-surface/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center font-display font-bold text-base text-white shadow-sm">
            W
          </div>
          <span className="font-display font-extrabold text-base sm:text-lg text-text-primary tracking-tight">
            Hiring Wallah
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={item.match(pathname ?? '')}
            />
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/auth?mode=signin"
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 type-label font-medium font-bold text-text-secondary"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
          <Link
            href="/auth?mode=signup"
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 type-label font-medium font-bold bg-accent-primary text-white"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Up</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  )
}
