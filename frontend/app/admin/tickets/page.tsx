"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Download, Filter, Search, Eye } from "lucide-react";
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

// Mock user names for tickets
const mockUsers = [
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Sarah Davis",
  "James Taylor",
];

export default function AdminAllTicketsPage() {
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const resolvedTickets = useAppSelector((state) => state.tickets.resolvedTickets);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  // Combine all tickets with mock user assignments
  const allTickets = [
    ...tickets.map((t, i) => ({ 
      ...t, 
      userName: mockUsers[i % mockUsers.length],
      resolved: false 
    })),
    ...resolvedTickets.map((t, i) => ({ 
      ...t, 
      userName: mockUsers[i % mockUsers.length],
      status: "Delivered",
      createdAt: t.resolvedDate,
      deviceModel: "N/A",
      pickupDate: "N/A",
      timeSlot: "N/A",
      address: "N/A",
      contactNumber: "N/A",
      notes: t.resolution,
      steps: [],
      resolved: true
    }))
  ];

  // Apply filters
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    const matchesProduct =
      productFilter === "all" || ticket.product === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  // Get unique products for filter
  const uniqueProducts = Array.from(new Set(allTickets.map((t) => t.product)));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">All Tickets</h1>
              <p className="text-muted-foreground">
                Manage and monitor all support tickets
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{allTickets.length}</div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {allTickets.filter((t) => t.status === "In Service").length}
              </div>
              <p className="text-xs text-muted-foreground">In Service</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {allTickets.filter((t) => t.status === "Repaired").length}
              </div>
              <p className="text-xs text-muted-foreground">Repaired</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {resolvedTickets.length}
              </div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by ticket ID, product, user, or issue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Picked">Picked</SelectItem>
                  <SelectItem value="In Service">In Service</SelectItem>
                  <SelectItem value="Repaired">Repaired</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Tickets ({filteredTickets.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing {filteredTickets.length} of {allTickets.length} tickets
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No tickets found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono font-medium">
                          {ticket.id}
                        </TableCell>
                        <TableCell>{ticket.userName}</TableCell>
                        <TableCell>{ticket.product}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {ticket.issue}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/tickets/${ticket.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
    </div>
  );
}
