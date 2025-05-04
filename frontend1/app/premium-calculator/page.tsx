"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Home, Plane, Calculator, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PremiumCalculatorPage() {
  const [insuranceType, setInsuranceType] = useState("home")
  const [premium, setPremium] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [coverageAmount, setCoverageAmount] = useState(5000000)
  const [deductible, setDeductible] = useState(10000)
  const [propertyType, setPropertyType] = useState("apartment")
  const [propertyAge, setPropertyAge] = useState(5)
  const [securitySystem, setSecuritySystem] = useState(false)
  const [fireProtection, setFireProtection] = useState(false)
  const [floodZone, setFloodZone] = useState("no")
  const [travelRegion, setTravelRegion] = useState("domestic")
  const [travelDuration, setTravelDuration] = useState(7)
  const [travelPurpose, setTravelPurpose] = useState("leisure")
  const [medicalConditions, setMedicalConditions] = useState(false)
  const [adventureActivities, setAdventureActivities] = useState(false)
  const [age, setAge] = useState(30)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const calculatePremium = () => {
    setLoading(true)

    // Simulate API call with a timeout
    setTimeout(() => {
      let calculatedPremium = 0

      if (insuranceType === "home") {
        // Base premium calculation for home insurance
        const basePremium = coverageAmount * 0.0003

        // Adjustments based on property type
        const propertyTypeMultiplier =
          {
            apartment: 0.8,
            independent: 1.0,
            villa: 1.2,
            condo: 0.9,
            other: 1.1,
          }[propertyType] || 1.0

        // Adjustments based on property age
        const ageMultiplier = 1 + propertyAge * 0.01

        // Discounts for security features
        const securityDiscount = securitySystem ? 0.9 : 1.0
        const fireDiscount = fireProtection ? 0.95 : 1.0

        // Risk factor for flood zone
        const floodRisk = floodZone === "yes" ? 1.5 : floodZone === "unknown" ? 1.2 : 1.0

        // Deductible adjustment
        const deductibleFactor = 1 - (deductible / coverageAmount) * 10

        // Calculate final premium
        calculatedPremium =
          basePremium *
          propertyTypeMultiplier *
          ageMultiplier *
          securityDiscount *
          fireDiscount *
          floodRisk *
          deductibleFactor
      } else {
        // Base premium calculation for travel insurance
        const basePremium = travelDuration * 300

        // Adjustments based on region
        const regionMultiplier =
          {
            domestic: 1.0,
            asia: 1.2,
            europe: 1.5,
            americas: 1.7,
            worldwide: 2.0,
          }[travelRegion] || 1.0

        // Adjustments based on purpose
        const purposeMultiplier =
          {
            leisure: 1.0,
            business: 0.9,
            education: 1.1,
            medical: 1.5,
            mixed: 1.2,
          }[travelPurpose] || 1.0

        // Risk factors
        const medicalFactor = medicalConditions ? 1.5 : 1.0
        const adventureFactor = adventureActivities ? 1.3 : 1.0

        // Age factor
        const ageFactor = age < 30 ? 1.0 : age < 60 ? 1.2 : 1.5

        // Coverage amount adjustment
        const coverageFactor = coverageAmount / 1000000

        // Calculate final premium
        calculatedPremium =
          basePremium *
          regionMultiplier *
          purposeMultiplier *
          medicalFactor *
          adventureFactor *
          ageFactor *
          coverageFactor
      }

      // Round to nearest 100
      calculatedPremium = Math.round(calculatedPremium / 100) * 100

      setPremium(calculatedPremium)
      setLoading(false)
      setShowRecommendations(true)
    }, 1500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const resetCalculator = () => {
    setPremium(null)
    setShowRecommendations(false)

    // Reset to default values
    if (insuranceType === "home") {
      setCoverageAmount(5000000)
      setDeductible(10000)
      setPropertyType("apartment")
      setPropertyAge(5)
      setSecuritySystem(false)
      setFireProtection(false)
      setFloodZone("no")
    } else {
      setCoverageAmount(2500000)
      setTravelRegion("domestic")
      setTravelDuration(7)
      setTravelPurpose("leisure")
      setMedicalConditions(false)
      setAdventureActivities(false)
      setAge(30)
    }
  }

  // Update default coverage amount when insurance type changes
  useEffect(() => {
    if (insuranceType === "home") {
      setCoverageAmount(5000000)
    } else {
      setCoverageAmount(2500000)
    }
    setPremium(null)
    setShowRecommendations(false)
  }, [insuranceType])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Premium Calculator</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Get an estimate of your insurance premium based on your specific needs and requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calculate Your Premium</CardTitle>
                    <CardDescription>Customize your insurance parameters</CardDescription>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Calculator className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={insuranceType} onValueChange={setInsuranceType} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="home" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Home Insurance
                    </TabsTrigger>
                    <TabsTrigger value="travel" className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Travel Insurance
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="home" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="coverage-amount">Coverage Amount (₹)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="coverage-amount"
                            type="number"
                            value={coverageAmount}
                            onChange={(e) => setCoverageAmount(Number(e.target.value))}
                            className="flex-1"
                          />
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label>Coverage Range</Label>
                          <Slider
                            defaultValue={[coverageAmount]}
                            max={10000000}
                            step={100000}
                            value={[coverageAmount]}
                            onValueChange={(value) => setCoverageAmount(value[0])}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>₹10 Lakh</span>
                            <span>₹1 Crore</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deductible">Deductible Amount (₹)</Label>
                        <Input
                          id="deductible"
                          type="number"
                          value={deductible}
                          onChange={(e) => setDeductible(Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          The amount you pay out of pocket before insurance coverage begins
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="property-type">Property Type</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
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
                        <Label htmlFor="property-age">Property Age (years)</Label>
                        <Input
                          id="property-age"
                          type="number"
                          value={propertyAge}
                          onChange={(e) => setPropertyAge(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Security Features</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="security-system"
                            checked={securitySystem}
                            onCheckedChange={(checked) => setSecuritySystem(checked as boolean)}
                          />
                          <label
                            htmlFor="security-system"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Security System/Alarm
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fire-protection"
                            checked={fireProtection}
                            onCheckedChange={(checked) => setFireProtection(checked as boolean)}
                          />
                          <label
                            htmlFor="fire-protection"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Fire Protection System
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Is your property in a flood-prone zone?</Label>
                      <RadioGroup value={floodZone} onValueChange={setFloodZone}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="flood-yes" />
                          <Label htmlFor="flood-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="flood-no" />
                          <Label htmlFor="flood-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unknown" id="flood-unknown" />
                          <Label htmlFor="flood-unknown">Not Sure</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="coverage-amount-travel">Coverage Amount (₹)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="coverage-amount-travel"
                            type="number"
                            value={coverageAmount}
                            onChange={(e) => setCoverageAmount(Number(e.target.value))}
                            className="flex-1"
                          />
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label>Coverage Range</Label>
                          <Slider
                            defaultValue={[coverageAmount]}
                            max={5000000}
                            step={100000}
                            value={[coverageAmount]}
                            onValueChange={(value) => setCoverageAmount(value[0])}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>₹5 Lakh</span>
                            <span>₹50 Lakh</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travel-region">Travel Region</Label>
                        <Select value={travelRegion} onValueChange={setTravelRegion}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="domestic">Domestic (India)</SelectItem>
                            <SelectItem value="asia">Asia</SelectItem>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="americas">Americas</SelectItem>
                            <SelectItem value="worldwide">Worldwide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="travel-duration">Trip Duration (days)</Label>
                        <Input
                          id="travel-duration"
                          type="number"
                          value={travelDuration}
                          onChange={(e) => setTravelDuration(Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travel-purpose">Purpose of Travel</Label>
                        <Select value={travelPurpose} onValueChange={setTravelPurpose}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="leisure">Leisure/Vacation</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="mixed">Mixed Purposes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age of Primary Traveler</Label>
                      <Input id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Information</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="medical-conditions"
                            checked={medicalConditions}
                            onCheckedChange={(checked) => setMedicalConditions(checked as boolean)}
                          />
                          <label
                            htmlFor="medical-conditions"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Do you have any pre-existing medical conditions?
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="adventure-activities"
                            checked={adventureActivities}
                            onCheckedChange={(checked) => setAdventureActivities(checked as boolean)}
                          />
                          <label
                            htmlFor="adventure-activities"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Do you plan to participate in adventure activities? (e.g., skiing, scuba diving)
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
                <Button
                  onClick={calculatePremium}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Calculate Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="border-emerald-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <h3 className="text-xl font-bold">Your Estimated Premium</h3>
                  <p className="text-sm opacity-90">Based on your selected parameters</p>
                </div>
                <CardContent className="pt-6">
                  {premium === null ? (
                    <div className="text-center py-8">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Calculator"
                        width={80}
                        height={80}
                        className="mx-auto mb-4 opacity-70"
                      />
                      <p className="text-gray-500">
                        Fill in your details and click "Calculate Premium" to get your estimate
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600">{formatCurrency(premium)}</div>
                        <p className="text-sm text-gray-500 mt-1">per year</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Coverage Amount:</span>
                          <span className="font-medium">{formatCurrency(coverageAmount)}</span>
                        </div>
                        {insuranceType === "home" ? (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Deductible:</span>
                              <span className="font-medium">{formatCurrency(deductible)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Property Type:</span>
                              <span className="font-medium capitalize">{propertyType}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Travel Region:</span>
                              <span className="font-medium capitalize">{travelRegion}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Trip Duration:</span>
                              <span className="font-medium">{travelDuration} days</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <Link
                          href={insuranceType === "home" ? "/insurance/home/register" : "/insurance/travel/register"}
                        >
                          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                            Proceed to Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {showRecommendations && (
                <Card className="border-emerald-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recommended Plans</CardTitle>
                    <CardDescription>Based on your inputs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-600 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <h4 className="font-medium text-emerald-800">
                            {insuranceType === "home" ? "Premium Home Protection" : "Global Travel Elite"}
                          </h4>
                        </div>
                        <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">Best Match</span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-2">
                        {insuranceType === "home"
                          ? "Comprehensive coverage with additional benefits for your property"
                          : "Worldwide coverage with premium benefits for travelers"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-400 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <h4 className="font-medium">
                            {insuranceType === "home" ? "Standard Home Insurance" : "Basic Travel Cover"}
                          </h4>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Economy</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {insuranceType === "home"
                          ? "Essential coverage at an affordable price"
                          : "Basic protection for budget-conscious travelers"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700">Why Calculate Your Premium?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-purple-900">Get an accurate estimate before applying</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-purple-900">Understand how different factors affect your premium</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-purple-900">Compare different coverage options</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-600 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-purple-900">Make informed decisions about your insurance needs</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
