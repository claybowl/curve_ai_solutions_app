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
import { Shield, Rocket, Layers, Gem, Check, ArrowRight, BookOpen, Zap, MessageSquare, FileText, Search, Briefcase, Cpu, Database } from "lucide-react"

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
    highlight: true,
    cta: "Explore ServicePro",
    icon: Rocket,
  },
  {
    id: "aigency-suite",
    name: "AiGency Suite",
    headline: "Complete AI platform: Knowledge, Workbench & Automation",
    price: "Package Pricing Available",
    description:
      "Three powerful platforms that work seamlessly together: Knowledge Studio for learning and exploration, AiGency Workbench for agent creation and management, and AiPex Platform for workflow automation. Share knowledge, deploy agents, and automate processes all in one integrated ecosystem.",
    features: [
      "Knowledge Studio: Learn, explore, and access AI capabilities with our comprehensive knowledge platform",
      "AiGency Workbench: Design, deploy, and manage AI agents with visual tools and lifecycle management",
      "AiPex Platform: Automate workflows and orchestrate processes across your entire business",
      "Seamless integration: Knowledge flows into agents, agents deploy to workflows, workflows feed insights back to knowledge",
      "Unified authentication and data sharing across all three platforms",
      "Single dashboard to monitor and manage your entire AI ecosystem",
    ],
    href: "/solutions#aigency-suite",
    highlight: false,
    cta: "Explore AiGency Suite",
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

type IndividualTool = {
  name: string
  coverage: string
  price: string
}

const individualTools: IndividualTool[] = [
  {
    name: "AI Chatbot",
    coverage: "24/7 lead capture, FAQs, warm hand-offs to your team",
    price: "$49/mo or $499/yr",
  },
  {
    name: "Booking System",
    coverage: "Self-serve scheduling, reminders, calendar sync, deposits",
    price: "$39/mo or $399/yr",
  },
  {
    name: "Simple CRM",
    coverage: "Pipeline tracking, customer notes, follow-up sequences",
    price: "$59/mo or $599/yr",
  },
  {
    name: "Analytics",
    coverage: "Dashboards for leads, bookings, revenue, and campaign ROI",
    price: "$29/mo or $299/yr",
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
    name: "Professional Custom",
    tagline: "Full Custom Build",
    price: 8500,
    monthlyFee: 199,
    timeline: "4-6 weeks",
    description: "Complete custom implementation with advanced features",
    features: [
      "Full custom CRM",
      "Advanced automation",
      "Custom integrations",
      "Team training",
      "90-day support",
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
    name: "Donjon Starter",
    tagline: "Get Smart, Fast",
    price: "$149/mo",
    bestFor: "Solo operators and small teams getting their first AI lift",
    description: "Get started with AI-powered knowledge and Q&A for your documents. Perfect for teams who want faster answers without the complexity.",
    features: [
      "Donjon Knowledge Studio Lite",
      "Upload up to 1 GB of docs",
      "Smart Q&A with semantic search",
      "1 specialty agent template",
      "Email support",
    ],
    outcomes: [
      "Faster answers from your own docs",
      "Fewer repeat questions and context-hunting",
    ],
    cta: "Start 14-day trial",
    ctaLink: "https://buy.stripe.com/6oU4gzbFzaIuaubaFO7AI0q",
    highlight: false,
    icon: BookOpen,
  },
  {
    id: "donjon-pro",
    name: "Donjon Pro",
    tagline: "Agents That Do Real Work",
    price: "$399/mo",
    bestFor: "Growing teams who want automation, not just answers",
    description: "Move beyond Q&A to actual automation. Deploy agents that draft, summarize, and update—giving your team hours back each week.",
    features: [
      "Everything in Starter",
      "10 GB data ingestion",
      "3 specialty agents with workflow actions",
      "Shared collections and saved prompts",
      "Analytics dashboard (accuracy, usage)",
      "Priority support",
    ],
    outcomes: [
      "Drafts, summaries, and updates done on autopilot",
      "Team-wide knowledge reuse",
    ],
    cta: "See it on your data",
    ctaLink: "https://buy.stripe.com/cNi00jbFzbMycCjeW47AI0r",
    highlight: true,
    icon: Zap,
  },
  {
    id: "donjon-business",
    name: "Donjon Business",
    tagline: "Knowledge + Ops Automation",
    price: "$899/mo",
    bestFor: "SMBs with processes to automate across teams",
    description: "Complete automation platform with integrations and multi-agent orchestration. Automate workflows across your entire organization.",
    features: [
      "Everything in Pro",
      "100 GB data ingestion",
      "Multi-agent orchestration",
      "Integrations: Gmail, Slack, GDrive, Notion, Webhooks",
      "Role-based access, audit log",
      "Guided setup with our team",
    ],
    outcomes: [
      "Hours back each week across support, ops, and research",
      "Consistent outputs with traceability",
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

// Donjon Product Modules
type DonjonModule = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  outcomes: string[]
  cta: string
  ctaLink: string
  icon: LucideIcon
}

const donjonModules: DonjonModule[] = [
  {
    id: "qa-console",
    name: "Donjon Q&A Console",
    price: "$99/mo",
    description: "A secure AI answer box trained on your docs. Perfect for adding instant answers to your website or internal knowledge base.",
    features: [
      "1 GB ingestion",
      "Semantic search + citations",
      "Web widget embed",
      "Email support",
    ],
    outcomes: [
      "Instant answers from your own content",
      "Fewer repetitive questions to your team",
    ],
    cta: "Add to site in 10 minutes",
    ctaLink: "https://buy.stripe.com/eVq28r9xr4k67hZaFO7AI0u",
    icon: MessageSquare,
  },
  {
    id: "knowledge-studio",
    name: "Donjon Knowledge Studio",
    price: "$249/mo",
    description: "Turn files and links into an intelligent, searchable knowledge base. Build a central source of truth for your team.",
    features: [
      "10 GB ingestion",
      "Collections, tags, saved answers",
      "Source upload: PDF, DOCX, URLs",
      "Versioning and change tracking",
    ],
    outcomes: [
      "Fast research and drafting",
      "Team-wide knowledge reuse",
    ],
    cta: "Start a free workspace",
    ctaLink: "https://buy.stripe.com/5kQ7sLaBv17U59R15e7AI0v",
    icon: Database,
  },
  {
    id: "support-copilot",
    name: "Donjon Support Copilot",
    price: "$349/mo",
    description: "An AI teammate that answers customer questions from your policies and help docs. Reduce support ticket volume and improve response times.",
    features: [
      "Help Center sync",
      "Tone controls and response limits",
      "Suggested replies for agents",
      "Conversation analytics",
    ],
    outcomes: [
      "Faster first response time",
      "Higher self-service rate",
    ],
    cta: "Connect your help docs",
    ctaLink: "https://buy.stripe.com/6oUdR93935oa6dV15e7AI0w",
    icon: MessageSquare,
  },
  {
    id: "sales-writer",
    name: "Donjon Sales Writer",
    price: "$299/mo",
    description: "An AI content partner for outbound and follow-ups. Generate personalized sequences and consistent messaging at scale.",
    features: [
      "First-line personalization from public signals",
      "Snippet and reply drafting",
      "Case study generator from your notes",
      "A/B subject testing dashboard",
    ],
    outcomes: [
      "More replies and tighter follow-through",
      "Consistent tone and message control",
    ],
    cta: "Generate your first sequence",
    ctaLink: "https://buy.stripe.com/00w9ATfVPcQC0TB6py7AI0x",
    icon: FileText,
  },
  {
    id: "research-agent",
    name: "Donjon Research Agent",
    price: "$399/mo",
    description: "Deep-dive synthesis across PDFs, web pages, and notes. Surface relationships and insights across your research materials.",
    features: [
      "Multi-doc compare and summarize",
      "Relationship discovery across sources",
      "Export to brief or slide outline",
      "Inline citations",
    ],
    outcomes: [
      "Hours saved on literature and market reviews",
      "Clear, defensible summaries",
    ],
    cta: "Run a research brief",
    ctaLink: "https://buy.stripe.com/eVq6oH7pjeYKcCj4hq7AI0y",
    icon: Search,
  },
  {
    id: "ops-automator",
    name: "Donjon Ops Automator",
    price: "$449/mo",
    description: "Triggered agents that tag, route, summarize, and update systems. Automate routine workflows and handoffs between teams.",
    features: [
      "Email and webhook triggers",
      "Integrations: Gmail, Slack, Google Drive, Notion",
      "Policy-based actions and guardrails",
      "Run history and audit trail",
    ],
    outcomes: [
      "Fewer manual updates",
      "Cleaner, faster handoffs",
    ],
    cta: "Automate your first workflow",
    ctaLink: "https://buy.stripe.com/9B600j8tn2bY1XFeW47AI0z",
    icon: Zap,
  },
  {
    id: "private-edge",
    name: "Donjon Private Edge",
    price: "$1,250/mo + setup",
    description: "A private deployment of Donjon for security-sensitive teams. Self-hosted or VPC deployment with enterprise controls.",
    features: [
      "Self-host or VPC",
      "SSO and role-based access",
      "Data residency options",
      "Dedicated success engineer",
    ],
    outcomes: [
      "Enterprise control with the same Donjon experience",
    ],
    cta: "Request a technical scoping",
    ctaLink: "https://buy.stripe.com/bJe6oH4d7dUGgSzg087AI0A",
    icon: Cpu,
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
    <div className="min-h-screen">
      <SolutionsHero />

      <section className="py-20 bg-gradient-to-br from-[#0D1F36] via-[#1A365D] to-[#004599] text-white">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">Bundles First</Badge>
            <h2 className="text-4xl font-bold mb-4">Start with the Package That Fits</h2>
            <p className="text-lg text-white/80">
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
                  className={`relative flex h-full flex-col border-2 bg-white text-slate-900 shadow-xl dark:bg-slate-900 dark:text-gray-100 ${
                    bundle.highlight
                      ? "border-[#3F8CFF] shadow-[#3F8CFF]/20"
                      : "border-white/40 dark:border-slate-700/80"
                  }`}
                >
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1FF] text-[#1A365D] dark:bg-[#1A365D] dark:text-white">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-base font-semibold text-[#1A365D] dark:text-blue-200">{bundle.price}</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold text-[#1A365D] dark:text-blue-100">
                        {bundle.name}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        {bundle.headline}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 pt-0">
                    <p className="text-gray-600 dark:text-gray-300">{bundle.description}</p>
                    <ul className="space-y-3">
                      {bundle.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#0076FF]" aria-hidden />
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
                          ? "bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90"
                          : "bg-[#1A365D] text-white hover:bg-[#1A365D]/90 dark:bg-[#3F8CFF] dark:hover:bg-[#3F8CFF]/90"
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

      {/* Donjon Intelligence Systems Breakdown */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="mb-16 flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-center text-[#1A365D] dark:text-blue-300">
              Donjon Intelligence Systems Breakdown
            </h2>
            <p className="mx-auto max-w-4xl text-center text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Complete AI platform with subscription tiers, standalone modules, and add-ons. Choose the right combination for your team's needs.
            </p>
          </div>

          {/* Donjon Tiers */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
                Subscription Tiers
              </Badge>
              <h3 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Choose Your Donjon Plan
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                From getting started to enterprise scale, find the plan that fits your team's AI needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {donjonTiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <Card
                    key={tier.id}
                    className={`flex flex-col border-2 ${
                      tier.highlight
                        ? "border-[#FF7F00] shadow-xl shadow-[#FF7F00]/20 scale-105 relative"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#0076FF]/50"
                    } transition-all duration-300 hover:shadow-lg`}
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-[#FF7F00] text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#1A365D] dark:bg-[#1A365D] dark:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tier.tagline}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2 text-[#1A365D] dark:text-blue-100">
                        {tier.name}
                      </CardTitle>
                      <div className="mb-3">
                        <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300">
                          {tier.price}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {tier.bestFor}
                        </p>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#1A365D] dark:text-blue-200 mb-2 text-sm">What's included:</h4>
                        <ul className="space-y-2">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-lg border border-[#0076FF]/20">
                        <h4 className="font-semibold text-[#1A365D] dark:text-blue-200 mb-2 text-sm">Outcomes:</h4>
                        <ul className="space-y-1">
                          {tier.outcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-200">
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
                            ? "bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                            : "bg-[#1A365D] hover:bg-[#1A365D]/90 dark:bg-[#0076FF] dark:hover:bg-[#0076FF]/90"
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

          {/* Donjon Modules */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#0076FF] text-white hover:bg-[#0076FF]/90">
                Standalone Modules
              </Badge>
              <h3 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Product Modules & Add-Ons
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Mix and match modules to build your perfect AI stack. Each module works standalone or integrates with Donjon tiers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {donjonModules.map((module) => {
                const Icon = module.icon
                return (
                  <Card
                    key={module.id}
                    className="flex flex-col border-2 border-gray-200 dark:border-gray-700 hover:border-[#0076FF]/50 transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#1A365D] dark:bg-[#1A365D] dark:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#1A365D] dark:text-blue-300">
                            {module.price}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2 text-[#1A365D] dark:text-blue-100">
                        {module.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div>
                        <h4 className="font-semibold text-[#1A365D] dark:text-blue-200 mb-2 text-xs">Includes:</h4>
                        <ul className="space-y-1.5">
                          {module.features.map((feature, i) => (
                            <li key={i} className="flex items-start text-xs">
                              <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-gray-800 p-2 rounded border border-[#0076FF]/20">
                        <h4 className="font-semibold text-[#1A365D] dark:text-blue-200 mb-1 text-xs">Outcomes:</h4>
                        <ul className="space-y-1">
                          {module.outcomes.map((outcome, i) => (
                            <li key={i} className="text-xs text-gray-700 dark:text-gray-200">
                              • {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white"
                        size="sm"
                        asChild
                      >
                        <Link href={module.ctaLink}>{module.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-[#1A365D] text-white hover:bg-[#1A365D]/90 dark:bg-[#0076FF] dark:hover:bg-[#0076FF]/90">
                Add-Ons
              </Badge>
              <h3 className="text-2xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Enhance Your Donjon Stack
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Extend functionality with add-ons for capacity, customization, and premium support.
              </p>
            </div>

            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addons.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-200">{addon.name}</span>
                      <Badge variant="outline" className="text-xs font-semibold text-[#FF7F00] border-[#FF7F00]">
                        {addon.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Use Cases */}
          <div className="bg-gradient-to-br from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] rounded-2xl p-8 text-white">
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
      <section className="bg-slate-100 py-16 dark:bg-slate-900/40">
        <div className="container">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <Badge className="mb-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
              INDIVIDUAL TOOLS (If They Insist)
            </Badge>
            <h3 className="text-3xl font-semibold text-[#1A365D] dark:text-blue-200">
              A la Carte Pricing When You Only Need One Piece
            </h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We still recommend starting with a bundle for faster ROI, but here's the updated pricing when a single
              tool is all you need.
            </p>
          </div>

          <Card className="overflow-hidden border-2 border-dashed border-[#FF7F00]/40 bg-white dark:border-[#FF7F00]/60 dark:bg-slate-950/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-900">
                    <TableHead>Tool</TableHead>
                    <TableHead>What&apos;s Included</TableHead>
                    <TableHead className="text-right">New Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualTools.map((tool) => (
                    <TableRow key={tool.name}>
                      <TableCell className="font-semibold text-[#1A365D] dark:text-blue-100">{tool.name}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{tool.coverage}</TableCell>
                      <TableCell className="text-right font-semibold text-[#FF7F00] dark:text-[#FFB347]">
                        {tool.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="px-6 pb-6 text-left text-gray-500 dark:text-gray-400">
                  Bundle later without penalty. We credit your first month if you upgrade to a package within 60 days.
                </TableCaption>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-dashed border-[#FF7F00]/40 p-6 text-left sm:flex-row sm:items-center sm:justify-between dark:border-[#FF7F00]/60">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Not sure which path to take? We&apos;ll map ROI during a 15-minute strategy call.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-[#FF7F00] text-[#FF7F00] hover:bg-[#FF7F00] hover:text-white dark:border-[#FFB347] dark:text-[#FFB347] dark:hover:bg-[#FFB347] dark:hover:text-slate-950"
              >
                <Link href="/contact">Book a Quick Call</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Custom Packages */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#1A365D] text-white hover:bg-[#1A365D]/90 dark:bg-[#0076FF] dark:hover:bg-[#0076FF]/90">
                Custom Solutions
              </Badge>
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Need Something Custom?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We can build exactly what you need, tailored to your business processes and workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {customPackages.map((pkg) => (
                <Card key={pkg.name} className="border-2 border-gray-200 dark:border-gray-700 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all shadow-md">
                  <CardHeader>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-[#0076FF] dark:text-blue-400">{pkg.tagline}</span>
                    </div>
                    <CardTitle className="text-2xl mb-2 text-[#1A365D] dark:text-blue-100">{pkg.name}</CardTitle>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300">
                        ${pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        + ${pkg.monthlyFee}/month • {pkg.timeline}
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" size="lg" asChild>
                      <a href={pkg.checkoutUrl} target="_blank" rel="noopener noreferrer">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Enterprise & Complex Projects</h3>
                </div>
                <p className="mb-4 text-white/90">
                  Multi-location operations, franchises, or need something truly unique? We build custom enterprise solutions starting at $25,000.
                </p>
                <p className="mb-6 text-white/90">
                  Includes dedicated development team, unlimited users, white-label options, and 24/7 support.
                </p>
                <Button className="bg-white text-[#0076FF] hover:bg-gray-100" size="lg" asChild>
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
