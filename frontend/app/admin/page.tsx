"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Star,
  Award,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock agent data - in production, fetch from backend
const agents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@genserve.com",
    avatar: "SJ",
    ticketsResolved: 145,
    avgResolutionTime: "2.3 hrs",
    customerRating: 4.8,
    feedbackCount: 128,
    positiveFeedback: 122,
    status: "Active",
    specialization: "Hardware",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@genserve.com",
    avatar: "MC",
    ticketsResolved: 132,
    avgResolutionTime: "2.1 hrs",
    customerRating: 4.9,
    feedbackCount: 115,
    positiveFeedback: 112,
    status: "Active",
    specialization: "Software",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@genserve.com",
    avatar: "ER",
    ticketsResolved: 128,
    avgResolutionTime: "2.5 hrs",
    customerRating: 4.7,
    feedbackCount: 110,
    positiveFeedback: 102,
    status: "Active",
    specialization: "Network",
  },
  {
    id: "4",
    name: "David Kim",
    email: "d.kim@genserve.com",
    avatar: "DK",
    ticketsResolved: 98,
    avgResolutionTime: "3.1 hrs",
    customerRating: 4.6,
    feedbackCount: 89,
    positiveFeedback: 82,
    status: "Active",
    specialization: "Hardware",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@genserve.com",
    avatar: "LA",
    ticketsResolved: 87,
    avgResolutionTime: "2.8 hrs",
    customerRating: 4.5,
    feedbackCount: 76,
    positiveFeedback: 68,
    status: "On Break",
    specialization: "Software",
  },
];

export default function AdminDashboardPage() {
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const resolvedTickets = useAppSelector((state) => state.tickets.resolvedTickets);
  const [sortBy, setSortBy] = useState<"resolved" | "rating" | "time">("resolved");

  const totalTickets = tickets.length + resolvedTickets.length;
  const activeTickets = tickets.filter((t) => t.status !== "Delivered").length;
  const avgResolutionRate = resolvedTickets.length > 0 
    ? ((resolvedTickets.length / totalTickets) * 100).toFixed(1) 
    : "0";

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortBy === "resolved") return b.ticketsResolved - a.ticketsResolved;
    if (sortBy === "rating") return b.customerRating - a.customerRating;
    return parseFloat(a.avgResolutionTime) - parseFloat(b.avgResolutionTime);
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor operations and team performance</p>
          </div>
          <Link href="/admin/tickets">
            <Button>View All Tickets</Button>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              <p className="text-xs text-muted-foreground">{avgResolutionRate}% resolution rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.filter(a => a.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Out of {agents.length} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Agent Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Agent Leaderboard
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Performance metrics and customer feedback
                </p>
              </div>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  <TabsTrigger value="rating">Rating</TabsTrigger>
                  <TabsTrigger value="time">Speed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-center">Tickets Resolved</TableHead>
                  <TableHead className="text-center">Avg Time</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-center">Feedback</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAgents.map((agent, index) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      {index === 0 && <Award className="inline h-4 w-4 text-yellow-500 mr-1" />}
                      {index === 1 && <Award className="inline h-4 w-4 text-gray-400 mr-1" />}
                      {index === 2 && <Award className="inline h-4 w-4 text-amber-600 mr-1" />}
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{agent.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{agent.specialization}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">{agent.ticketsResolved}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{agent.avgResolutionTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{agent.customerRating}</span>
                        <span className="text-xs text-muted-foreground">/5</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <ThumbsUp className="h-3 w-3 text-green-500" />
                          <span>{agent.positiveFeedback}</span>
                          <span className="text-muted-foreground">/ {agent.feedbackCount}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          {((agent.positiveFeedback / agent.feedbackCount) * 100).toFixed(0)}% positive
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={agent.status === "Active" ? "default" : "secondary"}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:bg-secondary/50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Performance Reports</h3>
                  <p className="text-sm text-muted-foreground">View detailed analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-secondary/50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Agents</h3>
                  <p className="text-sm text-muted-foreground">Add or edit team members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:bg-secondary/50 cursor-pointer transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Feedback</h3>
                  <p className="text-sm text-muted-foreground">Review all feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
    </div>
  );
}
