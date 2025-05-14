"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
import type { Prompt } from "@/types/prompt"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"

interface PromptDetailProps {
  prompt: Prompt
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Prompt Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prompt">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="prompt" className="flex-1">
              Prompt
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">
              Analysis
            </TabsTrigger>
            {prompt.example && (
              <TabsTrigger value="example" className="flex-1">
                Example
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="prompt" className="space-y-4">
            <div className="relative">
              <pre className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 p-4 rounded-md whitespace-pre-wrap text-sm border border-gray-200 dark:border-gray-700">{prompt.content}</pre>
              <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={copyToClipboard}>
                {copied ? "Copied!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {prompt.instructions && (
              <div>
                <h3 className="font-bold mb-2 dark:text-white">How to use:</h3>
                <p className="text-gray-600 dark:text-gray-300">{prompt.instructions}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-4">
              {prompt.rating && (
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    <div className="text-3xl font-bold dark:text-white">{prompt.rating}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold dark:text-white">Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-300">{prompt.analysis || "No analysis available."}</p>
                  </div>
                </div>
              )}

              {prompt.strengths && (
                <div>
                  <h3 className="font-bold mb-2 dark:text-white">Strengths:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {prompt.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prompt.weaknesses && (
                <div>
                  <h3 className="font-bold mb-2 dark:text-white">Areas for Improvement:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {prompt.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          {prompt.example && (
            <TabsContent value="example">
              <div className="space-y-4">
                <h3 className="font-bold dark:text-white">Example Output:</h3>
                <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 p-4 rounded-md whitespace-pre-wrap text-sm border border-gray-200 dark:border-gray-700">{prompt.example}</div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
