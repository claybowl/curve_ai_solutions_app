import Link from "next/link"
import { SolutionsHero } from "@/components/solutions-hero"
import { SolutionsCTA } from "@/components/solutions-cta"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LucideIcon } from "lucide-react"
import { Shield, Rocket, Layers, Gem, Check, ArrowRight, BookOpen, Zap, MessageSquare, FileText, Search, Briefcase, Cpu, Database, TrendingUp, Bell, BarChart3 } from "lucide-react"

export const metadata = {
  title: "Donjon Intelligence Systems Breakdown | Donjon Intelligence Systems",
  description: "Explore Donjon's AI products, pricing, and add-ons to build an intelligent operations stack tailored to your team.",
}

// Force dynamic rendering since we fetch data with auth
export const dynamic = 'force-dynamic'

type PackageBundle = {
  id: string
  name: string
  headline: string
  price: string
  description: string
  features: string[]
  href: string
  badge?: string
  highlight?: boolean
  cta: string
  icon: LucideIcon
}

const packageBundles: PackageBundle[] = [
  {
    id: "servicepro-suite",
    name: "ServicePro AI Platform",
    headline: "Complete digital transformation in 48 hours or SaaS from $49/mo",
    price: "From $49/mo • $1,299-$3,999 one-time packages",
    description:
      "Choose your path: Quick Close packages deliver complete digital transformation in 48 hours, or start with our SaaS platform from $49/month. Both include AI-powered automation, booking systems, CRM, and full business management.",
    features: [
      "💼 SOLO Package ($1,299): Website, AI chatbot, booking, customer database, email/SMS, Google integrations",
      "👥 CREW Package ($2,499): Everything in SOLO + multi-user accounts, unlimited customers, invoicing & payments, advanced features",
      "🚛 FLEET Package ($3,999): Everything in CREW + multi-location management, route optimization, full CRM, API access",
      "SaaS options starting at $49/month with instant access and no setup fees",
      "48-hour delivery for packages or instant access for SaaS subscriptions",
    ],
    href: "/products#servicepro",
    highlight: false,
    cta: "Explore ServicePro",
    icon: Rocket,
  },
  {
    id: "aigency-suite",
    name: "Donjon AiGency Suite",
    headline: "Complete AI Agent Platform: Knowledge • Agents • Automation",
    price: "From $199/mo • $2,500 pilot program",
    description:
      "The complete Donjon AiGency Suite integrating Knowledge Studio, AiGency Workbench, and AiPex Platform. Build, deploy, and orchestrate AI agents that transform how your team works. From solo operators to enterprise deployments—scale your AI workforce with confidence.",
    features: [
      "🧠 Knowledge Studio: Centralized intelligence hub with semantic search and knowledge management",
      "⚡ AiGency Workbench: Visual agent builder with 5-10 concurrent agents per tier",
      "🚀 AiPex Platform: Advanced workflow orchestration with multi-agent handoffs",
      "Agent Library: Pre-built templates for support, sales, ops, research, and analysis",
      "Seamless Integration: Connects to Gmail, Slack, Notion, databases, and custom APIs",
      "Unified Dashboard: Monitor performance, track ROI, and manage your entire agent ecosystem",
    ],
    href: "/solutions#aigency-suite",
    highlight: true,
    cta: "Explore Donjon AiGency Suite",
    icon: Layers,
  },
  {
    id: "custom-builds",
    name: "Custom AI Ops & Agents",
    headline: "Deploy a package of specialized agents that work as a team",
    price: "Custom engagements",
    description:
      "Get multiple AI agents designed for your unique workflows. Each agent handles a specific task—like answering customer questions, processing invoices, or analyzing reports—but they all work together, sharing information and coordinating tasks across your business.",
    features: [
      "Package of 3-10+ specialized agents: Each agent focuses on different tasks (support, operations, data analysis, reporting)",
      "Agents that work together: They share knowledge bases, hand off tasks to each other, and maintain context across your entire workflow",
      "What agents can do: Answer customer questions, process documents, route tickets, generate reports, monitor systems, analyze data, and automate routine tasks",
      "Custom integrations: Connect to your existing tools—CRM, ERP, email, Slack, databases, and proprietary systems",
      "We start with your workflows: Strategic discovery to map your processes, then build agents that deliver measurable ROI",
      "Dedicated engineering team: Weekly progress updates with testing and refinement until everything runs smoothly",
    ],
    href: "/products#custom",
    highlight: false,
    cta: "Schedule a Discovery Call",
    icon: Gem,
  },
]

