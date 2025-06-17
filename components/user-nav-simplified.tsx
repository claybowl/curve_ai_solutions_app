"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function UserNavSimplified() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button className="bg-[#0076FF] hover:bg-[#0076FF]/90" asChild>
        <Link href="/login">Sign Up</Link>
      </Button>
    </div>
  )
}
