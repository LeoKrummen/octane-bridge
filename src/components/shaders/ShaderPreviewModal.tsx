'use client'

import Image from 'next/image'
import { Shader } from '@/types/shader'
import { X } from 'lucide-react'
import { PlaceholderSVG } from '@/components/ui/PlaceholderImage'

interface ShaderPreviewModalProps {
  shader: Shader
  onClose: () => void
}

export function ShaderPreviewModal({ shader, onClose }: ShaderPreviewModalProps) {
  const placeholderImage = PlaceholderSVG()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-2xl w-full">
        <div className="relative h-64">
          <Image
            src={shader.preview_image_url || placeholderImage}
            alt={shader.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{shader.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mb-6">{shader.description}</p>
          <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-200">
            Import to Blender
          </button>
        </div>
      </div>
    </div>
  )
} 