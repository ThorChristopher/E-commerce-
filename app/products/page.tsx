"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { useStore } from "@/lib/store"
import { ProductDebug } from "@/components/product-debug"

export default function ProductsPage() {
  const { products, searchQuery, setSearchQuery } = useStore()
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = () => {
    setSearchQuery(localSearch)
  }

  const brands = [...new Set(products.map((p) => p.brand))].sort()

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDebug />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">All Gaming Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our complete collection of gaming consoles, PCs, accessories, and more
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-100">Under $100</SelectItem>
              <SelectItem value="100-500">$100 - $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="1000+">$1,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Popular Brands:</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Button key={brand} variant="outline" size="sm">
                {brand}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {products.length} products
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Product Grid */}
      <ProductGrid />
    </div>
  )
}
