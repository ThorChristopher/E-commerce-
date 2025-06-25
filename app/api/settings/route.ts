import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const settings = await db.getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, paymentMethod, paymentMethodId, settings } = body

    let currentSettings = await db.getSettings()

    switch (action) {
      case "add_payment_method":
        if (!currentSettings.paymentMethods) {
          currentSettings.paymentMethods = []
        }
        currentSettings.paymentMethods.push(paymentMethod)
        break

      case "update_payment_method":
        if (currentSettings.paymentMethods) {
          currentSettings.paymentMethods = currentSettings.paymentMethods.map((pm: any) =>
            pm.id === paymentMethodId ? { ...pm, ...paymentMethod } : pm,
          )
        }
        break

      case "delete_payment_method":
        if (currentSettings.paymentMethods) {
          currentSettings.paymentMethods = currentSettings.paymentMethods.filter((pm: any) => pm.id !== paymentMethodId)
        }
        break

      case "bulk_update":
        currentSettings = settings
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const savedSettings = await db.saveSettings(currentSettings)
    return NextResponse.json({ success: true, settings: savedSettings })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
