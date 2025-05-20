import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-[#0076FF] mb-4" />
      <p className="text-xl">Loading Admin Dashboard...</p>
    </div>
  )
}