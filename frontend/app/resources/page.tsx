"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { FAQSection } from "@/components/faq-section"
import { ProductManualsSection } from "@/components/product-manuals-section"

export default function ResourcesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Resources</h1>
            <p className="text-muted-foreground">Find answers and helpful resources.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FAQSection />
            <ProductManualsSection />
          </div>
        </div>
      </main>
    </div>
  )
}
