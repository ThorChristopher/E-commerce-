"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { useStore } from "@/lib/store"

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, setIsAdmin } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Check admin authentication only on client side
    const checkAdminAuth = () => {
      try {
        const adminAuth = localStorage.getItem("admin_authenticated")
        if (!adminAuth && !isAdmin) {
          router.push("/secret-admin-access")
        } else if (adminAuth && !isAdmin) {
          setIsAdmin(true)
        }
      } catch (error) {
        // Handle localStorage access error
        console.error("Error accessing localStorage:", error)
        router.push("/secret-admin-access")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAuth()
  }, [isAdmin, router, setIsAdmin])

  // Show loading state during SSR and initial client load
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Check authentication after client-side hydration
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to admin login...</p>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
