import type { Metadata } from "next"
import { PromptsHero } from "@/components/prompts-hero"
import { PromptLibrary } from "@/components/prompt-library"
import { PromptsCTA } from "@/components/prompts-cta"
import { PromptAnalysisMethodology } from "@/components/prompt-analysis-methodology"
import { getAllPrompts, getAllPromptCategories } from "@/lib/prompt-loader"

export const metadata: Metadata = {
  title: "AI Prompt Library | Curve AI Solutions",
  description: "Browse our collection of effective AI prompts for various business use cases.",
}

export default function PromptsPage() {
  const allPrompts = getAllPrompts()
  const allCategories = ["all", ...getAllPromptCategories()]

  return (
    <div className="min-h-screen">
      <PromptsHero />
      
      <PromptLibrary prompts={allPrompts} categories={allCategories} />
      
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-16">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6">
            AI Prompt Analysis and Scoring Methodology
          </h2>
          <PromptAnalysisMethodology />
        </div>
      </div>
      
      <PromptsCTA />
    </div>
  )
}
