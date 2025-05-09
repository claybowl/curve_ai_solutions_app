"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ConsultationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What happens during the initial consultation?",
      answer:
        "During the initial consultation, our team will discuss your business goals, challenges, and current technology infrastructure. We'll ask questions to understand your specific needs and explain how our AI solutions can address them. This session typically lasts 45-60 minutes and can be conducted virtually or in person.",
    },
    {
      question: "Is there a fee for the initial consultation?",
      answer:
        "No, the initial consultation is complimentary. We believe in providing value upfront and helping you understand how our solutions can benefit your business before any commitment is made.",
    },
    {
      question: "How do I prepare for the consultation?",
      answer:
        "To make the most of your consultation, we recommend having a clear idea of your business challenges and goals. Consider what processes you'd like to improve, what data you currently collect, and any specific outcomes you're hoping to achieve. Having key stakeholders present during the consultation is also beneficial.",
    },
    {
      question: "What happens after the consultation?",
      answer:
        "Following the consultation, our team will develop a tailored proposal based on your needs. This proposal will include recommended solutions, implementation timeline, and investment details. We'll schedule a follow-up meeting to present this proposal and answer any questions you may have.",
    },
    {
      question: "How long does the entire consultation process take?",
      answer:
        "The consultation framework typically spans 4-5 weeks from initial discovery to proposal presentation. However, this timeline can be adjusted based on the complexity of your needs and the availability of key stakeholders for interviews and feedback sessions.",
    },
    {
      question: "Do you offer consultations for specific industries?",
      answer:
        "Yes, we have experience working with businesses across various industries including finance, healthcare, manufacturing, retail, and more. Our team includes industry specialists who understand the unique challenges and opportunities in different sectors.",
    },
  ]

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card
          key={index}
          className={`border-2 ${openIndex === index ? "border-[#0076FF]" : "border-gray-200"} transition-all`}
        >
          <CardContent className="p-0">
            <button
              className="flex items-center justify-between w-full p-6 text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="text-lg font-medium text-[#1A365D]">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-[#0076FF]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 pt-0">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
