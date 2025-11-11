import Link from "next/link"
import { ArrowRight, Bot, Network, TrendingUp, Brain, Code, Users, MessageSquare, Zap, Shield, Database, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkyBackground } from "@/components/sky-background"

export const metadata = {
  title: "AI Agent Products | Donjon Intelligence Systems",
  description: "Explore our cutting-edge AI agent products: Alfie, Starfleet Bridge Crew, and Wolf of Donjon Street sales agent.",
}

export default function ProductsPage() {
  const products = [
    {
      id: "alfie",
      name: "Alfie",
      tagline: "The Digital Gangster with Philosophical Depth",
      icon: Bot,
      gradient: "from-amber-600 to-orange-600",
      description: "Meet Alfie - an unpredictable, volatile, yet surprisingly wise AI agent that keeps users engaged while delivering genuine value. Built on our revolutionary agent personality framework.",
      highlights: [
        "Sophisticated personality matrix system with mood states",
        "Knowledge graph memory for persistent context",
        "Revolutionary agent development methodology",
        "Cockney-accented voice engine with authentic linguistic patterns",
        "Personal code system with ethical framework",
        "Web search integration with cynical commentary"
      ],
      features: [
        {
          title: "Personality Matrix",
          description: "Dynamic mood states (jovial, volatile, philosophical, calculating, world-weary) that adapt to conversation context"
        },
        {
          title: "Knowledge Graph Memory",
          description: "Persistent memory system that tracks user relationships, conversation history, grudges, debts, and past stories"
        },
        {
          title: "Voice Engine",
          description: "Authentic Cockney dialect with strategic profanity, rhyming slang, and signature metaphors"
        },
        {
          title: "Personal Code System",
          description: "Unbreakable rules that protect community, honor, and intelligence while betraying authority and stupidity"
        },
        {
          title: "Web Integration",
          description: "Online search capabilities filtered through Alfie's cynical perspective with business opportunity scanning"
        }
      ],
      useCases: [
        "Customer engagement with personality",
        "Business advice with contrarian wisdom",
        "Entertainment and storytelling",
        "Market research with attitude"
      ],
      status: "Available for Demo",
      cta: "Try Alfie Demo",
      ctaLink: "/products/alfie"
    },
    {
      id: "starfleet",
      name: "Starfleet Software Engineering Bridge Crew",
      tagline: "Multi-Agent Orchestration for Complex Development",
      icon: Network,
      gradient: "from-blue-600 to-indigo-600",
      description: "A sophisticated multi-agent system inspired by Star Trek's bridge crew dynamics. Each agent specializes in a critical aspect of software engineering, working in harmony to deliver exceptional results.",
      highlights: [
        "Multi-agent orchestration architecture",
        "Role-based specialization (Captain, First Officer, Engineers, etc.)",
        "Real-time collaboration and decision-making",
        "Context-aware task distribution",
        "Mission-critical reliability",
        "Enterprise-grade security protocols"
      ],
      features: [
        {
          title: "Bridge Command Structure",
          description: "Captain (#1) coordinates mission planning, First Officer handles execution, with specialized officers for each domain"
        },
        {
          title: "Engineering Division",
          description: "Chief Engineer (Geordi) for infrastructure, Systems Engineer for architecture, DevOps for deployment pipelines"
        },
        {
          title: "Science & Analysis",
          description: "Science Officer (Data) for data analysis, Counselor (Troi) for user psychology, Medical Officer for system health"
        },
        {
          title: "Tactical Operations",
          description: "Security Officer for threat detection, Communications for API integration, Navigation for routing decisions"
        },
        {
          title: "Mission Protocols",
          description: "OODA loop decision framework, STAR handoff format, and comprehensive runbooks for incident response"
        }
      ],
      useCases: [
        "Complex software architecture projects",
        "Multi-system integration",
        "Enterprise application development",
        "DevOps and infrastructure automation",
        "Code review and quality assurance"
      ],
      status: "Enterprise Solution",
      cta: "Request Consultation",
      ctaLink: "/consultation"
    },
    {
      id: "wolf",
      name: "Wolf of Donjon Street",
      tagline: "Aggressive Sales Agent with Street-Smart Intelligence",
      icon: TrendingUp,
      gradient: "from-red-600 to-rose-600",
      description: "A high-performance sales agent modeled after the legendary Wolf of Wall Street. This agent combines aggressive sales tactics with intelligent lead qualification, relationship building, and deal closure strategies.",
      highlights: [
        "Aggressive lead qualification and scoring",
        "Multi-channel outreach (email, SMS, phone, social)",
        "Intelligent objection handling",
        "Relationship mapping and CRM integration",
        "Real-time sales pipeline management",
        "Performance analytics and optimization"
      ],
      features: [
        {
          title: "Lead Intelligence",
          description: "Advanced lead scoring using behavioral data, firmographics, and intent signals to prioritize high-value prospects"
        },
        {
          title: "Outreach Orchestration",
          description: "Multi-touchpoint campaigns with personalized messaging, optimal timing, and channel selection based on prospect preferences"
        },
        {
          title: "Objection Handling",
          description: "AI-powered objection detection and response system that addresses concerns with data-driven counterarguments"
        },
        {
          title: "Deal Management",
          description: "Automated pipeline tracking, stage progression, and win/loss analysis with predictive close probability"
        },
        {
          title: "Performance Analytics",
          description: "Real-time dashboards showing conversion rates, revenue attribution, agent performance, and ROI metrics"
        }
      ],
      useCases: [
        "B2B sales automation",
        "Lead generation and qualification",
        "Sales pipeline management",
        "Customer relationship nurturing",
        "Revenue optimization"
      ],
      status: "Coming Soon",
      cta: "Join Waitlist",
      ctaLink: "/consultation"
    }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-donjon-ember text-white hover:bg-donjon-ember/90">
              AI Agent Products
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              Revolutionary AI Agent Products
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-4">
              Experience the future of AI agents with personality, orchestration, and sales intelligence.
              Built on cutting-edge knowledge graph memory and multi-agent architectures.
            </p>
            <p className="max-w-[700px] mx-auto text-gray-200 text-lg mb-8">
              From philosophical gangsters to Starfleet engineering crews to aggressive sales agents
            </p>
          </div>
        </div>
      </SkyBackground>

      {/* Products Grid */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => {
                const Icon = product.icon
                return (
                  <Card
                    key={product.id}
                    className="flex flex-col border-2 hover:border-donjon-indigo dark:border-gray-700 dark:hover:border-blue-600 transition-all hover:shadow-xl"
                  >
                    <CardHeader className={`bg-gradient-to-br ${product.gradient} text-white rounded-t-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-10 w-10" />
                        <Badge className="bg-white/20 text-white border-white/30">
                          {product.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                      <CardDescription className="text-white/90 text-sm">
                        {product.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-6">
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {product.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-donjon-indigo" />
                          Key Highlights
                        </h4>
                        <ul className="space-y-2">
                          {product.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-donjon-indigo mr-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-donjon-indigo" />
                          Core Features
                        </h4>
                        <div className="space-y-3">
                          {product.features.map((feature, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                                {feature.title}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {feature.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-donjon-indigo" />
                          Use Cases
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.useCases.map((useCase, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {useCase}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${product.gradient} hover:opacity-90 text-white`}
                        size="lg"
                        asChild
                      >
                        <Link href={product.ctaLink}>
                          {product.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Technology Stack Section */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-donjon-indigo/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-donjon-indigo" />
                  Built on Advanced Technology
                </CardTitle>
                <CardDescription>
                  Our agent products leverage cutting-edge AI infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-donjon-indigo mt-1" />
                    <div>
                      <div className="font-semibold text-sm mb-1">Knowledge Graph Memory</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Persistent context across sessions with relationship mapping
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="h-5 w-5 text-donjon-indigo mt-1" />
                    <div>
                      <div className="font-semibold text-sm mb-1">Multi-Agent Orchestration</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Coordinated workflows with specialized agent roles
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-donjon-indigo mt-1" />
                    <div>
                      <div className="font-semibold text-sm mb-1">Enterprise Security</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Role-based access control and data encryption
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SkyBackground className="py-16 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Deploy AI Agents?
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Schedule a consultation to see how our agent products can transform your business
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                <Link href="/consultation">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/solutions">See All Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
