"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { submitAssessment } from "@/app/actions/assessment-actions"

interface AssessmentFormProps {
  questions: {
    id: string | number
    question_text: string
    category?: string
    weight: number
    question_type?: string
    options?: string[]
  }[]
  userId: string
}

export function AssessmentForm({ questions, userId }: AssessmentFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<{ [key: number]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  const totalQuestions = questions.length

  const handleChange = (questionId: number, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }))

    // Calculate progress based on non-empty answers
    const updatedFormData = { ...formData, [questionId]: value }
    const answeredQuestions = Object.values(updatedFormData).filter((val) => val && val.trim() !== "").length
    setProgress(Math.round((answeredQuestions / totalQuestions) * 100))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const data = new FormData(form)

    try {
      await submitAssessment(data)
      // The server action will handle redirect
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("There was an error submitting your assessment. Please try again.")
      setIsSubmitting(false)
    }
  }

  const getQuestionType = (question: any, index: number) => {
    // In a real implementation, you would determine the question type based on the question data
    // For this demo, we'll assign different types based on the index
    const types = ["text", "multiple-choice", "rating", "checkbox", "dropdown"]

    // If the question category contains certain keywords, assign specific types
    if (question.category.toLowerCase().includes("data")) {
      return "checkbox"
    } else if (question.category.toLowerCase().includes("technical")) {
      return "rating"
    } else if (question.category.toLowerCase().includes("business")) {
      return "multiple-choice"
    } else if (question.category.toLowerCase().includes("team")) {
      return "dropdown"
    }

    // Default to text for any other categories, or cycle through types based on index
    return types[index % types.length]
  }

  return (
    <Card className="border-2 border-[#0076FF] dark:border-[#0076FF]/70">
      <CardHeader className="bg-gradient-to-r from-[#0076FF] to-[#1A365D] text-white">
        <CardTitle className="text-2xl">AI Readiness Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="title" value="AI Readiness Assessment" />

          {questions.map((question, index) => {
            // Determine question type based on question content or category
            // For demo purposes, we'll assign different types based on index
            const questionType = getQuestionType(question, index)

            return (
              <div key={question.id} className="mb-8 p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                <div className="mb-3">
                  {question.category && (
                    <span className="inline-block bg-[#0076FF]/10 dark:bg-[#0076FF]/20 text-[#0076FF] dark:text-[#3B9DFF] text-xs font-medium px-2 py-1 rounded-full mb-2">
                      {question.category}
                    </span>
                  )}
                  <Label htmlFor={`question_${question.id}`} className="text-lg font-medium block mb-2">
                    {index + 1}. {question.question_text}
                  </Label>
                </div>

                {questionType === "text" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                      Please provide a detailed response. Your insights here will significantly impact your assessment
                      results.
                    </p>
                    <Textarea
                      id={`question_${question.id}`}
                      name={`question_${question.id}`}
                      placeholder="Enter your detailed response..."
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="min-h-[150px] border-gray-200 dark:border-gray-700 focus:border-[#0076FF] focus:ring-1 focus:ring-[#0076FF]"
                    />
                  </div>
                )}

                {questionType === "multiple-choice" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                      Select the option that best describes your situation:
                    </p>
                    {[
                      "Not implemented",
                      "Planning phase",
                      "Partially implemented",
                      "Fully implemented",
                      "Advanced implementation",
                    ].map((option, i) => (
                      <div key={i} className="flex items-center">
                        <input
                          type="radio"
                          id={`question_${question.id}_option_${i}`}
                          name={`question_${question.id}`}
                          value={option}
                          onChange={(e) => handleChange(question.id, e.target.value)}
                          className="h-4 w-4 text-[#0076FF] focus:ring-[#0076FF]"
                        />
                        <label htmlFor={`question_${question.id}_option_${i}`} className="ml-2 text-gray-700 dark:text-gray-300">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {questionType === "rating" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                      Rate your organization's capability in this area:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <label
                          key={rating}
                          className="rating-label"
                          htmlFor={`question_${question.id}_rating_${rating}`}
                        >
                          <input
                            type="radio"
                            id={`question_${question.id}_rating_${rating}`}
                            name={`question_${question.id}`}
                            value={rating}
                            onChange={(e) => handleChange(question.id, e.target.value)}
                            className="sr-only"
                          />
                          <span className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#0076FF] hover:bg-[#0076FF]/5 dark:hover:bg-[#0076FF]/20 cursor-pointer transition-colors text-gray-700 dark:text-gray-300">
                            {rating}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {questionType === "checkbox" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">Select all that apply to your organization:</p>
                    {[
                      "Data collection processes",
                      "Data quality measures",
                      "Data governance policies",
                      "Data accessibility tools",
                      "Data security protocols",
                    ].map((option, i) => (
                      <div key={i} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`question_${question.id}_checkbox_${i}`}
                          name={`question_${question.id}_checkbox_${i}`}
                          value={option}
                          onChange={(e) => {
                            const checkboxes = document.querySelectorAll(
                              `input[name^="question_${question.id}_checkbox_"]`,
                            )
                            const selectedOptions = Array.from(checkboxes)
                              .filter((cb) => (cb as HTMLInputElement).checked)
                              .map((cb) => (cb as HTMLInputElement).value)
                            handleChange(question.id, selectedOptions.join(", "))
                          }}
                          className="h-4 w-4 text-[#0076FF] focus:ring-[#0076FF] rounded"
                        />
                        <label htmlFor={`question_${question.id}_checkbox_${i}`} className="ml-2 text-gray-700 dark:text-gray-300">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {questionType === "dropdown" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">Select the most appropriate option:</p>
                    <select
                      id={`question_${question.id}`}
                      name={`question_${question.id}`}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 pl-3 pr-10 text-gray-700 dark:text-gray-300 focus:border-[#0076FF] focus:outline-none focus:ring-1 focus:ring-[#0076FF]"
                    >
                      <option value="">Select an option</option>
                      <option value="Not started">Not started</option>
                      <option value="Early stages">Early stages</option>
                      <option value="In progress">In progress</option>
                      <option value="Advanced stages">Advanced stages</option>
                      <option value="Fully implemented">Fully implemented</option>
                    </select>
                  </div>
                )}
              </div>
            )
          })}

          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your assessment completion: {progress}%</p>
            <Progress value={progress} className="h-2 bg-gray-100 dark:bg-gray-700" />
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || progress < 50}
              className="bg-[#0076FF] hover:bg-[#0064D6] text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          </div>

          {progress < 50 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 text-center">
              Please complete at least 50% of the assessment before submitting.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
