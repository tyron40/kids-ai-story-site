"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@nextui-org/button"
import { UserButton, useUser } from "@clerk/nextjs"

const MenuList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Create Story",
    path: "/create-story",
  },
  {
    name: "Explore Stories",
    path: "/explore",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
]

export default function Header() {
  const { isSignedIn } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)
  }, [])

  // Prevent body scroll when menu is open on iOS
  useEffect(() => {
    if (isIOS && typeof document !== 'undefined') {
      document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    }
    return () => {
      if (isIOS && typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [isMenuOpen, isIOS])

  return (
    <>
      {/* iOS status bar spacer */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 bg-white" 
        style={{ height: 'env(safe-area-inset-top)' }}
      />
      
      {/* Header */}
      <header 
        className="fixed left-0 right-0 z-40 bg-white border-b"
        style={{ 
          top: 'env(safe-area-inset-top)',
          WebkitBackdropFilter: 'saturate(180%) blur(5px)',
          backdropFilter: 'saturate(180%) blur(5px)',
        }}
      >
        {/* Main header content */}
        <div className="px-4 h-16 flex items-center justify-between bg-white">
          {/* Left section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:hidden touch-friendly"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link 
              href="/" 
              className="flex items-center gap-3"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Image src="/logo.svg" alt="logo" width={40} height={40} priority />
              <h2 className="font-bold text-2xl text-primary">Kidso Story</h2>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            {MenuList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-xl text-primary font-medium hover:underline"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Button 
                color="primary" 
                className="touch-friendly"
                style={{
                  WebkitAppearance: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {isSignedIn ? "Dashboard" : "Get Started"}
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav 
            className="fixed left-0 right-0 bottom-0 bg-white border-t overflow-y-auto ios-scroll"
            style={{ 
              top: `calc(env(safe-area-inset-top) + 4rem)`,
              height: `calc(100vh - env(safe-area-inset-top) - 4rem)`,
            }}
          >
            {MenuList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="block px-4 py-3 text-lg text-primary hover:bg-gray-50 touch-friendly"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Content spacer */}
      <div style={{ height: `calc(env(safe-area-inset-top) + 4rem)` }} />
    </>
  )
}
