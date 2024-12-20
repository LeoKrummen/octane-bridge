'use client'

import { useState, useEffect } from 'react'
import { ShaderCard } from '@/components/shaders/ShaderCard'
import { ShaderPreviewModal } from '@/components/shaders/ShaderPreviewModal'
import { Shader } from '@/types/shader'
import { getShaders } from '@/lib/database'

export default function ShadersPage() {
  const [shaders, setShaders] = useState<Shader[]>([])
  const [selectedShader, setSelectedShader] = useState<Shader | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadShaders() {
      try {
        const data = await getShaders()
        setShaders(data)
      } catch (err) {
        setError('Failed to load shaders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadShaders()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Octane Bridge Shader Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shaders.map((shader) => (
          <ShaderCard
            key={shader.id}
            shader={shader}
            onClick={() => setSelectedShader(shader)}
          />
        ))}
      </div>
      {selectedShader && (
        <ShaderPreviewModal
          shader={selectedShader}
          onClose={() => setSelectedShader(null)}
        />
      )}
    </div>
  )
} 