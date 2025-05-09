import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./styles/mobile.css"
import Provider from "./provider"
import { Nunito } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ReactNode } from "react"

const MyAppFont = Nunito({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: "Kidso Story - Create Magical Stories",
  description: "Turn your child's imagination into magical stories instantly",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kidso Story",
    startupImage: [
      {
        url: "/splash/launch.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      }
    ]
  },
  applicationName: "Kidso Story",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  manifest: "/manifest.json",
  icons: {
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180" }
    ]
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light dark"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html 
        lang="en" 
        className={`${MyAppFont.variable} h-full no-touch-callout`}
      >
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="format-detection" content="date=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="format-detection" content="email=no" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        </head>
        <body 
          className={`${MyAppFont.className} bg-white min-h-full no-touch-callout no-tap-highlight smooth-scroll`}
        >
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
