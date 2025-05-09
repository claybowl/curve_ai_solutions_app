"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"

interface LogoutConfirmationDialogProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LogoutConfirmationDialog({
  variant = "destructive",
  size = "default",
  className = "",
  children,
}: LogoutConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    // Clear authentication data
    localStorage.removeItem("auth_token")
    localStorage.removeItem("admin-token")
    sessionStorage.removeItem("user-data")
    localStorage.removeItem("user")

    // Remove any cookies via the logout API
    try {
      await fetch("/api/logout", { method: "POST" })
    } catch (err) {
      console.error("Error during logout:", err)
    }

    // Close dialog and redirect to home page
    setOpen(false)
    router.push("/")
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        {children || (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Yes, Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
