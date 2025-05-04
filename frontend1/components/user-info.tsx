"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

export function UserInfo() {
  const [showDetails, setShowDetails] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setLoading(false)
        setError("No token found. Please log in.")
        return
      }

      if (!token.startsWith("dummy-token-")) {
        setLoading(false)
        setError("Invalid token format. Please log in again.")
        return
      }

      try {
        setLoading(true)
        const response = await axios.get("http://127.0.0.1:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10-second timeout
        })
        if (response.data && typeof response.data === "object") {
          setUser(response.data)
        } else {
          throw new Error("Invalid user data received from server")
        }
      } catch (err) {
        const axiosError = err as any
        const errorMsg =
          axiosError.code === "ECONNABORTED"
            ? "Server timed out. Please check your network and ensure the server at http://127.0.0.1:5000 is running."
            : axiosError.response?.data?.error ||
              axiosError.response?.data?.message ||
              (axiosError.response?.status === 404 ? "User not found. Please ensure you are logged in with the correct account." : axiosError.message) ||
              "Error fetching user data. Check if the server is running and the token is valid."
        const errorDetails = {
          message: axiosError.message || "No error message",
          response: axiosError.response?.data || "No response data",
          status: axiosError.response?.status || axiosError.code || "Unknown",
          url: axiosError.config?.url || "Unknown URL",
          method: axiosError.config?.method || "Unknown method",
        }
        console.error("Error fetching user:", errorMsg, errorDetails)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <div className="circular-logo">Loading...</div>
  if (error) return <div className="circular-logo text-red-500">{error}</div>
  if (!user) return null

  const displayName = user.full_name || user.company_name || user.email || "User"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <div className="circular-logo" onClick={() => setShowDetails(!showDetails)}>
        <span>{initial}</span>
      </div>
      {showDetails && (
        <div className="user-details absolute right-0 bg-white border border-gray-300 p-4 shadow-lg z-10">
          <p>Name: {user.full_name || user.company_name || "N/A"}</p>
          <p>Email: {user.email || "N/A"}</p>
          <p>User Type: {user.user_type || "N/A"}</p>
          {user.company_name && <p>Company: {user.company_name}</p>}
          {user.company_reg_number && <p>Reg Number: {user.company_reg_number}</p>}
          <button
            onClick={() => setShowDetails(false)}
            className="mt-2 p-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}
      <style jsx>{`
        .circular-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .user-details {
          top: 100%;
          z-index: 10;
        }
      `}</style>
    </div>
  )
}