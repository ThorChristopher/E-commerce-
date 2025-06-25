"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift } from "lucide-react"
import { toast } from "sonner"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Successfully subscribed to newsletter!")
    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">Stay Updated with Latest Deals</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and get exclusive discounts, early access to sales, and gaming news.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Get 10% off your first order when you subscribe!
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
