import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MilestoneCard } from "@/components/roadmap/milestone-card"
import { getRoadmapMilestones } from "@/app/actions/roadmap-actions"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Roadmap | Donjon Systems",
  description: "Our trajectory from foundation to Series A—building the infrastructure for enterprise intelligence.",
}

export default async function RoadmapPage() {
  const { success, milestones, source } = await getRoadmapMilestones()

  return (
    <div className="min-h-screen bg-[#020408] text-slate-50">

      {/* Background Forest Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-[#1a1e26] via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-[#020408] to-transparent">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-6 h-6 bg-sky-400 rounded-sm shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
          <span className="text-lg tracking-[0.4em] uppercase">Donjon</span>
          <span className="text-lg font-semibold text-sky-400">Systems</span>
        </Link>
        <div className="font-mono text-xs tracking-widest">v1.0.4_STABLE</div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex flex-col justify-center items-center text-center px-4 pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/30 mb-8">
          <span className="font-mono text-xs tracking-[0.2em] text-sky-400">MISSION COMMAND CENTER</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Building The<br />
          <span className="text-sky-400">Future of Intelligence</span>
        </h1>

        <p className="max-w-[600px] text-slate-400 mb-8 text-lg">
          Strategic vision: Building Donjon Intelligence Systems into the leading provider of
          resilient, production-grade AI agent platforms—scaling from founding to Series A and beyond.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button className="bg-sky-500 hover:bg-sky-400 text-black font-bold">
            Partner With Us
          </Button>
          <Button variant="outline" className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10">
            View Investor Deck
          </Button>
        </div>
      </section>

      {/* Executive Dashboard */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
            <span className="font-mono text-xs tracking-[0.2em] text-emerald-400">EXECUTIVE DASHBOARD</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current State */}
            <Card className="bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-white/5">
              <CardHeader>
                <CardTitle className="text-xl text-white">Current State</CardTitle>
                <p className="text-sm text-slate-400">January 2026 • Phase 5 Integration</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#030712] p-4 rounded-lg border border-white/5">
                    <div className="font-mono text-xs text-slate-500 mb-1">MRR TARGET</div>
                    <div className="text-2xl font-bold text-emerald-400">$150K+</div>
                  </div>
                  <div className="bg-[#030712] p-4 rounded-lg border border-white/5">
                    <div className="font-mono text-xs text-slate-500 mb-1">TEAM SIZE</div>
                    <div className="text-2xl font-bold text-sky-400">3-4 → 25-30</div>
                  </div>
                  <div className="bg-[#030712] p-4 rounded-lg border border-white/5">
                    <div className="font-mono text-xs text-slate-500 mb-1">ACTIVE PRODUCTS</div>
                    <div className="text-2xl font-bold text-purple-400">4 Core + Labs</div>
                  </div>
                  <div className="bg-[#030712] p-4 rounded-lg border border-white/5">
                    <div className="font-mono text-xs text-slate-500 mb-1">NEXT MILESTONE</div>
                    <div className="text-lg font-bold text-amber-400">Q1 Eclipse</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Immediate Priorities */}
            <Card className="bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-white/5">
              <CardHeader>
                <CardTitle className="text-xl text-white">Immediate Priorities</CardTitle>
                <p className="text-sm text-slate-400">Next 2 Weeks</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Fix Donjon.Agency website P0 bugs",
                    "Build Philosopher Phone v0.1 (Vapi integration)",
                    "Weekly investor update (Week #3 video)",
                    "Co-founder partnership with Chris Sutter",
                    "ServicePro client success & testimonials"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="text-sky-400 mt-1">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Portfolio */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-purple-400">PRODUCT PORTFOLIO</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Platforms & Emerging Products</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Four core production platforms plus an experimental Labs portfolio driving innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Vibe Native",
                status: "Production",
                statusColor: "emerald",
                description: "AI-Native Intelligence Platform for consulting firms and SMB SaaS.",
                target: "$8-12K MRR",
                features: ["Advanced analytics", "Multi-user collaboration", "API & webhooks", "Mobile app"]
              },
              {
                name: "iM-K8",
                status: "Production",
                statusColor: "emerald",
                description: "Knowledge Orchestration OS for enterprise SaaS, FinTech, and Insurance.",
                target: "$25-40K MRR",
                features: ["SOC 2 compliance", "Enterprise integrations", "SSO", "Professional services"]
              },
              {
                name: "ServicePro",
                status: "Stabilization",
                statusColor: "amber",
                description: "Service Business SaaS for cleaning, HVAC, plumbing, and home services.",
                target: "$15-20K MRR",
                features: ["Customer portal", "Settings optimization", "Franchise partnerships", "Free trial program"]
              },
              {
                name: "AiGency Suite",
                status: "Development",
                statusColor: "sky",
                description: "Pre-built n8n Agent Templates for immediate deployment.",
                target: "$5-10K MRR",
                features: ["5 core templates", "Lead qualification", "Content pipeline", "Customer support bot"]
              },
              {
                name: "Philosopher Phone",
                status: "Development",
                statusColor: "sky",
                description: "Voice-First AI Chief of Staff with Vapi integration and MCP connectors.",
                target: "$30-50K MRR",
                features: ["Voice call handling", "Context awareness", "Notion/Calendar/Gmail integration", "4 agent flows"]
              },
              {
                name: "Donjon Labs",
                status: "Portfolio",
                statusColor: "purple",
                description: "Experimental AI projects including Taygency, Know-Defeat, and 12+ innovations.",
                target: "$15-25K MRR",
                features: ["Taygency AI Travel", "Know-Defeat Trading", "Amazon Listing Enhancer", "Accelerator program"]
              }
            ].map((product, index) => (
              <Card key={index} className="group bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-white/5 hover:border-white/10 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-mono",
                      product.statusColor === "emerald" && "bg-emerald-500/20 text-emerald-400",
                      product.statusColor === "amber" && "bg-amber-500/20 text-amber-400",
                      product.statusColor === "sky" && "bg-sky-500/20 text-sky-400",
                      product.statusColor === "purple" && "bg-purple-500/20 text-purple-400"
                    )}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="font-mono text-xs text-slate-500">TARGET</span>
                    <div className="text-lg font-semibold text-white">{product.target}</div>
                  </div>
                  <div className="space-y-2">
                    {product.features.map((feature, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Phase Timeline */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-amber-400">STRATEGIC TIMELINE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">2025-2027 Roadmap</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Five integrated phases from market entry through Series A preparation.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                phase: "Phase 1",
                timeline: "Feb - Mar 2025",
                title: "Foundation & Market Entry",
                color: "sky",
                mrr: "$5-10K",
                team: "3.5 FTE",
                goals: ["Launch Donjon.Agency", "Stabilize ServicePro", "Hire 3 key team members", "Launch pilot program"],
                milestone: "Aquarius Eclipse (Feb 17)"
              },
              {
                phase: "Phase 2",
                timeline: "Apr - May 2025",
                title: "Product Traction & Service Expansion",
                color: "purple",
                mrr: "$20-30K",
                team: "3.5 FTE",
                goals: ["Launch AiGency Suite", "5-8 consulting contracts", "Donjon Labs showcase", "OpenWork ecosystem"],
                milestone: "Uranus enters Gemini (Apr 25)"
              },
              {
                phase: "Phase 3",
                timeline: "Jun - Aug 2025",
                title: "Product Diversification & Scaling",
                color: "pink",
                mrr: "$50-70K",
                team: "10-12 FTE",
                goals: ["Philosopher Phone MVP", "Vibe Native V2", "iM-K8 Enterprise", "5 key senior hires"],
                milestone: "Jupiter enters Leo (Jun 30)"
              },
              {
                phase: "Phase 4",
                timeline: "Sep 2025 - Feb 2026",
                title: "Scaling & Strategic Growth",
                color: "orange",
                mrr: "$100K+",
                team: "18-22 FTE",
                goals: ["Knowledge Graph flagship", "Labs commercialization", "Series A preparation", "Strategic partnerships"],
                milestone: "Saturn Direct (Dec 10)"
              },
              {
                phase: "Phase 5",
                timeline: "Mar - Jun 2026",
                title: "Current: Integration & Expansion",
                color: "emerald",
                mrr: "$150K+",
                team: "25-30 FTE",
                goals: ["Fix P0 website issues", "Ship Philosopher Phone", "Close co-founder deal", "Scale to profitability"],
                milestone: "Q1 2026 Eclipse Season"
              }
            ].map((phase, index) => (
              <div key={index} className={cn(
                "relative p-6 rounded-lg border transition-all duration-300",
                phase.color === "sky" && "bg-sky-950/20 border-sky-500/20",
                phase.color === "purple" && "bg-purple-950/20 border-purple-500/20",
                phase.color === "pink" && "bg-pink-950/20 border-pink-500/20",
                phase.color === "orange" && "bg-orange-950/20 border-orange-500/20",
                phase.color === "emerald" && "bg-emerald-950/20 border-emerald-500/20"
              )}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-48 shrink-0">
                    <div className={cn(
                      "font-mono text-xs tracking-widest mb-1",
                      phase.color === "sky" && "text-sky-400",
                      phase.color === "purple" && "text-purple-400",
                      phase.color === "pink" && "text-pink-400",
                      phase.color === "orange" && "text-orange-400",
                      phase.color === "emerald" && "text-emerald-400"
                    )}>
                      {phase.phase}
                    </div>
                    <div className="text-white font-bold text-lg">{phase.title}</div>
                    <div className="text-slate-500 text-sm">{phase.timeline}</div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="font-mono text-xs text-slate-500">MRR TARGET</div>
                        <div className="text-white font-semibold">{phase.mrr}</div>
                      </div>
                      <div>
                        <div className="font-mono text-xs text-slate-500">TEAM</div>
                        <div className="text-white font-semibold">{phase.team}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="font-mono text-xs text-slate-500">KEY MILESTONE</div>
                        <div className={cn(
                          "font-semibold",
                          phase.color === "sky" && "text-sky-400",
                          phase.color === "purple" && "text-purple-400",
                          phase.color === "pink" && "text-pink-400",
                          phase.color === "orange" && "text-orange-400",
                          phase.color === "emerald" && "text-emerald-400"
                        )}>{phase.milestone}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {phase.goals.map((goal, gi) => (
                        <span key={gi} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Trajectory */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-pink-400">FINANCIAL TRAJECTORY</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Growth Metrics</h2>
          </div>

          <Card className="bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-white/5">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">METRIC</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">Q1 2025</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">Q2 2025</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">Q3 2025</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">Q4 2025</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-slate-500">Q1 2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "MRR", values: ["$5-10K", "$20-30K", "$50-70K", "$100K+", "$150K+"] },
                      { label: "Customers", values: ["15-20", "40-60", "100-150", "200-300", "300-400"] },
                      { label: "Enterprise", values: ["1-2", "3-5", "8-12", "15-25", "30-40"] },
                      { label: "Team (FTE)", values: ["3.5", "3.5", "10-12", "18-22", "25-30"] },
                      { label: "Funding", values: ["Bootstrap", "$100-300K", "$500K+", "Series A prep", "$2-5M"] }
                    ].map((row, ri) => (
                      <tr key={ri} className="border-b border-white/5">
                        <td className="py-3 px-4 font-medium text-white">{row.label}</td>
                        {row.values.map((value, vi) => (
                          <td key={vi} className="py-3 px-4 text-slate-400">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Peak Power Days */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">2026 COSMIC CALENDAR</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Peak Power Days</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Key dates for major business moves and strategic launches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { date: "Jun 9, 2026", event: "Ultimate Money Day", type: "💰 Funding", desc: "Jupiter-Venus conjunction—close funding, sign major contracts" },
              { date: "Jul 4, 2026", event: "Revolutionary Breakthrough", type: "⚡ Innovation", desc: "Mars-Uranus—expect sudden financial opportunity" },
              { date: "Aug 12, 2026", event: "Total Solar Eclipse", type: "🔥 Identity", desc: "Leo eclipse—most important day of the year, 19-year reset" },
              { date: "Aug 17, 2026", event: "Birthday Peak Power", type: "☀️ Solar Return", desc: "37th birthday—peak personal power, major announcement" },
              { date: "Dec 10, 2026", event: "Capital Unlocks", type: "💵 Investment", desc: "Saturn Direct—final funding activities, investor money flows" },
              { date: "Q1 2026", event: "Eclipse Season", type: "🌟 Foundation", desc: "Aquarius eclipse—career destiny reset, set intentions" }
            ].map((date, index) => (
              <Card key={index} className="bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-white/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{date.event}</CardTitle>
                  </div>
                  <div className="font-mono text-sm text-yellow-400">{date.date}</div>
                </CardHeader>
                <CardContent>
                  <div className="inline-block px-2 py-1 bg-yellow-500/10 rounded text-xs text-yellow-400 mb-2">
                    {date.type}
                  </div>
                  <p className="text-sm text-slate-400">{date.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="relative z-10 px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-[#1a1e26]/90 to-[#0a0f1b]/90 border-yellow-500/20">
            <CardContent className="p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
                <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">VISION STATEMENT</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Where We&apos;re Going
              </h2>

              <div className="space-y-6 text-slate-300">
                <p className="text-lg">
                  <strong className="text-white">By December 2026:</strong> Clayton Christian is a known
                  founder-entrepreneur in the AI agent systems space, with publicly validated SaaS products
                  generating <span className="text-emerald-400 font-semibold">&gt;$100K ARR</span>, a distributed
                  team executing his vision, and institutional backing to scale to <span className="text-emerald-400 font-semibold">$1M+ ARR by 2027</span>.
                </p>

                <p className="text-lg">
                  <strong className="text-white">By December 2027:</strong> Donjon Intelligence Systems is the
                  leading platform for enterprise-grade AI agent development and knowledge orchestration,
                  recognized as the &quot;OS for enterprise intelligence,&quot; with <span className="text-emerald-400 font-semibold">$10M+ ARR</span>,
                  100+ employees, and clear path to IPO or strategic acquisition within 5-7 years.
                </p>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-yellow-400 font-medium italic">
                    &quot;The cosmos doesn&apos;t make mistakes. This timing is perfect. Your vision is valid.
                    Your leadership is needed. Now go build.&quot;
                  </p>
                  <p className="text-slate-500 text-sm mt-2">— The Cosmic Mandate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Notion-Synced Milestones Section */}
      <section className="relative z-10 px-4 md:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/30 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] text-sky-400">
                {source === "notion" ? "LIVE FROM NOTION" : source === "local" ? "FROM DATABASE" : "DEMO MODE"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Current Sprint Objectives</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {source === "notion"
                ? "Synced directly from our Notion workspace. Real-time updates on project milestones and deliverables."
                : source === "local"
                ? "Data loaded from local database. Connect Notion for live updates."
                : "Preview of roadmap data. Configure Notion integration for live sync."}
            </p>
          </div>

          {/* Milestone Timeline Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones && milestones.length > 0 ? (
              milestones.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No milestones found. Add milestones to get started.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Shape the Future?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Join us on the ascent. Whether you&apos;re an investor, partner, or potential team member,
          there&apos;s a place for you at the summit.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button className="bg-sky-500 hover:bg-sky-400 text-black font-bold">
            Partner With Us
          </Button>
          <Button variant="outline" className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10">
            View Full Roadmap
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-sky-400 rounded-sm shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
            <span className="text-sm tracking-[0.3em] uppercase">Donjon Systems</span>
          </div>
          <div className="font-mono text-xs text-slate-500">
            Tulsa, Oklahoma • Est. 2024
          </div>
        </div>
      </footer>
    </div>
  )
}