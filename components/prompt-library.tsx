"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PromptCard } from "@/components/prompt-card"
import { PromptDetail } from "@/components/prompt-detail"
import type { Prompt } from "@/types/prompt"

interface PromptLibraryProps {
  prompts: Prompt[];
  categories: string[];
}

export function PromptLibrary({ prompts: allPrompts, categories }: PromptLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrompt, setSelectedPrompt] = useState(allPrompts.length > 0 ? allPrompts[0] : null)

  const filteredPrompts = allPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || (prompt.categories && prompt.categories.includes(selectedCategory))

    return matchesSearch && matchesCategory
  })

  if (!selectedPrompt && allPrompts.length > 0) {
    setSelectedPrompt(allPrompts[0]);
  }

  return (
    <section className="bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto">
        {/* Search bar at the top - fixed position */}
        <div className="mb-8 w-full">
          <Input
            type="search"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-2xl mx-auto dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Categories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Categories</h2>
              <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? "bg-[#0076FF] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle - Prompt list */}
          <div className="flex-1">
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {filteredPrompts.length > 0 ? (
                  filteredPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onClick={() => setSelectedPrompt(prompt)}
                      isSelected={selectedPrompt ? selectedPrompt.id === prompt.id : false}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No prompts found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Prompt detail */}
          {selectedPrompt ? (
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <PromptDetail prompt={selectedPrompt} />
            </div>
          ) : (
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <p className="text-gray-500 dark:text-gray-400">Select a prompt to see details.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
