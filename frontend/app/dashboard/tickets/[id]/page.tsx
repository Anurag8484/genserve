"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/sidebar";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Package,
  Phone,
  Wrench,
} from "lucide-react";
import Link from "next/link";

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

const getStepIcon = (status: string) => {
  switch (status) {
    case "Picked":
      return <Package className="h-5 w-5" />;
    case "In Service":
      return <Wrench className="h-5 w-5" />;
    case "Repaired":
      return <CheckCircle2 className="h-5 w-5" />;
    case "Delivered":
      return <Home className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const ticket = useAppSelector((state) =>
    state.tickets.tickets.find((t) => t.id === ticketId)
  );

  if (!ticket) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Ticket Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The ticket with ID <span className="font-mono font-semibold">{ticketId}</span> could not be found.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Ticket Details</h1>
              <p className="text-muted-foreground">Track your service request progress</p>
            </div>
          </div>
          <Badge className={getStatusColor(ticket.status)} style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            {ticket.status}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket ID</p>
                    <p className="font-mono text-lg font-semibold">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-lg">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Product</p>
                    <p className="text-lg">{ticket.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <p className="text-lg">{ticket.deviceModel}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Description</p>
                  <p className="mt-1 text-base">{ticket.issue}</p>
                </div>

                {ticket.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                      <p className="mt-1 text-base text-muted-foreground">{ticket.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Service Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            step.completed
                              ? "bg-green-100 text-green-600"
                              : step.current
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {getStepIcon(step.status)}
                        </div>
                        {index < ticket.steps.length - 1 && (
                          <div
                            className={`h-12 w-0.5 ${
                              step.completed ? "bg-green-200" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-semibold ${
                              step.current ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.status}
                          </h3>
                          {step.completed && (
                            <span className="text-xs text-muted-foreground">{step.time}</span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pickup Details */}
            <Card>
              <CardHeader>
                <CardTitle>Pickup Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.pickupDate}
                    </p>
                    <p className="text-sm text-muted-foreground">{ticket.timeSlot}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{ticket.address}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{ticket.contactNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Cancel Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
