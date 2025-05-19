"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  ChartContainer, 
  LineChart, 
  BarChart, 
  PieChart,
  AreaChart
} from "@/components/ui/chart"
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

// Type definitions
interface DashboardStats {
  userCount: number;
  assessmentCount: number;
  pendingAssessments: number;
  completedAssessments: number;
  toolCount: number;
  activeToolCount: number;
  roleCount: number;
  blogPostCount: number;
  promptCount: number;
  consultationCount: number;
  pendingConsultations: number;
}

interface UserGrowthDataPoint {
  date: string;
  count: number;
}

interface ActivityDataPoint {
  category: string;
  count: number;
}

interface CategoryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

interface ToolUsage {
  name: string;
  count: number;
}

export default function AnalyticsDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for all data
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([])
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([])
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([])
  const [toolUsageData, setToolUsageData] = useState<ToolUsage[]>([])

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

  // Prepare data for line chart (accumulate growth)
  const prepareGrowthChartData = () => {
    let cumulativeCount = 0
    return userGrowthData.map(point => {
      cumulativeCount += point.count
      return {
        date: point.date,
        count: cumulativeCount
      }
    })
  }

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      description="Platform performance metrics and usage statistics"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Analytics", href: "/admin/analytics", current: true }
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
          
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="w-full sm:w-auto flex-wrap justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="growth">User Growth</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="details">Detailed Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* User Growth Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
                      User Growth
                    </CardTitle>
                    <CardDescription>
                      New user registrations over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer>
                        <LineChart 
                          data={prepareGrowthChartData()}
                          categories={["count"]} 
                          index="date"
                          colors={["primary"]}
                          valueFormatter={(value) => `${value} users`}
                          showLegend={false}
                          showGridLines={false}
                          startEndOnly={true}
                        />
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Assessment Categories Pie Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Assessment Categories
                    </CardTitle>
                    <CardDescription>
                      Breakdown of assessments by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer>
                        <PieChart 
                          data={categoryData.map(item => ({
                            name: item.name,
                            value: item.count
                          }))}
                          category="value"
                          index="name"
                          valueFormatter={(value) => `${value} assessments`}
                          colors={["primary", "indigo", "cyan", "amber", "rose"]}
                        />
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Activity Bar Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Recent Activity (7 Days)
                    </CardTitle>
                    <CardDescription>
                      Activity breakdown by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer>
                        <BarChart 
                          data={activityData}
                          categories={["count"]}
                          index="category"
                          colors={["primary"]}
                          valueFormatter={(value) => `${value} items`}
                          showLegend={false}
                        />
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tool Usage Bar Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2 text-primary" />
                      Top Tools by Usage
                    </CardTitle>
                    <CardDescription>
                      Most frequently used AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer>
                        <BarChart 
                          data={toolUsageData.slice(0, 5)}
                          categories={["count"]}
                          index="name"
                          colors={["primary"]}
                          layout="horizontal"
                          valueFormatter={(value) => `${value} uses`}
                          showLegend={false}
                        />
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="growth" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2 text-primary" />
                    User Growth Trend
                  </CardTitle>
                  <CardDescription>
                    Cumulative user registrations over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer>
                      <AreaChart 
                        data={prepareGrowthChartData()}
                        categories={["count"]} 
                        index="date"
                        colors={["primary"]}
                        valueFormatter={(value) => `${value} users`}
                        showLegend={false}
                        showGridLines={true}
                      />
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Registration Data</CardTitle>
                    <CardDescription>
                      Detailed view of user registration by day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>New Users</TableHead>
                          <TableHead>Cumulative Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prepareGrowthChartData().map((point, i) => (
                          <TableRow key={point.date}>
                            <TableCell>{new Date(point.date).toLocaleDateString()}</TableCell>
                            <TableCell>{userGrowthData[i]?.count || 0}</TableCell>
                            <TableCell>{point.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileUp className="h-5 w-5 mr-2 text-primary" />
                      Activity Summary
                    </CardTitle>
                    <CardDescription>
                      Activity distribution across the platform in the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ChartContainer>
                        <BarChart 
                          data={activityData}
                          categories={["count"]}
                          index="category"
                          colors={["primary"]}
                          valueFormatter={(value) => `${value} items`}
                          showLegend={false}
                        />
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Detailed Activity Breakdown</CardTitle>
                    <CardDescription>
                      Numerical breakdown of recent platform activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity Type</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                      <TableBody>
                        {activityData.map(item => {
                          const total = activityData.reduce((sum, i) => sum + i.count, 0);
                          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                          
                          return (
                            <TableRow key={item.category}>
                              <TableCell className="font-medium">{item.category}</TableCell>
                              <TableCell>{item.count}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">{percentage}%</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                      Assessment Categories
                    </CardTitle>
                    <CardDescription>
                      Distribution of assessments by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="h-[300px] w-full flex items-center justify-center">
                        <ChartContainer>
                          <PieChart 
                            data={categoryData.map(item => ({
                              name: item.name,
                              value: item.count
                            }))}
                            category="value"
                            index="name"
                            valueFormatter={(value) => `${value} assessments`}
                            colors={["primary", "indigo", "cyan", "amber", "rose"]}
                          />
                        </ChartContainer>
                      </div>
                      
                      <div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Count</TableHead>
                              <TableHead className="text-right">Percentage</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoryData.map(item => (
                              <TableRow key={item.name}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.count}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="outline">{item.percentage}%</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Platform Statistics</CardTitle>
                  <CardDescription>
                    Comprehensive view of all platform metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Users</TableCell>
                        <TableCell>{stats?.userCount || 0}</TableCell>
                        <TableCell>Registered user accounts</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Assessments</TableCell>
                        <TableCell>{stats?.assessmentCount || 0}</TableCell>
                        <TableCell>All submitted AI assessments</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Completed Assessments</TableCell>
                        <TableCell>{stats?.completedAssessments || 0}</TableCell>
                        <TableCell>Assessments with completed status</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pending Assessments</TableCell>
                        <TableCell>{stats?.pendingAssessments || 0}</TableCell>
                        <TableCell>Assessments awaiting review</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Tools</TableCell>
                        <TableCell>{stats?.toolCount || 0}</TableCell>
                        <TableCell>All AI tools in the system</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Active Tools</TableCell>
                        <TableCell>{stats?.activeToolCount || 0}</TableCell>
                        <TableCell>Currently active and available tools</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Blog Posts</TableCell>
                        <TableCell>{stats?.blogPostCount || 0}</TableCell>
                        <TableCell>Published blog content</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Prompt Library</TableCell>
                        <TableCell>{stats?.promptCount || 0}</TableCell>
                        <TableCell>Prompts in the library</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Consultations</TableCell>
                        <TableCell>{stats?.consultationCount || 0}</TableCell>
                        <TableCell>All consultation requests</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pending Consultations</TableCell>
                        <TableCell>{stats?.pendingConsultations || 0}</TableCell>
                        <TableCell>Consultations awaiting response</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">User Roles</TableCell>
                        <TableCell>{stats?.roleCount || 0}</TableCell>
                        <TableCell>Defined user roles in the system</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Usage Statistics</CardTitle>
                    <CardDescription>
                      Detailed usage of AI tools across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tool</TableHead>
                          <TableHead>Usage Count</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolUsageData.map(item => {
                          const total = toolUsageData.reduce((sum, i) => sum + i.count, 0);
                          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                          
                          return (
                            <TableRow key={item.name}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.count}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">{percentage}%</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  )
}