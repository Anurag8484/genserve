import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ticketSliceAction } from '@/store'
import { api } from '@/lib/api'
import type { Order } from '@/store/types'

// Function to transform backend order data to frontend format
function transformOrderData(backendOrder: any): Order {
  return {
    id: backendOrder.order_id || backendOrder.id.toString(),
    product: `${backendOrder.device_type.charAt(0).toUpperCase() + backendOrder.device_type.slice(1)} - ${backendOrder.component_name}`,
    orderDate: backendOrder.created_at ? new Date(backendOrder.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    serviceTier: backendOrder.service_tier || 'Gold',
    status: (backendOrder.status === 'Ordered' || backendOrder.status === 'Active') ? 'Active' as const : 'Expired' as const,
  }
}

export function useOrders() {
  const dispatch = useAppDispatch()
  const orders = useAppSelector((state) => state.tickets.orders)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const backendOrders = await api.getAllOrders()
      const transformedOrders = backendOrders.map(transformOrderData)
      
      // Update Redux store - we'll need to add actions for orders
      // For now, we'll replace the existing orders
      dispatch(ticketSliceAction.replaceOrders(transformedOrders))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders'
      setError(errorMessage)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (orderData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.createOrderTest(orderData)
      const transformedOrder = transformOrderData(response.order)
      
      dispatch(ticketSliceAction.addOrder(transformedOrder))
      return transformedOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      console.error('Error creating order:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.updateOrderStatus(parseInt(orderId), status)
      const transformedOrder = transformOrderData(response.order)
      
      // Update the order in the store
      // For now, we'll replace the entire orders array
      await fetchOrders()
      
      return transformedOrder
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status'
      setError(errorMessage)
      console.error('Error updating order status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch orders on mount
  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  }
}