"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, User, Building2, Mail, Phone, MapPin, Shield, CreditCard } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const isCompany = user.userType === "company"
  const displayName = isCompany ? user.companyName : user.name

  const getInitials = () => {
    if (isCompany && user.companyName) {
      return user.companyName.substring(0, 2).toUpperCase()
    } else if (user.name) {
      return user.name.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the backend
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="text-center md:text-left">
            <Avatar className="h-24 w-24 mx-auto md:mx-0">
              <AvatarImage src={user.profileImage || ""} alt={displayName} />
              <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm mt-2">
              Account Type: <span className="font-medium">{isCompany ? "Insurance Provider" : "Customer"}</span>
            </p>
            {isCompany && user.companyRegNumber && (
              <p className="text-sm">
                Registration Number: <span className="font-medium">{user.companyRegNumber}</span>
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
              <Button>Edit Profile</Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                {saveSuccess && (
                  <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-600">
                      Your profile has been updated successfully.
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{isCompany ? "Company Name" : "Full Name"}</Label>
                      <div className="flex">
                        <div className="bg-muted p-2 rounded-l-md flex items-center">
                          {isCompany ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <Input id="name" defaultValue={displayName} className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <div className="bg-muted p-2 rounded-l-md flex items-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input id="email" type="email" defaultValue={user.email} className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <div className="bg-muted p-2 rounded-l-md flex items-center">
                          <Phone className="h-4 w-4" />
                        </div>
                        <Input id="phone" defaultValue="+91 98765 43210" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex">
                        <div className="bg-muted p-2 rounded-l-md flex items-center">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <Input id="address" defaultValue="123 Main Street, Mumbai, India" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="flex">
                    <div className="bg-muted p-2 rounded-l-md flex items-center">
                      <Shield className="h-4 w-4" />
                    </div>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="space-y-2 w-full">
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">HDFC Bank Credit Card</p>
                      <p className="text-sm text-muted-foreground">Ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 04/25</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
                <Button className="w-full md:w-auto">Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
