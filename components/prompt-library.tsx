"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PromptCard } from "@/components/prompt-card"
import { PromptDetail } from "@/components/prompt-detail"
import { promptsData } from "@/data/prompts"
import { agentPrompts } from "@/data/agent-prompts"
import { tradingPrompts } from "@/data/trading-prompts"

export function PromptLibrary() {
  // Combine all prompt data
  const allPrompts = [...promptsData, ...agentPrompts, ...tradingPrompts]

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPrompt, setSelectedPrompt] = useState(allPrompts[0])

  // Get unique categories from prompts
  const categories = ["all", ...new Set(allPrompts.flatMap((prompt) => prompt.categories))]

  // Filter prompts based on search query and selected category
  const filteredPrompts = allPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || prompt.categories.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar - Categories */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Categories</h2>
          <div className="space-y-1">
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

        {/* Middle - Prompt list */}
        <div className="flex-1">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          <div className="space-y-4">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onClick={() => setSelectedPrompt(prompt)}
                  isSelected={selectedPrompt.id === prompt.id}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No prompts found matching your search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right - Prompt detail */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <PromptDetail prompt={selectedPrompt} />
        </div>
      </div>
    </div>
  )
}
