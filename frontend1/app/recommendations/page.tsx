"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Home, Plane, Shield, Star } from "lucide-react";
import axios from "axios";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prominenceScore, setProminenceScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      setError("No token found. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      fetchProminenceScore();
    }
  }, [router]);

  useEffect(() => {
    if (prominenceScore !== null && token) {
      fetchRecommendations();
    }
  }, [prominenceScore, token]);

  const fetchProminenceScore = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      setProminenceScore(res.data.prominenceScore || 53); // Updated to 53 from latest image
    } catch (error) {
      console.error("Prominence score fetch error:", error.response?.data || error.message);
      setError("Failed to fetch prominence score. Using default 53.");
      setProminenceScore(53); // Default to 53 from image
    }
  };

  const fetchRecommendations = async () => {
    if (!token) return;
    try {
      console.log("Fetching recommendations with token:", token); // Debug log
      const res = await axios.get("http://localhost:5000/api/recommend/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      console.log("API Response:", res.data); // Debug log
      let sortedRecs = res.data.recommendations || [];
      if (prominenceScore) {
        sortedRecs = sortAndFilterRecommendations(sortedRecs, prominenceScore);
      } else {
        sortedRecs.sort((a, b) => b.coverage - a.coverage);
      }
      setRecommendations(sortedRecs);
      if (sortedRecs.length === 0 && res.data.message) {
        setError(res.data.message);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Recommendations fetch error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to fetch recommendations. Please log in again.");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setTimeout(() => router.push("/login"), 2000);
      }
    }
  };

  const sortAndFilterRecommendations = (policies, score) => {
    return policies.map(policy => {
      let matchPercentage = 0;
      let coverageFactor = 1.0;
      let premiumFactor = 1.0;

      if (score >= 70) {
        if (policy.type === "elite") matchPercentage = 100 - Math.abs(score - 72.5);
        coverageFactor = 1.3;
        premiumFactor = 1.1;
      } else if (score >= 40) {
        if (policy.type === "premium") matchPercentage = 100 - Math.abs(score - 54.5);
        coverageFactor = 1.2;
        premiumFactor = 1.05;
      } else {
        if (policy.type === "basic") matchPercentage = 100 - Math.abs(score - 36.5);
        coverageFactor = 1.0;
        premiumFactor = 1.0;
      }

      matchPercentage = Math.max(0, Math.min(100, matchPercentage || 50));
      const adjustedCoverage = policy.coverage * coverageFactor;
      const adjustedPremium = policy.premium * premiumFactor;
      const adjustedCoverageLimits = policy.coverageLimits
        ? Object.fromEntries(
            Object.entries(policy.coverageLimits).map(([key, value]) => [key, value * coverageFactor])
          )
        : {};

      return {
        ...policy,
        matchPercentage: Math.round(matchPercentage),
        coverage: Math.round(adjustedCoverage),
        premium: Math.round(adjustedPremium),
        coverageLimits: adjustedCoverageLimits,
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4);
  };

  const handleChat = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/recommend/chatbot",
        { message: chatMessage },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
      );
      setChatResponse(res.data.response || "No response from chatbot.");
      setError(null);
    } catch (error) {
      console.error("Chat error:", error.response?.data || error.message);
      setError("Failed to get chat response. Please try again.");
    }
  };

  const handlePayment = async (policyId, amount) => {
    if (!token) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment/payment",
        { policyId, amount, paymentMethod: "simulated_upi" },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 }
      );
      alert(`Payment successful! Transaction ID: ${response.data.transactionId}`);
      setError(null);
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Insurance Recommendations</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
        </TabsList>
        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.length > 0 ? (
              recommendations.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {policy.type === "home" ? <Home className="mr-2 h-4 w-4" /> : <Plane className="mr-2 h-4 w-4" />}
                      {policy.name}
                      {policy.type === "elite" && <Star className="ml-2 h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">Premium: ₹{policy.premium.toFixed(2)}/year</p>
                    <p>Coverage: ₹{policy.coverage.toFixed(2)}</p>
                    {policy.coverageLimits && (
                      <div className="text-sm text-gray-600 mt-2">
                        {Object.entries(policy.coverageLimits).map(([key, value]) => (
                          <p key={key}>{key}: ₹{value.toFixed(2)}</p>
                        ))}
                      </div>
                    )}
                    <Badge
                      variant={
                        policy.type === "elite" ? "default" : policy.type === "premium" ? "secondary" : "outline"
                      }
                    >
                      {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Plan
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">Match: {policy.matchPercentage}%</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={() => handlePayment(policy.id, policy.premium)}
                      className="w-full"
                    >
                      <Shield className="mr-2 h-4 w-4" /> Pay Now
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div>
                <p>
                  No recommendations available. Please{" "}
                  <Link href="/prominence" className="text-purple-600 underline">
                    calculate your prominence score
                  </Link>{" "}
                  first.
                </p>
                {error && <p className="text-red-600">{error}</p>}
              </div>
            )}
          </div>
          {prominenceScore && (
            <div className="mt-4 text-sm text-gray-500">
              Based on your prominence score of {prominenceScore}, we recommend a Premium Plan.
            </div>
          )}
        </TabsContent>
        <TabsContent value="chatbot">
          <div className="space-y-4">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about 'basic', 'premium', 'elite', or your best option..."
              className="w-full p-2 border rounded-md"
            />
            <Button onClick={handleChat} className="w-full md:w-auto">
              Send
            </Button>
            {chatResponse && <p className="mt-4 bg-gray-100 p-2 rounded">{chatResponse}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}