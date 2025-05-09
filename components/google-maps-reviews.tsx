"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export default function GoogleMapsReviews() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col space-y-4">
        <Card className="border-none shadow-elegant overflow-hidden">
          <CardContent className="p-0 h-[600px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-dark"></div>
              </div>
            )}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206657.43603921275!2d-95.90025195!3d36.12283185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b693dd8d017e55%3A0x7cb35eb2eddc390a!2sClean%20Machine%20Mobile%20Auto%20Detail!5e0!3m2!1sen!2sus!4v1712444800000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoading(false)}
              className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}
            ></iframe>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <a
            href="https://www.google.com/maps/place/Clean+Machine+Mobile+Auto+Detail/@36.1228319,-95.900252,11z/data=!4m18!1m9!3m8!1s0x87b693dd8d017e55:0x7cb35eb2eddc390a!2sClean+Machine+Mobile+Auto+Detail!8m2!3d36.096482!4d-95.899222!9m1!1b1!16s%2Fg%2F11fn78x8vs!3m7!1s0x87b693dd8d017e55:0x7cb35eb2eddc390a!8m2!3d36.096482!4d-95.899222!9m1!1b1!16s%2Fg%2F11fn78x8vs?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-navy-dark hover:text-burgundy transition-colors font-medium text-sm"
          >
            View all reviews on Google Maps <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
