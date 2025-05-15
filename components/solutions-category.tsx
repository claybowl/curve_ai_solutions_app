import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, BarChart, LineChart, Workflow, Code, Zap, Shield, Building } from "lucide-react"

interface Tool {
  id: number
  name: string
  description: string
  api_endpoint: string
}

interface SolutionsCategoryProps {
  id: string
  name: string
  description: string
  tools: Tool[]
  color: string
  icon: string
}

export function SolutionsCategory({ id, name, description, tools, color, icon }: SolutionsCategoryProps) {
  const IconComponent =
    {
      Bot: Bot,
      BarChart: BarChart,
      LineChart: LineChart,
      Workflow: Workflow,
      Code: Code,
      Zap: Zap,
      Shield: Shield,
      Building: Building,
    }[icon] || Bot

  // Get background color class for cards based on the category color
  const getBgClass = () => {
    const colorMap = {
      "bg-blue-500": "bg-blue-50 dark:bg-blue-950/30",
      "bg-purple-500": "bg-purple-50 dark:bg-purple-950/30",
      "bg-green-500": "bg-green-50 dark:bg-green-950/30",
      "bg-orange-500": "bg-orange-50 dark:bg-orange-950/30",
      "bg-teal-500": "bg-teal-50 dark:bg-teal-950/30",
      "bg-red-500": "bg-red-50 dark:bg-red-950/30",
      "bg-indigo-500": "bg-indigo-50 dark:bg-indigo-950/30",
      "bg-amber-500": "bg-amber-50 dark:bg-amber-950/30",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-50 dark:bg-gray-900/30";
  };

  // Get border color class for cards based on the category color
  const getBorderClass = () => {
    const colorMap = {
      "bg-blue-500": "border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700",
      "bg-purple-500": "border-purple-200 hover:border-purple-400 dark:border-purple-900 dark:hover:border-purple-700",
      "bg-green-500": "border-green-200 hover:border-green-400 dark:border-green-900 dark:hover:border-green-700",
      "bg-orange-500": "border-orange-200 hover:border-orange-400 dark:border-orange-900 dark:hover:border-orange-700",
      "bg-teal-500": "border-teal-200 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-700",
      "bg-red-500": "border-red-200 hover:border-red-400 dark:border-red-900 dark:hover:border-red-700",
      "bg-indigo-500": "border-indigo-200 hover:border-indigo-400 dark:border-indigo-900 dark:hover:border-indigo-700",
      "bg-amber-500": "border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-700",
    };
    return colorMap[color as keyof typeof colorMap] || "border-gray-200 hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-700";
  };

  return (
    <section id={id} className="scroll-mt-16">
      <div className={`rounded-xl p-6 mb-8 ${getBgClass()}`}>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className={`p-4 rounded-lg ${color} text-white self-start flex-shrink-0`}>
            <IconComponent className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-3">{name}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.length > 0 ? (
          tools.map((tool) => (
            <Card key={tool.id} className={`border-2 transition-all ${getBorderClass()}`}>
              <CardHeader>
                <CardTitle className="dark:text-blue-300">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
                  <Link href={`/solutions/${tool.id}`}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-8 border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No tools available in this category yet.</p>
            <Button asChild variant="outline">
              <Link href="/consultation">Request Early Access</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
