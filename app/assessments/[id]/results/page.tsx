import { getAssessmentById } from "@/app/actions/assessment-actions"
import { AssessmentResults } from "@/components/assessment-results"
import { RecommendedTools } from "@/components/recommended-tools"
import { notFound } from "next/navigation"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function AssessmentResultsPage({ params }: ResultsPageProps) {
  const assessmentId = Number.parseInt(params.id)
  const assessment = await getAssessmentById(assessmentId)

  if (!assessment) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-[#1A365D] mb-6">Assessment Results</h1>
      <AssessmentResults assessment={assessment} />

      <div className="mt-16">
        <RecommendedTools assessmentId={assessmentId} />
      </div>
    </div>
  )
}
