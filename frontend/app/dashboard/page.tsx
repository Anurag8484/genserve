"use client";

import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Wrench, Package } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Picked":
      return "bg-gray-100 text-gray-700";
    case "In Service":
      return "bg-blue-100 text-blue-700";
    case "Repaired":
      return "bg-green-100 text-green-700";
    case "Delivered":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function DashboardPage() {
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const resolvedTickets = useAppSelector((state) => state.tickets.resolvedTickets);

  const activeTickets = tickets.filter((t) => t.status !== "Delivered");
  const inServiceCount = tickets.filter((t) => t.status === "In Service").length;
  const repairedCount = tickets.filter((t) => t.status === "Repaired").length;
  const pendingPickup = tickets.filter((t) => t.status === "Picked").length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your tickets.</p>
          </div>
          <Link href="/track-tickets">
            <Button>+ New Ticket</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets.length}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Service</CardTitle>
              <Wrench className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inServiceCount}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Repaired</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repairedCount}</div>
              <p className="text-xs text-muted-foreground">Ready for delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No active tickets</p>
                <Link href="/track-tickets">
                  <Button className="mt-4" variant="outline">
                    Create New Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              activeTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{ticket.id}</span>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </div>
                    <p className="text-sm font-medium">
                      {ticket.product} - {ticket.deviceModel}
                    </p>
                    <p className="text-sm text-muted-foreground">{ticket.issue}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/dashboard/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Resolved Tickets */}
        {resolvedTickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Resolved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resolvedTickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{ticket.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.product} - {ticket.issue}</p>
                    <p className="text-xs text-muted-foreground">
                      Resolved by {ticket.resolvedBy} on {new Date(ticket.resolvedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      </main>
    </div>
  );
}
