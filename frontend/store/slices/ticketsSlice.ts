import { createSlice } from "@reduxjs/toolkit"
import type { TicketsState } from "../types"
import { DEFAULT_TICKETS, DEFAULT_RESOLVED_TICKETS, DEFAULT_ORDERS } from "../constants"
import { ticketsReducers } from "../reducers/ticketsReducer"

const initialState: TicketsState = {
  tickets: DEFAULT_TICKETS,
  resolvedTickets: DEFAULT_RESOLVED_TICKETS,
  orders: DEFAULT_ORDERS,
}

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: ticketsReducers,
})

export const ticketSliceAction = ticketsSlice.actions
export default ticketsSlice.reducer
