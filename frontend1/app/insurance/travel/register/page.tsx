"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

export default function TravelInsuranceRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    travelStartDate: "",
    travelEndDate: "",
    tripDuration: "",
    travelerAge: "",
    medicalCoverage: false,
    tripCancellation: false,
    baggageCoverage: false,
    previousClaims: "",
    email: "",
    password: "",
    userType: "customer",
    fullName: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken && (!storedToken || storedToken.split('.').length !== 3)) {
      setError("Invalid token format. Please log in again.");
      if (typeof window !== "undefined") localStorage.removeItem("token");
      setToken(null);
    } else {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.user_type === "customer") router.push("/common-form");
    } catch (error) {
      const err = error as AxiosError;
      console.error("User fetch error:", err.response?.data || err.message);
      setError("Session expired or invalid. Please log in again.");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        fullName: formData.fullName,
      });
      const newToken = res.data.token;
      if (newToken && newToken.split('.').length === 3) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", newToken);
        }
        setToken(newToken);
        router.push("/insurance/travel/register");
      } else {
        throw new Error("Invalid token received from server");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.split('.').length !== 3) {
      setError("No valid session. Please log in or sign up.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/submit-form",
        {
          destination: formData.destination,
          travelStartDate: formData.travelStartDate,
          travelEndDate: formData.travelEndDate,
          tripDuration: formData.tripDuration,
          travelerAge: formData.travelerAge,
          medicalCoverage: formData.medicalCoverage,
          tripCancellation: formData.tripCancellation,
          baggageCoverage: formData.baggageCoverage,
          previousClaims: formData.previousClaims,
          insuranceType: "travel",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/travel-recommendations");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Form submit error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.error || "Form submission failed. Please try again.");
      if (err.response?.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        setToken(null);
        setError("Invalid token. Please log in again.");
      }
    }
  };

  if (token) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Travel Insurance Information</CardTitle>
            <CardDescription>Enter details for travel insurance registration</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" name="destination" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelStartDate">Travel Start Date</Label>
                  <Input id="travelStartDate" name="travelStartDate" type="date" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelEndDate">Travel End Date</Label>
                  <Input id="travelEndDate" name="travelEndDate" type="date" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripDuration">Trip Duration (days)</Label>
                  <Input id="tripDuration" name="tripDuration" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelerAge">Traveler Age</Label>
                  <Input id="travelerAge" name="travelerAge" type="number" onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Coverage Options</Label>
                <div className="flex gap-2">
                  <Checkbox
                    id="medicalCoverage"
                    onCheckedChange={(checked) => handleCheckboxChange("medicalCoverage", checked as boolean)}
                  />
                  <Label htmlFor="medicalCoverage">Medical Coverage</Label>
                  <Checkbox
                    id="tripCancellation"
                    onCheckedChange={(checked) => handleCheckboxChange("tripCancellation", checked as boolean)}
                  />
                  <Label htmlFor="tripCancellation">Trip Cancellation</Label>
                  <Checkbox
                    id="baggageCoverage"
                    onCheckedChange={(checked) => handleCheckboxChange("baggageCoverage", checked as boolean)}
                  />
                  <Label htmlFor="baggageCoverage">Baggage Coverage</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Previous Claims?</Label>
                <RadioGroup onValueChange={(value) => handleSelectChange("previousClaims", value)} required>
                  <div className="flex gap-2">
                    <RadioGroupItem value="yes" id="claims-yes" />
                    <Label htmlFor="claims-yes">Yes</Label>
                    <RadioGroupItem value="no" id="claims-no" />
                    <Label htmlFor="claims-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit">Continue to Travel Recommendations</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Register to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select onValueChange={(value) => handleSelectChange("userType", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" onChange={handleChange} required />
            </div>
            <Button type="submit">Signup</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}