import { getToolsByCategory } from "@/app/actions/tool-actions"
import { SolutionsHero } from "@/components/solutions-hero"
import { SolutionsCategory } from "@/components/solutions-category"
import { SolutionsCTA } from "@/components/solutions-cta"
import { Bot, BarChart, LineChart, Workflow, Code, Zap, Shield, Building } from "lucide-react"

export const metadata = {
  title: "Curve AI Solutions Breakdown | Curve AI",
  description: "Explore our comprehensive suite of AI agent infrastructure solutions - from agent development to industry-specific implementations.",
}

export default async function SolutionsPage() {
  const toolsByCategory = await getToolsByCategory()
  
  // Icon components for navigation
  const iconMap = {
    "Bot": Bot,
    "BarChart": BarChart,
    "LineChart": LineChart,
    "Workflow": Workflow,
    "Code": Code,
    "Zap": Zap,
    "Shield": Shield,
    "Building": Building,
  };

  return (
    <div className="min-h-screen">
      <SolutionsHero />

      <div className="container py-16">
        <div className="flex flex-col gap-6 mb-16">
          <h2 className="text-4xl font-bold text-center text-[#1A365D] dark:text-blue-300">Curve AI Solutions Breakdown</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our comprehensive suite of AI solutions is designed to transform how businesses operate. 
            From autonomous agents and data visualization to specialized industry applications, 
            we provide the tools you need to harness the power of AI effectively.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-16 overflow-x-auto">
          <div className="flex flex-wrap justify-center gap-3 pb-2">
            {toolsByCategory.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Bot;
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className={`px-4 py-2 rounded-full transition-colors hover:saturate-150 text-white flex items-center gap-2 ${category.color}`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="hidden md:inline">{category.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-32">
          {toolsByCategory.map((category) => (
            <SolutionsCategory
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              tools={category.tools}
              color={category.color}
              icon={category.icon}
            />
          ))}
        </div>
      </div>

      <SolutionsCTA />
    </div>
  )
}
