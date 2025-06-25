import { prisma } from "./prisma"

// Default data for seeding
const defaultProducts = [
  {
    name: "Sony PlayStation 5 Console",
    price: 499.99,
    originalPrice: 599.99,
    discount: 17,
    category: "gaming-consoles",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&h=500&fit=crop&crop=center",
    ],
    rating: 4.9,
    reviews: 2847,
    brand: "Sony",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio.",
    specifications: [
      "CPU: AMD Zen 2-based CPU with 8 cores at 3.5GHz",
      "GPU: 10.28 TFLOPs, 36 CUs at 2.23GHz",
      "Memory: 16GB GDDR6/256-bit",
      "Storage: 825GB SSD",
      "Optical Drive: 4K UHD Blu-ray",
      "Audio: Tempest 3D AudioTech",
    ],
    inStock: true,
    stockCount: 25,
    featured: true,
  },
  {
    name: "Microsoft Xbox Series X Console",
    price: 449.99,
    originalPrice: 499.99,
    discount: 10,
    category: "gaming-consoles",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop&crop=center",
    images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop&crop=center"],
    rating: 4.8,
    reviews: 1923,
    brand: "Microsoft",
    description: "The fastest, most powerful Xbox ever. Experience next-gen speed and performance with Xbox Series X.",
    specifications: [
      "CPU: AMD Zen 2 8-core at 3.8GHz",
      "GPU: 12 TFLOPs AMD RDNA 2",
      "Memory: 16GB GDDR6",
      "Storage: 1TB NVMe SSD",
      "Optical Drive: 4K UHD Blu-ray",
      "Resolution: Up to 8K gaming",
    ],
    inStock: true,
    stockCount: 18,
    featured: true,
  },
  {
    name: "NVIDIA GeForce RTX 4080 Graphics Card",
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    category: "graphics-cards",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&crop=center",
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&crop=center"],
    rating: 4.8,
    reviews: 892,
    brand: "NVIDIA",
    description:
      "Experience next-generation gaming with the RTX 4080. Featuring advanced ray tracing and DLSS 3 technology.",
    specifications: [
      "CUDA Cores: 9728",
      "Base Clock: 2205 MHz",
      "Memory: 16GB GDDR6X",
      "Memory Interface: 256-bit",
      "Ray Tracing Cores: 76",
      "Tensor Cores: 304",
    ],
    inStock: true,
    stockCount: 15,
    featured: true,
  },
  {
    name: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    price: 129.99,
    originalPrice: 149.99,
    discount: 13,
    category: "gaming-mice",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&crop=center",
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&crop=center"],
    rating: 4.6,
    reviews: 567,
    brand: "Razer",
    description:
      "Engineered for esports with Focus Pro 30K Sensor, 90-hour battery life, and ultra-lightweight 63g design.",
    specifications: [
      "Sensor: Focus Pro 30K",
      "DPI: Up to 30,000",
      "Weight: 63g",
      "Battery Life: Up to 90 hours",
      "Connectivity: HyperSpeed Wireless",
      "Switches: Razer Optical Mouse Switches",
    ],
    inStock: true,
    stockCount: 78,
    featured: false,
  },
  {
    name: "SteelSeries Apex Pro TKL Gaming Keyboard",
    price: 179.99,
    originalPrice: 199.99,
    discount: 10,
    category: "gaming-keyboards",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center",
    images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center"],
    rating: 4.7,
    reviews: 423,
    brand: "SteelSeries",
    description:
      "World's fastest mechanical gaming keyboard with adjustable OmniPoint switches and per-key RGB illumination.",
    specifications: [
      "Switches: OmniPoint Adjustable",
      "Actuation: 0.4mm - 3.6mm",
      "Layout: Tenkeyless (87-key)",
      "Backlighting: Per-key RGB",
      "Connectivity: USB-C detachable",
      "Polling Rate: 1000Hz",
    ],
    inStock: true,
    stockCount: 34,
    featured: false,
  },
]