type ProjectHighlight = {
  name: string
  tagline: string
  href: string
  type: "Product" | "Project"
  cta: string
}

const projectHighlights: ProjectHighlight[] = [
  {
    name: "ServicePro-v2",
    tagline: "Comprehensive business management platform for service teams",
    href: "https://github.com/claybowl/ServicePro-v2",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Alfie Business Manager",
    tagline: "3D knowledge graph business intelligence platform",
    href: "https://github.com/claybowl/alfie-business-manager",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Amazon Listing Enhancer AI",
    tagline: "E-commerce listing optimization with GPT-4o and DALL-E 3",
    href: "https://github.com/claybowl/Amazon_Listing_Enhancer_AI",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Know-Defeat",
    tagline: "Algorithmic trading system with probability-driven execution",
    href: "https://github.com/claybowl/Know-Defeat",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Taygency",
    tagline: "Multi-tenant AI agency platform with knowledge graph integration",
    href: "https://github.com/claybowl/Taygency",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Curve AiGency Knowledge Studio",
    tagline: "Knowledge studio with graph-based context management",
    href: "https://github.com/claybowl/Curve-AiGency-Knowledge-Studio",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Agent Workbench V2",
    tagline: "Rapid prototyping workbench for multi-agent workflows",
    href: "https://github.com/claybowl/Agent-Workbench-V2",
    type: "Project",
    cta: "View Project",
  },
  {
    name: "Ai-Search-Chat-Morphic",
    tagline: "Conversational AI search with morphic UX",
    href: "https://github.com/claybowl/Ai-Search-Chat-Morphic",
    type: "Project",
    cta: "View Project",
  },
  {
    name: "The-Nanny",
    tagline: "Claude computer-use assistant for automated workflows",
    href: "https://github.com/claybowl/The-Nanny",
    type: "Project",
    cta: "View Project",
  },
  {
    name: "Multi-tenant Donjon",
    tagline: "Minimalistic multi-tenant Next.js starter template",
    href: "https://github.com/claybowl/multi-tenant-donjon",
    type: "Project",
    cta: "View Project",
  },
  {
    name: "Clean Machine Web App",
    tagline: "Customer-facing web app for Clean Machine",
    href: "https://github.com/claybowl/clean-machine-webapp",
    type: "Product",
    cta: "View Product",
  },
  {
    name: "Drone-Fruit.Ai",
    tagline: "Agricultural AI project for smart crop insights",
    href: "https://github.com/claybowl/Drone-Fruit.Ai",
    type: "Project",
    cta: "View Project",
  },
]

type IndividualTool = {
  name: string
  coverage: string
  price: string
}

const individualTools: IndividualTool[] = [
  {
    name: "AI Chatbot",
    coverage: "24/7 lead capture, FAQs, warm hand-offs to your team",
    price: "$79/mo or $799/yr",
  },
  {
    name: "Booking System",
    coverage: "Self-serve scheduling, reminders, calendar sync, deposits",
    price: "$69/mo or $699/yr",
  },
  {
    name: "Simple CRM",
    coverage: "Pipeline tracking, customer notes, follow-up sequences",
    price: "$89/mo or $899/yr",
  },
  {
    name: "Analytics",
    coverage: "Dashboards for leads, bookings, revenue, and campaign ROI",
    price: "$49/mo or $499/yr",
  },
]

// Custom packages
type CustomPackage = {
  name: string
  tagline: string
  price: number
  monthlyFee: number
  timeline: string
  description: string
  features: string[]
  checkoutUrl: string
}

