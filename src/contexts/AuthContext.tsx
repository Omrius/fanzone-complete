import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, role: 'fan' | 'creator') => Promise<void>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUserProfile(session.user.id)
      else setIsLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUserProfile(session.user.id)
      else { setUser(null); setIsLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchUserProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setUser(data as User)
    setIsLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string, username: string, role: 'fan' | 'creator') {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, role } }
    })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, username, role })
      if (role === 'creator') {
        await supabase.from('creators').insert({ user_id: data.user.id, display_name: username, bio: '', category: 'general' })
      }
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function signInWithOAuth(provider: 'google' | 'github') {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signIn, signUp, signOut, signInWithOAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}