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
    const { action, user, email, users } = body

    switch (action) {
      case "add":
        const newUser = await db.createUser(user)
        return NextResponse.json({ success: true, user: newUser })

      case "login":
        const existingUser = await db.prisma.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          const updatedUser = await db.updateUser(existingUser.id, {
            lastLogin: new Date(),
          })
          return NextResponse.json({ success: true, user: updatedUser })
        } else {
          // Create new user if doesn't exist
          const newUser = await db.createUser({
            email,
            name: email.split("@")[0], // Use email prefix as name
            lastLogin: new Date(),
          })
          return NextResponse.json({ success: true, user: newUser })
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
