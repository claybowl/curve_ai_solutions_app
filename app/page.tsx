import Link from "next/link"
import { ArrowRight, BarChart2, Database, Shield, Zap, Bot, LineChart, Workflow, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/custom-card"
import DonjonLogoVisualization from "@/components/donjon-logo-visualization"
import { CastleBackground } from "@/components/castle-background"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <CastleBackground className="w-full py-6 md:py-12 lg:py-16 xl:py-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  The Donjon: Where We Keep Intelligence Secure
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Building AI systems that think, adapt, and endure.
                </p>
              </div>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                We engineer resilient intelligence platforms—integrating knowledge, automation, and reasoning into architectures built to scale and evolve with your mission.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                  <Link href="/products">
                    View Products & Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                  asChild
                >
                  <Link href="/consultation">Schedule Consultation</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                  asChild
                >
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <DonjonLogoVisualization />
            </div>
          </div>
        </div>
      </CastleBackground>

      {/* 🔥 EMERGENCY CASH TACTICS - First 10 Tulsa Businesses Offer */}
      <section className="w-full py-8 bg-gradient-to-r from-donjon-graphite via-donjon-indigo to-donjon-graphite animate-gradient-x bg-[length:200%_200%] relative overflow-hidden">
        {/* Animated glow effect background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-donjon-ember rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-donjon-indigo rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-4xl animate-bounce">🔥</span>
              <Badge className="bg-donjon-ember text-white font-bold text-lg px-4 py-1 uppercase tracking-wider">
                LIMITED TIME
              </Badge>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
              EMERGENCY CASH TACTICS
            </h2>

            <p className="text-xl md:text-2xl font-bold text-donjon-silver mb-4">
              "First 10 Tulsa Businesses" Offer
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border-4 border-donjon-ember shadow-2xl mb-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">
                    $599
                  </div>
                  <div className="text-lg text-donjon-silver font-bold line-through opacity-75">
                    Regular: $1,299
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">
                    💼 SOLO Package
                  </div>
                  <div className="text-xl text-donjon-ember font-semibold mt-2">
                    50% OFF
                  </div>
                </div>

                <div className="text-6xl text-donjon-ember hidden md:block">+</div>

                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">
                    $29/mo
                  </div>
                  <div className="text-lg text-donjon-silver font-bold">
                    Forever Price Lock
                  </div>
                  <div className="text-base text-white/90 mt-2">
                    Never increases
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <Button
                size="lg"
                className="bg-donjon-ember text-white hover:bg-donjon-ember/90 font-black text-xl px-10 py-7 shadow-2xl hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/products">
                  Claim Your Spot Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <div className="text-white font-bold text-lg">
                ⚡ Only for Tulsa businesses
              </div>
            </div>

            <p className="text-white/90 text-sm">
              <strong className="text-donjon-silver">Why we're doing this:</strong> 5 SOLO packages ($1,299) = $6,495 • 2 CREW packages ($2,499) = $4,998 • We need quick cash to scale operations
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner - New section highlighting upcoming launches */}
      <section className="w-full py-8 bg-donjon-indigo/10 dark:bg-donjon-indigo/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-donjon-indigo dark:text-donjon-indigo" />
              <h3 className="text-lg font-bold text-donjon-graphite dark:text-white">Coming Soon:</h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-donjon-graphite dark:text-gray-200">AiGent® System</span>
                <span className="text-xs bg-donjon-indigo text-white px-2 py-0.5 rounded-full">May 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-donjon-graphite dark:text-gray-200">AiPex Launch</span>
                <span className="text-xs bg-donjon-indigo text-white px-2 py-0.5 rounded-full">June 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-donjon-graphite dark:text-gray-200">Official Launch</span>
                <span className="text-xs bg-donjon-indigo text-white px-2 py-0.5 rounded-full">June 28, 2025</span>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="text-donjon-indigo border-donjon-indigo dark:text-donjon-indigo dark:border-donjon-indigo dark:hover:bg-donjon-indigo/10"
            >
              <Link href="/about">View Full Roadmap</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Product Showcase */}
      <section className="w-full py-12 bg-gradient-to-r from-[#1E2A38] via-[#2F3B44] to-[#3F8CFF] animate-gradient-x bg-[length:200%_200%]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Digital Transformation Suite</h2>
              <p className="text-lg text-white/90 mb-4">
                Transform your local service business with AI-powered automation. Complete packages starting at $1,299.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>95% reduction in quote turnaround time</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>25%+ increase in conversion rates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>30%+ improvement in revenue per lead</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="bg-white text-donjon-ember hover:bg-gray-100"
                asChild
              >
                <Link href="/products">
                  View Packages & Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/consultation">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Assessment Section - Updated with better styling */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <Card className="border-2 border-donjon-indigo overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-donjon-graphite to-donjon-indigo text-white py-6">
              <CardTitle className="text-2xl font-bold">AI Readiness Assessment</CardTitle>
              <CardDescription className="text-gray-100">Complete our comprehensive questionnaire</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-gray-700">
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-donjon-graphite dark:text-white">Why take the assessment?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Identify AI opportunities specific to your business
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Receive a personalized implementation roadmap
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Understand potential ROI and resource requirements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Get expert recommendations tailored to your industry
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-donjon-graphite dark:text-white">What you'll receive:</h3>
                  <p className="text-gray-600 dark:text-gray-200 mb-6">
                    A comprehensive report with actionable insights and a clear path forward for AI integration in your
                    business.
                  </p>
                  <Button className="w-full bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                    <Link href="/login">Start Your Assessment</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Solutions Section - Updated with visual elements */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-donjon-indigo mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-donjon-ember mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-donjon-graphite dark:text-white mb-4">
              Our Solutions
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              We offer a comprehensive suite of AI agent infrastructure solutions to help businesses automate workflows,
              reduce friction, and accelerate growth.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* AI Agent Development Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-donjon-indigo dark:hover:border-donjon-indigo hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-donjon-graphite dark:text-white">AiGent® System</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Our proprietary AI orchestration platform with agent crew management and message bus capabilities.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="/about"
                  className="text-donjon-indigo dark:text-donjon-indigo hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Data Visualization Suite */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-donjon-indigo dark:hover:border-donjon-indigo hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-donjon-graphite dark:text-white">Data Visualization Suite</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Transform complex data into actionable insights with advanced visualization tools.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="#"
                  className="text-donjon-indigo dark:text-donjon-indigo hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Trading System Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-donjon-indigo dark:hover:border-donjon-indigo hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl text-donjon-graphite dark:text-white">AiPex Platform</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI Platform Exchange connecting businesses with specialized AI solutions and tools.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="/about"
                  className="text-donjon-indigo dark:text-donjon-indigo hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* n8n Integration Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-donjon-indigo dark:hover:border-donjon-indigo hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl text-donjon-graphite dark:text-white">n8n Integration Tools</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Seamlessly integrate AI capabilities into your n8n workflows.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="#"
                  className="text-donjon-indigo dark:text-donjon-indigo hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-12 gap-4">
            <Button
              variant="outline"
              className="border-donjon-indigo text-donjon-indigo hover:bg-donjon-indigo/10 dark:border-donjon-indigo dark:text-donjon-indigo dark:hover:bg-donjon-indigo/10"
              asChild
            >
              <Link href="/solutions">View All Solutions</Link>
            </Button>
            <Button
              className="bg-donjon-ember hover:bg-donjon-ember/90 text-white"
              asChild
            >
              <Link href="/products">
                Buy Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Client Success Stories - Updated with better cards */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-donjon-indigo mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-donjon-ember mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-donjon-graphite dark:text-white mb-4">
              Client Success Stories
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              Real results from our AI solutions
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {/* Success Story 1 */}
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
              <div className="h-2 bg-donjon-graphite"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-donjon-graphite dark:text-white">
                  "Donjon Intelligence has magic hands!"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Small Business Owner - Client</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Wow, Clayton! Really an amazingly thorough outline. I can't wait to see everything implemented as we
                  progress. Thank you for the excellent work and timely update!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-donjon-graphite flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="ml-4">
                    <p className="font-medium dark:text-white">Jody Beeson</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Founder, Clean Machine Tulsa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Story 2 */}
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
              <div className="h-2 bg-[#7928CA]"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-donjon-graphite dark:text-white">
                  "5x the Fun in Half the Time"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">The Metaverse of Shenanigans</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Since integrating Donjon Intelligence's awesome technology into our digital playgrounds, the frequency of
                  spontaneous dance-offs has increased by 500%. The algorithm is so rad it seems to be able to predict
                  the perfect moment for a virtual conga line!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#7928CA] flex items-center justify-center text-white font-bold">
                    DD
                  </div>
                  <div className="ml-4">
                    <p className="font-medium dark:text-white">DJ Don Dog</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Party Architect & Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Story 3 */}
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
              <div className="h-2 bg-donjon-ember"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-donjon-graphite dark:text-white">
                  "Simplifying Complexity, One Mind at a Time"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Futuristic Space Exploration</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Donjon Intelligence's innovative solutions have been instrumental in streamlining our mission control processes,
                  allowing us to allocate more resources to the really important stuff – like searching for
                  extraterrestrial life and enjoying the breathtaking views of the cosmos!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-donjon-ember flex items-center justify-center text-white font-bold">
                    LV
                  </div>
                  <div className="ml-4">
                    <p className="font-medium dark:text-white">Lucy V</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Galactic Traveler & Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-donjon-indigo mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-donjon-ember mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-donjon-graphite dark:text-white mb-4">
              About Donjon Intelligence Systems
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
                We engineer intelligent, resilient systems that serve as the cognitive strongholds of the modern world — 
                integrating knowledge, automation, and reasoning into fortified architectures that stand the test of time.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-donjon-graphite dark:text-white">Our Philosophy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Above all else show the data. We believe in transparent, data-driven solutions that provide clear
                  insights and measurable results.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-donjon-graphite dark:text-white">Our Approach</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We follow Agile methodologies and DevOps practices to ensure rapid, iterative development and
                  continuous improvement of our AI solutions.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-donjon-indigo/10 dark:bg-donjon-indigo/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-donjon-indigo dark:text-donjon-indigo" />
                  </div>
                  <CardTitle className="text-lg text-donjon-graphite dark:text-white">Expert Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our team consists of AI specialists, data scientists, and software engineers with decades of
                    combined experience.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-donjon-indigo/10 dark:bg-donjon-indigo/20 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-donjon-indigo dark:text-donjon-indigo" />
                  </div>
                  <CardTitle className="text-lg text-donjon-graphite dark:text-white">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We leverage cutting-edge technologies including OpenAI, Google Generative AI, and custom ML models.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-donjon-indigo/10 dark:bg-donjon-indigo/20 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-donjon-indigo dark:text-donjon-indigo" />
                  </div>
                  <CardTitle className="text-lg text-donjon-graphite dark:text-white">Rapid Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our Docker-based infrastructure ensures consistent, reliable deployment of AI solutions.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-donjon-indigo/10 dark:bg-donjon-indigo/20 flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-donjon-indigo dark:text-donjon-indigo" />
                  </div>
                  <CardTitle className="text-lg text-donjon-graphite dark:text-white">Data-Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We prioritize data visualization and transparency in all our solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Fundraising/Kickstarter Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-donjon-indigo mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-donjon-ember mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-donjon-graphite dark:text-white mb-4">
              Support Our Kickstarter
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              Help us bring AI solutions to more businesses by supporting our startup journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-donjon-graphite dark:text-white">Why Support Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">Accelerate development of our AI agent infrastructure</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">
                    Help us bring cutting-edge AI solutions to small businesses
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-donjon-indigo flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">Be part of our journey from the beginning</span>
                </li>
              </ul>
              <div className="pt-4">
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                    <a href="https://buy.stripe.com/00gcN2ctT5Xw4cE004" target="_blank" rel="noopener noreferrer">
                      Donate Now
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/fundraising">Campaign Details</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-[#6366F1] p-6 rounded-xl shadow-lg max-w-xs">
                <img src="/images/supporter-qr-code.png" alt="Donation QR Code" className="w-full h-auto" />
                <p className="text-white text-center text-xl mt-4 font-medium">Scan to donate</p>
                <p className="text-white/80 text-center text-sm mt-1">
                  Or visit:{" "}
                  <a
                    href="https://buy.stripe.com/00gcN2ctT5Xw4cE004"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    buy.stripe.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CastleBackground className="w-full py-16 md:py-20 lg:py-24 bg-donjon-graphite">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Reduce Business Friction?
              </h2>
              <p className="text-gray-300 md:text-xl/relaxed">
                Take the first step towards intelligent, data-driven operations.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" className="bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                <Link href="/login">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20" asChild>
                <Link href="/consultation">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </CastleBackground>
    </main>
  )
}
