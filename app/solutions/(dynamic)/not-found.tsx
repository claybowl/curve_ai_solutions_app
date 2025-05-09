import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Solution Not Found</h1>
      <p className="text-xl mb-8">Sorry, the solution you're looking for doesn't exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/solutions">Browse All Solutions</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
