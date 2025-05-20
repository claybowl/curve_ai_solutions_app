"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { supabase, getCurrentUser, updateUserMetadata } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

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

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Get the current user from Supabase
        const { user, error } = await getCurrentUser()
        
        if (error || !user) {
          console.error("Error fetching user:", error)
          router.push("/login")
          return
        }

        setUser(user)
        
        // Extract user metadata
        const metadata = user.user_metadata || {}
        
        setFormData({
          firstName: metadata.firstName || "",
          lastName: metadata.lastName || "",
          email: user.email || "",
          company: metadata.company || "",
          bio: metadata.bio || "",
          phone: metadata.phone || "",
          address: metadata.address || "",
          city: metadata.city || "",
          state: metadata.state || "",
          zip: metadata.zip || "",
          country: metadata.country || "",
        })
      } catch (err) {
        console.error("Failed to load user profile:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
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
      // Update user metadata in Supabase
      const { data, error } = await updateUserMetadata({
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        role: user.user_metadata?.role, // Preserve the existing role
      })

      if (error) {
        throw error
      }

      setSuccess("Profile updated successfully")
    } catch (err: any) {
      setError(err.message || "Failed to update profile. Please try again.")
      console.error("Error updating profile:", err)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordSuccess("")
    setPasswordError("")

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match")
      setPasswordLoading(false)
      return
    }

    try {
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.newPassword
      })

      if (error) {
        throw error
      }

      // Reset form on success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      setPasswordSuccess("Password updated successfully")
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password. Please try again.")
      console.error("Error updating password:", err)
    } finally {
      setPasswordLoading(false)
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
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordSuccess && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-700">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                      <p className="ml-3 text-green-700 dark:text-green-300">{passwordSuccess}</p>
                    </div>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                      <p className="ml-3 text-red-700 dark:text-red-300">{passwordError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 8 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}