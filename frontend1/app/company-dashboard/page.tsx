"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Download, FileText, MessageCircle, Search, Shield, Star, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// Define the interface for company dashboard data
interface CompanyDashboardData {
  customerCount: number;
  activePolicies: number;
  customerTiers: {
    premium?: number;
    valuable?: number;
    standard?: number;
  };
  error?: string; // Optional error property
}

export default function CompanyDashboardPage() {
  const [dashboardData, setDashboardData] = useState<CompanyDashboardData | null>(null);
  const [token] = useState<string | null>(typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setError("No token found. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [token, router]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data.companyDashboard || {});
      setError(null);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error.response?.data || error.message);
      setError("Failed to fetch dashboard data. Please log in again.");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setTimeout(() => router.push("/login"), 2000);
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Insurance Company Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" /> Export Reports
          </Button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.customerCount || 0}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.activePolicies || 0}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.customerTiers?.premium || 0}</div>
            <p className="text-xs text-muted-foreground">27% of total customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Processed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search customers..." className="pl-8" />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">John Doe</h3>
                        <p className="text-sm text-gray-500">Premium Customer • 2 Active Policies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/chatbot">
          <Button size="icon" className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg">
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open Chatbot</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}