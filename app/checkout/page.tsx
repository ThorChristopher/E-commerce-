"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Check, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, addOrder, clearCart, currentUser, getActivePaymentMethods, addActivity, paymentMethods } = useStore()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentProof: null as File | null,
  })

  const activePaymentMethods = useMemo(() => getActivePaymentMethods(), [paymentMethods])

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      toast.error("Please login to proceed with checkout")
      router.push("/login")
      return
    }

    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push("/cart")
      return
    }
  }, [currentUser, cart, router])

  // Separate useEffect for setting default payment method
  useEffect(() => {
    if (activePaymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(activePaymentMethods[0].id)
    }
  }, [paymentMethod]) // Remove getActivePaymentMethods from dependencies

  // Separate useEffect for pre-filling user data
  useEffect(() => {
    if (currentUser) {
      setOrderData((prev) => ({
        ...prev,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      }))

      // Track checkout page visit only once
      addActivity({
        userId: currentUser.id,
        action: "checkout_started",
        details: "Started checkout process",
      })
    }
  }, [currentUser?.id]) // Only depend on user ID, not the whole user object or addActivity

  const handleInputChange = (field: string, value: string) => {
    setOrderData({ ...orderData, [field]: value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB")
        return
      }
      setOrderData({ ...orderData, paymentProof: file })
      toast.success("Payment proof uploaded successfully")
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Please login to place an order")
      return
    }

    // Validate form
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
    const missingFields = requiredFields.filter((field) => !orderData[field as keyof typeof orderData])

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!orderData.paymentProof) {
      toast.error("Please upload payment proof")
      return
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    setIsSubmitting(true)

    try {
      const selectedPaymentMethod = activePaymentMethods.find((pm) => pm.id === paymentMethod)

      const orderId = addOrder({
        customer: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode,
        },
        items: cart,
        total: orderTotal,
        status: "pending",
        paymentMethod: selectedPaymentMethod?.name || "Unknown",
        paymentProof: orderData.paymentProof.name,
      })

      // Track order completion
      addActivity({
        userId: currentUser.id,
        action: "order_placed",
        details: `Placed order ${orderId} for $${orderTotal.toFixed(2)}`,
      })

      clearCart()
      toast.success("Order submitted successfully!")
      router.push(`/order-confirmation/${orderId}`)
    } catch (error) {
      toast.error("Failed to submit order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-8">You need to be logged in to proceed with checkout.</p>
        <Button asChild>
          <Link href="/login">Login to Continue</Link>
        </Button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to proceed with checkout.</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (activePaymentMethods.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Methods Not Available</h1>
        <p className="text-muted-foreground mb-8">
          No payment methods are currently configured. Please contact support.
        </p>
        <Button asChild>
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15.99
  const tax = subtotal * 0.08875 // NY tax rate
  const orderTotal = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/cart">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
      </Button>

      <div className="flex items-center gap-2 mb-8">
        <Lock className="h-5 w-5 text-green-600" />
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={orderData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={orderData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={orderData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={orderData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={orderData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={orderData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {activePaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.description && <p className="text-sm text-muted-foreground">{method.description}</p>}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {paymentMethod && (
                  <Alert>
                    <AlertDescription>
                      {(() => {
                        const selectedMethod = activePaymentMethods.find((m) => m.id === paymentMethod)
                        if (!selectedMethod) return null

                        if (selectedMethod.type === "paypal") {
                          return (
                            <>
                              <strong>PayPal Instructions:</strong>
                              <br />
                              Send payment to: <strong>{selectedMethod.email}</strong>
                              <br />
                              Include your order number in the payment note and upload a screenshot below.
                            </>
                          )
                        } else if (selectedMethod.type === "cashapp") {
                          return (
                            <>
                              <strong>Cash App Instructions:</strong>
                              <br />
                              Send payment to: <strong>{selectedMethod.handle}</strong>
                              <br />
                              Include your order number in the payment note and upload a screenshot below.
                            </>
                          )
                        }
                        return `Send payment using ${selectedMethod.name} and upload proof below.`
                      })()}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="paymentProof">Upload Payment Screenshot *</Label>
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    required
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Please upload a clear screenshot of your payment confirmation (Max 5MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (NY)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Your order will be pending until payment is verified by our admin team. You'll receive email updates
                    on your order status.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Processing Order..." : `Place Order - $${orderTotal.toFixed(2)}`}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>🔒 Secure checkout with SSL encryption</p>
                  <p>💳 Payment methods configured by admin</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
