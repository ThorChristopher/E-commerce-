"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  images: string[]
  rating: number
  reviews: number
  brand: string
  category: string
  description: string
  specifications: string[]
  inStock: boolean
  stockCount: number
  featured: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  items: CartItem[]
  total: number
  status: "pending" | "approved" | "rejected" | "shipped" | "delivered"
  paymentMethod: string
  paymentProof?: string
  orderDate: string
  trackingNumber?: string
}

export interface Review {
  id: string
  productId: string
  user: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  productId?: string
  timestamp: string
  details?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  password: string
  joinDate: string
  lastLogin: string
  isActive: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  type: "paypal" | "cashapp" | "venmo" | "zelle"
  email?: string
  handle?: string
  qrCode?: string
  status: "active" | "inactive"
  description?: string
}

interface StoreState {
  // Data
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  reviews: Review[]
  users: User[]
  userActivities: UserActivity[]
  currentUser: User | null
  paymentMethods: PaymentMethod[]
  searchQuery: string
  isAdmin: boolean

  // Loading states
  isLoading: boolean
  isInitialized: boolean

  // Initialize store
  initializeStore: () => Promise<void>

  // Products
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Cart
  addToCart: (product: Product, quantity: number) => void
  updateCartQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void

  // Orders
  addOrder: (order: Omit<Order, "id" | "orderDate">) => string
  updateOrderStatus: (id: string, status: Order["status"]) => void

  // Reviews
  addReview: (review: Omit<Review, "id" | "date" | "helpful">) => void

  // Users - Updated with proper authentication
  registerUser: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<{ success: boolean; message: string; user?: User }>
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>
  logoutUser: () => void
  checkEmailExists: (email: string) => boolean
  updateUserLastLogin: (userId: string) => void

  // Payment Methods
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void
  deletePaymentMethod: (id: string) => void
  getActivePaymentMethods: () => PaymentMethod[]

  // Utilities
  setSearchQuery: (query: string) => void
  setIsAdmin: (isAdmin: boolean) => void
  addActivity: (activity: Omit<UserActivity, "id" | "timestamp">) => void

  // Sync functions
  syncToServer: () => Promise<void>
  loadFromServer: () => Promise<void>
}

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silently fail
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  },
}

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
  // Simple hash for demo - use bcrypt in production
  return btoa(password + "salt_key_thorpchristopher")
}

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword
}

