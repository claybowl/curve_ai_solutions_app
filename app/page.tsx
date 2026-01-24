import Link from "next/link"
import { ArrowRight, Sparkles, Calendar, ExternalLink, Beaker, Wrench, Users, Rocket, MessageSquare, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const platforms = [
  {
    name: "Vibe Native",
    tagline: "AI-powered no-code platform for building beautiful, functional applications",
    href: "/platforms/vibe-native",
    externalUrl: "https://vibenative.studio/",
  },
  {
    name: "I'm K8",
    tagline: "Intelligent AI-powered communication and collaboration platform",
    href: "/platforms/im-k8",
    externalUrl: "https://im-k8.lovable.app/",
  },
  {
    name: "ServicePro",
    tagline: "Comprehensive platform for managing service-based businesses with AI automation",
    href: "/platforms/servicepro",
    externalUrl: "https://cleanmachinetulsa.com/dashboard",
  },
] as const

export default function Home() {
  return (
    <main className="bg-[#030712] min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-indigo-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />
        
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span className="fira-label tracking-[0.3em] uppercase text-slate-400">
              AI Solutions for Tulsa Businesses
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight leading-tight text-white">
            Grow Your Business{" "}
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400">
              With AI That Works
            </span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We help small and medium businesses in the Tulsa metro area{" "}
            <span className="text-sky-400/80">save time</span>,{" "}
            <span className="text-indigo-400/80">close more deals</span>, and{" "}
            <span className="text-emerald-400/80">run smoother operations</span> — with AI tools built for how you actually work.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-emerald-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-mono">48-Hour Setup</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-sky-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-xs text-slate-300 font-mono">Local Support</span>
            </div>
            <div className="glass-panel px-4 py-2 flex items-center gap-2 hover:border-indigo-500/30 transition-colors">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '2s' }} />
              <span className="text-xs text-slate-300 font-mono">Consulting at $85/hr</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-bold group" asChild>
              <Link href="/services">
                <Rocket className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 group" asChild>
              <Link href="/consultation">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 group" asChild>
              <Link href="/login">
                <Shield className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Our Platforms</h2>
            <div className="neon-line mx-auto w-24 mb-4" />
            <p className="text-slate-400 max-w-2xl mx-auto">
              Three production-ready platforms solving real problems for real businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Card key={platform.name} className="glass-panel border-white/10 hover:border-sky-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Sparkles className="h-6 w-6 text-sky-400" />
                  </div>
                  <CardTitle className="text-sky-400 mb-2">{platform.name}</CardTitle>
                  <CardContent className="text-slate-400 p-0 mb-4">
                    {platform.tagline}
                  </CardContent>
                </CardHeader>
                <div className="px-6 pb-6 flex gap-2">
                  <Button variant="outline" className="flex-1 border-sky-500/30 text-sky-400 hover:bg-sky-500/10" asChild>
                    <Link href={platform.href}>
                      View Platform
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-sky-400 hover:bg-sky-500/10" asChild>
                    <Link href={platform.externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/consulting" className="glass-panel p-8 border-white/10 hover:border-sky-500/30 transition-all duration-300 group">
              <div className="h-14 w-14 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="h-7 w-7 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-3">Consulting</h3>
              <p className="text-slate-400 mb-4">
                Expert guidance at $85/hr. Platform development, AI integration, workflow automation.
              </p>
              <span className="text-sky-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link href="/services" className="glass-panel p-8 border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="h-14 w-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Wrench className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-3">Services</h3>
              <p className="text-slate-400 mb-4">
                Pre-built n8n templates, a la carte development, and custom enterprise solutions.
              </p>
              <span className="text-emerald-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                View Services <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link href="/labs" className="glass-panel p-8 border-white/10 hover:border-violet-500/30 transition-all duration-300 group">
              <div className="h-14 w-14 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Beaker className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-3">Labs</h3>
              <p className="text-slate-400 mb-4">
                Experimental AI agents, creative projects, and innovative tools in development.
              </p>
              <span className="text-violet-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Labs <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Ready to Build?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Let's discuss your project and find the right solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sky-500 hover:bg-sky-400 text-black font-bold" asChild>
              <Link href="/consultation">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-sky-500/50 text-sky-400 hover:bg-sky-500/10" asChild>
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
