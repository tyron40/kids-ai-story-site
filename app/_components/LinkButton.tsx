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
        "text-white bg-primary hover:opacity-90 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none",
        "flex items-center justify-center",
        "touch-friendly no-tap-highlight no-select touch-feedback",
        className
      )}
    >
      {text}
    </Link>
  )
}

export default LinkButton
