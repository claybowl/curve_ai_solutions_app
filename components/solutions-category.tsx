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

  return (
    <section id={id} className="scroll-mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <IconComponent className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#1A365D]">{name}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.id} className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{tool.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href={`/solutions/${tool.id}`}>Learn More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
