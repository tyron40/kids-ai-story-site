"use client"

import { type LinkProps } from "next/link"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import "@/app/styles/mobile.css"

interface InternalLinkProps extends LinkProps {
  text: string
  className?: string
}

const LinkButton = ({ text, className, ...props }: InternalLinkProps) => {
  return (
    <Link
      {...props}
      className={twMerge(
        // Base styles
        "text-white bg-primary font-medium rounded-xl text-sm",
        // Size and spacing
        "px-6 py-3",
        // Focus states
        "focus:ring-4 focus:ring-blue-300 focus:outline-none",
        // Mobile optimizations
        "touch-friendly ios-button no-tap-highlight no-select touch-feedback ios-text",
        // Center content
        "flex items-center justify-center",
        // Custom classes
        className
      )}
      role="button"
      aria-label={text}
    >
      <span className="ios-text">{text}</span>
    </Link>
  )
}

export default LinkButton
