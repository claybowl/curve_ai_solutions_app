"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit2 } from "lucide-react"

interface Consultation {
  id: string
  subject: string
  description: string
  status: string
  urgency: string
  created_at: string
  user_id: string
  consultation_type: string
  profiles?: {
    email: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
  }
}

export function ConsultationManagementTable({
  consultations,
}: {
  consultations: Consultation[]
}) {
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Consultation>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setEditForm(consultation)
    setIsEditOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedConsultation) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/consultations/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: selectedConsultation.id,
          updates: {
            status: editForm.status,
            urgency: editForm.urgency,
          },
        }),
      })

      if (response.ok) {
        setIsEditOpen(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating consultation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "in_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No consultations found
              </TableCell>
            </TableRow>
          ) : (
            consultations.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {consultation.subject}
                </TableCell>
                <TableCell className="text-sm">
                  {consultation.profiles?.first_name ||
                    consultation.profiles?.email ||
                    "Unknown"}
                </TableCell>
                <TableCell className="text-sm">
                  {consultation.consultation_type || "-"}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(consultation.status)}>
                    {consultation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getUrgencyBadgeColor(consultation.urgency)}>
                    {consultation.urgency}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(consultation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedConsultation(consultation)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Consultation Details</DialogTitle>
                        </DialogHeader>
                        {selectedConsultation && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs uppercase text-gray-500">
                                Subject
                              </Label>
                              <p className="font-semibold">
                                {selectedConsultation.subject}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs uppercase text-gray-500">
                                Client
                              </Label>
                              <p>
                                {selectedConsultation.profiles?.first_name}{" "}
                                {selectedConsultation.profiles?.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedConsultation.profiles?.email}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs uppercase text-gray-500">
                                Description
                              </Label>
                              <p className="text-sm whitespace-pre-wrap">
                                {selectedConsultation.description}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs uppercase text-gray-500">
                                Type
                              </Label>
                              <p>{selectedConsultation.consultation_type}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(consultation)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Update Consultation</DialogTitle>
                          <DialogDescription>
                            Change the status and urgency level
                          </DialogDescription>
                        </DialogHeader>
                        {selectedConsultation && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={editForm.status || "pending"}
                                onValueChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    status: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="in_review">
                                    In Review
                                  </SelectItem>
                                  <SelectItem value="scheduled">
                                    Scheduled
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="urgency">Urgency</Label>
                              <Select
                                value={editForm.urgency || "medium"}
                                onValueChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    urgency: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="critical">
                                    Critical
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              onClick={handleSaveChanges}
                              disabled={isLoading}
                              className="w-full"
                            >
                              {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
