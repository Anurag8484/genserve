"use client"

import type React from "react"

import { useState } from "react"
import { X, Package, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { useAppSelector } from "@/store/hooks"
import { ticketSliceAction } from "@/store"
import { useToast } from "@/components/ui/use-toast"

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

interface OrderComponentsModalProps {
  isOpen: boolean
  onClose: () => void
}

const componentsByDevice: Record<string, string[]> = {
  mobile: ["Battery", "Screen", "Charging Port", "Speaker", "Microphone"],
  tv: ["Power Supply", "HDMI Port", "Remote Control", "Backlight", "Main Board"],
  laptop: ["Hard Drive", "RAM", "Battery", "Keyboard", "Display Panel"],
}

export function OrderComponentsModal({ isOpen, onClose }: OrderComponentsModalProps) {
  const [formData, setFormData] = useState({
    deviceType: "",
    component: "",
    ticketId: "",
    notes: "",
  })

  const dispatch = useAppDispatch()
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const { toast } = useToast()
  const availableTickets = tickets.map(t => ({
    id: t.id,
    device: `${capitalize(t.product)} - ${t.deviceModel}`,
    issue: t.issue,
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Build an Order entry so it appears in Purchase History
    const orderId = `P-${Math.floor(1000 + Math.random() * 9000)}`
    const orderDate = new Date().toISOString().split('T')[0]
    const product = `${capitalize(formData.deviceType)} - ${formData.component}`
    dispatch(
      ticketSliceAction.addOrder({
        id: orderId,
        product,
        orderDate,
        // These fields are required by the Order type though not displayed in UI
        serviceTier: "Gold",
        status: "Active",
      })
    )
    toast({
      title: "Order Placed Successfully",
      description: `${product} ordered with reference ${orderId}. Check Purchase History for details.`,
      duration: 3000,
    })
    onClose()
  }

  const availableComponents = formData.deviceType ? componentsByDevice[formData.deviceType] : []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Order Components</h2>
            <p className="text-sm text-muted-foreground mt-1">Request replacement parts for your device</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Device Type</label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({ ...formData, deviceType: e.target.value, component: "" })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose a device type</option>
              <option value="mobile">Mobile Phone</option>
              <option value="tv">Television</option>
              <option value="laptop">Laptop</option>
            </select>
          </div>

          {/* Component Selection */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <Package className="w-4 h-4 mr-2" />
              Select Component
            </label>
            <select
              value={formData.component}
              onChange={(e) => setFormData({ ...formData, component: e.target.value })}
              disabled={!formData.deviceType}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a component</option>
              {availableComponents.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket Selection */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <Zap className="w-4 h-4 mr-2" />
              Select Ticket
            </label>
            <select
              value={formData.ticketId}
              onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a ticket</option>
              {availableTickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.id} - {ticket.device} ({ticket.issue})
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific requirements or preferences..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
            />
          </div>

          {/* Order Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Order Information</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Genuine replacement parts with warranty</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Delivery within 2-3 business days</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Installation support available</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.deviceType || !formData.component || !formData.ticketId}
              className="flex-1 bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Order Components
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
