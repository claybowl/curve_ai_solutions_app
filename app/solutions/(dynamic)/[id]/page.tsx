import { getToolById } from "@/app/actions/tool-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ToolPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  try {
    const tool = await getToolById(params.id)
    
    if (!tool) {
      return {
        title: "Solution Not Found | Curve AI Solutions",
        description: "The requested AI solution could not be found."
      }
    }

    return {
      title: `${tool.name} | Curve AI Solutions`,
      description: tool.description || `${tool.name} - An advanced AI solution for your business needs.`
    }
  } catch (error) {
    return {
      title: "Solution | Curve AI Solutions",
      description: "AI solutions for your business needs."
    }
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  try {
    // Try to get the tool by ID
    const tool = await getToolById(params.id)

    // If no tool is found, show the 404 page
    if (!tool) {
      return notFound()
    }

    // Default values for properties that might be missing
    const toolName = tool.name || "AI Tool"
    const toolDescription = tool.description || "An advanced AI solution for your business needs."

    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-[#1A365D] to-[#0076FF] text-white py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">{toolName}</h1>
            <p className="text-xl max-w-2xl">{toolDescription}</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-4">Overview</h2>
                <p className="text-gray-600">
                  {toolName} is a powerful solution designed to help businesses streamline their AI implementation and
                  maximize the value of their data and processes. With its intuitive interface and powerful
                  capabilities, it enables organizations to quickly deploy AI solutions without extensive technical
                  expertise.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-4">Key Features</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0076FF] text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold">Intuitive Interface</h3>
                      <p className="text-gray-600">
                        Easy-to-use dashboard for managing all aspects of your AI implementation.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0076FF] text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold">Seamless Integration</h3>
                      <p className="text-gray-600">
                        Connects with your existing systems and data sources with minimal configuration.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0076FF] text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold">Advanced Analytics</h3>
                      <p className="text-gray-600">
                        Powerful reporting and visualization capabilities to track performance and ROI.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0076FF] text-white flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-bold">Scalable Architecture</h3>
                      <p className="text-gray-600">
                        Grows with your business needs from small deployments to enterprise-scale solutions.
                      </p>
                    </div>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-4">Use Cases</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {tool.use_cases && tool.use_cases.length > 0 ? (
                    tool.use_cases.map((useCase, index) => (
                      <div key={index} className="border p-6 rounded-lg">
                        <h3 className="font-bold mb-2 capitalize">{useCase}</h3>
                        <p className="text-gray-600">
                          Leverage {toolName} for {useCase} to optimize your business processes.
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border p-6 rounded-lg">
                        <h3 className="font-bold mb-2">Process Automation</h3>
                        <p className="text-gray-600">
                          Automate repetitive tasks and workflows to free up valuable employee time.
                        </p>
                      </div>
                      <div className="border p-6 rounded-lg">
                        <h3 className="font-bold mb-2">Data Analysis</h3>
                        <p className="text-gray-600">
                          Extract meaningful insights from your business data to drive better decisions.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Implementation Details */}
              <section>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-4">Implementation Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border p-6 rounded-lg">
                    <h3 className="font-bold mb-2">Complexity Level</h3>
                    <p className="text-gray-600 capitalize">
                      {tool.complexity_level || 'Intermediate'} - Suitable for businesses with {tool.complexity_level === 'beginner' ? 'basic' : tool.complexity_level === 'expert' ? 'advanced' : 'moderate'} technical requirements.
                    </p>
                  </div>
                  <div className="border p-6 rounded-lg">
                    <h3 className="font-bold mb-2">Implementation Time</h3>
                    <p className="text-gray-600">
                      {tool.configuration?.implementation_time || 'Contact for estimate'}
                    </p>
                  </div>
                  {tool.target_audience && tool.target_audience.length > 0 && (
                    <div className="border p-6 rounded-lg">
                      <h3 className="font-bold mb-2">Target Industries</h3>
                      <p className="text-gray-600 capitalize">
                        {tool.target_audience.join(', ')}
                      </p>
                    </div>
                  )}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="border p-6 rounded-lg">
                      <h3 className="font-bold mb-2">Technologies</h3>
                      <p className="text-gray-600">
                        {tool.tags.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-bold text-[#1A365D] mb-4">Interested in {toolName}?</h2>
                <p className="text-gray-600 mb-6">
                  Schedule a demo to see how {toolName} can transform your business operations.
                </p>
                <Button asChild className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white mb-4">
                  <Link href="/consultation">Schedule a Demo</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/assessments/new">Take the AI Readiness Assessment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in tool page:", error)
    return notFound()
  }
}
