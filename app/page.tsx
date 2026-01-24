import Link from "next/link"
import { 
  ArrowRight, 
  BarChart2, 
  Check, 
  Shield, 
  Database, 
  Zap, 
  Calendar,
  Sparkles,
  Rocket,
  Brain,
  Code2,
  LineChart,
  MessageSquare,
  ShoppingCart,
  Building2,
  Lightbulb,
  Workflow,
  Users,
  Target,
  TrendingUp,
  QrCode,
  Heart,
  Star,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/donjon/project-card"
import { GlassCard } from "@/components/donjon/glass-card"
import { SectionDivider } from "@/components/donjon/section-divider"
import { 
  FloatingShapes, 
  SectionSeparator, 
  QuoteIcon, 
  StarRating, 
  GlowBorder,
  GradientMesh,
  GridPattern,
  CircuitPattern
} from "@/components/donjon/decorative-elements"

const productIcons: Record<string, typeof Rocket> = {
  "K8 (Communik8)": MessageSquare,
  "ServicePro AI": Rocket,
  "Vibe Native": Sparkles,
}

const productCategories: Record<string, string> = {
  "K8 (Communik8)": "Communication",
  "ServicePro AI": "Business Platform",
  "Vibe Native": "AI Studio",
}

const featuredProducts = [
  {
    name: "K8 (Communik8)",
    tagline: "Privacy-first AI communication bridge with ephemeral sessions",
    href: "https://im-k8.lovable.app/",
  },
  {
    name: "ServicePro AI",
    tagline: "Complete digital transformation for service businesses in 48 hours",
    href: "/products#servicepro",
  },
  {
    name: "Vibe Native",
    tagline: "Comprehensive AI Studio Suite with 15+ integrated tools",
    href: "https://vibenative.studio/",
  },
]

export default function Home() {
  return (
    <main className="bg-[#030712] min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6 overflow-hidden">
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-indigo-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <FloatingShapes />
        
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 animate-fade-up">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span className="fira-label tracking-[0.3em] uppercase text-slate-400">
              AI Solutions for Tulsa Businesses
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight leading-tight animate-fade-up delay-100 text-white">
            Grow Your Business{" "}
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400 animate-gradient">
              With AI That Works
            </span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-up delay-200">
            We help small and medium businesses in the Tulsa metro area{" "}
            <span className="text-sky-400/80">save time</span>,{" "}
            <span className="text-indigo-400/80">close more deals</span>, and{" "}
            <span className="text-emerald-400/80">run smoother operations</span> — with AI tools built for how you actually work.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up delay-300">
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-emerald-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">48-Hour Setup</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-sky-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse animation-delay-1000" />
              <span className="text-xs text-slate-300 font-mono">Local Support</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-indigo-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse animation-delay-2000" />
              <span className="text-xs text-slate-300 font-mono">Packages from $1,299</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-up delay-400">
            <Link href="/solutions" className="btn-primary group">
              <Rocket className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Solutions & Products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/consultation" className="btn-ghost group">
              <Calendar className="h-4 w-4" />
              Schedule Consultation
            </Link>
            <Link href="/login" className="btn-ghost group border-sky-500/30 hover:border-sky-400/50 hover:bg-sky-500/10">
              <Shield className="h-4 w-4 text-sky-400" />
              <span className="text-sky-400">Log In</span>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="w-full py-12 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Customer Site Template</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono border border-emerald-500/20">
                  Available
                </span>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-md bg-sky-500/10 border border-sky-500/20">
                  <Calendar className="h-4 w-4 text-sky-400" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">New Agent Line-up</span>
                <span className="text-xs bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full font-mono border border-sky-500/20">
                  Coming Soon
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-sky-500 hover:bg-sky-400 text-black font-semibold group">
                <Link href="/template">
                  See Template
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Link href="/about">View Roadmap</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator variant="dots" />

      <section className="w-full py-24 relative overflow-hidden">
        <CircuitPattern className="opacity-[0.02]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-white/10">
              <Sparkles className="h-6 w-6 text-sky-400" />
            </div>
          </div>
          <SectionDivider title="Featured Products" className="mb-16" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const IconComponent = productIcons[product.name] || Rocket
              const category = productCategories[product.name] || "Solution"
              
              return (
                <GlassCard key={product.name} className="p-6 flex flex-col justify-between group" hover>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-lg bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-white/5 group-hover:border-sky-500/30 transition-colors">
                        <IconComponent className="h-5 w-5 text-sky-400" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-mono text-sky-400/70 bg-sky-400/5 px-2 py-1 rounded border border-sky-400/10">
                        {category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-sky-50 transition-colors">{product.name}</h3>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{product.tagline}</p>
                    </div>
                  </div>
                  <div className="pt-6 mt-auto">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-white/10 text-white hover:bg-white/5 hover:border-sky-500/30 group/btn"
                    >
                      <a href={product.href} target="_blank" rel="noopener noreferrer">
                        View Product
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      <SectionSeparator icon={<Zap className="h-5 w-5 text-sky-400" />} variant="gradient" />

      <section className="w-full py-24 relative overflow-hidden">
        <GradientMesh />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <GlowBorder color="sky">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="tech-tag tech-tag-sky flex items-center gap-1">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                    <span className="tech-tag tech-tag-emerald flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> New
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Digital Transformation{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Suite</span>
                  </h2>
                  <p className="text-lg text-slate-300">
                    Transform your local service business with AI-powered automation. Complete packages starting at{" "}
                    <span className="text-sky-400 font-semibold">$1,299</span>.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { text: "95% reduction in quote turnaround time", icon: TrendingUp },
                      { text: "25%+ increase in conversion rates", icon: Target },
                      { text: "30%+ improvement in revenue per lead", icon: LineChart },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-slate-300 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center mr-3 group-hover:bg-sky-500/20 transition-colors">
                          <item.icon className="h-4 w-4 text-sky-400" />
                        </div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold group" asChild>
                    <Link href="/products">
                      View Packages & Pricing
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                    <Link href="/consultation">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Consultation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </section>

      <SectionSeparator variant="dots" />

      <section className="w-full py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <GlassCard className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />
            <div className="p-8 relative">
              <div className="absolute top-4 right-4 opacity-10">
                <Brain className="h-32 w-32 text-sky-400" />
              </div>
              <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                    <Target className="h-5 w-5 text-sky-400" />
                  </div>
                </div>
                <span className="fira-label text-sky-400 block mb-2">Assessment</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  AI Readiness{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Assessment</span>
                </h2>
                <p className="text-slate-400 mt-2">Complete our comprehensive questionnaire</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    Why take the assessment?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Identify AI opportunities specific to your business",
                      "Receive a personalized implementation roadmap",
                      "Understand potential ROI and resource requirements",
                      "Get expert recommendations tailored to your industry",
                    ].map((text, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center mr-3 mt-0.5 group-hover:from-sky-500/30 group-hover:to-indigo-500/30 transition-colors">
                          <Check className="h-3 w-3 text-sky-400" />
                        </div>
                        <span className="text-slate-300">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-emerald-400" />
                    What you&apos;ll receive:
                  </h3>
                  <p className="text-slate-300">
                    A comprehensive report with actionable insights and a clear path forward for AI integration in your business.
                  </p>
                  <div className="pt-4">
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-black font-semibold group" asChild>
                      <Link href="/login">
                        Start Your Assessment
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <SectionSeparator icon={<Code2 className="h-5 w-5 text-emerald-400" />} variant="gradient" />

      <section className="w-full py-24 relative overflow-hidden">
        <CircuitPattern />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-white/10">
              <Code2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <SectionDivider title="What We Can Build" className="mb-4" />
          <p className="text-center text-slate-400 text-sm mb-12 max-w-2xl mx-auto">
            Beyond our packaged solutions, we build custom AI systems for unique challenges. Here&apos;s a sample of our capabilities.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProjectCard
              code="Integration"
              codeColor="text-sky-400"
              title="AI Agent Systems"
              description="Custom AI assistants that handle customer service, scheduling, and routine tasks automatically."
              tags={[
                { label: "Automation", color: "sky" },
                { label: "24/7", color: "emerald" },
              ]}
            />
            <ProjectCard
              code="Analytics"
              codeColor="text-emerald-400"
              title="Business Dashboards"
              description="See your sales, operations, and customer data in one place with real-time insights."
              tags={[
                { label: "Analytics", color: "emerald" },
                { label: "Reports", color: "sky" },
              ]}
            />
            <ProjectCard
              code="Platform"
              codeColor="text-indigo-400"
              title="Custom Web Apps"
              description="Customer portals, booking systems, and internal tools tailored to your workflow."
              tags={[
                { label: "Web Apps", color: "indigo" },
                { label: "Portals", color: "violet" },
              ]}
            />
            <ProjectCard
              code="Workflow"
              codeColor="text-violet-400"
              title="Process Automation"
              description="Connect your existing tools and automate repetitive tasks across your business."
              tags={[
                { label: "Workflow", color: "violet" },
                { label: "Integration", color: "amber" },
              ]}
            />
          </div>

          <div className="mt-16">
            <GlassCard className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">Have a unique challenge?</h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                We love building custom solutions for problems that don&apos;t fit in a box. Tell us what you&apos;re trying to solve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold group" asChild>
                  <Link href="/consultation">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Let&apos;s Talk
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 group" asChild>
                  <Link href="/solutions">
                    View All Solutions
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <SectionSeparator variant="dots" />

      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-white/10">
              <MessageSquare className="h-6 w-6 text-sky-400" />
            </div>
          </div>
          <SectionDivider title="Client Success Stories" className="mb-16" />

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Thorough and Professional",
                subtitle: "Service Business Owner",
                quote: "Wow, Clayton! Really an amazingly thorough outline. I can't wait to see everything implemented as we progress. Thank you for the excellent work and timely update!",
                author: "Jody Beeson",
                role: "Founder, Clean Machine Tulsa",
                initials: "JB",
                gradient: "from-sky-500 to-sky-400",
                avatarGradient: "from-sky-500 to-sky-600",
                rating: 5,
              },
              {
                title: "Finally, AI That Makes Sense",
                subtitle: "Local Retail Business",
                quote: "I was skeptical about AI, but the team explained everything in plain English. Now I have a chatbot handling customer questions 24/7 and it actually sounds like my business.",
                author: "Coming Soon",
                role: "Your testimonial here",
                initials: "?",
                gradient: "from-violet-500 to-violet-400",
                avatarGradient: "from-violet-500 to-violet-600",
                rating: 5,
                placeholder: true,
              },
              {
                title: "Saved Us Hours Every Week",
                subtitle: "Professional Services",
                quote: "The automation tools they built for our scheduling and follow-ups have given us back 10+ hours a week. That's time we now spend actually serving customers.",
                author: "Coming Soon",
                role: "Your testimonial here",
                initials: "?",
                gradient: "from-emerald-500 to-emerald-400",
                avatarGradient: "from-emerald-500 to-emerald-600",
                rating: 5,
                placeholder: true,
              },
            ].map((testimonial, i) => (
              <GlassCard key={i} className="overflow-hidden group" hover>
                <div className={`h-1.5 bg-gradient-to-r ${testimonial.gradient}`} />
                <div className="p-6 relative">
                  <QuoteIcon className="absolute top-4 right-4 text-white/5 w-16 h-16" />
                  <div className="relative z-10">
                    <StarRating rating={testimonial.rating} />
                    <h3 className="text-xl font-bold text-white mt-3 mb-2 group-hover:text-sky-50 transition-colors">
                      &ldquo;{testimonial.title}&rdquo;
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">{testimonial.subtitle}</p>
                    <p className="text-slate-300 italic mb-6 leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center pt-4 border-t border-white/5">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/10`}>
                        {testimonial.initials}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white text-sm">{testimonial.author}</p>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <SectionSeparator icon={<Shield className="h-5 w-5 text-indigo-400" />} variant="gradient" />

      <section className="w-full py-24 relative overflow-hidden">
        <GridPattern className="opacity-50" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10">
              <Building2 className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <SectionDivider title="About Donjon Intelligence" className="mb-16" />

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="text-xl text-slate-300 leading-relaxed">
                We&apos;re a Tulsa-based team that helps local businesses{" "}
                <span className="text-sky-400 font-medium">work smarter with AI</span>. No buzzwords, no complexity — just practical tools that save you time and help you grow.
              </p>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Our Philosophy
                </h3>
                <p className="text-slate-400">
                  <span className="text-white font-medium">Show results, not just promises.</span> We believe in transparent, data-driven solutions where you can see exactly what&apos;s working and why.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-sky-400" />
                  Our Approach
                </h3>
                <p className="text-slate-400">
                  We start by understanding your business, then build solutions that fit how you already work. Fast turnaround, ongoing support, and no tech jargon required.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Users,
                  iconColor: "text-sky-400",
                  bgColor: "bg-sky-500/10",
                  title: "Local Team",
                  description: "Based in Tulsa, we understand local businesses and provide hands-on support when you need it.",
                },
                {
                  icon: Zap,
                  iconColor: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                  title: "Fast Setup",
                  description: "Most solutions are up and running in 48 hours. No months-long implementations.",
                },
                {
                  icon: Shield,
                  iconColor: "text-indigo-400",
                  bgColor: "bg-indigo-500/10",
                  title: "Built to Last",
                  description: "We use proven, reliable technology so your tools keep working as your business grows.",
                },
                {
                  icon: BarChart2,
                  iconColor: "text-violet-400",
                  bgColor: "bg-violet-500/10",
                  title: "Clear Results",
                  description: "Track your ROI with dashboards that show exactly how AI is helping your bottom line.",
                },
              ].map((card, i) => (
                <GlassCard key={i} className="p-6 group" hover>
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{card.title}</h4>
                  <p className="text-sm text-slate-400">{card.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionSeparator variant="dots" />

      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-indigo-500/5" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10">
              <Heart className="h-6 w-6 text-pink-400" />
            </div>
          </div>
          <SectionDivider title="Partner With Us" className="mb-16" />

          <GlowBorder color="violet">
            <div className="p-8 md:p-12">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-sky-400" />
                    Join Our Growth Journey
                  </h2>
                  <p className="text-slate-300">
                    We&apos;re building the future of AI for local businesses. Looking for investors, advisors, and strategic partners who share our vision.
                  </p>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Partnership Opportunities
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Investment: Fuel our expansion across the Tulsa metro and beyond",
                      "Advisory: Share your expertise in AI, business development, or local markets",
                      "Strategic Partners: Collaborate on solutions for your industry or client base",
                    ].map((text, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center mr-3 mt-0.5 group-hover:from-sky-500/30 group-hover:to-violet-500/30 transition-colors">
                          <Check className="h-3 w-3 text-sky-400" />
                        </div>
                        <span className="text-slate-300">{text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-black font-semibold group" asChild>
                      <Link href="/consultation">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Start a Conversation
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                      <Link href="/fundraising">Learn More</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <GlowBorder color="sky" className="inline-block">
                    <div className="p-6 rounded-xl">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-violet-500/20 blur-xl rounded-full opacity-50" />
                        <div className="relative glass-panel p-4 rounded-xl">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <QrCode className="h-5 w-5 text-sky-400" />
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Early Supporter</span>
                          </div>
                          <img 
                            src="/images/supporter-qr-code.png" 
                            alt="Supporter QR Code" 
                            className="w-48 h-48 object-contain mx-auto rounded-lg" 
                          />
                        </div>
                      </div>
                      <p className="text-white text-center text-lg mt-4 font-medium">Become an early supporter</p>
                      <p className="text-slate-400 text-center text-sm mt-1">
                        Contribute:{" "}
                        <a
                          href="https://buy.stripe.com/00gcN2ctT5Xw4cE004"
                          className="text-sky-400 hover:text-sky-300 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Support our mission
                        </a>
                      </p>
                    </div>
                  </GlowBorder>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </section>

      <SectionSeparator icon={<Rocket className="h-5 w-5 text-sky-400" />} variant="gradient" />

      <section className="w-full py-24 relative overflow-hidden">
        <GradientMesh />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <GlowBorder color="indigo">
            <div className="p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />
              <FloatingShapes />
              <div className="space-y-6 max-w-3xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-2">
                  <Zap className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Ready to Transform?</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Reduce{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400">
                    Business Friction
                  </span>
                  ?
                </h2>
                <p className="text-slate-300 text-lg">
                  Take the first step towards intelligent, data-driven operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-black font-semibold group" asChild>
                    <Link href="/login">
                      <Target className="mr-2 h-5 w-5" />
                      Start Your Assessment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 group" asChild>
                    <Link href="/consultation">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </section>
    </main>
  )
}
