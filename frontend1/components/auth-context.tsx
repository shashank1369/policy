"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { generateMockData } from "@/lib/mock-data"

type UserType = "customer" | "company"

type User = {
  id: string
  email: string
  name?: string
  companyName?: string
  userType: UserType
  userData: any
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, userType: UserType) => Promise<void>
  signup: (email: string, password: string, name: string, userType: UserType) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)

        // Generate fresh user data each time
        const userData = generateMockData(parsedUser.email, parsedUser.userType)
        setUser({
          ...parsedUser,
          userData,
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate user data based on email and user type
      const userData = generateMockData(email, userType)

      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: userType === "customer" ? email.split("@")[0] : undefined,
        companyName: userType === "company" ? `${email.split("@")[0]} Insurance` : undefined,
        userType,
        userData,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, userType: UserType) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate user data based on email and user type
      const userData = generateMockData(email, userType)

      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: userType === "customer" ? name : undefined,
        companyName: userType === "company" ? name : undefined,
        userType,
        userData,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
