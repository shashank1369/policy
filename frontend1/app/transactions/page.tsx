"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Download, FileText, Home, Plane, Search } from "lucide-react"
import Image from "next/image"

type Transaction = {
  id: string
  date: string
  type: "payment" | "refund" | "claim"
  amount: number
  status: "completed" | "pending" | "failed"
  description: string
  policy: {
    type: "home" | "travel"
    number: string
  }
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const transactions: Transaction[] = [
    {
      id: "TXN-2023-001",
      date: "2023-04-15",
      type: "payment",
      amount: 18500,
      status: "completed",
      description: "Annual premium payment for home insurance",
      policy: {
        type: "home",
        number: "HI-2023-45678",
      },
    },
    {
      id: "TXN-2023-002",
      date: "2023-03-20",
      type: "payment",
      amount: 12500,
      status: "completed",
      description: "Annual premium payment for travel insurance",
      policy: {
        type: "travel",
        number: "TI-2023-78901",
      },
    },
    {
      id: "TXN-2023-003",
      date: "2023-02-10",
      type: "claim",
      amount: 35000,
      status: "completed",
      description: "Claim settlement for water damage",
      policy: {
        type: "home",
        number: "HI-2023-45678",
      },
    },
    {
      id: "TXN-2023-004",
      date: "2023-01-05",
      type: "refund",
      amount: 2500,
      status: "completed",
      description: "Refund for policy adjustment",
      policy: {
        type: "travel",
        number: "TI-2023-78901",
      },
    },
    {
      id: "TXN-2023-005",
      date: "2023-04-30",
      type: "payment",
      amount: 5000,
      status: "pending",
      description: "Additional coverage payment",
      policy: {
        type: "home",
        number: "HI-2023-45678",
      },
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.policy.number.toLowerCase().includes(searchQuery.toLowerCase())

    if (dateFilter === "all") return matchesSearch
    if (dateFilter === "recent") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && new Date(transaction.date) >= thirtyDaysAgo
    }
    if (dateFilter === "older") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return matchesSearch && new Date(transaction.date) < thirtyDaysAgo
    }
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string, policyType: string) => {
    if (type === "payment") {
      return policyType === "home" ? (
        <Home className="h-5 w-5 text-emerald-600" />
      ) : (
        <Plane className="h-5 w-5 text-emerald-600" />
      )
    }
    if (type === "refund") {
      return <CheckCircle2 className="h-5 w-5 text-blue-600" />
    }
    return <FileText className="h-5 w-5 text-orange-600" />
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">Transactions</h1>
            <p className="text-gray-500 mt-2">View and manage your payment history and transactions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Payments</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹36,000</div>
              <p className="text-sm text-gray-500">3 transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Claims Received</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹35,000</div>
              <p className="text-sm text-gray-500">1 transaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Refunds</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹2,500</div>
              <p className="text-sm text-gray-500">1 transaction</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your insurance-related transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="date-filter" className="sr-only">
                  Filter by date
                </Label>
                <select
                  id="date-filter"
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            {getTypeIcon(transaction.type, transaction.policy.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{transaction.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                          <div className="md:text-right">
                            <p className="font-medium">
                              {transaction.type === "payment" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.policy.number}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                transaction.status,
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="No transactions"
                        width={100}
                        height={100}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <h3 className="text-lg font-medium">No transactions found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="payments" className="mt-4">
                <div className="space-y-4">
                  {filteredTransactions
                    .filter((t) => t.type === "payment")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            {getTypeIcon(transaction.type, transaction.policy.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{transaction.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                          <div className="md:text-right">
                            <p className="font-medium">-₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{transaction.policy.number}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                transaction.status,
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="claims" className="mt-4">
                <div className="space-y-4">
                  {filteredTransactions
                    .filter((t) => t.type === "claim")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            {getTypeIcon(transaction.type, transaction.policy.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{transaction.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                          <div className="md:text-right">
                            <p className="font-medium">+₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{transaction.policy.number}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                transaction.status,
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="refunds" className="mt-4">
                <div className="space-y-4">
                  {filteredTransactions
                    .filter((t) => t.type === "refund")
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            {getTypeIcon(transaction.type, transaction.policy.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{transaction.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                          <div className="md:text-right">
                            <p className="font-medium">+₹{transaction.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{transaction.policy.number}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                transaction.status,
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
