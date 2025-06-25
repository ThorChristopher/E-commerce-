"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProductDebug() {
  const { products } = useStore()

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Products loaded: {products.length}</p>
        <p className="text-sm mb-2">Expected: 30 products</p>
        <Button onClick={clearStorage} size="sm" variant="outline">
          Clear Cache & Reload
        </Button>
      </CardContent>
    </Card>
  )
}
