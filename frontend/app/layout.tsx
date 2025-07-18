import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import GoogleTranslateWidget from "../components/GoogleTranslateWidget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waste Samaritan - Citizen & Collector Engagement Platform",
  description:
    "Transforming waste management through digital engagement. Connect citizens, collectors, and administrators for responsible waste management.",
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
        {children}
        <Toaster />
            <GoogleTranslateWidget />
      </body>
    </html>
  )
}
