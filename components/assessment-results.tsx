"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateAssessmentReport } from "@/app/actions/assessment-actions"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileText, Download, CheckCircle } from "lucide-react"

interface AssessmentResultsProps {
  assessment: {
    id: number
    score: number
    status: string
    report_url: string | null
    created_at: string
    first_name: string
    last_name: string
    company_name: string
    responses: {
      id: number
      question_id: number
      response: string
      score: number
      question_text: string
      category: string
    }[]
  }
}

export function AssessmentResults({ assessment }: AssessmentResultsProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportUrl, setReportUrl] = useState(assessment.report_url)

  // Group responses by category for charting
  const categoryScores: Record<string, { category: string; score: number; maxScore: number }> = {}

  assessment.responses.forEach((response) => {
    if (!categoryScores[response.category]) {
      categoryScores[response.category] = {
        category: response.category,
        score: 0,
        maxScore: 0,
      }
    }
    categoryScores[response.category].score += response.score
    categoryScores[response.category].maxScore += 10 // Assuming max score per question is 10
  })

  const chartData = Object.values(categoryScores).map((item) => ({
    ...item,
    percentage: Math.round((item.score / item.maxScore) * 100),
  }))

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      const url = await generateAssessmentReport(assessment.id)
      setReportUrl(url)
      toast({
        title: "Report Generated",
        description: "Your assessment report has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-[#0076FF]">
        <CardHeader className="bg-gradient-to-r from-[#0076FF] to-[#1A365D] text-white">
          <CardTitle className="text-2xl">Assessment Results</CardTitle>
          <CardDescription className="text-gray-100">
            {assessment.first_name} {assessment.last_name} - {assessment.company_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-[#1A365D] mb-4">Overall Score</h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-[#0076FF] text-white flex items-center justify-center text-3xl font-bold">
                  {Math.round((assessment.score / (assessment.responses.length * 10)) * 100)}%
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assessment Status</p>
                  <p className="font-medium flex items-center gap-1">
                    {assessment.status === "reviewed" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Reviewed
                      </>
                    ) : (
                      assessment.status
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A365D] mb-4">Report</h3>
              {reportUrl ? (
                <Button
                  className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white"
                  onClick={() => window.open(reportUrl, "_blank")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              ) : (
                <Button
                  className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#1A365D] mb-4">Category Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Bar dataKey="percentage" fill="#0076FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[#1A365D]">Detailed Responses</h3>

        {Object.entries(
          assessment.responses.reduce(
            (acc, response) => {
              if (!acc[response.category]) {
                acc[response.category] = []
              }
              acc[response.category].push(response)
              return acc
            },
            {} as Record<string, typeof assessment.responses>,
          ),
        ).map(([category, responses]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="border-b pb-4 last:border-0">
                  <p className="font-medium text-[#1A365D]">{response.question_text}</p>
                  <p className="mt-2 text-gray-700">{response.response}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Score: {response.score}/10</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
