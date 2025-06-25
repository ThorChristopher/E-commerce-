"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"

export function StoreInitializer() {
  const { initializeStore, isInitialized, isLoading } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isInitialized) {
      // Add timeout to prevent infinite loading
      const initTimeout = setTimeout(() => {
        initializeStore().catch((error) => {
          console.error("Store initialization failed:", error)
          // Force initialization to complete even if it fails
          useStore.setState({ isInitialized: true, isLoading: false })
        })
      }, 100)

      return () => clearTimeout(initTimeout)
    }
  }, [mounted, isInitialized, initializeStore])

  // Don't render anything, this is just for initialization
  return null
}
