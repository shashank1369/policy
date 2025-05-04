"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Plane,
  FileText,
  CreditCard,
  Activity,
  Upload,
  MessageSquare,
  Award,
  Calculator,
  ArrowRight,
} from "lucide-react"
import type {
  Policy,
  Recommendation,
  Activity as ActivityType,
  Claim,
  Customer,
  InsuranceProduct,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const { user, isLoading, fetchUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && !user.email) {
      fetchUser() // Fetch user data if not already loaded
    }
  }, [user, isLoading, router, fetchUser])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const isCompany = user.userType === "company"
  const userName = isCompany ? user.companyName || user.email : user.fullName || user.email

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
          <p className="text-muted-foreground">
            {isCompany
              ? "Manage your insurance offerings and customer policies"
              : "Manage your insurance policies and claims"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/profile">View Profile</Link>
          </Button>
          <Button asChild>
            <Link href={isCompany ? "/company-dashboard" : "/recommendations"}>
              {isCompany ? "Company Dashboard" : "Get Recommendations"}
            </Link>
          </Button>
        </div>
      </div>

      {isCompany ? <CompanyDashboard user={user} /> : <CustomerDashboard user={user} />}
    </div>
  )
}

function CustomerDashboard({ user }: { user: any }) {
  const userData = user.userData || {}
  const stats = userData.userStats || { activePolicies: 0, prominenceScore: 0, recentClaims: 0, nextPayment: { amount: 0, dueInDays: 0 } }
  const policies = userData.policies || []
  const recommendations = userData.recommendations || []
  const activities = userData.activities || []
  const claims = userData.claims || []

  const getIconForPolicyType = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-6 w-6 text-emerald-600" />
      case "travel":
        return <Plane className="h-6 w-6 text-blue-600" />
      default:
        return <FileText className="h-6 w-6 text-emerald-600" />
    }
  }

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-600" />
      case "document":
        return <Upload className="h-4 w-4 text-blue-600" />
      case "claim":
        return <Activity className="h-4 w-4 text-rose-600" />
      case "support":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "calculation":
        return <Calculator className="h-4 w-4 text-amber-600" />
      case "policy":
        return <FileText className="h-4 w-4 text-emerald-600" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              {policies.length > 0
                ? policies.map((p: Policy) => p.type.charAt(0).toUpperCase() + p.type.slice(1)).join(", ")
                : "No active policies"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prominence Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prominenceScore}</div>
            <p className="text-xs text-muted-foreground">
              {stats.prominenceScore > 800
                ? "Premium Tier"
                : stats.prominenceScore > 700
                  ? "Valuable Tier"
                  : "Standard Tier"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Claims</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentClaims}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentClaims > 0
                ? `${claims.filter((c: Claim) => c.status === "processing").length} In Processing`
                : "No Active Claims"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.nextPayment.amount)}</div>
            <p className="text-xs text-muted-foreground">Due in {stats.nextPayment.dueInDays} days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {policies.length > 0 ? (
              policies.map((policy: Policy) => (
                <Card key={policy.id} className="overflow-hidden">
                  <div className={`h-32 bg-gradient-to-r ${policy.iconColor} relative`}>
                    <div className="absolute bottom-4 left-4 bg-white rounded-full p-2">
                      {getIconForPolicyType(policy.type)}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription>Policy #{policy.policyNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coverage</span>
                      <span className="text-sm font-medium">{formatCurrency(policy.coverage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Premium</span>
                      <span className="text-sm font-medium">{formatCurrency(policy.premium)}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-medium text-emerald-600">
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full mt-2" asChild>
                      <Link href={`/insurance/${policy.type}/${policy.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2 flex flex-col items-center justify-center p-6 h-64">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Active Policies</h3>
                <p className="text-center text-muted-foreground mb-4">
                  You don't have any active insurance policies yet.
                </p>
                <Button asChild>
                  <Link href="/recommendations">
                    Explore Options
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            )}

            {policies.length > 0 && (
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-auto">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Add New Policy</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Explore our insurance options and add a new policy to your portfolio.
                </p>
                <Button asChild>
                  <Link href="/recommendations">
                    Explore Options
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.length > 0 ? (
              recommendations.map((recommendation: Recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden">
                  <div className="h-32 relative">
                    <Image
                      src={recommendation.imageUrl || "/placeholder.svg"}
                      alt={recommendation.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-bold">{recommendation.name}</div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Coverage</span>
                        <span className="text-sm font-medium">{formatCurrency(recommendation.coverage)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Premium</span>
                        <span className="text-sm font-medium">{formatCurrency(recommendation.premium)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Match</span>
                        <span className="text-sm font-medium text-emerald-600">{recommendation.matchPercentage}%</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/insurance/${recommendation.type}/new`}>View Plan</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2 flex flex-col items-center justify-center p-6 h-64">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Recommendations</h3>
                <p className="text-center text-muted-foreground mb-4">
                  You already have all available insurance types. Check back later for new offerings.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent insurance-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity: ActivityType) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="rounded-full bg-muted p-2">{getIconForActivityType(activity.type)}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No recent activities to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

function CompanyDashboard({ user }: { user: any }) {
  const userData = user.userData || {}
  const stats = userData.companyStats || { activePolicies: 0, totalRevenue: 0, activeClaims: 0, customerRating: 0, growthRates: { policies: 0, revenue: 0, claims: 0, rating: 0 } }
  const products = userData.insuranceProducts || []
  const customers = userData.customers || []
  const claims = userData.claims || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount / 100000) + "L"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-amber-500"
      case "processing":
        return "border-blue-500"
      case "approved":
        return "border-emerald-500"
      case "rejected":
        return "border-red-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolicies}</div>
            <p className="text-xs text-muted-foreground">+{stats.growthRates.policies}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+{stats.growthRates.revenue}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClaims}</div>
            <p className="text-xs text-muted-foreground">
              {stats.growthRates.claims > 0 ? `+${stats.growthRates.claims}` : stats.growthRates.claims}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              {stats.growthRates.rating > 0
                ? `+${stats.growthRates.rating.toFixed(1)}`
                : stats.growthRates.rating.toFixed(1)}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Insurance Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product: InsuranceProduct) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Policies</span>
                      <span className="text-sm font-medium">{product.activePolicies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="text-sm font-medium">{formatCurrency(product.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Claims Ratio</span>
                      <span className="text-sm font-medium">{product.claimsRatio}%</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2" asChild>
                      <Link href={`/company/products/${product.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2 flex flex-col items-center justify-center p-6 h-64">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Products</h3>
                <p className="text-center text-muted-foreground mb-4">
                  You don't have any insurance products yet.
                </p>
                <Button asChild>
                  <Link href="/company/products/new">
                    Create Product
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            )}
            
            {products.length > 0 && (
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Add New Product</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Create a new insurance product for your customers.
                </p>
                <Button asChild>
                  <Link href="/company/products/new">
                    Create Product
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Manage your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {customers.filter((c: Customer) => c.tier === "premium").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Premium Tier</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {customers.filter((c: Customer) => c.tier === "valuable").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Valuable Tier</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {customers.filter((c: Customer) => c.tier === "standard").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Standard Tier</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Customers</h3>
                  <div className="space-y-2">
                    {customers.length > 0 ? (
                      customers.slice(0, 3).map((customer: Customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-green-700">{customer.initials}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)} Tier •{" "}
                                {customer.policyCount} Policies
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/company/customers/${customer.id}`}>View</Link>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6">
                        <p className="text-muted-foreground">No customers to display</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/company/customers">View All Customers</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Claims</CardTitle>
              <CardDescription>Manage and process customer claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {claims.length > 0 ? (
                    claims.map((claim: Claim) => (
                      <div
                        key={claim.id}
                        className={`flex items-center justify-between p-3 bg-muted/50 rounded-md border-l-4 ${getStatusColor(claim.status)}`}
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {claim.policyType.charAt(0).toUpperCase() + claim.policyType.slice(1)} Insurance Claim #
                            {claim.claimNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Filed by {claim.customerName || "Customer"} • {claim.filedDate}
                          </p>
                          <p className="text-xs">
                            {claim.description} for{" "}
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(claim.amount)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/company/claims/${claim.id}`}>Review</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/company/claims/${claim.id}/process`}>Process</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground">No active claims to display</p>
                    </div>
                  )}
                </div>

                <Button className="w-full" asChild>
                  <Link href="/company/claims">View All Claims</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}