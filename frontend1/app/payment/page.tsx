"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/transactions")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Payment</h1>
          <p className="text-gray-500 mt-2">
            Complete your payment to activate your insurance policy
          </p>
        </div>

        {isSuccess ? (
          <Card className="border-emerald-500">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-gray-500">
                Your payment has been processed successfully. Your insurance policy is now active.
              </p>
              <p className="font-medium">
                Transaction ID: <span className="text-emerald-600">TXN123456789</span>
              </p>
              <p className="text-sm text-gray-500">
                You will be redirected to your transactions page shortly...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="upi" className="w-full" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upi">UPI</TabsTrigger>
                      <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upi" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input 
                          id="upi-id" 
                          placeholder="username@upi" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required={paymentMethod === "upi"}
                        />
                        <p className="text-sm text-gray-500">
                          Enter your UPI ID (e.g., username@okicici, username@okhdfc)
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-4 py-4">
                        <div className="flex flex-col items-center">
                          <div className="border rounded-lg p-2 w-16 h-16 flex items-center justify-center mb-2">
                            <Image 
                              src="/placeholder.svg?height=40&width=40" 
                              alt="Google Pay" 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs text-center">Google Pay</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="border rounded-lg p-2 w-16 h-16 flex items-center justify-center mb-2">
                            <Image 
                              src="/placeholder.svg?height=40&width=40" 
                              alt="PhonePe" 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs text-center">PhonePe</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="border rounded-lg p-2 w-16 h-16 flex items-center justify-center mb-2">
                            <Image 
                              src="/placeholder.svg?height=40&width=40" 
                              alt="Paytm" 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs text-center">Paytm</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="border rounded-lg p-2 w-16 h-16 flex items-center justify-center mb-2">
                            <Image 
                              src="/placeholder.svg?height=40&width=40" 
                              alt="BHIM" 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xs text-center">BHIM</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="card" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input 
                          id="card-number" 
                          placeholder="1234 5678 9012 3456" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input 
                          id="card-name" 
                          placeholder="John Doe" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input 
                            id="card-expiry" 
                            placeholder="MM/YY" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input 
                            id="card-cvv" 
                            placeholder="123" 
                            value={cardCvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required={paymentMethod === "card"}
                            type="password"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  </Tabs>
                </form>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Insurance Plan</span>
                    <span className="font-medium">Health Protect Plus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coverage Period</span>
                    <span className="font-medium">1 Year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Premium</span>
                    <span className="font-medium">₹12,499</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (18%)</span>
                    <span className="font-medium">₹2,250</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹14,749</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium text-sm mb-2">Secure Payment</h4>
                    <p className="text-xs text-gray-500">
                      All payments are secured with 256-bit SSL encryption to ensure your transaction is safe and secure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}