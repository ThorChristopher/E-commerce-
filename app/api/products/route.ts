import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const products = await db.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, product, productId, products } = body

    switch (action) {
      case "add":
        const newProduct = await db.prisma.product.create({
          data: {
            ...product,
          },
        })
        const allProducts = await db.getProducts()
        return NextResponse.json({ success: true, products: allProducts })

      case "update":
        await db.prisma.product.update({
          where: { id: productId },
          data: product,
        })
        const updatedProducts = await db.getProducts()
        return NextResponse.json({ success: true, products: updatedProducts })

      case "delete":
        await db.prisma.product.delete({
          where: { id: productId },
        })
        const remainingProducts = await db.getProducts()
        return NextResponse.json({ success: true, products: remainingProducts })

      case "bulk_update":
        const savedProducts = await db.saveProducts(products)
        return NextResponse.json({ success: true, products: savedProducts })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating products:", error)
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 })
  }
}
