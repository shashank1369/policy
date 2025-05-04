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

export default function HomeInsuranceRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    propertyType: "",
    propertyValue: "",
    propertyAge: "",
    propertySize: "",
    propertyAddress: "",
    securitySystem: false,
    fireProtection: false,
    floodZone: "",
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
        router.push("/insurance/home/register");
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
          propertyType: formData.propertyType,
          propertyValue: formData.propertyValue,
          propertyAge: formData.propertyAge,
          propertySize: formData.propertySize,
          propertyAddress: formData.propertyAddress,
          securitySystem: formData.securitySystem,
          fireProtection: formData.fireProtection,
          floodZone: formData.floodZone,
          previousClaims: formData.previousClaims,
          insuranceType: "home",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/recommendations");
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
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Enter details for insurance registration</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={(value) => handleSelectChange("propertyType", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="independent">Independent House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value (₹)</Label>
                  <Input id="propertyValue" name="propertyValue" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAge">Property Age (years)</Label>
                  <Input id="propertyAge" name="propertyAge" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertySize">Property Size (sq. ft.)</Label>
                  <Input id="propertySize" name="propertySize" type="number" onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input id="propertyAddress" name="propertyAddress" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Security Features</Label>
                <div className="flex gap-2">
                  <Checkbox
                    id="securitySystem"
                    onCheckedChange={(checked) => handleCheckboxChange("securitySystem", checked as boolean)}
                  />
                  <Label htmlFor="securitySystem">Security System</Label>
                  <Checkbox
                    id="fireProtection"
                    onCheckedChange={(checked) => handleCheckboxChange("fireProtection", checked as boolean)}
                  />
                  <Label htmlFor="fireProtection">Fire Protection</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Flood Zone?</Label>
                <RadioGroup onValueChange={(value) => handleSelectChange("floodZone", value)} required>
                  <div className="flex gap-2">
                    <RadioGroupItem value="yes" id="flood-yes" />
                    <Label htmlFor="flood-yes">Yes</Label>
                    <RadioGroupItem value="no" id="flood-no" />
                    <Label htmlFor="flood-no">No</Label>
                    <RadioGroupItem value="unknown" id="flood-unknown" />
                    <Label htmlFor="flood-unknown">Not Sure</Label>
                  </div>
                </RadioGroup>
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
              <Button type="submit">Continue to Recommendations</Button>
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