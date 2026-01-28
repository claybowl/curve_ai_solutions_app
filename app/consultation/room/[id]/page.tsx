/**
 * Consultation Room Page
 * 
 * Main entry point for consultation sessions.
 * Server component that loads room data and renders the client-side room UI.
 */

import { notFound, redirect } from "next/navigation"
import { getCurrentUserServer, getUserProfile } from "@/lib/supabase-server"
import { getConsultationRoomData, canJoinConsultationRoom } from "@/app/actions/consultation-room-actions"
import { ConsultationRoom } from "@/components/consultation/consultation-room"

interface ConsultationRoomPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ConsultationRoomPage({ params }: ConsultationRoomPageProps) {
  // Auth check
  const user = await getCurrentUserServer()
  if (!user) {
    redirect("/login?redirect=/consultation/room")
  }

  const { id: consultationId } = await params

  // Check if user can join
  const accessCheck = await canJoinConsultationRoom(consultationId)
  if (!accessCheck.success || !accessCheck.canJoin) {
    if (accessCheck.error === "Consultation not found") {
      notFound()
    }
    redirect("/dashboard?error=" + encodeURIComponent(accessCheck.error || "Cannot join consultation"))
  }

  // Load room data
  const roomDataResult = await getConsultationRoomData(consultationId)
  if (!roomDataResult.success || !roomDataResult.data) {
    redirect("/dashboard?error=" + encodeURIComponent(roomDataResult.error || "Failed to load room"))
  }

  // Get user profile for display name
  const profile = await getUserProfile(user.id)
  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user.email || "User"
    : user.email || "User"

  const { consultation, messages, files, sandbox, whiteboard, summary } = roomDataResult.data

  return (
    <main className="h-screen bg-[#030712] overflow-hidden">
      <ConsultationRoom
        consultationId={consultationId}
        consultation={consultation}
        currentUserId={user.id}
        currentUserName={displayName}
        initialMessages={messages}
        initialFiles={files}
        initialSandbox={sandbox}
        initialWhiteboard={whiteboard}
        initialSummary={summary}
        isConsultant={accessCheck.isConsultant}
      />
    </main>
  )
}
