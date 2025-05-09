import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, Server, BarChart, Users, Shield, Workflow, LineChart, Zap } from "lucide-react"

const categories = [
  {
    name: "Data Readiness",
    description: "Evaluate your data collection, quality, governance, and accessibility.",
    icon: <Database className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Technical Infrastructure",
    description: "Assess your IT infrastructure, cloud services, and computing resources.",
    icon: <Server className="h-6 w-6" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Business Strategy",
    description: "Align AI initiatives with your business goals and metrics.",
    icon: <BarChart className="h-6 w-6" />,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Team Capabilities",
    description: "Evaluate your team's AI expertise and technical literacy.",
    icon: <Users className="h-6 w-6" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "Ethical Considerations",
    description: "Address fairness, privacy, transparency, and compliance.",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Implementation Planning",
    description: "Plan your AI use cases, testing approach, and change management.",
    icon: <Workflow className="h-6 w-6" />,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Trading Systems",
    description: "Evaluate your trading platforms and processes for AI enhancement.",
    icon: <LineChart className="h-6 w-6" />,
    color: "bg-orange-100 text-orange-700",
  },
  {
    name: "AI Integration",
    description: "Assess your readiness to integrate AI with existing workflows.",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-teal-100 text-teal-700",
  },
]

export function AssessmentCategories() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-4">AI Readiness Assessment</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive assessment evaluates your organization across 8 key dimensions to determine your readiness
            for AI implementation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.name} className="border-2 hover:border-[#0076FF]/50 transition-all">
              <CardHeader className={`${category.color} bg-opacity-20 rounded-t-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${category.color}`}>{category.icon}</div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-gray-600 mb-4">{category.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white px-8 py-6 text-lg">
            <Link href="/assessments/new">Start Your Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
