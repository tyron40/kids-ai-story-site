import { Button } from "@nextui-org/button"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="px-4 sm:px-8 md:px-28 lg:px-44 mt-20 min-h-[calc(100vh-5rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1 flex flex-col">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-extrabold py-4">
            Turn Your Child&apos;s Imagination into Magical Stories Instantly
          </h2>
          <p className="text-base sm:text-lg text-primary font-light mb-6">
            Design unique and exciting tales that turn your child into the hero of their own story 
            inspiring creativity and a love for reading in just a few clicks!
          </p>
          {/* Wrap button in a div to ensure proper width control */}
          <div className="w-full sm:w-auto">
            <Link 
              href="/create-story"
              className="block w-full sm:inline-block sm:w-auto"
            >
              <Button
                size="lg"
                color="primary"
                className="w-full sm:w-auto px-6 py-3 text-base font-bold touch-friendly"
              >
                Create Story
              </Button>
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image 
            src="/hero.png" 
            alt="hero" 
            width={700} 
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
