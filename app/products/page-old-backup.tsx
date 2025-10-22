import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Bot, Database, Zap, BarChart, Shield, Smartphone, DollarSign, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkyBackground } from "@/components/sky-background"

export const metadata = {
  title: "Digital Transformation Suite | Curve AI Solutions",
  description: "Transform your local service business with AI-powered automation, CRM, and workflow solutions designed for windows & doors, HVAC, roofing, and home services.",
}

export default function ProductsPage() {
  // ServicePro SaaS Platform tiers - Lead with affordable SaaS!
  const servicProTiers = [
    {
      name: "ServicePro Starter",
      tagline: "For Solo Operators & Small Teams",
      price: 49,
      monthlyFee: 49,
      isMonthly: true,
      setupFee: 0,
      timeline: "Instant Access",
      description: "Ready-to-use AI customer service platform. Start automating today with no upfront costs.",
      features: [
        "AI-powered chatbot for customer inquiries",
        "Appointment scheduling & calendar sync",
        "Basic customer database (up to 100 customers)",
        "Email & SMS notifications",
        "Weather-aware scheduling",
        "Single user account",
        "Mobile-responsive interface",
        "Email support",
      ],
      results: [
        "24/7 automated customer responses",
        "Eliminate phone tag with customers",
        "Never miss an appointment",
      ],
      checkoutUrl: "https://buy.stripe.com/servicepro-starter",
      highlighted: false,
    },
    {
      name: "ServicePro Professional",
      tagline: "Most Popular for Growing Businesses",
      price: 149,
      monthlyFee: 149,
      isMonthly: true,
      setupFee: 0,
      timeline: "Instant Access",
      description: "Complete AI automation platform for service businesses with 3-10 employees",
      features: [
        "Everything in Starter, plus:",
        "Advanced AI with context awareness",
        "Unlimited customer database",
        "Automated invoicing & payments",
        "Google Calendar & Maps integration",
        "Multi-language support",
        "Custom industry configuration",
        "Up to 5 user accounts",
        "Priority support",
        "Custom branding options",
      ],
      results: [
        "90% reduction in admin time",
        "Professional customer experience",
        "Automated billing & payments",
        "ROI in first 60 days",
      ],
      checkoutUrl: "https://buy.stripe.com/servicepro-professional",
      highlighted: true,
    },
    {
      name: "ServicePro Enterprise",
      tagline: "For Established Multi-Location Operations",
      price: 299,
      monthlyFee: 299,
      isMonthly: true,
      setupFee: 0,
      timeline: "Instant Access",
      description: "Full-featured platform for businesses with multiple locations or 10+ employees",
      features: [
        "Everything in Professional, plus:",
        "Multi-location management",
        "Advanced analytics & reporting",
        "Custom workflow automation",
        "API access for integrations",
        "Unlimited user accounts",
        "White-label options",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom training sessions",
      ],
      results: [
        "Scalable across locations",
        "Enterprise-level automation",
        "Deep business insights",
        "Custom integration support",
      ],
      checkoutUrl: "https://buy.stripe.com/servicepro-enterprise",
      highlighted: false,
    },
  ]

  // Custom implementation tiers - More affordable than before!
  const customImplementationTiers = [
    {
      name: "Quick Start Package",
      tagline: "Perfect for Solo Operators",
      price: 2500,
      monthlyFee: 99,
      timeline: "3-4 weeks",
      description: "Get a custom AI chatbot and basic automation setup for your business",
      features: [
        "Basic CRM with customer tracking",
        "AI chatbot for 24/7 customer inquiries",
        "Appointment booking system",
        "Email automation sequences",
        "Mobile-responsive web app",
        "Standard support",
      ],
      results: [
        "90% reduction in quote turnaround time",
        "24/7 availability for customers",
        "Automated follow-ups",
      ],
      checkoutUrl: "https://buy.stripe.com/starter-package", // You'll need to create these in Stripe
      highlighted: false,
    },
    {
      name: "Professional Suite",
      tagline: "Most Popular - Complete Transformation",
      price: 35000,
      monthlyFee: 1200,
      timeline: "16 weeks",
      description: "The complete digital transformation package for established businesses with 4-10 employees",
      features: [
        "Full CRM with lifecycle tracking",
        "Advanced AI chatbot with lead scoring",
        "Predictive analytics & forecasting",
        "Custom integrations with your tools",
        "Automated quote generation (15 min vs 2-3 days)",
        "Installation coordination workflows",
        "Review generation campaigns",
        "Real-time performance dashboards",
        "Progressive Web App (PWA)",
        "99.9% uptime SLA",
        "Priority support",
      ],
      results: [
        "95% reduction in quote turnaround time",
        "25%+ increase in conversion rates",
        "30%+ improvement in revenue per lead",
        "ROI achieved in 6-9 months",
      ],
      checkoutUrl: "https://buy.stripe.com/professional-suite",
      highlighted: true,
    },
    {
      name: "Enterprise Solution",
      tagline: "For Multi-Location Operations",
      price: 75000,
      monthlyFee: 2500,
      timeline: "26 weeks",
      description: "Enterprise-grade solution for multi-location businesses, franchises, and teams of 10+ employees",
      features: [
        "Everything in Professional Suite",
        "AR product visualization",
        "Custom agent network orchestration",
        "White-label branding options",
        "Multi-location dashboard",
        "Advanced analytics & BI",
        "Custom workflow automation",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom training programs",
      ],
      results: [
        "Scalable across multiple locations",
        "Unified operations management",
        "Enterprise-level security",
        "Custom feature development",
      ],
      checkoutUrl: "https://buy.stripe.com/enterprise-solution",
      highlighted: false,
    },
  ]

  // Individual add-ons and standalone products
  const individualProducts = [
    {
      name: "AI Customer Service Chatbot",
      price: 5000,
      monthlyFee: 200,
      icon: Bot,
      description: "24/7 AI-powered customer service that handles inquiries, quotes, and appointment booking",
      features: [
        "Natural language understanding",
        "Instant response (under 1 hour)",
        "Lead qualification",
        "Appointment scheduling",
        "Integration with your calendar",
      ],
      checkoutUrl: "https://buy.stripe.com/ai-chatbot",
    },
    {
      name: "Smart CRM System",
      price: 8000,
      monthlyFee: 300,
      icon: Database,
      description: "Complete customer lifecycle tracking from first contact to installation and beyond",
      features: [
        "Customer data management",
        "Pipeline visualization",
        "Document management",
        "Communication history",
        "Mobile access",
      ],
      checkoutUrl: "https://buy.stripe.com/smart-crm",
    },
    {
      name: "Workflow Automation Engine",
      price: 6000,
      monthlyFee: 250,
      icon: Zap,
      description: "Automate repetitive tasks and streamline your business operations",
      features: [
        "Automated follow-up sequences",
        "Quote generation automation",
        "Installation coordination",
        "Review request campaigns",
        "Payment reminders",
      ],
      checkoutUrl: "https://buy.stripe.com/workflow-automation",
    },
    {
      name: "Business Intelligence Dashboard",
      price: 4000,
      monthlyFee: 150,
      icon: BarChart,
      description: "Real-time insights and analytics to make data-driven decisions",
      features: [
        "Revenue tracking",
        "Conversion analytics",
        "Performance metrics",
        "Customer satisfaction monitoring",
        "Forecasting tools",
      ],
      checkoutUrl: "https://buy.stripe.com/business-intelligence",
    },
  ]

  // Premium add-ons
  const addOns = [
    {
      name: "AR Product Visualization",
      setupFee: 8000,
      monthlyFee: 200,
      description: "Let customers visualize your products in their space using augmented reality",
    },
    {
      name: "Financing Integration",
      setupFee: 3000,
      monthlyFee: 0,
      description: "Integrate with Medallion, GreenSky, and other financing platforms",
    },
    {
      name: "Multi-Location Dashboard",
      setupFee: 5000,
      monthlyFee: 300,
      description: "Manage multiple locations from a single, unified dashboard",
    },
    {
      name: "Voice Commerce (Alexa/Google)",
      setupFee: 4000,
      monthlyFee: 150,
      description: "Enable voice-activated ordering and customer service",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#FF7F00] text-white hover:bg-[#FF7F00]/90">
              Now Available
            </Badge>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              Digital Transformation Suite
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-4">
              Transform your windows & doors, HVAC, roofing, or home services business with an intelligent automation
              platform that works 24/7
            </p>
            <p className="max-w-[700px] mx-auto text-gray-200 text-lg mb-8">
              95% reduction in quote turnaround time • 25%+ increase in conversion rates • 30%+ improvement in revenue
              per lead
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#packages">
                  View Packages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <a href="#demo">See How It Works</a>
              </Button>
            </div>
          </div>
        </div>
      </SkyBackground>

      {/* What You Get Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                What&apos;s Included in the Suite
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                A complete platform designed specifically for local service businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                <CardHeader>
                  <Bot className="h-10 w-10 text-[#0076FF] dark:text-blue-400 mb-2" />
                  <CardTitle className="text-xl">AI-Powered Customer Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      24/7 chatbot for inquiries & quotes
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Instant lead response (under 1 hour)
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Automated follow-up sequences
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                <CardHeader>
                  <Database className="h-10 w-10 text-[#0076FF] dark:text-blue-400 mb-2" />
                  <CardTitle className="text-xl">Smart CRM & Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Complete lifecycle tracking
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Automated quote generation
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Intelligent lead scoring
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                <CardHeader>
                  <Zap className="h-10 w-10 text-[#0076FF] dark:text-blue-400 mb-2" />
                  <CardTitle className="text-xl">Workflow Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Appointment scheduling & sync
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Installation coordination
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Review generation campaigns
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                <CardHeader>
                  <BarChart className="h-10 w-10 text-[#0076FF] dark:text-blue-400 mb-2" />
                  <CardTitle className="text-xl">Business Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Real-time dashboards
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Revenue analytics & forecasting
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Performance metrics
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599] text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">Enterprise-Grade Infrastructure</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Progressive Web App (mobile-responsive)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>99.9% uptime guarantee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Bank-level security (AES-256 encryption)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Seamless integrations with existing tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section with Images */}
      <section id="demo" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">See It In Action</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Real examples of how our AI agents handle customer interactions and automate workflows
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">AI Chatbot Conversation</CardTitle>
                  <CardDescription>
                    Watch how our AI handles customer inquiries, collects information, and schedules appointments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800">
                    <Image
                      src="/solutions/chatbot-demo-1.png"
                      alt="AI Chatbot handling customer appointment scheduling"
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Intelligent Quote Generation</CardTitle>
                  <CardDescription>
                    See how our system gathers requirements and provides instant, accurate quotes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800">
                    <Image
                      src="/solutions/chatbot-demo-2.png"
                      alt="AI Chatbot generating custom quotes"
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Automated Workflow Architecture</CardTitle>
                <CardDescription>
                  Our Scissorial Agent orchestrates complex workflows to automate your entire business process
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-[500px] bg-gray-900">
                  <Image
                    src="/solutions/workflow-diagram.png"
                    alt="Automated workflow diagram showing Scissorial Agent orchestration"
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Product Tiers */}
      <section id="packages" className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Choose Your Package</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Select the package that best fits your business size and needs. All packages include setup, training,
                deployment, and ongoing support.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {productTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`flex flex-col ${
                    tier.highlighted
                      ? "border-4 border-[#FF7F00] dark:border-[#FF7F00] shadow-xl scale-105"
                      : "border-2 hover:border-[#0076FF] dark:border-gray-700 dark:hover:border-blue-600"
                  } transition-all relative`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#FF7F00] text-white px-4 py-1 text-sm">Most Popular</Badge>
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
                          ${tier.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">setup</span>
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                        + ${tier.monthlyFee}/month
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {tier.timeline} implementation
                      </div>
                    </div>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1A365D] dark:text-blue-300 mb-3">Features:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1A365D] dark:text-blue-300 mb-3">Expected Results:</h4>
                      <ul className="space-y-2">
                        {tier.results.map((result, i) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-[#0076FF] dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{result}</span>
                          </li>
                        ))}
                      </ul>
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

            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-[#1A365D] dark:text-blue-300 mb-2">Not Sure Which Package?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Schedule a free consultation and we&apos;ll help you choose the perfect solution for your business
              </p>
              <Button variant="outline" className="border-[#0076FF] text-[#0076FF] hover:bg-[#0076FF] hover:text-white" asChild>
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">
                Or Buy Individual Components
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Start with a single solution and expand as your business grows
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
                            ${product.price.toLocaleString()}
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
                          Purchase Now
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

      {/* Add-Ons Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Premium Add-Ons</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enhance your package with these advanced features
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {addOns.map((addon) => (
                <Card key={addon.name} className="border-2 hover:border-[#0076FF] dark:hover:border-blue-600 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#1A365D] dark:text-blue-300">
                          ${addon.setupFee.toLocaleString()}
                        </div>
                        {addon.monthlyFee > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            +${addon.monthlyFee}/mo
                          </div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{addon.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Want to discuss custom add-ons or integrations?
              </p>
              <Button variant="outline" className="border-[#0076FF] text-[#0076FF] hover:bg-[#0076FF] hover:text-white" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Our Guarantees</h2>
              <p className="text-gray-600 dark:text-gray-400">We stand behind our solutions with these commitments</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Money-Back Milestone Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    If Phase 1 deliverables don&apos;t meet specifications, receive a full refund of your setup fee
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ROI Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    If the system doesn&apos;t reduce quote time by 80%+ within 90 days post-launch, get one month free
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
                    We guarantee 99.9% uptime or your monthly fee will be prorated for any downtime
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-orange-200 dark:border-orange-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Exit Clause
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    You own all code and data. Includes 30-day transition support if you ever need to leave
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
              Ready to Transform Your Business?
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Join the growing number of local service businesses leveraging AI to grow faster and serve customers better
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <a href="#packages">Choose Your Package</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-200">
              Questions? Contact us for a free consultation and custom quote
            </p>
          </div>
        </div>
      </SkyBackground>
    </main>
  )
}
