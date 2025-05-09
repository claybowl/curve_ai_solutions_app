"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { submitAppointment } from "@/app/actions/submit-appointment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock } from "lucide-react"

export default function SchedulePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a client action that wraps the server action
  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitAppointment(formData)

      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else if (!result.success) {
        setError(result.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-playfair mb-4">Schedule Your Service</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            Complete the form below to schedule your mobile detailing service. Our team will confirm your appointment
            within 24 hours.
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

        <Card className="bg-white border-none shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair">Service Details</CardTitle>
            <CardDescription>
              Please provide information about your vehicle and preferred service options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-8">
              {/* Rest of the form remains the same */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      className="border-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      className="border-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="border-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="border-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Service Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter the service location address"
                    className="border-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make</Label>
                    <Input
                      id="vehicleMake"
                      name="vehicleMake"
                      placeholder="e.g., Mercedes-Benz"
                      className="border-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      placeholder="e.g., S-Class"
                      className="border-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Vehicle Year</Label>
                    <Input
                      id="vehicleYear"
                      name="vehicleYear"
                      placeholder="e.g., 2023"
                      className="border-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleColor">Vehicle Color</Label>
                    <Input
                      id="vehicleColor"
                      name="vehicleColor"
                      placeholder="e.g., Obsidian Black"
                      className="border-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Service Type</Label>
                  <RadioGroup
                    name="serviceType"
                    defaultValue="signature"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2 border border-input rounded-md p-4">
                      <RadioGroupItem value="signature" id="signature" />
                      <Label htmlFor="signature" className="font-normal cursor-pointer">
                        Signature Detail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-input rounded-md p-4">
                      <RadioGroupItem value="maintenance" id="maintenance" />
                      <Label htmlFor="maintenance" className="font-normal cursor-pointer">
                        Maintenance Care
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-input rounded-md p-4">
                      <RadioGroupItem value="ceramic" id="ceramic" />
                      <Label htmlFor="ceramic" className="font-normal cursor-pointer">
                        Ceramic Coating
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <div className="relative">
                      <Input id="preferredDate" name="preferredDate" type="date" className="border-input" required />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Select name="preferredTime" required>
                      <SelectTrigger id="preferredTime" className="border-input">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4:00 PM - 7:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Please share any special requests or additional information about your vehicle."
                    className="border-input min-h-[120px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-muted">
                <Button
                  type="submit"
                  className="w-full bg-navy-dark text-ivory hover:bg-navy-dark/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Appointment Request"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By submitting this form, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-navy-dark">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-navy-dark">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white border-none shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Service Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>By Appointment Only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-playfair">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-navy-dark" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">We will confirm your appointment within 24 hours.</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Questions?</p>
                  <p className="text-sm text-muted-foreground">
                    Call us at{" "}
                    <a href="tel:+19188565304" className="text-navy-dark hover:underline">
                      (918) 856-5304
                    </a>{" "}
                    or email{" "}
                    <a href="mailto:cleanmachinetulsa@gmail.com" className="text-navy-dark hover:underline">
                      cleanmachinetulsa@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
