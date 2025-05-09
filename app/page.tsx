import Link from "next/link"
import { ArrowRight, BarChart2, Database, Shield, Zap, Bot, LineChart, Workflow, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/custom-card"
import DataVisualization from "@/components/data-visualization"
import { SkyBackground } from "@/components/sky-background"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <SkyBackground className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-[#0A1929] via-[#1A365D] to-[#0076FF]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Takeoff with Curve AI Solutions
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  The Anti-Gravity for business. Breakaway with no resistance.
                </p>
              </div>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                We build AI agent systems that transform how businesses interact with data, creating frictionless
                operations and intelligent decision-making processes.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
                  Request a conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  Explore Solutions
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <DataVisualization />
            </div>
          </div>
        </div>
      </SkyBackground>

      {/* Coming Soon Banner - New section highlighting upcoming launches */}
      <section className="w-full py-8 bg-[#0076FF]/10 dark:bg-[#0076FF]/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#0076FF] dark:text-[#3b82f6]" />
              <h3 className="text-lg font-bold text-[#1A365D] dark:text-white">Coming Soon:</h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1A365D] dark:text-gray-200">AiGent® System</span>
                <span className="text-xs bg-[#0076FF] text-white px-2 py-0.5 rounded-full">May 31st, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1A365D] dark:text-gray-200">AiPex Launch</span>
                <span className="text-xs bg-[#0076FF] text-white px-2 py-0.5 rounded-full">May 9, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1A365D] dark:text-gray-200">Official Launch</span>
                <span className="text-xs bg-[#0076FF] text-white px-2 py-0.5 rounded-full">Jun 28, 2025</span>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="text-[#0076FF] border-[#0076FF] dark:text-[#3b82f6] dark:border-[#3b82f6] dark:hover:bg-[#3b82f6]/10"
            >
              <Link href="/about">View Full Roadmap</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Healthcare Assessment Section - Updated with better styling */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <Card className="border-2 border-[#0076FF] overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-[#1A365D] to-[#0076FF] text-white py-6">
              <CardTitle className="text-2xl font-bold">AI Readiness Assessment</CardTitle>
              <CardDescription className="text-gray-100">Complete our comprehensive questionnaire</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-gray-700">
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-[#1A365D] dark:text-white">Why take the assessment?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Identify AI opportunities specific to your business
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Receive a personalized implementation roadmap
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Understand potential ROI and resource requirements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-600 dark:text-gray-200">
                        Get expert recommendations tailored to your industry
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-[#1A365D] dark:text-white">What you'll receive:</h3>
                  <p className="text-gray-600 dark:text-gray-200 mb-6">
                    A comprehensive report with actionable insights and a clear path forward for AI integration in your
                    business.
                  </p>
                  <Button className="w-full bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
                    Start Your Assessment
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
              <div className="w-16 h-1 bg-[#0076FF] mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-[#FF7F00] mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1A365D] dark:text-white mb-4">
              Our Solutions
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              We offer a comprehensive suite of AI agent infrastructure solutions to help businesses automate workflows,
              reduce friction, and accelerate growth.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* AI Agent Development Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-[#0076FF] dark:hover:border-[#3b82f6] hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-[#1A365D] dark:text-white">AiGent® System</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Our proprietary AI orchestration platform with agent crew management and message bus capabilities.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="/about"
                  className="text-[#0076FF] dark:text-[#3b82f6] hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Data Visualization Suite */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-[#0076FF] dark:hover:border-[#3b82f6] hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-[#1A365D] dark:text-white">Data Visualization Suite</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Transform complex data into actionable insights with advanced visualization tools.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="#"
                  className="text-[#0076FF] dark:text-[#3b82f6] hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* Trading System Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-[#0076FF] dark:hover:border-[#3b82f6] hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl text-[#1A365D] dark:text-white">AiPex Platform</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI Platform Exchange connecting businesses with specialized AI solutions and tools.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="/about"
                  className="text-[#0076FF] dark:text-[#3b82f6] hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>

            {/* n8n Integration Tools */}
            <Card className="border border-gray-200 dark:border-gray-700 hover:border-[#0076FF] dark:hover:border-[#3b82f6] hover:shadow-md transition-all dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl text-[#1A365D] dark:text-white">n8n Integration Tools</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Seamlessly integrate AI capabilities into your n8n workflows.
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href="#"
                  className="text-[#0076FF] dark:text-[#3b82f6] hover:underline font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="border-[#0076FF] text-[#0076FF] hover:bg-[#0076FF]/10 dark:border-[#3b82f6] dark:text-[#3b82f6] dark:hover:bg-[#3b82f6]/10"
            >
              View All Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Client Success Stories - Updated with better cards */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-[#0076FF] mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-[#FF7F00] mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1A365D] dark:text-white mb-4">
              Client Success Stories
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              Real results from our AI solutions
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {/* Success Story 1 */}
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
              <div className="h-2 bg-[#1A365D]"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-[#1A365D] dark:text-white">
                  "Curve Ai has magic hands!"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Small Business Owner - Client</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Wow, Clayton! Really an amazingly thorough outline. I can't wait to see everything implemented as we
                  progress. Thank you for the excellent work and timely update!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1A365D] flex items-center justify-center text-white font-bold">
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
                <CardTitle className="text-2xl font-bold text-[#1A365D] dark:text-white">
                  "5x the Fun in Half the Time"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">The Metaverse of Shenanigans</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Since integrating Curve AI's awesome technology into our digital playgrounds, the frequency of
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
              <div className="h-2 bg-[#FF7F00]"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-[#1A365D] dark:text-white">
                  "Simplifying Complexity, One Mind at a Time"
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Futuristic Space Exploration</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Curve AI's innovative solutions have been instrumental in streamlining our mission control processes,
                  allowing us to allocate more resources to the really important stuff – like searching for
                  extraterrestrial life and enjoying the breathtaking views of the cosmos!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF7F00] flex items-center justify-center text-white font-bold">
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
              <div className="w-16 h-1 bg-[#0076FF] mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-[#FF7F00] mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1A365D] dark:text-white mb-4">
              About Curve AI
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
                We build AI agent systems that transform how businesses interact with data, creating frictionless
                operations and intelligent decision-making processes.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1A365D] dark:text-white">Our Philosophy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Above all else show the data. We believe in transparent, data-driven solutions that provide clear
                  insights and measurable results.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1A365D] dark:text-white">Our Approach</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We follow Agile methodologies and DevOps practices to ensure rapid, iterative development and
                  continuous improvement of our AI solutions.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#0076FF]/10 dark:bg-[#0076FF]/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-[#0076FF] dark:text-[#3b82f6]" />
                  </div>
                  <CardTitle className="text-lg text-[#1A365D] dark:text-white">Expert Team</CardTitle>
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
                  <div className="w-12 h-12 rounded-lg bg-[#0076FF]/10 dark:bg-[#0076FF]/20 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-[#0076FF] dark:text-[#3b82f6]" />
                  </div>
                  <CardTitle className="text-lg text-[#1A365D] dark:text-white">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We leverage cutting-edge technologies including OpenAI, Google Generative AI, and custom ML models.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#0076FF]/10 dark:bg-[#0076FF]/20 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-[#0076FF] dark:text-[#3b82f6]" />
                  </div>
                  <CardTitle className="text-lg text-[#1A365D] dark:text-white">Rapid Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our Docker-based infrastructure ensures consistent, reliable deployment of AI solutions.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#0076FF]/10 dark:bg-[#0076FF]/20 flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-[#0076FF] dark:text-[#3b82f6]" />
                  </div>
                  <CardTitle className="text-lg text-[#1A365D] dark:text-white">Data-Driven</CardTitle>
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
              <div className="w-16 h-1 bg-[#0076FF] mx-auto mb-2"></div>
              <div className="w-10 h-1 bg-[#FF7F00] mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#1A365D] dark:text-white mb-4">
              Support Our Kickstarter
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
              Help us bring AI solutions to more businesses by supporting our startup journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1A365D] dark:text-white">Why Support Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">Accelerate development of our AI agent infrastructure</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">
                    Help us bring cutting-edge AI solutions to small businesses
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                    ✓
                  </div>
                  <span className="dark:text-gray-300">Be part of our journey from the beginning</span>
                </li>
              </ul>
              <div className="pt-4">
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
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
      <SkyBackground className="w-full py-16 md:py-20 lg:py-24 bg-[#1A365D]">
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
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
                Start Your Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
