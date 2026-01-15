import Link from "next/link"
import { ArrowRight, BarChart2, Check, Shield, Database, Zap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/donjon/project-card"
import { GlassCard } from "@/components/donjon/glass-card"
import { SectionDivider } from "@/components/donjon/section-divider"

export default function Home() {
  return (
    <main className="bg-[#030712] min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-indigo-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <p className="fira-label tracking-[0.5em] uppercase animate-fade-up text-slate-500">
            Engineering Resilient Intelligence
          </p>
          <h1 className="text-5xl md:text-7xl font-extralight leading-tight animate-fade-up delay-100 text-white">
            Where We Keep <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Intelligence Secure</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-up delay-200">
            We build systems that don't just process information—they understand context, learn from experience, and adapt to evolving challenges in real-time.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up delay-300">
            <div className="glass-panel px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-300 font-mono">Architecture: Resilient</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs text-slate-300 font-mono">Design: Evolutionary</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-xs text-slate-300 font-mono">Security: Enterprise-Grade</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-up delay-400">
            <Link href="/solutions" className="btn-primary">
              Solutions & Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/consultation" className="btn-ghost">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-12 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-sky-400" />
              <span className="text-sm font-medium text-white">Coming Soon:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Customer Site Template</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">LIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">New Agent Line-up</span>
                <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-mono">January 2026</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-sky-500 hover:bg-sky-400 text-black font-semibold">
                <Link href="/template">See Template</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Link href="/about">View Roadmap</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/10" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <GlassCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="tech-tag tech-tag-sky">Featured</span>
                  <span className="tech-tag tech-tag-emerald">New</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Digital Transformation Suite</h2>
                <p className="text-lg text-slate-300">
                  Transform your local service business with AI-powered automation. Complete packages starting at $1,299.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-300">
                    <Check className="h-5 w-5 mr-3 text-sky-400" />
                    <span>95% reduction in quote turnaround time</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="h-5 w-5 mr-3 text-sky-400" />
                    <span>25%+ increase in conversion rates</span>
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="h-5 w-5 mr-3 text-sky-400" />
                    <span>30%+ improvement in revenue per lead</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold" asChild>
                  <Link href="/products">
                    View Packages & Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                  <Link href="/consultation">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <GlassCard className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500" />
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="fira-label text-sky-400">Assessment</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">AI Readiness Assessment</h2>
                <p className="text-slate-400 mt-2">Complete our comprehensive questionnaire</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">Why take the assessment?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                        ✓
                      </div>
                      <span className="text-slate-300">Identify AI opportunities specific to your business</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                        ✓
                      </div>
                      <span className="text-slate-300">Receive a personalized implementation roadmap</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                        ✓
                      </div>
                      <span className="text-slate-300">Understand potential ROI and resource requirements</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                        ✓
                      </div>
                      <span className="text-slate-300">Get expert recommendations tailored to your industry</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">What you'll receive:</h3>
                  <p className="text-slate-300">
                    A comprehensive report with actionable insights and a clear path forward for AI integration in your business.
                  </p>
                  <Button className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold mt-4" asChild>
                    <Link href="/login">Start Your Assessment</Link>
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
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
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
              <Link href="/solutions">View All Solutions</Link>
            </Button>
            <Button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold" asChild>
              <Link href="/products">
                Buy Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionDivider title="Client Success Stories" className="mb-16" />

          <div className="grid gap-8 md:grid-cols-3">
            <GlassCard className="overflow-hidden" hover>
              <div className="h-1 bg-gradient-to-r from-sky-500 to-sky-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  "Donjon Intelligence has magic hands!"
                </h3>
                <p className="text-xs text-slate-500 mb-4">Small Business Owner - Client</p>
                <p className="text-slate-300 italic mb-6">
                  "Wow, Clayton! Really an amazingly thorough outline. I can't wait to see everything implemented as we progress. Thank you for the excellent work and timely update!"
                </p>
                <div className="flex items-center pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                    JB
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white text-sm">Jody Beeson</p>
                    <p className="text-xs text-slate-500">Founder, Clean Machine Tulsa</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="overflow-hidden" hover>
              <div className="h-1 bg-gradient-to-r from-violet-500 to-violet-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  "5x the Fun in Half the Time"
                </h3>
                <p className="text-xs text-slate-500 mb-4">The Metaverse of Shenanigans</p>
                <p className="text-slate-300 italic mb-6">
                  "Since integrating Donjon Intelligence's awesome technology into our digital playgrounds, the frequency of spontaneous dance-offs has increased by 500%."
                </p>
                <div className="flex items-center pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    DD
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white text-sm">DJ Don Dog</p>
                    <p className="text-xs text-slate-500">Party Architect & Developer</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="overflow-hidden" hover>
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  "Simplifying Complexity, One Mind at a Time"
                </h3>
                <p className="text-xs text-slate-500 mb-4">Futuristic Space Exploration</p>
                <p className="text-slate-300 italic mb-6">
                  "Donjon Intelligence's innovative solutions have been instrumental in streamlining our mission control processes."
                </p>
                <div className="flex items-center pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    LV
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white text-sm">Lucy V</p>
                    <p className="text-xs text-slate-500">Galactic Traveler & Developer</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionDivider title="About Donjon Intelligence" className="mb-16" />

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="text-xl text-slate-300 leading-relaxed">
                We engineer intelligent, resilient systems that serve as the cognitive strongholds of the modern world — integrating knowledge, automation, and reasoning into fortified architectures that stand the test of time.
              </p>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Our Philosophy</h3>
                <p className="text-slate-400">
                  Above all else show the data. We believe in transparent, data-driven solutions that provide clear insights and measurable results.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Our Approach</h3>
                <p className="text-slate-400">
                  We follow Agile methodologies and DevOps practices to ensure rapid, iterative development and continuous improvement of our AI solutions.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="p-6" hover>
                <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-sky-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Expert Team</h4>
                <p className="text-sm text-slate-400">
                  Our team consists of AI specialists, data scientists, and software engineers with decades of combined experience.
                </p>
              </GlassCard>

              <GlassCard className="p-6" hover>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-indigo-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Technology Stack</h4>
                <p className="text-sm text-slate-400">
                  We leverage cutting-edge technologies including OpenAI, Google Generative AI, and custom ML models.
                </p>
              </GlassCard>

              <GlassCard className="p-6" hover>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Rapid Deployment</h4>
                <p className="text-sm text-slate-400">
                  Our Docker-based infrastructure ensures consistent, reliable deployment of AI solutions.
                </p>
              </GlassCard>

              <GlassCard className="p-6" hover>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-violet-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Data-Driven</h4>
                <p className="text-sm text-slate-400">
                  We prioritize data visualization and transparency in all our solutions.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionDivider title="Support Our Mission" className="mb-16" />

          <GlassCard className="p-8 md:p-12">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Support Our Kickstarter</h2>
                <p className="text-slate-300">
                  Help us bring AI solutions to more businesses by supporting our startup journey
                </p>
                <h3 className="text-xl font-semibold text-white">Why Support Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                      ✓
                    </div>
                    <span className="text-slate-300">Accelerate development of our AI agent infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                      ✓
                    </div>
                    <span className="text-slate-300">Help us bring cutting-edge AI solutions to small businesses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs mr-3 mt-0.5">
                      ✓
                    </div>
                    <span className="text-slate-300">Be part of our journey from the beginning</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold" asChild>
                    <a href="https://buy.stripe.com/00gcN2ctT5Xw4cE004" target="_blank" rel="noopener noreferrer">
                      Donate Now
                    </a>
                  </Button>
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                    <Link href="/fundraising">Campaign Details</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="glass-panel p-6 rounded-xl">
                  <img src="/images/supporter-qr-code.png" alt="Donation QR Code" className="w-48 h-48 object-contain mx-auto" />
                  <p className="text-white text-center text-lg mt-4 font-medium">Scan to donate</p>
                  <p className="text-slate-400 text-center text-sm mt-1">
                    Or visit:{" "}
                    <a
                      href="https://buy.stripe.com/00gcN2ctT5Xw4cE004"
                      className="text-sky-400 hover:text-sky-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      buy.stripe.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-500/5 via-transparent to-indigo-500/5" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <GlassCard className="p-12 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Reduce Business Friction?
              </h2>
              <p className="text-slate-300 text-lg">
                Take the first step towards intelligent, data-driven operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold" asChild>
                  <Link href="/login">
                    Start Your Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5" asChild>
                  <Link href="/consultation">Contact Us</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  )
}
