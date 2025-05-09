import { getRecommendedTools } from "@/app/actions/tool-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom-card"

interface RecommendedToolsProps {
  assessmentId: number
}

export async function RecommendedTools({ assessmentId }: RecommendedToolsProps) {
  const tools = await getRecommendedTools(assessmentId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1A365D]">Recommended Tools</h2>
      <p className="text-gray-600">
        Based on your assessment results, we recommend the following tools to help you implement AI in your business:
      </p>

      <div className="grid gap-6 md:grid-cols-3">
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

      <div className="text-center pt-6">
        <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
          <Link href="/solutions">View All Solutions</Link>
        </Button>
      </div>
    </div>
  )
}
