import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const orders = await db.getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, order, orderId, status, orders } = body

    switch (action) {
      case "add":
        const newOrder = await db.createOrder(order)
        return NextResponse.json({ success: true, order: newOrder })

      case "update_status":
        const updatedOrder = await db.prisma.order.update({
          where: { id: orderId },
          data: { status },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })
        return NextResponse.json({ success: true, order: updatedOrder })

      case "bulk_update":
        const savedOrders = await db.saveOrders(orders)
        return NextResponse.json({ success: true, orders: savedOrders })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating orders:", error)
    return NextResponse.json({ error: "Failed to update orders" }, { status: 500 })
  }
}
