import { supabase } from './supabase'
import type { Shader } from '@/types/shader'

export async function getShaders() {
  const { data, error } = await supabase
    .from('shaders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shaders:', error)
    throw error
  }

  return data as Shader[]
}

export async function getShaderById(id: string) {
  const { data, error } = await supabase
    .from('shaders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching shader:', error)
    throw error
  }

  return data as Shader
} 