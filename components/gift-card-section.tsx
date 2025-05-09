"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift } from "lucide-react"
import Image from "next/image"

export default function GiftCardSection() {
  return (
    <Card className="bg-white border-none shadow-elegant overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Clean Machine Gift Card"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-4 inline-flex items-center">
              <Gift className="h-6 w-6 text-gold mr-2" />
              <h3 className="text-2xl font-playfair">Gift Cards</h3>
            </div>
            <p className="mb-6 text-muted-foreground">
              Give the gift of a pristine vehicle. Our gift cards are perfect for birthdays, holidays, or any special
              occasion.
            </p>
            <div className="space-y-4">
              <p>Available in any denomination</p>
              <p>Redeemable for any of our services</p>
              <p>Delivered instantly via email</p>
            </div>
            <Button
              className="mt-6 bg-navy-dark text-ivory hover:bg-navy-dark/90"
              onClick={() => window.open("https://squareup.com/gift/EDQKXPXWCXQWM/order", "_blank")}
            >
              Purchase Gift Card
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
