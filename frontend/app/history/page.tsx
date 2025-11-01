"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PurchaseHistory } from "@/components/purchase-history"
import { ResolvedIssues } from "@/components/resolved-issues"
import type { RootState } from "@/store"

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"purchase" | "resolved">("resolved")
  const { orders, resolvedTickets } = useSelector((state: RootState) => state.tickets)

  const tabs = [
    { id: "resolved", label: "Resolved Issues" },
    { id: "purchase", label: "Purchase History" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Customer History</h1>
          </div>

          <div className="flex gap-4 mb-8 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "purchase" | "resolved")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "resolved" && <ResolvedIssues tickets={resolvedTickets} />}
            {activeTab === "purchase" && <PurchaseHistory orders={orders} />}
          </div>
        </div>
      </main>
    </div>
  )
}
