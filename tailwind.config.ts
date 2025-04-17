import { nextui } from "@nextui-org/react"
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontSize: {
        'responsive-xs': 'clamp(0.75rem, 2vw, 1rem)',
        'responsive-sm': 'clamp(1rem, 2.5vw, 1.25rem)',
        'responsive-base': 'clamp(1.25rem, 3vw, 1.5rem)',
        'responsive-lg': 'clamp(1.5rem, 4vw, 2rem)',
        'responsive-xl': 'clamp(2rem, 5vw, 3rem)',
        'responsive-2xl': 'clamp(2.5rem, 6vw, 4rem)',
        'responsive-3xl': 'clamp(3rem, 7vw, 5rem)',
      },
      spacing: {
        'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-md': 'clamp(1rem, 4vw, 2rem)',
        'responsive-lg': 'clamp(1.5rem, 6vw, 3rem)',
        'responsive-xl': 'clamp(2rem, 8vw, 4rem)',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
          colors: {
            primary: {
              DEFAULT: "#3399ff",
            },
          },
        },
        dark: {
          // ...
          colors: {},
        },
        // ... custom themes
      },
    }),
  ],
}

export default config
