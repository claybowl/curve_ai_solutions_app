import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-forest" />
        </div>
        <h1 className="text-3xl md:text-4xl font-playfair mb-6">Thank You for Your Request</h1>
        <p className="text-lg mb-8">
          We've received your appointment request and will contact you shortly to confirm the details. If you have any
          immediate questions, please call us at (918) 856-5304.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-navy-dark text-navy-dark hover:bg-navy-dark/5">
            <Link href="/services">Explore Our Services</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
