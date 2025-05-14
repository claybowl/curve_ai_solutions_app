import { AssessmentCategories } from "@/components/assessment-categories"
import { SkyBackground } from "@/components/sky-background"

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen">
      <SkyBackground className="bg-gradient-to-r from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">AI Readiness Assessment</h1>
          <p className="text-xl max-w-2xl">
            Evaluate your organization's readiness to implement AI solutions and receive tailored recommendations for
            your business.
          </p>
        </div>
      </SkyBackground>

      <AssessmentCategories />

      <div className="container py-16 bg-white dark:bg-gray-950">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Complete the Assessment</h3>
                  <p className="text-gray-600 dark:text-gray-300">Answer questions across 8 key dimensions of AI readiness.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Receive Your Score</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get an immediate evaluation of your organization's AI readiness.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Review Detailed Report</h3>
                  <p className="text-gray-600 dark:text-gray-300">Access a comprehensive report with tailored recommendations.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Implement Solutions</h3>
                  <p className="text-gray-600 dark:text-gray-300">Work with our team to implement the recommended AI solutions.</p>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Benefits</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 text-[#0076FF] dark:text-blue-400 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Identify Opportunities</h3>
                  <p className="text-gray-600 dark:text-gray-300">Discover where AI can create the most value for your business.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 text-[#0076FF] dark:text-blue-400 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Uncover Gaps</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Identify areas where your organization needs to improve before implementing AI.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 text-[#0076FF] dark:text-blue-400 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Prioritize Initiatives</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get clear guidance on which AI initiatives to pursue first.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 text-[#0076FF] dark:text-blue-400 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Reduce Risk</h3>
                  <p className="text-gray-600 dark:text-gray-300">Minimize the risk of failed AI implementations with proper planning.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
