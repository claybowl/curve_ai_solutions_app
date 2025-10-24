"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockPrompts = [
  { id: "1", title: "Business Analysis", category: "analysis", description: "Analyze business processes", tags: ["business", "ai"] },
  { id: "2", title: "Content Creation", category: "content", description: "Generate marketing content", tags: ["content", "marketing"] },
]

export default function PromptsPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Prompt Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your prompt templates and workflows
        </p>
      </div>

      <div className="grid gap-4">
        {mockPrompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {prompt.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Badge>{prompt.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
