import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AssessmentCTA() {
  return (
    <Card className="border-2 border-[#0076FF] shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#0076FF] to-[#1A365D] text-white">
        <CardTitle className="text-2xl">AI Readiness Assessment</CardTitle>
        <CardDescription className="text-gray-100">
          Discover how AI can transform your business operations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#1A365D] dark:text-white">Why take the assessment?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF7F00]">•</span>
                <span className="text-gray-700 dark:text-gray-200">
                  Identify AI opportunities specific to your business
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF7F00]">•</span>
                <span className="text-gray-700 dark:text-gray-200">Receive a personalized implementation roadmap</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF7F00]">•</span>
                <span className="text-gray-700 dark:text-gray-200">
                  Understand potential ROI and resource requirements
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF7F00]">•</span>
                <span className="text-gray-700 dark:text-gray-200">
                  Get expert recommendations tailored to your industry
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#1A365D] dark:text-white">What you'll receive:</h3>
              <p className="text-gray-700 dark:text-gray-200 mt-2">
                A comprehensive report with actionable insights and a clear path forward for AI integration in your
                business.
              </p>
            </div>
            <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white mt-4" href="/assessments">
              Start Your Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
