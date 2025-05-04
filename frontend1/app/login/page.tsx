"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Do not validate token on mount unless explicitly needed
  }, [router]);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      const userTypeFromToken = response.data.user_type;
      const redirectPath = userTypeFromToken === "company" ? "/company-dashboard" : "/prominence";
      router.push(redirectPath);
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Token validation error:", axiosError);
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending login request with data:", { email, password, userType });
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, userType },
        { headers: { "Content-Type": "application/json" }, timeout: 30000 }
      );
      console.log("Login response data:", response.data);
      const { token, user } = response.data;
      if (token && user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
        setIsValidating(true);
        await validateToken(token);
        setIsValidating(false);
        const redirectPath = user.user_type === "company" ? "/company-dashboard" : "/prominence";
        router.push(redirectPath);
      } else {
        setError("Login failed: No token or user data received");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMsg =
        axiosError.code === "ECONNABORTED"
          ? "Server timed out. Please ensure the server at http://localhost:5000 is running."
          : axiosError.response?.data?.error || axiosError.message || "Invalid email, password, or user type.";
      console.error("Login error details:", {
        message: axiosError.message,
        response: axiosError.response?.data || "No response",
        status: axiosError.response?.status || "Unknown",
      });
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to your account</CardTitle>
          <CardDescription className="text-center">Enter your email and password to login</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="customer" className="w-full" onValueChange={setUserType}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Insurance Company
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="customer-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="customer-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="company">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="company-password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="company-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-emerald-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}