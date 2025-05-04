"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User, X } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI insurance assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you with that! Could you provide more details?",
        "Based on your insurance profile, I recommend reviewing our Premium Home Protection plan.",
        "Your policy is active and up to date. The next payment is due on May 15, 2023.",
        "To file a claim, you can upload the required documents through our OCR system. Would you like me to guide you through the process?",
        "Our customer service team is available 24/7. Would you like me to connect you with a representative?",
        "Your prominence score is 78, which qualifies you for our premium customer benefits.",
      ]

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChatbot}
        size="icon"
        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg fixed bottom-6 right-6 z-50"
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="sr-only">Open Chatbot</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-xl">
      <CardHeader className="bg-emerald-600 text-white p-3 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">Insurance AI Assistant</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleChatbot} className="text-white hover:bg-emerald-700">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${message.sender === "user" ? "bg-blue-600" : "bg-emerald-600"}`}>
                    <AvatarFallback>
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-3 flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-sm"
            />
            <Button onClick={handleSend} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
