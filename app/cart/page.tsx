"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useStore()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartQuantity(id, newQuantity)
    toast.success("Cart updated")
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast.success(`${name} removed from cart`)
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(0.1)
      toast.success("Promo code applied! 10% discount")
    } else if (promoCode.toLowerCase() === "save20") {
      setDiscount(0.2)
      toast.success("Promo code applied! 20% discount")
    } else {
      toast.error("Invalid promo code")
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * discount
  const shipping = subtotal > 100 ? 0 : 15.99
  const tax = (subtotal - discountAmount) * 0.08875 // NY tax rate
  const total = subtotal - discountAmount + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Discover amazing gaming products and add them to your cart!
        </p>
        <Button size="lg" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart ({cart.length} items)</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">{item.name}</h3>
                    </Link>

                    <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                          min="1"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button onClick={applyPromoCode} variant="outline">
                  Apply
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Try: WELCOME10 or SAVE20</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (NY)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
