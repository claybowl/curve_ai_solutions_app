import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkyBackground } from "@/components/sky-background"
import { VideoAvatar } from "@/components/video-avatar"
import {
  Check,
  Calendar,
  ArrowRight,
  Users,
  Zap,
  Database,
  MessageSquare,
  Workflow,
  BarChart4,
  Clock,
} from "lucide-react"

export const metadata = {
  title: "About Curve AI Solutions",
  description: "Learn about our mission to transform businesses with AI agent infrastructure solutions.",
}

export default function AboutPage() {
  // Team members
  const teamMembers = [
    {
      name: "Clayton Christian",
      role: "Founder & CTO",
      bio: "Machine Learning Engineering diploma holder with extreme creativity and dedication to development. AI visionary with extensive experience in building agent-based systems and trading infrastructure.",
      image: "/images/clayton_christian.png",
      video: "/videos/austin_belcheff.mp4",
    },
    {
      name: "Austin Belcheff",
      role: "Founder & CEO",
      bio: "Business graduate from Oklahoma State University and a creative force driving innovation within the company.",
      image: "/images/austin_belcheff.png",
      video: "/videos/clayton_christian.mp4",
    },
  ]

  // Core values
  const coreValues = [
    {
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible with AI agent technology.",
      icon: <Zap className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Accessibility",
      description: "We make advanced AI solutions accessible to businesses of all sizes.",
      icon: <Users className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Transparency",
      description: "We believe in transparent, data-driven solutions with clear insights and measurable results.",
      icon: <Database className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our products and services.",
      icon: <Check className="h-6 w-6 text-[#0076FF]" />,
    },
  ]

  // What we do
  const whatWeDo = [
    {
      title: "Simplify Complex Processes",
      description: "We translate technical concepts into everyday language that anyone can understand.",
      icon: <MessageSquare className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Automate Data Analysis",
      description: "We automate data analysis and integration that would otherwise take hours of manual work.",
      icon: <BarChart4 className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Reduce Operational Costs",
      description: "We streamline workflows and eliminate inefficiencies to reduce your operational costs.",
      icon: <Workflow className="h-6 w-6 text-[#0076FF]" />,
    },
    {
      title: "Free Up Your Time",
      description: "We help you focus on what truly matters—growing your business and serving your customers.",
      icon: <Clock className="h-6 w-6 text-[#0076FF]" />,
    },
  ]

  // Key milestones from the roadmap
  const keyMilestones = [
    {
      date: "February 28, 2025",
      title: "Databases Complete",
      description: "Core database infrastructure with bot_metric table implementation",
    },
    {
      date: "March 29, 2025",
      title: "AiGent® System Launch",
      description: "Release of our proprietary AI agent orchestration system",
    },
    {
      date: "April 11, 2025",
      title: "Lead Supervisor Orchestration Agent",
      description: "Deployment of our advanced AI orchestration capabilities",
    },
    {
      date: "April 24, 2025",
      title: "Industry Expansion",
      description: "Onboarding of new clients and industry partners",
    },
    {
      date: "May 9th, 2025",
      title: "AiPex Launch",
      description: "Official launch of our AI Platform Exchange",
    },
    {
      date: "June 28, 2025",
      title: "Curve AI Official Launch",
      description: "Full public launch with stock market integration and real money accounts",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              About Curve AI Solutions
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-8">
              Transforming Business Through Accessible AI
            </p>
          </div>
        </div>
      </SkyBackground>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative pb-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-xl bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/YGiQRGNc_U8"
                  title="Curve AI Solutions Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-[#1A365D]">See Our Vision in Action</h3>
                <p className="text-gray-600 mt-2">
                  Watch how Curve AI Solutions is transforming businesses with accessible AI technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="lead text-xl text-gray-700 dark:text-gray-300">
                At Curve AI Solutions, we're not just another tech company. We're a team of innovators, problem-solvers,
                and business enthusiasts who believe that artificial intelligence should be accessible, practical, and
                valuable for businesses of all sizes—including yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Founded in Tulsa with a simple yet powerful vision: to demystify AI and make it work for real businesses
                facing real challenges. We saw too many small business owners feeling left behind by the AI
                revolution—either intimidated by the technical complexity or unsure how this technology could actually
                improve their bottom line.
              </p>
              <p className="dark:text-gray-300">
                That's when we asked ourselves: What if AI could be both powerful AND approachable? What if we could
                translate the complex world of artificial intelligence into solutions that any business owner could
                understand, implement, and benefit from immediately?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">What We Do</h2>
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              We create custom AI chatbots and workflow solutions (we call them Agentic AI Solutions) that handle the
              mundane, repetitive tasks consuming your valuable time. Our CurveAI technology doesn't just process
              data—it understands context, learns your business needs, and communicates with a personality tailored to
              your company culture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {whatWeDo.map((item, index) => (
              <Card key={index} className="border-0 bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0076FF]/10 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A365D] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">Why Small Business Owners Choose Us</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Unlike large corporate AI solutions that require teams of engineers to implement, or basic chatbots that
                can only follow simple scripts, our technology strikes the perfect balance: sophisticated enough to
                deliver real results, simple enough that you don't need a computer science degree to use it.
              </p>
              <p className="dark:text-gray-300">When you work with Curve AI Solutions, you get:</p>
              <ul className="dark:text-gray-300">
                <li>Practical AI tools designed for your specific business challenges—not theoretical capabilities</li>
                <li>Solutions that speak human—no technical jargon, no endless documentation</li>
                <li>
                  Measurable results with clear ROI—we're about improving your business, not just showcasing fancy
                  technology
                </li>
                <li>
                  A partner who understands your business needs and translates them into effective AI implementations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">Our Approach</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                We believe in starting with your business problems, not with technology. Our process is straightforward:
              </p>
              <ol className="dark:text-gray-300">
                <li>Listen to understand your specific challenges and goals</li>
                <li>Design a customized AI solution that addresses your unique needs</li>
                <li>Implement the technology seamlessly into your existing workflows</li>
                <li>Measure the results to ensure you're getting real value</li>
                <li>Refine the solution based on feedback and changing business needs</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* The Magic Behind Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">The Magic Behind Our Solutions</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                While we keep the technical talk to a minimum when working with clients, rest assured that under the
                hood, our solutions leverage cutting-edge AI frameworks and advanced software engineering. Our team
                brings expertise in machine learning, natural language processing, and data integration—all so you don't
                have to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Commitment Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">Community Commitment</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                We're deeply invested in the Tulsa business community and beyond. Through our AI Literacy Program, we're
                helping local business leaders, professionals, and interested parties understand and leverage AI
                technologies. Our seminars, online content, and collaborations with local businesses bring AI education
                closer to where people live and work.
              </p>
              <p className="dark:text-gray-300">
                By building strategic partnerships with other tech companies, educational institutions, and industry
                leaders, we're creating an ecosystem where businesses of all sizes can thrive in the digital age.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">What Sets Us Apart</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                The difference is in our philosophy: we believe AI should work for you, not the other way around. Many
                AI companies make you adapt to their technology; we adapt our technology to fit your business.
              </p>
              <p className="dark:text-gray-300">
                Our solutions don't require you to learn new systems, hire technical staff, or completely overhaul your
                operations. Instead, we meet you where you are and enhance what you're already doing.
              </p>
              <p className="dark:text-gray-300">
                And unlike impersonal chatbots or generic AI tools, our solutions come with personalities that reflect
                your brand and create engaging experiences for both your team and your customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-12 text-center">Meet Our Team</h2>

          <div className="flex flex-wrap justify-center gap-16 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center max-w-xs">
                <div className="mb-4 relative mx-auto w-48 h-48 overflow-hidden">
                  {member.video ? (
                    <VideoAvatar src={member.video} alt={member.name} className="w-48 h-48" />
                  ) : (
                    <div className="rounded-full overflow-hidden w-48 h-48">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1A365D]">{member.name}</h3>
                <p className="text-[#0076FF] font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-12 text-center">Our Core Values</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-0 bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0076FF]/10 flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A365D] mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Transform Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6 text-center">Ready to Transform Your Business?</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Imagine significantly reducing your workload, automating data analysis, and integrating information
                across your systems—all while maintaining the human touch that makes your business special.
              </p>
              <p className="dark:text-gray-300">That's not just a dream; it's what we deliver every day to businesses like yours.</p>
              <p className="dark:text-gray-300">
                Whether you're looking to streamline customer service, automate administrative tasks, or gain insights
                from your business data without the headache, we have the expertise, tools, and approach to make it
                happen.
              </p>
              <p className="dark:text-gray-300">
                Let's take the first step together toward a more efficient, productive, and profitable future for your
                business. The AI revolution doesn't have to be complicated or confusing—with Curve AI Solutions as your
                partner, it can be the competitive advantage you've been looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-12 text-center">Our Roadmap</h2>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {keyMilestones.map((milestone, index) => (
                <div key={index} className="relative pl-8 sm:pl-32 py-4">
                  <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-12 before:h-full before:px-px before:bg-gray-300 dark:before:bg-gray-600 before:ml-0.5 before:top-6 before:bottom-0">
                    <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0076FF] border-4 border-white dark:border-gray-900 text-white">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <div className="font-bold text-lg text-[#0076FF] w-32 hidden sm:block">{milestone.date}</div>
                    <div>
                      <div className="sm:hidden font-bold text-lg text-[#0076FF] mb-1">{milestone.date}</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{milestone.title}</div>
                      <div className="text-gray-600 dark:text-gray-300">{milestone.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SkyBackground className="py-16 bg-gradient-to-b from-[#1A365D] to-[#0076FF] text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Connect With Us</h2>
            <p className="mb-8 text-xl text-gray-100">
              Take the first step toward transforming your business with AI that works for you, not against you.
              Schedule a consultation today, and let's explore how Curve AI Solutions can address your specific business
              challenges with practical, effective AI tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <Link href="/consultation">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
