"use client"

import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FeaturedDeals() {
  const { products } = useStore()

  // Get products with highest discounts
  const dealsProducts = products
    .filter((product) => product.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealsProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/deals">View All Deals</Link>
        </Button>
      </div>
    </div>
  )
}
