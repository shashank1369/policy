import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-context"
import { UserInfo } from "@/components/user-info"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Insurance AI Platform",
  description: "AI-powered insurance platform for personalized recommendations and policy management",
  generator: "v0.dev",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className={`relative flex min-h-screen flex-col ${inter.className}`}>
              <SiteHeader />
              <div className="flex-1 flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-2xl font-bold">
                  {typeof window !== "undefined" && localStorage.getItem("token")
                    ? "Welcome, User!" // Placeholder until user data is fetched
                    : "Insurance AI Platform"}
                </h1>
                <UserInfo />
              </div>
              <div className="flex-1">{children}</div>

              <footer className="bg-gray-50 border-t py-8 hidden">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-bold text-lg text-emerald-600 mb-4">InsuranceAI</h3>
                      <p className="text-sm text-gray-600">
                        AI-powered insurance platform providing personalized recommendations and seamless digital
                        experience.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Insurance</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                          <a href="/insurance/home" className="hover:text-emerald-600">
                            Home Insurance
                          </a>
                        </li>
                        <li>
                          <a href="/insurance/travel" className="hover:text-emerald-600">
                            Travel Insurance
                          </a>
                        </li>
                        <li>
                          <a href="/recommendations" className="hover:text-emerald-600">
                            Recommendations
                          </a>
                        </li>
                        <li>
                          <a href="/premium-calculator" className="hover:text-emerald-600">
                            Premium Calculator
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Company</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                          <a href="/about" className="hover:text-emerald-600">
                            About Us
                          </a>
                        </li>
                        <li>
                          <a href="/contact" className="hover:text-emerald-600">
                            Contact
                          </a>
                        </li>
                        <li>
                          <a href="/careers" className="hover:text-emerald-600">
                            Careers
                          </a>
                        </li>
                        <li>
                          <a href="/blog" className="hover:text-emerald-600">
                            Blog
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Legal</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                          <a href="/terms" className="hover:text-emerald-600">
                            Terms of Service
                          </a>
                        </li>
                        <li>
                          <a href="/privacy" className="hover:text-emerald-600">
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a href="/cookies" className="hover:text-emerald-600">
                            Cookie Policy
                          </a>
                        </li>
                        <li>
                          <a href="/licenses" className="hover:text-emerald-600">
                            Licenses
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
                    © 2025 InsuranceAI. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}