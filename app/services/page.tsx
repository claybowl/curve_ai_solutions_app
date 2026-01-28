import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Workflow, ShoppingCart, Building2, Wrench, Zap, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Services - A La Carte & Custom Solutions | Donjon Systems",
  description: "Pre-built Automation Workflow templates, a la carte services, and custom enterprise solutions.",
}

const workflowTemplates = [
  {
    name: "Lead Qualification Workflow",
    description: "Automatically qualify incoming leads, enrich data, and route to appropriate sales workflows.",
    price: "$299",
    features: ["CRM Integration", "Email Automation", "Lead Scoring", "Slack Notifications"],
  },
  {
    name: "Customer Support Workflow",
    description: "Automated support workflow that handles common queries and escalates complex issues.",
    price: "$399",
    features: ["Ticket Creation", "FAQ Handling", "Smart Routing", "Human Handoff"],
  },
  {
    name: "Content Pipeline",
    description: "Automate content creation, scheduling, and distribution across multiple channels.",
    price: "$349",
    features: ["Smart Content Generation", "Social Scheduling", "SEO Optimization", "Analytics Tracking"],
  },
  {
    name: "Data Sync Orchestrator",
    description: "Keep your systems in sync with intelligent data flow management and conflict resolution.",
    price: "$249",
    features: ["Multi-platform Sync", "Error Handling", "Audit Logging", "Scheduled Runs"],
  },
]

const alaCarteServices = [
  {
    name: "Automation Workflow Development",
    description: "Custom workflow automation built to your specifications.",
    price: "From $500",
    icon: Workflow,
  },
  {
    name: "API Integration",
    description: "Connect your tools and services with robust, reliable integrations.",
    price: "From $300",
    icon: Zap,
  },
  {
    name: "Database Design",
    description: "Schema design, optimization, and migration services.",
    price: "From $400",
    icon: Wrench,
  },
  {
    name: "E-Commerce Setup",
    description: "Full e-commerce store setup with payment processing and inventory management.",
    price: "From $1,500",
    icon: ShoppingCart,
  },
]

const enterpriseFeatures = [
  "Dedicated project manager",
  "Custom SLA agreements",
  "Priority support channel",
  "On-call availability",
  "Security compliance review",
  "Performance optimization",
  "Training & documentation",
  "Ongoing maintenance",
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 ambient-bg opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Wrench className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-mono text-amber-400">SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6">
              Build What You Need
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              From pre-built automation templates to fully custom enterprise solutions.
              Pick what fits your needs and budget.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Workflow className="h-6 w-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-slate-50">Pre-Built Automation Workflows</h2>
            <div className="neon-line flex-1" />
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Production-ready automation workflows you can deploy immediately. Each template includes
            setup documentation, customization guide, and 30 days of support.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {workflowTemplates.map((template) => (
              <Card key={template.name} className="glass-panel border-white/10 hover:border-sky-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-sky-400">{template.name}</CardTitle>
                    <span className="text-2xl font-bold text-slate-50">{template.price}</span>
                  </div>
                  <CardContent className="text-slate-400 p-0 mb-4">
                    {template.description}
                  </CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span key={feature} className="text-xs font-mono px-2 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Zap className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-slate-50">A La Carte Services</h2>
            <div className="neon-line flex-1" />
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Need something specific? Pick individual services and pay only for what you need.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {alaCarteServices.map((service) => (
              <Card key={service.name} className="glass-panel border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-emerald-400 text-lg mb-2">{service.name}</CardTitle>
                  <CardContent className="text-slate-400 p-0 text-sm mb-4">
                    {service.description}
                  </CardContent>
                  <div className="text-xl font-bold text-slate-50">{service.price}</div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Building2 className="h-6 w-6 text-violet-400" />
            <h2 className="text-2xl font-bold text-slate-50">Custom & Enterprise Solutions</h2>
            <div className="neon-line flex-1" />
          </div>
          <div className="glass-panel border-white/10 p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-50 mb-4">
                  Complex projects deserve dedicated attention
                </h3>
                <p className="text-slate-400 mb-6">
                  For large-scale implementations, multi-system integrations, or projects requiring
                  ongoing collaboration, let's scope a custom engagement that fits your needs.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {enterpriseFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-mono text-violet-400 mb-2">CUSTOM PRICING</div>
                <div className="text-4xl font-bold text-slate-50 mb-4">Let's Talk</div>
                <p className="text-slate-400 mb-6">
                  Every enterprise project is unique. Get a custom quote based on your specific requirements.
                </p>
                <Button
                  size="lg"
                  className="bg-violet-500 hover:bg-violet-400 text-black font-bold"
                  asChild
                >
                  <Link href="/consultation">
                    Schedule Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/20 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Not Sure What You Need?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Book a free consultation and we'll figure out the best solution together.
          </p>
          <Button
            size="lg"
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold"
            asChild
          >
            <Link href="/consultation">Get Free Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
