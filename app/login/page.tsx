"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, UserPlus, Eye, EyeOff } from "lucide-react"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { users, addUser, loginUser, addActivity } = useStore()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists
    const existingUser = users.find((user) => user.email === loginData.email)

    if (existingUser && loginData.password) {
      // Successful login
      loginUser(loginData.email)
      addActivity({
        userId: existingUser.id,
        action: "login",
        details: "User logged in successfully",
      })
      toast.success(`Welcome back, ${existingUser.firstName}!`)
      router.push("/account")
    } else if (loginData.email && loginData.password) {
      // For demo purposes, create new user automatically
      const newUserId = addUser({
        email: loginData.email,
        firstName: "Gaming",
        lastName: "Enthusiast",
      })
      loginUser(loginData.email)
      addActivity({
        userId: newUserId,
        action: "auto_register",
        details: "User auto-registered during login",
      })
      toast.success("Welcome! Account created automatically.")
      router.push("/account")
    } else {
      setError("Please enter valid credentials")
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === signupData.email)
    if (existingUser) {
      setError("An account with this email already exists")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (signupData.email && signupData.password && signupData.firstName && signupData.lastName) {
      // Create new user
      const newUserId = addUser({
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
      })

      loginUser(signupData.email)
      addActivity({
        userId: newUserId,
        action: "signup",
        details: "User created new account",
      })

      toast.success(`Welcome to Thorp Christopher, ${signupData.firstName}!`)
      router.push("/account")
    } else {
      setError("Please fill in all required fields")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Thorp Christopher
          </Link>
          <p className="text-muted-foreground mt-2">Welcome to your gaming destination</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Account Access</CardTitle>
            <p className="text-sm text-muted-foreground">Join thousands of satisfied gamers</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-sm">
                      Forgot your password?
                    </Button>
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    <p>Demo: Use any email and password to login</p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupEmail">Email Address</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
