import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Log environment variables (remove these logs before production)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Test the connection with a simpler method
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }
    
    return NextResponse.json({ 
      message: 'Successfully connected to Supabase!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      session: session ? 'Active' : 'None'
    })
  } catch (error: any) {
    console.error('Supabase connection error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to connect to Supabase',
      details: error?.message || 'Unknown error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }, { status: 500 })
  }
} 