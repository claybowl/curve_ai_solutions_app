"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Bot,
  Calendar,
  Palette,
  Gavel,
  Hammer,
  Heart,
  Utensils,
  ShoppingBag,
  PartyPopper,
  GraduationCap,
  Code,
  Layers,
  Zap
} from "lucide-react"

const packages = [
  {
    name: "24-Hour AI Chatbot",
    price: "$497",
    tagline: "Your never-sleeping receptionist",
    description: "AI chatbot that answers questions and captures leads 24/7 while you work.",
    features: [
      "Answers 10-15 common questions",
      "Captures leads with contact info",
      "Works while you're busy",
      "Mobile-friendly interface",
    ],
    icon: Bot,
    accent: "#0ea5e9",
  },
  {
    name: "Instant Booking System",
    price: "$697",
    tagline: "Automate your entire schedule",
    description: "Everything in Chatbot plus online booking that syncs with your calendar.",
    features: [
      "Online booking calendar",
      "Google Calendar sync",
      "SMS reminders to customers",
      "Simple intake forms",
    ],
    icon: Calendar,
    accent: "#10b981",
  },
  {
    name: "Complete Digital Overhaul",
    price: "$1,297",
    tagline: "Full transformation",
    description: "Everything plus Google Business optimization, reviews, and a new website.",
    features: [
      "Google Business Profile optimization",
      "Review request automation",
      "1-page website if needed",
      "30 days of dedicated support",
    ],
    icon: Sparkles,
    accent: "#8b5cf6",
  },
]

const industries = [
  { name: "Creative", icon: Palette, accent: "#f472b6", services: [
    { name: "AI Pattern Generation", desc: "Sketch → Tech pack in 2 hours" },
    { name: "Brand Kit Automation", desc: "Logo → Full identity system instantly" },
    { name: "AI Culling", desc: "1000 photos → 50 best shots automatically" },
  ]},
  { name: "Professional", icon: Gavel, accent: "#60a5fa", services: [
    { name: "Document Assembly", desc: "Client intake → Contracts → Filing ready" },
    { name: "Listing Automation", desc: "Photos → MLS description → Social posts (5 min)" },
    { name: "Receipt Capture", desc: "Photo → Categorized entry instantly" },
  ]},
  { name: "Trades", icon: Hammer, accent: "#fb923c", services: [
    { name: "Dispatch Automation", desc: "Job → Closest tech → Optimized route" },
    { name: "Quote Generation", desc: "Photos of problem → Quote in 10 min" },
    { name: "Inventory Sync", desc: "Truck stock tracked, auto-orders low items" },
  ]},
  { name: "Health", icon: Heart, accent: "#34d399", services: [
    { name: "Patient Onboarding", desc: "Forms → Insurance check → Schedule (5 min)" },
    { name: "Treatment Plans", desc: "Diagnosis → Protocol → Home exercise PDF" },
    { name: "Recall Automation", desc: "Dormant patients → Personalized reactivation" },
  ]},
  { name: "Food & Bev", icon: Utensils, accent: "#a78bfa", services: [
    { name: "Inventory Prediction", desc: "Sales data → Reorder lists automatically" },
    { name: "Staff Scheduling", desc: "Forecast sales → Optimal shifts posted" },
    { name: "Review Response", desc: "AI drafts replies to Google/Yelp reviews" },
  ]},
  { name: "Retail", icon: ShoppingBag, accent: "#f87171", services: [
    { name: "Inventory Alerts", desc: "Low stock → Auto-reorder suggestions" },
    { name: "Multi-platform Listing", desc: "One upload → Etsy, Amazon, eBay, Shopify" },
    { name: "Dynamic Pricing", desc: "Competitor monitoring → Price adjustments" },
  ]},
  { name: "Events", icon: PartyPopper, accent: "#fbbf24", services: [
    { name: "Vendor Coordination", desc: "All vendors synced to master timeline" },
    { name: "Budget Tracking", desc: "Real-time spend monitoring with alerts" },
    { name: "Guest Management", desc: "RSVPs → Seating chart → Meal preferences" },
  ]},
  { name: "Education", icon: GraduationCap, accent: "#2dd4bf", services: [
    { name: "Progress Tracking", desc: "Assessment → Personalized study plan" },
    { name: "Content Delivery", desc: "Automated drip course releases" },
    { name: "Grading Automation", desc: "Objective assessments auto-graded" },
  ]},
  { name: "Tech", icon: Code, accent: "#818cf8", services: [
    { name: "Customer Onboarding", desc: "Trial → Activation → Conversion nudges" },
    { name: "Churn Prevention", desc: "Usage drops → Re-engagement sequence" },
    { name: "Feature Adoption", desc: "New release → Targeted tutorials" },
  ]},
]

