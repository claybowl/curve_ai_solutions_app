import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Clock, DollarSign } from "lucide-react"
import GiftCardSection from "@/components/gift-card-section"

interface ServiceFeature {
  text: string
}

interface DetailService {
  id: string
  title: string
  subtitle: string
  description: string
  price: string
  duration: string
  features: ServiceFeature[]
  imageSrc: string
}

interface AdditionalService {
  title: string
  price: string
  description?: string
}

const detailServices: DetailService[] = [
  {
    id: "full-detail",
    title: "Full Detail",
    subtitle: "Our Most Popular Service",
    description: "Aimed at making your vehicle look and feel like brand new, this is our most popular service.",
    price: "$225-300",
    duration: "2-4 hours",
    features: [
      { text: "Carpet & upholstery steamed & shampooed" },
      { text: "Leather cleaned & conditioned" },
      { text: "Thorough vacuuming" },
      { text: "Spot treat headliner" },
      { text: "Interior windows and glass cleaned" },
      { text: "Trim, dash, plastics cleaned & dressed with UV protection" },
      { text: "Gentle hand Wash" },
      { text: "Durable ceramic spray wax on paint & glass" },
      { text: "Clay paint- removes imbedded contaminates" },
      { text: "Clean wheels | Tires | Dress Tires" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "interior-detail",
    title: "Interior Detail",
    subtitle: "Deep Interior Cleaning",
    description: "Aims to clean the interior to it's best possible condition, top-to-bottom, front-to-back.",
    price: "$150-250",
    duration: "1-4 hours",
    features: [
      { text: "Thorough vacuuming" },
      { text: "Carpet & upholstery steamed & shampooed" },
      { text: "Leather cleaned & conditioned" },
      { text: "Spot treat headliner" },
      { text: "Interior windows and glass cleaned" },
      { text: "Trim, dash, plastics cleaned & dressed with UV protection" },
      { text: "*Add leather/upholstery protectant!" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "maintenance-detail",
    title: "Maintenance Detail Program",
    subtitle: "Regular Upkeep Service",
    description:
      "A hand wash & spray wax, vacuum and interior wipedown is the best way to keep your vehicle protected and looking great in-between details. Recommended every 3 months.",
    price: "$125-175",
    duration: "1-2 hours",
    features: [
      { text: "Thorough hand Wash" },
      { text: "Hydrophobic ceramic spray wax on paint & glass" },
      { text: "Clean wheels | Tires | Dress Tires" },
      { text: "Wipedown Dash | Console | Panels" },
      { text: "Spot treat small stains" },
      { text: "Vacuum Interior" },
      { text: "Glass Cleaned inside & out" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "paint-enhancement",
    title: "Paint Enhancement / Light Polish",
    subtitle: "Exterior Perfection",
    description:
      "The complete exterior detail. Removes many water spots and swirls dramatically enhancing your paint's shine & gloss while waxing paint for over 3 months with top-of-the-line Rupes Uno Protect.",
    price: "$150-200",
    duration: "1-3 hours",
    features: [
      { text: "Hand wash, wheels | tires | tire dressing" },
      { text: "Bug and tar removal" },
      { text: "Paint decontamination - Iron removal & clay" },
      { text: "Machine Polish & Wax w/ Rupes Uno Protect" },
      { text: "Ceramic sealant on windows & wheels" },
      { text: "Clean interior windows" },
      { text: "Black trim treatment" },
      { text: "Polish exhaust tips" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "ceramic-coating",
    title: "Ceramic Coatings",
    subtitle: "Premium Long-Term Protection",
    description:
      "Ceramic Coatings offer the best paint protection and gloss available on the market today. Including our 1 or 2-step polish, a true SiO2 coating is certainly the best thing you can do for the health and appearance of your vehicle.",
    price: "1-Year $300 | 3-year $750",
    duration: "Varies",
    features: [
      { text: "Hand wash, wheels | tires | tire dressing" },
      { text: "Paint decontamination - Iron removal & clay" },
      { text: "1-stage (1yr) or 2-stage (3yr) compound & polish 60-90% correction" },
      { text: "Window Sealant" },
      { text: "Black trim conditioner" },
      { text: "Polish exhaust tips" },
      { text: "1 or 3 year Nasial SiO2 coating hand applied to exterior paint and wheel faces" },
      { text: "*Guaranteed by Clean Machine!" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "motorcycle-detail",
    title: "Motorcycle Detail",
    subtitle: "For Two-Wheel Enthusiasts",
    description: "Keep your motorcycle looking its best with our specialized detailing service.",
    price: "$150-175",
    duration: "Varies",
    features: [
      { text: "Machine polish remove light swirls and renew the shine & luster of your paint" },
      { text: "Thorough hand wash" },
      { text: "Wax paint and windscreen" },
      { text: "Condition leather, vinyl, rubber or plastic seats/trim" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "premium-wash",
    title: "Premium Wash",
    subtitle: "Quick Refresh",
    description: "Thorough hand wash with durable ceramic wax.",
    price: "$75",
    duration: "Varies",
    features: [
      { text: "Hand wash paint" },
      { text: "Clay paint- removes imbedded contaminates" },
      { text: "Hand wash wheels, tires & wheel wells" },
      { text: "Clean and seal exterior glass and windows" },
      { text: "Durable ceramic spray wax for 3-months of protection" },
    ],
    imageSrc: "/placeholder.svg?height=300&width=400",
  },
]

const additionalServices: AdditionalService[] = [
  { title: "Headlight restoration", price: "$25 per lens", description: "Improves visibility & appearance" },
  { title: "Engine steam cleaned & dressed", price: "$30" },
  { title: "Scratch & Paint Chip Repair", price: "$100+" },
  { title: "Leather & Upholstery Protector", price: "$50-75" },
  { title: "Glass/Windshield Protector", price: "$40" },
  { title: "Permanent black trim restoration", price: "$45+" },
  { title: "Seat & carpet shampoo only", price: "$80-120", description: "Depending on condition" },
  { title: "Paint overspray removal", price: "Call for estimate" },
  { title: "Emblem Debadgeing", price: "$45+" },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-playfair mb-4">Our Services</h1>
        <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Clean Machine Auto Detail offers extensive detailing services ranging from Upholstery shampoo & Headlight
          restoration to Paint Correction & Ceramic Coatings, right in your driveway!
        </p>
        <p className="text-muted-foreground max-w-3xl mx-auto mt-4 font-medium">Prices dependent upon size/condition</p>
      </div>

      {/* Main Services */}
      <div className="space-y-16 mb-20">
        {detailServices.map((service, index) => (
          <div
            key={service.id}
            className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            <div className="lg:col-span-1">
              <div className="relative h-64 lg:h-full rounded-lg overflow-hidden">
                <Image src={service.imageSrc || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl md:text-3xl font-playfair mb-2">{service.title}</h2>
                <p className="text-lg text-muted-foreground mb-4">{service.subtitle}</p>
                <p className="mb-4">{service.description}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-forest mr-1" />
                    <span className="font-medium">{service.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">depending on size/condition</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-forest mr-1" />
                    <span>Usually takes {service.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-forest shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button asChild className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
                    <Link href="/schedule">Schedule This Service</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gift Cards Section */}
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8">Gift Cards</h2>
        <GiftCardSection />
      </div>

      {/* Additional Services */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8">Additional Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalServices.map((service, index) => (
            <Card key={index} className="bg-white border-none shadow-elegant">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-playfair">{service.title}</h3>
                  <span className="font-medium text-forest">{service.price}</span>
                </div>
                {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-muted p-8 rounded-lg">
        <h3 className="text-xl md:text-2xl font-playfair mb-4">Need a Custom Service?</h3>
        <p className="mb-6">For custom services or specific requirements, please contact us directly.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
            <Link href="/schedule">Schedule Service</Link>
          </Button>
          <Button asChild variant="outline" className="border-navy-dark text-navy-dark hover:bg-navy-dark/5">
            <a href="tel:+19188565304">Call (918) 856-5304</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
