"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

export function ForceRefresh() {
  const { products } = useStore()

  useEffect(() => {
    // Force a re-render when products change
    console.log(`Loaded ${products.length} products`)
  }, [products])

  return null
}
