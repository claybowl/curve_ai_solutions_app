import Link from "next/link"
import { Button } from "@/components/ui/button"
import GoogleMapsReviews from "@/components/google-maps-reviews"
import FeaturedReviews from "@/components/featured-reviews"
import PaymentOptions from "@/components/payment-options"

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-playfair mb-4">Client Testimonials</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Read what our clients have to say about their experience with Clean Machine Mobile Detailing. We pride
            ourselves on delivering exceptional service and results that exceed expectations.
          </p>
        </div>

        <div className="mb-16">
          <FeaturedReviews />
          <GoogleMapsReviews />
        </div>

        <div className="my-16">
          <PaymentOptions />
        </div>

        <div className="text-center">
          <p className="text-lg mb-6">Ready to experience the Clean Machine difference for yourself?</p>
          <Button asChild className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
            <Link href="/schedule">Schedule Your Service</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
