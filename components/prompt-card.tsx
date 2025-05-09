"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/custom-card"
import { Badge } from "@/components/ui/badge"
import type { Prompt } from "@/types/prompt"

interface PromptCardProps {
  prompt: Prompt
  onClick: () => void
  isSelected: boolean
}

export function PromptCard({ prompt, onClick, isSelected }: PromptCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:border-[#0076FF]/50 ${
        isSelected ? "border-2 border-[#0076FF]" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-foreground dark:text-white">{prompt.title}</CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {prompt.rating ? `Rating: ${prompt.rating}/100` : ""}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{prompt.description}</p>
        <div className="flex flex-wrap gap-2">
          {prompt.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
