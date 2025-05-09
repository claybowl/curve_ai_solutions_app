import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Curve AI's consultation process was thorough and insightful. They took the time to understand our business challenges and provided practical AI solutions that have significantly improved our operations.",
      author: "Jody Beeson",
      position: "Founder, Clean Machine Tulsa",
      company: "Clean Machine Tulsa",
      initials: "JB",
      color: "bg-[#1A365D]",
    },
    {
      quote:
        "The consultation framework Curve AI used helped us identify opportunities for AI integration that we hadn't even considered. Their expertise and structured approach made the process smooth and valuable.",
      author: "Michael Rodriguez",
      position: "CTO, TechForward Solutions",
      company: "TechForward Solutions",
      initials: "MR",
      color: "bg-[#7928CA]",
    },
    {
      quote:
        "What impressed me most about Curve AI's consultation was how they translated complex technical concepts into business value. Their recommendations were practical and aligned perfectly with our goals.",
      author: "Sarah Johnson",
      position: "Operations Director, Midwest Manufacturing",
      company: "Midwest Manufacturing",
      initials: "SJ",
      color: "bg-[#FF7F00]",
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-lg">
          <div className={`h-2 ${testimonial.color}`}></div>
          <CardContent className="p-6">
            <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold`}
              >
                {testimonial.initials}
              </div>
              <div className="ml-4">
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-xs text-gray-500">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
