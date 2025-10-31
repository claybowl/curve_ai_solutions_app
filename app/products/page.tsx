import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Bot, Database, Zap, BarChart, Shield, Smartphone, DollarSign, Users, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkyBackground } from "@/components/sky-background"

export const metadata = {
  title: "ServicePro AI Platform | Curve AI Solutions",
  description: "Ready-to-use AI platform starting at $49/month. Complete automation for service businesses with no setup fees.",
}

export default function ProductsPage() {
  // ServicePro SaaS Platform - LEAD WITH THESE!
  const serviceProTiers = [
    {
      name: "ServicePro Starter",
      tagline: "For Solo Operators & Small Teams",
      price: 49,
      isMonthly: true,
      timeline: "Instant Access • No Setup Fee",
      description: "Ready-to-use AI customer service platform. Start automating today.",
      features: [
        "AI-powered chatbot for inquiries",
        "Appointment scheduling & calendar sync",
        "Customer database (up to 100)",
        "Email & SMS notifications",
        "Weather-aware scheduling",
        "Single user account",
        "Mobile-responsive",
        "Email support",
      ],
      results: [
        "24/7 automated responses",
        "Never miss appointments",
        "Save 5-10 hours/week",
      ],
      checkoutUrl: "https://buy.stripe.com/cNifZhdNH4k69q701a7AI0n",
      highlighted: false,
    },
    {
      name: "ServicePro Professional",
      tagline: "Most Popular",
      price: 149,
      isMonthly: true,
      timeline: "Instant Access • No Setup Fee",
      description: "Complete AI platform for growing service businesses",
      features: [
        "Everything in Starter, plus:",
        "Advanced AI with memory",
        "Unlimited customers",
        "Automated invoicing & payments",
        "Google Calendar & Maps",
        "Multi-language support",
        "Up to 5 users",
        "Custom branding",
        "Priority support",
      ],
      results: [
        "90% reduction in admin time",
        "Professional experience",
        "ROI in 60 days",
        "Save 15-20 hours/week",
      ],
      checkoutUrl: "https://buy.stripe.com/14A14ncJD9EqeKr3dm7AI0o",
      highlighted: true,
    },
    {
      name: "ServicePro Enterprise",
      tagline: "Multi-Location Ready",
      price: 299,
      isMonthly: true,
      timeline: "Instant Access • No Setup Fee",
      description: "Full platform for established multi-location operations",
      features: [
        "Everything in Professional, plus:",
        "Multi-location management",
        "Advanced analytics",
        "API access",
        "Unlimited users",
        "White-label options",
        "Dedicated manager",
        "24/7 support",
      ],
      results: [
        "Scale across locations",
        "Enterprise automation",
        "Deep insights",
        "Custom integrations",
      ],
      checkoutUrl: "https://buy.stripe.com/14A8wP9xraIu9q74hq7AI0p",
      highlighted: false,
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
              Ready-to-Use AI Platform
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              ServicePro: Complete AI Platform for Service Businesses
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-4">
              From $49/month with no setup fees. Start automating your service business today.
            </p>
            <p className="max-w-[700px] mx-auto text-gray-200 text-lg mb-8">
              Join hundreds of small businesses saving 10-20 hours per week with our AI platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#servicepro">
                  Start at $49/Month
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/solutions">See All Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>

      {/* ServicePro SaaS Platform - FIRST! */}
      <section id="servicepro" className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Recommended for Most Businesses</Badge>
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                ServicePro: Ready-to-Use Platform
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                No setup fees. Cancel anytime. Start automating your business today with our proven platform.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {serviceProTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`flex flex-col ${
                    tier.highlighted
                      ? "border-4 border-[#FF7F00] dark:border-[#FF7F00] shadow-xl scale-105 relative"
                      : "border-2 hover:border-[#0076FF] dark:border-gray-700 dark:hover:border-blue-600"
                  } transition-all`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#FF7F00] text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1 inline" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-[#0076FF] dark:text-blue-400">{tier.tagline}</span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-[#1A365D] dark:text-blue-300">
                          ${tier.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {tier.timeline}
                      </div>
                    </div>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6 bg-blue-50 dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-semibold text-sm text-[#1A365D] dark:text-blue-300 mb-2">What You'll Get:</h4>
                      {tier.results.map((result, i) => (
                        <div key={i} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <ChevronRight className="h-4 w-4 text-[#0076FF] mr-1 flex-shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-[#FF7F00] hover:bg-[#FF7F00]/90"
                          : "bg-[#0076FF] hover:bg-[#0076FF]/90"
                      } text-white`}
                      size="lg"
                      asChild
                    >
                      <a href={tier.checkoutUrl} target="_blank" rel="noopener noreferrer">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">Not sure which plan?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start with Starter, upgrade anytime. Or schedule a free 15-minute call to discuss your needs.
              </p>
              <Button variant="outline" className="border-[#0076FF] text-[#0076FF] hover:bg-[#0076FF] hover:text-white" asChild>
                <Link href="/contact">Talk to Us (It's Free)</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Our Promise to You</h2>
              <p className="text-gray-600 dark:text-gray-400">We stand behind our work with these commitments</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    30-Day Money Back
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Try any SaaS plan risk-free. Not satisfied? Full refund within 30 days, no questions asked.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Cancel Anytime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    No long-term contracts. Cancel your subscription anytime with one click. You own your data.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    99.9% Uptime SLA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    We guarantee 99.9% uptime. Any downtime gets you a prorated credit on your monthly bill.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Transparent Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    What you see is what you pay. No hidden fees, no surprise charges, no price increases for existing customers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SkyBackground className="py-16 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Automate Your Service Business?
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Join hundreds of service businesses saving 10-20 hours per week with ServicePro
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#servicepro">Get Started at $49/Month</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/solutions">See All Solutions</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-200">
              No setup fees • 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
