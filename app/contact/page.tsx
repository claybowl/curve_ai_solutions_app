"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { SkyBackground } from "@/components/sky-background"
import { CheckCircle, Mail, Phone, MapPin, Send } from "lucide-react"
import { submitContactMessage } from "@/app/actions/contact-actions"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitContactMessage(formState)
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('There was an error submitting your message. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <SkyBackground className="w-full py-16 md:py-24 bg-gradient-to-b from-[#1A365D] to-[#0076FF] dark:from-[#0D1F36] dark:to-[#004599]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white mb-6">
              Contact Us
            </h1>
            <p className="max-w-[800px] mx-auto text-gray-100 md:text-xl mb-8">
              Have a question or ready to transform your business with AI? We'd love to hear from you.
            </p>
          </div>
        </div>
      </SkyBackground>

      {/* Contact Information Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="border-0 shadow-md bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-[#0076FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A365D] dark:text-blue-300 mb-2">Email</h3>
                <a
                  href="mailto:donjon.systems@gmail.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-[#0076FF] dark:hover:text-blue-400 transition"
                >
                  donjon.systems@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-[#0076FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A365D] dark:text-blue-300 mb-2">Phone</h3>
                <a
                  href="tel:+15397149375"
                  className="text-gray-600 dark:text-gray-300 hover:text-[#0076FF] dark:hover:text-blue-400 transition"
                >
                  (539) 714-9375
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0076FF]/10 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-[#0076FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A365D] dark:text-blue-300 mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">Tulsa, Oklahoma</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-blue-300 mb-6 text-center">Send Us a Message</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {isSubmitted ? (
              <Card className="border-2 border-green-500 dark:border-green-600">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A365D] dark:text-blue-300">Thank You!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your message has been sent successfully. We'll get back to you within 1-2 business days.
                    </p>
                    <Button
                      className="mt-4 bg-[#0076FF]"
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormState({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        })
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#0076FF]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  By submitting this form, you agree to our privacy policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              If you're ready to dive deeper into how AI can transform your business, schedule a consultation with our
              expert team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white" asChild>
                <Link href="/consultation">Schedule a Consultation</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0076FF] text-[#0076FF] hover:bg-[#0076FF]/10 dark:border-blue-400 dark:text-blue-400"
                asChild
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
