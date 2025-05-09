"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"

// Sample Google reviews
const googleReviews = [
  {
    id: 1,
    name: "William H.",
    rating: 5,
    date: "2 months ago",
    review:
      "Clean Machine's attention to detail is unparalleled. They've been caring for my collection for years, and I wouldn't trust anyone else with my vehicles. The ceramic coating they applied to my Mercedes has kept it looking showroom-new despite Oklahoma weather.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Elizabeth T.",
    rating: 5,
    date: "3 weeks ago",
    review:
      "The convenience of their mobile service combined with the exceptional quality of their work makes Clean Machine the obvious choice for discerning vehicle owners. They arrived promptly at my office and completed the service while I was in meetings. Highly recommended.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "James R.",
    rating: 5,
    date: "1 month ago",
    review:
      "I appreciate their discreet, professional approach. They arrive promptly, perform their service with minimal disruption, and leave my vehicles in immaculate condition. Their attention to the fine details sets them apart from other detailers in Tulsa.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Margaret D.",
    rating: 5,
    date: "2 months ago",
    review:
      "After trying several mobile detailing services in Tulsa, I've finally found one that meets my standards. Clean Machine understands the level of care required for luxury vehicles. Their signature detail service restored my Range Rover to better-than-new condition.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Robert K.",
    rating: 4,
    date: "3 months ago",
    review:
      "Very pleased with the ceramic coating service. The team was knowledgeable and took the time to explain the process and benefits. My only suggestion would be to offer more flexible scheduling options for weekends.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
]

export default function GoogleReviews() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleReviews, setVisibleReviews] = useState(3)

  const nextReview = () => {
    if (activeIndex + visibleReviews < googleReviews.length) {
      setActiveIndex(activeIndex + 1)
    } else {
      setActiveIndex(0)
    }
  }

  const prevReview = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else {
      setActiveIndex(googleReviews.length - visibleReviews)
    }
  }

  // Update visible reviews based on screen size
  const updateVisibleReviews = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setVisibleReviews(1)
      } else if (window.innerWidth < 1024) {
        setVisibleReviews(2)
      } else {
        setVisibleReviews(3)
      }
    }
  }

  // Use useEffect to handle window resize and initial setup
  useEffect(() => {
    // Set initial visible reviews count
    updateVisibleReviews()

    // Add event listener for window resize
    window.addEventListener("resize", updateVisibleReviews)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateVisibleReviews)
    }
  }, []) // Empty dependency array ensures this only runs once on mount

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <div className="flex items-center">
          <Image src="/placeholder.svg?height=24&width=24" alt="Google icon" width={24} height={24} className="mr-2" />
          <span className="font-medium">Google Reviews</span>
        </div>
        <div className="flex items-center ml-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <span className="ml-2 text-sm">4.9 (32 reviews)</span>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * (100 / visibleReviews)}%)` }}
          >
            {googleReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / visibleReviews}% - ${(4 * (visibleReviews - 1)) / visibleReviews}px)` }}
              >
                <Card className="h-full bg-white border-none shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src={review.photoUrl || "/placeholder.svg"}
                        alt={review.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-gold text-gold" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{review.review}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevReview}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-elegant text-navy-dark hover:text-burgundy transition-colors"
          aria-label="Previous review"
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextReview}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-elegant text-navy-dark hover:text-burgundy transition-colors"
          aria-label="Next review"
          disabled={activeIndex + visibleReviews >= googleReviews.length}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(googleReviews.length / visibleReviews) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index * visibleReviews)}
            className={`w-2 h-2 rounded-full ${
              index === Math.floor(activeIndex / visibleReviews) ? "bg-navy-dark" : "bg-navy-dark/20"
            }`}
            aria-label={`Go to review page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
