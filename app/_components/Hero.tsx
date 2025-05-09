"use client"
import { Button } from "@nextui-org/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter()

  const handleCreateStory = () => {
    router.push("/create-story")
  }

  return (
    <div className="mobile-container ios-safe-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
        <div className="order-2 md:order-1 flex flex-col mobile-padding">
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-primary font-extrabold py-4 mobile-full-width">
            Turn Your Child&apos;s Imagination into Magical Stories Instantly
          </h2>
          <p className="text-base sm:text-lg text-primary font-light mb-6 mobile-full-width">
            Design unique and exciting tales that turn your child into the hero of their own story 
            inspiring creativity and a love for reading in just a few clicks!
          </p>
          
          <div className="w-full sm:w-auto no-touch-callout">
            <Button
              size="lg"
              color="primary"
              onPress={handleCreateStory}
              className="mobile-button touch-friendly no-tap-highlight touch-feedback"
            >
              Create Story
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2 mobile-padding">
          <div className="relative w-full aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9]">
            <Image 
              src="/hero.png" 
              alt="hero" 
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 700px"
              className="mobile-image object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
