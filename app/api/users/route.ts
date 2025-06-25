import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const users = await db.getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, user, email, userId, users } = body

    switch (action) {
      case "register":
        // Create new user in database
        try {
          const newUser = await db.prisma.user.create({
            data: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password: user.password,
              isActive: user.isActive,
            },
          })
          return NextResponse.json({ success: true, user: newUser })
        } catch (error: any) {
          if (error.code === "P2002") {
            // Unique constraint violation
            return NextResponse.json(
              { success: false, message: "An account with this email already exists" },
              { status: 400 },
            )
          }
          throw error
        }

      case "login":
        // Update last login time
        try {
          const updatedUser = await db.prisma.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
          })
          return NextResponse.json({ success: true, user: updatedUser })
        } catch (error) {
          console.error("Error updating last login:", error)
          return NextResponse.json({ success: true }) // Don't fail login if update fails
        }

      case "bulk_update":
        const savedUsers = await db.saveUsers(users)
        return NextResponse.json({ success: true, users: savedUsers })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating users:", error)
    return NextResponse.json({ error: "Failed to update users" }, { status: 500 })
  }
}
