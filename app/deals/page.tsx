"use client"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, Zap } from "lucide-react"
import { useStore } from "@/lib/store"

export default function DealsPage() {
  const { products } = useStore()

  const dealsProducts = products.filter((product) => product.discount > 0)
  const totalSavings = dealsProducts.reduce((sum, product) => sum + (product.originalPrice - product.price), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold">Hot Deals & Discounts</h1>
          <Flame className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Save big on premium gaming products with our exclusive deals and limited-time offers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 text-center">
          <Zap className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{dealsProducts.length}</h3>
          <p>Products on Sale</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 text-center">
          <Badge className="h-8 w-8 mx-auto mb-2 bg-white text-green-500" />
          <h3 className="text-2xl font-bold">${totalSavings.toFixed(0)}</h3>
          <p>Total Savings Available</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">Limited</h3>
          <p>Time Offers</p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">All Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dealsProducts.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-red-500 text-white font-bold animate-pulse">
                  SAVE ${(product.originalPrice - product.price).toFixed(0)}
                </Badge>
              </div>
              <div className="border-2 border-red-200 rounded-lg overflow-hidden">
                {/* Use existing ProductCard component */}
                <div className="p-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
