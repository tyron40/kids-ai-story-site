"use client"
import { useState } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar"
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
    <Navbar 
      maxWidth="full" 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white navbar-mobile" // Added navbar-mobile class
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden touch-friendly no-tap-highlight" // Added touch-friendly and no-tap-highlight
        />
        <NavbarBrand>
          <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          <h2 className="font-bold text-2xl text-primary ml-3">Kidso Story</h2>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex">
        {MenuList.map((item) => (
          <NavbarItem
            key={item.path}
            className="text-xl text-primary font-medium hover:underline mx-2"
          >
            <Link href={item.path}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <Link href={"/dashboard"}>
          <Button 
            color="primary"
            className="touch-friendly no-tap-highlight" // Added touch-friendly and no-tap-highlight
          >
            {isSignedIn ? "Dashboard" : "Get Started"}
          </Button>
        </Link>
        <UserButton />
      </NavbarContent>
      <NavbarMenu className="bg-white navbar-menu-mobile"> {/* Added navbar-menu-mobile class */}
        {MenuList.map((item) => (
          <NavbarMenuItem 
            key={item.path}
            className="touch-spacing" // Added touch-spacing for better tap targets
          >
            <Link 
              href={item.path} 
              className="w-full text-primary touch-friendly no-tap-highlight" // Added touch-friendly and no-tap-highlight
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
