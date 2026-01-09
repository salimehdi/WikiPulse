import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WikiPulse | AI-Powered Wikipedia Event Detection & Forensics",
  description: "An automated early warning system that detects real-world events 1-3 days before mainstream news. WikiPulse leverages machine learning and spectral forensics to analyze anomalous Wikipedia traffic patterns across public health, finance, and technology sectors.",
  keywords: [
    "Wikipedia Traffic Analysis",
    "Event Detection",
    "Traffic Forensics",
    "Anomaly Detection",
    "Machine Learning",
    "Public Health Monitoring",
    "Benford's Law",
    "Time Series Analysis",
    "Open Source Intelligence"
  ],
  openGraph: {
    title: "WikiPulse - Detect Emerging Events via Wikipedia Traffic",
    description: "Monitor, verify, and alert on global events using advanced traffic forensics and machine learning.",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
