import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SkyBackground } from "@/components/sky-background"

export function SolutionsCTA() {
  return (
    <SkyBackground className="bg-[#1A365D] dark:bg-[#0D1F36] py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Implement AI in Your Business?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Start with our AI Readiness Assessment to discover which of our solutions best fit your business needs, 
            or schedule a consultation to discuss a tailored approach for your specific challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
              <Link href="/assessments/new">Take the AI Readiness Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-white/80 dark:hover:bg-white/20">
              <Link href="/consultation">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </SkyBackground>
  )
}
