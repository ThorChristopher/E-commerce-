"use client"

import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"

interface ProductGridProps {
  featured?: boolean
  limit?: number
}

export function ProductGrid({ featured = false, limit }: ProductGridProps) {
  const { products, searchQuery } = useStore()

  let filteredProducts = products

  console.log("ProductGrid - Total products:", products.length)
  console.log("ProductGrid - Filtered products:", filteredProducts.length)

  if (featured) {
    filteredProducts = products.filter((product) => product.featured)
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit)
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground text-lg">
            {searchQuery ? `No results for "${searchQuery}"` : "No products available at the moment"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-yellow-100 rounded">
          <p>
            Debug: Showing {filteredProducts.length} of {products.length} total products
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
