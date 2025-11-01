"use client"

import type React from "react"

import { FileText, Download, Smartphone, Laptop, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Manual {
  name: string
  version: string
  pages: number
}

interface ProductCategory {
  name: string
  icon: React.ReactNode
  manuals: Manual[]
}

const productCategories: ProductCategory[] = [
  {
    name: "Mobile",
    icon: <Smartphone className="w-5 h-5" />,
    manuals: [
      { name: "Galaxy S24", version: "v3.2", pages: 45 },
      { name: "Galaxy S23", version: "v3.0", pages: 42 },
      { name: "iPhone 15 Pro", version: "v2.8", pages: 38 },
      { name: "iPhone 14", version: "v2.5", pages: 35 },
      { name: "Pixel 8 Pro", version: "v1.9", pages: 40 },
      { name: "OnePlus 12", version: "v2.1", pages: 36 },
      { name: "Xiaomi 14", version: "v1.7", pages: 34 },
    ],
  },
  {
    name: "Laptop",
    icon: <Laptop className="w-5 h-5" />,
    manuals: [
      { name: "ThinkPad X1 Carbon", version: "v4.1", pages: 68 },
      { name: "MacBook Pro 14", version: "v3.8", pages: 55 },
      { name: "Dell XPS 15", version: "v3.5", pages: 62 },
      { name: "HP Spectre x360", version: "v2.9", pages: 58 },
      { name: "ASUS ROG Strix", version: "v3.2", pages: 72 },
      { name: "Surface Laptop 5", version: "v2.6", pages: 50 },
    ],
  },
  {
    name: "Television",
    icon: <Tv className="w-5 h-5" />,
    manuals: [
      { name: 'OLED 65"', version: "v5.0", pages: 78 },
      { name: 'QLED 55"', version: "v4.5", pages: 70 },
      { name: 'LED 43"', version: "v4.2", pages: 60 },
      { name: 'OLED 77"', version: "v5.1", pages: 82 },
      { name: 'QLED 65"', version: "v4.6", pages: 72 },
      { name: 'Smart TV 50"', version: "v3.9", pages: 65 },
    ],
  },
]

export function ProductManualsSection() {
  const handleDownload = (productName: string, manualName: string) => {
    // In a real app, this would trigger a PDF download
    console.log(`Downloading ${productName} - ${manualName}`)
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Product User Manuals</h2>
      </div>

      <Accordion type="multiple" className="w-full">
        {productCategories.map((category) => (
          <AccordionItem key={category.name} value={category.name} className="border-b-0 mb-4">
            <AccordionTrigger className="bg-muted/50 rounded-lg p-4 hover:no-underline hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="text-primary">{category.icon}</div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-0">
              <div className="space-y-3">
                {category.manuals.map((manual) => (
                  <div
                    key={`${category.name}-${manual.name}`}
                    className="flex items-center justify-between bg-background rounded p-3 border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{manual.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {manual.version} • {manual.pages} pages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(category.name, manual.name)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
