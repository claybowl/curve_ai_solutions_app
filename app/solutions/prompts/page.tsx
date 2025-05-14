import type { Metadata } from "next"
import { PromptsHero } from "@/components/prompts-hero"
import { PromptLibrary } from "@/components/prompt-library"
import { PromptsCTA } from "@/components/prompts-cta"
import { PromptAnalysisMethodology } from "@/components/prompt-analysis-methodology"
import { AgentPromptsSection } from "@/components/agent-prompts-section"
import { TradingPromptsSection } from "@/components/trading-prompts-section"

export const metadata: Metadata = {
  title: "AI Prompt Library | Curve AI Solutions",
  description: "Browse our collection of effective AI prompts for various business use cases.",
}

export default function PromptsPage() {
  return (
    <div className="min-h-screen">
      <PromptsHero />
      <div className="container py-8">
        <h2 className="text-2xl font-bold mb-4">AI Prompt Analysis and Scoring Methodology</h2>
        <PromptAnalysisMethodology />
      </div>
      <AgentPromptsSection />
      <TradingPromptsSection />
      <PromptLibrary />
      <PromptsCTA />
    </div>
  )
}
