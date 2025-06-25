"use client"

import { useStore } from "@/lib/store"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CategoryGrid() {
  const { categories } = useStore()
  const featuredCategories = categories.filter((cat) => cat.featured)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredCategories.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {category.productCount} Products
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
