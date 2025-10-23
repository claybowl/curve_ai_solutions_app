"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AssessmentTestPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          setSession(data.session)
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const runTests = async () => {
    setTesting(true)
    const results: any = {}

    try {
      // Test 1: Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession()
      results.authentication = sessionData?.session ? "PASS" : "FAIL"

      // Test 2: Check if profiles table exists and is accessible
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', sessionData?.session?.user?.id)
          .single()
        
        results.profilesTable = profileError ? "FAIL" : "PASS"
        results.userProfile = profileData ? "PASS" : "FAIL"
      } catch (error) {
        results.profilesTable = "FAIL"
        results.userProfile = "FAIL"
      }

      // Test 3: Check if assessment tables exist
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('assessment_categories')
          .select('id')
          .limit(1)
        
        results.assessmentCategories = categoriesError ? "FAIL" : "PASS"
      } catch (error) {
        results.assessmentCategories = "FAIL"
      }

      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('assessment_questions')
          .select('id')
          .limit(1)
        
        results.assessmentQuestions = questionsError ? "FAIL" : "PASS"
      } catch (error) {
        results.assessmentQuestions = "FAIL"
      }

      try {
        const { data: assessmentsData, error: assessmentsError } = await supabase
          .from('assessments')
          .select('id')
          .limit(1)
        
        results.assessmentsTable = assessmentsError ? "FAIL" : "PASS"
      } catch (error) {
        results.assessmentsTable = "FAIL"
      }

      // Test 4: Check if user can create an assessment (without submitting)
      try {
        const { data: testAssessment, error: testError } = await supabase
          .from('assessments')
          .insert({
            user_id: sessionData?.session?.user?.id,
            title: 'Test Assessment',
            status: 'in_progress'
          })
          .select('id')
          .single()
        
        if (testAssessment && !testError) {
          results.assessmentCreation = "PASS"
          // Clean up test assessment
          await supabase.from('assessments').delete().eq('id', testAssessment.id)
        } else {
          results.assessmentCreation = "FAIL"
        }
      } catch (error) {
        results.assessmentCreation = "FAIL"
      }

    } catch (error) {
      console.error("Test error:", error)
      results.generalError = "FAIL"
    }

    setTestResults(results)
    setTesting(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to run the assessment tests.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Assessment System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="bg-[#0076FF] hover:bg-[#0076FF]/90"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run Assessment Tests"
              )}
            </Button>
            <span className="text-sm text-gray-500">
              User: {session.user.email}
            </span>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex items-center gap-2">
                  {result === "PASS" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="capitalize">{test.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className={`font-medium ${result === "PASS" ? "text-green-600" : "text-red-600"}`}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <h4 className="font-semibold mb-2">What these tests check:</h4>
            <ul className="text-sm space-y-1">
              <li>• Authentication status</li>
              <li>• Database table accessibility</li>
              <li>• User profile creation</li>
              <li>• Assessment table structure</li>
              <li>• Assessment creation permissions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
