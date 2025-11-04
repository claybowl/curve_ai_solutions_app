import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROICalculator } from "@/components/roi-calculator"
import {
  BookOpen,
  Calculator,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Database,
  ChevronRight,
  Star,
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3
} from "lucide-react"

export const metadata = {
  title: "Donjon Knowledge Vault | Intelligence & Resources",
  description: "Access our complete intelligence library: Live ROI calculator, technical documentation, case studies, and strategic insights for AI automation.",
}

export default function KnowledgeVaultPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D1F36] via-[#1A365D] to-[#004599] text-white py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30">
              <Shield className="h-4 w-4 mr-2" />
              Restricted Access - Authorized Personnel Only
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Donjon Knowledge Vault
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Central repository of strategic intelligence, technical documentation,
              and performance metrics for the Donjon AiGency Suite.
              Everything you need to evaluate, implement, and optimize your AI operations.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
                <Calculator className="h-5 w-5 mr-2" />
                Calculate ROI
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1A365D]">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white dark:bg-gray-950 border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">
                200+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Agent Templates
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Integration Guides
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">
                100+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Case Studies
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Support Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="roi" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                <TabsTrigger value="roi" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  ROI Calculator
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              {/* ROI Calculator Tab */}
              <TabsContent value="roi" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                    AI Automation ROI Calculator
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Calculate your potential savings and ROI with Donjon AiGency Suite.
                    Input your current operational costs and see immediate impact projections.
                  </p>
                </div>

                <ROICalculator />

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Average ROI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">327%</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Within first 6 months
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Time to Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">42 days</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average implementation
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Productivity Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 mb-2">18 hrs/wk</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Saved per team member
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Technical Documentation Tab */}
              <TabsContent value="technical" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                    Technical Documentation
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Architecture guides, API references, and implementation best practices
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: Zap, title: "Architecture Overview", desc: "System design and component interaction", status: "Complete" },
                    { icon: Database, title: "API Reference", desc: "RESTful API documentation with examples", status: "In Progress" },
                    { icon: Shield, title: "Security Guide", desc: "Authentication, authorization, and best practices", status: "Complete" },
                    { icon: Users, title: "Integration Guide", desc: "Connect with existing tools and workflows", status: "Draft" },
                    { icon: Target, title: "Performance Tuning", desc: "Optimize for scale and reliability", status: "Planning" },
                    { icon: BarChart3, title: "Monitoring Guide", desc: "Track performance and health metrics", status: "In Progress" },
                  ].map((doc, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <doc.icon className="h-8 w-8 text-[#0076FF]" />
                          <Badge variant={doc.status === "Complete" ? "default" : "secondary"}>
                            {doc.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>{doc.desc}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          View Documentation
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Business Resources Tab */}
              <TabsContent value="business" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                    Business Intelligence
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Case studies, white papers, and strategic insights
                  </p>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Manufacturing Company Saves 40 Hours/Week with AI Automation",
                      category: "Case Study",
                      excerpt: "How a mid-sized manufacturer streamlined operations with Donjon AiGency Suite, reducing manual data entry by 90%.",
                      metrics: ["40 hrs/week saved", "327% ROI", "6-month payback"]
                    },
                    {
                      title: "The ROI of AI in Small Business Operations",
                      category: "White Paper",
                      excerpt: "Comprehensive analysis of AI automation impact on small business productivity and profitability.",
                      metrics: ["18 industries analyzed", "200+ companies", "2023-2024 data"]
                    },
                    {
                      title: "Building the Business Case for AI Automation",
                      category: "Guide",
                      excerpt: "Step-by-step framework for justifying AI investments to stakeholders and finance teams.",
                      metrics: ["Template included", "CFO-approved", "Real examples"]
                    }
                  ].map((resource, i) => (
                    <Card key={i} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-[#FF7F00] text-white">{resource.category}</Badge>
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{resource.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          {resource.metrics.map((metric, j) => (
                            <span key={j} className="text-sm font-medium text-[#0076FF]">
                              ✓ {metric}
                            </span>
                          ))}
                        </div>
                        <Button>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                    Resource Library
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Templates, tools, and educational content
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Lightbulb, title: "Getting Started", count: 12 },
                    { icon: Users, title: "Team Training", count: 8 },
                    { icon: Target, title: "Success Metrics", count: 15 },
                    { icon: Shield, title: "Compliance", count: 6 },
                    { icon: Zap, title: "Best Practices", count: 24 },
                    { icon: Database, title: "Data Sheets", count: 10 },
                    { icon: BookOpen, title: "eBooks", count: 5 },
                    { icon: BarChart3, title: "Webinars", count: 3 },
                  ].map((resource, i) => (
                    <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <resource.icon className="h-12 w-12 mx-auto mb-4 text-[#0076FF]" />
                      <h3 className="font-semibold mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.count} resources</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A365D] to-[#0076FF] text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using Donjon AiGency Suite to automate workflows,
              boost productivity, and accelerate growth.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-[#1A365D] hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1A365D]">
                Book Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}