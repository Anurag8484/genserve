"use client"

import { Sidebar } from "@/components/sidebar"

export default function HistoryPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">History</h1>
            <p className="text-muted-foreground">View your past support tickets and interactions.</p>
          </div>

          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Your ticket history will appear here</p>
          </div>
        </div>
      </main>
    </div>
  )
}
