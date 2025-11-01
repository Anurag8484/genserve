"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Ticket, Clock, Headphones, Bell, Settings, LogOut, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Ticket, label: "Track Tickets", href: "/track-tickets" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: BookOpen, label: "Resources", href: "/resources" },
  { icon: Headphones, label: "Support", href: "/support" },
]

export function Sidebar() {
  const [role, setRole] = useState("Customer")
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-xl">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Genserve</h2> 
            <p className="text-xs text-muted-foreground">Support Platform</p>
          </div>
        </div>
      </div>


      {/* Role Switcher */}
      <div className="p-4 border-b">
        <label className="text-xs text-muted-foreground mb-2 block">Demo: Switch Role</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Agent">Agent</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
            <span className="text-background font-medium text-sm">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-3">
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            Gold Tier
          </Badge>
        </div>
      </div>
    </aside>
  )
}
