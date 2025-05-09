"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    bio: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/auth/signin")
      return
    }

    // Get user data
    const sessionUser = sessionStorage.getItem("user-data")
    let userData

    if (sessionUser) {
      try {
        userData = JSON.parse(sessionUser)
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }

    // If no session data, create mock data
    if (!userData) {
      const [userId, role] = token.split(":")
      userData = {
        id: userId || "1",
        email: "demo@curveai.com",
        firstName: "Demo",
        lastName: "User",
        company: "Curve AI Demo",
        role: role || "client",
        bio: "I'm interested in AI solutions for my business.",
        phone: "(555) 123-4567",
        address: "123 Main St",
        city: "Tulsa",
        state: "OK",
        zip: "74103",
        country: "USA",
      }
    }

    setUser(userData)
    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      company: userData.company || "",
      bio: userData.bio || "",
      phone: userData.phone || "",
      address: userData.address || "",
      city: userData.city || "",
      state: userData.state || "",
      zip: userData.zip || "",
      country: userData.country || "",
    })

    setLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess("")
    setError("")

    try {
      // In a real app, we would send this data to an API
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update session storage
      const updatedUser = {
        ...user,
        ...formData,
      }
      sessionStorage.setItem("user-data", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess("Profile updated successfully")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error("Error updating profile:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-6">Your Profile</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-700">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            <p className="ml-3 text-green-700 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <p className="ml-3 text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Button type="submit" className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>Update your contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="Enter your ZIP code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Button type="submit" className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
