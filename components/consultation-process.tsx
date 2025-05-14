import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, Users, PieChart, Lightbulb, FileText, Zap } from "lucide-react"

export function ConsultationProcess() {
  const steps = [
    {
      icon: <ClipboardList className="h-8 w-8 text-[#0076FF]" />,
      title: "Discovery",
      description:
        "We begin with a thorough assessment of your business needs, challenges, and goals to understand your unique situation.",
      timeframe: "Week 1",
    },
    {
      icon: <Users className="h-8 w-8 text-[#0076FF]" />,
      title: "Stakeholder Interviews",
      description:
        "We conduct interviews with key stakeholders to gather insights and understand different perspectives within your organization.",
      timeframe: "Week 1-2",
    },
    {
      icon: <PieChart className="h-8 w-8 text-[#0076FF]" />,
      title: "Data Analysis",
      description:
        "Our team analyzes your existing data infrastructure, processes, and workflows to identify opportunities for AI integration.",
      timeframe: "Week 2-3",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-[#0076FF]" />,
      title: "Solution Design",
      description:
        "We design a tailored AI solution that addresses your specific needs and aligns with your business objectives.",
      timeframe: "Week 3-4",
    },
    {
      icon: <FileText className="h-8 w-8 text-[#0076FF]" />,
      title: "Proposal Presentation",
      description:
        "We present a comprehensive proposal that outlines the recommended solutions, implementation timeline, and expected outcomes.",
      timeframe: "Week 4",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#0076FF]" />,
      title: "Implementation Planning",
      description:
        "Once approved, we develop a detailed implementation plan with clear milestones, responsibilities, and success metrics.",
      timeframe: "Week 5",
    },
  ]

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-6">Our Consultation Framework</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          We've developed a structured approach to help businesses identify and implement AI solutions that drive real
          value. Our six-step process ensures we thoroughly understand your needs and deliver tailored recommendations.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={index} className="border-2 border-[#0076FF]/10 hover:border-[#0076FF] transition-all dark:border-blue-800/50 dark:hover:border-blue-700">
            <CardContent className="p-6">
              <div className="w-16 h-16 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#1A365D] dark:text-blue-300">{step.title}</h3>
                <span className="text-sm font-medium text-[#0076FF] bg-[#0076FF]/10 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {step.timeframe}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#0076FF]/5 dark:bg-blue-900/20 p-6 rounded-lg max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-[#1A365D] dark:text-blue-300 mb-4">Why Our Approach Works</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
              ✓
            </div>
            <span className="text-gray-700 dark:text-gray-200">Tailored to your specific business needs and industry context</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
              ✓
            </div>
            <span className="text-gray-700 dark:text-gray-200">Focuses on practical solutions with measurable business impact</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
              ✓
            </div>
            <span className="text-gray-700 dark:text-gray-200">Involves key stakeholders throughout the process to ensure alignment</span>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0076FF] flex items-center justify-center text-white text-xs mr-2 mt-0.5">
              ✓
            </div>
            <span className="text-gray-700 dark:text-gray-200">Provides clear implementation roadmap with defined milestones</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
