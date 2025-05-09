import { getToolsByCategory } from "@/app/actions/tool-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, BarChart, LineChart, Workflow, Code, Zap, Shield, Building } from "lucide-react"

export async function SolutionsShowcase() {
  const toolsByCategory = await getToolsByCategory()

  // Get the first 4 categories for the showcase
  const showcaseCategories = toolsByCategory.slice(0, 4)

  const IconComponent = {
    Bot: Bot,
    BarChart: BarChart,
    LineChart: LineChart,
    Workflow: Workflow,
    Code: Code,
    Zap: Zap,
    Shield: Shield,
    Building: Building,
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-4">Our Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive suite of AI agent infrastructure solutions to help businesses automate workflows,
            reduce friction, and accelerate growth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {showcaseCategories.map((category) => {
            const Icon = IconComponent[category.icon as keyof typeof IconComponent] || Bot

            return (
              <div
                key={category.id}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${category.color} text-white flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link href={`/solutions#${category.id}`} className="text-[#0076FF] hover:underline font-medium">
                  Learn more →
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
            <Link href="/solutions">View All Solutions</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
