"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Wrench, Clock, Package, Truck, AlertCircle } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { useTickets } from "@/hooks/useTickets"
import type { Ticket } from "@/store"
import { Alert, AlertDescription } from "@/components/ui/alert"

type StepIcon = {
  status: string
  description: string
  icon: React.ElementType
}

const REPAIR_STEPS: StepIcon[] = [
  {
    status: "Not Picked",
    description: "Device to be picked up from your location",
    icon: Package,
  },
  {
    status: "Picked",
    description: "Device picked up from your location",
    icon: Package,
  },
  {
    status: "In Service",
    description: "Device is being repaired at service center",
    icon: Wrench,
  },
  {
    status: "Repaired",
    description: "Repair completed and quality checked",
    icon: Check,
  },
  {
    status: "Delivered",
    description: "Device will be delivered to you",
    icon: Truck,
  },
]

const getStepIcon = (status: string): React.ElementType => {
  const step = REPAIR_STEPS.find(s => s.status === status)
  return step?.icon || Clock
}

interface RepairTrackingProps {
  defaultTicketId?: string
}

const getTicketStatus = (ticket: Ticket): { status: string; color: string } => {
  if (!ticket) return { status: "Unknown", color: "text-gray-600 border-gray-600" }

  switch (ticket.status) {
    case "Not Picked":
      return { status: "To Be Picked", color: "text-blue-600 border-blue-600" }
    case "Delivered":
      return { status: "Completed", color: "text-green-600 border-green-600" }
    case "Picked":
    case "In Service":
    case "Repaired":
      return { status: "In Progress", color: "text-blue-600 border-blue-600" }
    default:
      return { status: "Pending", color: "text-yellow-600 border-yellow-600" }
  }
}

export function RepairTracking({ defaultTicketId }: RepairTrackingProps) {
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const { loading, error, fetchTickets } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<string>(
    defaultTicketId && tickets.some(t => t.id === defaultTicketId)
      ? defaultTicketId
      : ""
  )
  
  const currentTracking = tickets.find(t => t.id === selectedTicket)
  const ticketStatus = getTicketStatus(currentTracking!)

  // Update selected ticket when tickets load
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicket) {
      setSelectedTicket(tickets[0].id)
    }
  }, [tickets, selectedTicket])

  // Set first ticket as default when defaultTicketId is not provided
  useEffect(() => {
    if (tickets.length > 0 && !defaultTicketId && !selectedTicket) {
      setSelectedTicket(tickets[0].id)
    }
  }, [tickets, defaultTicketId, selectedTicket])

  if (loading && tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Repair Tracking</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Track your device repair progress</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 animate-spin mr-2" />
            <p className="text-muted-foreground">Loading tickets...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Repair Tracking</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Track your device repair progress</p>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <button 
            onClick={fetchTickets}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Repair Tracking</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Track your device repair progress</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tickets found. Create a service request to get started.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Repair Tracking</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Track your device repair progress</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6 border-b">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                selectedTicket === ticket.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ticket-{ticket.id}
              {selectedTicket === ticket.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>

        {currentTracking && (
          <>
            <div className="mb-6 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {currentTracking.product.charAt(0).toUpperCase() + currentTracking.product.slice(1)} - {currentTracking.deviceModel}
                  </p>
                  <p className="text-xs text-muted-foreground">{currentTracking.issue}</p>
                </div>
                <Badge variant="outline" className={`${ticketStatus.color} self-center`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {ticketStatus.status}
                </Badge>
              </div>
            </div>

            <div className="relative">
              {currentTracking.steps.map((step, index) => (
                <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline line */}
                  {index < currentTracking.steps.length - 1 && (
                    <div
                      className={`absolute left-6 w-0.5 ${step.completed ? "bg-green-500" : "bg-border"}`}
                      style={{
                        top: `${index * 100 + 48}px`,
                        height: "100px",
                      }}
                    />
                  )}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : step.current
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {React.createElement(getStepIcon(step.status), { className: "w-5 h-5" })}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{step.status}</h4>
                      {step.completed && <Check className="w-4 h-4 text-green-500" />}
                      {step.current && <Badge className="bg-blue-600 text-white hover:bg-blue-700">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{step.description}</p>
                    <p className="text-xs text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Estimated completion: {new Date(currentTracking.pickupDate).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
