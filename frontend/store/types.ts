export interface Step {
  status: string
  description: string
  time: string
  completed: boolean
  current: boolean
}

export interface Ticket {
  id: string
  product: string
  deviceModel: string
  issue: string
  pickupDate: string
  timeSlot: string
  address: string
  contactNumber: string
  notes: string
  status: string
  createdAt: string
  steps: Step[]
}

export interface ResolvedTicket {
  id: string
  product: string
  issue: string
  resolution: string
  resolvedBy: string
  resolvedDate: string
}

export interface Order {
  id: string
  product: string
  orderDate: string
  serviceTier: string
  status: "Active" | "Expired"
}

export interface TicketsState {
  tickets: Ticket[]
  resolvedTickets: ResolvedTicket[]
  orders: Order[]
}
