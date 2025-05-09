"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search, UserPlus } from "lucide-react"
import Link from "next/link"

export function UserList() {
  const [searchTerm, setSearchTerm] = useState("")

  // In a real implementation, you would fetch this data from your database
  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@acmeinc.com",
      role: "client",
      company: "Acme Inc.",
      status: "active",
      lastLogin: "2023-06-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      role: "client",
      company: "Tech Solutions",
      status: "active",
      lastLogin: "2023-06-14",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@globalmfg.com",
      role: "client",
      company: "Global Manufacturing",
      status: "inactive",
      lastLogin: "2023-05-20",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@healthcareplus.com",
      role: "client",
      company: "Healthcare Plus",
      status: "active",
      lastLogin: "2023-06-10",
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@curveai.com",
      role: "admin",
      company: "Curve AI Solutions",
      status: "active",
      lastLogin: "2023-06-16",
    },
  ]

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
        </select>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
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
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={user.role === "admin" ? "destructive" : "default"}
                    className={user.role === "admin" ? "bg-purple-500" : ""}
                  >
                    {user.role === "admin" ? "Admin" : "Client"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={user.status === "active" ? "success" : "secondary"}
                    className={user.status === "active" ? "bg-green-500" : ""}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
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
          Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
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
