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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = !isMenuOpen ? 'hidden' : ''
  }

  return (
    <>
      <div className="ios-status-bar" />
      
      <header className="ios-header">
        <div className="px-4 h-16 flex items-center justify-between bg-white">
          {/* Left section */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMenu}
              className={`p-2 sm:hidden touch-friendly no-tap-highlight touch-feedback ${
                isMenuOpen ? 'rotate-180' : ''
              } transition-transform duration-200`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link 
              href="/" 
              className="flex items-center gap-3 no-tap-highlight touch-feedback"
            >
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.svg" 
                  alt="logo" 
                  fill
                  sizes="40px"
                  className="mobile-image"
                  priority 
                />
              </div>
              <h2 className="font-bold text-2xl text-primary">Kidso Story</h2>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            {MenuList.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-xl text-primary font-medium hover:underline no-tap-highlight touch-feedback"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="no-tap-highlight"
            >
              <Button 
                color="primary" 
                className="mobile-button touch-friendly touch-feedback"
              >
                {isSignedIn ? "Dashboard" : "Get Started"}
              </Button>
            </Link>
            <div className="touch-friendly">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 sm:hidden">
            <nav className="mobile-menu smooth-scroll">
              <div className="bg-white h-[calc(100vh-4rem)] pt-4">
                {MenuList.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-4 py-3 text-lg text-primary hover:bg-gray-50 touch-friendly no-tap-highlight touch-feedback"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="ios-content-spacer" />
    </>
  )
}
