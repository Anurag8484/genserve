"use client"

import { Sidebar } from "@/components/sidebar"
import { RepairTracking } from "@/components/repair-tracking"
import { useParams } from "next/navigation"

export default function TrackTicketPage() {
  const params = useParams()
  const ticketId = params?.ticketId as string || ""

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Track Tickets</h1>
            <p className="text-muted-foreground">Monitor real-time repair progress for your devices.</p>
          </div>

          <RepairTracking defaultTicketId={ticketId} />
        </div>
      </main>
    </div>
  )
}