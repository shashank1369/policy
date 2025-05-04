import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Globe, Clock, CrossIcon as MedicalCross } from "lucide-react"

export default function TravelInsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mb-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-emerald-600">
            Travel Insurance
          </h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Travel with peace of mind knowing you're covered for unexpected events. Our AI-powered system will recommend
            the perfect travel insurance plan for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/insurance/travel/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
            <Link href="/travel-recommendations">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                View Recommendations
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Travel Insurance"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-center">Why Choose Our Travel Insurance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Globe className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Worldwide Coverage</h3>
              <p className="text-gray-500">
                Protection no matter where your travels take you, with global emergency assistance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <MedicalCross className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Medical Coverage</h3>
              <p className="text-gray-500">
                Comprehensive medical coverage for illnesses and injuries while traveling.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Clock className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">24/7 Assistance</h3>
              <p className="text-gray-500">Round-the-clock support for emergencies and travel-related issues.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Coverage Options</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Trip Cancellation</h3>
                <p className="text-gray-500">
                  Reimbursement for prepaid, non-refundable trip costs if you need to cancel for a covered reason.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Medical Expenses</h3>
                <p className="text-gray-500">
                  Coverage for emergency medical treatment, hospital stays, and medical evacuation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Baggage Loss</h3>
                <p className="text-gray-500">Compensation for lost, stolen, or damaged baggage during your trip.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Travel Delays</h3>
                <p className="text-gray-500">Coverage for additional expenses due to significant travel delays.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Emergency Assistance</h3>
                <p className="text-gray-500">
                  24/7 emergency assistance services, including medical referrals and translation services.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Accidental Death & Dismemberment</h3>
                <p className="text-gray-500">
                  Benefits in case of accidental death or serious injury during your trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Travel Insurance Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-emerald-200">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">Basic Plan</h3>
                <div className="text-3xl font-bold text-emerald-600 my-2">₹1,999</div>
                <p className="text-gray-500">For simple trips</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Trip cancellation (up to ₹50,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Medical expenses (up to ₹5,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Baggage loss (up to ₹25,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">24/7 emergency assistance</span>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Select Plan</Button>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-500 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <div className="bg-emerald-600 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-2">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold">Premium Plan</h3>
                <div className="text-3xl font-bold text-emerald-600 my-2">₹3,499</div>
                <p className="text-gray-500">For comprehensive coverage</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Trip cancellation (up to ₹1,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Medical expenses (up to ₹10,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Baggage loss (up to ₹50,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Travel delay coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Adventure activities coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Premium 24/7 assistance</span>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Select Plan</Button>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">Elite Plan</h3>
                <div className="text-3xl font-bold text-emerald-600 my-2">₹5,999</div>
                <p className="text-gray-500">For luxury travelers</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Trip cancellation (up to ₹2,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Medical expenses (up to ₹25,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Baggage loss (up to ₹1,00,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Luxury accommodation coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">VIP emergency assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Concierge services</span>
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Select Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <h2 className="text-2xl font-bold">Ready for Your Next Adventure?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Get started with our travel insurance registration process. Our AI will analyze your travel patterns and
          recommend the best coverage options for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/insurance/travel/register">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Register Now
            </Button>
          </Link>
          <Link href="/common-form">
            <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Calculate Prominence Score
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}