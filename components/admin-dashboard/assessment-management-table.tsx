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
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface Assessment {
  id: string
  title: string | null
  status: string
  overall_score: number | null
  completion_percentage: number
  started_at: string
  completed_at: string | null
  created_at: string
  user_id: string
  profiles?: {
    email: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
  }
}

export function AssessmentManagementTable({
  assessments,
}: {
  assessments: Assessment[]
}) {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(
    null
  )
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "abandoned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No assessments found
              </TableCell>
            </TableRow>
          ) : (
            assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium max-w-xs truncate">
                  {assessment.title || "Untitled Assessment"}
                </TableCell>
                <TableCell className="text-sm">
                  {assessment.profiles?.first_name ||
                    assessment.profiles?.email ||
                    "Unknown"}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(assessment.status)}>
                    {assessment.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {assessment.overall_score
                    ? `${assessment.overall_score.toFixed(1)}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${assessment.completion_percentage}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 min-w-max">
                      {assessment.completion_percentage.toFixed(0)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(assessment.started_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Assessment Details</DialogTitle>
                        <DialogDescription>
                          Full assessment information
                        </DialogDescription>
                      </DialogHeader>
                      {selectedAssessment && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs uppercase text-gray-500">
                                Title
                              </label>
                              <p className="font-semibold">
                                {selectedAssessment.title ||
                                  "Untitled Assessment"}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs uppercase text-gray-500">
                                Status
                              </label>
                              <Badge
                                className={getStatusBadgeColor(
                                  selectedAssessment.status
                                )}
                              >
                                {selectedAssessment.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs uppercase text-gray-500">
                                Overall Score
                              </label>
                              <p className="text-2xl font-bold">
                                {selectedAssessment.overall_score
                                  ? `${selectedAssessment.overall_score.toFixed(
                                      1
                                    )}%`
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs uppercase text-gray-500">
                                Completion
                              </label>
                              <p className="text-2xl font-bold">
                                {selectedAssessment.completion_percentage.toFixed(
                                  0
                                )}
                                %
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs uppercase text-gray-500">
                              User
                            </label>
                            <p className="font-semibold">
                              {selectedAssessment.profiles?.first_name}{" "}
                              {selectedAssessment.profiles?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedAssessment.profiles?.email}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs uppercase text-gray-500">
                              Timeline
                            </label>
                            <p className="text-sm">
                              Started:{" "}
                              {new Date(
                                selectedAssessment.started_at
                              ).toLocaleString()}
                            </p>
                            {selectedAssessment.completed_at && (
                              <p className="text-sm">
                                Completed:{" "}
                                {new Date(
                                  selectedAssessment.completed_at
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
