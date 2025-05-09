"use client"
import { useState } from "react"
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      {/* Main header content */}
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left section with menu button and logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 sm:hidden touch-friendly"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
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
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button color="primary" className="touch-friendly">
              {isSignedIn ? "Dashboard" : "Get Started"}
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="sm:hidden bg-white border-t">
          {MenuList.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block px-4 py-3 text-lg text-primary hover:bg-gray-50 touch-friendly"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
