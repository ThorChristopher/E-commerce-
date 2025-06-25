"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useStore, type Product } from "@/lib/store"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addToCart(product, 1)
      toast.success(`${product.name} added to cart!`, {
        description: "Item successfully added to your shopping cart",
      })
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const discountAmount = product.originalPrice - product.price
  const discountPercentage = Math.round((discountAmount / product.originalPrice) * 100)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col bg-white">
      <CardContent className="p-0 flex-1">
        <div className="relative">
          <Link href={`/product/${product.id}`}>
            <div className="aspect-square overflow-hidden bg-gray-50">
              <img
                src={product.image || "/placeholder.svg?height=400&width=400&text=Gaming+Product"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </Link>

          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg">
              -{discountPercentage}% OFF
            </Badge>
          )}

          {!product.inStock && (
            <Badge className="absolute top-3 right-3 bg-gray-500 text-white shadow-lg">Out of Stock</Badge>
          )}

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg" asChild>
              <Link href={`/product/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <Badge variant="outline" className="text-xs mb-2 font-medium">
              {product.brand}
            </Badge>

            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors mb-2 leading-tight">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews})</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {product.originalPrice > product.price && (
              <p className="text-sm text-green-600 font-medium">Save ${discountAmount.toFixed(2)}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? `${product.stockCount} in stock` : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} disabled={!product.inStock || isLoading} className="w-full" size="lg">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
