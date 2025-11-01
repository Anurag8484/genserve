"use client"

import { useState } from "react"
import { Clock, Package, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SchedulePickupModal } from "./schedule-pickup-modal"
import { OrderComponentsModal } from "./order-components-modal"
import { useRouter } from "next/navigation"

const actions = [
  {
    icon: Clock,
    title: "Create New Ticket",
    description: "Request a new service",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Package,
    title: "Order Components",
    description: "Request replacement parts",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Wrench,
    title: "Track Repair",
    description: "Check repair status",
    color: "bg-purple-50 text-purple-600",
  },
]

export function ActionCards() {
  const [showPickupModal, setShowPickupModal] = useState(false)
  const [showComponentsModal, setShowComponentsModal] = useState(false)
  const router = useRouter()

  const handleCardClick = (title: string) => {
    if (title === "Create New Ticket") {
      setShowPickupModal(true)
    } else if (title === "Order Components") {
      setShowComponentsModal(true)
    } else if (title === "Track Repair") {
      router.push("/track-tickets")
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card
            key={action.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(action.title)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SchedulePickupModal isOpen={showPickupModal} onClose={() => setShowPickupModal(false)} />
      <OrderComponentsModal isOpen={showComponentsModal} onClose={() => setShowComponentsModal(false)} />
    </>
  )
}
