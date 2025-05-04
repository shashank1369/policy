import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function HomeInsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mb-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-emerald-600">
            Home Insurance
          </h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Protect your home and belongings with our comprehensive coverage options. Our AI-powered system will help
            you find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/insurance/home/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                View Recommendations
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Home Insurance"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h2 className="text-2xl font-bold text-center">Why Choose Our Home Insurance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  alt="Comprehensive Coverage"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Coverage</h3>
              <p className="text-gray-500">
                Protection for your home structure, personal belongings, and liability coverage.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  alt="Personalized Plans"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Personalized Plans</h3>
              <p className="text-gray-500">
                AI-powered recommendations to find the perfect coverage based on your specific needs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  alt="Fast Claims"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Fast Claims Processing</h3>
              <p className="text-gray-500">
                Quick and hassle-free claims process with digital documentation and verification.
              </p>
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
                <h3 className="font-bold">Dwelling Coverage</h3>
                <p className="text-gray-500">
                  Protects the structure of your home, including walls, roof, floors, and built-in appliances.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Personal Property</h3>
                <p className="text-gray-500">
                  Covers your belongings like furniture, clothing, electronics, and other personal items.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Liability Protection</h3>
                <p className="text-gray-500">
                  Covers legal expenses if someone is injured on your property or if you damage someone else's property.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Additional Living Expenses</h3>
                <p className="text-gray-500">
                  Covers costs if you need to temporarily live elsewhere while your home is being repaired.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Natural Disaster Coverage</h3>
                <p className="text-gray-500">
                  Protection against damage from floods, earthquakes, and other natural disasters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Theft and Vandalism</h3>
                <p className="text-gray-500">Coverage for stolen items or damage caused by break-ins or vandalism.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <h2 className="text-2xl font-bold">Ready to Protect Your Home?</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Get started with our home insurance registration process. Our AI will analyze your needs and recommend the
          best coverage options for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/insurance/home/register">
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