import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware executing for:', req.nextUrl.pathname, { persist: true })
  
  // Create a response and get session
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session error:', error, { persist: true })
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    console.log('Session status:', session ? 'authenticated' : 'unauthenticated', { persist: true })

    // If accessing /shaders without a session, redirect to auth
    if (req.nextUrl.pathname.startsWith('/shaders')) {
      if (!session) {
        console.log('No session, redirecting to auth', { persist: true })
        return NextResponse.redirect(new URL('/auth', req.url))
      }
      console.log('Session valid, allowing access to shaders', { persist: true })
    }

    // Set the session in the response
    return res

  } catch (error) {
    console.error('Middleware error:', error, { persist: true })
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}

export const config = {
  matcher: ['/shaders/:path*']
} 