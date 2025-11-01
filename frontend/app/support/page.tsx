"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LiveSupportChat } from "@/components/live-support-chat"

export default function SupportPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-8 h-[calc(100vh-80px)]">
          <LiveSupportChat />
        </div>
      </main>
    </div>
  )
}
