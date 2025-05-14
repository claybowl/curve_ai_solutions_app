import type { Metadata } from "next"
import { PromptsHero } from "@/components/prompts-hero"
import { PromptLibrary } from "@/components/prompt-library"
import { PromptsCTA } from "@/components/prompts-cta"
import { PromptAnalysisMethodology } from "@/components/prompt-analysis-methodology"

export const metadata: Metadata = {
  title: "AI Prompt Library | Curve AI Solutions",
  description: "Browse our collection of effective AI prompts for various business use cases.",
}

export default function PromptsPage() {
  return (
    <div className="min-h-screen">
      <PromptsHero />
      
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6">AI Prompt Analysis and Scoring Methodology</h2>
          <PromptAnalysisMethodology />
        </div>
      </section>
      
      <PromptLibrary />
      <PromptsCTA />
    </div>
  )
}
