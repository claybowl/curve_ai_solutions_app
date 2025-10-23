"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Removed DashboardLayout from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { 
  Users, TrendingUp, Clock, MousePointer, 
  Eye, BarChart3, RefreshCw, Calendar,
  FileText, MessageSquare, Zap, Target,
  ArrowUp, ArrowDown, Minus, Activity
} from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

// Types for engagement analytics
interface EngagementMetrics {
  id: string
  date: string
  total_sessions: number
  unique_users: number
  avg_session_duration: number
  bounce_rate: number
  page_views: number
  assessments_started: number
  assessments_completed: number
  consultations_requested: number
  tools_used: number
  prompt_views: number
}

interface UserBehavior {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  total_sessions: number
  total_duration: number
  last_activity: string
  assessments_completed: number
  consultations_requested: number
  tools_used: number
  engagement_score: number
}

interface PopularContent {
  id: string
  type: 'page' | 'tool' | 'prompt' | 'assessment'
  title: string
  views: number
  unique_visitors: number
  avg_time_spent: number
  conversion_rate?: number
}

interface EngagementTrend {
  date: string
  sessions: number
  users: number
  duration: number
  bounce_rate: number
}

export default function EngagementAnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("7")
  const [activeTab, setActiveTab] = useState("overview")
  
  // Analytics data state
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics[]>([])
  const [userBehaviors, setUserBehaviors] = useState<UserBehavior[]>([])
  const [popularContent, setPopularContent] = useState<PopularContent[]>([])
  const [engagementTrends, setEngagementTrends] = useState<EngagementTrend[]>([])

  useEffect(() => {
    loadEngagementData()
  }, [dateRange])

  const loadEngagementData = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, these would fetch from analytics API or database
      // For now, we'll use mock data
      
      const days = parseInt(dateRange)
      const mockMetrics: EngagementMetrics[] = []
      const mockTrends: EngagementTrend[] = []
      
      // Generate mock data for the selected date range
      for (let i = days - 1; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
        
        mockMetrics.push({
          id: `metric-${i}`,
          date,
          total_sessions: Math.floor(Math.random() * 200) + 50,
          unique_users: Math.floor(Math.random() * 150) + 30,
          avg_session_duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
          bounce_rate: Math.random() * 0.4 + 0.2, // 20-60%
          page_views: Math.floor(Math.random() * 500) + 100,
          assessments_started: Math.floor(Math.random() * 20) + 5,
          assessments_completed: Math.floor(Math.random() * 15) + 2,
          consultations_requested: Math.floor(Math.random() * 10) + 1,
          tools_used: Math.floor(Math.random() * 30) + 5,
          prompt_views: Math.floor(Math.random() * 50) + 10
        })
        
        mockTrends.push({
          date,
          sessions: Math.floor(Math.random() * 200) + 50,
          users: Math.floor(Math.random() * 150) + 30,
          duration: Math.floor(Math.random() * 600) + 120,
          bounce_rate: Math.random() * 0.4 + 0.2
        })
      }
      
      // Mock user behavior data
      const mockUserBehaviors: UserBehavior[] = [
        {
          user_id: "1",
          email: "john.doe@example.com",
          first_name: "John",
          last_name: "Doe",
          total_sessions: 15,
          total_duration: 7200, // 2 hours
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          assessments_completed: 3,
          consultations_requested: 1,
          tools_used: 8,
          engagement_score: 85
        },
        {
          user_id: "2",
          email: "jane.smith@example.com",
          first_name: "Jane",
          last_name: "Smith",
          total_sessions: 22,
          total_duration: 10800, // 3 hours
          last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          assessments_completed: 5,
          consultations_requested: 2,
          tools_used: 12,
          engagement_score: 92
        },
        {
          user_id: "3",
          email: "bob.wilson@example.com",
          first_name: "Bob",
          last_name: "Wilson",
          total_sessions: 8,
          total_duration: 3600, // 1 hour
          last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          assessments_completed: 1,
          consultations_requested: 0,
          tools_used: 4,
          engagement_score: 58
        }
      ]
      
      // Mock popular content data
      const mockPopularContent: PopularContent[] = [
        {
          id: "1",
          type: "page",
          title: "AI Solutions Overview",
          views: 1250,
          unique_visitors: 890,
          avg_time_spent: 240,
          conversion_rate: 0.12
        },
        {
          id: "2",
          type: "tool",
          title: "Business Process Analyzer",
          views: 875,
          unique_visitors: 620,
          avg_time_spent: 320,
          conversion_rate: 0.28
        },
        {
          id: "3",
          type: "assessment",
          title: "AI Readiness Assessment",
          views: 650,
          unique_visitors: 450,
          avg_time_spent: 480,
          conversion_rate: 0.35
        },
        {
          id: "4",
          type: "prompt",
          title: "Customer Service Automation Prompts",
          views: 420,
          unique_visitors: 310,
          avg_time_spent: 180,
        }
      ]
      
      setEngagementMetrics(mockMetrics)
      setEngagementTrends(mockTrends)
      setUserBehaviors(mockUserBehaviors)
      setPopularContent(mockPopularContent)
      
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
      
    } catch (err) {
      console.error("Error loading engagement data:", err)
      toast({
        title: "Error Loading Data",
        description: "There was a problem loading the engagement analytics.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadEngagementData()
    toast({
      title: "Refreshing Data",
      description: "Engagement analytics are being updated...",
    })
  }

  // Calculate aggregate metrics
  const totalSessions = engagementMetrics.reduce((sum, m) => sum + m.total_sessions, 0)
  const totalUsers = engagementMetrics.reduce((sum, m) => sum + m.unique_users, 0)
  const avgSessionDuration = engagementMetrics.length > 0 
    ? engagementMetrics.reduce((sum, m) => sum + m.avg_session_duration, 0) / engagementMetrics.length 
    : 0
  const avgBounceRate = engagementMetrics.length > 0 
    ? engagementMetrics.reduce((sum, m) => sum + m.bounce_rate, 0) / engagementMetrics.length 
    : 0

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getEngagementScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "page": return <FileText className="h-4 w-4" />
      case "tool": return <Zap className="h-4 w-4" />
      case "assessment": return <Target className="h-4 w-4" />
      case "prompt": return <MessageSquare className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  return (
    <main className="p-6"
      title="Engagement Analytics"
      description="Detailed user engagement metrics and behavior analysis"
      breadcrumbs={[
        { label: "Admin", href: "/admin-dashboard" },
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Engagement", href: "/admin/analytics/engagement", current: true }
      ]}
      actions={
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="w-full py-12 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading engagement analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12.5% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+8.3% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(Math.round(avgSessionDuration))}</div>
                <div className="flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">-2.1% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(avgBounceRate * 100).toFixed(1)}%</div>
                <div className="flex items-center mt-1">
                  <Minus className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">No change from previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Behavior</TabsTrigger>
              <TabsTrigger value="content">Popular Content</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Daily Engagement Summary
                    </CardTitle>
                    <CardDescription>
                      Key engagement metrics over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {engagementMetrics.slice(-7).map((metric, index) => (
                        <div key={metric.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">
                              {format(new Date(metric.date), 'MMM d')}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{metric.total_sessions}</div>
                              <div className="text-xs text-muted-foreground">Sessions</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{metric.unique_users}</div>
                              <div className="text-xs text-muted-foreground">Users</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{(metric.bounce_rate * 100).toFixed(0)}%</div>
                              <div className="text-xs text-muted-foreground">Bounce</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Action Metrics
                    </CardTitle>
                    <CardDescription>
                      User actions and conversions summary
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Assessments Started</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {engagementMetrics.reduce((sum, m) => sum + m.assessments_started, 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Assessments Completed</span>
                        <span className="text-2xl font-bold text-green-600">
                          {engagementMetrics.reduce((sum, m) => sum + m.assessments_completed, 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Consultations Requested</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {engagementMetrics.reduce((sum, m) => sum + m.consultations_requested, 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tools Used</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {engagementMetrics.reduce((sum, m) => sum + m.tools_used, 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User Behavior Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Engaged Users
                  </CardTitle>
                  <CardDescription>
                    Users with highest engagement scores and activity levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Sessions</TableHead>
                          <TableHead>Total Time</TableHead>
                          <TableHead>Actions</TableHead>
                          <TableHead>Engagement Score</TableHead>
                          <TableHead>Last Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userBehaviors.map((user) => (
                          <TableRow key={user.user_id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.total_sessions}</TableCell>
                            <TableCell>{formatDuration(user.total_duration)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {user.assessments_completed} assessments
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {user.consultations_requested} consultations
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {user.tools_used} tools
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`font-medium ${getEngagementScoreColor(user.engagement_score)}`}>
                                {user.engagement_score}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(user.last_activity), 'MMM d, HH:mm')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Popular Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Most Viewed Content
                  </CardTitle>
                  <CardDescription>
                    Content with highest views and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Content</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Unique Visitors</TableHead>
                          <TableHead>Avg Time</TableHead>
                          <TableHead>Conversion Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {popularContent.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell>
                              <div className="font-medium">{content.title}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getContentTypeIcon(content.type)}
                                <span className="capitalize">{content.type}</span>
                              </div>
                            </TableCell>
                            <TableCell>{content.views.toLocaleString()}</TableCell>
                            <TableCell>{content.unique_visitors.toLocaleString()}</TableCell>
                            <TableCell>{formatDuration(content.avg_time_spent)}</TableCell>
                            <TableCell>
                              {content.conversion_rate ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  {(content.conversion_rate * 100).toFixed(1)}%
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Engagement Trends
                  </CardTitle>
                  <CardDescription>
                    Daily engagement trends over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Simple trend visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Session Trends</h4>
                        <div className="space-y-2">
                          {engagementTrends.slice(-7).map((trend, index) => (
                            <div key={trend.date} className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(trend.date), 'MMM d')}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(trend.sessions / 200) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {trend.sessions}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">User Trends</h4>
                        <div className="space-y-2">
                          {engagementTrends.slice(-7).map((trend, index) => (
                            <div key={trend.date} className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(trend.date), 'MMM d')}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${(trend.users / 150) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                  {trend.users}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}