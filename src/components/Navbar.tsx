'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  
  // Check auth state on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    
    getUser()
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }
  
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-md border rounded-full px-6 py-2">
      <div className="flex items-center justify-between space-x-4">
        <Link href="/" className="text-xl font-bold">
          Octane Bridge
        </Link>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