const customPackages: CustomPackage[] = [
  {
    name: "Quick Start Custom",
    tagline: "Affordable Custom Setup",
    price: 2500,
    monthlyFee: 99,
    timeline: "2-3 weeks",
    description: "Custom chatbot and automation built for your specific needs",
    features: [
      "Custom AI training",
      "Your branding",
      "Basic automation",
      "Training sessions",
      "30-day support",
    ],
    checkoutUrl: "https://buy.stripe.com/dRm4gzdNH9Eq1XFg087AI0B",
  },
  {
    name: "Business Custom",
    tagline: "Growing Teams Solution",
    price: 4500,
    monthlyFee: 149,
    timeline: "3-4 weeks",
    description: "Advanced custom build with multi-user support and integrations",
    features: [
      "Everything in Quick Start",
      "Multi-user accounts",
      "Custom integrations (2 systems)",
      "Advanced automation workflows",
      "60-day support",
      "Team training",
    ],
    checkoutUrl: "https://buy.stripe.com/bJe6oH4d7dUGgSzg087AI0A",
  },
  {
    name: "Professional Custom",
    tagline: "Enterprise-Grade Solution",
    price: 7500,
    monthlyFee: 199,
    timeline: "4-6 weeks",
    description: "Complete custom implementation with advanced features",
    features: [
      "Everything in Business",
      "Full custom CRM",
      "Unlimited integrations",
      "API access",
      "White-label options",
      "90-day support",
      "Dedicated project manager",
    ],
    checkoutUrl: "https://buy.stripe.com/28E6oHcJDg2Obyf29i7AI0C",
  },
]

// Donjon Product Tiers
type DonjonTier = {
  id: string
  name: string
  tagline: string
  price: string
  bestFor: string
  description: string
  features: string[]
  outcomes: string[]
  cta: string
  ctaLink: string
  highlight?: boolean
  icon: LucideIcon
}

const donjonTiers: DonjonTier[] = [
  {
    id: "donjon-starter",
    name: "Donjon AiGency Suite - Starter",
    tagline: "Your First AI Agent Team",
    price: "$199/mo",
    bestFor: "Teams ready to deploy their first AI agents",
    description: "Complete Donjon AiGency Suite with Knowledge Studio, AiGency Workbench, and AiPex Platform. Perfect for getting started with intelligent automation.",
    features: [
      "🧠 Knowledge Studio: 10 GB ingestion, semantic search, collections",
      "⚡ AiGency Workbench: 5 active agents, 10 agent templates",
      "🚀 AiPex Platform: Basic workflow automation (500 runs/mo)",
      "Core integrations: Gmail, Slack, webhooks",
      "Team collaboration (up to 5 users)",
      "Email support",
    ],
    outcomes: [
      "Deploy your first AI agents in hours, not weeks",
      "Automate routine tasks across support and ops",
      "Centralized knowledge base for the entire team",
    ],
    cta: "Start 14-day trial",
    ctaLink: "https://buy.stripe.com/6oU4gzbFzaIuaubaFO7AI0q",
    highlight: false,
    icon: BookOpen,
  },
  {
    id: "donjon-pro",
    name: "Donjon AiGency Suite - Pro",
    tagline: "Scale Your Agent Workforce",
    price: "$499/mo",
    bestFor: "Growing teams automating multiple workflows",
    description: "Expanded agent capacity with advanced orchestration. Power your entire operation with a coordinated team of AI agents working together.",
    features: [
      "Everything in Starter",
      "🧠 Knowledge Studio: 50 GB ingestion, advanced analytics",
      "⚡ AiGency Workbench: 8 active agents, 25+ agent templates",
      "🚀 AiPex Platform: Advanced orchestration (2,000 runs/mo)",
      "Multi-agent workflows & handoffs",
      "All integrations + custom API access",
      "Team collaboration (up to 20 users)",
      "Priority support + monthly strategy calls",
    ],
    outcomes: [
      "Full department automation (support, sales, ops)",
      "Agents collaborating on complex workflows",
      "Measurable ROI with detailed analytics",
    ],
    cta: "See it on your data",
    ctaLink: "https://buy.stripe.com/cNi00jbFzbMycCjeW47AI0r",
    highlight: true,
    icon: Zap,
  },
  {
    id: "donjon-business",
    name: "Donjon AiGency Suite - Business",
    tagline: "Enterprise-Grade Agent Operations",
    price: "$899/mo",
    bestFor: "Organizations deploying AI at scale",
    description: "Maximum agent capacity with enterprise controls. Orchestrate hundreds of workflows across your entire organization with full governance.",
    features: [
      "Everything in Pro",
      "🧠 Knowledge Studio: 200 GB ingestion, enterprise search",
      "⚡ AiGency Workbench: 10 active agents, 50+ agent templates",
      "🚀 AiPex Platform: Unlimited orchestration, SLA guaranteed",
      "Advanced security: SSO, audit logs, role-based access",
      "Custom integrations & private deployments",
      "Unlimited users + white-label options",
      "Dedicated success manager + 24/7 support",
    ],
    outcomes: [
      "Transform entire business processes with AI",
      "Scale agents across departments with governance",
      "Competitive advantage through automation",
    ],
    cta: "Start a 2-week pilot",
    ctaLink: "https://buy.stripe.com/14A6oHcJD7wiaubaFO7AI0s",
    highlight: false,
    icon: Briefcase,
  },
  {
    id: "donjon-enterprise",
    name: "Donjon Enterprise",
    tagline: "Your Private Intelligence Layer",
    price: "Custom (annual)",
    bestFor: "Security-sensitive teams and larger orgs",
    description: "Enterprise-grade security and control with private deployments. Scale AI agents across departments with full governance.",
    features: [
      "Everything in Business",
      "SSO, SCIM, data residency options",
      "Private deployments and VPC peering",
      "Advanced policies and redaction",
      "Dedicated success architect and SLAs",
    ],
    outcomes: [
      "Enterprise-grade control without slowing down delivery",
      "Scaling agents across departments with governance",
    ],
    cta: "Book a technical scoping call",
    ctaLink: "/contact?plan=enterprise",
    highlight: false,
    icon: Shield,
  },
  {
    id: "donjon-pilot",
    name: "Donjon Launch Pilot",
    tagline: "Prove Value in 14 Days",
    price: "$2,500 fixed",
    bestFor: "Teams who want proof on their own workflows before a subscription",
    description: "Test Donjon on your real workflows with a fixed-price pilot. Get production-ready agents configured and measurable ROI before committing to a subscription.",
    features: [
      "Up to 5 GB of your data",
      "2 production-ready agents configured",
      "Success metric defined and measured",
      "Executive readout and next-steps plan",
    ],
    outcomes: [
      "Clear ROI signal and rollout plan",
    ],
    cta: "Kick off your pilot",
    ctaLink: "https://buy.stripe.com/28E00j4d73g259RdS07AI0t",
    highlight: false,
    icon: Rocket,
  },
]

