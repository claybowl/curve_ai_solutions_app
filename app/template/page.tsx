import Link from "next/link";
import { ArrowRight, Zap, Globe, Code2, Gauge, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/custom-card";
import { CastleBackground } from "@/components/castle-background";

export default function TemplateShowcase() {
  return (
    <main className="min-h-screen bg-donjon-graphite text-white">
      {/* Hero Section */}
      <CastleBackground className="w-full py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <Badge className="bg-donjon-ember text-white font-bold uppercase tracking-wider">
                NEW
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                ServicePro Customer Site Template
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Clone-per-customer website builder. Deploy your service business site in minutes, not months.
              </p>
            </div>

            <p className="max-w-2xl mx-auto text-lg text-gray-200">
              Built with Next.js, Tailwind CSS, and powered by Donjon's AI orchestration. Each customer gets a fully branded, production-ready website.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="bg-donjon-ember text-white hover:bg-donjon-ember/90 font-bold text-lg px-8"
                asChild
              >
                <a href="https://servicepro-template.vercel.app" target="_blank" rel="noopener noreferrer">
                  View Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 font-bold text-lg px-8"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </CastleBackground>

      {/* Key Features */}
      <section id="features" className="w-full py-16 md:py-24 bg-gradient-to-b from-donjon-graphite to-donjon-graphite/95">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Scale</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade infrastructure with the simplicity of a template
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-6 w-6 text-donjon-ember" />
                  <CardTitle>Lightning Fast</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Next.js 14 optimized for performance. Deploy to Vercel and get edge-global latency.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="h-6 w-6 text-donjon-indigo" />
                  <CardTitle>Type-Safe</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Full TypeScript + Zod validation. Schema-first design ensures zero runtime surprises.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-6 w-6 text-donjon-ember" />
                  <CardTitle>Subdomain Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Each customer gets their own instance: acme.servicepro.app, cleanup.servicepro.app, etc.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Gauge className="h-6 w-6 text-donjon-indigo" />
                  <CardTitle>Config-Driven</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Single site.config.json file controls everything. No code changes needed per customer.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-donjon-ember" />
                  <CardTitle>SEO Optimized</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Next.js built-in SEO, dynamic meta tags from config, Image optimization included.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-white/5 border-white/10 hover:border-donjon-indigo/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-donjon-indigo" />
                  <CardTitle>AI-Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Integrates with Donjon orchestrator. Auto-generate configs, deploy, manage at scale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="w-full py-16 md:py-24 bg-donjon-graphite">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
            <p className="text-lg text-gray-400 mb-8">
              A complete site builder with modular, extensible components:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-ember" />
                  <span className="font-semibold">Hero Section</span>
                </div>
                <p className="text-sm text-gray-400">Title, subtitle, CTA, background image</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-indigo" />
                  <span className="font-semibold">About Section</span>
                </div>
                <p className="text-sm text-gray-400">Rich text, images, business story</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-ember" />
                  <span className="font-semibold">Services Grid</span>
                </div>
                <p className="text-sm text-gray-400">Service cards with pricing and features</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-indigo" />
                  <span className="font-semibold">Testimonials</span>
                </div>
                <p className="text-sm text-gray-400">Customer reviews with ratings</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-ember" />
                  <span className="font-semibold">FAQ Section</span>
                </div>
                <p className="text-sm text-gray-400">Expandable Q&A, fully interactive</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-5 w-5 text-donjon-indigo" />
                  <span className="font-semibold">CTA & Footer</span>
                </div>
                <p className="text-sm text-gray-400">Calls-to-action, contact, footer links</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-donjon-graphite via-donjon-indigo/10 to-donjon-graphite">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-donjon-ember rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Orchestrator Generates Config</h3>
                  <p className="text-gray-300">
                    ServicePro AI creates a validated site.config.json from customer onboarding data.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-donjon-indigo rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Template Gets Cloned</h3>
                  <p className="text-gray-300">
                    Fork or API call creates a new instance of servicepro-template with customer config.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-donjon-ember rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Deploy to Vercel</h3>
                  <p className="text-gray-300">
                    Automated deployment via Vercel API. Edge-global CDN, automatic SSL, instant preview URLs.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-donjon-indigo rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Live on Subdomain</h3>
                  <p className="text-gray-300">
                    Customer site goes live: acme.servicepro.app. No DNS management, no complexity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-donjon-graphite border-t border-white/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to See It in Action?</h2>
            <p className="text-lg text-gray-300">
              Explore the live demo or get in touch to integrate ServicePro Template into your workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="bg-donjon-ember text-white hover:bg-donjon-ember/90 font-bold text-lg px-8"
                asChild
              >
                <a href="https://servicepro-template.vercel.app" target="_blank" rel="noopener noreferrer">
                  View Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 font-bold text-lg px-8"
                asChild
              >
                <Link href="/consultation">Schedule a Demo</Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-white/10 mt-8">
              <p className="text-sm text-gray-400">
                Learn more in the{" "}
                <a
                  href="https://github.com/YOUR_ORG/servicepro-template"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-donjon-indigo hover:text-donjon-indigo/90 underline"
                >
                  GitHub repository
                </a>
                {" "}or check out the{" "}
                <Link href="/about" className="text-donjon-indigo hover:text-donjon-indigo/90 underline">
                  complete roadmap
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
