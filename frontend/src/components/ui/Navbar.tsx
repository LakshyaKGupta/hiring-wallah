'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Cpu, User, Briefcase, LogIn } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Cpu },
    { href: '/recruiter', label: 'Recruiters', icon: Briefcase },
    { href: '/candidate', label: 'Candidates', icon: User },
    { href: '/auth', label: 'Sign In', icon: LogIn }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-surface/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center font-display font-bold text-base text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            W
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-wide transition-colors group-hover:text-accent-primary">
            Hiring Wallah
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="relative px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors select-none text-text-secondary hover:text-text-primary"
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent-primary' : 'text-text-tertiary'}`} />
                <span>{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-accent-primary/5 border border-accent-primary/20 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
