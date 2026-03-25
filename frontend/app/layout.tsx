import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Aperio | Intelligent Traceability Management",
  description:
    "Track every gram. Trust every chain. Intelligent traceability for recycled plastic materials — from collection to dispatch.",
  keywords: [
    "traceability",
    "recycling",
    "plastic",
    "sustainability",
    "carbon footprint",
    "supply chain",
  ],
}

export const viewport: Viewport = {
  themeColor: "#0a0f0d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-tf-bg-primary text-tf-text-primary`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
