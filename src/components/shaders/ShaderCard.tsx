'use client'

import Image from 'next/image'
import { Shader } from '@/types/shader'
import { PlaceholderSVG } from '@/components/ui/PlaceholderImage'

interface ShaderCardProps {
  shader: Shader
  onClick: () => void
}

export function ShaderCard({ shader, onClick }: ShaderCardProps) {
  const placeholderImage = PlaceholderSVG()

  return (
    <div
      className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={shader.preview_image_url || placeholderImage}
          alt={shader.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-center">{shader.title}</h3>
      </div>
    </div>
  )
} 