// Fast CSS scroll-snap carousel - NO JS tilt calculations
function IndustrySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)

  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollLeft = containerRef.current.scrollLeft
    const cardWidth = 288
    const newIndex = Math.round(scrollLeft / cardWidth)
    setActiveIndex(newIndex)
  }

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-6 px-4 md:px-8 snap-x snap-mandatory scrollbar-thin"
      >
        {industries.map((industry, idx) => {
          const Icon = industry.icon
          const isExpanded = expanded === idx
          
          return (
            <div key={industry.name} className="flex-shrink-0 w-72 snap-center">
              <button
                onClick={() => setExpanded(isExpanded ? null : idx)}
                className="w-full text-left group relative p-5 rounded-2xl bg-gradient-to-br from-white/8 to-white/4 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: industry.accent }} />
                
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${industry.accent}20` }}>
                    <Icon className="h-5 w-5" style={{ color: industry.accent }} />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{industry.services.length} solutions</div>
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-white transition-colors">{industry.name}</h3>

                <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'mt-3 max-h-48' : 'max-h-0'}`}>
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {industry.services.map((service) => (
                      <div key={service.name} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: industry.accent }} />
                        <div>
                          <div className="text-sm text-slate-200">{service.name}</div>
                          <div className="text-xs text-slate-500">{service.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-2 text-xs flex items-center gap-1 transition-opacity ${isExpanded ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'}`} style={{ color: industry.accent }}>
                  <span>{isExpanded ? 'Tap to close' : 'Tap to expand'}</span>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {industries.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { containerRef.current?.scrollTo({ left: idx * 288, behavior: 'smooth' }); setExpanded(null); }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${activeIndex === idx ? 'bg-sky-400 w-6' : 'bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: typeof packages[0] }) {
  const Icon = pkg.icon
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/8 to-white/4 border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% 0%, ${pkg.accent}15, transparent 60%)` }} />
      
      <CardContent className="relative p-6 flex flex-col h-full">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${pkg.accent}20` }}>
          <Icon className="h-6 w-6" style={{ color: pkg.accent }} />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-1">{pkg.name}</h3>
        <p className="text-sm text-slate-400 mb-3">{pkg.tagline}</p>
        
        <div className="text-3xl font-bold text-slate-50 mb-2">{pkg.price}</div>
        <p className="text-sm text-slate-400 mb-4">{pkg.description}</p>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="mt-auto pt-3 border-t border-white/10 text-sm text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-between w-full"
        >
          <span>{showDetails ? 'Hide features' : 'Show features'}</span>
          <ArrowRight className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-200 ${showDetails ? 'max-h-40 mt-3' : 'max-h-0'}`}>
          <ul className="space-y-2">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: pkg.accent }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#030712]">
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-mono text-amber-400 tracking-wide">CUSTOM AI FOR EVERY INDUSTRY</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-4 tracking-tight">
              Built for <span className="text-sky-400">YOU</span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-3 max-w-xl mx-auto">
              Not some generic AI. Something that actually <span className="text-sky-400 font-medium">understands YOUR business</span>.
            </p>
            
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Whether you&apos;re running a restaurant in Tulsa or a law firm in NYC — we build what you need.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">Find Your Industry</h2>
            <p className="text-sm text-slate-400">Tap a card to see AI solutions</p>
          </div>
          <IndustrySection />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2">Pick Your Package</h2>
            <p className="text-sm text-slate-400">Three tiers. No mystery. Pick what fits.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {packages.map((pkg) => <PackageCard key={pkg.name} pkg={pkg} />)}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Fast", desc: "Days, not months" },
              { icon: Layers, title: "Yours", desc: "Built for YOUR model" },
              { icon: CheckCircle2, title: "Proven", desc: "Real results" }
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <item.icon className="h-5 w-5 mx-auto mb-2 text-sky-400" />
                <div className="text-sm font-medium text-slate-200">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-sky-500/10 to-violet-500/10 border border-white/10 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-50 mb-3">Ready to automate YOUR business?</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">Book 15 minutes. No pressure, no pitch — just a conversation.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold" asChild>
                <Link href="/consultation">Book Free Chat <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar { height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>
    </div>
  )
}
