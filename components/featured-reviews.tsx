import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

// Featured Google reviews
const featuredReviews = [
  {
    id: 1,
    name: "William H.",
    rating: 5,
    review:
      "Clean Machine's attention to detail is unparalleled. They've been caring for my collection for years, and I wouldn't trust anyone else with my vehicles. The ceramic coating they applied to my Mercedes has kept it looking showroom-new despite Oklahoma weather.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Elizabeth T.",
    rating: 5,
    review:
      "The convenience of their mobile service combined with the exceptional quality of their work makes Clean Machine the obvious choice for discerning vehicle owners. They arrived promptly at my office and completed the service while I was in meetings. Highly recommended.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "James R.",
    rating: 5,
    review:
      "I appreciate their discreet, professional approach. They arrive promptly, perform their service with minimal disruption, and leave my vehicles in immaculate condition. Their attention to the fine details sets them apart from other detailers in Tulsa.",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
]

export default function FeaturedReviews() {
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="flex items-center mb-8 justify-center">
        <div className="flex items-center">
          <Image src="/placeholder.svg?height=24&width=24" alt="Google icon" width={24} height={24} className="mr-2" />
          <span className="font-medium">Featured Google Reviews</span>
        </div>
        <div className="flex items-center ml-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <span className="ml-2 text-sm">5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredReviews.map((review) => (
          <Card key={review.id} className="bg-white border-none shadow-elegant h-full">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-gold mb-4" />
              <p className="text-sm leading-relaxed mb-6 italic">"{review.review}"</p>
              <div className="flex items-center mt-auto">
                <Image
                  src={review.photoUrl || "/placeholder.svg"}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{review.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-gold text-gold" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
