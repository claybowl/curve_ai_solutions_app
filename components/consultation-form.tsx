"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export function ConsultationForm() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    employeeCount: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, you would send the form data to your backend
    // const response = await fetch('/api/consultation', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formState),
    // });

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="border-2 border-green-500 dark:border-green-600">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A365D] dark:text-blue-300">Thank You!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your consultation request has been submitted successfully. One of our experts will contact you within 1-2
              business days to schedule your consultation.
            </p>
            <Button
              className="mt-4 bg-[#0076FF]"
              onClick={() => {
                setIsSubmitted(false)
                setFormState({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  companyName: "",
                  industry: "",
                  employeeCount: "",
                  message: "",
                })
              }}
            >
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            required
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            required
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
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
          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">Company Name *</Label>
          <Input
            id="companyName"
            name="companyName"
            value={formState.companyName}
            onChange={handleChange}
            required
            placeholder="Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-gray-700 dark:text-gray-300">Industry *</Label>
          <select
            id="industry"
            name="industry"
            value={formState.industry}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Industry</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeCount" className="text-gray-700 dark:text-gray-300">Company Size *</Label>
        <select
          id="employeeCount"
          name="employeeCount"
          value={formState.employeeCount}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select Company Size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501-1000">501-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Tell us about your business needs *</Label>
        <Textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          required
          placeholder="Please describe your current challenges and what you hope to achieve with AI solutions..."
          className="min-h-[150px]"
        />
      </div>

      <Button type="submit" className="w-full bg-[#0076FF]" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Consultation"}
      </Button>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        By submitting this form, you agree to our privacy policy and consent to being contacted regarding your request.
      </p>
    </form>
  )
}