// Specialized Agent Templates (Included with AiGency Workbench)
type AgentTemplate = {
  id: string
  name: string
  category: string
  description: string
  icon: LucideIcon
}

const agentTemplates: AgentTemplate[] = [
  {
    id: "lead-qualification",
    name: "Lead Qualification Agent",
    category: "Sales Automation",
    description: "Automatically scores leads based on industry, budget, and timeline. Sends instant notifications for hot leads via email.",
    icon: TrendingUp,
  },
  {
    id: "consultation-alert",
    name: "Consultation Alert System",
    category: "Customer Service",
    description: "Instant notifications for new consultation requests. Logs to database and sends email alerts with full client details.",
    icon: Bell,
  },
  {
    id: "weekly-report",
    name: "Weekly Report Generator",
    category: "Analytics",
    description: "Automated weekly business reports with key metrics, KPIs, and actionable insights delivered via email.",
    icon: BarChart3,
  },
]

// Add-ons
type Addon = {
  name: string
  price: string
  description?: string
}

const addons: Addon[] = [
  {
    name: "First-line personalization pack for outbound",
    price: "+$300/mo",
  },
  {
    name: "Custom connector or action",
    price: "from $800 one-time",
  },
  {
    name: "Data cleanup and migration",
    price: "from $1,500 project",
  },
  {
    name: "Onsite workshop and enablement",
    price: "from $2,000 day rate",
  },
  {
    name: "Extra data capacity",
    price: "+$20/mo per 10 GB",
  },
  {
    name: "Team onboarding workshop",
    price: "from $1,500",
  },
  {
    name: "Premium support SLA",
    price: "+$250/mo",
  },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <SolutionsHero />

      <section className="py-20 bg-gradient-to-br from-[#0D1F36] via-[#1A365D] to-[#004599] text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">Bundles First</Badge>
            <h2 className="text-4xl font-bold mb-4">Start with the Package That Fits</h2>
            <p className="text-lg text-white/80 mb-4">
              Packages bundle our highest-impact automations so you see ROI faster. Mix and match tools later; start
              with the offer that gets your team live this week.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {packageBundles.map((bundle) => {
              const Icon = bundle.icon

              return (
                <Card
                  key={bundle.id}
                  id={bundle.id}
                  className={`relative flex h-full flex-col border-2 bg-white/5 text-slate-100 shadow-xl backdrop-blur-sm ${
                    bundle.highlight
                      ? "border-sky-400 shadow-sky-400/20"
                      : "border-white/10"
                  }`}
                >
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-base font-semibold text-sky-300">{bundle.price}</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold text-white">
                        {bundle.name}
                      </CardTitle>
                      <CardDescription className="text-base text-slate-400">
                        {bundle.headline}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 pt-0">
                    <p className="text-slate-400">{bundle.description}</p>
                    <ul className="space-y-3">
                      {bundle.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-slate-300">
                          <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      size="lg"
                      className={`w-full justify-center ${
                        bundle.highlight
                          ? "bg-sky-500 text-white hover:bg-sky-400"
                          : "bg-sky-600 text-white hover:bg-sky-500"
                      }`}
                    >
                      <Link href={bundle.href}>{bundle.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <p className="mt-10 text-center text-sm text-white/80">
            Want a hybrid approach? We can layer tools onto any package after we launch your core system.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-950/80 text-white">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-500/90">
              Projects & Products
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Curated Project Highlights</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Investor-facing highlights from GitHub. Full products live alongside solutions, while experimental builds
              are listed as projects.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectHighlights.map((project) => (
              <Card key={project.name} className="border border-white/10 bg-white/5 text-white">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {project.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/70">{project.tagline}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                      {project.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donjon Intelligence Systems Breakdown */}
      <section className="py-20 bg-slate-900/50">
        <div className="container">
          <div className="mb-16 flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-center text-white">
              Donjon Intelligence Systems Breakdown
            </h2>
            <p className="mx-auto max-w-4xl text-center text-xl leading-relaxed text-slate-400">
              Complete AI platform with subscription tiers, standalone modules, and add-ons. Choose the right combination for your team's needs.
            </p>
          </div>

          {/* Donjon Tiers */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-500/90">
                Subscription Tiers
              </Badge>
              <h3 className="text-3xl font-bold text-white mb-4">
                Choose Your Donjon Plan
              </h3>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                From getting started to enterprise scale, find the plan that fits your team's AI needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {donjonTiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <Card
                    key={tier.id}
                    className={`flex flex-col border-2 bg-white/5 backdrop-blur-sm ${
                      tier.highlight
                        ? "border-sky-400 shadow-xl shadow-sky-400/20 scale-105 relative"
                        : "border-white/10 hover:border-sky-500/50"
                    } transition-all duration-300 hover:shadow-lg`}
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-sky-500 text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                          {tier.tagline}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">
                        {tier.name}
                      </CardTitle>
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-sky-400">
                          {tier.price}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {tier.bestFor}
                        </p>
                      </div>
                      <CardDescription className="text-slate-400">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2 text-sm">What's included:</h4>
                        <ul className="space-y-2">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-sky-400 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-sky-500/20">
                        <h4 className="font-semibold text-white mb-2 text-sm">Outcomes:</h4>
                        <ul className="space-y-1">
                          {tier.outcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-300">
                              <span className="mr-2">✓</span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${
                          tier.highlight
                            ? "bg-sky-500 hover:bg-sky-400"
                            : "bg-sky-600 hover:bg-sky-500"
                        } text-white`}
                        size="lg"
                        asChild
                      >
                        <Link href={tier.ctaLink}>{tier.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Agent Templates Included */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-500/90">
                Agent Templates
              </Badge>
              <h3 className="text-3xl font-bold text-white mb-4">
                Pre-Built Agent Templates
              </h3>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                All agent templates are included with the AiGency Workbench. Deploy specialized agents instantly or customize them for your specific workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {agentTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="flex flex-col border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/50 transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                          {template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 text-white">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="bg-sky-500/10 p-3 rounded-lg border border-sky-500/20">
                        <p className="text-sm font-semibold text-sky-300 mb-1">
                          ✅ Included with all tiers
                        </p>
                        <p className="text-xs text-slate-400">
                          Ready to deploy in 1-click
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-400">
                Add-Ons
              </Badge>
              <h3 className="text-2xl font-bold text-white mb-4">
                Enhance Your Donjon Stack
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Extend functionality with add-ons for capacity, customization, and premium support.
              </p>
            </div>

            <Card className="bg-slate-800/30 border-2 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addons.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-sm text-slate-300">{addon.name}</span>
                      <Badge variant="outline" className="text-xs font-semibold text-sky-400 border-sky-500">
                        {addon.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Use Cases */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Common Use Cases</h3>
              <p className="text-white/80">
                See how teams use Donjon to automate workflows and get better answers
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Customer Support Copilot</h4>
                  <p className="text-sm text-white/90">
                    Answers from your docs and policies. Reduce ticket volume and improve first response time.
                  </p>
                  <Button variant="outline" className="mt-3 border-white text-white hover:bg-white/20" size="sm" asChild>
                    <Link href="/contact?usecase=support">Explore Support Copilot</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Sales Ops Agent</h4>
                  <p className="text-sm text-white/90">
                    Drafts replies, snippets, and case-study summaries. More replies and tighter follow-through.
                  </p>
                  <Button variant="outline" className="mt-3 border-white text-white hover:bg-white/20" size="sm" asChild>
                    <Link href="/contact?usecase=sales">Explore Sales Writer</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Research Agent</h4>
                  <p className="text-sm text-white/90">
                    Surfaces relationships across PDFs, decks, and notes. Hours saved on literature reviews.
                  </p>
                  <Button variant="outline" className="mt-3 border-white text-white hover:bg-white/20" size="sm" asChild>
                    <Link href="/contact?usecase=research">Explore Research Agent</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Ops Automations</h4>
                  <p className="text-sm text-white/90">
                    Tag, route, and summarize routine updates. Fewer manual updates and cleaner handoffs.
                  </p>
                  <Button variant="outline" className="mt-3 border-white text-white hover:bg-white/20" size="sm" asChild>
                    <Link href="/contact?usecase=ops">Explore Ops Automator</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Tools - A la Carte */}
      <section className="bg-slate-900/30 py-16">
        <div className="container">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-400">
              INDIVIDUAL TOOLS (If They Insist)
            </Badge>
            <h3 className="text-3xl font-semibold text-white">
              A la Carte Pricing When You Only Need One Piece
            </h3>
            <p className="mt-4 text-lg text-slate-400">
              We still recommend starting with a bundle for faster ROI, but here's the updated pricing when a single
              tool is all you need.
            </p>
          </div>

          <Card className="overflow-hidden border-2 border-dashed border-sky-500/40 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800/50">
                    <TableHead className="text-slate-300">Tool</TableHead>
                    <TableHead className="text-slate-300">What&apos;s Included</TableHead>
                    <TableHead className="text-right text-slate-300">New Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualTools.map((tool) => (
                    <TableRow key={tool.name} className="border-white/10">
                      <TableCell className="font-semibold text-white">{tool.name}</TableCell>
                      <TableCell className="text-slate-400">{tool.coverage}</TableCell>
                      <TableCell className="text-right font-semibold text-sky-400">
                        {tool.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="px-6 pb-6 text-left text-slate-500">
                  Bundle later without penalty. We credit your first month if you upgrade to a package within 60 days.
                </TableCaption>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-dashed border-sky-500/40 p-6 text-left sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Not sure which path to take? We&apos;ll map ROI during a 15-minute strategy call.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white"
              >
                <Link href="/contact">Book a Quick Call</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Custom Packages */}
      <section className="py-16 bg-slate-900/50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-sky-500 text-white hover:bg-sky-400">
                Custom Solutions
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">
                Need Something Custom?
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                We can build exactly what you need, tailored to your business processes and workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {customPackages.map((pkg) => (
                <Card key={pkg.name} className="border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-500/50 transition-all shadow-md">
                  <CardHeader>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-sky-400">{pkg.tagline}</span>
                    </div>
                    <CardTitle className="text-2xl mb-2 text-white">{pkg.name}</CardTitle>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-sky-400">
                        ${pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        + ${pkg.monthlyFee}/month • {pkg.timeline}
                      </div>
                    </div>
                    <CardDescription className="text-slate-400">{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-sky-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-sky-500 hover:bg-sky-400 text-white" size="lg" asChild>
                      <a href={pkg.checkoutUrl} target="_blank" rel="noopener noreferrer">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-sky-900/50 to-slate-900 text-white border border-sky-500/30 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-sky-400" />
                  <h3 className="text-2xl font-bold">Enterprise & Complex Projects</h3>
                </div>
                <p className="mb-4 text-slate-300">
                  Multi-location operations, franchises, or need something truly unique? We build custom enterprise solutions starting at $25,000.
                </p>
                <p className="mb-6 text-slate-300">
                  Includes dedicated development team, unlimited users, white-label options, and 24/7 support.
                </p>
                <Button className="bg-sky-500 text-white hover:bg-sky-400" size="lg" asChild>
                  <Link href="/contact">
                    Let's Talk About Your Needs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SolutionsCTA />
    </div>
  )
}