const defaultSettings = {
  paymentMethods: [
    {
      id: "1",
      name: "PayPal Business",
      type: "paypal",
      email: "admin@thorpchristopher.com",
      status: "active",
      description: "Primary PayPal account for receiving payments",
    },
    {
      id: "2",
      name: "Cash App",
      type: "cashapp",
      handle: "$ThorpChristopher",
      status: "active",
      description: "Cash App account for quick payments",
    },
  ],
}

// Database operations
export const db = {
  // Products
  async getProducts() {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      })

      // If no products exist, seed with default data
      if (products.length === 0) {
        await this.seedProducts()
        return await prisma.product.findMany({
          orderBy: { createdAt: "desc" },
        })
      }

      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  async saveProducts(products: any[]) {
    try {
      // Delete all existing products and create new ones
      await prisma.product.deleteMany()

      const productsToCreate = products.map((product) => ({
        ...product,
        id: undefined, // Let Prisma generate new UUIDs
      }))

      await prisma.product.createMany({
        data: productsToCreate,
      })

      return await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error saving products:", error)
      throw error
    }
  },

  async seedProducts() {
    try {
      await prisma.product.createMany({
        data: defaultProducts,
      })
    } catch (error) {
      console.error("Error seeding products:", error)
      throw error
    }
  },

  // Orders
  async getOrders() {
    try {
      return await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
      throw error
    }
  },

  async saveOrders(orders: any[]) {
    try {
      // This is a complex operation - for now, we'll handle individual order updates
      // In a real app, you'd want more granular control
      await prisma.order.deleteMany()

      for (const order of orders) {
        await prisma.order.create({
          data: {
            id: order.id,
            userEmail: order.userEmail,
            userName: order.userName,
            status: order.status,
            total: order.total,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            items: {
              create:
                order.items?.map((item: any) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })) || [],
            },
          },
        })
      }

      return await this.getOrders()
    } catch (error) {
      console.error("Error saving orders:", error)
      throw error
    }
  },

  async createOrder(orderData: any) {
    try {
      return await prisma.order.create({
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
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  },

  // Users
  async getUsers() {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  async saveUsers(users: any[]) {
    try {
      await prisma.user.deleteMany()

      const usersToCreate = users.map((user) => ({
        ...user,
        id: undefined, // Let Prisma generate new UUIDs
      }))

      await prisma.user.createMany({
        data: usersToCreate,
      })

      return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error saving users:", error)
      throw error
    }
  },

  async createUser(userData: any) {
    try {
      return await prisma.user.create({
        data: userData,
      })
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  async updateUser(userId: string, userData: any) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: userData,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },

  // Settings
  async getSettings() {
    try {
      const settings = await prisma.settings.findMany()

      // If no settings exist, seed with default data
      if (settings.length === 0) {
        await this.seedSettings()
        return await this.getSettings()
      }

      // Convert settings array back to object format
      const settingsObj: any = {}
      settings.forEach((setting) => {
        try {
          settingsObj[setting.key] = JSON.parse(setting.value)
        } catch {
          settingsObj[setting.key] = setting.value
        }
      })

      return settingsObj
    } catch (error) {
      console.error("Error fetching settings:", error)
      throw error
    }
  },

  async saveSettings(settingsObj: any) {
    try {
      // Delete existing settings
      await prisma.settings.deleteMany()

      // Convert object to key-value pairs
      const settingsArray = Object.entries(settingsObj).map(([key, value]) => ({
        key,
        value: typeof value === "string" ? value : JSON.stringify(value),
      }))

      await prisma.settings.createMany({
        data: settingsArray,
      })

      return settingsObj
    } catch (error) {
      console.error("Error saving settings:", error)
      throw error
    }
  },

  async seedSettings() {
    try {
      const settingsArray = Object.entries(defaultSettings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
      }))

      await prisma.settings.createMany({
        data: settingsArray,
      })
    } catch (error) {
      console.error("Error seeding settings:", error)
      throw error
    }
  },
}
