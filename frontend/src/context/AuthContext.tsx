'use client'

// src/context/AuthContext.tsx
// ─────────────────────────────────────────────
// Global authentication context.
// Provides: user, loading, signInWithGoogle, signOut
// Wraps the entire app in layout.tsx.
// ─────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────

export type UserRole = 'recruiter' | 'candidate' | null

export interface AuthUser {
  uid:         string
  email:       string | null
  displayName: string | null
  photoURL:    string | null
  role:        UserRole
}

interface AuthContextValue {
  user:            AuthUser | null
  loading:         boolean
  signInWithGoogle: () => Promise<{ isNewUser: boolean; role: UserRole }>
  signOut:         () => Promise<void>
  setUserRole:     (role: 'recruiter' | 'candidate') => Promise<void>
}

// ── Context ───────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ── Provider ──────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = await getUserRole(firebaseUser.uid)
        setUser({
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL:    firebaseUser.photoURL,
          role,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Google Sign-In ────────────────────────────
  async function signInWithGoogle(): Promise<{ isNewUser: boolean; role: UserRole }> {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const result = await signInWithPopup(auth, provider)
    const fbUser = result.user

    // Check if this user exists in Firestore already
    const userRef = doc(db, 'users', fbUser.uid)
    const snap = await getDoc(userRef)
    const isNewUser = !snap.exists()

    if (!isNewUser) {
      // Existing user — sync role from Firestore
      const role = (snap.data()?.role ?? null) as UserRole
      setUser({
        uid:         fbUser.uid,
        email:       fbUser.email,
        displayName: fbUser.displayName,
        photoURL:    fbUser.photoURL,
        role,
      })
      return { isNewUser, role }
    } else {
      // New user — role not set yet; will be set by RoleModal
      setUser({
        uid:         fbUser.uid,
        email:       fbUser.email,
        displayName: fbUser.displayName,
        photoURL:    fbUser.photoURL,
        role: null,
      })
      return { isNewUser, role: null }
    }
  }

  // ── Set role (called after role modal) ────────
  async function setUserRole(role: 'recruiter' | 'candidate') {
    if (!user) return

    // Write to Firestore
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
      uid:         user.uid,
      email:       user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL:    user.photoURL ?? '',
      role,
      createdAt: serverTimestamp(),
    }, { merge: true })

    // Mirror to Supabase PostgreSQL
    try {
      await supabase.from('users').upsert({
        firebase_uid: user.uid,
        email:        user.email ?? '',
        name:         user.displayName ?? '',
        role,
      }, { onConflict: 'firebase_uid' })
    } catch {
      // Supabase is optional for auth — don't block the flow
      console.warn('Supabase sync skipped (keys not configured yet)')
    }

    setUser((prev) => prev ? { ...prev, role } : null)
  }

  // ── Sign Out ──────────────────────────────────
  async function signOut() {
    await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, setUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Internal helpers ──────────────────────────

async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return (snap.exists() ? snap.data()?.role : null) ?? null
  } catch {
    return null
  }
}
