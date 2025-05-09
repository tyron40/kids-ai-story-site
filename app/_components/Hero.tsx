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
    <div 
      className="px-4 sm:px-8 md:px-28 lg:px-44 min-h-[calc(100vh-env(safe-area-inset-top)-4rem)]"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
        <div className="order-2 md:order-1 flex flex-col">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-extrabold py-4">
            Turn Your Child&apos;s Imagination into Magical Stories Instantly
          </h2>
          <p className="text-base sm:text-lg text-primary font-light mb-6">
            Design unique and exciting tales that turn your child into the hero of their own story 
            inspiring creativity and a love for reading in just a few clicks!
          </p>
          
          {/* Create Story Button with enhanced mobile handling */}
          <div 
            className="w-full sm:w-auto" 
            style={{ 
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            <Button
              size="lg"
              color="primary"
              onPress={handleCreateStory}
              className="w-full sm:w-auto px-6 py-3 text-base font-bold touch-friendly"
              style={{
                WebkitAppearance: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                cursor: 'pointer',
                minHeight: '44px',
                marginBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              Create Story
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image 
            src="/hero.png" 
            alt="hero" 
            width={700} 
            height={400}
            className="w-full h-auto object-contain select-none"
            priority
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}
