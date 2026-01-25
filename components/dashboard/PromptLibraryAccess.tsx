"use client"

import { FileText, ArrowRight, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromptCard } from "./PromptCard"
import { cn } from "@/lib/utils"

interface Prompt {
  id: string
  title: string
  description: string | null
  categoryName: string | null
  complexityLevel: "beginner" | "intermediate" | "advanced" | null
  usageCount: number
  averageRating: number
}

interface Collection {
  id: string
  name: string
  description: string | null
  promptCount: number
  createdAt: string
}

interface PromptLibraryAccessProps {
  featuredPrompts: Prompt[]
  collections: Collection[]
  className?: string
}

export function PromptLibraryAccess({
  featuredPrompts,
  collections,
  className
}: PromptLibraryAccessProps) {
  const handleCopyPrompt = (promptId: string) => {
    console.log("Copy prompt:", promptId)
  }

  return (
    <div className={cn("space-y-8", className)}>
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-50">Prompt Library</h2>
          </div>
          <Button 
            variant="outline"
            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
            size="sm"
            asChild
          >
            <a href="/solutions/prompts">
              Browse All Prompts
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="neon-line mb-8" />

        {featuredPrompts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPrompts.slice(0, 3).map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description || undefined}
                category={prompt.categoryName || undefined}
                complexity={prompt.complexityLevel || undefined}
                rating={prompt.averageRating}
                usageCount={prompt.usageCount}
                onCopy={() => handleCopyPrompt(prompt.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-slate-500 text-sm">No featured prompts available</p>
          </div>
        )}
      </div>

      {collections.length > 0 && (
        <div className="glass-panel-solid p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-slate-50">My Collections</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                className="p-4 rounded-lg border border-white/10 hover:border-violet-500/30 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/solutions/prompts?collection=${collection.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-50">{collection.name}</h4>
                  <span className="text-xs font-mono px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">
                    {collection.promptCount}
                  </span>
                </div>
                {collection.description && (
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
