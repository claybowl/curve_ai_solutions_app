import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkyBackground } from "@/components/sky-background"
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
  title: "About Donjon Intelligence Systems",
  description: "Learn about our mission to build resilient AI intelligence platforms that think, adapt, and endure.",
}

export default function AboutPage() {
  // Team members
  const teamMembers = [
    {
      name: "Clayton Christian",
      role: "Founder & CTO",
      bio: "Machine Learning Engineering diploma holder with extreme creativity and dedication to development. AI visionary with extensive experience in building agent-based systems, trading infrastructure, and resilient intelligence platforms. Passionate about creating AI systems that think, adapt, and endure.",
      image: "/images/clayton_christian.png",
    },
  ]

  // Core values
  const coreValues = [
    {
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible with AI agent technology.",
      icon: <Zap className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Accessibility",
      description: "We make advanced AI solutions accessible to businesses of all sizes.",
      icon: <Users className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Transparency",
      description: "We believe in transparent, data-driven solutions with clear insights and measurable results.",
      icon: <Database className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every aspect of our products and services.",
      icon: <Check className="h-6 w-6 text-donjon-indigo" />,
    },
  ]

  // What we do
  const whatWeDo = [
    {
      title: "Simplify Complex Processes",
      description: "We translate technical concepts into everyday language that anyone can understand.",
      icon: <MessageSquare className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Automate Data Analysis",
      description: "We automate data analysis and integration that would otherwise take hours of manual work.",
      icon: <BarChart4 className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Reduce Operational Costs",
      description: "We streamline workflows and eliminate inefficiencies to reduce your operational costs.",
      icon: <Workflow className="h-6 w-6 text-donjon-indigo" />,
    },
    {
      title: "Free Up Your Time",
      description: "We help you focus on what truly matters—growing your business and serving your customers.",
      icon: <Clock className="h-6 w-6 text-donjon-indigo" />,
    },
  ]

  // Key milestones from the roadmap - Updated November 11, 2025
  const keyMilestones = [
    {
      date: "November 11, 2025",
      title: "Roadmap Refresh",
      description: "Strategic realignment and updated product roadmap for Donjon Intelligence Systems",
    },
    {
      date: "November 2025",
      title: "Customer Site Template",
      description: "Live deployment of customizable customer site templates for AI solutions",
    },
    {
      date: "December 2025",
      title: "ServicePro Launch",
      description: "Official launch of ServicePro - our comprehensive service management platform",
    },
    {
      date: "January 2026",
      title: "New Agent Line-up",
      description: "Release of expanded AI agent portfolio with enhanced capabilities and integrations",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-donjon-graphite via-donjon-indigo to-donjon-graphite">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              About Donjon Intelligence Systems
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-8">
              Where We Keep Intelligence Secure
            </p>
          </div>
        </div>
      </SkyBackground>

      {/* Video Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative pb-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-xl bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/YGiQRGNc_U8"
                  title="Donjon Intelligence Systems Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-donjon-graphite dark:text-donjon-indigo">See Our Vision in Action</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Watch how Donjon Intelligence Systems is building resilient AI platforms that think, adapt, and endure
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
                At Donjon Intelligence Systems, we engineer resilient intelligence platforms that integrate knowledge, 
                automation, and reasoning into architectures built to scale and evolve. We're not just building AI systems—we're 
                creating secure, adaptable intelligence that endures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Founded with a vision to build AI systems that don't just process information—they understand context, 
                learn from experience, and adapt to changing conditions. The Donjon represents our commitment to securing 
                intelligence: creating platforms that protect knowledge while making it accessible and actionable.
              </p>
              <p className="dark:text-gray-300">
                We recognized that modern AI systems need more than raw computational power. They need architecture that 
                endures, knowledge systems that evolve, and security that protects what matters most. The Donjon is where 
                we keep intelligence secure—not locked away, but carefully guarded and intelligently deployed.
              </p>
              <p className="dark:text-gray-300">
                Our approach combines cutting-edge machine learning with robust engineering principles, creating systems 
                that think critically, adapt dynamically, and operate reliably in production environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">What We Do</h2>
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              We engineer intelligent platforms that integrate knowledge graphs, automated reasoning, and secure data 
              architectures. Our systems don't just execute tasks—they build understanding, maintain context across 
              interactions, and evolve with your mission. We specialize in agent-based AI systems, workflow orchestration, 
              and knowledge management infrastructure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {whatWeDo.map((item, index) => (
              <Card key={index} className="border-0 bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-donjon-indigo/10 dark:bg-donjon-indigo/30 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-donjon-graphite dark:text-donjon-indigo mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
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
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">Why Organizations Choose Us</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                In a world where AI systems are often fragile, opaque, or resource-intensive, we build intelligence platforms 
                that are resilient, transparent, and efficient. Our systems are designed for production environments where 
                reliability and security matter as much as capability.
              </p>
              <p className="dark:text-gray-300">When you work with Donjon Intelligence Systems, you get:</p>
              <ul className="dark:text-gray-300">
                <li><strong>Resilient Architecture:</strong> Systems built to handle edge cases, recover from failures, and adapt to changing conditions</li>
                <li><strong>Secure Intelligence:</strong> Knowledge systems that protect sensitive information while remaining accessible and actionable</li>
                <li><strong>Evolutionary Design:</strong> Platforms that learn and improve over time, not static solutions that become obsolete</li>
                <li><strong>Production-Ready:</strong> Engineered for reliability, scalability, and maintainability in real-world environments</li>
                <li><strong>Integrated Solutions:</strong> Seamless integration of knowledge management, workflow automation, and AI reasoning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">Our Approach</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                We build intelligence systems through a rigorous engineering process focused on resilience and security:
              </p>
              <ol className="dark:text-gray-300">
                <li><strong>Architecture Design:</strong> Design robust system architectures that can scale and adapt</li>
                <li><strong>Knowledge Integration:</strong> Integrate knowledge management, memory systems, and reasoning capabilities</li>
                <li><strong>Secure Implementation:</strong> Build with security and privacy as foundational principles</li>
                <li><strong>Testing & Validation:</strong> Rigorous testing under real-world conditions to ensure reliability</li>
                <li><strong>Continuous Evolution:</strong> Systems that learn, adapt, and improve over time based on experience</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* The Magic Behind Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">The Technology Behind Our Solutions</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Our platforms leverage advanced AI and software engineering principles: knowledge graph architectures for 
                persistent memory, agent-based systems for autonomous operation, workflow orchestration for complex 
                processes, and secure data architectures for protecting sensitive information. We combine state-of-the-art 
                machine learning with robust engineering practices to create systems that are both powerful and reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Commitment Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">Open Development & Knowledge Sharing</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                We believe in transparent development practices and contributing to the broader AI and software engineering 
                communities. Our work is grounded in open-source principles, rigorous documentation, and knowledge sharing.
              </p>
              <p className="dark:text-gray-300">
                Through partnerships with research institutions, technology companies, and the developer community, we're 
                helping advance the state of resilient AI systems and secure intelligence platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">What Sets Us Apart</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                The difference is in our engineering philosophy: we build systems that endure. Many AI solutions are 
                prototypes that work in demos but fail in production. We engineer systems for reliability, security, and 
                long-term operation.
              </p>
              <p className="dark:text-gray-300">
                Our platforms integrate knowledge management with agent-based reasoning, creating systems that remember, 
                learn, and adapt. Unlike stateless APIs or simple chatbots, our solutions maintain context, build 
                understanding over time, and evolve with experience.
              </p>
              <p className="dark:text-gray-300">
                Security isn't an afterthought—it's foundational. We design systems that protect intelligence while 
                making it accessible and actionable. The Donjon keeps your intelligence secure, not locked away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-donjon-graphite dark:text-donjon-indigo mb-12 text-center">Meet Our Team</h2>

          <div className="flex flex-wrap justify-center gap-16 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center max-w-xs">
                <div className="mb-4 relative mx-auto w-48 h-48 overflow-hidden">
                  <div className="rounded-full overflow-hidden w-48 h-48 border-4 border-donjon-indigo shadow-lg">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-donjon-graphite dark:text-donjon-indigo">{member.name}</h3>
                <p className="text-donjon-indigo dark:text-donjon-indigo font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-donjon-graphite dark:text-donjon-indigo mb-12 text-center">Our Core Values</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-0 bg-white dark:bg-gray-800 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-donjon-indigo/10 dark:bg-donjon-indigo/30 flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-donjon-graphite dark:text-donjon-indigo mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
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
            <h2 className="text-3xl font-bold text-donjon-graphite dark:text-white mb-6 text-center">Ready to Build Resilient Intelligence?</h2>
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <p className="dark:text-gray-300">
                Imagine AI systems that remember context, learn from experience, and adapt to changing conditions. 
                Systems that integrate knowledge management with autonomous reasoning, creating intelligence that endures 
                and evolves.
              </p>
              <p className="dark:text-gray-300">
                Whether you're building agent-based systems, workflow orchestration platforms, or secure knowledge 
                management infrastructure, we have the expertise to help you create solutions that are both powerful 
                and production-ready.
              </p>
              <p className="dark:text-gray-300">
                Let's discuss how Donjon Intelligence Systems can help you build resilient AI platforms that think, 
                adapt, and endure. The future of intelligence isn't just about processing power—it's about architecture 
                that secures knowledge and systems that evolve.
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
                    <div className="absolute left-0 sm:left-10 top-6 flex items-center justify-center w-5 h-5 rounded-full bg-donjon-indigo border-4 border-white dark:border-gray-900 text-white">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <div className="font-bold text-lg text-donjon-indigo dark:text-donjon-indigo w-32 hidden sm:block">{milestone.date}</div>
                    <div>
                      <div className="sm:hidden font-bold text-lg text-donjon-indigo dark:text-donjon-indigo mb-1">{milestone.date}</div>
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
      <SkyBackground className="py-16 bg-gradient-to-b from-donjon-graphite via-donjon-indigo to-donjon-graphite text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Connect With Us</h2>
            <p className="mb-8 text-xl text-gray-100">
              Take the first step toward building resilient intelligence platforms that endure. Schedule a consultation 
              to explore how Donjon Intelligence Systems can help you create AI systems that think, adapt, and secure your 
              knowledge.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-donjon-ember hover:bg-donjon-ember/90 text-white" asChild>
                <Link href="/consultation">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 dark:border-white/30 dark:hover:bg-white/30"
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
