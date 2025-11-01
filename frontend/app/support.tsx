"use client"

import { Sidebar } from "@/components/sidebar"

export default function SupportPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Support</h1>
            <p className="text-muted-foreground">Get help from our support team.</p>
          </div>

          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Connect with a support agent</p>
          </div>
        </div>
      </main>
    </div>
  )
}
