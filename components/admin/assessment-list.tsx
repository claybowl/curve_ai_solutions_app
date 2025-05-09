"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, Trash2, Search } from "lucide-react"
import Link from "next/link"

export function AssessmentList() {
  const [searchTerm, setSearchTerm] = useState("")

  // In a real implementation, you would fetch this data from your database
  const assessments = [
    {
      id: 1,
      name: "John Smith",
      company: "Acme Inc.",
      email: "john@acmeinc.com",
      date: "2023-06-15",
      status: "completed",
      score: 78,
      industry: "Manufacturing",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      company: "Tech Solutions",
      email: "sarah@techsolutions.com",
      date: "2023-06-14",
      status: "reviewed",
      score: 92,
      industry: "Technology",
    },
    {
      id: 3,
      name: "Michael Brown",
      company: "Global Manufacturing",
      email: "michael@globalmfg.com",
      date: "2023-06-12",
      status: "completed",
      score: 65,
      industry: "Manufacturing",
    },
    {
      id: 4,
      name: "Emily Davis",
      company: "Healthcare Plus",
      email: "emily@healthcareplus.com",
      date: "2023-06-10",
      status: "reviewed",
      score: 88,
      industry: "Healthcare",
    },
    {
      id: 5,
      name: "David Wilson",
      company: "Finance Pro",
      email: "david@financepro.com",
      date: "2023-06-08",
      status: "completed",
      score: 72,
      industry: "Finance",
    },
  ]

  // Filter assessments based on search term
  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search assessments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <option value="all">All Industries</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Industry
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssessments.map((assessment) => (
              <tr key={assessment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{assessment.name}</div>
                  <div className="text-sm text-gray-500">{assessment.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assessment.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assessment.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assessment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                        assessment.score >= 90
                          ? "bg-green-500"
                          : assessment.score >= 70
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {assessment.score}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                    {assessment.status === "completed" ? "Completed" : "Reviewed"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/assessments/${assessment.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Report</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredAssessments.length}</span> of{" "}
          <span className="font-medium">{assessments.length}</span> assessments
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
