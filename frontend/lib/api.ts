const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add JWT token if available
  if (typeof window !== 'undefined') {  
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// API endpoints
export const api = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { email: string; password: string; name: string }) =>
    apiRequest<{ access_token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Tickets
  getAllTickets: () =>
    apiRequest<any[]>('/api/tickets/test_tickets'),

  getAllTicketsAuth: () =>
    apiRequest<any[]>('/api/tickets/get_all_ticket'),

  createTicket: (ticketData: any) =>
    apiRequest<{ ticket: any }>('/api/tickets/create', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),

  createTicketTest: (ticketData: any) =>
    apiRequest<{ ticket: any }>('/api/tickets/test_create', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),

  updateTicketStatus: (id: number, status: string) =>
    apiRequest<{ ticket: any }>(`/api/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  closeTicket: (id: number) =>
    apiRequest<{ ticket: any }>(`/api/tickets/${id}/close`, {
      method: 'PUT',
    }),

  // Products
  getAllProducts: () =>
    apiRequest<any[]>('/api/products/get_all_product'),

  // FAQs
  getAllFAQs: () =>
    apiRequest<any[]>('/api/ai/faq/get_all_faq'),

  // Orders
  getAllOrders: () =>
    apiRequest<any[]>('/api/orders/test_orders'),

  getAllOrdersAuth: () =>
    apiRequest<any[]>('/api/orders/get_all_orders'),

  createOrder: (orderData: any) =>
    apiRequest<{ order: any }>('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  createOrderTest: (orderData: any) =>
    apiRequest<{ order: any }>('/api/orders/test_create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateOrderStatus: (id: number, status: string) =>
    apiRequest<{ order: any }>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // AI Chat
  sendChatMessage: (message: string) =>
    apiRequest<{ response: string }>('/api/ai/chat_test', {
      method: 'POST',
      body: JSON.stringify({ query: message }),
    }),

  sendChatMessageAuth: (message: string) =>
    apiRequest<{ response: string }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query: message }),
    }),
}

export default api