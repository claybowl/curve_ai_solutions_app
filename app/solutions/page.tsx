import Link from "next/link"
import { getToolsByCategory } from "@/app/actions/tool-actions"
import { SolutionsHero } from "@/components/solutions-hero"
import { SolutionsCategory } from "@/components/solutions-category"
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
import { Bot, BarChart, LineChart, Workflow, Code, Zap, Shield, Building, Rocket, Layers, Gem } from "lucide-react"

export const metadata = {
  title: "Curve AI Solutions Breakdown | Curve AI",
  description: "Explore our comprehensive suite of AI agent infrastructure solutions - from agent development to industry-specific implementations.",
}

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
    headline: "Launch-ready SaaS for home & field service teams",
    price: "From $49/mo",
    description:
      "Plug-and-play AI operating system for crews that need bookings, follow-up, and payments handled automatically.",
    features: [
      "AI receptionist with memory plus SMS and email follow-up",
      "Bookings, CRM, invoices, and reviews in one dashboard",
      "Fast setup with onboarding from our Tulsa implementation crew",
    ],
    href: "/products#servicepro",
    badge: "Most Popular",
    highlight: true,
    cta: "Explore ServicePro",
    icon: Rocket,
  },
  {
    id: "quick-close",
    name: "Quick Close Package",
    headline: "48-hour done-for-you digital transformation",
    price: "$1,299 one-time",
    description:
      "Website, AI, booking, and analytics delivered in two days for solo operators and lean teams ready to scale.",
    features: [
      "5-page SEO-friendly site with secure hosting included",
      "AI sales assistant with booking + customer database",
      "Launch playbook, training, and 30 days of post-go-live support",
    ],
    href: "/products",
    badge: "48-Hour Delivery",
    highlight: false,
    cta: "See Quick Close Details",
    icon: Layers,
  },
  {
    id: "custom-builds",
    name: "Custom AI Ops & Agents",
    headline: "Tailored automations for complex workflows",
    price: "Custom engagements",
    description:
      "Strategic discovery, secure infrastructure, and dedicated engineers building agents, data pipelines, and integrations that match your ops.",
    features: [
      "Workflow mapping, ROI modeling, and compliance reviews",
      "Dedicated Curve AI engineering pod with weekly milestones",
      "Integrations with CRMs, ERPs, and proprietary systems",
    ],
    href: "/products#custom",
    badge: "Best for Complex Teams",
    highlight: false,
    cta: "Start a Custom Scope",
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

export default async function SolutionsPage() {
  const toolsByCategory = await getToolsByCategory()

  const categoryIconMap = {
    Bot,
    BarChart,
    LineChart,
    Workflow,
    Code,
    Zap,
    Shield,
    Building,
  }

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
                  {bundle.badge ? (
                    <Badge className="absolute right-4 top-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
                      {bundle.badge}
                    </Badge>
                  ) : null}

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

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="mb-16 flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-center text-[#1A365D] dark:text-blue-300">
              Curve AI Solutions Breakdown
            </h2>
            <p className="mx-auto max-w-4xl text-center text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              Prefer to explore capabilities individually? Browse the full catalog of agents, automations, and industry
              accelerators below.
            </p>
          </div>

          <div className="mb-16 overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-3 pb-2">
              {toolsByCategory.map((category) => {
                const IconComponent = categoryIconMap[category.icon as keyof typeof categoryIconMap] || Bot

                return (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-white transition-colors hover:saturate-150 ${category.color}`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="hidden md:inline">{category.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="space-y-32">
            {toolsByCategory.map((category) => (
              <SolutionsCategory
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                tools={category.tools}
                color={category.color}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      </section>

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

      <SolutionsCTA />
    </div>
  )
}
