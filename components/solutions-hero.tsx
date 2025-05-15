import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SkyBackground } from "@/components/sky-background"

export function SolutionsHero() {
  return (
    <SkyBackground className="bg-gradient-to-r from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white py-28">
      <div className="container">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-6">Comprehensive AI Solutions Suite</h1>
          <p className="text-xl mb-8 text-gray-100 leading-relaxed">
            From autonomous AI agents and data visualization to algorithmic trading and industry-specific implementations,
            our solutions help businesses harness AI to reduce friction, automate workflows, and accelerate growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-[#1A365D] hover:bg-gray-100 dark:bg-white/90 dark:hover:bg-white">
              <Link href="/assessments/new">Start Your AI Readiness Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-white/80 dark:hover:bg-white/20">
              <Link href="#agent-development">Explore Our Solutions</Link>
            </Button>
          </div>
        </div>
      </div>
    </SkyBackground>
  )
}
