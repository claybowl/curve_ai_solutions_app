"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, MoreVertical, Pencil, Trash2, Eye, ExternalLink,
  Search, ChevronDown, Lightbulb, Rocket, Settings, Building2
} from "lucide-react"
import { format } from "date-fns"

// Types for solutions management
interface Solution {
  id: string
  title: string
  description: string
  detailed_description?: string
  industry: string[]
  use_cases: string[]
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  implementation_time: string
  roi_potential: 'low' | 'medium' | 'high' | 'very_high'
  technologies: string[]
  is_featured: boolean
  is_public: boolean
  status: 'draft' | 'published' | 'archived'
  case_studies?: CaseStudy[]
  created_at: string
  updated_at: string
}

interface CaseStudy {
  id: string
  client_name: string
  industry: string
  challenge: string
  solution: string
  results: string
  metrics: Record<string, any>
  is_featured: boolean
}

interface SolutionFormData {
  title: string
  description: string
  detailed_description: string
  industry: string[]
  use_cases: string[]
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  implementation_time: string
  roi_potential: 'low' | 'medium' | 'high' | 'very_high'
  technologies: string[]
  is_featured: boolean
  is_public: boolean
  status: 'draft' | 'published' | 'archived'
}

export default function SolutionsManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // State management
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterIndustry, setFilterIndustry] = useState<string | undefined>(undefined)
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<SolutionFormData>({
    title: "",
    description: "",
    detailed_description: "",
    industry: [],
    use_cases: [],
    complexity_level: "beginner",
    implementation_time: "",
    roi_potential: "medium",
    technologies: [],
    is_featured: false,
    is_public: true,
    status: "draft"
  })

  useEffect(() => {
    loadSolutions()
  }, [activeTab, filterIndustry])

  const loadSolutions = async () => {
    setIsLoading(true)
    try {
      // For now, use mock data since we haven't created solution actions yet
      const mockSolutions: Solution[] = [
        {
          id: "1",
          title: "AI-Powered Customer Service Automation",
          description: "Implement intelligent chatbots and automated response systems to handle customer inquiries 24/7.",
          detailed_description: "This comprehensive solution leverages advanced natural language processing to understand customer queries and provide accurate, contextual responses. The system learns from interactions to continuously improve response quality.",
          industry: ["retail", "ecommerce", "saas"],
          use_cases: ["customer support", "lead qualification", "order tracking"],
          complexity_level: "intermediate",
          implementation_time: "2-4 weeks",
          roi_potential: "high",
          technologies: ["OpenAI GPT", "Webhook Integration", "CRM Integration"],
          is_featured: true,
          is_public: true,
          status: "published",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2", 
          title: "Automated Document Processing",
          description: "Extract and process information from documents using AI-powered OCR and natural language understanding.",
          industry: ["legal", "finance", "healthcare"],
          use_cases: ["invoice processing", "contract analysis", "data entry automation"],
          complexity_level: "advanced",
          implementation_time: "4-8 weeks",
          roi_potential: "very_high",
          technologies: ["OCR", "Document AI", "Workflow Automation"],
          is_featured: false,
          is_public: true,
          status: "published",
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          title: "Predictive Analytics Dashboard", 
          description: "Build real-time dashboards that predict business trends and opportunities using machine learning.",
          industry: ["manufacturing", "retail", "finance"],
          use_cases: ["demand forecasting", "inventory optimization", "sales prediction"],
          complexity_level: "expert",
          implementation_time: "8-12 weeks",
          roi_potential: "very_high",
          technologies: ["Machine Learning", "Data Analytics", "Business Intelligence"],
          is_featured: true,
          is_public: false,
          status: "draft",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      // Filter based on active tab
      let filteredSolutions = mockSolutions
      if (activeTab === "published") {
        filteredSolutions = mockSolutions.filter(s => s.status === "published")
      } else if (activeTab === "draft") {
        filteredSolutions = mockSolutions.filter(s => s.status === "draft")
      } else if (activeTab === "featured") {
        filteredSolutions = mockSolutions.filter(s => s.is_featured)
      }
      
      // Apply search filter
      if (searchTerm) {
        filteredSolutions = filteredSolutions.filter(s => 
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Apply industry filter
      if (filterIndustry) {
        filteredSolutions = filteredSolutions.filter(s => 
          s.industry.includes(filterIndustry)
        )
      }
      
      setSolutions(filteredSolutions)
    } catch (err) {
      console.error("Error loading solutions:", err)
      setError("Failed to load solutions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadSolutions()
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In a real implementation, this would call a create solution action
      const newSolution: Solution = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setSolutions(prev => [newSolution, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      
      toast({
        title: "Success",
        description: "Solution created successfully",
      })
    } catch (err) {
      console.error("Error creating solution:", err)
      toast({
        title: "Error",
        description: "Failed to create solution",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentSolution) return
    
    try {
      // In a real implementation, this would call an update solution action
      const updatedSolution: Solution = {
        ...currentSolution,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      setSolutions(prev => prev.map(s => s.id === currentSolution.id ? updatedSolution : s))
      setIsEditDialogOpen(false)
      resetForm()
      
      toast({
        title: "Success",
        description: "Solution updated successfully",
      })
    } catch (err) {
      console.error("Error updating solution:", err)
      toast({
        title: "Error",
        description: "Failed to update solution",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentSolution) return
    
    try {
      // In a real implementation, this would call a delete solution action
      setSolutions(prev => prev.filter(s => s.id !== currentSolution.id))
      setIsDeleteDialogOpen(false)
      setCurrentSolution(null)
      
      toast({
        title: "Success",
        description: "Solution deleted successfully",
      })
    } catch (err) {
      console.error("Error deleting solution:", err)
      toast({
        title: "Error",
        description: "Failed to delete solution",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      detailed_description: "",
      industry: [],
      use_cases: [],
      complexity_level: "beginner",
      implementation_time: "",
      roi_potential: "medium",
      technologies: [],
      is_featured: false,
      is_public: true,
      status: "draft"
    })
    setCurrentSolution(null)
  }

  const handleEditSolution = (solution: Solution) => {
    setCurrentSolution(solution)
    setFormData({
      title: solution.title,
      description: solution.description,
      detailed_description: solution.detailed_description || "",
      industry: solution.industry,
      use_cases: solution.use_cases,
      complexity_level: solution.complexity_level,
      implementation_time: solution.implementation_time,
      roi_potential: solution.roi_potential,
      technologies: solution.technologies,
      is_featured: solution.is_featured,
      is_public: solution.is_public,
      status: solution.status
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteSolution = (solution: Solution) => {
    setCurrentSolution(solution)
    setIsDeleteDialogOpen(true)
  }

  const handleViewSolution = (solution: Solution) => {
    setCurrentSolution(solution)
    setIsViewDialogOpen(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
    }
  }

  const getComplexityIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return "🟢"
      case "intermediate":
        return "🟡"
      case "advanced":
        return "🟠"
      case "expert":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <DashboardLayout
      title="Solutions Management"
      description="Manage AI solutions, case studies, and implementation guides"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Solutions", href: "/admin/solutions", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Solution
        </Button>
      }
    >
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Solutions</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <Select
              value={filterIndustry}
              onValueChange={setFilterIndustry}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Industries</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
              </SelectContent>
            </Select>
            
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
              <Input
                type="search"
                placeholder="Search solutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-0"
              />
              <Button type="submit" size="sm" variant="outline" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Solutions Table */}
        <Card>
          <CardHeader>
            <CardTitle>AI Solutions</CardTitle>
            <CardDescription>
              Manage your portfolio of AI solutions and implementation guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <p>Loading solutions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" className="mt-4" onClick={loadSolutions}>
                  Retry
                </Button>
              </div>
            ) : solutions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No solutions found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Create Your First Solution
                </Button>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Solution</TableHead>
                      <TableHead className="hidden md:table-cell">Industry</TableHead>
                      <TableHead className="hidden lg:table-cell">Complexity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solutions.map(solution => (
                      <TableRow key={solution.id}>
                        <TableCell className="min-w-[200px]">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {solution.is_featured && (
                                <span className="text-yellow-500">⭐</span>
                              )}
                              {solution.title}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {solution.description}
                            </div>
                            {/* Show industry on mobile */}
                            <div className="md:hidden mt-2 flex flex-wrap gap-1">
                              {solution.industry.slice(0, 2).map(ind => (
                                <Badge key={ind} variant="outline" className="text-xs">
                                  {ind}
                                </Badge>
                              ))}
                              {solution.industry.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{solution.industry.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {solution.industry.slice(0, 2).map(industry => (
                              <Badge key={industry} variant="outline" className="capitalize">
                                {industry}
                              </Badge>
                            ))}
                            {solution.industry.length > 2 && (
                              <Badge variant="outline">
                                +{solution.industry.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <span>{getComplexityIcon(solution.complexity_level)}</span>
                            <span className="capitalize">{solution.complexity_level}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusBadgeVariant(solution.status)}
                          >
                            {solution.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {format(new Date(solution.updated_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewSolution(solution)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditSolution(solution)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/solutions/${solution.id}`, '_blank')}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Public Page
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteSolution(solution)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span className="ml-2 text-sm font-medium">Total Solutions</span>
            </div>
            <div className="text-2xl font-bold mt-2">{solutions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Rocket className="h-4 w-4 text-green-500" />
              <span className="ml-2 text-sm font-medium">Published</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {solutions.filter(s => s.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="ml-2 text-sm font-medium">Featured</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {solutions.filter(s => s.is_featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Settings className="h-4 w-4 text-purple-500" />
              <span className="ml-2 text-sm font-medium">Drafts</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {solutions.filter(s => s.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Solution Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Solution</DialogTitle>
            <DialogDescription>
              Add a new AI solution to your portfolio
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Solution Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the solution"
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complexity_level">Complexity Level</Label>
                  <Select
                    value={formData.complexity_level}
                    onValueChange={(value) => setFormData({ ...formData, complexity_level: value as any })}
                  >
                    <SelectTrigger id="complexity_level">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🟠 Advanced</SelectItem>
                      <SelectItem value="expert">🔴 Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="implementation_time">Implementation Time</Label>
                  <Input
                    id="implementation_time"
                    value={formData.implementation_time}
                    onChange={(e) => setFormData({ ...formData, implementation_time: e.target.value })}
                    placeholder="e.g., 2-4 weeks"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Feature this solution</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="is_public">Make publicly visible</Label>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Solution</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Solution Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Solution</DialogTitle>
            <DialogDescription>
              Update solution details and settings
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Solution Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Short Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the solution"
                  rows={2}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-complexity_level">Complexity Level</Label>
                  <Select
                    value={formData.complexity_level}
                    onValueChange={(value) => setFormData({ ...formData, complexity_level: value as any })}
                  >
                    <SelectTrigger id="edit-complexity_level">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🟠 Advanced</SelectItem>
                      <SelectItem value="expert">🔴 Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="edit-is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="edit-is_featured">Feature this solution</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="edit-is_public">Make publicly visible</Label>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Solution</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Solution Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentSolution?.is_featured && <span>⭐</span>}
              {currentSolution?.title}
            </DialogTitle>
            <DialogDescription>
              Solution details and implementation information
            </DialogDescription>
          </DialogHeader>
          
          {currentSolution && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{currentSolution.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentSolution.industry.map(ind => (
                      <Badge key={ind} variant="outline" className="capitalize">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Use Cases</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentSolution.use_cases.map(useCase => (
                      <Badge key={useCase} variant="outline" className="capitalize">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Complexity</h4>
                  <div className="flex items-center gap-2">
                    <span>{getComplexityIcon(currentSolution.complexity_level)}</span>
                    <span className="capitalize">{currentSolution.complexity_level}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Implementation Time</h4>
                  <p className="text-sm">{currentSolution.implementation_time}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {currentSolution.technologies.map(tech => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge 
                    variant="outline" 
                    className={getStatusBadgeVariant(currentSolution.status)}
                  >
                    {currentSolution.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Featured:</span>
                  <span className="text-sm">{currentSolution.is_featured ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Public:</span>
                  <span className="text-sm">{currentSolution.is_public ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {currentSolution && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                handleEditSolution(currentSolution)
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Solution
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Delete Solution</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this solution? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentSolution && (
            <div className="py-4">
              <h3 className="font-medium truncate">{currentSolution.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {currentSolution.description}
              </p>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}