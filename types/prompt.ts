export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  categories: string[]
  rating?: number
  analysis?: string
  strengths?: string[]
  weaknesses?: string[]
  instructions?: string
  example?: string
  createdBy?: string
  createdAt: string
  updatedAt?: string
}
