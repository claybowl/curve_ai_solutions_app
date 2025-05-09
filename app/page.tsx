import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Clock, Sparkles } from "lucide-react"
import ServiceCard from "@/components/service-card"
import GoogleMapsReviews from "@/components/google-maps-reviews"
import FeaturedReviews from "@/components/featured-reviews"
import PaymentOptions from "@/components/payment-options"
import Logo from "@/components/logo"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=700&width=1920"
          alt="Luxury vehicle being detailed"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-dark/40"></div>
        <div className="container relative h-full mx-auto flex flex-col justify-center items-center text-center text-ivory z-10 px-4">
          {/* Add a large logo above the heading in the hero section */}
          <div className="mb-8">
            <div className="bg-white/90 rounded-lg p-6 inline-block">
              <Logo size="large" variant="dark" linkWrapper={false} />
            </div>
          </div>
          <p className="text-lg md:text-xl max-w-3xl mb-2 leading-relaxed">SERVING TULSA & SURROUNDING AREAS</p>
          <p className="text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
            Meticulous care for discerning clients. Our white-glove mobile detailing service brings the finest
            automotive care directly to your residence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-ivory text-navy-dark hover:bg-ivory/90">
              <Link href="/schedule">Schedule Service</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-ivory text-ivory bg-navy-dark/40 hover:bg-navy-dark/60"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair mb-6">WE COME TO YOU!</h2>
            <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
            <p className="text-lg leading-relaxed mb-6">
              Clean Machine Auto Detail offers extensive detailing services ranging from Upholstery shampoo & Headlight
              restoration to Paint Correction & Ceramic Coatings, right in your driveway!
            </p>
            <p className="text-lg leading-relaxed">
              Since 2005, Clean Machine Mobile Detailing has provided exceptional automotive care to discerning clients
              throughout Tulsa. Our approach combines time-honored techniques with select premium products to achieve
              results that exceed expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white border-none shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-navy-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-navy-dark" />
                </div>
                <h3 className="text-xl font-playfair mb-3">Premium Protection</h3>
                <p className="text-muted-foreground">
                  We utilize only the finest products and techniques to protect your vehicle's surfaces.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-navy-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-navy-dark" />
                </div>
                <h3 className="text-xl font-playfair mb-3">Unparalleled Expertise</h3>
                <p className="text-muted-foreground">
                  Our detailers bring years of specialized training and experience to every service.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-navy-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-navy-dark" />
                </div>
                <h3 className="text-xl font-playfair mb-3">Convenient Service</h3>
                <p className="text-muted-foreground">
                  We bring our complete detailing studio directly to your residence or office.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-elegant">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-navy-dark/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-navy-dark" />
                </div>
                <h3 className="text-xl font-playfair mb-3">Meticulous Attention</h3>
                <p className="text-muted-foreground">
                  Every detail receives our complete focus, ensuring exceptional results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-6">Our Services</h2>
          <div className="w-24 h-px bg-gold mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Signature Detail"
              description="Our comprehensive detailing service includes meticulous exterior washing, paint correction, interior cleaning, and protective treatments."
              imageSrc="/placeholder.svg?height=300&width=400"
              href="/services/signature-detail"
            />

            <ServiceCard
              title="Maintenance Care"
              description="Regular maintenance detailing to preserve your vehicle's appearance and protect previous treatments between full details."
              imageSrc="/placeholder.svg?height=300&width=400"
              href="/services/maintenance-care"
            />

            <ServiceCard
              title="Ceramic Coating"
              description="Professional-grade ceramic coating application providing superior protection and enhanced appearance for up to five years."
              imageSrc="/placeholder.svg?height=300&width=400"
              href="/services/ceramic-coating"
            />
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-navy-dark text-navy-dark hover:bg-navy-dark/5">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-navy-dark text-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-6">Our Process</h2>
          <div className="w-24 h-px bg-gold mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Detailer working on a luxury vehicle"
                width={600}
                height={500}
                className="rounded-md shadow-elegant"
              />
            </div>
            <div>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy-dark font-playfair font-medium">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair mb-2">Consultation</h3>
                    <p className="text-ivory/80 leading-relaxed">
                      We begin with a thorough assessment of your vehicle's condition and discuss your specific
                      preferences and requirements.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy-dark font-playfair font-medium">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair mb-2">Preparation</h3>
                    <p className="text-ivory/80 leading-relaxed">
                      Our team arrives at your location with all necessary equipment and premium products selected
                      specifically for your vehicle.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy-dark font-playfair font-medium">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair mb-2">Execution</h3>
                    <p className="text-ivory/80 leading-relaxed">
                      We meticulously perform each step of the detailing process, paying careful attention to every
                      surface and detail of your vehicle.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy-dark font-playfair font-medium">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair mb-2">Final Inspection</h3>
                    <p className="text-ivory/80 leading-relaxed">
                      Upon completion, we conduct a thorough inspection with you to ensure every aspect meets our
                      exacting standards and your expectations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild className="bg-gold text-navy-dark hover:bg-gold/90">
                  <Link href="/process">Learn More About Our Process</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-6">Client Testimonials</h2>
          <div className="w-24 h-px bg-gold mx-auto mb-16"></div>

          {/* Featured Reviews */}
          <FeaturedReviews />

          {/* Google Maps Reviews */}
          <GoogleMapsReviews />
        </div>
      </section>

      {/* Payment Options Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <PaymentOptions />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-muted text-navy-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair mb-6">Experience the Difference</h2>
          <p className="text-2xl font-playfair mb-4">918-856-5304</p>
          <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Schedule your appointment today and discover why discerning clients throughout Tulsa trust Clean Machine
            Mobile Detailing with their finest vehicles.
          </p>
          <Button asChild size="lg" className="bg-navy-dark text-ivory hover:bg-navy-dark/90">
            <Link href="/schedule">Schedule Service</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
