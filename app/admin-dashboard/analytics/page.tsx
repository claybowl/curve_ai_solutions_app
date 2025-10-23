"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
// Chart components not available - using mock data visualization
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  FileText, 
  Calendar, 
  Wrench, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  RefreshCw, 
  BarChart3, 
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  UserPlus,
  FileUp
} from "lucide-react"
import {
  getDashboardStatsAction,
  getUserGrowthDataAction,
  getRecentActivityDataAction,
  getAssessmentCategoryBreakdownAction,
  getToolUsageDataAction
} from "@/app/actions/stats-actions"
import type {
  DashboardStats,
  UserGrowthData,
  ActivityData,
  CategoryBreakdown,
  ToolUsageData
} from "@/app/actions/stats-actions"

// Using imported types from stats-actions

export default function AnalyticsDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for all data
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([])
  const [toolUsageData, setToolUsageData] = useState<ToolUsageData[]>([])

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Load all data in parallel
      const [statsData, growthData, activityResults, categoryResults, toolUsageResults] = await Promise.all([
        getDashboardStatsAction(),
        getUserGrowthDataAction(),
        getRecentActivityDataAction(),
        getAssessmentCategoryBreakdownAction(),
        getToolUsageDataAction()
      ])
      
      // Set state with results
      if (statsData) setStats(statsData)
      if (growthData) setUserGrowthData(growthData)
      if (activityResults) setActivityData(activityResults)
      if (categoryResults) setCategoryData(categoryResults)
      if (toolUsageResults) setToolUsageData(toolUsageResults)
      
    } catch (err) {
      console.error("Error loading analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
      
      toast({
        title: "Error Loading Data",
        description: "There was a problem loading the analytics data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadAllData()
    toast({
      title: "Refreshing Data",
      description: "Analytics data is being updated...",
    })
  }

  // Prepare data for line chart (use total users)
  const prepareGrowthChartData = () => {
    return userGrowthData.map(point => ({
      date: point.date,
      count: point.totalUsers
    }))
  }

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      description="Platform performance metrics and usage statistics"
      breadcrumbs={[
        { label: "Admin", href: "/admin-dashboard" },
        { label: "Analytics", href: "/admin-dashboard/analytics", current: true }
      ]}
      actions={
        <Button onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      }
    >
      {isLoading && !stats ? (
        <div className="w-full py-12 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading analytics data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full py-12 flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full h-12 w-12 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Button variant="outline" onClick={refreshData}>
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.userCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assessments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.assessmentCount || 0}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {stats?.completedAssessments || 0} Completed
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    {stats?.pendingAssessments || 0} Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tools</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.toolCount || 0}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {stats?.activeToolCount || 0} Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.consultationCount || 0}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    {stats?.pendingConsultations || 0} Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}