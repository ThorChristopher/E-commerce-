"use client"

import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const { isLoading, isInitialized } = useStore()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Auto-hide loading screen after 3 seconds max
    const timeout = setTimeout(() => {
      setShowLoading(false)
      // Force store to be initialized if it's taking too long
      if (!isInitialized) {
        useStore.setState({ isInitialized: true, isLoading: false })
      }
    }, 3000)

    // Hide loading screen when store is ready
    if (isInitialized && !isLoading) {
      setShowLoading(false)
      clearTimeout(timeout)
    }

    return () => clearTimeout(timeout)
  }, [isInitialized, isLoading])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Thorp Christopher...</h2>
        <p className="text-gray-600">Setting up your gaming experience</p>
      </div>
    </div>
  )
}
