import { SkyBackground } from "@/components/sky-background"

export function PromptsHero() {
  return (
    <SkyBackground className="bg-gradient-to-r from-[#1A365D] to-[#0076FF] text-white py-16">
      <div className="container">
        <h1 className="text-4xl font-bold mb-4">AI Prompt Library</h1>
        <p className="text-xl max-w-2xl">
          A curated collection of effective prompts that have delivered real results for our clients. Browse, search,
          and adapt these prompts for your specific business needs.
        </p>
      </div>
    </SkyBackground>
  )
}
