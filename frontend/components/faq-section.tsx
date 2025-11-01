"use client"

import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    id: "1",
    question: "How do I track my repair status?",
    answer:
      "You can track your repair status in real-time through the 'Track Tickets' section. Simply select your ticket number to view the current stage of your repair, estimated completion time, and any updates from our service team.",
  },
  {
    id: "2",
    question: "What's included in my Gold service tier?",
    answer:
      "Gold tier includes priority scheduling, free pickup and delivery, expedited repairs (24-48 hours), free diagnostics, and 24/7 customer support. You also get extended warranty coverage and priority access to replacement components.",
  },
  {
    id: "3",
    question: "How do I schedule a pickup?",
    answer:
      "Click on 'Schedule Pickup' from the dashboard. Select your device, preferred date and time, and provide your pickup address. You'll receive SMS and email confirmation with your pickup details.",
  },
  {
    id: "4",
    question: "Can I order replacement components myself?",
    answer:
      "Yes, you can order replacement components through the 'Order Components' option on the dashboard. Select your device type, choose the components you need, and we'll ship them to you. Installation guides are available in the Resources section.",
  },
]

export function FAQSection() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-foreground hover:text-primary">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
