"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import axios, { AxiosError } from "axios";

export default function CommonFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    occupation: "",
    annualIncome: "",
    education: "",
    maritalStatus: "",
    dependents: "",
    riskTolerance: 50,
    creditScore: "300", // Default value
    insuranceHistory: "poor", // Default value
    claimHistory: "none", // Default value
  });
  const [prominenceScore, setProminenceScore] = useState<number | null>(null);
  const [customerCategory, setCustomerCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token && token.split('.').length !== 3) {
      setError("Invalid token format. Please log in again.");
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, riskTolerance: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.split('.').length !== 3) {
      setError("No valid token. Please log in again.");
      localStorage.removeItem("token");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting form data:", formData); // Debug log
      const response = await axios.post("http://127.0.0.1:5000/api/auth/submit-form", {
        age: formData.age,
        annualIncome: formData.annualIncome,
        dependents: formData.dependents,
        riskTolerance: formData.riskTolerance,
        creditScore: formData.creditScore,
        insuranceHistory: formData.insuranceHistory,
        claimHistory: formData.claimHistory,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Form submission response:", response.data); // Debug log
      setProminenceScore(response.data.prominenceScore);
      setCustomerCategory(response.data.customerCategory);
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = err.response?.data?.error || err.message || "Failed to submit form. Please try again.";
      console.error("Form submission failed:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setError("Invalid token. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/recommendations");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Customer Profile
          </h1>
          <p className="text-gray-500 mt-2">
            Please provide your personal information to calculate your prominence score and get personalized
            recommendations
          </p>
        </div>

        <Card className="border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>This information helps us understand your insurance needs better</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {prominenceScore === null ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="e.g., 35"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleSelectChange("gender", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="e.g., Software Engineer"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                    <Input
                      id="annualIncome"
                      name="annualIncome"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select onValueChange={(value) => handleSelectChange("education", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("maritalStatus", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input
                      id="dependents"
                      name="dependents"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.dependents}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      name="creditScore"
                      type="number"
                      placeholder="e.g., 700"
                      value={formData.creditScore}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceHistory">Insurance History</Label>
                    <Select onValueChange={(value) => handleSelectChange("insuranceHistory", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance history" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claimHistory">Claim History</Label>
                    <Select onValueChange={(value) => handleSelectChange("claimHistory", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim history" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="few">Few</SelectItem>
                        <SelectItem value="several">Several</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Risk Tolerance</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Low Risk</span>
                      <span>High Risk</span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      value={[formData.riskTolerance]}
                      onValueChange={handleSliderChange}
                    />
                    <div className="text-center text-sm text-muted-foreground">{formData.riskTolerance}%</div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Calculating...
                      </div>
                    ) : (
                      "Calculate Prominence Score"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Your Prominence Score</h3>
                  <div className="w-full max-w-md mx-auto">
                    <Progress
                      value={prominenceScore}
                      className="h-4"
                      indicatorClassName={
                        prominenceScore >= 70
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : prominenceScore >= 40
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      }
                    />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {prominenceScore}
                  </div>
                  <div className="text-xl font-medium">
                    Customer Category:{" "}
                    <span
                      className={
                        customerCategory === "Elite"
                          ? "text-emerald-600"
                          : customerCategory === "Valuable"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }
                    >
                      {customerCategory}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                  <h4 className="font-bold mb-2">What does this mean?</h4>
                  <p className="text-gray-600 mb-4">
                    Your prominence score helps us tailor insurance recommendations specifically for you. Based on your
                    profile, we've categorized you as a <span className="font-medium">{customerCategory}</span>{" "}
                    customer.
                  </p>
                  {customerCategory === "Standard" && (
                    <p className="text-gray-600">
                      As a Standard customer, we'll focus on providing you with essential coverage options that meet
                      your basic insurance needs while keeping costs affordable.
                    </p>
                  )}
                  {customerCategory === "Valuable" && (
                    <p className="text-gray-600">
                      As a Valuable customer, we'll recommend enhanced coverage options with additional benefits that
                      provide better protection for your specific situation.
                    </p>
                  )}
                  {customerCategory === "Elite" && (
                    <p className="text-gray-600">
                      As an Elite customer, you'll receive our most comprehensive coverage recommendations with
                      exclusive benefits, priority service, and personalized attention.
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setProminenceScore(null);
                      setCustomerCategory(null);
                      setError(null);
                    }}
                  >
                    Recalculate
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    onClick={handleContinue}
                  >
                    View Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Your information is secure and will only be used for insurance purposes.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}