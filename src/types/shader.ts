export interface Shader {
  id: string
  title: string
  description: string
  preview_image_url: string
  shader_file_url: string
  created_at: string
  updated_at: string
  category: string | null
  tags: string[] | null
  downloads: number
} 