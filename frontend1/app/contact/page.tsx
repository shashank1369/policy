import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ChatbotWidget from "@/components/chatbot-widget"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Have questions about our insurance solutions? Our team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+91 9876543210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Customer Support</SelectItem>
                          <SelectItem value="claims">Claims Assistance</SelectItem>
                          <SelectItem value="policy">Policy Questions</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-emerald-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-sm opacity-90">Reach out to us through any of these channels</p>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-gray-600">support@insuranceai.com</p>
                      <p className="text-sm text-gray-600">info@insuranceai.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-sm text-gray-600">+91 1800-123-4567 (Toll Free)</p>
                      <p className="text-sm text-gray-600">+91 9876543210 (Customer Support)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Office Address</h4>
                      <p className="text-sm text-gray-600">
                        InsuranceAI Headquarters
                        <br />
                        123 Tech Park, Cyber City
                        <br />
                        Gurugram, Haryana 122002
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">
                        Chat with our AI assistant or customer support team for immediate assistance.
                      </p>
                      <Link href="/chatbot">
                        <Button
                          variant="outline"
                          className="mt-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          Start Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-[200px] relative">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium">Our Location</h4>
                <p className="text-sm text-gray-600">
                  Located in the heart of Cyber City, our office is easily accessible by public transportation.
                </p>
                <Button variant="link" className="p-0 h-auto text-emerald-600">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-700">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-purple-800">Monday - Friday:</span>
                    <span className="text-purple-700">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-purple-800">Saturday:</span>
                    <span className="text-purple-700">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-purple-800">Sunday:</span>
                    <span className="text-purple-700">Closed</span>
                  </div>
                  <div className="pt-2 text-xs text-purple-600">
                    * Customer support is available 24/7 through our helpline and AI chatbot.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions about our insurance services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-700">How do I file a claim?</h4>
                  <p className="text-sm text-gray-600">
                    You can file a claim through our online portal, mobile app, or by calling our 24/7 claims hotline.
                    Our AI-powered system will guide you through the process and help you upload the necessary
                    documents.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-700">What is the prominence score?</h4>
                  <p className="text-sm text-gray-600">
                    The prominence score is our proprietary scoring system that evaluates your insurance profile. It
                    helps us determine your customer category and provide personalized recommendations.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-700">How can I get a quote?</h4>
                  <p className="text-sm text-gray-600">
                    You can get a quote by using our premium calculator, which provides instant estimates based on your
                    inputs. For more accurate quotes, you can complete our detailed application form.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-700">What documents do I need for registration?</h4>
                  <p className="text-sm text-gray-600">
                    For registration, you'll need your ID proof, address proof, and relevant documents for the insurance
                    type you're applying for. Our OCR system makes document submission easy and efficient.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Link href="/chatbot">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Our AI Assistant
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
