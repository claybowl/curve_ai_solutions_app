import Link from "next/link"
import { ArrowRight, CalendarDays, Clock, Target, Users, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SkyBackground } from "@/components/sky-background"

export const metadata = {
  title: "Fundraising Campaign | Curve AI Solutions",
  description: "Support our Kickstarter campaign and help us bring AI solutions to more businesses.",
}

export default function FundraisingPage() {
  // Mock campaign data - in a real app, this would come from an API
  const campaignData = {
    title: "Curve AI Solutions Kickstarter Campaign",
    currentAmount: 5000,
    goalAmount: 250000,
    backers: 42,
    daysLeft: 18,
    startDate: "April 1, 2024",
    endDate: "May 15, 2024",
    story:
      "We're on a mission to help small to medium-sized businesses in Tulsa and beyond leverage the power of AI to transform their operations. With your support, we can accelerate the development of our AI agent infrastructure, making advanced technology accessible to businesses that previously couldn't afford custom AI solutions.",
  }

  // Calculate percentage funded
  const percentFunded = Math.round((campaignData.currentAmount / campaignData.goalAmount) * 100)

  // Donation tiers with updated URLs
  const donationTiers = [
    {
      name: "Supporter",
      amount: 25,
      description: "Show your support for our mission",
      perks: ["Early access to our AI readiness quiz", "Recognition on our supporters page"],
      donateUrl: "https://buy.stripe.com/00gcN2ctT5Xw4cE004",
    },
    {
      name: "Starter",
      amount: 100,
      description: "Perfect for individuals interested in AI",
      perks: [
        "All Supporter rewards",
        "30-minute AI consultation",
        "Access to our prompt library",
        "Access to Curve Ai's LLM Chatbot featuring Cutting Edge Models",
      ],
      donateUrl: "https://donate.stripe.com/aEUdR665v5Xw6kM7sy",
    },
    {
      name: "Business",
      amount: 500,
      description: "Ideal for small businesses",
      perks: [
        "All Starter rewards",
        "1-hour business AI assessment",
        "Custom AI implementation roadmap",
        "Priority access to beta features",
        "Access to Curve Ai's LLM Chatbot featuring Cutting Edge Models",
      ],
      donateUrl: "https://buy.stripe.com/5kA3cs2Tj71AdNecMR",
    },
    {
      name: "Partner",
      amount: 2500,
      description: "For businesses serious about AI integration",
      perks: [
        "All Business rewards",
        "Full AI readiness assessment",
        "2 custom AI agent solutions",
        "2 years of customer service",
        "Your logo on our partner page",
        "Access to Curve Ai's LLM Chatbot featuring Cutting Edge Models",
      ],
      donateUrl: "https://donate.stripe.com/eVa14k9hH0Dc5gI4gj",
    },
  ]

  // Timeline milestones - updated with actual roadmap dates
  const milestones = [
    {
      title: "Campaign Launch",
      date: "April 1, 2024",
      description: "Kickoff of our fundraising campaign",
      completed: true,
    },
    {
      title: "Databases Complete",
      date: "February 28, 2025",
      description: "Core database infrastructure with bot_metric table implementation",
      completed: false,
    },
    {
      title: "AiGent® System Launch",
      date: "March 29, 2025",
      description: "Release of our proprietary AI agent orchestration system",
      completed: false,
    },
    {
      title: "AiPex Launch",
      date: "May 9th, 2025",
      description: "Official launch of our AI platform exchange",
      completed: false,
    },
    {
      title: "Curve AI Official Launch",
      date: "June 28, 2025",
      description: "Full public launch of Curve AI Solutions platform",
      completed: false,
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Banner - Updated with SkyBackground */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              Support Our Growth Journey
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-8">
              Join us in transforming how businesses implement AI solutions by backing our campaign to build the AiGent®
              System and AiPex platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#tiers" rel="noopener noreferrer">
                  Choose a Support Level
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="#tiers">View Donation Tiers</Link>
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>

      {/* Campaign Stats */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Funding Progress Card */}
            <Card className="border-2 border-[#0076FF] shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Funding</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-[#1A365D]">
                        ${campaignData.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 ml-2">
                        raised of ${campaignData.goalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="text-lg font-semibold text-[#0076FF]">{percentFunded}% Funded</span>
                  </div>
                </div>

                <Progress value={percentFunded} className="h-3 mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-[#0076FF] mr-2" />
                      <span className="font-semibold">{campaignData.backers}</span>
                    </div>
                    <p className="text-sm text-gray-500">Backers</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-[#0076FF] mr-2" />
                      <span className="font-semibold">{campaignData.daysLeft}</span>
                    </div>
                    <p className="text-sm text-gray-500">Days Left</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CalendarDays className="h-5 w-5 text-[#0076FF] mr-2" />
                      <span className="font-semibold">{campaignData.endDate}</span>
                    </div>
                    <p className="text-sm text-gray-500">End Date</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold text-[#1A365D] mb-4">Our Vision</h2>
              <p className="text-gray-700 mb-4">{campaignData.story}</p>
              <p className="text-gray-700 mb-6">
                Your support will directly fund the development of our proprietary AiGent® System and AiPex platform,
                scheduled for launch in May 2025. These revolutionary tools will allow businesses to orchestrate AI
                agents, manage databases efficiently, and access a marketplace of specialized AI solutions.
              </p>
              <Button className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" asChild>
                <a href="#tiers">Choose a Support Level</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Goals */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] mb-4">Funding Goals</h2>
              <p className="text-gray-600">Here's what we'll achieve with your support</p>
            </div>

            <div className="space-y-8">
              <div className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-12 before:h-full before:px-px before:bg-gray-300 before:ml-0.5 before:top-6 before:bottom-0">
                  <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0076FF] border-4 border-white text-white">
                    <Target className="w-3 h-3" />
                  </div>
                  <div className="font-caveat font-bold text-xl text-[#0076FF] w-24 hidden sm:block">$10,000</div>
                  <div>
                    <div className="sm:hidden font-caveat font-bold text-xl text-[#0076FF] mb-1">$10,000</div>
                    <div className="text-xl font-bold text-gray-900">Database Infrastructure</div>
                    <div className="text-gray-600">
                      Complete our core database infrastructure with bot_metric tables that calculate and inform bot
                      scores
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-12 before:h-full before:px-px before:bg-gray-300 before:ml-0.5 before:top-6 before:bottom-0">
                  <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0076FF] border-4 border-white text-white">
                    <Target className="w-3 h-3" />
                  </div>
                  <div className="font-caveat font-bold text-xl text-[#0076FF] w-24 hidden sm:block">$25,000</div>
                  <div>
                    <div className="sm:hidden font-caveat font-bold text-xl text-[#0076FF] mb-1">$25,000</div>
                    <div className="text-xl font-bold text-gray-900">AiGent® System Development</div>
                    <div className="text-gray-600">
                      Build our proprietary Lead Supervisor Orchestration Agent with Agent Crew and Message Bus
                      capabilities
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-12 before:h-full before:px-px before:bg-gray-300 before:ml-0.5 before:top-6 before:bottom-0">
                  <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0076FF] border-4 border-white text-white">
                    <Target className="w-3 h-3" />
                  </div>
                  <div className="font-caveat font-bold text-xl text-[#0076FF] w-24 hidden sm:block">$50,000</div>
                  <div>
                    <div className="sm:hidden font-caveat font-bold text-xl text-[#0076FF] mb-1">$50,000</div>
                    <div className="text-xl font-bold text-gray-900">AiPex Platform</div>
                    <div className="text-gray-600">
                      Develop our AI Platform Exchange (AiPex) that connects businesses with specialized AI solutions
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-8 sm:pl-32 py-6 group">
                <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-12 before:h-full before:px-px before:bg-gray-300 before:ml-0.5 before:top-6 before:bottom-0">
                  <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0076FF] border-4 border-white text-white">
                    <Target className="w-3 h-3" />
                  </div>
                  <div className="font-caveat font-bold text-xl text-[#0076FF] w-24 hidden sm:block">$100,000</div>
                  <div>
                    <div className="sm:hidden font-caveat font-bold text-xl text-[#0076FF] mb-1">$100,000</div>
                    <div className="text-xl font-bold text-gray-900">Market Launch</div>
                    <div className="text-gray-600">
                      Fund our official market launch with real money trial accounts and complete platform deployment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section id="tiers" className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] mb-4">Support Levels</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the support tier that works for you and receive exclusive rewards as a thank you for backing our
                mission
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {donationTiers.map((tier) => (
                <Card key={tier.name} className="flex flex-col border-2 hover:border-[#0076FF] transition-all">
                  <CardContent className="flex flex-col flex-grow p-6">
                    <div className="mb-4">
                      <span className="inline-block bg-[#0076FF]/10 text-[#0076FF] px-3 py-1 rounded-full text-sm font-medium">
                        {tier.name}
                      </span>
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-[#1A365D]">${tier.amount}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{tier.description}</p>
                    <div className="mb-6 flex-grow">
                      <h4 className="font-medium text-[#1A365D] mb-2">What's included:</h4>
                      <ul className="space-y-2">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-[#0076FF] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" asChild>
                      <a href={tier.donateUrl} target="_blank" rel="noopener noreferrer">
                        Donate ${tier.amount}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Want to make a custom donation? Choose any amount that works for you.
              </p>
              <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="https://buy.stripe.com/00gcN2ctT5Xw4cE004" target="_blank" rel="noopener noreferrer">
                  Make a Custom Donation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Timeline - Updated with actual roadmap dates */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] mb-4">Project Timeline</h2>
              <p className="text-gray-600">Our roadmap for bringing these AI solutions to life</p>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-8 w-8 flex items-center justify-center ${
                        milestone.completed ? "bg-[#0076FF]" : "bg-gray-300"
                      } text-white`}
                    >
                      {milestone.completed ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className={`w-0.5 h-full ${milestone.completed ? "bg-[#0076FF]" : "bg-gray-300"}`}></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-baseline mb-1">
                      <h3 className="text-lg font-bold text-[#1A365D]">{milestone.title}</h3>
                      <span className="ml-3 text-sm text-gray-500">{milestone.date}</span>
                    </div>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] mb-4">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-2">What is the AiGent® System?</h3>
                <p className="text-gray-600">
                  The AiGent® System is our proprietary AI orchestration platform that includes databases, agent crew
                  management, and a message bus for seamless communication between AI components. It's designed to
                  automate complex business processes through coordinated AI agents.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-2">What is AiPex?</h3>
                <p className="text-gray-600">
                  AiPex (AI Platform Exchange) is our marketplace where businesses can access specialized AI solutions,
                  connect with industry-specific tools, and implement AI capabilities without extensive technical
                  expertise.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-2">When will these products launch?</h3>
                <p className="text-gray-600">
                  According to our roadmap, the AiGent® System will launch on March 29th, 2025, followed by AiPex on May
                  9th, 2025. The official Curve AI platform launch is scheduled for June 28th, 2025.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A365D] mb-2">
                  What happens if you don't reach your funding goal?
                </h3>
                <p className="text-gray-600">
                  This is a flexible funding campaign, which means we'll receive all funds donated regardless of whether
                  we meet our goal. We'll adjust our development timeline accordingly and prioritize the most impactful
                  features first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated with SkyBackground */}
      <SkyBackground className="py-16 bg-gradient-to-b from-[#1A365D] to-[#0076FF] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Join Us in Revolutionizing Business AI
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Your support today will help businesses implement AI solutions tomorrow
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#tiers">Choose a Support Level</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
