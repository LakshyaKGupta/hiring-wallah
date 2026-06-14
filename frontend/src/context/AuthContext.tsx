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
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// ── Types ─────────────────────────────────────

export type UserRole = 'recruiter' | 'candidate' | null
type ConcreteUserRole = Exclude<UserRole, null>

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
  signInWithGoogle: (preferredRole?: ConcreteUserRole) => Promise<{ isNewUser: boolean; role: UserRole }>
  startMockSession: (params: { role: ConcreteUserRole; email: string; displayName?: string }) => AuthUser
  signOut:         () => Promise<void>
  setUserRole:     (role: ConcreteUserRole) => Promise<void>
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
        setUser(readMockSession())
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Google Sign-In ────────────────────────────
  async function signInWithGoogle(preferredRole?: ConcreteUserRole): Promise<{ isNewUser: boolean; role: UserRole }> {
    assertHiringWallahFirebaseConfig()

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
      const role = ((snap.data()?.role ?? readLocalRole(fbUser.uid)) ?? null) as UserRole
      setUser(toAuthUser(fbUser, role))
      return { isNewUser, role }
    }

    // New Google signup: if the signup form already selected a role, persist it
    // immediately so users are not asked the same question twice.
    const role = preferredRole ?? readLocalRole(fbUser.uid)
    if (role) await persistUserRole(fbUser, role)

    setUser(toAuthUser(fbUser, role ?? null))
    return { isNewUser, role: role ?? null }
  }

  // ── Set role (called after role modal) ────────
  async function setUserRole(role: ConcreteUserRole) {
    if (!user) return

    if (user.uid.startsWith('mock-')) {
      const nextUser = { ...user, role }
      writeMockSession(nextUser)
      setUser(nextUser)
      return
    }

    writeLocalRole(user.uid, role)
    try {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        uid:         user.uid,
        email:       user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL:    user.photoURL ?? '',
        role,
        createdAt: serverTimestamp(),
      }, { merge: true })
    } catch (error) {
      console.warn('Role saved locally; Firestore role sync is not available yet.', error)
    }

    setUser((prev) => prev ? { ...prev, role } : null)
  }

  // ── Sign Out ──────────────────────────────────
  async function signOut() {
    clearMockSession()
    await firebaseSignOut(auth)
    setUser(null)
  }

  function startMockSession(params: { role: ConcreteUserRole; email: string; displayName?: string }) {
    const nextUser: AuthUser = {
      uid: `mock-${params.role}-${Date.now()}`,
      email: params.email || null,
      displayName: params.displayName || params.email || 'Hiring Wallah User',
      photoURL: null,
      role: params.role,
    }
    writeMockSession(nextUser)
    setUser(nextUser)
    return nextUser
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, startMockSession, signOut, setUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Internal helpers ──────────────────────────

async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return ((snap.exists() ? snap.data()?.role : null) ?? readLocalRole(uid)) ?? null
  } catch {
    return readLocalRole(uid)
  }
}

function toAuthUser(firebaseUser: FirebaseUser, role: UserRole): AuthUser {
  return {
    uid:         firebaseUser.uid,
    email:       firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL:    firebaseUser.photoURL,
    role,
  }
}

async function persistUserRole(firebaseUser: FirebaseUser, role: ConcreteUserRole) {
  writeLocalRole(firebaseUser.uid, role)

  try {
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid:         firebaseUser.uid,
      email:       firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
      photoURL:    firebaseUser.photoURL ?? '',
      role,
      createdAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    console.warn('Role saved locally; Firestore role sync is not available yet.', error)
  }
}

function readLocalRole(uid: string): ConcreteUserRole | null {
  if (typeof window === 'undefined') return null
  try {
    const roles = JSON.parse(window.localStorage.getItem('hiring-wallah.roles') ?? '{}') as Record<string, ConcreteUserRole>
    return roles[uid] === 'recruiter' || roles[uid] === 'candidate' ? roles[uid] : null
  } catch {
    return null
  }
}

function writeLocalRole(uid: string, role: ConcreteUserRole) {
  if (typeof window === 'undefined') return
  try {
    const roles = JSON.parse(window.localStorage.getItem('hiring-wallah.roles') ?? '{}') as Record<string, ConcreteUserRole>
    roles[uid] = role
    window.localStorage.setItem('hiring-wallah.roles', JSON.stringify(roles))
  } catch {
    // Local role fallback is best-effort only.
  }
}

function readMockSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const parsed = JSON.parse(window.localStorage.getItem('hiring-wallah.mockSession') ?? 'null') as AuthUser | null
    if (!parsed?.uid || (parsed.role !== 'recruiter' && parsed.role !== 'candidate')) return null
    return parsed
  } catch {
    return null
  }
}

function writeMockSession(user: AuthUser) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem('hiring-wallah.mockSession', JSON.stringify(user))
  } catch {
    // Mock session is a frontend-only bridge until email/password auth is implemented.
  }
}

function clearMockSession() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem('hiring-wallah.mockSession')
  } catch {
    // No-op.
  }
}

function assertHiringWallahFirebaseConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? ''
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''
  const configValues = [authDomain, projectId, storageBucket].filter(Boolean).join(' ')

  if (/agenteval/i.test(configValues)) {
    const error = new Error(
      'Google sign-in is still configured for the AgentEval Firebase project. Replace the Firebase env values with the Hiring Wallah Firebase app before opening Google auth.',
    ) as Error & { code: string }
    error.code = 'auth/wrong-firebase-project'
    throw error
  }

  if (!projectId || !/hiring-wallah/i.test(projectId)) {
    const error = new Error(
      'Google sign-in must use a Hiring Wallah Firebase project. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID to the Hiring Wallah Firebase project before opening Google auth.',
    ) as Error & { code: string }
    error.code = 'auth/wrong-firebase-project'
    throw error
  }
}
