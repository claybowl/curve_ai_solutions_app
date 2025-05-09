"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "Clean Machine's attention to detail is unparalleled. They've been caring for my collection for years, and I wouldn't trust anyone else with my vehicles.",
    author: "William H.",
    title: "Collector, Tulsa",
  },
  {
    id: 2,
    quote:
      "The convenience of their mobile service combined with the exceptional quality of their work makes Clean Machine the obvious choice for discerning vehicle owners.",
    author: "Elizabeth T.",
    title: "Executive, Broken Arrow",
  },
  {
    id: 3,
    quote:
      "I appreciate their discreet, professional approach. They arrive promptly, perform their service with minimal disruption, and leave my vehicles in immaculate condition.",
    author: "James R.",
    title: "Attorney, Tulsa",
  },
]

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="bg-white border-none shadow-elegant">
                <CardContent className="p-8 text-center">
                  <Quote className="h-10 w-10 text-gold mx-auto mb-6" />
                  <p className="text-lg italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-playfair font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-elegant text-navy-dark hover:text-burgundy transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-elegant text-navy-dark hover:text-burgundy transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-navy-dark" : "bg-navy-dark/20"}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
