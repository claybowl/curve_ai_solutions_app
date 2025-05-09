import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export default function PaymentOptions() {
  const paymentMethods = [
    {
      name: "PayPal",
      icon: "/images/paypal-icon.png",
      link: "https://www.paypal.com/paypalme/CleanMachineTulsa",
      username: "@CleanMachineTulsa",
    },
    {
      name: "Cash App",
      icon: "/placeholder.svg?height=40&width=40",
      link: "https://cash.app/$CleanMachineTulsa",
      username: "$CleanMachineTulsa",
    },
    {
      name: "Venmo",
      icon: "/placeholder.svg?height=40&width=40",
      link: "https://account.venmo.com/u/CleanMachineTulsa",
      username: "@CleanMachineTulsa",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-playfair text-center mb-6">Payment Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.name} className="bg-white border-none shadow-elegant">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 h-12 flex items-center justify-center">
                  <Image
                    src={method.icon || "/placeholder.svg"}
                    alt={`${method.name} icon`}
                    width={method.name === "PayPal" ? 80 : 40}
                    height={method.name === "PayPal" ? 40 : 40}
                    className="mx-auto"
                  />
                </div>
                <h4 className="font-playfair text-lg mb-1">{method.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{method.username}</p>
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-navy-dark hover:text-burgundy transition-colors text-sm font-medium"
                >
                  Pay with {method.name} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        For your convenience, we accept multiple digital payment methods.
      </p>
    </div>
  )
}
