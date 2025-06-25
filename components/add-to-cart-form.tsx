"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore, type Product } from "@/lib/store"
import { toast } from "sonner"

interface AddToCartFormProps {
  product: Product
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addToCart(product, quantity)
      toast.success(`Added ${quantity} ${product.name} to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => (window.location.href = "/cart"),
        },
      })
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <Label htmlFor="quantity" className="font-medium">
          Quantity:
        </Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || 1
              if (val >= 1 && val <= product.stockCount) {
                setQuantity(val)
              }
            }}
            className="w-20 text-center"
            min="1"
            max={product.stockCount}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stockCount}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">(Max: {product.stockCount})</span>
      </div>

      <div className="space-y-3">
        <Button onClick={handleAddToCart} disabled={!product.inStock || isLoading} className="w-full" size="lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isLoading ? "Adding to Cart..." : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
        </Button>

        {!product.inStock && (
          <p className="text-center text-destructive font-medium">This item is currently out of stock</p>
        )}

        <p className="text-center text-sm text-muted-foreground">Free shipping on orders over $100 • 30-day returns</p>
      </div>
    </div>
  )
}
