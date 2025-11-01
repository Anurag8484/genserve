"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ActionCards } from "@/components/action-cards"
import { TicketList } from "@/components/ticket-list"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("My Tickets")

  return (
    <div className="flex h-screen bg-background">
      <Toaster />
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Track your support requests and devices.</p>
          </div>

          <ActionCards />

          <div className="mt-8">

            {activeTab === "My Tickets" && (
              <div className="space-y-8">
                <TicketList />
              </div>
            )}

            {activeTab === "History" && (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">Your ticket history will appear here</p>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">Support resources and documentation</p>
              </div>
            )}

            {activeTab === "Live Support" && (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">Connect with a support agent</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
