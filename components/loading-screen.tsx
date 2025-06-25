"use client"

import { useStore } from "@/lib/store"

export function LoadingScreen() {
  const { isLoading, isInitialized } = useStore()

  if (isInitialized || !isLoading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading Thorp Christopher...</p>
        <p className="text-sm text-muted-foreground">Setting up your gaming experience</p>
      </div>
    </div>
  )
}
