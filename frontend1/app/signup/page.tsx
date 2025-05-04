"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import axios, { AxiosError } from "axios";

// Define the interface for signup-related API responses
interface VerificationResponse {
  message?: string;
  error?: string;
  email?: string;
}

interface SignupResponse {
  token?: string;
  user?: {
    email: string;
    user_type: string;
    full_name?: string;
    company_name?: string;
    company_reg_number?: string;
  };
  error?: string;
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [userType, setUserType] = useState<"customer" | "company">("customer");
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<VerificationResponse>(
        "http://localhost:5000/api/auth/send-verification",
        { email, userType },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.message && response.data.message.toLowerCase().includes("verification code sent")) {
        setStep(2);
      } else if (response.data.error) {
        setError(response.data.error);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      const axiosError = err as AxiosError<VerificationResponse>;
      setError(axiosError.response?.data?.error || axiosError.message || "Network error. Ensure backend is running at http://localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!verificationCode) {
      setError("Verification code is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<VerificationResponse>(
        "http://localhost:5000/api/auth/verify",
        { email, code: verificationCode },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.message && response.data.message.toLowerCase().includes("email verified")) {
        setIsVerified(true);
        setStep(3);
      } else {
        setError(response.data.error || "Verification failed. Please check the code.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<VerificationResponse>;
      setError(axiosError.response?.data?.error || axiosError.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isVerified) {
      setError("Please verify your email before completing signup");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const userData = {
      email,
      password,
      userType,
      fullName: userType === "customer" ? name : undefined,
      companyName: userType === "company" ? companyName : undefined,
      companyRegNumber: userType === "company" ? companyRegNumber : undefined,
    };

    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        console.log(`Sending signup request (attempt ${attempt + 1}) with data:`, userData); // Debug log
        const response = await axios.post<SignupResponse>("http://localhost:5000/api/auth/register", userData, {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        });
        console.log("Signup response:", response.data); // Debug log
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setStep(4);
          break;
        } else if (response.data.error) {
          setError(response.data.error);
          break;
        } else {
          setError("Signup failed: No token received");
          break;
        }
      } catch (err) {
        const axiosError = err as AxiosError<SignupResponse>;
        const errorMsg = axiosError.response?.data?.error || axiosError.message || "Network error";
        console.error("Signup error details:", {
          message: axiosError.message,
          code: axiosError.code,
          response: axiosError.response?.data,
          status: axiosError.response?.status,
        });
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        } else {
          setError(`Network error: ${errorMsg}. Ensure the backend is running at http://localhost:5000. Check console for details. Server may be down or misconfigured. Try again or restart the backend.`);
          try {
            const status = await axios.get("http://localhost:5000/api/auth/status", { timeout: 2000 });
            if (status.data.message === "Server is running") {
              setError((prev) => `${prev} Server is running but registration failed.`);
            }
          } catch (statusErr) {
            console.error("Server status check failed:", statusErr);
            setError((prev) => `${prev} Server status check failed.`);
          }
        }
      } finally {
        attempt++;
      }
    }

    if (attempt === maxAttempts) {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = () => {
    router.push(userType === "company" ? "/company-dashboard" : "/dashboard");
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-xs">Email</span>
          <span className="text-xs">Verification</span>
          <span className="text-xs">Details</span>
          <span className="text-xs">Complete</span>
        </div>
        <Progress value={step * 25} className="h-2" />
      </div>
    );
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Tabs defaultValue="customer" className="w-full" onValueChange={(value) => setUserType(value as "customer" | "company")}>
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
              </Tabs>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">◌</span>
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                <Mail className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-600">Verification code sent!</AlertTitle>
                <AlertDescription>
                  We've sent a verification code to {email}. Please check your inbox and enter the code below.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Didn't receive the code?
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs ml-1 text-emerald-600"
                    onClick={handleSendCode}
                    disabled={isLoading}
                  >
                    Resend code
                  </Button>
                </p>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verify Code
              </Button>

              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
                Back
              </Button>
            </form>
          )}

          {step === 3 && (
            <Tabs defaultValue={userType} className="w-full" onValueChange={(value) => setUserType(value as "customer" | "company")}>
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
                  <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-600">Email Verified!</AlertTitle>
                    <AlertDescription>Your email {email} has been successfully verified.</AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-emerald-600 hover:underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Complete Sign Up
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setStep(2)}>
                    Back
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="company">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Alert className="mb-4 bg-emerald-50 border-emerald-200">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertTitle className="text-emerald-600">Email Verified!</AlertTitle>
                    <AlertDescription>Your email {email} has been successfully verified.</AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="Insurance Company Ltd."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-reg">Registration Number</Label>
                    <Input
                      id="company-reg"
                      placeholder="REG123456789"
                      value={companyRegNumber}
                      onChange={(e) => setCompanyRegNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Password</Label>
                    <Input
                      id="company-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-confirm-password">Confirm Password</Label>
                    <Input
                      id="company-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="company-terms" required />
                    <label
                      htmlFor="company-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-emerald-600 hover:underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Complete Sign Up
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setStep(2)}>
                    Back
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Registration Complete!</h3>
              <p>Your account has been successfully created. You can now access your personalized dashboard.</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleCompleteSignup}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}