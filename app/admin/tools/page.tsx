"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for preview environments
const MOCK_TOOLS = [
  {
    id: 1,
    name: "GPT-4 Integration",
    description: "Advanced language model for content generation",
    api_endpoint: "/api/tools/gpt4",
    is_active: true,
  },
  {
    id: 2,
    name: "Image Generator",
    description: "AI-powered image creation from text prompts",
    api_endpoint: "/api/tools/image-gen",
    is_active: true,
  },
  {
    id: 3,
    name: "Data Analyzer",
    description: "Automated data analysis and visualization",
    api_endpoint: "/api/tools/data-analyzer",
    is_active: false,
  },
  {
    id: 4,
    name: "Voice Transcription",
    description: "Convert audio to text with high accuracy",
    api_endpoint: "/api/tools/transcribe",
    is_active: true,
  },
  {
    id: 5,
    name: "Sentiment Analysis",
    description: "Analyze text for emotional tone and sentiment",
    api_endpoint: "/api/tools/sentiment",
    is_active: false,
  },
]

export default function AiToolsPage() {
  const router = useRouter()
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("admin-token")
        if (!token) {
          router.push("/login")
          return false
        }

        const [_, role] = token.split(":")
        if (role !== "admin") {
          router.push("/dashboard")
          return false
        }

        return true
      } catch (error) {
        console.error("Auth check error:", error)
        return false
      }
    }

    const isUserAdmin = checkAuth()
    setIsAdmin(isUserAdmin)

    // Fetch tools data
    const fetchTools = async () => {
      try {
        // In preview environments, use mock data
        if (window.location.hostname === "localhost" || window.location.hostname.includes("vercel.app")) {
          setTimeout(() => {
            setTools(MOCK_TOOLS)
            setLoading(false)
          }, 800) // Simulate loading delay
          return
        }

        // In production, fetch from API
        const response = await fetch("/api/admin/tools")
        if (!response.ok) throw new Error("Failed to fetch tools")
        const data = await response.json()
        setTools(data)
      } catch (error) {
        console.error("Error fetching tools:", error)
        // Fallback to mock data on error
        setTools(MOCK_TOOLS)
      } finally {
        setLoading(false)
      }
    }

    if (isUserAdmin) {
      fetchTools()
    }
  }, [router])

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-40" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // If not admin and not loading, this means auth check failed
  if (!isAdmin && !loading) {
    return null // Router will handle redirect
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Tools</h1>
        <Button>Add New Tool</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>API Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell>{tool.description}</TableCell>
                <TableCell className="font-mono text-sm">{tool.api_endpoint}</TableCell>
                <TableCell>
                  <Badge variant={tool.is_active ? "default" : "outline"}>
                    {tool.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
