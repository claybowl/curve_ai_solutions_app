import { getAssessmentQuestions } from "@/app/actions/assessment-actions"
import { AssessmentForm } from "@/components/assessment-form"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { redirect } from "next/navigation"

// This page uses cookies/auth, so it cannot be statically generated
export const dynamic = 'force-dynamic'

export default async function NewAssessmentPage() {
  // Get the current user
  const user = await getCurrentSupabaseUser()

  if (!user) {
    redirect('/login')
  }

  // Get assessment questions from the database
  const questions = await getAssessmentQuestions()
  const userId = user.id

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Readiness Assessment</h1>
        <p className="text-muted-foreground">
          Complete this assessment to evaluate your organization's readiness for AI implementation. Your responses will
          help us provide tailored recommendations for your business.
        </p>
      </div>

      {questions.length === 0 && (
        <div className="bg-amber-100 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                No assessment questions are available at this time. Please contact an administrator to set up assessment questions.
              </p>
            </div>
          </div>
        </div>
      )}

      {questions.length > 0 && <AssessmentForm questions={questions} userId={userId} />}
    </div>
  )
}
