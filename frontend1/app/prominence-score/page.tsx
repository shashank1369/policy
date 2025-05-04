"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, ArrowRight, Check, Info, AlertCircle } from "lucide-react";
import axios, { AxiosError } from "axios";

export default function ProminenceScorePage() {
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
    creditScore: "",
    insuranceHistory: "",
    claimHistory: "",
  });
  const [prominenceScore, setProminenceScore] = useState<number | null>(null);
  const [customerCategory, setCustomerCategory] = useState<string | null>(null);
  const [recommendedPolicy, setRecommendedPolicy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token.split('.').length !== 3) {
      setError("Invalid token format. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000, // 30-second timeout
      });
      const userData = response.data;
      setFormData((prev) => ({
        ...prev,
        fullName: userData.full_name || "",
        age: userData.age?.toString() || "",
        gender: userData.gender || "",
        email: userData.email || "",
        phone: userData.phone || "",
        occupation: userData.occupation || "",
        annualIncome: userData.annualIncome?.toString() || "",
        education: userData.education || "",
        maritalStatus: userData.maritalStatus || "",
        dependents: userData.dependents?.toString() || "",
        riskTolerance: userData.riskTolerance || 50,
        creditScore: userData.creditScore?.toString() || "",
        insuranceHistory: userData.insuranceHistory || "",
        claimHistory: userData.claimHistory || "",
      }));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.error || "Failed to fetch user data. Please log in again.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value) => {
    setFormData((prev) => ({ ...prev, riskTolerance: value[0] }));
  };

  const calculateProminenceScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProminenceScore(null);
    setCustomerCategory(null);
    setRecommendedPolicy(null);

    const token = localStorage.getItem("token");
    if (!token || token.split('.').length !== 3) {
      setError("Invalid token. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/submit-form",
        {
          age: formData.age || "30",
          annualIncome: formData.annualIncome || "0",
          dependents: formData.dependents || "0",
          riskTolerance: formData.riskTolerance,
          creditScore: formData.creditScore || "300",
          insuranceHistory: formData.insuranceHistory || "poor",
          claimHistory: formData.claimHistory || "none",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30-second timeout
        }
      );
      setProminenceScore(response.data.prominenceScore);
      setCustomerCategory(response.data.customerCategory);
      setRecommendedPolicy(response.data.recommendedPolicy || "No specific policy recommended yet");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.error || "Failed to calculate prominence score. Ensure backend is running at http://127.0.0.1:5000");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecommendations = () => {
    router.push("/recommendations");
  };

  const resetCalculator = () => {
    setProminenceScore(null);
    setCustomerCategory(null);
    setRecommendedPolicy(null);
    setError(null);
    setFormData({
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
      creditScore: "",
      insuranceHistory: "",
      claimHistory: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Insurance Prominence Score
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Discover your insurance prominence score and unlock personalized recommendations tailored to your profile
          </p>
        </div>

        <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Score Calculator</TabsTrigger>
            <TabsTrigger value="about">About Prominence Score</TabsTrigger>
            <TabsTrigger value="benefits">Benefits & Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Calculate Your Prominence Score</CardTitle>
                        <CardDescription>
                          Fill in your details to discover your insurance prominence score
                        </CardDescription>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-full shadow-sm">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {prominenceScore === null ? (
                      <form onSubmit={calculateProminenceScore} className="space-y-6">
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
                              min="0"
                              placeholder="e.g., 35"
                              value={formData.age}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("gender", value)}
                              value={formData.gender}
                              required
                            >
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
                              min="0"
                              placeholder="e.g., 1000000"
                              value={formData.annualIncome}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="education">Education Level</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("education", value)}
                              value={formData.education}
                              required
                            >
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
                            <Select
                              onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                              value={formData.maritalStatus}
                              required
                            >
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
                              min="0"
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
                              min="300"
                              max="900"
                              placeholder="e.g., 750"
                              value={formData.creditScore}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="insuranceHistory">Insurance History</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("insuranceHistory", value)}
                              value={formData.insuranceHistory}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select insurance history" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent (5+ years with no lapses)</SelectItem>
                                <SelectItem value="good">Good (2-5 years with no lapses)</SelectItem>
                                <SelectItem value="average">Average (Some coverage with minor lapses)</SelectItem>
                                <SelectItem value="poor">Poor (Significant lapses or new to insurance)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="claimHistory">Claim History</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("claimHistory", value)}
                              value={formData.claimHistory}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select claim history" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No claims in past 5 years</SelectItem>
                                <SelectItem value="few">1-2 claims in past 5 years</SelectItem>
                                <SelectItem value="several">3+ claims in past 5 years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label>Risk Tolerance</Label>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Low Risk</span>
                              <span>High Risk</span>
                            </div>
                            <Slider
                              defaultValue={[50]}
                              max={100}
                              step={1}
                              value={[formData.riskTolerance]}
                              onValueChange={handleSliderChange}
                              className="z-0"
                            />
                            <div className="text-center text-sm text-gray-500">
                              {formData.riskTolerance}%
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetCalculator}
                            disabled={loading}
                          >
                            Reset
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Calculating...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                Calculate Prominence Score
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </div>
                            )}
                          </Button>
                        </div>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-bold">Your Prominence Score</h3>
                          <div className="w-full max-w-md mx-auto">
                            <Progress
                              value={prominenceScore}
                              className="h-4 bg-gray-200"
                              indicatorClassName={
                                prominenceScore >= 70
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                                  : prominenceScore >= 40
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  : "bg-gradient-to-r from-gray-400 to-gray-600"
                              }
                            />
                          </div>
                          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {prominenceScore}
                          </div>
                          <div className="text-xl font-medium">
                            Customer Category:{" "}
                            <span
                              className={
                                customerCategory === "Premium"
                                  ? "text-purple-600"
                                  : customerCategory === "Valuable"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }
                            >
                              {customerCategory}
                            </span>
                          </div>
                          {recommendedPolicy && (
                            <div className="text-xl font-medium">
                              Recommended Policy:{" "}
                              <span className="text-green-600 font-semibold">{recommendedPolicy}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
                          <h4 className="font-bold mb-2">What does this mean?</h4>
                          <p className="text-gray-600 mb-4">
                            Your prominence score helps us tailor insurance recommendations specifically for you. Based on your
                            profile, we've categorized you as a{" "}
                            <span className="font-medium">{customerCategory}</span> customer.
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
                          {customerCategory === "Premium" && (
                            <p className="text-gray-600">
                              As a Premium customer, you'll receive our most comprehensive coverage recommendations with
                              exclusive benefits, priority service, and personalized attention.
                            </p>
                          )}
                          {recommendedPolicy && (
                            <p className="text-gray-600 mt-4">
                              Based on your profile and prominence score, we recommend a <strong>{recommendedPolicy}</strong>{" "}
                              insurance policy. This recommendation considers your risk profile and historical data.
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between pt-4 gap-2">
                          <Button type="button" variant="outline" onClick={resetCalculator}>
                            Recalculate
                          </Button>
                          <Button
                            type="button"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            onClick={handleViewRecommendations}
                          >
                            View Recommendations
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <Card className="border-purple-200 overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src="/placeholder.svg?height=160&width=400"
                        alt="Prominence Score"
                        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <Award className="h-10 w-10 mx-auto mb-2" />
                          <h3 className="text-xl font-bold">Why Your Score Matters</h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-sm">Personalized insurance recommendations</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-sm">Potential premium discounts based on your profile</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-sm">Access to exclusive insurance benefits and features</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-sm">Priority customer support based on your tier</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Score Factors</CardTitle>
                      <CardDescription>Key elements that influence your score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Age & Demographics</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">30%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Financial Stability</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">30%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Insurance History</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">20%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Risk Profile</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">20%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <CardTitle>About the Prominence Score</CardTitle>
                    <CardDescription>Understanding how our AI-powered scoring system works</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="relative h-60 rounded-lg overflow-hidden">
                      <img
                        src="/placeholder.svg?height=240&width=800"
                        alt="Prominence Score Explanation"
                        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-700">What is the Prominence Score?</h3>
                      <p className="text-gray-600">
                        The Insurance Prominence Score is our proprietary AI-powered rating system that evaluates your insurance
                        profile based on multiple factors. This score helps us understand your insurance needs, risk profile, and
                        potential value as a customer, allowing us to provide personalized recommendations and benefits.
                      </p>
                      <h3 className="text-xl font-bold text-purple-700">How is it Calculated?</h3>
                      <p className="text-gray-600">
                        Our advanced algorithm analyzes various aspects of your profile, including:
                      </p>
                      <ul className="space-y-2 pl-5 list-disc text-gray-600">
                        <li>Demographic information (age, occupation, education)</li>
                        <li>Financial stability (income, credit score)</li>
                        <li>Insurance history and claim patterns</li>
                        <li>Risk tolerance and lifestyle factors</li>
                        <li>Family composition and responsibilities</li>
                      </ul>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3">
                        <Info className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-700">
                          Your Prominence Score is regularly updated as your profile changes. Life events like marriage, having
                          children, changing jobs, or improving your credit score can all impact your score positively.
                        </p>
                      </div>
                      <h3 className="text-xl font-bold text-purple-700">Data Privacy & Security</h3>
                      <p className="text-gray-600">
                        We take your privacy seriously. All information used to calculate your Prominence Score is securely stored
                        and processed in compliance with data protection regulations. Your score and personal information are
                        never shared with third parties without your explicit consent.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-700">How often is my score updated?</h4>
                        <p className="text-sm text-gray-600">
                          Your Prominence Score is recalculated whenever you update your profile information or when significant
                          changes occur in your insurance history.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-700">Can I improve my score?</h4>
                        <p className="text-sm text-gray-600">
                          Yes! Maintaining a good insurance history, improving your credit score, and updating your profile
                          information can all help improve your Prominence Score over time.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-700">Is my score shared with insurers?</h4>
                        <p className="text-sm text-gray-600">
                          No, your Prominence Score is used internally to provide you with personalized recommendations. It is
                          not shared with insurance companies or other third parties.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-700">How accurate is the score?</h4>
                        <p className="text-sm text-gray-600">
                          Our AI-powered algorithm has been trained on millions of insurance profiles and continuously improves
                          its accuracy. However, the score is meant as a guide and not an absolute measure.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <Award className="h-12 w-12 mx-auto" />
                        <h3 className="text-xl font-bold">Ready to discover your score?</h3>
                        <p className="text-sm text-purple-100">
                          Calculate your Prominence Score now and unlock personalized insurance recommendations.
                        </p>
                        <Button
                          className="bg-white text-purple-700 hover:bg-gray-100 w-full mt-2"
                          onClick={() => setActiveTab("calculator")}
                        >
                          Calculate My Score
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3">
                <Card className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <CardTitle>Customer Tiers & Benefits</CardTitle>
                    <CardDescription>Discover the advantages of each prominence tier</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-gray-700">Standard</CardTitle>
                            <div className="bg-gray-100 p-2 rounded-full">
                              <Award className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <CardDescription>Score: 0-39</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div className="relative h-40 rounded-lg overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt="Standard Tier"
                                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                                <span className="text-sm">Basic insurance coverage options</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                                <span className="text-sm">Standard customer support</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                                <span className="text-sm">Access to online self-service tools</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                                <span className="text-sm">Basic policy management features</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-blue-700">Valuable</CardTitle>
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Award className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <CardDescription>Score: 40-69</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div className="relative h-40 rounded-lg overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt="Valuable Tier"
                                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span className="text-sm">Enhanced coverage options with additional benefits</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span className="text-sm">Priority customer support</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span className="text-sm">Discounted premium rates</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span className="text-sm">Expedited claims processing</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span className="text-sm">Advanced policy management tools</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-purple-700">Premium</CardTitle>
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Award className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <CardDescription>Score: 70-100</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div className="relative h-40 rounded-lg overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt="Premium Tier"
                                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">Comprehensive coverage with exclusive benefits</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">24/7 dedicated customer support</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">Maximum premium discounts</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">Priority claims processing with dedicated agent</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">Personalized insurance consultation</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-purple-600 mt-0.5" />
                                <span className="text-sm">Exclusive member events and resources</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle>How to Improve Your Score</CardTitle>
                    <CardDescription>Follow these tips to boost your prominence score</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-600 rounded-full p-1.5 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-700">Maintain Continuous Coverage</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Avoid lapses in your insurance coverage. Continuous coverage demonstrates responsibility and
                              improves your insurance history.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-600 rounded-full p-1.5 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-700">Improve Your Credit Score</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Pay bills on time, reduce debt, and maintain a good credit history. Your credit score
                              significantly impacts your prominence score.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-600 rounded-full p-1.5 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-700">Bundle Multiple Policies</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Combining multiple insurance policies (home, travel, etc.) can boost your prominence score and
                              often leads to premium discounts.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-600 rounded-full p-1.5 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-700">Minimize Claims</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              While insurance is there when you need it, filing fewer claims can positively impact your score.
                              Consider handling minor expenses out-of-pocket.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-purple-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-700">Important Note</h4>
                          <p className="text-sm text-purple-800 mt-1">
                            Improving your prominence score takes time. Consistent responsible behavior and regular updates to
                            your profile information will gradually increase your score. We recommend recalculating your score
                            every 6 months to track your progress.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                      <Award className="h-16 w-16 mx-auto" />
                      <h3 className="text-2xl font-bold">Unlock Your Full Potential</h3>
                      <p className="text-purple-100">
                        Calculate your Prominence Score now and discover personalized insurance recommendations tailored to your
                        unique profile.
                      </p>
                      <div className="pt-4">
                        <Button
                          className="bg-white text-purple-700 hover:bg-gray-100"
                          onClick={() => setActiveTab("calculator")}
                        >
                          Calculate My Score
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}