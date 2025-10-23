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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit2 } from "lucide-react"

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
  role: "admin" | "client" | "consultant"
  subscription_status: string
  created_at: string
}

export function UserManagementTable({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditForm(user)
    setIsEditOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          updates: {
            first_name: editForm.first_name,
            last_name: editForm.last_name,
            company_name: editForm.company_name,
            role: editForm.role,
            subscription_status: editForm.subscription_status,
          },
        }),
      })

      if (response.ok) {
        setIsEditOpen(false)
        // Reload the page to see updated data
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "consultant":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status) {
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "enterprise":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "basic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.first_name || user.last_name
                    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                    : "Unknown"}
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell className="text-sm">
                  {user.company_name || "-"}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSubscriptionBadgeColor(user.subscription_status)}>
                    {user.subscription_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit user</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Update user information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="first_name">First Name</Label>
                              <Input
                                id="first_name"
                                value={editForm.first_name || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    first_name: e.target.value,
                                  })
                                }
                                placeholder="First name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="last_name">Last Name</Label>
                              <Input
                                id="last_name"
                                value={editForm.last_name || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    last_name: e.target.value,
                                  })
                                }
                                placeholder="Last name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                value={editForm.company_name || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    company_name: e.target.value,
                                  })
                                }
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="role">Role</Label>
                              <Select
                                value={editForm.role || "client"}
                                onValueChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    role: value as "admin" | "client" | "consultant",
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="consultant">
                                    Consultant
                                  </SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="subscription">Subscription</Label>
                              <Select
                                value={editForm.subscription_status || "free"}
                                onValueChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    subscription_status: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="free">Free</SelectItem>
                                  <SelectItem value="basic">Basic</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                  <SelectItem value="enterprise">
                                    Enterprise
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
