import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Bot,
  Network,
  TrendingUp,
  Zap,
  Database,
  Shield,
  Code,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  BarChart3
} from "lucide-react"

export const metadata = {
  title: "Product & Solution Documentation | Donjon Intelligence Systems",
  description: "Comprehensive documentation for all Donjon products and solutions including Alfie Agent, Starfleet Bridge Crew, N8N Workflows, and more.",
}

export default function DocumentationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D1F36] via-[#1A365D] to-[#004599] text-white py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30">
              <BookOpen className="h-4 w-4 mr-2" />
              Complete Documentation Repository
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Product & Solution Documentation
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Comprehensive guides, architecture documentation, and implementation details for all Donjon AI products and solutions.
              Everything you need to understand, deploy, and optimize our agent platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Main Documentation */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="alfie" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
                <TabsTrigger value="alfie" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">Alfie</span>
                </TabsTrigger>
                <TabsTrigger value="starfleet" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Starfleet</span>
                </TabsTrigger>
                <TabsTrigger value="workflows" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">N8N</span>
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Database</span>
                </TabsTrigger>
                <TabsTrigger value="solutions" className="flex items-center gap-2 text-xs sm:text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Solutions</span>
                </TabsTrigger>
              </TabsList>

              {/* ALFIE TAB */}
              <TabsContent value="alfie" className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                      🥃 Alfie Agent - The Digital Gangster
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Alfie is an unpredictable, volatile, yet surprisingly wise AI agent with sophisticated personality matrix and knowledge graph memory.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Overview Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-amber-600" />
                          Overview & Architecture
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Core Components</h4>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>✓ Personality Matrix System (5 mood states)</li>
                            <li>✓ Knowledge Graph Memory for context persistence</li>
                            <li>✓ Voice Engine with Cockney dialect</li>
                            <li>✓ Personal Code ethical framework</li>
                            <li>✓ Web search integration with cynical perspective</li>
                          </ul>
                        </div>
                        <Button className="w-full" asChild>
                          <Link href="/products/alfie">Try Alfie Live →</Link>
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documentation Files */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-amber-600" />
                          Documentation Files
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">ALFIE_ARCHITECTURE.md</p>
                              <p className="text-gray-600 dark:text-gray-400">Complete personality engine design</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">ALFIE_IMPLEMENTATION_GUIDE.md</p>
                              <p className="text-gray-600 dark:text-gray-400">Step-by-step implementation</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">ALFIE_ONLINE_INTEGRATION.md</p>
                              <p className="text-gray-600 dark:text-gray-400">Web search & commentary</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">ALFIE_QUOTES_DATABASE.md</p>
                              <p className="text-gray-600 dark:text-gray-400">Personality patterns & quotes</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features Grid */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features & Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2">Personality Modes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Jovial, Volatile, Philosophical, Calculating, World-Weary</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2">Memory System</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Persistent context with relationship tracking</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-semibold mb-2">Web Integration</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Search with business opportunity scanning</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* STARFLEET TAB */}
              <TabsContent value="starfleet" className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                      🚀 Starfleet Bridge Crew - Multi-Agent Orchestration
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Advanced multi-agent system inspired by Star Trek bridge dynamics for complex software engineering.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Network className="h-5 w-5 text-blue-600" />
                          Agent Roles & Structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Command Structure</h4>
                          <div className="space-y-2 text-sm">
                            <p>👨‍💼 <strong>Captain</strong> - Strategic Command</p>
                            <p>⚡ <strong>#1 First Officer</strong> - Coordination & Execution</p>
                            <p>🔧 <strong>Geordi Chief Engineer</strong> - Infrastructure</p>
                            <p>📊 <strong>Data Science Officer</strong> - Analysis</p>
                            <p>🛡️ <strong>Worf Security</strong> - Threat Detection</p>
                            <p>💭 <strong>Troi Counselor</strong> - UX & Psychology</p>
                            <p>🏥 <strong>Crusher Medical</strong> - System Health</p>
                            <p>🚀 <strong>Wesley Innovation</strong> - Prototyping</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-blue-600" />
                          Architecture & Protocols
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Key Capabilities</h4>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>✓ OODA Loop decision framework</li>
                            <li>✓ STAR handoff format</li>
                            <li>✓ Multi-system integration</li>
                            <li>✓ Real-time collaboration</li>
                            <li>✓ Mission-critical reliability</li>
                            <li>✓ Context-aware task distribution</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Use Cases & Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Complex Software Architecture</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Multi-system integration projects</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Enterprise Development</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Large-scale applications</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">DevOps & Infrastructure</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Deployment automation</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Code Review & QA</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Quality assurance</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* N8N WORKFLOWS TAB */}
              <TabsContent value="workflows" className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                      ⚡ N8N Workflow Orchestration
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Complete workflow automation system for business process orchestration and AI agent coordination.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-600" />
                          System Components
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <p className="font-medium mb-1">Database Schema</p>
                            <p className="text-gray-600 dark:text-gray-400">n8n_workflows & n8n_workflow_executions tables</p>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <p className="font-medium mb-1">API Client</p>
                            <p className="text-gray-600 dark:text-gray-400">lib/n8n-client.ts with webhook integration</p>
                          </div>
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <p className="font-medium mb-1">Server Actions</p>
                            <p className="text-gray-600 dark:text-gray-400">Complete CRUD operations & execution tracking</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-yellow-600" />
                          Documentation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">N8N_INTEGRATION_COMPLETE.md</p>
                              <p className="text-gray-600 dark:text-gray-400">Full deployment guide</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Example Workflows</p>
                              <p className="text-gray-600 dark:text-gray-400">3 ready-to-import templates</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pre-Built Workflow Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="font-semibold mb-2">📧 Consultation Alert</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receives requests, sends emails, logs to database</p>
                        </div>
                        <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="font-semibold mb-2">👥 Lead Qualification</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered scoring (0-100), categorizes prospects</p>
                        </div>
                        <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="font-semibold mb-2">📊 Weekly Report</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Automated analytics reports with metrics</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* DATABASE TAB */}
              <TabsContent value="database" className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                      📦 Database Infrastructure
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Production-ready Supabase PostgreSQL with complete RLS security, 23 tables, and 75+ performance indexes.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-green-600" />
                          Database Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>23 optimized tables</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>40+ RLS security policies</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>75+ performance indexes</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Real-time subscriptions on 13 tables</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Full-text search enabled</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Security & Compliance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Row-Level Security (RLS)</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>User data isolation</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Admin-only resources</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Encryption at rest & transit</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p>Audit logging</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Core Tables (23 Total)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">User & Auth</p>
                          <p className="text-gray-600 dark:text-gray-400">profiles, user_roles, permissions</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">Workflows</p>
                          <p className="text-gray-600 dark:text-gray-400">n8n_workflows, n8n_workflow_executions</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">Content</p>
                          <p className="text-gray-600 dark:text-gray-400">prompts, ai_tools, solutions</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">Business</p>
                          <p className="text-gray-600 dark:text-gray-400">consultations, assessments, case_studies</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">Analytics</p>
                          <p className="text-gray-600 dark:text-gray-400">analytics_events, bot_metrics, notifications</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-medium mb-2">Configuration</p>
                          <p className="text-gray-600 dark:text-gray-400">System settings & metadata</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        Documentation Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>📄 <strong>SUPABASE_DATABASE_IMPLEMENTATION_COMPLETE.md</strong> - Full technical reference</p>
                        <p>📄 <strong>QUICK_START_GUIDE_CLAY.md</strong> - Setup & configuration</p>
                        <p>📄 <strong>TESTING_GUIDE.md</strong> - 10 comprehensive test scenarios</p>
                        <p>📄 <strong>DATABASE_IMPLEMENTATION_INDEX.md</strong> - Navigation guide</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* SOLUTIONS TAB */}
              <TabsContent value="solutions" className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                      💡 Solutions & Services
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Complete suite of AI automation solutions for business process optimization and revenue growth.
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>ServicePro SaaS Platform</CardTitle>
                      <CardDescription>Ready-to-use AI platform for service businesses ($49-$299/month)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                          <p className="font-semibold text-sm mb-2">ServicePro Starter</p>
                          <p className="text-2xl font-bold text-green-600 mb-2">$49</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">AI chatbot, scheduling, calendar sync</p>
                        </div>
                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                          <p className="font-semibold text-sm mb-2">ServicePro Professional</p>
                          <p className="text-2xl font-bold text-blue-600 mb-2">$149</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Advanced AI, unlimited customers, invoicing</p>
                        </div>
                        <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                          <p className="font-semibold text-sm mb-2">ServicePro Enterprise</p>
                          <p className="text-2xl font-bold text-purple-600 mb-2">$299</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Multi-location, API access, white-label</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solution Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Customer Service Automation</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">24/7 AI chatbots for inquiries & support</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Lead Qualification & Scoring</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered prospect evaluation</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Process Automation</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Workflow orchestration & optimization</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Data Analysis & Insights</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Business intelligence from data</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Integration Services</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Custom API & system connections</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Consulting & Strategy</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Expert guidance for AI adoption</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-3xl font-bold text-orange-600">327%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Avg ROI (6 months)</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-orange-600">42 days</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Time to Value</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-orange-600">18 hrs/wk</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Productivity Gain</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-orange-600">$10k+</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Information Access Report */}
      <section className="py-16 bg-white dark:bg-gray-950 border-t">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                📋 Information Access & Availability Report
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive breakdown of documentation sources and data accessibility for all products and solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* FULLY DOCUMENTED */}
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                    Fully Documented ✓
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">1. Alfie Agent</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>✓ Architecture documentation (ALFIE_ARCHITECTURE.md)</li>
                      <li>✓ Implementation guide (ALFIE_IMPLEMENTATION_GUIDE.md)</li>
                      <li>✓ Online integration (ALFIE_ONLINE_INTEGRATION.md)</li>
                      <li>✓ Quotes database (ALFIE_QUOTES_DATABASE.md)</li>
                      <li>✓ README with quick start</li>
                      <li>✓ Live demo at /products/alfie</li>
                      <li>✓ Full personality specifications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">2. Database Infrastructure</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>✓ Complete technical implementation</li>
                      <li>✓ Database schema documentation</li>
                      <li>✓ Security checklist & RLS policies</li>
                      <li>✓ Testing guide (10 scenarios)</li>
                      <li>✓ Quick start guide</li>
                      <li>✓ Implementation summary</li>
                      <li>✓ TypeScript types auto-generated</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">3. N8N Workflows</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>✓ Integration guide (N8N_INTEGRATION_COMPLETE.md)</li>
                      <li>✓ API client code (lib/n8n-client.ts)</li>
                      <li>✓ Server actions implementation</li>
                      <li>✓ Admin dashboard UI</li>
                      <li>✓ 3 example workflows (JSON templates)</li>
                      <li>✓ Real-time execution tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">4. Solutions & Services</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>✓ ServicePro SaaS platform details</li>
                      <li>✓ Pricing and features by tier</li>
                      <li>✓ ROI metrics (327% avg, 42 days payback)</li>
                      <li>✓ Use cases and applications</li>
                      <li>✓ Integration capabilities</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* PARTIALLY DOCUMENTED & MISSING */}
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-6 w-6" />
                    Limited/Missing Documentation ⚠️
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">1. Starfleet Bridge Crew</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>⚠️ Conceptual documentation only</li>
                      <li>❌ NO implementation guide</li>
                      <li>❌ NO actual code repository</li>
                      <li>❌ NO deployment specifications</li>
                      <li>❌ NO API documentation</li>
                      <li>ℹ️ Product page only has general description</li>
                      <li>📝 <strong>NOTE:</strong> Needs full technical documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">2. Wolf of Donjon Street</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>❌ NO technical documentation</li>
                      <li>❌ NO implementation details</li>
                      <li>❌ Notion link inaccessible</li>
                      <li>⚠️ Only product page description</li>
                      <li>⚠️ Status: "Coming Soon"</li>
                      <li>📝 <strong>NOTE:</strong> Requires complete documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">3. Knowledge Graph Memory</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>⚠️ Architecture document available</li>
                      <li>❌ NO implementation examples</li>
                      <li>❌ NO API reference</li>
                      <li>❌ NO testing guide</li>
                      <li>📝 <strong>NOTE:</strong> Needs developer guide</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">4. Prompt Library</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>✓ Database tables exist</li>
                      <li>⚠️ Admin interface built</li>
                      <li>❌ NO comprehensive documentation</li>
                      <li>❌ NO usage guide for users</li>
                      <li>📝 <strong>NOTE:</strong> Needs user documentation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Statistics */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Documentation Coverage Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">60%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Product Lines Fully Documented</p>
                    <p className="text-xs text-gray-500 mt-1">(3 of 5)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">2,400+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Lines of Documentation</p>
                    <p className="text-xs text-gray-500 mt-1">Fully accessible</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">40%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Requiring Additional Docs</p>
                    <p className="text-xs text-gray-500 mt-1">(2 of 5)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">∞</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Potential for Expansion</p>
                    <p className="text-xs text-gray-500 mt-1">Always growing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1A365D] to-[#0076FF] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Deploy?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Access all product documentation, implementation guides, and example code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1A365D] hover:bg-gray-100" asChild>
                <Link href="/products">View Products</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/consultation">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

