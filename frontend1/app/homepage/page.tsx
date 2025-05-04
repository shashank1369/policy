"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MessageSquare, CreditCard, FileText } from "lucide-react"
import axios from "axios"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [chats, setChats] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        })
        setUser(response.data.user)
        setTransactions(response.data.transactions || [])
        setChats(response.data.chats || [])
        setPayments(response.data.payments || [])
        setClaims(response.data.claims || [])
      } catch (err) {
        console.error("Error fetching user data:", err)
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const displayName = user?.fullName || user?.companyName || user?.email || "User"
  const initial = displayName.charAt(0).toUpperCase()

  if (loading) return <div className="container flex items-center justify-center min-h-[80vh]">Loading...</div>

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div
          className="circular-logo w-12 h-12 flex items-center justify-center cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <span className="text-white text-xl">{initial}</span>
        </div>
      </div>
      <style jsx>{`
        .circular-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Transactions
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Chats
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payments
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Claims
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your insurance activities here.</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => router.push("/profile")}>Profile</Button>
                <Button variant="outline" onClick={() => router.push("/logout")}>Logout</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <ul>
                  {transactions.map((trans, index) => (
                    <li key={index}>{trans.description} - ${trans.amount} on {trans.date}</li>
                  ))}
                </ul>
              ) : (
                <p>No transactions available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              {chats.length > 0 ? (
                <ul>
                  {chats.map((chat, index) => (
                    <li key={index}>{chat.message} - {chat.timestamp}</li>
                  ))}
                </ul>
              ) : (
                <p>No chat history available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <ul>
                  {payments.map((payment, index) => (
                    <li key={index}>{payment.description} - ${payment.amount} on {payment.date}</li>
                  ))}
                </ul>
              ) : (
                <p>No payments available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claims</CardTitle>
            </CardHeader>
            <CardContent>
              {claims.length > 0 ? (
                <ul>
                  {claims.map((claim, index) => (
                    <li key={index}>{claim.description} - Status: {claim.status} on {claim.date}</li>
                  ))}
                </ul>
              ) : (
                <p>No claims available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}