// Default sample data
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "PlayStation 5 Console",
    price: 499.99,
    originalPrice: 499.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop"],
    rating: 4.8,
    reviews: 1250,
    brand: "Sony",
    category: "Gaming Consoles",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio.",
    specifications: ["Ultra-high speed SSD", "Ray Tracing", "4K Gaming", "3D Audio"],
    inStock: true,
    stockCount: 15,
    featured: true,
  },
  {
    id: "2",
    name: "Xbox Series X",
    price: 499.99,
    originalPrice: 499.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop"],
    rating: 4.7,
    reviews: 980,
    brand: "Microsoft",
    category: "Gaming Consoles",
    description: "The fastest, most powerful Xbox ever. Experience next-gen speed and performance with Xbox Series X.",
    specifications: ["12 TFLOPS GPU", "16GB GDDR6 RAM", "1TB NVMe SSD", "4K Gaming"],
    inStock: true,
    stockCount: 12,
    featured: true,
  },
  {
    id: "3",
    name: "NVIDIA RTX 4080 Graphics Card",
    price: 1199.99,
    originalPrice: 1599.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop"],
    rating: 4.9,
    reviews: 567,
    brand: "NVIDIA",
    category: "Graphics Cards",
    description:
      "The ultimate GeForce RTX 40 Series experience. Get equipped for stellar gaming and creating with NVIDIA RTX 4080.",
    specifications: ["16GB GDDR6X", "Ray Tracing", "DLSS 3", "AV1 Encoding"],
    inStock: true,
    stockCount: 8,
    featured: true,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      cart: [],
      orders: [],
      reviews: [],
      users: [],
      userActivities: [],
      currentUser: null,
      paymentMethods: [],
      searchQuery: "",
      isAdmin: false,
      isLoading: false,
      isInitialized: false,

      // Initialize store with timeout protection
      initializeStore: async () => {
        if (get().isInitialized) return

        set({ isLoading: true })

        try {
          // Try to load from server with timeout
          const loadPromise = get().loadFromServer()
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Load timeout")), 5000))

          await Promise.race([loadPromise, timeoutPromise])
        } catch (error) {
          console.warn("Failed to load from server, using default data:", error)

          // Use default data if server fails
          set({
            products: defaultProducts,
            paymentMethods: [
              {
                id: "1",
                name: "PayPal",
                type: "paypal",
                email: "payments@thorpchristopher.com",
                status: "active",
                description: "Pay securely with PayPal",
              },
            ],
          })
        } finally {
          set({ isInitialized: true, isLoading: false })
        }
      },

      // Load data from server with error handling
      loadFromServer: async () => {
        try {
          // Load products
          try {
            const productsRes = await fetch("/api/products", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            })
            if (productsRes.ok) {
              const products = await productsRes.json()
              if (Array.isArray(products) && products.length > 0) {
                set({ products })
              } else {
                set({ products: defaultProducts })
              }
            } else {
              set({ products: defaultProducts })
            }
          } catch (error) {
            console.warn("Failed to load products:", error)
            set({ products: defaultProducts })
          }

          // Load other data with similar error handling
          try {
            const ordersRes = await fetch("/api/orders")
            if (ordersRes.ok) {
              const orders = await ordersRes.json()
              set({ orders: Array.isArray(orders) ? orders : [] })
            }
          } catch (error) {
            console.warn("Failed to load orders:", error)
          }

          try {
            const usersRes = await fetch("/api/users")
            if (usersRes.ok) {
              const users = await usersRes.json()
              set({ users: Array.isArray(users) ? users : [] })
            }
          } catch (error) {
            console.warn("Failed to load users:", error)
          }

          try {
            const settingsRes = await fetch("/api/settings")
            if (settingsRes.ok) {
              const settings = await settingsRes.json()
              set({ paymentMethods: settings.paymentMethods || [] })
            }
          } catch (error) {
            console.warn("Failed to load settings:", error)
          }
        } catch (error) {
          console.error("Failed to load from server:", error)
          throw error
        }
      },

      // Sync to server
      syncToServer: async () => {
        try {
          const state = get()

          // Sync products
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "bulk_update", products: state.products }),
          })

          // Sync orders
          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "bulk_update", orders: state.orders }),
          })

          // Sync users
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "bulk_update", users: state.users }),
          })

          // Sync settings
          await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "bulk_update", settings: { paymentMethods: state.paymentMethods } }),
          })
        } catch (error) {
          console.error("Failed to sync to server:", error)
        }
      },

      // Products
      addProduct: (product) =>
        set((state) => {
          const newProduct = { ...product, id: Date.now().toString() }
          const newProducts = [...state.products, newProduct]

          // Sync to server
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "add", product: newProduct }),
          }).catch(console.error)

          return { products: newProducts }
        }),

      updateProduct: (id, product) =>
        set((state) => {
          const newProducts = state.products.map((p) => (p.id === id ? { ...p, ...product } : p))

          // Sync to server
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", productId: id, product }),
          }).catch(console.error)

          return { products: newProducts }
        }),

      deleteProduct: (id) =>
        set((state) => {
          const newProducts = state.products.filter((p) => p.id !== id)

          // Sync to server
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", productId: id }),
          }).catch(console.error)

          return { products: newProducts }
        }),

      // Cart
      addToCart: (product, quantity) =>
        set((state) => {
          if (state.currentUser) {
            state.userActivities.push({
              id: Date.now().toString(),
              userId: state.currentUser.id,
              action: "add_to_cart",
              productId: product.id,
              timestamp: new Date().toISOString(),
              details: `Added ${quantity}x ${product.name} to cart`,
            })
          }

          const existingItem = state.cart.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            }
          }
          return {
            cart: [
              ...state.cart,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
              },
            ],
          }
        }),

      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cart:
            quantity === 0
              ? state.cart.filter((item) => item.id !== id)
              : state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      // Orders
      addOrder: (order) => {
        const orderId = `ORD-${Date.now()}`
        const newOrder = {
          ...order,
          id: orderId,
          orderDate: new Date().toISOString().split("T")[0],
        }

        set((state) => ({ orders: [...state.orders, newOrder] }))

        // Sync to server
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", order: newOrder }),
        }).catch(console.error)

        return orderId
      },

      updateOrderStatus: (id, status) =>
        set((state) => {
          const newOrders = state.orders.map((order) => (order.id === id ? { ...order, status } : order))

          // Sync to server
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update_status", orderId: id, status }),
          }).catch(console.error)

          return { orders: newOrders }
        }),

      // Reviews
      addReview: (review) =>
        set((state) => ({
          reviews: [
            ...state.reviews,
            {
              ...review,
              id: Date.now().toString(),
              date: new Date().toISOString().split("T")[0],
              helpful: 0,
            },
          ],
        })),

      // Users - Updated with proper authentication
      checkEmailExists: (email) => {
        const state = get()
        return state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())
      },

      registerUser: async (userData) => {
        const state = get()

        // Check if email already exists
        if (state.checkEmailExists(userData.email)) {
          return {
            success: false,
            message: "An account with this email already exists. Please use a different email or try logging in.",
          }
        }

        // Validate password strength
        if (userData.password.length < 6) {
          return {
            success: false,
            message: "Password must be at least 6 characters long.",
          }
        }

        // Create new user
        const newUser: User = {
          id: `USR-${Date.now()}`,
          email: userData.email.toLowerCase(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: hashPassword(userData.password),
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
        }

        // Add user to store
        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }))

        // Add activity
        get().addActivity({
          userId: newUser.id,
          action: "register",
          details: "User registered successfully",
        })

        // Sync to server
        try {
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "register", user: newUser }),
          })
        } catch (error) {
          console.error("Failed to sync user registration:", error)
        }

        return {
          success: true,
          message: "Account created successfully! Welcome to Thorp Christopher.",
          user: newUser,
        }
      },

      loginUser: async (email, password) => {
        const state = get()

        // Find user by email
        const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase())

        if (!user) {
          return {
            success: false,
            message: "No account found with this email address. Please sign up first.",
          }
        }

        // Verify password
        if (!verifyPassword(password, user.password)) {
          return {
            success: false,
            message: "Incorrect password. Please try again.",
          }
        }

        // Check if user is active
        if (!user.isActive) {
          return {
            success: false,
            message: "Your account has been deactivated. Please contact support.",
          }
        }

        // Update last login
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString(),
        }

        // Update user in store
        set((state) => ({
          users: state.users.map((u) => (u.id === user.id ? updatedUser : u)),
          currentUser: updatedUser,
        }))

        // Add activity
        get().addActivity({
          userId: user.id,
          action: "login",
          details: "User logged in successfully",
        })

        // Sync to server
        try {
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "login", email, userId: user.id }),
          })
        } catch (error) {
          console.error("Failed to sync user login:", error)
        }

        return {
          success: true,
          message: `Welcome back, ${user.firstName}!`,
          user: updatedUser,
        }
      },

      logoutUser: () => {
        const state = get()
        if (state.currentUser) {
          get().addActivity({
            userId: state.currentUser.id,
            action: "logout",
            details: "User logged out",
          })
        }
        set({ currentUser: null })
      },

      updateUserLastLogin: (userId) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, lastLogin: new Date().toISOString() } : user,
          ),
        })),

      // Payment Methods
      addPaymentMethod: (method) =>
        set((state) => {
          const newMethod = { ...method, id: Date.now().toString() }
          const newPaymentMethods = [...state.paymentMethods, newMethod]

          // Sync to server
          fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "add_payment_method", paymentMethod: newMethod }),
          }).catch(console.error)

          return { paymentMethods: newPaymentMethods }
        }),

      updatePaymentMethod: (id, method) =>
        set((state) => {
          const newPaymentMethods = state.paymentMethods.map((p) => (p.id === id ? { ...p, ...method } : p))

          // Sync to server
          fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update_payment_method", paymentMethodId: id, paymentMethod: method }),
          }).catch(console.error)

          return { paymentMethods: newPaymentMethods }
        }),

      deletePaymentMethod: (id) =>
        set((state) => {
          const newPaymentMethods = state.paymentMethods.filter((p) => p.id !== id)

          // Sync to server
          fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete_payment_method", paymentMethodId: id }),
          }).catch(console.error)

          return { paymentMethods: newPaymentMethods }
        }),

      getActivePaymentMethods: () => {
        const state = get()
        return state.paymentMethods.filter((method) => method.status === "active")
      },

      // Utilities
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      addActivity: (activity) =>
        set((state) => ({
          userActivities: [
            ...state.userActivities,
            {
              ...activity,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
    }),
    {
      name: "thorp-christopher-store-v8",
      version: 1,
      storage: {
        getItem: (name) => safeLocalStorage.getItem(name),
        setItem: (name, value) => safeLocalStorage.setItem(name, value),
        removeItem: (name) => safeLocalStorage.removeItem(name),
      },
      // Persist user session across refreshes
      partialize: (state) => ({
        currentUser: state.currentUser,
        cart: state.cart,
        users: state.users,
        products: state.products,
        orders: state.orders,
        paymentMethods: state.paymentMethods,
      }),
    },
  ),
)
