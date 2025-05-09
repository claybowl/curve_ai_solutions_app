import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SkyBackground } from "@/components/sky-background"

export function SolutionsCTA() {
  return (
    <SkyBackground className="bg-[#1A365D] py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business with AI?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Start with our AI Readiness Assessment to discover which solutions are right for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
              <Link href="/assessments/new">Take the Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/consultation">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </SkyBackground>
  )
}
