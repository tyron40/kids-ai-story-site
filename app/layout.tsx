import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./styles/mobile.css"
import Provider from "./provider"
import { Nunito } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

const MyAppFont = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kidso Story - Create Magical Stories",
  description: "Turn your child's imagination into magical stories instantly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kidso Story"
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className={`${MyAppFont.className} bg-white min-h-full no-touch-callout no-tap-highlight smooth-scroll`}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
