import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { BottomNav } from "@/components/bottom-nav"
import { TopNav } from "@/components/top-nav"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

// Exported separately per Next.js 14+ requirements
// viewport-fit=cover is CRITICAL for env(safe-area-inset-*) to work on iOS
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#E07B39',
}

export const metadata: Metadata = {
  title: "Curry&Burger - Taste the Fusion!",
  description: "Delicious fusion of curry and burger. Order now for pickup or delivery!",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Curry&Burger",
  },
  openGraph: {
    type: "website",
    title: "Curry&Burger - Taste the Fusion!",
    description: "Delicious fusion of curry and burger. Order now for pickup or delivery!",
    siteName: "Curry&Burger",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Curry&Burger Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Curry&Burger - Taste the Fusion!",
    description: "Delicious fusion of curry and burger. Order now for pickup or delivery!",
    images: ["/icon-512.png"],
  },
}

import { SafeHeader } from "@/components/safe-header"
import { NativeBridge } from "@/components/native-bridge"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <head>
        {/*
         * Hardcoded viewport meta — Capacitor's WKWebView can miss the
         * Next.js metadata-generated tag. viewport-fit=cover is REQUIRED
         * for env(safe-area-inset-*) to produce non-zero values on iOS.
         */}
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </head>
      <body className="font-sans bg-white text-foreground antialiased relative min-h-screen">
        <AuthProvider>
          <CartProvider>
            <NativeBridge />
            {/*
              SafeHeader: Wraps TopNav with a guaranteed status bar spacer.
              Position fixed, solid background.
            */}
            <SafeHeader />
            {/*
              Main scroll container — uses native body scrolling.
              padding-top = header height (approx 100px)
              padding-bottom = bottom nav height (approx 90px)
            */}
            <main
              className="w-full relative"
              style={{ 
                paddingTop: 'calc(max(44px, var(--safe-top, 44px)) + 56px)',
                paddingBottom: 'calc(max(34px, var(--safe-bottom, 34px)) + 80px)' 
              }}
            >
              {children}
            </main>
            {/* BottomNav is position:fixed internally */}
            <BottomNav />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
