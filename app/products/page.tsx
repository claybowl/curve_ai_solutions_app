import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Bot, Database, Zap, BarChart, Shield, Smartphone, DollarSign, Users, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkyBackground } from "@/components/sky-background"

export const metadata = {
  title: "AI Solutions for Every Budget | Curve AI Solutions",
  description: "Affordable AI automation starting at $49/month. ServicePro SaaS platform and custom solutions for service businesses.",
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
      checkoutUrl: "https://buy.stripe.com/servicepro-starter",
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
      checkoutUrl: "https://buy.stripe.com/servicepro-professional",
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
      checkoutUrl: "https://buy.stripe.com/servicepro-enterprise",
      highlighted: false,
    },
  ]

  // Individual affordable components
  const individualProducts = [
    {
      name: "AI Chatbot Only",
      price: 1500,
      monthlyFee: 79,
      icon: Bot,
      description: "Just the chatbot - perfect if you already have other systems in place",
      features: [
        "AI-powered 24/7 responses",
        "Natural language understanding",
        "Lead qualification",
        "Appointment booking",
        "Easy website integration",
      ],
      checkoutUrl: "https://buy.stripe.com/ai-chatbot-only",
    },
    {
      name: "Workflow Automation",
      price: 1200,
      monthlyFee: 69,
      icon: Zap,
      description: "Automate your repetitive tasks and save hours every week",
      features: [
        "Email/SMS automation",
        "Follow-up sequences",
        "Reminder systems",
        "Data entry automation",
        "Zapier/Make alternative",
      ],
      checkoutUrl: "https://buy.stripe.com/workflow-automation",
    },
    {
      name: "Simple CRM",
      price: 2000,
      monthlyFee: 89,
      icon: Database,
      description: "Basic customer management without the complexity",
      features: [
        "Customer database",
        "Contact history",
        "Basic pipeline",
        "Mobile access",
        "Export capabilities",
      ],
      checkoutUrl: "https://buy.stripe.com/simple-crm",
    },
    {
      name: "Analytics Dashboard",
      price: 800,
      monthlyFee: 39,
      icon: BarChart,
      description: "Simple, visual insights into your business performance",
      features: [
        "Revenue tracking",
        "Conversion metrics",
        "Customer insights",
        "Visual reports",
        "Export to Excel/PDF",
      ],
      checkoutUrl: "https://buy.stripe.com/analytics-dashboard",
    },
  ]

  // Custom implementation (for those who need it)
  const customPackages = [
    {
      name: "Quick Start Custom",
      tagline: "Affordable Custom Setup",
      price: 2500,
      monthlyFee: 99,
      timeline: "3-4 weeks",
      description: "Custom chatbot and automation built for your specific needs",
      features: [
        "Custom AI training",
        "Your branding",
        "Basic automation",
        "Training sessions",
        "30-day support",
      ],
      checkoutUrl: "https://buy.stripe.com/quickstart-custom",
    },
    {
      name: "Professional Custom",
      tagline: "Full Custom Build",
      price: 8500,
      monthlyFee: 199,
      timeline: "6-8 weeks",
      description: "Complete custom implementation with advanced features",
      features: [
        "Full custom CRM",
        "Advanced automation",
        "Custom integrations",
        "Team training",
        "90-day support",
      ],
      checkoutUrl: "https://buy.stripe.com/professional-custom",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
              Affordable AI for Everyone
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              AI Automation That Won't Break the Bank
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-4">
              From $49/month with no setup fees. Get started today with ServicePro, or build something custom for your unique needs.
            </p>
            <p className="max-w-[700px] mx-auto text-gray-200 text-lg mb-8">
              Join hundreds of small businesses saving 10-20 hours per week with AI automation
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
                <a href="#custom">See Custom Options</a>
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

      {/* Demo Section */}
      <section id="demo" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">See It In Action</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Real examples of how our AI automates customer service and workflows
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">AI Chatbot Example</CardTitle>
                  <CardDescription>
                    Watch how our AI handles appointment scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800">
                    <Image
                      src="/solutions/chatbot-demo-1.png"
                      alt="AI Chatbot demo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Workflow Automation</CardTitle>
                  <CardDescription>
                    See how workflows connect everything together
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[400px] bg-gray-900">
                    <Image
                      src="/solutions/workflow-diagram.png"
                      alt="Workflow diagram"
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Components */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Or Buy Individual Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Just need one thing? Pick exactly what you need and nothing more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {individualProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.name} className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <IconComponent className="h-10 w-10 text-[#0076FF] dark:text-blue-400" />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#1A365D] dark:text-blue-300">
                            ${product.price}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            + ${product.monthlyFee}/mo
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" asChild>
                        <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer">
                          Get This Tool
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Options */}
      <section id="custom" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Need Something Custom?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We can build exactly what you need, tailored to your business processes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {customPackages.map((pkg) => (
                <Card key={pkg.name} className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                  <CardHeader>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-[#0076FF] dark:text-blue-400">{pkg.tagline}</span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-[#1A365D] dark:text-blue-300">
                        ${pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        + ${pkg.monthlyFee}/month • {pkg.timeline}
                      </div>
                    </div>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" asChild>
                      <a href={pkg.checkoutUrl} target="_blank" rel="noopener noreferrer">
                        Get Started
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Enterprise & Complex Projects</h3>
                </div>
                <p className="mb-4 text-white/90">
                  Multi-location operations, franchises, or need something truly unique? We build custom enterprise solutions starting at $25,000.
                </p>
                <p className="mb-6 text-white/90">
                  Includes dedicated development team, unlimited users, white-label options, and 24/7 support.
                </p>
                <Button className="bg-white text-[#0076FF] hover:bg-gray-100" asChild>
                  <Link href="/contact">
                    Let's Talk About Your Needs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
              Ready to Save 10-20 Hours Per Week?
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Join hundreds of small businesses using AI to work smarter, not harder
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#servicepro">Start at $49/Month</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/contact">Schedule Free Call</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-200">
              No credit card required to explore • 30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
