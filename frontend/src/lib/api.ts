import type { User as FirebaseUser } from 'firebase/auth'

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  firebaseUser?: FirebaseUser | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (firebaseUser) {
    headers.set('Authorization', `Bearer ${await firebaseUser.getIdToken()}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const payload = await response.json()
      message = payload.detail || payload.message || message
    } catch {
      // Keep the HTTP status message.
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
