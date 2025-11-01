import type { PayloadAction } from "@reduxjs/toolkit"
import type { Ticket, TicketsState, ResolvedTicket, Order } from "../types"
import { generateSteps } from "../constants"

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

export const ticketsReducers = {
  // Tickets
  createTicket: (state: TicketsState, action: PayloadAction<Omit<Ticket, "id" | "createdAt" | "steps">>) => {
    const status = action.payload.status || "Not Picked"
    // Generate a shorter ID using a random 4-digit number
    const shortId = Math.floor(1000 + Math.random() * 9000)
    const newTicket: Ticket = {
      ...action.payload,
      id: `TKT-${shortId}`,
      status,
      createdAt: new Date().toISOString(),
      steps: generateSteps(status),
    }
    state.tickets.unshift(newTicket)
  },

  setTicketStatus: (state: TicketsState, action: PayloadAction<{ id: string; status: string }>) => {
    const { id, status } = action.payload
    const ticket = state.tickets.find(t => t.id === id)
    if (!ticket) return
    ticket.status = status
    ticket.steps = generateSteps(status)
  },

  deleteTicket: (state: TicketsState, action: PayloadAction<{ id: string }>) => {
    state.tickets = state.tickets.filter(t => t.id !== action.payload.id)
  },

  // Resolved tickets
  resolveTicket: (
    state: TicketsState,
    action: PayloadAction<{ id: string; resolution: string; resolvedBy: string; resolvedDate?: string }>
  ) => {
    const { id, resolution, resolvedBy, resolvedDate } = action.payload
    const ticket = state.tickets.find(t => t.id === id)
    if (!ticket) return

    // Move/update status to Delivered and add to resolved list
    ticket.status = "Delivered"
    ticket.steps = generateSteps("Delivered")

    const resolved: ResolvedTicket = {
      id: ticket.id,
      product: `${capitalize(ticket.product)} - ${ticket.deviceModel}`,
      issue: ticket.issue,
      resolution,
      resolvedBy,
      resolvedDate: resolvedDate || new Date().toISOString().split("T")[0],
    }
    state.resolvedTickets.unshift(resolved)
  },

  addResolvedTicket: (state: TicketsState, action: PayloadAction<ResolvedTicket>) => {
    state.resolvedTickets.unshift(action.payload)
  },

  removeResolvedTicket: (state: TicketsState, action: PayloadAction<{ id: string }>) => {
    state.resolvedTickets = state.resolvedTickets.filter(r => r.id !== action.payload.id)
  },

  // Orders (purchase history)
  addOrder: (state: TicketsState, action: PayloadAction<Order>) => {
    state.orders.unshift(action.payload)
  },

  removeOrder: (state: TicketsState, action: PayloadAction<{ id: string }>) => {
    state.orders = state.orders.filter(o => o.id !== action.payload.id)
  },
}
