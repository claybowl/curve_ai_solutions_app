import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-donjon-graphite via-donjon-indigo to-donjon-graphite">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-donjon-silver">Page Not Found</h2>
        <p className="text-xl mb-8 text-donjon-silver/80">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-donjon-ember hover:bg-donjon-ember/90">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-donjon-silver text-white hover:bg-white/10">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

