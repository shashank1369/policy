"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calculator, Award, Shield } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Insurance</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-emerald-500 to-teal-700 p-6 no-underline outline-none focus:shadow-md"
                      href="/insurance"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">Insurance Solutions</div>
                      <p className="text-sm leading-tight text-white/90">
                        Explore our range of insurance products tailored to your needs
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/insurance/home" title="Home Insurance" icon={<Shield className="h-4 w-4 mr-2" />}>
                  Protect your home and belongings
                </ListItem>
                <ListItem href="/insurance/travel" title="Travel Insurance" icon={<Shield className="h-4 w-4 mr-2" />}>
                  Travel with peace of mind
                </ListItem>
                <ListItem
                  href="/recommendations"
                  title="Get Recommendations"
                  icon={<Shield className="h-4 w-4 mr-2" />}
                >
                  AI-powered insurance suggestions
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem
                  href="/premium-calculator"
                  title="Premium Calculator"
                  icon={<Calculator className="h-4 w-4 mr-2" />}
                >
                  Calculate your insurance premium
                </ListItem>
                <ListItem href="/prominence-score" title="Prominence Score" icon={<Award className="h-4 w-4 mr-2" />}>
                  Check your insurance prominence score
                </ListItem>
                <ListItem href="/upload-ocr" title="Document Upload" icon={<Shield className="h-4 w-4 mr-2" />}>
                  Upload and process your documents with OCR
                </ListItem>
                <ListItem href="/payment" title="Payments" icon={<Shield className="h-4 w-4 mr-2" />}>
                  Make secure payments using UPI
                </ListItem>
                <ListItem href="/transactions" title="Transactions" icon={<Shield className="h-4 w-4 mr-2" />}>
                  View your transaction history
                </ListItem>
                <ListItem href="/activity" title="Activity" icon={<Shield className="h-4 w-4 mr-2" />}>
                  Track your account activity
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Link href="/chatbot">
        <Button variant="ghost" size="icon" className="text-emerald-600">
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">Chatbot</span>
        </Button>
      </Link>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none flex items-center">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"