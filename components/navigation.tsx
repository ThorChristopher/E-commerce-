"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import { Logo } from "@/components/logo"

export function Navigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const { cart, setSearchQuery, currentUser, logoutUser, addActivity } = useStore()

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    router.push("/products")
    setIsMenuOpen(false)
  }

  const handleCartClick = () => {
    if (!currentUser) {
      toast.error("Please login to access your cart")
      router.push("/login")
      return
    }

    addActivity({
      userId: currentUser.id,
      action: "view_cart",
      details: "Accessed shopping cart",
    })
    router.push("/cart")
  }

  const handleLogout = () => {
    if (currentUser) {
      addActivity({
        userId: currentUser.id,
        action: "logout",
        details: "User logged out from navigation",
      })
    }
    logoutUser()
    toast.success("Logged out successfully")
    router.push("/")
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary transition-colors font-medium">
              All Products
            </Link>
            <Link href="/deals" className="hover:text-primary transition-colors font-medium">
              Hot Deals
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search gaming products..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account" className="font-medium">
                    <User className="h-5 w-5 mr-2" />
                    {currentUser.firstName}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="font-medium">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" onClick={handleCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 bg-white">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-gray-50"
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Link
                href="/"
                className="hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/deals"
                className="hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hot Deals
              </Link>

              {currentUser ? (
                <>
                  <Link
                    href="/account"
                    className="hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start p-0 h-auto font-medium"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
