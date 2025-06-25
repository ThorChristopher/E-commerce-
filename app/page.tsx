"use client"

import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { FeaturedDeals } from "@/components/featured-deals"
import { Newsletter } from "@/components/newsletter"
import { TrustBadges } from "@/components/trust-badges"
import { useStore } from "@/lib/store"
import { ProductDebug } from "@/components/product-debug"

export default function HomePage() {
  const { products } = useStore()

  console.log("Homepage products count:", products.length)

  return (
    <div className="min-h-screen bg-background">
      <ProductDebug />
      <HeroSection />

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Gaming Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the latest gaming consoles, high-performance PCs, and premium accessories at unbeatable prices
            </p>
          </div>
          <FeaturedDeals />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">All Gaming Products</h2>
          <p className="text-xl text-muted-foreground">
            From PlayStation 5 to RTX 4080 - Everything you need for the ultimate gaming experience
          </p>
        </div>
        <ProductGrid />
      </section>

      <TrustBadges />
      <Newsletter />
    </div>
  )
}
