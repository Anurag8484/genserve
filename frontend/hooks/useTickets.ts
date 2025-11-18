import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ticketSliceAction } from '@/store'
import { api } from '@/lib/api'
import type { Ticket } from '@/store/types'

// Function to transform backend ticket data to frontend format
function transformTicketData(backendTicket: any): Ticket {
  const statusSteps = ["Not Picked", "Picked", "In Service", "Repaired", "Delivered"]
  const currentIndex = statusSteps.indexOf(backendTicket.status) !== -1 
    ? statusSteps.indexOf(backendTicket.status) 
    : 0

  const steps = statusSteps.map((status, index) => ({
    status,
    description: getStepDescription(status),
    time: index <= currentIndex ? 
      new Date(Date.now() - (statusSteps.length - index - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Pending',
    completed: index < currentIndex,
    current: index === currentIndex,
  }))

  return {
    id: backendTicket.id.toString(),
    product: backendTicket.product?.category || 'Unknown',
    deviceModel: backendTicket.product?.name || 'Unknown Model',
    issue: backendTicket.description || 'No description provided',
    pickupDate: backendTicket.pickup_date || new Date().toISOString(),
    timeSlot: backendTicket.preferred_time_slot || 'Not specified',
    address: backendTicket.pickup_address || 'Not provided',
    contactNumber: backendTicket.contact || 'Not provided',
    notes: backendTicket.notes || '',
    status: backendTicket.status || 'Not Picked',
    createdAt: backendTicket.created_at || new Date().toISOString(),
    steps,
  }
}

function getStepDescription(status: string): string {
  const descriptions = {
    "Not Picked": "Device to be picked up from your location",
    "Picked": "Device picked up from your location", 
    "In Service": "Device is being repaired at service center",
    "Repaired": "Repair completed and quality checked",
    "Delivered": "Device delivered to you",
  }
  return descriptions[status as keyof typeof descriptions] || status
}

export function useTickets() {
  const dispatch = useAppDispatch()
  const tickets = useAppSelector((state) => state.tickets.tickets)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const backendTickets = await api.getAllTickets()
      const transformedTickets = backendTickets.map(transformTicketData)
      
      dispatch(ticketSliceAction.replaceTickets(transformedTickets))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets'
      setError(errorMessage)
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async (ticketData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.createTicketTest(ticketData)
      const transformedTicket = transformTicketData(response.ticket)
      
      dispatch(ticketSliceAction.addTicket(transformedTicket))
      return transformedTicket
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket'
      setError(errorMessage)
      console.error('Error creating ticket:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.updateTicketStatus(parseInt(ticketId), status)
      const transformedTicket = transformTicketData(response.ticket)
      
      dispatch(ticketSliceAction.updateTicket({
        id: ticketId,
        updates: transformedTicket
      }))
      
      return transformedTicket
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket status'
      setError(errorMessage)
      console.error('Error updating ticket status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch tickets on mount
  useEffect(() => {
    fetchTickets()
  }, [])

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicketStatus,
  }
}