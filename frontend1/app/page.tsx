import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ChatbotWidget from "@/components/chatbot-widget"
import { ArrowRight, Shield, Calculator, Award, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Smart Insurance Solutions Powered by AI
              </h1>
              <p className="max-w-[600px] text-white md:text-xl">
                Get personalized insurance recommendations, manage your policies, and enjoy a seamless digital
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[350px] lg:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Insurance AI Platform"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our Insurance Solutions
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose from our range of insurance products tailored to your needs
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Link href="/insurance/home">
              <Card className="cursor-pointer transition-all hover:shadow-lg border-emerald-100 hover:border-emerald-200 overflow-hidden group">
                <div className="h-48 relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Home Insurance"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b from-white to-emerald-50">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <Shield className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-600">Home Insurance</h3>
                  <p className="text-gray-500">
                    Protect your home and belongings with our comprehensive coverage options.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 group-hover:shadow-md transition-all">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/insurance/travel">
              <Card className="cursor-pointer transition-all hover:shadow-lg border-blue-100 hover:border-blue-200 overflow-hidden group">
                <div className="h-48 relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Travel Insurance"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b from-white to-blue-50">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600">Travel Insurance</h3>
                  <p className="text-gray-500">
                    Travel with peace of mind knowing you're covered for unexpected events.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:shadow-md transition-all">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/recommendations">
              <Card className="cursor-pointer transition-all hover:shadow-lg border-purple-100 hover:border-purple-200 overflow-hidden group">
                <div className="h-48 relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="AI Recommendations"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b from-white to-purple-50">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-600">AI Recommendations</h3>
                  <p className="text-gray-500">Get personalized insurance recommendations based on your profile.</p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:shadow-md transition-all">
                    Get Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Tools at Your Fingertips
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our suite of tools designed to make insurance simple and transparent
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/premium-calculator">
              <Card className="cursor-pointer transition-all hover:shadow-lg border-emerald-100 hover:border-emerald-200 overflow-hidden h-full group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <Calculator className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-600">Premium Calculator</h3>
                  </div>
                  <p className="text-gray-500 mb-6">
                    Calculate your insurance premium based on your specific needs and requirements. Our advanced
                    calculator provides accurate estimates for different coverage options.
                  </p>
                  <div className="mt-auto">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 group-hover:shadow-md transition-all">
                      Calculate Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/prominence-score">
              <Card className="cursor-pointer transition-all hover:shadow-lg border-purple-100 hover:border-purple-200 overflow-hidden h-full group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-600">Prominence Score</h3>
                  </div>
                  <p className="text-gray-500 mb-6">
                    Discover your insurance prominence score and understand how it affects your insurance options and
                    premiums. Improve your score to unlock better benefits.
                  </p>
                  <div className="mt-auto">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:shadow-md transition-all">
                      Check Your Score
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative h-[350px] lg:h-[500px]">
              <Image src="/placeholder.svg?height=500&width=500" alt="Why Choose Us" fill className="object-contain" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Why Choose Our AI-Powered Insurance Platform
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-700">AI-Powered Recommendations</h3>
                    <p className="text-gray-600">
                      Our AI analyzes your profile to recommend the best insurance policies for your needs, ensuring you
                      get the perfect coverage.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-700">Easy Document Upload</h3>
                    <p className="text-gray-600">
                      Upload your documents with our OCR technology for quick and easy processing, saving you time and
                      hassle.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-700">Secure UPI Payments</h3>
                    <p className="text-gray-600">
                      Make secure payments using UPI and other payment methods with end-to-end encryption for your
                      financial safety.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-700">24/7 Support</h3>
                    <p className="text-gray-600">
                      Get help anytime with our AI chatbot and customer support team, ensuring you're never left without
                      assistance.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Experience Smart Insurance?
          </h2>
          <p className="max-w-[600px] mx-auto text-lg text-purple-100 mb-8">
            Join thousands of satisfied customers who have simplified their insurance journey with our AI-powered
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/premium-calculator">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Try Premium Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
