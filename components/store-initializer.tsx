"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

export function StoreInitializer() {
  const { initializeStore, isInitialized, isLoading } = useStore()

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeStore()
    }
  }, [initializeStore, isInitialized, isLoading])

  return null
}
