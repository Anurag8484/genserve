import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAppSelector } from "@/store/hooks"
import { useState } from "react"
import { SchedulePickupModal } from "./schedule-pickup-modal"

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Picked':
      return 'bg-gray-100 text-gray-700'
    case 'In Service':
      return 'bg-blue-100 text-blue-700'
    case 'Repaired':
      return 'bg-green-100 text-green-700'
    case 'Delivered':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function TicketList() {
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Support Tickets</CardTitle>
          <Button 
            size="sm" 
            className="bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setIsModalOpen(true)}
          >
            + New Ticket
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">{ticket.id}</span>
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ticket.product.charAt(0).toUpperCase() + ticket.product.slice(1)} - {ticket.deviceModel}
                </p>
                <p className="text-sm text-foreground">{ticket.issue}</p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/track-tickets/${ticket.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
      <SchedulePickupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
