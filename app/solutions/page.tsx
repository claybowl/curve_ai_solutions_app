import { getToolsByCategory } from "@/app/actions/tool-actions"
import { SolutionsHero } from "@/components/solutions-hero"
import { SolutionsCategory } from "@/components/solutions-category"
import { SolutionsCTA } from "@/components/solutions-cta"

export const metadata = {
  title: "Solutions | Curve AI Solutions",
  description: "Explore our comprehensive suite of AI agent infrastructure solutions for businesses.",
}

export default async function SolutionsPage() {
  const toolsByCategory = await getToolsByCategory()

  return (
    <div className="min-h-screen">
      <SolutionsHero />

      <div className="container py-12">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-3xl font-bold text-center text-[#1A365D] dark:text-blue-300">Our Solutions</h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Curve AI Solutions offers a comprehensive suite of tools and platforms to help businesses build, deploy, and
            manage custom AI agent infrastructure.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-4 pb-2 min-w-max">
            {toolsByCategory.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:text-gray-200"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-24">
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
