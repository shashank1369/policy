"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertCircle, CheckCircle2, CreditCard, FileText, Filter, Search, Upload, User } from "lucide-react"
import Image from "next/image"

type ActivityItem = {
  id: string
  date: string
  type: "login" | "payment" | "document" | "policy" | "claim" | "profile"
  description: string
  details?: string
  status?: "success" | "warning" | "error"
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const activityItems: ActivityItem[] = [
    {
      id: "ACT-001",
      date: "2023-04-20T14:30:00",
      type: "login",
      description: "Successful login from Mumbai, India",
      status: "success",
    },
    {
      id: "ACT-002",
      date: "2023-04-15T10:15:00",
      type: "payment",
      description: "Premium payment for Home Insurance",
      details: "Transaction ID: TXN-2023-001",
      status: "success",
    },
    {
      id: "ACT-003",
      date: "2023-04-10T16:45:00",
      type: "document",
      description: "Uploaded property document",
      details: "Document type: Property Deed",
      status: "success",
    },
    {
      id: "ACT-004",
      date: "2023-03-25T09:20:00",
      type: "policy",
      description: "Travel insurance policy renewed",
      details: "Policy #TI-2023-78901",
      status: "success",
    },
    {
      id: "ACT-005",
      date: "2023-03-20T11:30:00",
      type: "payment",
      description: "Premium payment for Travel Insurance",
      details: "Transaction ID: TXN-2023-002",
      status: "success",
    },
    {
      id: "ACT-006",
      date: "2023-03-15T13:10:00",
      type: "profile",
      description: "Updated contact information",
      status: "success",
    },
    {
      id: "ACT-007",
      date: "2023-02-28T15:45:00",
      type: "login",
      description: "Unusual login attempt from New Delhi, India",
      status: "warning",
    },
    {
      id: "ACT-008",
      date: "2023-02-15T10:30:00",
      type: "claim",
      description: "Claim submitted for water damage",
      details: "Claim #CL-2023-001",
      status: "success",
    },
    {
      id: "ACT-009",
      date: "2023-02-10T09:15:00",
      type: "claim",
      description: "Claim approved for water damage",
      details: "Claim #CL-2023-001",
      status: "success",
    },
    {
      id: "ACT-010",
      date: "2023-01-05T14:20:00",
      type: "policy",
      description: "Added additional coverage to Home Insurance",
      details: "Policy #HI-2023-45678",
      status: "success",
    },
  ]

  const filteredActivities = activityItems.filter((activity) => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (dateFilter === "all") return matchesSearch
    if (dateFilter === "recent") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && new Date(activity.date) >= thirtyDaysAgo
    }
    if (dateFilter === "older") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && new Date(activity.date) < thirtyDaysAgo
    }
    return matchesSearch
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <User className="h-5 w-5 text-blue-600" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-emerald-600" />
      case "document":
        return <Upload className="h-5 w-5 text-purple-600" />
      case "policy":
        return <FileText className="h-5 w-5 text-orange-600" />
      case "claim":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "profile":
        return <User className="h-5 w-5 text-gray-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusIcon = (status?: string) => {
    if (!status) return null
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">Activity Log</h1>
            <p className="text-gray-500 mt-2">Track all activities related to your insurance account</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>View all activities related to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="older">Older</option>
                </select>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="login">Logins</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
                <TabsTrigger value="policy">Policies</TabsTrigger>
                <TabsTrigger value="claim">Claims</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ActivityList
                  activities={filteredActivities}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>

              <TabsContent value="login" className="mt-4">
                <ActivityList
                  activities={filteredActivities.filter((a) => a.type === "login")}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <ActivityList
                  activities={filteredActivities.filter((a) => a.type === "payment")}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>

              <TabsContent value="document" className="mt-4">
                <ActivityList
                  activities={filteredActivities.filter((a) => a.type === "document")}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>

              <TabsContent value="policy" className="mt-4">
                <ActivityList
                  activities={filteredActivities.filter((a) => a.type === "policy")}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>

              <TabsContent value="claim" className="mt-4">
                <ActivityList
                  activities={filteredActivities.filter((a) => a.type === "claim")}
                  getActivityIcon={getActivityIcon}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ActivityListProps {
  activities: ActivityItem[]
  getActivityIcon: (type: string) => React.ReactNode
  getStatusIcon: (status?: string) => React.ReactNode
  formatDate: (dateString: string) => string
  formatTime: (dateString: string) => string
}

function ActivityList({ activities, getActivityIcon, getStatusIcon, formatDate, formatTime }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Image
          src="/placeholder.svg?height=100&width=100"
          alt="No activities"
          width={100}
          height={100}
          className="mx-auto mb-4 opacity-50"
        />
        <h3 className="text-lg font-medium">No activities found</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-2 rounded-full">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{activity.description}</h3>
                {getStatusIcon(activity.status)}
              </div>
              {activity.details && <p className="text-sm text-gray-500 mt-1">{activity.details}</p>}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>{formatDate(activity.date)}</span>
                <span>•</span>
                <span>{formatTime(activity.date)}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
