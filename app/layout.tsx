import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import { StoreInitializer } from "@/components/store-initializer"
import { LoadingScreen } from "@/components/loading-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Thorp Christopher - Premium Gaming Gear",
  description: "Discover the latest gaming consoles, graphics cards, peripherals and accessories at unbeatable prices.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreInitializer />
        <LoadingScreen />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
