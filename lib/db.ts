import { prisma } from "./prisma"
import type { Product, User } from "@prisma/client"

// Sample data for seeding
const sampleProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.5,
    reviews: 128,
    brand: "AudioTech",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    specifications: ["Bluetooth 5.0", "30-hour battery", "Active noise cancellation", "Quick charge"],
    inStock: true,
    stockCount: 50,
    featured: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: "Wearables",
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.3,
    reviews: 89,
    brand: "FitTech",
    description: "Advanced fitness tracking with heart rate monitor and GPS.",
    specifications: ["Heart rate monitor", "GPS tracking", "Water resistant", "7-day battery"],
    inStock: true,
    stockCount: 30,
    featured: true,
  },
]

const sampleSettings = {
  siteName: "ThorChristopher E-commerce",
  currency: "USD",
  paymentMethods: [
    { id: "stripe", name: "Stripe", enabled: true },
    { id: "paypal", name: "PayPal", enabled: false },
  ],
}

class Database {
  async getProducts(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      })

      // If no products exist, seed the database
      if (products.length === 0) {
        await this.seedProducts()
        return await prisma.product.findMany({
          orderBy: { createdAt: "desc" },
        })
      }

      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  }

  async saveProducts(products: any[]): Promise<Product[]> {
    try {
      // Delete all existing products
      await prisma.product.deleteMany()

      // Create new products
      const createdProducts = await Promise.all(
        products.map((product) =>
          prisma.product.create({
            data: {
              ...product,
              images: product.images || [product.image],
              specifications: product.specifications || [],
            },
          }),
        ),
      )

      return createdProducts
    } catch (error) {
      console.error("Error saving products:", error)
      throw error
    }
  }

  async getOrders(): Promise<any[]> {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      return orders
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  }

  async createOrder(orderData: any): Promise<any> {
    try {
      const order = await prisma.order.create({
        data: {
          userEmail: orderData.userEmail,
          userName: orderData.userName,
          status: orderData.status || "pending",
          total: orderData.total,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          items: {
            create:
              orderData.items?.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })) || [],
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return order
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  async saveOrders(orders: any[]): Promise<any[]> {
    try {
      // This is a simplified version - in practice you'd want more sophisticated bulk operations
      const savedOrders = []

      for (const order of orders) {
        if (order.id) {
          // Update existing order
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: order.status,
              total: order.total,
              shippingAddress: order.shippingAddress,
              paymentMethod: order.paymentMethod,
            },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          })
          savedOrders.push(updated)
        } else {
          // Create new order
          const created = await this.createOrder(order)
          savedOrders.push(created)
        }
      }

      return savedOrders
    } catch (error) {
      console.error("Error saving orders:", error)
      throw error
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  async saveUsers(users: any[]): Promise<User[]> {
    try {
      // Delete all existing users
      await prisma.user.deleteMany()

      // Create new users
      const createdUsers = await Promise.all(
        users.map((user) =>
          prisma.user.create({
            data: user,
          }),
        ),
      )

      return createdUsers
    } catch (error) {
      console.error("Error saving users:", error)
      throw error
    }
  }

  async getSettings(): Promise<any> {
    try {
      const settings = await prisma.settings.findMany()

      // If no settings exist, seed with defaults
      if (settings.length === 0) {
        await this.seedSettings()
        return await this.getSettings()
      }

      // Convert settings array to object
      const settingsObj: any = {}
      for (const setting of settings) {
        try {
          settingsObj[setting.key] = JSON.parse(setting.value)
        } catch {
          settingsObj[setting.key] = setting.value
        }
      }

      return settingsObj
    } catch (error) {
      console.error("Error fetching settings:", error)
      return sampleSettings
    }
  }

  async saveSettings(settings: any): Promise<any> {
    try {
      // Delete all existing settings
      await prisma.settings.deleteMany()

      // Create new settings
      for (const [key, value] of Object.entries(settings)) {
        await prisma.settings.create({
          data: {
            key,
            value: typeof value === "string" ? value : JSON.stringify(value),
          },
        })
      }

      return settings
    } catch (error) {
      console.error("Error saving settings:", error)
      throw error
    }
  }

  private async seedProducts(): Promise<void> {
    try {
      await Promise.all(
        sampleProducts.map((product) =>
          prisma.product.create({
            data: {
              ...product,
              images: product.images || [product.image],
              specifications: product.specifications || [],
            },
          }),
        ),
      )
    } catch (error) {
      console.error("Error seeding products:", error)
    }
  }

  private async seedSettings(): Promise<void> {
    try {
      for (const [key, value] of Object.entries(sampleSettings)) {
        await prisma.settings.create({
          data: {
            key,
            value: typeof value === "string" ? value : JSON.stringify(value),
          },
        })
      }
    } catch (error) {
      console.error("Error seeding settings:", error)
    }
  }

  // Expose prisma for direct access when needed
  get prisma() {
    return prisma
  }
}

export const db = new Database()
