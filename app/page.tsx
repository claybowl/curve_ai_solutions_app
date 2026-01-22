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
  "Vibe Native": Sparkles,
  "K8 (Communik8)": MessageSquare,
  "Know-Defeat": LineChart,
  "Alfie Business Manager": Brain,
  "AEGIS v2": Users,
  "Amazon Listing Enhancer AI": ShoppingCart,
  "Donjon Intelligence Systems": Building2,
  "Knowledge Studio": Lightbulb,
  "AiPex Builder": Workflow,
  "Taygency": Code2,
}

const productCategories: Record<string, string> = {
  "Vibe Native": "AI Studio",
  "K8 (Communik8)": "Communication",
  "Know-Defeat": "Trading System",
  "Alfie Business Manager": "Intelligence",
  "AEGIS v2": "Agent System",
  "Amazon Listing Enhancer AI": "E-Commerce",
  "Donjon Intelligence Systems": "Enterprise",
  "Knowledge Studio": "Knowledge Graph",
  "AiPex Builder": "Automation",
  "Taygency": "Multi-Tenant",
}

const featuredProducts = [
  {
    name: "Vibe Native",
    tagline: "Comprehensive AI Studio Suite with 15+ integrated tools",
    href: "https://vibenative.studio/",
  },
  {
    name: "K8 (Communik8)",
    tagline: "Privacy-first AI communication bridge with ephemeral sessions",
    href: "https://im-k8.lovable.app/",
  },
  {
    name: "Know-Defeat",
    tagline: "Production-grade algorithmic trading system with 19K+ LOC",
    href: "https://github.com/claybowl/Know-Defeat",
  },
  {
    name: "Alfie Business Manager",
    tagline: "3D knowledge graph business intelligence platform",
    href: "https://github.com/claybowl/alfie-business-manager",
  },
  {
    name: "AEGIS v2",
    tagline: "Multi-agent orchestration with 5 collaboration modes",
    href: "https://vibenative.studio/",
  },
  {
    name: "Amazon Listing Enhancer AI",
    tagline: "E-commerce optimization with GPT-4o/DALL-E 3",
    href: "https://github.com/claybowl/Amazon_Listing_Enhancer_AI",
  },
  {
    name: "Donjon Intelligence Systems",
    tagline: "Enterprise AI consultation platform",
    href: "https://github.com/claybowl/curve_ai_solutions_app",
  },
  {
    name: "Knowledge Studio",
    tagline: "Graph-based RAG system with Zep/Graphiti",
    href: "https://vibenative.studio/",
  },
  {
    name: "AiPex Builder",
    tagline: "Visual workflow automation with Gemini-3-Pro",
    href: "https://vibenative.studio/",
  },
  {
    name: "Taygency",
    tagline: "Multi-tenant AI agency platform",
    href: "https://github.com/claybowl/Taygency",
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
              Engineering Resilient Intelligence
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight leading-tight animate-fade-up delay-100 text-white">
            Where We Keep{" "}
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400 animate-gradient">
              Intelligence Secure
            </span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-up delay-200">
            We build systems that don&apos;t just process information—they{" "}
            <span className="text-sky-400/80">understand context</span>,{" "}
            <span className="text-indigo-400/80">learn from experience</span>, and{" "}
            <span className="text-emerald-400/80">adapt to evolving challenges</span> in real-time.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up delay-300">
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-emerald-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">Architecture: Resilient</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-sky-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse animation-delay-1000" />
              <span className="text-xs text-slate-300 font-mono">Design: Evolutionary</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-indigo-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse animation-delay-2000" />
              <span className="text-xs text-slate-300 font-mono">Security: Enterprise-Grade</span>
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <Calendar className="h-5 w-5 text-sky-400" />
              </div>
              <span className="text-sm font-medium text-white">Coming Soon:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Customer Site Template</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-2 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">New Agent Line-up</span>
                <span className="text-xs bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full font-mono border border-sky-500/20">
                  January 2026
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
          <SectionDivider title="Intelligence Projects" className="mb-16" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProjectCard
              code="0x01_INTEGRATION"
              codeColor="text-sky-400"
              title="AiGent® System"
              description="Our proprietary AI orchestration platform with agent crew management and message bus capabilities."
              tags={[
                { label: "Orchestration", color: "sky" },
                { label: "Agents", color: "emerald" },
              ]}
            />
            <ProjectCard
              code="0x02_ANALYTICS"
              codeColor="text-emerald-400"
              title="Data Visualization Suite"
              description="Transform complex data into actionable insights with advanced visualization tools."
              tags={[
                { label: "Analytics", color: "emerald" },
                { label: "Insights", color: "sky" },
              ]}
            />
            <ProjectCard
              code="0x03_PLATFORM"
              codeColor="text-indigo-400"
              title="AiPex Platform"
              description="Our AI Platform Exchange connecting businesses with specialized AI solutions and tools."
              tags={[
                { label: "Marketplace", color: "indigo" },
                { label: "Exchange", color: "violet" },
              ]}
            />
            <ProjectCard
              code="0x04_AUTOMATION"
              codeColor="text-violet-400"
              title="n8n Integration Tools"
              description="Seamlessly integrate AI capabilities into your n8n workflows."
              tags={[
                { label: "Workflow", color: "violet" },
                { label: "n8n", color: "amber" },
              ]}
            />
          </div>

          <div className="flex justify-center mt-12 gap-4">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 group" asChild>
              <Link href="/solutions">
                View All Solutions
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold group" asChild>
              <Link href="/products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Link>
            </Button>
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
                title: "Donjon Intelligence has magic hands!",
                subtitle: "Small Business Owner - Client",
                quote: "Wow, Clayton! Really an amazingly thorough outline. I can't wait to see everything implemented as we progress. Thank you for the excellent work and timely update!",
                author: "Jody Beeson",
                role: "Founder, Clean Machine Tulsa",
                initials: "JB",
                gradient: "from-sky-500 to-sky-400",
                avatarGradient: "from-sky-500 to-sky-600",
                rating: 5,
              },
              {
                title: "5x the Fun in Half the Time",
                subtitle: "The Metaverse of Shenanigans",
                quote: "Since integrating Donjon Intelligence's awesome technology into our digital playgrounds, the frequency of spontaneous dance-offs has increased by 500%.",
                author: "DJ Don Dog",
                role: "Party Architect & Developer",
                initials: "DD",
                gradient: "from-violet-500 to-violet-400",
                avatarGradient: "from-violet-500 to-violet-600",
                rating: 5,
              },
              {
                title: "Simplifying Complexity, One Mind at a Time",
                subtitle: "Futuristic Space Exploration",
                quote: "Donjon Intelligence's innovative solutions have been instrumental in streamlining our mission control processes.",
                author: "Lucy V",
                role: "Galactic Traveler & Developer",
                initials: "LV",
                gradient: "from-emerald-500 to-emerald-400",
                avatarGradient: "from-emerald-500 to-emerald-600",
                rating: 5,
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
                We engineer intelligent, resilient systems that serve as the{" "}
                <span className="text-sky-400 font-medium">cognitive strongholds</span> of the modern world — integrating knowledge, automation, and reasoning into fortified architectures that stand the test of time.
              </p>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Our Philosophy
                </h3>
                <p className="text-slate-400">
                  <span className="text-white font-medium">Above all else show the data.</span> We believe in transparent, data-driven solutions that provide clear insights and measurable results.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-sky-400" />
                  Our Approach
                </h3>
                <p className="text-slate-400">
                  We follow <span className="text-sky-400">Agile methodologies</span> and <span className="text-indigo-400">DevOps practices</span> to ensure rapid, iterative development and continuous improvement of our AI solutions.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Shield,
                  iconColor: "text-sky-400",
                  bgColor: "bg-sky-500/10",
                  title: "Expert Team",
                  description: "Our team consists of AI specialists, data scientists, and software engineers with decades of combined experience.",
                },
                {
                  icon: Database,
                  iconColor: "text-indigo-400",
                  bgColor: "bg-indigo-500/10",
                  title: "Technology Stack",
                  description: "We leverage cutting-edge technologies including OpenAI, Google Generative AI, and custom ML models.",
                },
                {
                  icon: Zap,
                  iconColor: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                  title: "Rapid Deployment",
                  description: "Our Docker-based infrastructure ensures consistent, reliable deployment of AI solutions.",
                },
                {
                  icon: BarChart2,
                  iconColor: "text-violet-400",
                  bgColor: "bg-violet-500/10",
                  title: "Data-Driven",
                  description: "We prioritize data visualization and transparency in all our solutions.",
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
          <SectionDivider title="Support Our Mission" className="mb-16" />

          <GlowBorder color="violet">
            <div className="p-8 md:p-12">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-sky-400" />
                    Support Our Kickstarter
                  </h2>
                  <p className="text-slate-300">
                    Help us bring AI solutions to more businesses by supporting our startup journey
                  </p>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Why Support Us?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Accelerate development of our AI agent infrastructure",
                      "Help us bring cutting-edge AI solutions to small businesses",
                      "Be part of our journey from the beginning",
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
                      <a href="https://buy.stripe.com/00gcN2ctT5Xw4cE004" target="_blank" rel="noopener noreferrer">
                        <Heart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Donate Now
                      </a>
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                      <Link href="/fundraising">Campaign Details</Link>
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
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scan to Donate</span>
                          </div>
                          <img 
                            src="/images/supporter-qr-code.png" 
                            alt="Donation QR Code" 
                            className="w-48 h-48 object-contain mx-auto rounded-lg" 
                          />
                        </div>
                      </div>
                      <p className="text-white text-center text-lg mt-4 font-medium">Scan to donate</p>
                      <p className="text-slate-400 text-center text-sm mt-1">
                        Or visit:{" "}
                        <a
                          href="https://buy.stripe.com/00gcN2ctT5Xw4cE004"
                          className="text-sky-400 hover:text-sky-300 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          buy.stripe.com
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
