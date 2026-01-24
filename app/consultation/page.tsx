import { SkyBackground } from "@/components/sky-background"
import { ConsultationForm } from "@/components/consultation-form"
import { ConsultationProcess } from "@/components/consultation-process"
import { ConsultationFAQ } from "@/components/consultation-faq"
import { Testimonials } from "@/components/testimonials"
import { CalendlyPromotion } from "@/components/calendly-promotion"

export const metadata = {
  title: "Consultation | Donjon Intelligence Systems",
  description: "Schedule a consultation with our AI experts to discuss your business needs and solutions.",
}

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-[#030712]">
      <CalendlyPromotion />

      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-900 to-[#030712]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              Schedule a Consultation
            </h1>
            <p className="max-w-[800px] mx-auto text-slate-300 md:text-xl mb-8">
              Our expert team will help you identify AI opportunities for your business and create a tailored
              implementation plan
            </p>
          </div>
        </div>
      </SkyBackground>

      <section className="py-16 bg-[#030712]">
        <div className="container px-4 md:px-6 mx-auto">
          <ConsultationProcess />
        </div>
      </section>

      <section className="py-16 bg-slate-900/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Request Your Consultation</h2>
            <ConsultationForm />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#030712]">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Client Success Stories</h2>
          <Testimonials />
        </div>
      </section>

      <section className="py-16 bg-slate-900/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
            <ConsultationFAQ />
          </div>
        </div>
      </section>
    </main>
  )
}
