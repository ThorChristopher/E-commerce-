"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Shield } from "lucide-react"
import { useStore } from "@/lib/store"

export default function SecretAdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setIsAdmin } = useStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in production, this would be a secure API call
    if (credentials.username === "admin" && credentials.password === "thorpchristopher2024") {
      setIsAdmin(true)
      localStorage.setItem("admin_authenticated", "true")
      router.push("/admin")
    } else {
      setError("Invalid admin credentials")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-600">Admin Access</CardTitle>
          <p className="text-muted-foreground">Restricted Area - Authorized Personnel Only</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Admin Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              <Lock className="h-4 w-4 mr-2" />
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>⚠️ This is a secure admin area</p>
            <p>Unauthorized access is prohibited</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
