import type { Ticket, ResolvedTicket, Order } from "./types"

// Helper function to generate repair steps based on current status
export const generateSteps = (currentStatus: string) => {
  const allStatuses = ["Not Picked", "Picked", "In Service", "Repaired", "Delivered"]
  const currentIndex = allStatuses.indexOf(currentStatus)
  
  return [
    {
      status: "Not Picked",
      description: "Device to be picked up from your location",
      time: "Oct 18, 2025 - 9:00 AM",
      completed: currentIndex > 0,
      current: currentStatus === "Not Picked",
    },
    {
      status: "Picked",
      description: "Device picked up from your location",
      time: currentIndex >= 1 ? "Oct 20, 2025 - 10:30 AM" : "Pending",
      completed: currentIndex > 1,
      current: currentStatus === "Picked",
    },
    {
      status: "In Service",
      description: "Device is being repaired at service center",
      time: currentIndex >= 2 ? "Oct 21, 2025 - 2:15 PM" : "Pending",
      completed: currentIndex > 2,
      current: currentStatus === "In Service",
    },
    {
      status: "Repaired",
      description: "Repair completed and quality checked",
      time: currentIndex >= 3 ? "Oct 24, 2025 - 11:45 AM" : "Pending",
      completed: currentIndex > 3,
      current: currentStatus === "Repaired",
    },
    {
      status: "Delivered",
      description: "Device delivered to you",
      time: currentIndex >= 4 ? "Oct 25, 2025 - 3:00 PM" : "Pending",
      completed: currentIndex >= 4,
      current: currentStatus === "Delivered",
    },
  ]
}

// Default tickets data
export const DEFAULT_TICKETS: Ticket[] = [
  {
    id: "TKT-1234",
    product: "laptop",
    deviceModel: "ThinkPad X1 Carbon",
    issue: "Screen flickering intermittently",
    pickupDate: "2025-10-25",
    timeSlot: "10:00 AM - 12:00 PM",
    address: "123 Main Street, Apt 4B",
    contactNumber: "+1 (555) 123-4567",
    notes: "Please call before pickup",
    status: "In Service",
    createdAt: "2025-10-20T10:30:00Z",
    steps: generateSteps("In Service"),
  },
  {
    id: "TKT-1235",
    product: "mobile",
    deviceModel: "Galaxy S24",
    issue: "Charging port loose",
    pickupDate: "2025-10-28",
    timeSlot: "2:00 PM - 4:00 PM",
    address: "456 Oak Avenue",
    contactNumber: "+1 (555) 987-6543",
    notes: "Gate code: 1234",
    status: "Picked",
    createdAt: "2025-10-22T14:15:00Z",
    steps: generateSteps("Picked"),
  },
]

// Default resolved tickets data
export const DEFAULT_RESOLVED_TICKETS: ResolvedTicket[] = [
  {
    id: "TKT-1150",
    product: "Laptop - Standard",
    issue: "Battery draining fast",
    resolution: "Battery replaced with new unit. Calibration performed. Issue resolved.",
    resolvedBy: "Mike R.",
    resolvedDate: "2025-09-15",
  },
  {
    id: "TKT-1089",
    product: "TV - Premium",
    issue: "HDMI port not working",
    resolution: "HDMI board replaced. All ports tested and functioning correctly.",
    resolvedBy: "Emily K.",
    resolvedDate: "2025-07-22",
  },
]

// Default orders data
export const DEFAULT_ORDERS: Order[] = [
  {
    id: "P-1001",
    product: "Mobile - Premium (Galaxy S24)",
    orderDate: "2025-08-15",
    serviceTier: "Gold",
    status: "Active",
  },
  {
    id: "P-0987",
    product: 'TV - Premium (OLED 65")',
    orderDate: "2025-03-22",
    serviceTier: "Gold",
    status: "Active",
  },
  {
    id: "P-0856",
    product: "Laptop - Standard (ThinkBook 15)",
    orderDate: "2023-11-10",
    serviceTier: "Medium",
    status: "Expired",
  },
]
