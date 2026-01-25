import { redirect } from "next/navigation"
import { getCurrentUserServer } from "@/lib/supabase-server"
import {
  getDashboardOverview,
  getUserAssessmentData,
  getFeaturedTools,
  getRecentToolUsage,
  getFeaturedPrompts,
  getUserCollections,
  getActiveConsultations,
  getRecentActivity,
  getNotifications
} from "@/app/actions/dashboard-actions"
import { DashboardHero } from "@/components/dashboard/DashboardHero"
import { AssessmentOverview } from "@/components/dashboard/AssessmentOverview"
import { ToolsHub } from "@/components/dashboard/ToolsHub"
import { PromptLibraryAccess } from "@/components/dashboard/PromptLibraryAccess"
import { ConsultationCenter } from "@/components/dashboard/ConsultationCenter"
import { LearningInsights } from "@/components/dashboard/LearningInsights"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"

export default async function DashboardPage() {
  const user = await getCurrentUserServer()
  
  if (!user) {
    redirect("/login")
  }

  const [
    overviewResult,
    assessmentResult,
    toolsResult,
    recentToolsResult,
    promptsResult,
    collectionsResult,
    consultationsResult,
    activityResult,
    notificationsResult
  ] = await Promise.all([
    getDashboardOverview(),
    getUserAssessmentData(),
    getFeaturedTools(),
    getRecentToolUsage(),
    getFeaturedPrompts(),
    getUserCollections(),
    getActiveConsultations(),
    getRecentActivity(),
    getNotifications()
  ])

  const overview = overviewResult.success ? overviewResult.data! : {
    daysSinceSignup: 0,
    assessmentsCompleted: 0,
    toolsExplored: 0,
    subscriptionStatus: "free",
    firstName: null,
    lastName: null
  }

  const assessmentData = assessmentResult.success ? assessmentResult.data! : {
    latestAssessment: null,
    categoryScores: [],
    assessmentHistory: []
  }

  const featuredTools = toolsResult.success ? toolsResult.data! as any : []
  const recentTools = recentToolsResult.success ? recentToolsResult.data! : []
  const featuredPrompts = promptsResult.success ? promptsResult.data! as any : []
  const collections = collectionsResult.success ? collectionsResult.data! : []
  const consultations = consultationsResult.success ? consultationsResult.data! : []
  const activity = activityResult.success ? activityResult.data!.map(event => ({
    ...event,
    timestamp: event.createdAt,
    description: event.description || undefined
  })) as any : []
  const notifications = notificationsResult.success ? notificationsResult.data! : []

  const hasAssessments = assessmentData.latestAssessment !== null
  const overallScore = assessmentData.latestAssessment?.overallScore || 0
  const improvementAreas = assessmentData.categoryScores
    .filter(cat => cat.score < 60)
    .map(cat => cat.categoryName)

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="absolute inset-0 ambient-bg opacity-30 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHero
          firstName={overview.firstName}
          lastName={overview.lastName}
          daysSinceSignup={overview.daysSinceSignup}
          assessmentsCompleted={overview.assessmentsCompleted}
          toolsExplored={overview.toolsExplored}
          subscriptionStatus={overview.subscriptionStatus}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AssessmentOverview
              overallScore={overallScore}
              categoryScores={assessmentData.categoryScores}
              hasAssessments={hasAssessments}
              className="mb-8"
            />
            
            <ToolsHub
              featuredTools={featuredTools}
              recentUsage={recentTools}
            />
          </div>

          <div className="space-y-8">
            <ActivityFeed
              recentActivity={activity}
              notifications={notifications}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PromptLibraryAccess
            featuredPrompts={featuredPrompts}
            collections={collections}
          />
          
          <ConsultationCenter
            activeConsultations={consultations}
          />
        </div>

        <LearningInsights
          engagementScore={Math.min(
            (overview.assessmentsCompleted * 30) + 
            (overview.toolsExplored * 10) + 
            (consultations.length * 20),
            100
          )}
          improvementAreas={improvementAreas}
        />
      </div>
    </div>
  )
}
