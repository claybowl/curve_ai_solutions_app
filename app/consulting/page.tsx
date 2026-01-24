import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Code2, Database, Zap, Workflow, Terminal, GitBranch, Rocket, Users, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Consulting Services | Donjon Systems",
  description: "Expert AI consulting, platform development, and workflow automation services.",
}

const services = [
  {
    icon: Code2,
    title: "Platform Architecture & Development",
    description: "Full-stack development of custom AI platforms, web applications, and automation systems using Next.js, Supabase, Neon PostgreSQL, and modern frontend frameworks.",
  },
  {
    icon: Database,
    title: "Database Design & Integration",
    description: "Schema design, migration planning, and API integration for PostgreSQL and NoSQL databases with performance optimization and security best practices.",
  },
  {
    icon: Workflow,
    title: "AI Workflow Automation",
    description: "End-to-end automation using n8n, custom AI agents, and intelligent workflow orchestration to streamline business processes and reduce manual overhead.",
  },
  {
    icon: Terminal,
    title: "Server-Side Engineering",
    description: "Server actions, API development, and backend systems with TypeScript, Node.js, and enterprise-grade security patterns.",
  },
  {
    icon: GitBranch,
    title: "Mentorship & Code Review",
    description: "Technical guidance for development teams, code reviews, architecture planning, and implementation best practices.",
  },
]

const skills = [
  {
    category: "Core Technologies",
    items: ["Next.js 14/15", "TypeScript", "Supabase Auth", "Neon PostgreSQL", "n8n Workflows", "React 18+", "Tailwind CSS", "Zod Validation"],
  },
  {
    category: "AI & Automation",
    items: ["AI Agents (OpenAI, Anthropic, XAI)", "Prompt Engineering", "RAG & Vector Embeddings", "Custom LLM Integration", "n8n Orchestration"],
  },
  {
    category: "Backend & Infrastructure",
    items: ["PostgreSQL & NoSQL", "REST & GraphQL APIs", "Server Actions", "Middleware & Security", "Performance Optimization"],
  },
  {
    category: "Integration & Services",
    items: ["Stripe Integration", "Vercel Deployment", "GitHub Actions CI/CD", "Third-party APIs", "Email & Notifications (SendGrid/Resend)"],
  },
]

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 ambient-bg opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 mb-6">
              <Terminal className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-mono text-sky-400">EXPERT CONSULTING</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6">
              Strategic AI & Automation Consulting
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Expert guidance for building AI-powered platforms, automation systems, and intelligent workflows.
              Transform your ideas into production-ready solutions with enterprise-grade architecture.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all duration-300"
                asChild
              >
                <Link href="/consultation">Book Consultation</Link>
              </Button>
              <Button
                variant="outline"
                className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Services</h2>
            <div className="neon-line mx-auto w-24" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="glass-panel border-white/10 hover:border-sky-500/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-6 w-6 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sky-400 mb-2">{service.title}</CardTitle>
                    <CardContent className="text-slate-400">
                      {service.description}
                    </CardContent>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Expertise & Skills</h2>
            <div className="neon-line mx-auto w-24" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="text-sm font-mono text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {skillGroup.category}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {skillGroup.items.map((skill, itemIndex) => (
                    <div
                      key={`${groupIndex}-${itemIndex}`}
                      className="glass-panel-solid border-white/10 p-3 rounded-lg hover:border-sky-500/30 transition-all duration-300"
                    >
                      <span className="text-slate-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel border-white/10 p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-50 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-slate-400 mb-6">
                  No hidden fees. No long-term contracts. Just expert help when you need it.
                </p>
                <div className="mb-6">
                  <div className="text-6xl font-bold text-sky-400 mb-2">$85</div>
                  <div className="text-sm text-slate-400">per hour</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-300">Flexible Engagement</div>
                      <div className="text-sm text-slate-400">Book by the hour, project-based, or retainer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-300">No Obligation</div>
                      <div className="text-sm text-slate-400">Free initial consultation for qualified projects</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-300">Expert Results</div>
                      <div className="text-sm text-slate-400">Production-ready, scalable, and maintainable</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-slate-50 mb-4">Why Choose This Approach?</h3>
                <p className="text-slate-400 mb-6">
                  Technical expertise combined with practical business understanding. I don't just write code—I
                  understand your objectives, timeline, and constraints to deliver solutions that actually work for your business.
                </p>
                <Button
                  size="lg"
                  className="bg-sky-500 hover:bg-sky-400 text-black font-bold w-full"
                  asChild
                >
                  <Link href="/consultation">Schedule Your Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/20 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Let's build something amazing together
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-400 text-black font-bold"
              asChild
            >
              <Link href="/consultation">Book Consultation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10"
              asChild
            >
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
