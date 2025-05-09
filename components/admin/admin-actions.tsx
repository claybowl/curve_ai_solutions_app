"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminActions() {
  const router = useRouter()

  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={() => router.push("/admin-dashboard")}>Go to Full Admin Dashboard</Button>
      <Button variant="outline" onClick={() => router.push("/")}>
        Go to Home Page
      </Button>
      <Button variant="outline" onClick={() => router.push("/logout")}>
        Log Out
      </Button>
    </div>
  )
}
