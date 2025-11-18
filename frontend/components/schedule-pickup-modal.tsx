"use client"

import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { X, Calendar, Clock, MapPin, Phone, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { ticketSliceAction } from "@/store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useTickets } from "@/hooks/useTickets"

// Device models mapped to product types
const DEVICE_MODELS = {
  mobile: [
    "Galaxy S24",
    "Galaxy S23",
    "iPhone 15 Pro",
    "iPhone 14",
    "Pixel 8 Pro",
    "OnePlus 12",
    "Xiaomi 14",
  ],
  tv: [
    'OLED 65"',
    'QLED 55"',
    'LED 43"',
    'OLED 77"',
    'QLED 65"',
    'Smart TV 50"',
  ],
  laptop: [
    "ThinkPad X1 Carbon",
    "MacBook Pro 14",
    "Dell XPS 15",
    "HP Spectre x360",
    "ASUS ROG Strix",
    "Surface Laptop 5",
  ],
}

interface FormErrors {
  product: string;
  issue: string;
  pickupDate: string;
  timeSlot: string;
  address: string;
  contactNumber: string;
}

interface SchedulePickupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SchedulePickupModal({ isOpen, onClose }: SchedulePickupModalProps) {
  const [formData, setFormData] = useState({
    product: "",
    deviceModel: "",
    issue: "",
    pickupDate: "",
    timeSlot: "",
    address: "",
    contactNumber: "",
    notes: "",
  })

  const [phoneError, setPhoneError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { createTicket } = useTickets()
  const dispatch = useAppDispatch()

  // Set initial pickup date after component mounts
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pickupDate: new Date().toISOString().split('T')[0]
    }))
  }, [])
  
  // Reset device model when product changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      deviceModel: ""
    }))
  }, [formData.product])


  const validatePhoneNumber = (phone: string): boolean => {
    // Allow +91 followed by 10 digits, or just 10 digits
    const phoneRegex = /^(\+91)?[1-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value
    setFormData({ ...formData, contactNumber: phone })
    
    if (phone.length > 0) {
      if (!validatePhoneNumber(phone)) {
        setPhoneError("Please enter a valid mobile number")
      } else {
        setPhoneError("")
      }
    } else {
      setPhoneError("")
    }
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validatePhoneNumber(formData.contactNumber)) {
      setPhoneError("Please enter a valid Indian mobile number")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare data for API
      const ticketData = {
        description: formData.issue,
        product_category: formData.product,
        device_model: formData.deviceModel,
        pickup_date: formData.pickupDate,
        preferred_time_slot: formData.timeSlot,
        pickup_address: formData.address,
        contact: formData.contactNumber,
        status: "Not Picked"
      }

      await createTicket(ticketData)
      
      // Reset form
      setFormData({
        product: "",
        deviceModel: "",
        issue: "",
        pickupDate: new Date().toISOString().split('T')[0],
        timeSlot: "",
        address: "",
        contactNumber: "",
        notes: "",
      })
      setPhoneError("")
      
      toast({
        title: "Ticket Created Successfully",
        description: "Your service request has been submitted. You can track its status in the Active Support Tickets.",
        duration: 3000
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Error Creating Ticket",
        description: "Failed to create ticket. Please try again.",
        duration: 3000,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Ticket</h2>
            <p className="text-sm text-muted-foreground mt-1">Create a new service request ticket</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Product</label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a product</option>
                <option value="mobile">Mobile Phone</option>
                <option value="tv">Television</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>

            {/* Device Model */}
            {formData.product && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Device Model</label>
                <select
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a model</option>
                  {DEVICE_MODELS[formData.product as keyof typeof DEVICE_MODELS]?.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Issue Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Describe the Issue</label>
              <input
                type="text"
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="e.g., Screen not working, No power, Sound issues"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Pickup Date
            </label>
            <input
              type="date"
              value={formData.pickupDate}
              onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preferred Time Slot */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Preferred Time Slot
            </label>
            <select
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select time slot</option>
              <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
              <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
              <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
              <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
            </select>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Pickup Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete pickup address with landmarks..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="flex items-center text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 mr-2" />
              Contact Number
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={formData.contactNumber}
                onChange={handlePhoneChange}
                placeholder="+91 XXXXX XXXXX"
                className={`w-full px-3 py-2 border ${
                  phoneError ? 'border-red-500' : 'border-input'
                } rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
                  phoneError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {phoneError && (
                <p className="text-sm text-red-500">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific instructions for the pickup..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Ticket Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Service Information</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Gold tier members receive priority service</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Free pickup and delivery for all repairs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Track your repair status in real-time</span>
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
              className="flex-1 bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.product || !formData.deviceModel || !formData.issue || !formData.pickupDate || !formData.timeSlot || !formData.address || !formData.contactNumber || isSubmitting}
            >
              {isSubmitting ? "Creating Ticket..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
