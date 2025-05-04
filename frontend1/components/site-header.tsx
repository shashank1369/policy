"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-context"

export function SiteHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-emerald-600">InsuranceAI</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {!user ? (
              <div className="hidden sm:flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center mr-4">
                <span className="text-sm font-medium">
                  Welcome, {user.userType === "company" ? user.companyName : user.name}
                </span>
              </div>
            )}
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
